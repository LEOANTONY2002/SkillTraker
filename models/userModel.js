import mongoose from "mongoose";

let dt = new Date();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    skills: {
        type: [{
            skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
            exp: String,
            cert: Object,
            upd: {
                type: Date,
                default: dt,
            },
        }, ],
        required: false,
    },
    photo: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: dt,
    },
});

export default mongoose.model("User", userSchema);