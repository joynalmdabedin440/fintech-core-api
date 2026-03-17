const express = require("express")
const authController = require("../controllers/auth.controller")


const router = express.Router()

//route api/auth/register
router.post("/register",authController.createUser)


module.exports = router