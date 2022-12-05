import mongoose from "mongoose";

const skillCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Category", skillCategorySchema);