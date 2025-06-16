const { faker } = require("@faker-js/faker");

exports.seed = async function (knex) {
  const users = await knex("users").where("u_role", "student");
  const classrooms = await knex("classrooms");

  await knex("members").del();

  const members = [];
  for (let i = 0; i < 100; i++) {
    members.push({
      uid: faker.helpers.arrayElement(users).uid,
      cid: faker.helpers.arrayElement(classrooms).cid,
      m_status: true,
      m_joined_at: faker.date.past(),
    });
  }

  await knex("members").insert(members);
};
