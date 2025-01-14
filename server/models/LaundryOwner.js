const mongoose = require('mongoose');

const validateContact = (contact) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    return emailRegex.test(contact) || phoneRegex.test(contact);
  };
  
  const LaundryOwnerSchema = new mongoose.Schema({
    laundryDetails: {
        name: { type: String, required: true },
        description: { type: String, required: true },
      },
      ownerDetails: {
        fullname: { type: String, required: true },
        contact: {
          type: String,
          required: true,
          validate: [validateContact, 'Please enter a valid email or phone number'],
        },
      },
      shopLocation: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
        address1: { type: String, required: true },
        address2: { type: String },
        nearbyLandmark: { type: String },
        pincode: { type: String, required: true },
      },
      images: {
        type: [String], // Array of image URLs
        validate: [arrayLimit, '{PATH} must have at least 5 images'],
      },
      facilities: { type: [String], required: true }, // Array of facilities
      timings: { type: String, required: true }, // Timings of the laundry open
      aadharCardInfo: {
        type: Object, // Aadhar card info accessed through digilocker
        required: true,
      },
      bankDetails: {
        accountNumber: { type: String, required: true },
        ifscCode: { type: String, required: true },
        accountType: { type: String, required: true },
      },
  });

  function arrayLimit(val) {
    return val.length >= 5;
  }

  module.exports = mongoose.model('LaundryOwner', LaundryOwnerSchema);