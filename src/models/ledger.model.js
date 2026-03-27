const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required: [true, "Account need for ledger"],
        immutable: true,
        index:true
        
        
    },
    amount: {
        type: Number,
        required: [true, "ledger need to provide amount"],
        immutable:true
    },

    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required:[true,"ledger associated with transaction"],
        immutable: true,
        index:true
    },
    types: {
        type: String,
        enum: {
            values: ["DEBIT", "CREDIT"],
            message:"Types can be either DEBIT or CREDIT"
        },
        required: [true, "Need to provide types"],
        immutable:true
        
    }

})

async function preventLedgerModification(params) {
    throw new Error("Ledger is immutable can not modify");
    
    
}

ledgerSchema.pre("findOne", preventLedgerModification)
ledgerSchema.pre("findOneAndUpdate", preventLedgerModification)
ledgerSchema.pre("updateOne", preventLedgerModification)
ledgerSchema.pre("updateMany", preventLedgerModification)
ledgerSchema.pre("deleteOne", preventLedgerModification)
ledgerSchema.pre("deleteMany", preventLedgerModification)


const ledgerModel = mongoose.model("ledger", ledgerSchema)

module.exports=ledgerModel

