const { Router } = require('express');
const authMiddleware=require("../middlewares/auth.middleware.js")
const transactionController=require("../controllers/transaction.controller")

const router = Router()

/**
 * -POST /api/transaction/
 * -create new transaction
 */

router.post("/", authMiddleware.authMiddleWare, transactionController.createTransaction)

//initial fund transaction
router.post("/system/initial-fund", authMiddleware.authSystemUserMiddleWare, transactionController.createInitialFundTransaction)


module.exports = router
