var exprees= require('express')
var app=exprees()
var hospitalSchema=require('../models/hospital')
var medicoSchema=require('../models/medico')
var usuarioSchema=require('../models/usuario')
app.get('/todo/:busqueda',(req,res,next)=>{
	var  busqueda=req.params.busqueda
	var regx= new RegExp(busqueda,'i')

	Promise.all([buscarHospital(regx),buscarMedicos(regx),buscarUsuarios(regx)]).then(respuesta=>{
		res.status(200).json({
			ok:true,
			hospitales:respuesta[0],
			medicos:respuesta[1],
			usuarios:respuesta[2]
		})

	})
	

});

function buscarHospital(regx){

	return new Promise((resolve,reject)=>{
		hospitalSchema.find({nombre:regx})
		.populate('usuario','nombre email')
		.exec((err,hospitales)=>{
		if(err){
			reject('Error al cargar los hospitales')
		}else{
			resolve(hospitales)
		}

	})
	})
}

function buscarMedicos(regx){

	return new Promise((resolve,reject)=>{
		medicoSchema.find({nombre:regx})
		.populate('usuario','nombre email')
		.exec((err,medicos)=>{
		if(err){
			reject('Error al cargar los medicos')
		}else{
			resolve(medicos)
		}

	})
	})
}

//Buscar usuarios por nombre oh email
function buscarUsuarios(regx){

	return new Promise((resolve,reject)=>{
		usuarioSchema.find({},'nombre email role').or([{'nombre':regx},{'email':regx}])
		.exec((err,usuarios)=>{
			if(err){
				reject('Error al buscar usuarios')
			}else{
				resolve(usuarios)

			}

		})
	})
}




//Busqueda por una coleccion especifica
app.get('/coleccion/:tabla/:busqueda',(req,res)=>{
	let tabla=req.params.tabla
	var  busqueda=req.params.busqueda
	var regx= new RegExp(busqueda,'i')
	if(tabla=="medico"){
		buscarMedicos(regx).then(medicos=>{
			res.status(200).json({
				ok:true,
				medicos:medicos
			})
		})
	}else if(tabla=="usuario"){
		buscarUsuarios(regx).then(usuarios=>{
			res.status(200).json({
				ok:true,
				usuario:usuarios
			})
		})
	}else if(tabla=="hospital"){

		buscarHospital(regx).then(hospitales=>{
			res.status(200).json({
				ok:true,
				hospital:hospitales
			})
		})

	}else{
		return res.status(400).json({
			ok:false,
			mensaje:"Solo puede buscar usuarios, medicos o hospitales"
		})
	}

})
module.exports=app