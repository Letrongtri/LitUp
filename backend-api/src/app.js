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

// error controller
const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json(JSend.success());
});

app.use("/public", express.static("public"));

adminRouter.setup(app);
assignmentsRouter.setup(app);
authRouter.setup(app);
classroomsRouter.setup(app);
submissionsRouter.setup(app);
usersRouter.setup(app);

// Handle 404 error for unknow URL paths
app.use(resourceNotFound);
// Define the centralized error handling middleware, after all routes
// and middleware have been defined
app.use(handleError);

module.exports = app;
