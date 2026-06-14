import jwt from "jsonwebtoken";

export const generateToken = (res,userId) => 
{
    const token = jwt.sign(
        {id : userId},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    );

    res.cookie("token",token,{
        httpOnly : true,
        secure : false,
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000
    })
};


