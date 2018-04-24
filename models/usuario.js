var mongoose = require('mongoose')
var esquema  = mongoose.Schema
var uniqueValidator=require('mongoose-unique-validator')

var rolesValidos={
	values:['ADMIN_ROLE','USER_ROLE'],
	message:'{VALUE} no es un rol permitido' 
}

var usuarioSchema = new esquema({
	nombre:{type:String,required:[true,'El nombre es necesario']},
	email:{type:String,unique:true,required:[true,'El correo es necesario']},
	password:{type:String,required:[true,'La clave es necesario']},
	img:{type:String,required:false},
	role:{type:String,required:true,default:'USER_ROLE',enum:rolesValidos},


});
//PATH es la propiedad que debe ser unica
usuarioSchema.plugin(uniqueValidator,{message:'El {PATH} debe ser unico'} )

/*Exportar el esquema para poder usarlo en otro lugar, le asigno un nombre que
sera la referencia 

*/
module.exports=mongoose.model('Usuario',usuarioSchema)