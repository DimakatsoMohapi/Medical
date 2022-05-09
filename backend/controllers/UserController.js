const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {MongoClient} = require('mongodb');
var UserModel = require('../models/UserModel.js');
var ProfileModel = require('../models/ProfileModel.js');
const { secret,db } = require('../config.json'); 
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
const uri =  db;    

module.exports = {
    signup: async (req, res, next) =>{
            const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
            var user; 
            await client.connect(); 
            const session = client.startSession();
 
            const transactionOptions = {
              readPreference: 'primary',
              readConcern: { level: 'local' },
              writeConcern: { w: 'majority' }
            };
 
            try {
              const hash = await bcrypt.hash(req.body.password, 10); 
              const transactionResults = await session.withTransaction(async () => {
                const users = client.db('Medical').collection('users');
                const profiles = client.db('Medical').collection('profiles');
 
                
              // check if email registerd before
              user = await users.findOne({ email: req.body.email}, { session });
              if(!user){
                  var newUser = new UserModel ({
                    name:req.body.name,
                    email:req.body.email,
                    password:hash,
                    role: 'patient', // by default all registered as patients 
                  })
                  
                  var createduserId; 
                  user = await users.insertOne(newUser, { session }).then(data=>{
                    createduserId = data.insertedId;
                  });   
                  var author = new mongoose.Types.ObjectId(createduserId);   
                  var Profile = new ProfileModel({
                    name :req.body.name, 
                    birthdate :req.body.birthdate, 
                    birthplace :req.body.birthplace, 
                    identity :req.body.identity, 
                    nationality :req.body.nationality, 
                    phone :req.body.phone,  
                    sheets :[], 
                    email : req.body.email, 
                    _userId : author
                      });
                await profiles.insertOne(Profile, { session }); 
              }

                

              }, transactionOptions);
              if (transactionResults) {
                res.status(200).json({
                  message:user? 'Email already exists': 'Registered Successfully',
                  results:transactionResults.email
                 });
              }else{
                res.status(401).json({
                  message:'Failed to Register, Try Again'
                 });
              }

            } finally {
              session.endSession(); 
              // Close the connection to the MongoDB cluster
              await client.close();
                
            }
    },
    
   
   
    /**
     * UserController.login()
     */
    login: async (req, res,next) =>{
      var user={};
      var profile={};
      var passwordIsValid;
      const client = new MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
      await client.connect(); 
      const session = client.startSession(); 
      const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
      };
 
      try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const transactionResults = await session.withTransaction(async () => {
          const users = client.db('Medical').collection('users');
          const profiles = client.db('Medical').collection('profiles');

           user = await users.findOne({ email: req.body.email}, { session });
           profile = await profiles.findOne({ email: req.body.email}, { session });  

         
          passwordIsValid =  user && bcrypt.compareSync(
            req.body.password,
            user.password
          );

        }, transactionOptions);

        if (transactionResults && passwordIsValid) { 
          const token = jwt.sign(
            { email: user.email, userId: user._id, name:user.name, role: user.role},
            secret,
            { expiresIn: "1h" })

          res.status(200).json({
            token: token, 
            role:user.role, 
            email:user.email,
            name:user.name,
            userId: user._id,
            expiresIn: 3600, // duration in seconds 
            });
        }else{
          res.status(200).json({
            message:'Failed to Login, try again!'
            });
        }

      } finally {
        session.endSession(); 
        await client.close(); 
        //next();
      }

    },
  
   

   /**
     * UserController.list()
     */
    listDoctors: async (req, res, next) => {   
      const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
      var users;
      await client.connect(); 
      const session = client.startSession(); 
      
      const transactionOptions = {
          readPreference: 'primary',
          readConcern: { level: 'local' },
          writeConcern: { w: 'majority' }
      };

      
      try {
          const transactionResults = await session.withTransaction(async () => { 
          const usersCollection = client.db('Medical').collection('users');

           
          const cursor = usersCollection
                          .find({role:"doctor"}, { session }) 
                          .sort({ title: -1 })
                          .limit(30);

          
          users = await cursor.toArray(); 
          users = users.map(user => {
            return {_id:user._id, email:user.email, name:user.name, role:user.role}
          })
              
          }, transactionOptions);
          if (transactionResults) {
              res.status(200).json({
              message:'users Retrieved',
              users:users
              });
          }else{
              res.status(401).json({
              message:'Failed to Retrieve users'
              });
          }

          } finally {
          session.endSession(); 
          
          await client.close();
         // next();
          }
  },
};
