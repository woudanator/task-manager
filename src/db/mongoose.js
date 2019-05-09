const mongoose = require('mongoose');
const validator = require('validator');

DBurl = 'mongodb+srv://reyn:R@Private1001@nodecourse-drhwz.mongodb.net/task-manager-api';

mongoose.connect(DBurl,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
});
