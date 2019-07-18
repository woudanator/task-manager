const mongoose = require('mongoose');

DBurl = process.env.MONGO_URL;

mongoose.connect(DBurl,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
});
