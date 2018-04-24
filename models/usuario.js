var mongoose = require('mongoose')
var esquema  = mongoose.Schema

var usuarioSchema = new esquema({
	nombre:{type:String,require:[true,'El nombre es necesario']},
	email:{type:String,unique:true,require:[true,'El correo es necesario']},
	password:{type:String,require:[true,'La clave es necesario']},
	img:{type:String,require:false},
	role:{type:String,require:true,default:'USER_ROLE'},

});
/*Exportar el esquema para poder usarlo en otro lugar, le asigno un nombre que
sera la referencia 

*/
module.exports=mongoose.model('Usuario',usuarioSchema)