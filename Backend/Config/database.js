import mongoose from "mongoose";



async function  ConnectDb(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connection successfull!");
    } catch (err){
        console.log(err);
        process.exit(1);
    }
}

export default ConnectDb;