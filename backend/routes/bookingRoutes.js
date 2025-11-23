const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');

// -------------------- VALIDATION SCHEMA --------------------
const bookingSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(20).required(),
  eventType: Joi.string().min(2).max(100).required(),
  eventDate: Joi.date().iso().required(),
  location: Joi.string().allow('', null),
  guestCount: Joi.number().integer().min(1).allow(null),
  budget: Joi.number().min(0).allow(null),
  message: Joi.string().max(1000).allow('', null),
});

// -------------------- CREATE BOOKING --------------------
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { error, value } = bookingSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true, // remove unexpected fields
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const booking = await Booking.create(value);

    return res.status(201).json({
      success: true,
      message: 'Booking submitted successfully',
      data: booking,
    });
  })
);

// -------------------- GET ALL BOOKINGS --------------------
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  })
);

module.exports = router;
