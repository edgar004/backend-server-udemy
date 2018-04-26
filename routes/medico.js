var express=require('express')
var app=express()
var medicolSchema=require('../models/medico')
var hospitalSchema=require('../models/hospital')
var validarToken=require('../middlewares/autenticacion')
var validarHospital=require('./hospital')


app.get('/', (req,res)=>{
	let desde = req.query.desde || 0
	desde=Number(desde)
medicolSchema.find({},'nombre img usuario hospital')
.populate('usuario','nombre email')
.populate('hospital')
.skip(desde)
.limit(5)
.exec(
	(err,medico)=>{
		if(err){
			return res.status(500).json({
				ok:false,
				mensaje:"Error al traer los medicos",
				erros:err
			})
		}
		medicolSchema.count({},(err,conteo)=>{
			res.status(200).json({
			ok:true,
			medico:medico,
			total:conteo
		})

		})

		

})

})




//Agregar medico 
app.post('/', validarToken.verificaToken, (req,res)=>{
	let body=req.body
	let id = body.hospital
		//Verificar hospital
	hospitalSchema.findById(id , (err,hospital)=>{

		if(!hospital){
			return res.status(400).json({
				ok:false,
				mensaje:"No existe un hospital con el id " + id,
				errors:{message:'No existe un hospital con ese id'}
			})
		}
		
		let medico= new medicolSchema({
		nombre:body.nombre,
		img:body.img,
		usuario:req.usuarioToken._id,
		hospital:body.hospital
	})
	medico.save( (err,medicoGuardado)=>{
		if(err){
			return res.status(500).json({
				ok:false,
				mensaje:"Error al crear el medico",
				erros:err
			})
		}

		res.status(201).json({
			ok:true,
			medico:medicoGuardado
		})
	})
		
	})

	



})

//Actualizar medicos
app.put('/:id',validarToken.verificaToken,(req,res)=>{
	let body=req.body
	let id=req.params.id
	medicolSchema.findById(id,(err,medicoDB)=>{
		if(err){
			return res.status(500).json({
				ok:false,
				mensaje:"Error al buscar el medico",
				errors:err
			})
		}

		if(!medicoDB){
			return res.status(400).json({
				ok:false,
				mensaje:"No existe un medico con el id " + id,
				errors:{message:"No existe un medico con ese id"}
			})
		}
		


		hospitalSchema.findById(body.hospital , (err,hospital)=>{

		if(!hospital){
			return res.status(400).json({
				ok:false,
				mensaje:"No existe un hospital con el id " + body.hospital,
				errors:{message:'No existe un hospital con ese id'}
			})
		}

		medicoDB.nombre=body.nombre
		medicoDB.usuario=req.usuarioToken._id
		medicoDB.hospital=body.hospital

		medicoDB.save( (err,medicoModificando)=>{
			if(err){
				return res.status(500).json({
					ok:false,
					mensaje:"Error al modificar el medico",
					errors:err
				})
			}

			res.status(200).json({
				ok:true,
				medico:medicoModificando
			})



		})


	})

		


	})

})



//Eliminar medicos
app.delete('/:id',validarToken.verificaToken,(req,res)=>{
	let id=req.params.id
	medicolSchema.findByIdAndRemove(id,(err,medicoBorrado)=>{
		if(err){
			return res.status(500).json({
				ok:false,
				mensaje:"Error al borrar el medico",
				errors:err
			})
		}

		if(!medicoBorrado){
			return  res.status(400).json({
				ok:false,
				mensaje:"No existe un medico con el id " +id,
				errors:{message:'No existe un medico con ese id'}

			})
		}

		res.status(200).json({
			ok:true,
			medico:medicoBorrado
		})
	})
})

module.exports=app