const mongoose = require("mongoose");
const Joi = require("joi");

const { Schema } = mongoose;

const { user } = require("./mixin");

const feedSchema = new Schema({
  name: String,
  uid: String,
  description: String,
  owner: user,
  _element: { type: String, required: true },
  data: Object,
  createdOn: {
    type: Date,
    default: Date.now
  },
  readUsers: { type: [user] },
  writeUsers: { type: [user] }
});

function validate(feed) {
  const schema = {
    name: Joi.string().max(100),
    description: Joi.string().max(500),
    _element: Joi.string().required(),
    readUsers: Joi.array()
      .items(Joi.object().keys(getUserValidSchema("read")))
      .min(1),
    writeUsers: Joi.array()
      .items(Joi.object().keys(getUserValidSchema("write")))
      .min(1),
    data: Joi.object()
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

module.exports.Feed = mongoose.model("Feed", feedSchema);
module.exports.validate = validate;
module.exports.getUserValidSchema = getUserValidSchema;
