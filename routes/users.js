const express = require('express');
const User = require('../models/user');
const router = express.Router();

// POST to create a new user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    user.creationTime = new Date();
    user.lastUpdatedOn = new Date();
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET to retrieve user info by email
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET to retrieve all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
