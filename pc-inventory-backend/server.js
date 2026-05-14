const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/monitoring", require("./routes/monitoringRoutes"));
app.use("/api/devices", require("./routes/deviceRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/history", require("./routes/historyRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
app.use("/api/history", require("./routes/historyRoutes"));