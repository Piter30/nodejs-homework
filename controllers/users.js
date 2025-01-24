const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const gravatar = require("gravatar");
const { Jimp } = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

const usersController = {
  async signup(req, res, next) {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "Email in use" });
      }

      const avatarURL = gravatar.url(email, {
        s: "250",
        r: "pg",
        d: "identicon",
      });

      const hashedPassword = await bcrypt.hash(password, 8);
      const user = new User({
        email,
        password: hashedPassword,
        avatarURL,
      });
      await user.save();

      res.status(201).json({
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
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
          avatarURL: user.avatarURL,
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
      avatarURL: req.user.avatarURL,
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
        avatarURL: user.avatarURL,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateAvatar(req, res, next) {
    try {
      const { path: tmpPath, originalname } = req.file;
      const { _id } = req.user;

      const fileName = `${_id}_${uuidv4()}${path.extname(originalname)}`;
      const avatarsDir = path.join(__dirname, "..", "public", "avatars");
      const publicPath = path.join(avatarsDir, fileName);

      await fs.mkdir(avatarsDir, { recursive: true });

      try {
        const image = await Jimp.read(tmpPath);
        await image.resize({
          w: 250,
          h: 250,
        });
        await image.write(publicPath);

        await fs.unlink(tmpPath);

        const avatarURL = `/avatars/${fileName}`;
        await User.findByIdAndUpdate(_id, { avatarURL });

        res.json({
          avatarURL,
          message: "Avatar updated successfully",
        });
      } catch (error) {
        await fs.unlink(tmpPath).catch(console.error);
        throw error;
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = usersController;
