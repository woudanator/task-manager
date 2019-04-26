const mongoose = require('mongoose');
const validator = require('validator');

DBurl = 'mongodb://127.0.0.1:27017/task-manager-api';

mongoose.connect(DBurl,{
    useNewUrlParser: true,
    useCreateIndex: true
});



