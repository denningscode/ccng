const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const auth = require('./controllers/auth');
const pay = require('./controllers/pay');
const admin = require('./controllers/admin');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({
	secret: 'ilovetocodenodejscauseilikejsandphpiskindaboringsogetdaf***atahere',
	resave: false,
	saveUninitialized: false,

}));


auth.auth(app);
pay.pay(app);
admin.admin(app);

app.listen(3000, () => {
  console.log('server running');
});


