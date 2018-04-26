var exprees= require('express')
var fileUpload = require('express-fileupload');
//FileSystem para borrar img
var fs=require('fs')
var app=exprees()
var usuarioSchema=require('../models/usuario')
var medicoSchema=require('../models/medico')
var hospitalSchema=require('../models/hospital')
app.use(fileUpload());

app.put('/:tipo/:id',(req,res,next)=>{
	var tipo=req.params.tipo
	var id=req.params.id
	var tiposValidos=['hospitales','medicos','usuarios']

	if(tiposValidos.indexOf(tipo)<0){
		return res.status(400).json({
			ok:false,
			mensaje:"Tipo de coleccion no es valida",
			errors:{message:"Tipo de coleccion no es valida"}

		})
	}

	if(!req.files){
		return res.status(400).json({
			ok:false,
			mensaje:"No selecciono un archivo",
			errors:{message:"Debe seleccionar una imagen"}

		})
	}

	//Obtener nombre del archivo
	var archivo=req.files.imagen
	var nombreCortado=archivo.name.split(".")
	var extesionArchivo=nombreCortado[nombreCortado.length-1]
	//Solo estas extensiones aceptamos
	var extensionesValidas=['png', 'jpg', 'gif', 'jpeg']
	 if(extensionesValidas.indexOf(extesionArchivo)<0){
	 	return res.status(400).json({
			ok:false,
			mensaje:"Extension no valida",
			errors:{message:"La extensiones validas son " + extensionesValidas.join(', ')}

		})

	 }
//Cambiar nombre al archivo
var nombreArchivo=`${id}-${new Date().getMilliseconds()}.${extesionArchivo}`
//Mover el archivo del temporal a una ruta
var path=`./uploads/${tipo}/${nombreArchivo}`
	archivo.mv(path,err=>{
		if(err){
			return res.status(500).json({
			ok:false,
			mensaje:"Error al mover el archivo",
			errors:err

		})

		}
		subirPorTipo(tipo,id,nombreArchivo,res)

	

	})

	

});

function subirPorTipo(tipo,id,nombreArchivo,res){
	if(tipo==='usuarios'){
		usuarioSchema.findById(id,(err,usuarioDB)=>{
			var pathViejo=`./uploads/usuarios/${usuarioDB.img}`
			if(fs.existsSync(pathViejo)){
				fs.unlink(pathViejo)
			}
			usuarioDB.img=nombreArchivo

			usuarioDB.save( (err,usuarioActualizado)=>{
				usuarioActualizado.password=":)"
				return res.status(200).json({
				ok:true,
				mensaje:"Foto del usuario actualizado correctamente",
				usuarioActualizado:usuarioActualizado
			})

			})


		})

	}
	if(tipo==='medicos'){
		medicoSchema.findById(id,(err,medicoDB)=>{
			var pathViejo=`./uploads/medicos/${medicoDB.img}`
			if(fs.existsSync(pathViejo)){
				fs.unlink(pathViejo)
			}

			medicoDB.img=nombreArchivo
			medicoDB.save( (err,medicoActualizado)=>{
				return res.status(200).json({
					ok:true,
					mensaje:"Foto del medico actualizado correctamente",
					medicoActualizado:medicoActualizado
				})
			})
		})
		
	}

	if(tipo==='hospitales'){
		hospitalSchema.findById(id,(err,hospitalDB)=>{
		var pathViejo=`./uploads/hospitales/${hospitalDB.img}`
			if(fs.existsSync(pathViejo)){
				fs.unlink(pathViejo)
			}
			hospitalDB.img=nombreArchivo
			hospitalDB.save( (err,hospitalACtualizado)=>{
				return res.status(200).json({
					ok:true,
					mensaje:"Foto del hospital actualizado correctamente",
					hospitalACtualizado:hospitalACtualizado

				})
			})

		})

		
	}


}
module.exports=app