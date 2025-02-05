const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users");
const auth = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");
const {
  validateAuth,
  validateSubscription,
  validateAvatar,
} = require("../../middlewares/validation");

router.post("/signup", validateAuth, usersController.signup);
router.post("/login", validateAuth, usersController.login);
router.get("/logout", auth, usersController.logout);
router.get("/current", auth, usersController.getCurrent);
router.patch(
  "/",
  auth,
  validateSubscription,
  usersController.updateSubscription
);

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  validateAvatar,
  usersController.updateAvatar
);

router.get("/verify/:verificationToken", usersController.verifyEmail);
router.post("/verify", usersController.resendVerificationEmail);

module.exports = router;
