require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const ticketRoutes = require("./ticketRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/tickets", ticketRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Railway dynamic port binding
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
