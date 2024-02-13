require("dotenv").config();
// Module Imports.
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  expressSanitizer = require("express-sanitizer"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");
const PORT = process.env.PORT || 3000;

//APP CONFIG.

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then(() => {
    console.log("Mongo Connection open");
  })
  .catch((err) => {
    console.log("Mongo Error");
  });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

//Mongoose model config.
// var blogSchema = new mongoose.Schema({
//   title: String,
//   image: String,
//   body: String,
//   created: { type: Date, default: Date.now },
// });
// var Blog = mongoose.model("Blog", blogSchema);
// Importing the models
const Blog = require("./model/blog");
//RESTFUL ROUTES
app.get("/", function (req, res) {
  res.redirect("/blogs");
});
app.get("/blogs", function (req, res) {
  Blog.find()
    .then((blogs) => {
      res.render("index", { blogs: blogs });
    })
    .catch((err) => {
      console.log(err);
    });
});

//TEST CREATE  :  Blog.create({
//   title: "About Dog",
//   image:
//     "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
//   body: "A sample blog post on the database",
// });
//NEW ROUTE
app.get("/blogs/new", function (req, res) {
  res.render("new");
});
//CREATE ROUTE
app.post("/blogs", function (req, res) {
  //Sanitize to prevent unwanted user input.
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog)
    .then((newBlog) => {
      res.redirect("/blogs");
      console.log("Blog created!");
    })
    .catch((err) => {
      res.render("new");
    });
});
//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id)
    .then((foundBlog) => {
      res.render("show", { blog: foundBlog });
    })
    .catch((err) => {
      res.redirect("/blogs");
    });
});
//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id)
    .then((foundBlog) => {
      res.render("edit", { blog: foundBlog });
    })
    .catch((err) => {
      res.redirect("/blogs");
    });
});
//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog)
    .then((updatedBlog) => {
      res.redirect("/blogs/" + req.params.id);
    })
    .catch((err) => {
      res.redirect("/blogs");
    });
});
//DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      res.redirect("/blogs");
    });
});

app.listen(PORT, function () {
  console.log(`Server for Blog App has started on ${PORT}`);
});
