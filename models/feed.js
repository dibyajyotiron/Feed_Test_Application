const mongoose = require("mongoose");
const uuid = require("uuid/v1");

const { Schema } = mongoose;

const { user } = require("./mixin");
const { targetElementToElementPlugin } = require("./plugins");

const feedSchema = new Schema(
  {
    name: String,
    uid: String,
    description: String,
    owner: user,
    _element: { type: Schema.Types.ObjectId, ref: "element" },
    targetElementType: String,
    targetElementUid: String,
    targetElementStage: {
      type: String,
      enum: ["Therm", "Eye", "Terra", "Core"]
    },
    data: [Object],
    readUsers: { type: [user] },
    writeUsers: { type: [user] },
    labelsRead: [String],
    labelsWrite: [String],
    properties: Object,
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
feedSchema.plugin(targetElementToElementPlugin);

feedSchema.pre("save", function(next, req) {
  if (!this.writeUsers.some(user => user.uid === this.owner.uid)) {
    this.writeUsers.push({ uid: this.owner.uid, email: this.owner.email });
    this.uid = this.uid ? this.uid : uuid();
    this._element = req.newElement ? req.newElement._id : this._element;
  }
  return next();
});

feedSchema.pre("find", function(next) {
  this.populate({
    path: "_element"
  });
  next();
});

module.exports.Feed = mongoose.model("Feed", feedSchema);
