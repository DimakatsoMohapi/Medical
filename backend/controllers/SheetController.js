var SheetModel = require('../models/SheetModel.js');  
const {MongoClient} = require('mongodb'); 
const { db } = require('../config.json');  
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;



/**
 * SheetController.js
 *
 * @description :: Server-side logic for managing Sheets.
 */

const uri =  db;   

module.exports = {
 
    mylist:async (req, res, next) => {   
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var _userId = req.userData.userId; 
        var author = new mongoose.Types.ObjectId(_userId);   
        var sheets=[], profile;
        await client.connect();
        
        const session = client.startSession(); 
        
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        
        try {
            const transactionResults = await session.withTransaction(async () => { 
            const sheetsCollection = client.db('Medical').collection('sheets');
            const profilesCollection = client.db('Medical').collection('profiles');
            
            profile = await profilesCollection.findOne({ _userId:author }, { session: session });  
             profile.sheets.forEach(sheetId => {
                sheetId = new mongoose.Types.ObjectId(sheetId);
                sheets.push(sheetId);
            }); 
            const cursor = sheetsCollection
                            .find({_id:{$in:sheets}}, { session })
                            .sort({ title: -1 })
                            .limit(100);
            
            
            sheets = await cursor.toArray();  
                
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Your Sheets was Retrieved successfully',
                sheets:sheets
                });
            }else{
                res.status(401).json({
                message:'Your Sheets Failed to Retrieve , Try Again'
                });
            }

            } finally {
            session.endSession(); 
            
            await client.close();
           // next();
            }
    },

    
    /**
     * SheetController.create()
     */
    create: async (req, res,next)=>{
       
        var _userId = req.userData.userId; 
        var author = new mongoose.Types.ObjectId(_userId);  
        var doctorId = new mongoose.Types.ObjectId(req.body.doctorId);   
        
        var createdSheetId='' ;
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        await client.connect(); 
        
        const session = client.startSession(); 
        
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        
        try {
            const transactionResults = await session.withTransaction(async () => { 
            const sheetsCollection = client.db('Medical').collection('sheets');
            const profilesCollection = client.db('Medical').collection('profiles');
            
            profile = await profilesCollection.findOne({ _userId:author }, { session: session });
            doctorProfile = await profilesCollection.findOne({ _userId:doctorId }, { session: session });   
            var Sheet = {
                bloodpressure : req.body.bloodpressure,
                pulse : req.body.pulse,
                weight : req.body.weight,
                height : req.body.height,
                symptoms : req.body.symptoms,
                entrydate : Date.now(),
                userId : author,  
                doctorId: doctorId,
                doctorName: doctorProfile.name,
                patientName: profile.name,
                patientDetails:{birthdate:profile.birthdate, birthplace:profile.birthplace, phone:profile.phone}
            };
            

           // sheet = await sheetsCollection.findOne({ _id: new ObjectId("605b31f30f5b0ed441b908bc") }, { session: session }); 
            await sheetsCollection.insertOne(Sheet, { session: session }).then(data=>{
                createdSheetId = data.insertedId;
            })  
            
            await profilesCollection.updateOne({_id:profile._id}, {$addToSet:{sheets:String(createdSheetId)}}, { session: session });
            await profilesCollection.updateOne({_id:doctorProfile._id}, {$addToSet:{sheets:String(createdSheetId)}}, { session: session });
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Sheet Created Successfully', 
                });
            }else{
                res.status(401).json({
                message:'Failed to add Sheet'
                });
            }

            } finally {
            session.endSession(); 
            
            await client.close();
            // next();
            } 
    },
    //remove controller

    remove: function (req, res) {
        var id = req.params.id;

        SheetModel.findByIdAndRemove(id, function (err, Sheet) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Sheet.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
 

    
};
