const classroomsService = require("../services/classrooms.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

async function createClassroom(req, res, next) {
  try {
    const classroomData = {
      ...req.body,
    };

    const classroom = await classroomsService.createClassroom(classroomData);

    if (classroom.code && classroom.message) {
      return next(new ApiError(classroom.code, classroom.message));
    }

    return res
      .status(201)
      .set({
        Locarion: `${req.baseUrl}/${classroom.cid}}`,
      })
      .json(
        JSend.success({
          classroom,
        })
      );
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function getJoinedClassrooms(req, res, next) {
  try {
    const { uid, limit = 10, page = 1 } = req.query;

    if (!uid) {
      return next(new ApiError(400, "uid is required"));
    }

    const classrooms = await classroomsService.getClassroomsByUser(
      uid,
      limit,
      page
    );
    return res.json(JSend.success({ classrooms }));
  } catch (err) {
    console.log("getClassrooms error:", err);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function getClassroom(req, res, next) {
  const { cid } = req.params;

  try {
    const classroom = await classroomsService.getClassroomById(cid);
    if (!classroom) {
      return next(new ApiError(404, "Classroom not found"));
    }

    return res.json(JSend.success({ classroom }));
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function updateClassroom(req, res, next) {
  const { cid } = req.params;

  try {
    const updateData = {
      ...req.body,
    };

    const updated = await classroomsService.updateClassroom(cid, updateData);
    if (!updated) {
      return next(new ApiError(404, "Classroom not found"));
    }

    if (updated.code && updated.message) {
      return next(new ApiError(updated.code, updated.message));
    }

    return res.json(
      JSend.success({
        classroom: updated,
      })
    );
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function deleteClassroom(req, res, next) {
  const { cid } = req.params;
  try {
    const deleted = await classroomsService.deleteClassroom(cid);
    if (!deleted) {
      return next(new ApiError(404, "Classroom not found"));
    }

    if (deleted.code && deleted.message) {
      return next(new ApiError(deleted.code, deleted.message));
    }

    return res.json(JSend.success());
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function joinClassroom(req, res, next) {
  try {
    const { cid } = req.params;
    const { c_code, uid } = req.body;

    if (!c_code || !uid) {
      return next(new ApiError(400, "Missing code or id"));
    }

    const result = await classroomsService.joinClassroomByCode(
      cid,
      uid,
      c_code
    );
    if (!result) {
      return next(new ApiError(404, "Error to find classroom"));
    }

    if (result.message) {
      return next(new ApiError(400, result.message));
    }

    return res.status(201).json(JSend.success(result));
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function getMembersInClass(req, res, next) {
  try {
    const cid = Number(req.params.cid);

    if (!cid) {
      return next(new ApiError(400, "Missing or invalid classroom ID"));
    }

    const members = await classroomsService.getMemberByClassId(cid);

    return res.status(200).json(JSend.success({ users: members }));
  } catch (err) {
    console.error("getMembersInClass error:", err);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

module.exports = {
  createClassroom,
  getJoinedClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom,
  joinClassroom,
  getMembersInClass,
};
