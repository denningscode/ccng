const db = require('./db');

const userModel = new db.mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String,
    payment_status: Boolean
});

const User = db.mongoose.model('user', userModel);

module.exports = {
    User: User,
}