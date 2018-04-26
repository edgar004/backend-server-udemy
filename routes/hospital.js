var express=require('express')
var app=express()
var hospitalSchema=require('../models/hospital')
var validarToken=require('../middlewares/autenticacion')

//Traer hospitales
app.get('/',(req,res)=>{
	let desde = req.query.desde || 0
	desde=Number(desde)
	hospitalSchema.find({},'nombre img usuario')
	.skip(desde)
	.limit(5)
	.populate('usuario','nombre email')
	.exec(
		(err,hospital)=>{
			if(err){
				return res.status(500).json({
					ok:false,
					mensaje:'Error a traer los hospitales',
					errors:err
				})
			}
			hospitalSchema.count({},(err,conteo)=>{
				res.status(200).json({
				ok:true,
				hospitales:hospital,
				total:conteo
			})
			})

			

		})

})

//Crear hospital 
app.post('/', validarToken.verificaToken,(req,res)=>{
	let body=req.body
	var hospital = new hospitalSchema({
		nombre:body.nombre,
		img:body.img,
		usuario:req.usuarioToken._id
	})
	hospital.save((err,hospitalGuardado)=>{
		if(err){
			return res.status(400).json({
				ok:false,
				mensaje:"Error al crear el hospital",
				erros:err
			})
		}

		res.status(201).json({
			ok:true,
			hospital:hospitalGuardado,
			usuario:req.usuarioToken
		})
	})
})


//Actualizar el hospital
app.put('/:id',validarToken.verificaToken,(req,res)=>{
	let id=req.params.id
	let body=req.body
	hospitalSchema.findById(id,(err,hospitalDB)=>{
		if(err){
			return res.status(500).json({
				ok:false,
				mensaje:"Error al buscar el hospital",
				erros:err
			})
		}
		if(!hospitalDB){
			return res.status(400).json({
				ok:false,
				mensaje:"No existe el hospital con el id " + id,
				errors:{ message:'no existe un hospital con ese id' }
			})
		}
		hospitalDB.nombre=body.nombre
		hospitalDB.usuario=req.usuarioToken._id

		hospitalDB.save( (err,hospitalModificado)=>{
			if(err){
				return res.status(400).json({
					ok:false,
					mensaje:"Error al actualizar el hospital",
					errors:err
				})
			}

			res.status(200).json({
				ok:true,
				hospital:hospitalModificado
			})
		})

	})	

})

//Borrar el hospital

app.delete('/:id',validarToken.verificaToken ,(req,res)=>{
	var id=req.params.id
	hospitalSchema.findByIdAndRemove(id,(err,hospitalBorrado)=>{
		if(err){
			return res.status(500).json({
				ok:false,
				message:"Error al borrar el usuario",
				errors:err
			})
		}

		if(!hospitalBorrado){
			return res.status(400).json({
				ok:false,
				mensaje:"No existe un hospital con el id "  + id,
				errors:err
			})
		}

		res.status(200).json({
			ok:true,
			hospital:hospitalBorrado
		})
	})

})




module.exports=app