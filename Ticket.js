const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  eventName: String,
  userName: String,
  email: String,
  ticketId: String,
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);
