const mongoose = require('mongoose');
const { Schema } = mongoose;

const validateContact = (contact) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  return emailRegex.test(contact) || phoneRegex.test(contact);
};

const arrayLimit = (val) => {
  return val.length >= 5;
};

const LaundryOwnerSchema = new Schema({
  laundryDetails: {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  ownerDetails: {
    fullname: { type: String, required: true },
    email: { type: String, required: true, validate: [validateContact, 'Please enter a valid email'] },
    phone: { type: String, required: true, validate: [validateContact, 'Please enter a valid phone number'] },
  },
  shopLocation: {
    lat: { type: Number, required: false },
    lon: { type: Number, required: false },
    address1: { type: String, required: true },
    address2: { type: String },
    nearbyLandmark: { type: String },
    pincode: { type: String, required: true },
  },
  images: {
    type: [String], // Array of image URLs
    required: true,
  },
  facilities: { type: [String], required: true }, // Array of facilities
  timings: { type: String, required: true }, // Timings of the laundry open
  aadharCardInfo: {
    type: Object, // Aadhar card info accessed through digilocker
    required: false,
  },
  bankDetails: {
    accountNumber: { type: String },
    ifscCode: { type: String },
    accountType: { type: String },
    upiAddress: { type: String },
    validationType: { type: String, required: true },
  },
  bankValidationData: {
    type: Object, // Data returned after bank account validation
  },
});

module.exports = mongoose.model('LaundryOwner', LaundryOwnerSchema);