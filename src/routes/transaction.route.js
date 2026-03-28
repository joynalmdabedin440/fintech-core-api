const { Router } = require('express');
const authMiddleware=require("../middlewares/auth.middleware.js")
const transactionController=require("../controllers/transaction.controller")

const router = Router()

/**
 * -POST /api/transaction/
 * -create new transaction
 */

router.post("/transaction", authMiddleware, transactionController)


module.exports = router
