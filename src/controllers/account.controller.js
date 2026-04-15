const accountModel = require("../models/account.model")

async function createAccountController(req,res) {
    
    const account = await accountModel.create({
        user: req.user.id
    })

    res.status(201).json({
        msg: "Accounts Create successfully",
        account: account,
        status:"success"
        
    })
}

async function getAccountBalanceController(req,res) {
    const accountId = req.params.accountId  
    const account = await accountModel.findById(accountId)

    if (!account) { 
        return res.status(404).json({
            msg: "Account not found",
            
        })
    }

    res.status(200).json({
        msg: "Account balance retrieved successfully",
        balance: account.balance,
        status: "success"
    })
}


module.exports = { createAccountController, getAccountBalanceController }