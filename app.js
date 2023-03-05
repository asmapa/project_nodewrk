const express = require ("express");

const app=express();

const bodyparser = require("body-parser");

//express-path is installed for access public folder
const path = require('path');

//include mysql for connection
const mysql=require("mysql");


//used for authentication
var jwt = require("jsonwebtoken");

var cors = require("cors");

const bodyParser = require("body-parser");

//use cors as middle ware
app.use(cors());


//create a mongodb client
var MongoClient = require("mongodb").MongoClient;
//create a connection for mongodb
var connection_string = "mongodb://localhost:27017/";
//establish connection with mongodb
MongoClient.connect(connection_string,function(err,client){

    if(err) throw err;
    console.log("connected to mongodb");
});


var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({extended:false});


//middleware for body access
app.use(bodyparser.urlencoded({extended:true}));
//middleware for include css,all css files are in public directory
app.use(express.static(path.join(__dirname, 'public')));

var con= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"applications"
});

con.connect((err)=>{

    if(err) throw err;
    console.log("connected to database");
});



//API creation

//to get all students info from student reg table
app.get("/student",function(req,res){

    con.query("select *from student",(err,result,fields)=>{
        if(err) throw err;
        res.send(result);
    });
});


//to get only one student details
app.get("/student/:id",function(req,res){

    let id=req.params.id;

    con.query("select *from student where id="+id,(err,result,fields)=>{
        if(err) throw err;
        res.send(result);
    });
});


//for adding new students
app.post("/student",jsonParser,function(req,res){

    let r = req.body.registerno;
    console.log(r);
    let u= req.body.username;
    let p = req.body.password;

    let qr = `insert into student(registerno,username,password) values(${r},'${u}','${p}')`;

    con.query(qr,(err,result)=>{
        if(err){
            res.send({err:"operation failed"});
        }
        else{
             
            res.send({success:"operation done"});

        }
        
    });
});

//updation of new students

app.patch("/student",function(req,res){
    
    let id=req.body.id;
    console.log(id);
    let r = req.body.registerno;
    console.log(r);
    let u = req.body.username;
    let p = req.body.password;
    

    let qr = `update student set registerno=${r},username='${u}',password='${p}' where id=${id}`;
    con.query(qr,(err,result)=>{

        if(err){
            res.send({err:"updation failed"});
        }
        else{
             
            res.send({success:"updation done"});

        }

    });
});


//delete student
app.delete("/student/:id",function(req,res){

    let id=req.params.id;
    let qr=`delete from student where id=${id}`;
    con.query(qr,(err,result)=>{

        if(err){
            res.send({error:"deletion failed"});
        }
        else{

            res.send({success:"deletion successfull"});
        }
    });
}); 





//AUTHONTICATION ACTIVITYS






//middleware for verify token
function verifyToken(req,res,next){

    let authHeader = req.headers.authorization;
    if(authHeader==undefined){
  
        res.status(401).send({error:"no token provided"});
    } 
    /* client side sent  authorization like bearer jdfhsjhfjsfjfdd(token) [authorization:bearer tokenhgsdh] after bearer a space present after that token present for getting that token we use this lines of code*/
    
   let token = authHeader.split("").pop();
    jwt.verify(token,"secret",function(err,decoded){

        if(err){

            res.status(500).send({err:"Authentication failed"});
        }
        else{
            res.send(decoded);
        }
    });
}



/*app.post("/login.html",function(req,res){

    var user = req.body.user-type;
    var usname=req.body.username;
    var password=req.body.password;

    console.log(user);
})*/

app.post("/login.html",jsonParser,function(req,res){

    if(req.body.username==undefined || req.body.password==undefined){

        res.status(500).send({err:"authentication failed"});
    }

   let u=req.body.username;
   
   let p= req.body.password;

   let qr = `select registerno from student where username='${u}' and password='${p}'`;
   con.query(qr,(err,result)=>{

    if(err || result.length==0){

        res.status(500).send({err:"login failed"});
        
    }
    else{
        res.status(200).send({success:"login ok"});

        let resp ={

            id : result[0].id,
            registerno : result[0].registerno
        }

        let token = jwt.sign(resp,"secret",{expiresIn:86400});
        res.status(200).send({auth:true,token:token});
    }
   });

});



//project pages path

app.get("/index.html",function(req,res){

    res.sendFile(__dirname+"/index.html");
});

app.get("/login.html",function(req,res){

    res.sendFile(__dirname+"/login.html");
});

app.get("/",function(req,res){

    res.sendFile(__dirname+"/index.html");
    console.log(req.url);
    console.log(req.method);
});

app.get("/result_store.html",function(req,res){

    res.sendFile(__dirname+"/result_store.html");
});

app.get("/results_view.html",function(req,res){

    res.sendFile(__dirname+"/results_view.html");
});


//mongodb









//port for listen

app.listen(8000,function(){
    console.log("server is running @ port 8000");
});
