const { faker } = require("@faker-js/faker");

function createUser() {
  return {
    u_email: faker.internet.email(),
    u_first_name: faker.person.firstName(),
    u_last_name: faker.person.lastName(),
    u_password: faker.internet.password(12),
    u_role: faker.helpers.arrayElement(["student", "teacher", "admin"]),
    u_status: true,
  };
}

exports.seed = async function (knex) {
  await knex("users").del();
  await knex("users").insert(Array(100).fill().map(createUser));
};
