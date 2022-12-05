import express from "express";
import Skill from "../../models/skillModel.js";

const router = express.Router()

router.get("/skill", async (req, res) => {
  const skills = await Skill.find().populate('category')
  return res.send(skills)
})

router.post("/skill", async (req, res) => {
  const q = req.body
  const skill = await Skill.findOne({ name: q.name });
  if (!skill) {
    try {
      const newSkill = await Skill.create({
        name: q.name,
        category: q.category
      })
      if (newSkill) {
        const skills = await Skill.find().populate('category')
        return res.send(skills)
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  } else {
    return res.status(400).send("Skill already exists")
  }
})

router.put("/skill", async (req, res) => {
  const q = req.body
  const skill = await Skill.findOneAndUpdate(
    { name: q.name },
    {
      name: q.newName,
      category: q.category
    },
    { returnOriginal: false }
  )
  if (skill) {
    try {
      const skills = await Skill.find().populate('category')
      return res.send(skills)
    } catch (error) {
      return res.status(400).send(error);
    }
  } else {
    return res.status(400).send("No skill found")
  }
})

router.delete("/skill/:id", async (req, res) => {
  const q = req.params
  const skill = await Skill.findOneAndDelete({ _id: q.id });
  if (skill) {
    const skills = await Skill.find().populate('category')
    return res.send(skills)
  } else {
    return res.status(400).send("No skill found")
  }
})

export default router;