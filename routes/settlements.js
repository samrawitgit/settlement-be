const express = require("express");
const { body } = require("express-validator");

const settlementsController = require("../controllers/settlements");

const router = express.Router();

router.get("/get-last", settlementsController.getLastSettlement);

router.post(
  "/add-new",
  body("amount").escape(),
  settlementsController.addSettlement
);

module.exports = router;
