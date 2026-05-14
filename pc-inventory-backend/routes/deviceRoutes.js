const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice
} = require("../controllers/deviceController");

router.get("/", auth, getDevices);
router.post("/", auth, createDevice);
router.put("/:id", auth, updateDevice);
router.delete("/:id", auth, deleteDevice);

module.exports = router;