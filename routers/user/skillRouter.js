import express from "express";
import User from "../../models/userModel.js";

const router = express.Router()

router.put("/skill", async (req, res) => {
  const q = req.body
  const user = await User.findOneAndUpdate(
    { email: q.email },
    {
      skills: q.skills
    },
    { returnDocument: "after" }
  ).populate({
    path: 'skills',
    populate: { path: 'skill', populate: { path: 'category' } }
  })
  if (user) {
    return res.send({
      name: user.name,
      email: user.email,
      photo: user.photo,
      skills: user.skills,
    });
  } else {
    return res.status(400).send("No user found")
  }
})

router.post("/skill/cert", async (req, res) => {
  const q = req.body
  try {
    const user = await User.find({ email: q.email }).populate({
      path: 'skills',
      populate: { path: 'skill', populate: { path: 'category', populate: { path: 'cert' } } }
    })

  } catch (error) {
    return res.status(400).send(error)
  }
})

export default router;