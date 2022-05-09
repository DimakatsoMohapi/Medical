var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new Schema({
	'name' : {type:String, required:true},
	'email' : {type:String, required:true, unique:true},
	'password' : {type:String, required:true},
	'role': {type:String}
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
