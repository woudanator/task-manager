const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

// Get All Tasks
router.get('/tasks',async(req,res)=>{
    try{
        const tasks = await Task.find({});
        res.send(tasks);
    }catch(e){
        res.status(500).send();
    }  
    });

//Get Task by Id
router.get('/tasks/:id',async(req,res)=>{
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
router.post('/tasks',async(req,res)=>{
    const task = new Task(req.body);
    try{
        await task.save()
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e)
    }
});
// Update Tasks
router.patch('/tasks/:id',async(req,res)=>{
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

//Task Delete
router.delete('/tasks/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        const task = await Task.findByIdAndDelete(id);
        if(!task){
          return res.status(404).send({failed: "Can't Find Task"}); 
        }
        res.status(200).send({success: "Task has been Deleted"});
    } catch(e){
        res.status(500).send(e);
    }
})


module.exports = router;