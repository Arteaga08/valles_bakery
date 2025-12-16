// /backend/config/db.js
import chalk from "chalk";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Estas opciones son obsoletas en Mongoose 6+ pero se mantienen por claridad
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(chalk.bold.green(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
