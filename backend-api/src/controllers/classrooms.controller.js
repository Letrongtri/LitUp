function createClassroom(req, res) {
  return res.status(201).json({ classroom: {} });
}

function getClassroomsByFilter(req, res) {
  //   const filters = [];
  //   const { favorite, name } = req.query;

  //   if (favorite !== undefined) {
  //     filters.push(`favorite=${favorite}`);
  //   }
  //   if (name) {
  //     filters.push(`name=${name}`);
  //   }

  //   console.log(filters.join("&"));

  return res.json({ classrooms: [] });
}

function getClassroom(req, res) {
  return res.json({ classroom: {} });
}

function updateClassroom(req, res) {
  return res.json({ classroom: {} });
}

function deleteClassroom(req, res) {
  return res.json({
    message: "Classroom deleted",
  });
}

function joinClassroom(req, res) {
  return res.status(201).json({ message: "Joined successfully" });
}

function getMembersInClass(req, res) {
  return res.json({ users: [] });
}

module.exports = {
  createClassroom,
  getClassroomsByFilter,
  getClassroom,
  updateClassroom,
  deleteClassroom,
  joinClassroom,
  getMembersInClass,
};
