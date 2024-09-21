import mongoose from 'mongoose';
const mongoURI = 'mongodb://127.0.0.1:27017/inotebook-exp';


const connectToMongo = async  () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to Mongo successfully");
    } catch(err) {
        console.log("Failed to connect to Mongo: ", err);
    }
};

export default connectToMongo;