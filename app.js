const express = require('express');
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connection;
const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('./config/dev');
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;


app.set('view engine', 'ejs');
mongoose.connect(config.DB_URI, function(err, db){
    if (err) throw err;
    console.log('Connected to database');
});
app.get('/listusers', function(req, res){
    db.collection('users').find({}).toArray(function(err, users){
        if (err) throw err;
        console.log(users);
        db.close();
        
    })
})
app.get('/', function(req, res) {
    //let listofusers = document.querySelector('.listofusers');
    
    db.collection("posts").find({ username : 'Antoine'}).sort({ date: -1 }).toArray(function(err, posts,){
        if (err) throw err;
        
           res.render('index', { root: __dirname, posts: posts });
        
        
        
    })
    
});

app.get('/delete/:id', function(req, res){
    db.collection("users").deleteOne({ username: req.params.id}, function(err, users){
        if (err) throw err;
        res.redirect('/');

    })
})

app.get('/users', function(req, res) {
    res.json({"success": true})
})
app.post('/createUsers', function(req, res) {
    
    
    let username = req.body.username;
    let email = req.body.email;
    let age = req.body.age;
    let avatar = 'https://ui-avatars.com/api/?name=' + username
    db.collection("users").insertOne({
        
        username: username,
        email: email,
        age: age,
        avatar: avatar
    }, function(err) {
        if (err) throw err;
        console.log("User created successfully : " + username);
        //db.close();
        res.redirect('/');
      });
})





























app.listen(PORT, function(){
     console.log("Node Js Server is Running on port " + PORT);
 })