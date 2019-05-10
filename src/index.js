const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express()
const port = process.env.port || 3000

app.use(express.json());

// Get all Users
app.get('/users',async(req,res)=>{
    try{
        const users = await User.find({});
        res.status(201).send(users);
    }catch (e){
        res.status(500).send(e);
    }
});

//Get User by ID
app.get('/users/:id',async(req,res)=>{
    const _id = req.params.id;
    try{
        const user = await User.findById(_id);
        if(!user){return res.status(404).send()}
        res.send(user);
    }catch(e){
        res.status(500).send(err);
    }
        
    });
    
// Create new User
app.post('/users',async(req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e);
    }
});
//Update Users
app.patch('/users/:id',async(req,res)=>{
    //Update Validation
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','age','password'];
    const isValid = updates.every((update)=> allowedUpdates.includes(update));

    // User ID's 
    const id = req.params.id;

    if(!isValid){
        console.log(isValid);
        return res.status(400).send({ error: "Invalid Updates"});
    }

    try{
        const user = await User.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});
        if(!user){
          return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (e){
        console.log("400 Error caught")
        res.status(400).send(e);
    }
})

// Get All Tasks
app.get('/tasks',async(req,res)=>{
    try{
        const tasks = await Task.find({});
        res.send(tasks);
    }catch(e){
        res.status(500).send();
    }  
    });

//Get Task by Id
app.get('/tasks/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        const task = await Task.findById(id);
        if(!task){return res.status(404).send()}
        res.send(task);
    } catch (e){
        res.status(500).send();
    }
});

// Create a Task
app.post('/tasks',async(req,res)=>{
    const task = new Task(req.body);
    try{
        await task.save()
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e)
    }
});
// Update Tasks
app.patch('/tasks/:id',async(req,res)=>{
    const updates = Object.keys(req.body);
    const updateValidArr = ['description','completed'];
    const isValid = updates.every((update)=> updateValidArr.includes(update));

    const id = req.params.id;

    if(!isValid){
        return res.status(400).send({error: "Is not a Valid Field"});
    }
    try{
        const task = await Task.findByIdAndUpdate(id,req.body,{new: true, runValidators: true});
        if(!task){
           return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (e){
        res.status(400).send();
    }

})

app.listen(port,()=>{
    console.log(`System is running on port: ${port}`);
});