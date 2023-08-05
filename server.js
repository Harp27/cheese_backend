
// DEPENDENCIES \\

// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
const { PORT = 4000, DATABASE_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import cors
const cors = require("cors")
// import morgan
const morgan = require("morgan")

// establish connection

mongoose.connect(DATABASE_URL)

// Connection Events \\
mongoose.connection
  .on("open", () => console.log("Connected to mongoose"))
  .on("close", () => console.log("Disconnected from mongoose"))
  .on("error", (error) => console.log(error));


// MODELS \\

const cheeseSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
  });

  const Cheese = mongoose.model("Cheese", cheeseSchema)

  // Middleware \\

// cors for preventing cors errors (allows all requests from other origins)
app.use(cors())
// morgan for logging requests
app.use(morgan("dev"))
// express functionality to recognize incoming request objects as JSON objects
app.use(express.json())

// ROUTES \\

// create a test route
app.get("/", (req, res) => {
  res.send("hello world");
});

// Cheese INDEX ROUTE \\
app.get("/cheese", async (req, res) => {
    try {
      // fetch all cheese from database
      const cheese = await Cheese.find({});
      // send json of all cheese
      res.json(cheese);
    } catch (error) {
      // send error as JSON
      res.status(400).json({ error });
    }
  });
  
  // USE CHAI AS SINGULAR FOR CHEESE \\
  // Cheese CREATE ROUTE \\
  app.post("/cheese", async (req, res) => {
    try {
        // create the new cheeese
        const chai = await Cheese.create(req.body)
        // send newly created cheese as JSON
        res.json(chai)
    }
    catch(error){
        res.status(400).json({ error })
    }
})

// SHOW - GET - /cheese/:id - get a single cheese
app.get("/cheese/:id", async (req, res) => {
    try {
      // get cheese from the database
      const chai = await Cheese.findById(req.params.id);
      // return cheese as json
      res.json(chai);
    } catch (error) {
      res.status(400).json({ error });
    }
  });

   // UPDATE - PUT - /cheese/:id - update a single cheese
app.put("/cheese/:id", async (req, res) => {
    try {
      // update the person
      const chai = await Cheese.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      // send the updated person as json
      res.json(chai);
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  // DESTROY - DELETE - /cheese/:id - delete a single cheese
app.delete("/cheese/:id", async (req, res) => {
    try {
        // delete the person
        const chai = await Cheese.findByIdAndDelete(req.params.id)
        // send deleted person as json
        res.status(204).json(chai)
    } catch(error){
        res.status(400).json({error})
    }
})

// LISTENER \\

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
