   const { db, origin} = require('./config.json');
   var express = require('express'); 
   const {MongoClient} = require('mongodb');
   var mongoose = require('mongoose')
   var bodyParser = require('body-parser');
   var cors = require('cors')
   const path = require('path');

   var app = express();

   mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
   .then(_=>{
     console.log("Succesfully connected to mongo database")
   }).catch(error =>{
     console.log(error)
   })


   var corsOptions = {
        origin
     };
   
   
    
   var indexRouter = require('./routes/index'); 
   var sheetRouter = require('./routes/SheetRoutes');  
   var profileRouter = require('./routes/ProfileRoutes'); 
   var userRouter = require('./routes/UserRoutes'); 
   
   
   
   const PORT = process.env.PORT || 5000;
   
   // Middleware
   app.use(cors(corsOptions)); // disabled for testing
   
   // parse requests of content-type - application/json
   app.use(bodyParser.json());
   // parse requests of content-type - application/x-www-form-urlencoded
   app.use(bodyParser.urlencoded({ extended: true }));
  

   // allowing headers for Token and others
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });


   app.use('/api', indexRouter); 
   app.use('/api/sheet', sheetRouter); 
   app.use('/api/profile', profileRouter); 
   app.use('/api/auth', userRouter);  
   
   app.listen(PORT, ()=>{
       console.log(`Server is running on port ${PORT}.`);
   })
   
   app.get("/", (req, res) => {
       res.json({ message: "Welcome to Medical." });
       
   });

   process.on('uncaughtException', function (err) {
    console.log(err);
}); 
