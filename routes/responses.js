const express = require("express");
const { body } = require("express-validator");

const responsesController = require("../controllers/responses");

const router = express.Router();

router.post(
  "/add-new",
  body("response").escape(),
  responsesController.addResponse
);

module.exports = router;
