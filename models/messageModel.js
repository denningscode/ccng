const db = require('./db');

const messageModel = new db.mongoose.Schema({
	messageHead: String,
	messageBody: String
});

const Message = db.mongoose.model('message', messageModel);


module.exports = {
	Message: Message,
}
