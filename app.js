var express          = require("express"),
    app              = express(),
    mongoose         = require("mongoose"),
    bodyParser       = require("body-parser")
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer");

//APP Config
mongoose.connect("mongodb://localhost/restfull_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Mongoose Model/Schema config 
var blogSchema = new mongoose.Schema({
    title: String,
    image: { type: String, default: "placeholderimage.jpg" },
    body: String,
    created: { type: Date, default: Date.now }
})

//Compille into this-thatUP(blogSchema) model
var Blog = mongoose.model("Blog", blogSchema);

//===RESTful Routes===

app.get("/", function (req, res) {
    res.redirect("/blogs");
})

//INDEX Route
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

//NEW Route
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//Create Route
app.post("/blogs", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, findBlog){
        if (err) {
            res.redirect("/blogs")
        } else{
            res.render("edit", {blog: findBlog});
        }
    })  
});

//UPDATE Route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updatedBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

//DELETE Route
app.delete("/blogs/:id", function(req, res ){
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});

app.listen(3000, function () {
    console.log("RESTfull app runnnig");
});   