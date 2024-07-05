const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  mobileNo: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Mobile number must be 10 digits'
    }
  },
  emailId: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String
  },
  loginId: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 8,
    match: /^[a-zA-Z0-9]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(v);
      },
      message: 'Password must have 1 uppercase, 1 lowercase, and 1 special character'
    }
  },
  creationTime: { 
    type: Date, 
    default: Date.now 
  },
  lastUpdatedOn: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('users', userSchema);