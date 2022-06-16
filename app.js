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

// Requests targeting all articles
app.route("/articles")
  .get((req, res) => {
    Article.find({}, (err, results) => {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added new article.");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

// Requests targeting a specific target
app.route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send("Article not found.");
      }
    });
  });

app.listen(port, () => {
  console.log(`Wiki API is listening on port ${port}`);
});