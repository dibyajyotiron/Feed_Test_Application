switch (process.env.NODE_ENV) {
  case "production":
    module.exports = require("./prod");
    break;
  case "testing":
    module.exports = require("./test");
    break;
  default:
    module.exports = require("./dev");
    break;
}
// if (process.env.NODE_ENV === "development") {
// } else if (process.env.NODE_ENV === "testing") {
//   module.exports = require("./test");
// } else {
//   module.exports = require("./prod");
// }
