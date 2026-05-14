console.log("ROUTE LOADED");

const express = require("express");
const router = express.Router();

const Device = require("../models/Device");

router.post("/update", async (req, res) => {
  console.log("HIT");
  console.log("Пришло:", req.body);

  const { ip, cpu, ram, disk, network } = req.body;

  console.log("Ищу IP:", ip);

  const device = await Device.findOne({ ip });

  console.log("Найдено:", device);

  if (!device) {
    return res.status(404).json({ message: "Устройство не найдено" });
  }

  device.monitoring = {
    cpu,
    ram,
    disk,
    network,
    lastUpdate: new Date()
  };

  await device.save();

  console.log("СОХРАНЕНО");

  res.json({ message: "ok" });
});

module.exports = router;