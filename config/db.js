import mongoose from "mongoose";
export const connectDb=async()=>{
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Ecom');
  console.log("MongoDb Connected");
}
}