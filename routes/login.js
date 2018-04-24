var express = require('express')
var bcrypt=require('bcryptjs')
//var jwt=require('jsonwebtoken')

var app=express()
var usuarioShema= require('../models/usuario')

// app.post('/',(req,res)=>{
// 	let body=req.body
// 	usuarioShema.findOne({email:body.email},(err,usuarioDB)=>{
// 		if(err){
// 			return res.status(500).json({
// 				ok:false,
// 				mensaje:"Error al buscar usuario",
// 				errors:err
// 			})

// 			}

// 			if(!usuarioDB){
// 				return res.status(400).json({
// 					ok:false,
// 					mensaje:"Credenciales incorrectas-email",
// 				errors:{message:"Credenciales incorrectas-email"}
// 				})



// 			}
// 			if(!bcrypt.compareSync(body.password,usuarioDB.password)){
// 				return res.status(400).json({
// 					ok:false,
// 					mensaje:"Credenciales incorrectas-password",
// 					errors:{message:"Credenciales incorrectas-password"}

// 				})

// 			}
// 			//Crea token
// 			usuarioDB.password=":)"
// 			//var token= jwt.sign({usuario:usuarioDB},'@este-es@-un-seed-dificil',{expiresIn:1440})

// 			res.status(200).json({
// 			ok:true,
// 			usuario:usuarioDB,
// 			token:token,
// 			id:usuarioDB._id
// 		})

		


	
// 	})

	
// })




module.exports=app