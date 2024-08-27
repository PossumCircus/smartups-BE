const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/userController");

router.patch("/ChangeThemeMode/:id", userController.ChangeThemeMode);

module.exports = router;
