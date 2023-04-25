import jwt from 'jsonwebtoken';
import {SECRET_KEY} from './index.js';
export const Auth=(req,res,next)=>{
   try{
       console.log(req.headers.jwttoken)
       const token=req.headers.jwttoken
      //  const token=req.headers('x-auth-token')
       const user=jwt.verify(token,SECRET_KEY)
       console.log(token)
       req.token=user
       next()
    }catch(error){
       res.send({message:"error",error})
    }
}