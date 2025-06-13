const { methodNotAllowed } = require("../controllers/errors.controller");

function allowedMethods(methods = []) {
  const allowed = methods.map((m) => m.toUpperCase());

  return (req, res, next) => {
    if (!allowed.includes(req.method.toUpperCase())) {
      return methodNotAllowed(req, res, next, allowed);
    }
    next();
  };
}

module.exports = allowedMethods;
