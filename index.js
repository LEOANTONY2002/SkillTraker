import mongoose from 'mongoose';
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import userRouter from './routers/user/userRouter.js'
import userSkillRouter from './routers/user/skillRouter.js'
import adminSkillRouter from './routers/admin/skillRouter.js'
import adminCategoryRouter from './routers/admin/categoryRouter.js'
import { isAuthenticated } from './middleware/auth.js';

dotenv.config()
var app = express();
const __dirname = path.resolve();

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use('/api/user', userRouter)
app.use('/api/user', userSkillRouter)
app.use('/api/admin', adminSkillRouter)
app.use('/api/admin', adminCategoryRouter)

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "client", "public")));
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "public", "index.html"));
  });
}


const url = "mongodb://localhost:27017/changecx?readPreference=primary&ssl=false&directConnection=true";

mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  console.log("Database!");
});

var server = app.listen(5000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})