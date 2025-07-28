import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signUp = async(req , res) =>{
    const {username , password} = req.body;
    const hashPassword = await bcrypt.hash(password , 12);

    try{
        const newUser = await User.create({
            username,
            password:hashPassword
        });

        res.status(201).json(
            {
                status:'success',
                data: {
                    user: newUser
                }
            }
        )

    }catch(e){
        res.status(400).json({
            status: "fail" ,
        })
    }
}

export const login = async(req, res)=>{
    const {username , password} = req.body;

        try{
        const user = await User.findOne({username});

        if(!user){
            return res.status(404).json({
                status: "fail",
                message: "user not found"
            })
        }

        const isCorrect = await bcrypt.compare(password , user.password);

        if(!isCorrect){
          
            
            return res.status(400).json({
                status: "fail",
                message: 'incorret username or password'
            });
        }

        req.session.user = user;

        res.status(200).json(
            {
                status:'success'
            }
        )

    }catch(e){
        res.status(400).json({
            status: "fail" ,
        })
    }
}