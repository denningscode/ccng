const db = require('./db');

const adminModel = new db.mongoose.Schema({
	username: String,
	password: String
});

const Admin = db.mongoose.model('admin', adminModel);


module.exports = {
	Admin: Admin,
}