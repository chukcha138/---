const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: String,
  type: String,
  inventoryNumber: String,
  room: String,
  responsible: String,
  status: {
    type: String,
    enum: ["active", "repair", "retired"],
    default: "active"
  },
  lastCheckDate: Date,
  ip: String,

  monitoring: {
    cpu: Number,
    ram: Number,
    disk: Number,
    network: Number,
    isOnline: Boolean,
    lastUpdate: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("Device", deviceSchema);