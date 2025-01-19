const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users");
const auth = require("../../middlewares/auth");
const {
  validateAuth,
  validateSubscription,
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

module.exports = router;
