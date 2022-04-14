// Requiring Mongoose. 
const mongoose = require("mongoose");
// Function to connect to the Mongo DB Database. 
const connectDB = async () => {
  try {
    // Awating to connect with Mongo Db through the Acess link in our environment variables. 
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Consoling once we are connected to the database.
    console.log(`Mongo Db Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    // if caught any consoling the error.
    console.log(error);

    // After that exiting the node js process. 
    process.exit(1);
  }
};

// Exporting the function we created. 
module.exports = connectDB;
