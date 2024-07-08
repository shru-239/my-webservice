const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z]+$/.test(v);
      },
      message: 'First name must contain only letters'
    }
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z]+$/.test(v);
      },
      message: 'Last name must contain only letters'
    }
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
    street: {
      type: String,
      required: true,
      minlength: 4, // Adjusted minimum length to 4
      maxlength: 100,
      validate: {
        validator: function(v) {
          return /^[a-zA-Z\s]+$/.test(v);
        },
        message: 'Street must contain only alphabets and spaces'
      }
    },
    city: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      validate: {
        validator: function(v) {
          return /^[a-zA-Z\s]+$/.test(v);
        },
        message: 'City must contain only alphabets and spaces'
      }
    },
    state: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      validate: {
        validator: function(v) {
          return /^[a-zA-Z\s]+$/.test(v);
        },
        message: 'State must contain only alphabets and spaces'
      }
    },
    country: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      validate: {
        validator: function(v) {
          return /^[a-zA-Z\s]+$/.test(v);
        },
        message: 'Country must contain only alphabets and spaces'
      }
    }
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
