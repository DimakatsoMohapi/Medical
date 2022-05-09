var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProfileSchema = new Schema({
	'name' : String, 
	'email' : String,
	'birthdate' : Date,
	'birthplace' : String,
	'phone' : String,
	'sheets' : [{
		type: Schema.Types.ObjectId,
		ref: 'Sheet'
   		}],
	'_userId' : {
		type: Schema.Types.ObjectId,
		ref: 'User'
   }
});

module.exports = mongoose.model('Profile', ProfileSchema);
