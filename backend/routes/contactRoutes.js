const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');

// -------------------- VALIDATION SCHEMA --------------------
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).max(20).allow('', null),
  subject: Joi.string().min(2).max(200).required(),
  message: Joi.string().min(5).max(2000).required(),
});

// -------------------- SUBMIT CONTACT FORM --------------------
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { error, value } = contactSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const contact = await Contact.create(value);

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contact,
    });
  })
);

module.exports = router;
