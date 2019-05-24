const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const app = express()
const port = process.env.port || 3001



app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

const jwt = require('jsonwebtoken');

const myFunction = async()=>{
   const token =  jwt.sign({ _id: 'abc10239' },'thisisoursecret',{expiresIn: '2days'});
   console.log(token);
   const decoded = jwt.verify(token,'thisisoursecret');
   console.log(decoded);
}

myFunction()

app.listen(port,()=>{
    console.log(`System is running on port: ${port}`);
});