const express = require("express");
const router = express.Router();
const authController = require("../../controllers/user/authController")
const googleAuth = require("../../services/googleAuthService");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/checkEmail", authController.checkEmail); 
router.post("/checkUserName", authController.checkUserName);

router.get("/getMe", authController.getMe)

router.get("/google", googleAuth.authenticateGoogle());
router.get("/google/callback", googleAuth.authenticateGoogle(), async (req, res, next) => {
    await googleAuth.handleGoogleLoginOrSignup(req, res, next, req.user);
});

module.exports = router;
