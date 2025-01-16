const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const usersController = {
  async signup(req, res, next) {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "Email in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      const user = new User({ email, password: hashedPassword });
      await user.save();

      res.status(201).json({
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          message: "Email or password is wrong",
          detail: "User not found",
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          message: "Email or password is wrong",
          detail: "Invalid password",
        });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      user.token = token;
      await user.save();

      res.json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      req.user.token = null;
      await req.user.save();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async getCurrent(req, res) {
    res.json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  },

  async updateSubscription(req, res, next) {
    try {
      const { subscription } = req.body;
      const user = req.user;

      user.subscription = subscription;
      await user.save();

      res.json({
        email: user.email,
        subscription,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = usersController;
