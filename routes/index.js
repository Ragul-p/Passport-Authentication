const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../config/auth");

router.get("/", (req, res) => { return res.render("welcome") });

router.get("/dashboard", ensureAuthenticated, (req, res) => { return res.render("dashboard", { name: req.user.name }) });


module.exports = router;