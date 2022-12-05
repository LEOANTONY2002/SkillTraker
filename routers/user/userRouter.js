import express from "express";
import User from "../../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/all", async (req, res) => {
  const users = await User.find().populate({
    path: 'skills',
    populate: { path: 'skill', populate: { path: 'category' } }
  })
  if (users) return res.send(users)
  else return res.send("No users found!")
})

router.post("/signup", async (req, res) => {
  const q = req.body
  const exist = await User.findOne({ email: q.email })
  if (exist) return res.status(400).send("Email Already Exists");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(q.password, salt);

  try {
    const user = await new User({
      name: q.name,
      email: q.email,
      password: hash,
      photo: q.photo,
      skills: q.skills
    });
    const savedUser = await user.save()
    const token = await jwt.sign({ email: savedUser.email }, process.env.SECRET_TOKEN, { expiresIn: "10m" });
    const refreshToken = jwt.sign({ email: savedUser.email }, "refreshSecret", {
      expiresIn: "10m",
    });
    res.send({
      name: savedUser.name,
      email: savedUser.email,
      photo: savedUser.photo,
      skills: savedUser.skills,
      accessToken: token
    });
  } catch (err) {
    console.log(err)
    res.status(400).send("Can't register, Check the fields");
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send("Email does not exists");

  const pwVerify = await bcrypt.compare(req.body.password, user.password);
  if (!pwVerify) return res.status(400).send("Invalid Login Credentials");

  const token = await jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
  if (user.skills.length === 0)
    res.send({
      name: user.name,
      email: user.email,
      photo: user.photo,
      skills: user.skills,
      accessToken: token
    });
  else {
    const su = await User.findOne({ email: req.body.email }).populate({
      path: 'skills',
      populate: { path: 'skill', populate: { path: 'category' } }
    })
    res.send({
      name: su.name,
      email: su.email,
      photo: su.photo,
      skills: su.skills,
      accessToken: token
    })
  }
});

router.put("/edit", async (req, res) => {
  const q = req.body
  const user = await User.findOneAndUpdate(
    { email: q.email },
    {
      name: q.name,
      photo: q.photo
    },
    { returnOriginal: false }
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
  } else return res.status(400).send("No user found")
})

export default router;