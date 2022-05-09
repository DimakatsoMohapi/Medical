var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var SheetSchema = new Schema({
	'bloodpressure' : String,
	'pulse' : String,
	'weight' : String,
	'height' : String,
	'symptoms' : String,
	'entrydate' : Date,
	'doctorName' : String,
	'patientName' : String,
	'doctorId' :{
		type: Schema.Types.ObjectId,
		ref: 'User'
     },
	'userId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	},
	'patientDetails': {}
});

module.exports = mongoose.model('Sheet', SheetSchema);