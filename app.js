const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/userManagement', {useNewUrlParser:true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('db connected');
});

const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    age: {type: Number, min: 18, max: 70},
    createDate: {type: Date, default: Date.now()}
});

// define a model based on the Schema this will use/

const user = mongoose.model('usercollections', userSchema);

const express = require('express');

const app = express();

const port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended :true}));

// Create -- new document
// test this with `curl --data "name=Tyson&role=Student" http://localhost:8080/newUser` enter in command line
app.post('/newUser', (req, res) => {
    console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
    const newUser = new user();
    newUser.name = req.body.name;
    newUser.role = req.body.role;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        }
        console.log(`new user save: ${data}`);
        res.send(`done ${data}`);
    });
});
//test this with `curl http://localhost:8080/user/Tyson`
app.get('/user/:name', (req,res)=>{
    let userName = req.params.name;
    console.log(`GET /user/:name: ${JSON.stringify(req.params)}`);
    user.findOne({name: userName}, (err, data)=>{
        if(err) return console.log(`Opps! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name: ${userName} role: ${data.role}\n`;
        console.log(returnMsg);
        res.send(returnMsg);
    });
});

app.post('/updateUserRole', (req,res)=>{
    let matchedName = req.body.name;
    let newRole = req.body.role;
    console.log(`POST /updateUserRole: ${JSON.stringify(req.body)}  ${matchedName}  -- ${newRole}`);
    user.findOneAndUpdate( {name: matchedName}, {role: newRole}, {new: true}, (err, data)=>{
        if(err) return console.log(`Opps ${err}`);
        console.log(`data -- ${data.role}`);
        let returnMsg = `user name: ${matchedName} new role: ${newRole}`;
        console.log(returnMsg);
        res.send(returnMsg);
    });
});// test this with: `curl --data "name=Peter&role=Student" http://localhost:8080/updateUserRole`

// delete
app.post('/deleteUser', (req,res)=> {
    console.log(`POST /deleteUser: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name;
    user.findOneAndDelete({name: matchedName}, (err, data) => {
        if (err) return console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name: ${matchedName} role: ${data}`;
        console.log(returnMsg);
        res.send(returnMsg);
    });// test this with: `curl --data "name=Peter" http://localhost:8080/deleteUser`
});


app.listen(port, (err)=>{
    if (err) console.log(err);
    console.log(`app server listening on port ${port}`);
});