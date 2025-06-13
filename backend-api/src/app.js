const express = require("express");
const cors = require("cors");

// standardize json responses
const JSend = require("./jsend");

// routes
const adminRouter = require("./routes/admin.router");
const assignmentsRouter = require("./routes/assignments.router");
const authRouter = require("./routes/auth.router");
const classroomsRouter = require("./routes/classrooms.router");
const submissionsRouter = require("./routes/submissions.router");
const usersRouter = require("./routes/users.router");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json(JSend.success());
});

adminRouter.setup(app);
assignmentsRouter.setup(app);
authRouter.setup(app);
classroomsRouter.setup(app);
submissionsRouter.setup(app);
usersRouter.setup(app);

module.exports = app;
