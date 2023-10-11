const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    //maybe change this later to the longer way i hashed it like in my rest api proj
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      status: 'User created successfully',
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'incorrect password or email',
      });
    }
    // checking that the password is correct
    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      res.status(200).json({
        status: 'signup successfully',
      });
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'incorrect password or email',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: 'fail',
    });
  }
};
