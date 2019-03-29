const morgan = require("morgan");
function compile(format) {
  if (typeof format !== "string") {
    throw new TypeError("argument format must be a string");
  }

  var fmt = String(JSON.stringify(format));
  var js =
    '  "use strict"\n  return ' +
    fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function(_, name, arg) {
      var tokenArguments = "req, res";
      var tokenFunction = "tokens[" + String(JSON.stringify(name)) + "]";

      if (arg !== undefined) {
        tokenArguments += ", " + String(JSON.stringify(arg));
      }

      return '" +\n    (' + tokenFunction + "(" + tokenArguments + ') || "-") + "';
    });

  return new Function("tokens, req, res", js);
}
morgan.format("customFormat", function developmentFormatLine(tokens, req, res) {
  // get the status code if response written
  var status = res.statusCode ? res.statusCode : undefined;

  // get status color
  var color =
    status >= 500
      ? 31 // red
      : status >= 400
      ? 33 // yellow
      : status >= 300
      ? 36 // cyan
      : status >= 200
      ? 32 // green
      : 0; // no color

  // get colored function
  var fn = developmentFormatLine[color];

  if (!fn) {
    // compile
    fn = developmentFormatLine[color] = compile(
      "\x1b[0m:method :url \x1b[" + color + "m:status\x1b[0m" + " :response-time ms".yellow + " - :user-agent\x1b[0m ".cyan + "Date: ".magenta + ":date[web]"
    );
  }

  return fn(tokens, req, res);
});
module.exports = app => {
  //   app.use(morgan(":method".green + " :url ".yellow + ":status" + " Agent:" + " ':user-agent'".blue + " Date: ':date[web]'"));
  app.use(morgan("customFormat"));
};
