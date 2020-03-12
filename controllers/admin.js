const auid = require('../models/adminModel');
const user = require('../models/userModel');
const msg = require('../models/messageModel');

const admin = (app) => {
	app.get('/admin', (req, res) => {
		res.render('pages/admin');
	});

	app.post('/admin', (req, res) => {
		const username = req.body.uid;
		const password = req.body.pwd;

		auid.Admin.findOne({username: username, password: password}, (error, result) => {
			if (result) {
				console.log(result);
				req.session.admin = result.username;
				res.render('pages/admin-panel', {
					admin: req.session.admin,
				});
			} else {
				res.send('No user');
			}
		});
	});

	app.get('/view_users', (req, res) => {
		user.User.find({}, (error, result) => {
			res.render('pages/users', {result: result});
		});
	});

	app.get('/message', (req, res) => {
		res.render('pages/message', {admin: req.session.admin});
	});

	app.post('/message', (req, res) => {
		const messageHead = req.body.message_title;
		const messageBody = req.body.message_body;

		console.log([messageHead, messageBody]);

		const message = new msg.Message({
			messageHead: messageHead,
			messageBody: messageBody,
		});

		message.save((err) => {
			console.log('message sent');
			res.render('pages/admin-panel', {admin: req.session.admin})
		});
	});

	app.get('/view_message', (req, res) => {
		msg.Message.find({}, (error, result) => {
			res.render('pages/mymessage', {result: result});
		});
	});
}

module.exports = {
	admin: admin,
}


