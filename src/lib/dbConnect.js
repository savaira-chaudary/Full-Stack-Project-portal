
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/ portalDB`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1)
    }
}
export default connectDB











// const mongoose = require('mongoose');

// const connection = {};

// async function dbConnect() {
//     if (connection.isConnected) {
//         console.log("Already connected to the database");
//         return;
//     }

//     try {
//         const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
//         connection.isConnected = db.connections[0].readyState;
//         console.log("Database connected successfully");
//     } catch (error) {
//         console.log("Database connection failed:", error);
//         process.exit(1);
//     }
// }

// module.exports = dbConnect;