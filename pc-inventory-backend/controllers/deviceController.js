const Device = require("../models/Device");
const History = require("../models/History");
const ping = require("ping");

let cache = {};
let lastCheck = 0;

exports.getDevices = async (req, res) => {
  try {
    const now = Date.now();

    // пингуем только раз в 10 секунд
    if (now - lastCheck > 10000) {
      const devices = await Device.find();

      const results = await Promise.all(
        devices.map(async (d) => {
          if (d.ip) {
            const result = await ping.promise.probe(d.ip, { timeout: 1 });
            return { id: d._id.toString(), isOnline: result.alive };
          }
          return { id: d._id.toString(), isOnline: false };
        })
      );

      cache = {};
      results.forEach((r) => {
        cache[r.id] = r.isOnline;
      });

      lastCheck = now;
    }

    const devices = await Device.find();

    devices.forEach((d) => {
      d._doc.isOnline = cache[d._id.toString()] || false;
    });

    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDevice = async (req, res) => {
  const device = new Device(req.body);
  await device.save();
  res.json(device);
};

exports.updateDevice = async (req, res) => {
  const oldDevice = await Device.findById(req.params.id);
  if (!oldDevice) {
    return res.status(404).json({ message: "Устройство не найдено" });
  }

  const updatedDevice = await Device.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  // логируем изменения
  for (let key in req.body) {
    if (oldDevice[key] !== req.body[key]) {
      await History.create({
        deviceId: req.params.id,
        action: "UPDATE",
        field: key,
        oldValue: oldDevice[key],
        newValue: req.body[key],
        changedBy: req.user.id
      });
    }
  }

  res.json(updatedDevice);
};

exports.deleteDevice = async (req, res) => {
  await Device.findByIdAndDelete(req.params.id);
  res.json({ message: "Удалено" });
};