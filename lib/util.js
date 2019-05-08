const TextEncodingPolyfill = require("util");
if (typeof TextEncoder !== "function") {
  TextEncoder = TextEncodingPolyfill.TextEncoder;
  TextDecoder = TextEncodingPolyfill.TextDecoder;
}
