const express = require("express");
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { validateUserBody, validateAuth } = require("../middlewares/validation");

const router = express.Router();

// Crash test route for PM2 testing
// eslint-disable-next-line no-unused-vars
router.get('/crash-test', (req, res) => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

router.post("/signin", validateAuth, login);
router.post("/signup", validateUserBody, createUser);

router.get("/items", getClothingItems);

router.use(auth);
router.use("/users", usersRouter);
router.use("/items", clothingItemsRouter);

router.use("*", (req, res) => {
  res.status(404).send({ message: "No such route here." });
});

module.exports = router;
