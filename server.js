
// requiring and configuring dotenv to access sensitive data using process.env
require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan')



// Connecting to mongodb atlas
const mongoose = require('mongoose')
try{
  
  const mongoAtlasUri = "mongodb+srv://"+process.env.MONGO_ATLAS_USER+":"+process.env.MONGO_ATLAS_PWD+"@cluster0.anqmb.mongodb.net/imgur?retryWrites=true&w=majority";
  mongoose.connect(mongoAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Connected to mongodb atlas'));
}
catch(err){
console.log('couldn\'t connect to database')
}



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, x-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({})
  }
  next()
})


// home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Imgur backend api." });
});

// Images route
const imagesRouter = require('./api/routes/images');
app.use('/images', imagesRouter);

// Users route
const usersRouter = require('./api/routes/users');
app.use('/users', usersRouter);

// Likes route
const likesRouter = require('./api/routes/likes');
app.use('/likes', likesRouter);

// Creating an error and passing through next() if requested router not found
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

// Sending error message to client
app.use((error, req, res, next) => {
  console.log(error)
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  })
});


// set port, listen for requests
const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if(err){
    console.log("Error while running server")
  }
  console.log(`Server is running on port ${PORT}.`);
});


