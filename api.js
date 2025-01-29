const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// Use an environment variable for the connection string
const constring = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let database; // Global variable to store the database connection

// Connect to MongoDB once and reuse the connection
async function connectDB() {
    try {
        const client = new MongoClient(constring, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        database = client.db("reactTodo");
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
    }
}

connectDB();

app.get("/", (req, res) => {
    res.send("Backend is running! Available routes: /users, /get-appointments/:userid, etc.");
});

app.get("/aditya", (req, res) => {
    res.send("coming");
});

app.get("/users", async (req, res) => {
    try {
        const users = await database.collection("users").find({}).toArray();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching users");
    }
});

app.get("/get-appointments/:userid", async (req, res) => {
    try {
        const appointments = await database.collection("appointments").find({ userid: req.params.userid }).toArray();
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching appointments");
    }
});

app.post("/register-user", async (req, res) => {
    try {
        const user = {
            userid: req.body.userid,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            mobile: req.body.mobile
        };
        await database.collection("users").insertOne(user);
        res.send("User registered successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error registering user");
    }
});

app.post("/add-appointment", async (req, res) => {
    try {
        const appointment = {
            appointmentid: parseInt(req.body.appointmentid),
            title: req.body.title,
            description: req.body.description,
            date: new Date(req.body.date),
            time: new Date(req.body.time),
            userid: req.body.userid
        };
        await database.collection("appointments").insertOne(appointment);
        res.send("Appointment added successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding appointment");
    }
});

app.put("/edit-appointment/:id/:userid", async (req, res) => {
    try {
        const appointmentData = {
            appointmentid: parseInt(req.body.appointmentid),
            title: req.body.title,
            description: req.body.description,
            date: new Date(req.body.date),
            time: new Date(req.body.time),
            userid: req.body.userid
        };
        await database.collection("appointments").updateOne(
            { appointmentid: parseInt(req.params.id), userid: req.params.userid },
            { $set: appointmentData }
        );
        res.send("Appointment updated successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating appointment");
    }
});

app.delete("/delete-appointment/:id/:userid", async (req, res) => {
    try {
        await database.collection("appointments").deleteOne({
            appointmentid: parseInt(req.params.id),
            userid: req.params.userid
        });
        res.send("Appointment deleted successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting appointment");
    }
});

app.delete("/delete-all-appointments/:userid", async (req, res) => {
    try {
        await database.collection("appointments").deleteMany({ userid: req.params.userid });
        res.send("All appointments deleted successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting appointments");
    }
});

app.delete("/delete-user/:userid", async (req, res) => {
    try {
        await database.collection("users").deleteOne({ userid: req.params.userid });
        res.send("User deleted successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting user");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
