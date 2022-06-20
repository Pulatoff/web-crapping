const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  newImg: {
    type: String,
    required: true,
    title: {
      type: String,
      required: true,
    },
    newsUrl: {
      type: String,
      required: true,
    },
    newsParagraph: [String],
  },
});

module.exports = mongoose.model("uzbekisnon", schema);
