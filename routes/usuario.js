var express= require('express')
var app=express()
var usuarioShema = require('../models/usuario')
var jwt=require('jsonwebtoken')

//Libreria para encriptar la clave
var bcrypt =require('bcryptjs')
var mdautenticacion=require('../middlewares/autenticacion')

//GeT a la raiz de usuario
app.get('/',(req,res,next)=>{
	let desde=req.query.desde || 0
	desde=Number(desde)

usuarioShema.find({},'nombre email img role')
	.skip(desde)
	.limit(5)
	.exec(

	(err,resUsuarios)=>{
	
	if(err){
		return res.status(500).json({
		ok:false,
		mensaje:'Error en traer usuarios',
		errors:err
	})
	}
	usuarioShema.count({},(err,conteo)=>{
		res.status(200).json({
		ok:true,
		usuario:resUsuarios,
		total:conteo
	})
	})
	
})

});


	//crear usuario

	app.post('/',(req,res)=>{
		var body=req.body
		var usuario = new usuarioShema({
		nombre:body.nombre,
		email:body.email,
		password:bcrypt.hashSync(body.password,10),
		img:body.img,
		role:body.role


		})
		//Guardar en la base de dato
		usuario.save( (err,usuarioGuardado)=>{
			if(err){
		
				return res.status(400).json({
					ok:false,
					mensaje:"Error al crear el usuario",
					errors:err
				})

			}
			res.status(201).json({
			ok:true,
			usuario:usuarioGuardado,
			usuarioToken:req.usuarioToken
			})

		

		})
		

	})

//Actualizar usuario 
app.put('/:id', mdautenticacion.verificaToken  ,(req,res)=>{
let body = req.body
	var id=req.params.id
	usuarioShema.findById(id, (err,usuario)=>{
			
		if(err) {

			return res.status(500).json({
				ok:false,
				mensaje:"Error al buscar usuario",
				errors:err
			})
		}

		if(!usuario){
			return res.status(400).json({
				ok:false,
				mensaje:"El usuario con el id " + id + " no se encuentra en la base de datos.",
				errors:{ message:'no existe un usuario con ese id' }
			})
		}
		usuario.nombre=body.nombre
		usuario.email=body.email
		usuario.role=body.role

		usuario.save( (err,usuarioGuardado)=>{
			if(err){
				return res.status(400).json({
					oK:false,
					mensaje:"Error al actualizar  el usuario",
					errors:err
				})
			}
			usuarioGuardado.password=":)"
			res.status(200).json({
				ok:true,
				usuario:usuarioGuardado

			})


		})

	})


})

//Eliminar usuario
app.delete('/:id', mdautenticacion.verificaToken  ,(req,res)=>{
	var id=req.params.id

	usuarioShema.findByIdAndRemove(id,(err,usuarioBorrado)=>{
		if(err){
			return res.status(500).json({
				ok:false,
				message:"Error al borrar el usuario",
				errors:err
			})

		}

		if(!usuarioBorrado){
			return res.status(400).json({
				ok:false,
				mensaje:"No existe un usuario con el id: " + id,
				errors:{message:"No existe un usuario con el id: " + id}
			})

		}
			res.status(200).json({
				ok:true,
				usuario:usuarioBorrado
			})
	})
})


module.exports=app