const express = require("express")
const authController = require("../controllers/auth.controller")


const router = express.Router()

//route api/auth/register
router.post("/register",authController.registerUserController)
//route api/auth/login
router.post("/login",authController.loginUserController)


module.exports = router