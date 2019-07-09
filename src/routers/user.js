const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeng|png)$/)) {
            return cb(new Error('File is in wrong Format'))
        }
       cb(undefined,true);
    }
})


// Get all Users
router.get('/users/me', auth ,async(req,res)=>{
    try{
        res.status(200).send(req.user);
    }catch (e){
        res.status(500).send(e);
    }
});

// Upload Avatar
router.post('/users/me/avatar',upload.single('avatar'),(req,res)=>{
    res.send({success:'your profile picture has been updated'});
})

// Create new User
router.post('/users',async(req,res)=>{
    const user = new User(req.body);
    try{
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    } catch (e) {
        res.status(400).send(e);
    }
});

//User Logout
router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save();
        res.send()
    }catch(e){
        res.status(500).send({error: "System error while logging out"});

    }
})

//Logout All
router.post('/users/logoutAll',auth,async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send({status: "Logged Out"});
    }catch(e){
        res.status(500).send({error: "Error While Logging out All Devices "+e})
    }
})

//Login User
router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({user,token});
    }catch(e){
        res.status(400).send(e);
    }
})

//Update Users
router.patch('/users/me',auth,async(req,res)=>{
    //Update Validation
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','age','password'];
    const isValid = updates.every((update)=> allowedUpdates.includes(update));

    // User ID's

    if(!isValid){
        return res.status(400).send({ error: "Invalid Updates"});
    }

    try{ 
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();
        res.status(200).send(req.user);
    } catch (e){
        res.status(400).send(e);
    }
})

// Delete User
router.delete('/users/me',auth,async(req,res)=>{
    try{
        await req.user.remove()
        res.send(req.user);
    }catch(e){
        res.status(500).send(e);
    }
})


module.exports = router;