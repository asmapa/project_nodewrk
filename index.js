//create a mongodb client
var MongoClient = require("mongodb").MongoClient;
//create a connection for mongodb
var connection_string = "mongodb://localhost:27017/";
//establish connection with mongodb
MongoClient.connect(connection_string,function(err,client){

    if(err) throw err;
    console.log("connected to mongodb");

    //connect to database

    var db = client.db("new_db");

    //select collection
    db.collection("student").findOne({},function(err,result){
        console.log(result);
        client.close();
    });

    
});