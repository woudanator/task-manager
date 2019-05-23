const express = require('express');
const router = new express.Router();
const User = require('../models/user');

// Get all Users
router.get('/users',async(req,res)=>{
    try{
        const users = await User.find({});
        res.status(201).send(users);
    }catch (e){
        res.status(500).send(e);
    }
});

//Get User by ID
router.get('/users/:id',async(req,res)=>{
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
router.post('/users',async(req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e);
    }
});

//Update Users
router.patch('/users/:id',async(req,res)=>{
    //Update Validation
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','age','password'];
    const isValid = updates.every((update)=> allowedUpdates.includes(update));

    // User ID's

    if(!isValid){
        return res.status(400).send({ error: "Invalid Updates"});
    }

    try{
        const user = await User.findById(req.params.id);
        
        
        updates.forEach((update) => user[update] = req.body[update])
        await user.save();

        if(!user){
          return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (e){
        res.status(400).send(e);
    }
})

// Delete User
router.delete('/users/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        const user = await User.findByIdAndDelete(id);
        if(!user){
           return res.status(404).send({error: 'User Not Found'});
        }
        res.status(200).send({success: "User was Deleted"})
    }catch(e){
        res.status(500).send(e);
    }
})


module.exports = router;