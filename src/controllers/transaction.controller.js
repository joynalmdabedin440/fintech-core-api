const transactionModel = require("../models/transaction.model")
const accountModel = require("../models/account.model")
const mongoose =require("mongoose")
const ledgerModel = require("../models/ledger.model")
const mailService = require("../services/mail.services")

async function createTransaction(req, res) {
    
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body
    
    //check valid data
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            msg: "All fields are required",
            status: "Failed"
        })
    }

    // valid account
    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    })
    if (!fromUserAccount) {
        return res.status(400).json({
            msg: "Invalid fromAccount",
            status: "Failed"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })
    if (!toUserAccount) {
        return res.status(400).json({
            msg: "Invalid toAccount",
            status: "Failed"
        })
    }

    //check valid idempotency key
    const isTransactionAlreadyExist = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExist) {
        if (isTransactionAlreadyExist.status === "COMPLETED") {
            return res.status(200).json({
                msg: "Transaction already completed",
                status: "Success",
                transaction: isTransactionAlreadyExist
            })
        } else if (isTransactionAlreadyExist.status === "PENDING") {
            return res.status(200).json({
                msg: "Transaction is pending",
                status: "Success",
                transaction: isTransactionAlreadyExist
            })
        } else if (isTransactionAlreadyExist.status === "FAILED") {
            return res.status(200).json({
                msg: "Transaction already failed",
                status: "Success",
                transaction: isTransactionAlreadyExist
            })
        } else if (isTransactionAlreadyExist.status === "REVERSED") {
            return res.status(200).json({
                msg: "Transaction already reversed",
                status: "Success",
                transaction: isTransactionAlreadyExist
            })

        }
        
    }

    /**
     * Check account status
     */

    if (fromAccount.status !== "ACTIVE" || toAccount.status !== "ACTIVE") {
        return res.status(400).json({
            msg: "Both accounts must be active",
            status: "Failed"
        })
        
    }

    const balance = fromAccount.getBalance()
    
    if (balance < amount) {
        return res.status(400).json({
            msg: "Insufficient balance in fromAccount",
            status: "Failed"
        })  
    }

    const session = mongoose.startSession()

    session.createTransaction()

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }, { session })
    
    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount,
        amount: amount, 
        types: "DEBIT",
        transaction:transaction._id
        
        
    },(session))
    const creditLedgerEntry = await ledgerModel.create({
        account: toAccount,
        amount: amount, 
        types: "CREDIT",
        transaction:transaction._id
        
        
    }, (session))
    
    

    transaction.status = "COMPLETED"
    await transaction.save({ session })
    await session.commitTransaction()
    session.endSession()

    mailService.transactionSuccessEmail(req.user.email,req.user.name,transaction) 

    return res.status(200).json({
        msg: "Transaction completed successfully",
        status: "Success",
        transaction
    })
    





    

}

async function createInitialFundTransaction(req, res) {
    
    const { toAccount, amount, idempotencyKey } = req.body

    //check valid data
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            msg: "All fields are required",
            status: "Failed"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })
    if (!toUserAccount) {
        return res.status(400).json({
            msg: "Invalid toAccount",
            status: "Failed"
        })
    }

    const fromAccount = await accountModel.findOne({
        systemAccount: true,
        user: req.user._id
    })

    if (!fromAccount) {
        return res.status(400).json({
            msg: "Invalid fromAccount",
            status: "Failed"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount: fromAccount._id,
        toAccount: toUserAccount._id,   
        amount,
        idempotencyKey,
        status:"PENDING"
    }, { session })
    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount._id,
        amount: amount, 
        types: "DEBIT",
        transaction: transaction._id     
    }, { session })
    const creditLedgerEntry = await ledgerModel.create({
        account: toUserAccount._id,
        amount: amount, 
        types: "CREDIT",
        transaction: transaction._id     
    }, { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })
    await session.commitTransaction()
    session.endSession()


}

module.exports= {createTransaction, createInitialFundTransaction}