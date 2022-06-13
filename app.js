const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const config = require("./config");
const port = config.localPort || process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const mongoDBLink = config.mongoDBLink || process.env.mongoDBLink;
mongoose.connect(mongoDBLink);

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Wiki API is listening on port ${port}`);
});