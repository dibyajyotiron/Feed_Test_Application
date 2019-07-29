const Joi = require("joi");

const getUserValidSchema = perm => {
  return {
    uid: Joi.string()
      .required()
      .error(new Error(`${perm} user uid of type 'String' is required!`)),
    email: Joi.string()
      .email()
      .required()
      .error(new Error(`${perm} user email of type 'email' is required!`))
  };
};
const getReadWriteValidSchema = perm => {
  return Joi.array()
    .items(Joi.object().keys(getUserValidSchema(perm)))
    .min(1);
};

module.exports = {
  validateCommentSchema(comment) {
    const schema = {
      comment: Joi.string()
        .max(500)
        .required()
        .error(new Error(`Comment of type 'String' is required!`)),
      _parentCommentUid: Joi.string(),
      data: Joi.object()
    };
    return Joi.validate(comment, schema);
  },

  validateFeedSchema(feed, req) {
    const schema = {
      name: Joi.string().max(100),
      description: Joi.string().max(500),
      targetElementType:
        req.method === "POST"
          ? Joi.string()
              .required()
              .max(20)
          : Joi.forbidden().error(new Error("Target Element cannot be changed!")),
      targetElementUid: req.method === "POST" ? Joi.string().required() : Joi.forbidden().error(new Error("Target Element cannot be changed!")),
      targetElementStage:
        req.method === "POST"
          ? Joi.string()
              .valid("THERM", "EYE", "TERRA", "CORE", "TICKETS", "VAULT")
              .required()
              .error(new Error("Please provide valid stage name in UPPERCASE!"))
          : Joi.forbidden().error(new Error("Target Element cannot be changed!")),
      readUsers: getReadWriteValidSchema("read"),
      writeUsers: getReadWriteValidSchema("write"),
      data: Joi.array().items(Joi.object()),
      labelsRead: Joi.array().items(Joi.string()),
      labelsWrite: Joi.array().items(Joi.string()),
      properties: Joi.object()
    };
    return Joi.validate(feed, schema);
  },

  validateElementSchema(element) {
    const schema = {
      type: Joi.string().max(10),
      data: Joi.object()
    };
    return Joi.validate(element, schema);
  },
  getReadWriteValidSchema,
  getUserValidSchema
};
