const paypal = require('paypal-rest-sdk');
const md5 = require('md5');
const user = require('../models/userModel');


paypal.configure({
    mode: 'sandbox', // Sandbox or live
    client_id: 'AfYR1bFOom0n4EDtnpoq8CuvJnRFwMLZ9avNfZQTcxd8wukUDPWlzg0U2I4ZZY-xtdAHBEa7yPE8YvCn',
    client_secret: 'EJu4HNwmBSCTa2jAEL9lD23GimVL9VHiCvgxFT7tUVf8P7oCOj8NXszLTVHCsQO0Eoz-0piFqY_WQNPW'
});

const pay = (app) => {
    app.post('/pay', (req, res) => {

        const fname = req.body.fname;
        const lname = req.body.lname;
        const uid = req.body.uid;
        const email = req.body.email;
        const pwd = req.body.pwd;
        // Build PayPal payment request
        const payReq = JSON.stringify({
            intent:'sale',
            payer:{
              payment_method:'paypal'
            },
            redirect_urls:{
              return_url:'http://localhost:3000/success',
              cancel_url:'http://localhost:3000/cancel'
            },
            transactions:[{
              amount:{
                total:'2.30',
                currency:'USD'
              },
              description:'This is the payment transaction description.'
            }]
        });
        ////enddd

        paypal.payment.create(payReq, function(error, payment){
            const links = {};

            if(error){
              console.error(JSON.stringify(error));
            } else {
              // Capture HATEOAS links
              payment.links.forEach(function(linkObj){
                links[linkObj.rel] = {
                  href: linkObj.href,
                  method: linkObj.method
                };
              })

              // If the redirect URL is present, redirect the customer to that URL
              if (links.hasOwnProperty('approval_url')){

                user.User.find({username: uid}, function(error, result) {
                  console.log(result);
                  if (result) {
                    console.log(result.length);
                    if (result.length > 0) {
                      res.render('pages/exist');
                      console.log('user exists');
                    } else {
                      res.redirect(links.approval_url.href);

                      app.get('/success', (request, response) => {
                          //
                          console.log('okkk');
                          // res.send('okk');
                          const payerId = { payer_id: request.query.PayerID };;
                          const paymentId = request.query.paymentId;
                          paypal.payment.execute(paymentId, payerId, function(error, payment){
                              if(error){
                                  console.error(JSON.stringify(error));
                              } else {
                                if (payment.state == 'approved'){
                                  const person = new user.User({
                                    firstname: fname,
                                    lastname: lname,
                                    username: uid,
                                    email: email,
                                    password: md5(pwd),
                                    payment_status: true
                                  });

                                  person.save(function(err) {
                                    console.log('user don register and you don pay the shenkele registeration money');
                                    console.log('payment completed successfully');
                                    response.render('pages/success');
                                  });
                                  
                                } else {
                                  console.log('payment not successful');
                                  response.send('no success');
                                }
                              }
                            });
                      });

                      app.get('/cancel', (request, response) => {
                          response.render('pages/cancel');
                      });
                    }
                  }
                  //if (result)
                });

//completr fix
                //
                // app.get('/success', (request, response) => {
                //     //
                //     console.log('okkk');
                //     // res.send('okk');
                //     const payerId = { payer_id: request.query.PayerID };;
                //     const paymentId = request.query.paymentId;
                //     paypal.payment.execute(paymentId, payerId, function(error, payment){
                //         if(error){
                //             console.log('err');
                //
                //             console.error(JSON.stringify(error));
                //         } else {
                //           if (payment.state == 'approved'){
                //             console.log('user don register and you don pay the shenkele registeration money');
                //             console.log('payment completed successfully');
                //             response.render('pages/success');
                //           } else {
                //             console.log('payment not successful');
                //             response.send('no success');
                //           }
                //         }
                //       });
                // });
                //
                // app.get('/cancel', (request, response) => {
                //     response.render('pages/cancel');
                // });

                //


                // Redirect the customer to links['approval_url'].href
              } else {
                console.error('no redirect URI present');
              }

            }
          });
    });
}

module.exports = {
    pay: pay,
}
