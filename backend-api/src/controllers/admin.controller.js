const adminService = require("../services/admin.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

async function overview(req, res, next) {
  try {
    const stats = await adminService.getStatistics();
    return res.json(JSend.success({stats}));
  }catch (err) {
    console.log(err);
    return next(new ApiError(500, 'Internal Server Error'));
  }
}

async function getAllUsers(req, res, next) {
  try{
    const {limit = 10, page = 1 } = req.query;
    const users = await adminService.getAllUsers(limit, page);
    return res.json(JSend.success({users}));
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, 'Internal Server Error'))
  }
}

async function toggleUserStatus(req, res, next) {
  try {
    const { uid } = req.params;
    const { u_status } = req.body;

    const updatedUser = await adminService.toggleUserStatus(uid, u_status);
    if(!updatedUser) {
      return next(new ApiError(404, 'User Not Found'));
    }
    return res.json(JSend.success());
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, 'Internal Server Error'));
  }
}

async function getAllClassrooms(req, res, next) {
  try{
    const {limit = 10, page = 1 } = req.query;
    const users = await adminService.getAllClassrooms(limit, page);
    return res.json(JSend.success({users}));
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, 'Internal Server Error'))
  }
}

async function toggleClassroomStatus(req, res, next) {
  try {
    const { cid } = req.params;
    const { c_status } = req.body;

    const updatedClassroom = await adminService.toggleClassroomStatus(cid, c_status);
    if(!updatedClassroom) {
      return next(new ApiError(404, 'Classroom Not Found'));
    }
    return res.json(JSend.success());
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, 'Internal Server Error'));
  }
}
async function toggleAssignmentStatus(req, res, next) {
  try {
    const { aid } = req.params;
    const { a_status } = req.body;

    const updatedAssignment = await adminService.toggleAssignmentStatus(aid, a_status);
    if(!updatedAssignment) {
      return next(new ApiError(404, 'Assignment Not Found'));
    }
    return res.json(JSend.success());
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, 'Internal Server Error'));
  }
}



module.exports = {
  overview,
  getAllUsers,
  toggleUserStatus,
  getAllClassrooms,
  toggleClassroomStatus,
  toggleAssignmentStatus,
};
