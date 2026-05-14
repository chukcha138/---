const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  deviceId: String,
  action: String,
  field: String,
  oldValue: String,
  newValue: String,
  changedBy: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("History", historySchema);