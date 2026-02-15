const express = require("express");
const router = express.Router();
const Ticket = require("./Ticket");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

// Create Ticket
router.post("/create", async (req, res) => {
  try {
    const { eventName, userName, email } = req.body;

    const ticketId = uuidv4();

    const ticket = await Ticket.create({
      eventName,
      userName,
      email,
      ticketId
    });

    const token = jwt.sign(
      { ticketId: ticket.ticketId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const qrImage = await QRCode.toDataURL(token);

    res.json({ qrImage });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate Ticket
router.post("/validate", async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const ticket = await Ticket.findOne({ ticketId: decoded.ticketId });

    if (!ticket)
      return res.status(404).json({ message: "Invalid Ticket" });

    if (ticket.used)
      return res.status(400).json({ message: "Already Used" });

    ticket.used = true;
    await ticket.save();

    res.json({ message: "Entry Allowed" });

  } catch (err) {
    res.status(400).json({ message: "Invalid or Expired QR" });
  }
});

// Admin View
router.get("/all", async (req, res) => {
  const tickets = await Ticket.find();
  res.json(tickets);
});

module.exports = router;
