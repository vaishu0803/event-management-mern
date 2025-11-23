const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true },
    phone:     { type: String, required: true, trim: true },

    eventType: { type: String, required: true },
    
    // Store as actual Date, not string
    eventDate: { type: Date, required: true },

    location:  { type: String, default: "" },

    // Numbers must be numbers, not strings
    guestCount: { type: Number, default: null },

    budget: { type: Number, default: null },

    message: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
