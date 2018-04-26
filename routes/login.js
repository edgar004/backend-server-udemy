var express = require('express')
var bcrypt=require('bcryptjs')
var jwt=require('jsonwebtoken')
var SEED=require('../config/config').SEED
var app=express()
var usuarioShema= require('../models/usuario')

const {OAuth2Client} = require('google-auth-library');
var CLIENT_ID=require('../config/config').CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);
//Iniciar session normal
app.post('/',(req,res)=>{
	let body=req.body
	usuarioShema.findOne({email:body.email},(err,usuarioDB)=>{
		if(err){
			return res.status(500).json({
				ok:false,
				mensaje:"Error al buscar usuario",
				errors:err
			})

			}

			if(!usuarioDB){
				return res.status(400).json({
					ok:false,
					mensaje:"Credenciales incorrectas-email",
				errors:{message:"Credenciales incorrectas-email"}
				})



			}
			if(!bcrypt.compareSync(body.password,usuarioDB.password)){
				return res.status(400).json({
					ok:false,
					mensaje:"Credenciales incorrectas-password",
					errors:{message:"Credenciales incorrectas-password"}

				})

			}
			//Crea token
			usuarioDB.password=":)"
			var token= jwt.sign({usuario:usuarioDB},SEED,{expiresIn:1440})

			res.status(200).json({
			ok:true,
			usuario:usuarioDB,
			token:token,
			id:usuarioDB._id
		})

		


	
	})

	
})


//Iniciar seccion por google

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  

  return {
  	nombre:payload.name,
  	email:payload.email,
  	img:payload.picture,
  	google:true
  }
}
//Para usar el await la funcion tiene que ser de tipo async
app.post('/google', async(req,res)=>{
	var token=req.body.token
	//await es para esperar que la promesa me devuelva algo
	var googleUser=await verify(token).catch( error=>{
		return res.status(403).json({
			ok:false,
			mensaje:"Token no valido"
		})
	})

	usuarioShema.findOne({email:googleUser.email},(err,usuarioDB)=>{
		if(err){
			return res.status(500).json({
				ok:false,
				mensaje:"Error al buscar el usuario",
				errors:err
			})
		}
		if(usuarioDB){
			if(usuarioDB.google==false){
				return res.status(400).json({
				ok:false,
				mensaje:"Debe usar su autenticacion normal",
				errors:{message:"Debe usar su autenticacion normal"}
			})
			}else{

			var token= jwt.sign({usuario:usuarioDB},SEED,{expiresIn:1440})


			res.status(200).json({
			ok:true,
			usuario:usuarioDB,
			token:token,
			id:usuarioDB._id
			})



			}
		}else{
			//El usuario no existe
			var usuario= new usuarioShema();
			usuario.nombre =googleUser.nombre
			usuario.email =googleUser.email
			usuario.img =googleUser.img
			usuario.google =true
			usuario.password=":)"

			usuario.save((err,usuarioGuardado)=>{
			var token= jwt.sign({usuario:usuarioGuardado},SEED,{expiresIn:1440})
			res.status(200).json({
			ok:true,
			usuario:usuarioGuardado,
			token:token,
			id:usuarioGuardado._id
			})

			})
		}

	})


})

module.exports=app