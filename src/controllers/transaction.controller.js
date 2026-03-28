const transactionModel = require("../models/transaction.model")

async function transactionController(req,res) {
    const {fromAccount,toAccount,status,amount,idempotencyKey}=req.body
}