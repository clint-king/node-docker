import Post from "../models/postModels.js";

export const getAllPosts = async (req, res, next) =>{
    try{
        const  posts = await Post.find();

        res.status(200).json({
            status: "succes",
            results: posts.length,
            data:{
                posts,
            },
        });

    }catch(e){
        res.status(400).json({
            status: "fail",
        });
    }
};

export const getOnePost = async (req, res, next) =>{
    try{
        const  posts = await Post.findById(req.params.id);

        res.status(200).json({
            status: "succes",
            data:{
                posts,
            },
        });

    }catch(e){
        res.status(400).json({
            status: "fail",
        });
    }
};


export const createPost = async (req, res, next) =>{
    try{
        const  post = await Post.create(req.body);  

        res.status(200).json({
            status: "succes",
            data:{
                post,
            },
        });

    }catch(e){
        console.log(e);
        res.status(400).json({
            status: "fail",
        });
    }
};

export const updatePost = async (req, res, next) =>{
    try{
        const  posts = await Post.findByIdAndUpdate(req.params.id , req.body , {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "succes",
            data:{
                posts,
            },
        });

    }catch(e){
        res.status(400).json({
            status: "fail",
        });
    }
};

export const deletePost = async (req, res, next) =>{
    try{
        const  posts = await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "succes",
        });

    }catch(e){
        res.status(400).json({
            status: "fail",
        });
    }
};
