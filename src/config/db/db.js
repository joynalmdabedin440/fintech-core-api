const mongoose = require("mongoose")



async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        console.log("database connected successfully");
    } catch (error) {
        console.error("db error", error)
        process.exit(1)

    }

}

module.exports = connectDB