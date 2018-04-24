var express= require('express')
var app=express()
var usuarioShema = require('./../models/usuario')


//GeT a la raiz de usuario
app.get('/',(req,res,next)=>{
usuarioShema.find({},'nombre email img role').exec(

	(err,resUsuarios)=>{
	
	if(err){
		return res.status(500).json({
		ok:false,
		mensaje:'Error en traer usuarios',
		errors:err
	})
	}

	res.status(200).json({
		ok:true,
		usuario:resUsuarios
	})
})


	//crear usuario

	app.post('/',(req,res)=>{
		var body=req.body
		var usuario = new usuarioShema({
		nombre:body.nombre,
		email:body.email,
		password:body.password,
		img:body.img,
		role:body.role


		})
		//Guardar en la base de dato
		usuario.save( (err,usuarioGuardado)=>{
			if(err){
				return res.status(500).json({
					ok:false,
					mensaje:"Error al crear el usuario"
				})

			}

			res.status(201).json({
			ok:true,
			body:usuarioGuardado
			})

		

		})
		

	})




});
module.exports=app