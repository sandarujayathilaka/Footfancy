import mongoose from "mongoose";

const dbConnect = async () => {
    try{
        const Connected = await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");
    }catch(err){
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default dbConnect;