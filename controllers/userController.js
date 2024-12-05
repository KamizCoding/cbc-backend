import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export async function newUser(req,res){
    const newUserData = req.body;

    if(newUserData.type == "admin"){

        if(req.user == null){
            res.json({
                message : "Please login as an admin to create a new admin account"
            })
            return
        }

        if(req.user.type != "admin"){
            res.json({
                message : "Please login as an admin to create a new admin account"
            })
            return
        }
    }

    newUserData.password = bcrypt.hashSync(newUserData.password, 10)

    const user = new User(newUserData)

    try {
        await user.save()
        res.json({
            message : "The user was added to the database succesfully"
        })
    } catch (error) {
        res.json({
            message : "The user was not added to the database due to an error " + error
        })
    }
}

export async function userLogin(req,res){

    try {
        const userList = await User.find({email : req.body.email})
        if(userList.length === 0){
            res.json({
                message : "The specific user was not found"
            })
        }else {
            const userObj = userList[0];

            const isPasswordCorrect = bcrypt.compareSync(req.body.password, userObj.password);

            if (isPasswordCorrect){
                
                const token = jwt.sign({
                    email : userObj.email,
                    firstName : userObj.firstName,
                    lastName : userObj.lastName,
                    isBlocked : userObj.isBlocked,
                    type : userObj.type,
                    profilePicture : userObj.profilePicture
                }, process.env.JWT_SECRET_KEY)

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
    } catch (error) {
        console.error(error);
        res.json({
            message : "The user was not created due to an error " + error
        })
    }
}

export async function listUser(req,res){

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

    try {
        const userList = await User.find()
            res.json({
                list : userList
            })
    } catch (error) {
        res.json({
            message : "An error blocked the loading of the User List " + error
        })
    }
}

export async function delUser(req,res){

    try {
       await User.deleteOne({email: req.body.email})
       res.json({
        message : "The user was succesfully deleted from the database"
    })
    } catch (error) {
        res.json({
            message : "The user was not deleted from the database due to an error " + error
        })
    }
}

export function isAdmin(req){
    if(req.user == null){
        return false
    }

    if(req.user.type != "admin"){
        return false
    }

    return true
}

export function isCustomer(req){
    if(req.user == null){
        return false
    }

    if(req.user.type != "customer"){
        return false
    }

    return true
}


