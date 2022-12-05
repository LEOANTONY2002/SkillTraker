import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category',
        required: true,
    }
});

export default mongoose.model("Skill", skillSchema);