const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

// Get All Tasks
router.get('/tasks',auth,async(req,res)=>{
    const match = {}
    
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    };

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
            }
        }).execPopulate();
        res.send(req.user.tasks);
    }catch(e){
        res.status(500).send(req.user);
    }  
    });

//Get Task by Id
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.findOne({_id, owner: req.user._id})

        if (!task){
            return res.status(404).send()
        }
        res.send(task);
    } catch (e){
        res.status(500).send();
    }
});

// Create a Task
router.post('/tasks',auth,async(req,res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e)
    }
});

// Update Tasks
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body);
    const updateValidArr = ['description','completed'];
    const isValid = updates.every((update)=> updateValidArr.includes(update));
    if(!isValid){
        console.log(isValid)
        return res.status(400).send({error: "Is not a Valid Field"});
    }
    try{
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})
        if(!task){
           return res.status(404).send();
        }
        await updates.forEach((update) => task[update] = req.body[update])
        await task.save();
        res.status(200).send(task);
    } catch (e){
        res.status(500).send(e);
    }
})

//Task Delete
router.delete('/tasks/:id',auth,async(req,res)=>{
    const id = req.params.id;
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id});
        if(!task){
          return res.status(404).send({failed: "Can't Find Task"}); 
        }
        res.status(200).send({success: "Task has been Deleted"});
    } catch(e){
        res.status(500).send(e);
    }
})


module.exports = router;