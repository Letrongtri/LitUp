const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const apiLimiter = require("./middlewares/rateLimiter.middleware");

// standardize json responses
const JSend = require("./jsend");

// routes
const adminRouter = require("./routes/admin.router");
const studentAssignmentsRouter = require("./routes/student.assignments.router");
const teacherAssignmentsRouter = require("./routes/teacher.assignments.router");
const authRouter = require("./routes/auth.router");
const studentClassroomsRouter = require("./routes/student.classrooms.router");
const teacherClassroomsRouter = require("./routes/teacher.classrooms.router");
const studentSubmissionsRouter = require("./routes/student.submissions.router");
const teacherSubmissionsRouter = require("./routes/teacher.submissions.router");
const usersRouter = require("./routes/users.router");

// error controller
const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");

// swagger ui - openAPI
const swaggerDocument = require("../docs/openapiSpec.json");

// authorization
const authenticateToken = require("./middlewares/auth.middleware");

// cleanup upload error
const cleanupUploadOnError = require("./middlewares/cleanupUploadError.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limiter
app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  return res.json(JSend.success());
});

// public routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));

authRouter.setup(app);

// route need authenticate
app.use(authenticateToken);

adminRouter.setup(app);
studentAssignmentsRouter.setup(app);
teacherAssignmentsRouter.setup(app);
studentClassroomsRouter.setup(app);
teacherClassroomsRouter.setup(app);
studentSubmissionsRouter.setup(app);
teacherSubmissionsRouter.setup(app);
usersRouter.setup(app);

// Handle 404 error for unknow URL paths
app.use(resourceNotFound);

app.use(cleanupUploadOnError);
// Define the centralized error handling middleware, after all routes
// and middleware have been defined
app.use(handleError);

module.exports = app;
