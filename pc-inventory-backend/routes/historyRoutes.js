const express = require("express");
const router = express.Router();

const History = require("../models/History");

router.get("/:deviceId", async (req, res) => {
  const history = await History.find({ deviceId: req.params.deviceId });
  res.json(history);
});

module.exports = router;