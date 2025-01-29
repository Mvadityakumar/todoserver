const express =require("express")
const cors =require("cors")
const mongoClient= require("mongodb").MongoClient

require("dotenv").config();
const app= express()
const port= process.env.PORT || 4000
// const constring="mongodb://localhost:27017"

const constring = process.env.MONGO_URI;

app.use(cors())
// {
//     origin: 'https://todo-serverside-zueo.onrender.com', // replace with your frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Backend is running! Available routes: /users, /get-appointments/:userid, etc.");
});


app.get('/aditya',(req,res)=>{
    res.send("coming")
})

app.get('/mongo',(req,res)=>{
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("reactTodo")
        database.collection("users").find({}).toArray().then(doc=>{
            res.send(doc)
        })
    })
})

app.get('/users',(req,res)=>{
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("reactTodo")
        database.collection("users").find({}).toArray().then(doc=>{
            res.send(doc)
            console.log("getting all users");
          
            
        })
    })
}) 

app.get('/get-appointments/:userid',(req,res)=>{
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("reactTodo")
        database.collection("appointments").find({userid:req.params.userid}).toArray().then(doc=>{
            res.send(doc)
            console.log(`getting all appoinments of ${req.params.userid}`);
            res.end()
            
        })
    })
})

app.get('/get-appointment/:id',(req,res)=>{
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("reactTodo")
        database.collection("appointments").find({appointmentid:parseInt(req.params.id)}).toArray().then(doc=>{
            res.send(doc)
            console.log("getting all users");
            res.end()
            
        })
    })
})

app.post('/register-user',(req,res)=>{
    var user={
        userid:req.body.userid,
        username:req.body.username,
        password:req.body.password,
        email:req.body.email,
        mobile:req.body.mobile
    }
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("reactTodo")
        database.collection("users").insertOne(user).then(()=>{
            console.log("user data inserted");
            res.end()
            
        })
    })

})


app.post("/add-appointment",(req,res)=>{
    var appointment={
        appointmentid:parseInt(req.body.appointmentid),
        title:req.body.title,
        description:req.body.description,
        date:new Date(req.body.date),
        time:new Date(req.body.time),
        userid:req.body.userid
    }
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("reactTodo")
        database.collection("appointments").insertOne(appointment).then(()=>{
            console.log("user appointment inserted");
            res.end()
            
        })
    })

})


app.put("/edit-appointment/:id/:userid",(req,res)=>{
    mongoClient.connect(constring)
    
    .then(clientobj=>{
        var appointmentdata={
            appointmentid:parseInt(req.body.appointmentid),
            title:req.body.title,
            description:req.body.description,
            date:new Date(req.body.date),
            time:new Date(req.body.time),
            userid:req.body.userid
        }
        var database=clientobj.db("reactTodo")
        database.collection("appointments").updateOne({appointmentid:parseInt(req.params.id), userid:req.params.userid },{$set:appointmentdata}).then(()=>{
            console.log("appointmnet updated")
            res.end()
        })
    })
})

app.delete("/delete-appointment/:id/:userid",(req,res)=>{
    mongoClient.connect(constring)
    
    .then(clientobj=>{
        var database=clientobj.db("reactTodo")
        database.collection("appointments").deleteOne({appointmentid:parseInt(req.params.id),userid: req.params.userid }).then(()=>{
            console.log("appointmnet deleted")
            res.end()
        })
    })
})

app.delete('/delete-all-appointments/:userid',(req,res)=>{
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("reactTodo")
        database.collection("appointments").deleteMany({userid:req.params.userid}).then(()=>{
            console.log('all appointments deleted');
            res.end()
            
        })
    })
})

app.delete('/delete-user/:userid',(req,res)=>{
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("reactTodo")
        database.collection("users").deleteOne({userid:req.params.userid}).then(()=>{
            console.log('user deleted');
            res.end()
            
        })
    })
})


app.listen(4000,()=>{
    console.log("server started");
    
})
