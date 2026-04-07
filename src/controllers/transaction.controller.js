const transactionModel = require("../models/transaction.model")
const accountModel=require("../models/account.model")

async function createTransaction(req, res) {
    
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body
    
    //check valid data
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            msg: "All fields are required",
            status:"Failed"
        })
    }

    // valid account
    const fromUserAccount = await accountModel.findOne({
        _id:fromAccount
    })
    if (!fromUserAccount) {
        return res.status(400).json({
            msg: "Invalid fromAccount",
            status:"Failed"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })
    if (!toUserAccount) {
        return res.status(400).json({
            msg: "Invalid toAccount",
            status:"Failed"
        })
    }

      

    
}

module.exports= {createTransaction}