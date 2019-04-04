const mongoose = require("mongoose");
const Joi = require("joi");

const { Schema } = mongoose;

const { user } = require("./mixin");

const feedSchema = new Schema(
  {
    name: String,
    uid: String,
    description: String,
    owner: user,
    _element: { type: String, required: true },
    _appUid: { type: String, required: true },
    data: [Object],
    readUsers: { type: [user] },
    writeUsers: { type: [user] },
    labelsRead: [String],
    labelsWrite: [String],
    properties: Object
  },
  { timestamps: true }
);

function validate(feed) {
  const schema = {
    name: Joi.string().max(100),
    description: Joi.string().max(500),
    _appUid: Joi.string().required(),
    _element: Joi.string().required(),
    readUsers: getReadWriteValidSchema("read"),
    writeUsers: getReadWriteValidSchema("write"),
    data: Joi.array().items(Joi.object()),
    labelsRead: Joi.array().items(Joi.string()),
    labelsWrite: Joi.array().items(Joi.string()),
    properties: Joi.object()
  };
  return Joi.validate(feed, schema);
}

function getUserValidSchema(perm) {
  return {
    uid: Joi.string()
      .required()
      .error(new Error(`${perm} user uid of type 'String' is required!`)),
    email: Joi.string()
      .email()
      .required()
      .error(new Error(`${perm} user email of type 'email' is required!`))
  };
}
function getReadWriteValidSchema(perm) {
  return perm === "read"
    ? Joi.array()
        .items(Joi.object().keys(getUserValidSchema("read")))
        .min(1)
    : Joi.array()
        .items(Joi.object().keys(getUserValidSchema("write")))
        .min(1);
}

feedSchema.pre("save", function(next) {
  if (!this.writeUsers.some(user => user.uid === this.owner.uid)) {
    this.writeUsers.push({ uid: this.owner.uid, email: this.owner.email });
  }
  return next();
});

module.exports.Feed = mongoose.model("Feed", feedSchema);
module.exports.validate = validate;
module.exports.getUserValidSchema = getUserValidSchema;
module.exports.getReadWriteValidSchema = getReadWriteValidSchema;
