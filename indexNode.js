import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import convert from "xml-js";
import { XMLParser } from "fast-xml-parser";
import he from "he";

dotenv.config();
var app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", async (req, res) => {
  const { data } = await axios.get(
    "https://44d4dec71a54a30986f0ea0a5ddf944ae84a58ec:x@api.bamboohr.com/api/gateway.php/changecx/v1/employees/directory"
  );

  const options = {
    ignoreAttributes: true,
  };

  const parser = new XMLParser(options);
  let jsonResponse = parser.parse(data);
  res.send(jsonResponse);
});

app.listen(5000, function () {
  console.log("App Started");
});
