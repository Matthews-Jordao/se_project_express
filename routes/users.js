const express = require("express");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/me", getCurrentUser);
router.patch("/me", upload.single('avatar'), validateUserUpdate, updateUser);

module.exports = router;
