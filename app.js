const mongoose = require('mongoose');
const path = require('path');

mongoose.connect('mongodb://localhost/userManagement', {useNewUrlParser:true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('db connected');
});

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    email: String,
    index: Number,
    phone: String,
    address: String,
    age: {type: Number, min: 18, max: 62},
    createDate: {type: Date, default: Date.now()}
});

// define a model based on the Schema this will use/

const user = mongoose.model('usercollections', userSchema);

// sets up express
const express = require('express');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended :true}));

app.get('/', (req,res)=>{
    user.find({}, (err, data)=>{
        if(err) return console.log(`Opps! ${err}`);
        // logs out all users
        // console.log(`data -- ${JSON.stringify(data)}`);
        let users = data;
        res.render('index', {users} );
    });
});

app.post('/search', (req,res)=>{
    let body = req.body.search;
    console.log(body);
    user.find({ $text:{$search: body} }, (err, data)=>{
        if(err) return console.log(`Opps! ${err}`);
        // logs out found users
        // console.log(`data -- ${JSON.stringify(data)}`);
        let users = data;
        res.render('index', {users} );
    });
});

app.get('/filterNameAsc', (req,res)=>{
    user.find({}, null, {sort: {first: 1}}, (err, data)=>{
        if(err) return console.log(`Opps! ${err}`);
        // logs out all users
        // console.log(`data -- ${JSON.stringify(data)}`);
        let users = data;
        res.render('index', {users} );
    });
});
app.get('/filterNameDsc', (req,res)=>{
    user.find({}, null, {sort: {first: -1}}, (err, data)=>{
        if(err) return console.log(`Opps! ${err}`);
        // logs out all users
        // console.log(`data -- ${JSON.stringify(data)}`);
        let users = data;
        res.render('index', {users} );
    });
});

app.get('/createUser', (req,res)=>{
    res.render('create')
});
// Create -- new document
// test this with `curl --data "name=Tyson&role=Student" http://localhost:8080/newUser` enter in command line
app.post('/newUser', (req, res) => {
    console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
    const newUser = new user();
    newUser.first = req.body.first;
    newUser.last = req.body.last;
    newUser.email = req.body.email;
    newUser.age = req.body.age;
    newUser.phone = req.body.phone;
    newUser.address = req.body.address;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        }
        console.log(`new user save: ${data}`);
        // res.send(`done ${data}`);
        res.redirect("/")
    });
});

//test this with `curl http://localhost:8080/user/Tyson`
app.get('/edit/:id', (req,res)=>{
    let id = req.params.id;
    console.log(`GET /user/:id: ${JSON.stringify(req.params)}`);
    user.findOne({_id: id}, (err, data)=>{
        if(err) return console.log(`Opps! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let user = data;
        res.render('edit', {user})
    });
});
app.post('/updateUser', (req,res)=>{
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let age = req.body.age;
    let phone = req.body.phone;
    let address = req.body.address;
    let _id = req.body._id;
    console.log(`POST /updateUser: ${JSON.stringify(req.body)}  ${first}  -- ${email}`);
    user.findOneAndUpdate({_id: _id},
            { name: {first:first,last:last},
            email:email,
            age:age,
            phone:phone,
            address:address }, {new: true}, (err, data)=>{
        if(err) return console.log(`Opps ${err}`);
        let returnMsg = `user name: ${first} has been updated`;
        console.log(returnMsg);
        res.redirect("/");
    });
});// test this with: `curl --data "name=Peter&role=Student" http://localhost:8080/updateUserRole`

app.get('/delete/:id', (req, res) =>{
    let id = req.params.id;
    console.log(`GET /user/:id: ${JSON.stringify(req.params)}`);
    user.findOne({_id: id}, (err, data)=>{
        if(err) return console.log(`Opps! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user _id: ${id}`;
        let user = data;
        console.log(returnMsg);
        res.render('delete', {user});
    });
});
// delete
app.post('/deleteUser', (req,res)=> {
    console.log(`POST /deleteUser: ${JSON.stringify(req.body)}`);
    let id = req.body._id;
    user.findOneAndDelete({_id: id}, (err, data) => {
        if (err) return console.log(`data -- ${JSON.stringify(data)}`);
        let user = data;
        let returnMsg = `user name: ${user.name} id: ${user._id}`;
        console.log(returnMsg);
        res.redirect('/');
    });// test this with: `curl --data "name=Peter" http://localhost:8080/deleteUser`
});

app.listen(port, (err)=>{
    if (err) console.log(err);
    console.log(`app server listening on port ${port}`);
});