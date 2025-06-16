const { faker } = require("@faker-js/faker");

function createAssignment(cid) {
  return {
    cid,
    a_title: faker.lorem.words(5),
    a_description: faker.lorem.sentences(2),
    a_max_points: faker.number.int({ min: 10, max: 100 }),
    a_deadline_at: faker.date.future(),
    a_allow_late_submission: faker.datatype.boolean(),
  };
}

exports.seed = async function (knex) {
  const classrooms = await knex("classrooms");
  await knex("assignments").del();
  await knex("assignments").insert(
    Array(30)
      .fill()
      .map(() => createAssignment(faker.helpers.arrayElement(classrooms).cid))
  );
};
