const Element = require("./element");

module.exports = {
  targetElementToElementPlugin(schema) {
    schema.pre("save", async function(next, req) {
      const { targetElementType, targetElementStage } = req.body;

      let element;
      let newElement;

      if (!this._element) {
        element = new Element({
          type: targetElementType
        });
        newElement = await element.save();
        req.newElement = newElement;
        return next();
      }
      return;
    });
  }
};
