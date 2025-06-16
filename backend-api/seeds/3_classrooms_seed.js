const { faker } = require("@faker-js/faker");

function createClassroom(teacherId) {
  return {
    uid: teacherId,
    c_name: faker.company.name(),
    c_code: faker.string.alphanumeric({ length: 6 }).toUpperCase(),
    c_status: true,
  };
}

exports.seed = async function (knex) {
  const teachers = await knex("users").where("u_role", "teacher");
  await knex("classrooms").del();
  await knex("classrooms").insert(
    Array(20)
      .fill()
      .map(() =>
        createClassroom(faker.helpers.arrayElement(teachers)?.uid ?? null)
      )
  );
};
