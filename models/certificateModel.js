import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    email: String,
    name: String,
    publisher: String,
    exp: String,
    photo: String
});

export default mongoose.model("Certificate", certificateSchema);