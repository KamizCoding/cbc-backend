import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export function newUser(req,res){
    const newUserData = req.body;

    newUserData.password = bcrypt.hashSync(newUserData.password, 10)

    const user = new User(newUserData)

    user.save().then(()=>{
        res.json({
            message : "The user was added to the database succesfully"
        })
    }).catch(()=>{
        res.json({
            message : "The user was not added to the database due to an error"
        })
    })
}

export function userLogin(req,res){

    User.find({email : req.body.email}).then(
        (userList)=>{
            if(userList.length == 0){
                res.json({
                    message : "The specific user was not found"
                })
            }else {
                const user = userList[0];

                const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

                if (isPasswordCorrect){
                    
                    const token = jwt.sign({
                        email : user.email,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        isBlocked : user.isBlocked,
                        type : user.type,
                        profilePicture : user.profilePicture
                    }, "revenge-is-mine-2025")

                    res.json({
                        message : "Your login details are correct",
                        token : token
                    })
                    }else{
                        res.json({
                            message : "You password is incorrect. Please try again"
                        })
                }
            }
        }
    )
}

export function listUser(req,res){

    console.log(req.user)

    if(req.user == null){
        res.json({
            message : "You are not logged in"
        })
        return
    }

    if(req.user.type != "admin"){
        res.json({
            message : "You are not an admin and are not authorized to do this function"
        })
        return
    }

    User.find().then(
        (userList)=>{
            res.json({
                list : userList
            })
        }
    ).catch(()=>{
        res.json({
            message : "An error blocked the loading of the User List"
        })
    })
}

export function delUser(req,res){
    User.deleteOne({email: req.body.email}).then(()=>{
        res.json({
            message : "The user was succesfully deleted from the database"
        })
    }).catch(()=>{
        res.json({
            message : "The user was not deleted from the database due to an error"
        })
    })
}


