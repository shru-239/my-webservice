const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNo: { type: String, required: true },
  email: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }
  },
  loginId: { type: String, required: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(v);
      },
      message: 'Password must be at least 6 characters, include 1 uppercase letter, 1 lowercase letter, and 1 special character.'
    }
  }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
