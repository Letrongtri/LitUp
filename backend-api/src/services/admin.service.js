const knex = require("../database/knex");
const { getAttachments } = require("./attachments.service");
const Paginator = require("./paginator");

async function getStatistics() {
  const [
    { count: totalUsers },
    { count: activeUsers },
    { count: toatlClassrooms },
    { count: activeClassrooms },
    { count: totalAssignments },
    { count: totalSubmissions },
  ] = await Promise.all([
    knex("users").count("*").first(),
    knex("users").where({ u_status: true }).count("*").first(),
    knex("classrooms").count("*").first(),
    knex("classrooms").where({ c_status: true }).count("*").first(),
    knex("assignments").count("*").first(),
    knex("submissions").count("*").first(),
  ]);

  // Phân loại người dùng theo vai trò
  const usersByRoleRaw = await knex("users")
    .select("u_role")
    .count("* as count")
    .groupBy("u_role");

  const userRolesData = {
    labels: usersByRoleRaw.map((row) => row.u_role),
    datasets: [
      {
        data: usersByRoleRaw.map((row) => Number(row.count)),
      },
    ],
  };

  // Số bài nộp theo tháng
  const submissionsByMonthRaw = await knex("submissions")
    .select(
      knex.raw("TO_CHAR(s_submitted_at, 'MM')::int as month"),
      knex.raw("COUNT(*) as count")
    )
    .groupByRaw("TO_CHAR(s_submitted_at, 'MM')")
    .orderBy("month");

  const submissionsData = {
    labels: submissionsByMonthRaw.map((row) => `Month ${row.month}`),
    datasets: [
      {
        label: "Number of submissions",
        data: submissionsByMonthRaw.map((row) => Number(row.count)),
      },
    ],
  };

  // Xu hướng bài tập mới và lớp học mới theo tháng
  const [assignmentsByMonthRaw, classroomsByMonthRaw] = await Promise.all([
    knex("assignments")
      .select(
        knex.raw("TO_CHAR(a_created_at, 'MM')::int as month"),
        knex.raw("COUNT(*) as count")
      )
      .groupByRaw("TO_CHAR(a_created_at, 'MM')")
      .orderBy("month"),

    knex("classrooms")
      .select(
        knex.raw("TO_CHAR(c_created_at, 'MM')::int as month"),
        knex.raw("COUNT(*) as count")
      )
      .groupByRaw("TO_CHAR(c_created_at, 'MM')")
      .orderBy("month"),
  ]);

  // Lấy tất cả các tháng từng có dữ liệu
  const allMonths = [
    ...new Set([
      ...assignmentsByMonthRaw.map((r) => r.month),
      ...classroomsByMonthRaw.map((r) => r.month),
    ]),
  ].sort((a, b) => a - b); // sắp xếp tháng tăng dần

  const assignmentMap = Object.fromEntries(
    assignmentsByMonthRaw.map((r) => [r.month, r.count])
  );
  const classroomMap = Object.fromEntries(
    classroomsByMonthRaw.map((r) => [r.month, r.count])
  );

  const trendData = {
    labels: allMonths.map((m) => `Tháng ${m}`),
    datasets: [
      {
        label: "New assignments",
        data: allMonths.map((m) => Number(assignmentMap[m] || 0)),
      },
      {
        label: "New classrooms",
        data: allMonths.map((m) => Number(classroomMap[m] || 0)),
      },
    ],
  };

  return {
    totalUsers: Number(totalUsers),
    activeUsers: Number(activeUsers),
    totalClassrooms: Number(toatlClassrooms),
    activeClassrooms: Number(activeClassrooms),
    totalAssignments: Number(totalAssignments),
    totalSubmissions: Number(totalSubmissions),
    userRolesData,
    submissionsData,
    trendData,
  };
}

async function getAllUsers(limit, page) {
  const paginator = new Paginator(page, limit);

  const results = await knex("users as u")
    .select(knex.raw("COUNT(uid) OVER() AS record_count"), "u.*")
    .orderBy("uid", "desc")
    .limit(limit)
    .offset((page - 1) * limit);

  const totalRecords = results[0]?.record_count ?? 0;

  const users = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  const DEFAULT_AVATAR = "/public/images/blank-profile-picture.png";

  for (const user of users) {
    const avatar = user.u_avatar_id
      ? await knex("attachments")
          .where("fid", user.u_avatar_id)
          .select("f_name")
          .first()
      : null;

    user.avatar_url = avatar
      ? `/uploads/${avatar.f_name}`
      : DEFAULT_AVATAR;
  }

  return {
    metadata: paginator.getMetadata(totalRecords),
    users,
  };
}

async function toggleUserStatus(uid, u_status) {
  const trx = await knex.transaction();

  try {
    const user = await knex("users").transacting(trx).where({ uid }).first();

    if (!user) return null;

    await knex("users")
      .transacting(trx)
      .where({ uid })
      .update({ u_status, u_updated_at: new Date() });

    await trx.commit();
    return { ...user, u_status };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function getAllClassrooms(limit, page) {
  const paginator = new Paginator(page, limit);

  const results = await knex("classrooms as c")
    .select(knex.raw("COUNT(cid) OVER() AS record_count"), "c.*")
    .orderBy("cid", "desc")
    .limit(limit)
    .offset((page - 1) * limit);

  const totalRecords = results[0]?.record_count ?? 0;

  const classrooms = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  for (const classroom of classrooms) {
    const member = await knex("members")
      .where("cid", classroom.cid)
      .select(knex.raw("COUNT(mid) OVER() AS member_count"))
      .first();

    classroom.member_count = member ? member.member_count : 0;

    const teacher = await knex("users")
      .where("uid", classroom.uid)
      .select(
        knex.raw("CONCAT(u_first_name, ' ', u_last_name) as teacher_name")
      )
      .first();

    classroom.teacher_name = teacher.teacher_name;
  }

  return {
    metadata: paginator.getMetadata(totalRecords),
    classrooms,
  };
}

async function toggleClassroomStatus(cid, c_status) {
  const trx = await knex.transaction();

  try {
    const classroom = await knex("classrooms")
      .transacting(trx)
      .where({ cid })
      .first();

    if (!classroom) return null;

    await knex("classrooms")
      .transacting(trx)
      .where({ cid })
      .update({ c_status, c_updated_at: new Date() });

    trx.commit();
    return { ...classroom, c_status };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function getAllAssignments(limit, page) {
  const paginator = new Paginator(page, limit);

  const results = await knex("assignments as a")
    .select(knex.raw("COUNT(aid) OVER() AS record_count"), "a.*")
    .orderBy("aid", "desc")
    .limit(limit)
    .offset((page - 1) * limit);

  const totalRecords = results[0]?.record_count ?? 0;

  const assignments = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  for (const assignment of assignments) {
    const fids = await knex("assignment_attachments")
      .where("aid", assignment.aid)
      .select("fid");

    if (fids) {
      const fidList = fids.map((f) => f.fid);
      assignment.attachments = await getAttachments(fidList);
    }
  }

  return {
    metadata: paginator.getMetadata(totalRecords),
    assignments,
  };
}

async function toggleAssignmentStatus(aid, a_status) {
  const trx = await knex.transaction();

  try {
    const assignment = await knex("assignments")
      .transacting(trx)
      .where({ aid })
      .first();

    if (!assignment) return null;

    await knex("assignments")
      .transacting(trx)
      .where({ aid })
      .update({ a_status, a_updated_at: new Date() });

    await trx.commit();
    return { ...assignment, a_status };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function getAllSubmissions(limit, page) {
  const paginator = new Paginator(page, limit);

  const results = await knex("submissions as s")
    .select(knex.raw("COUNT(sid) OVER() AS record_count"), "s.*")
    .orderBy("sid", "desc")
    .limit(limit)
    .offset((page - 1) * limit);

  const totalRecords = results[0]?.record_count ?? 0;

  const submissions = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  for (const submission of submissions) {
    const fids = await knex("submission_attachments")
      .where("sid", submission.sid)
      .select("fid");

    if (fids) {
      const fidList = fids.map((f) => f.fid);
      submission.attachments = await getAttachments(fidList);
    }
  }

  return {
    metadata: paginator.getMetadata(totalRecords),
    submissions,
  };
}

module.exports = {
  getStatistics,
  getAllUsers,
  toggleUserStatus,
  getAllClassrooms,
  toggleClassroomStatus,
  getAllAssignments,
  toggleAssignmentStatus,
  getAllSubmissions,
};
