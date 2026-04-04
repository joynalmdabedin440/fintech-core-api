const express = require("express")
const authMiddleWare = require("../middlewares/auth.middleware")
const accountController = require("../controllers/account.controller")

const router = express.Router()

/**
 * /api/accounts
 * create accounts
 * protected route
 */
router.post("/", authMiddleWare.authMiddleWare, accountController.createAccountController)


module.exports = router
