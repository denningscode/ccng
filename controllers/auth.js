const md5 = require('md5');
const user = require('../models/userModel');

const auth = (app) => {

    app.get('/', (req, res) => {
        res.render('pages/index.ejs');
    });

    app.get('/register', (req, res) => {
        res.render('pages/register')
    });

    app.get('/login', (req, res) => {
        res.render('pages/login')
    });

    app.post('/login', (req, res) => {
        const uid = req.body.uid;
        const pwd = md5(req.body.pwd);

        user.User.findOne({username: uid, password: pwd, payment_status: true}, (error, result) => {
            console.log(result);
            if (result) {
                req.session.uid = result.username;
                req.session.fname = result.firstname;
                req.session.lname = result.lastname;
                req.session.email = result.email;
                req.session.payment_status = result.payment_status;
                console.log(req.session.lname);

                res.render('pages/profile', {
                    firstname: req.session.fname,
                    lastname: req.session.lname,
                    username: req.session.uid,
                    email: req.session.email,
                    payment_status: req.session.payment_status
                });

            } else {
                res.render('pages/nouser');
                console.log('no user')
            }
        });
    });
}

module.exports = {
    auth: auth,
}
