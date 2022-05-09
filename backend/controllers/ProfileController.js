var ProfileModel = require('../models/ProfileModel.js');
const {MongoClient} = require('mongodb'); 
const { db } = require('../config.json'); 
var mongoose = require('mongoose'); 


/**
 * ProfileController.js
 *
 * @description :: Server-side logic for managing Profiles.
 */

const uri =  db;   

module.exports = {

    /**
     * ProfileController.myprofile()
     */
    myprofile:async (req, res,  next) => {   
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var _userId = req.userData.userId; 
        var author = new mongoose.Types.ObjectId(_userId);
        var profile;
        await client.connect(); 
        const session = client.startSession();  
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };
 
        try {
            const transactionResults = await session.withTransaction(async () => {  
            //const profilesCollection = client.db('Medical').collection('profiles');
            const profilesCollection = client.db('Medical').collection('profiles');

            profile = await profilesCollection.findOne({ _userId:author }, { session: session });  
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Your Profile Was Retrived Succesfully',
                profile:profile
                });
            }else{
                res.status(401).json({
                message:'Your Profile Failed To Be Retrived, Try Again'
                });
            }

            } finally {
            session.endSession();  
            await client.close();
           // next();
            }
    },
 
 
};
