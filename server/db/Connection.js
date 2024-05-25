import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connection Successfully Estiblish".random);
  } catch (error) {
    console.log("Error in Connection".bgRed, error);
  }
};
export default connectDb;
