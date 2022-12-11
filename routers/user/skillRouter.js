import express from "express";
import Certificate from "../../models/certificateModel.js";
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
    // const cert = await Certificate.find({ email: q.email })
    const cert = await new Certificate({
      email: q.email,
      name: q.name,
      publisher: q.publisher,
      exp: q.exp,
      photo: q.photo,
    })
    const savedCert = await cert.save()
    if (savedCert) {
      const user = await User.find({email: q.email}).populate({
        path: 'skills',
        populate: { path: 'skill', populate: { path: 'category', populate: {path: 'Cert'} } }
      })
      res.send(user)
    } else {
      return res.status(400).send("error")
    }
  } catch (error) {
    return res.status(400).send(error)
  }
})

export default router;