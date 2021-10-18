const ObjectID = require('mongodb').ObjectID

module.exports.validateId = (id) => {

  if (!ObjectID.isValid(id)) {
    const errors = new Error("invalid ID!!!");
    errors.code = 400;
    throw errors;
  }
};

