import express from "express";
import Category from "../../models/categoryModel.js";

const router = express.Router()

router.get("/category", async (req, res) => {
    const categories = await Category.find()
    return res.send(categories)
})

router.post("/category", async (req, res) => {
    const q = req.body
    const category = await Category.findOne({ name: q.name });
    if (!category) {
        try {
            const newcategory = await Category.create({
                name: q.name,
            })
            if (newcategory) {
                const categories = await Category.find()
                return res.send(categories)
            } else { }
        } catch (error) {
            return res.status(400).send(error);
        }
    } else {
        return res.status(400).send("category already exists")
    }
})

router.put("/category", async (req, res) => {
    const q = req.body
    const category = await Category.findOneAndUpdate(
        { name: q.name },
        {
            name: q.newName,
        },
        { returnOriginal: false }
    )
    if (category) {
        const categories = await Category.find()
        return res.send(categories)
    } else return res.status(400).send("No category found")
})

router.delete("/category/:id", async (req, res) => {
    const q = req.params
    const category = await Category.findOneAndDelete({ _id: q.id });
    if (category) {
        const categories = await Category.find()
        return res.send(categories)
    } else {
        return res.status(400).send("No category found")
    }
})

export default router;