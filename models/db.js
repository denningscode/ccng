const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ccngDB', {useNewUrlParser: true, useUnifiedTopology: true});


module.exports = {
    mongoose: mongoose,
}