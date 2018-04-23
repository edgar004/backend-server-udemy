// Los requires , importancion de libreria
var express=require('express')
var mongoose = require('mongoose')

// Iniciarlizar variable
var app=express()

//Conexion a la base de datos 
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
	//si hay un error detiente todo
	if(err) throw err;

	console.log("Base de datos correctamente")

})

//Rutas








// app.get('/',(req,res,next)=>{
// 	res.status(200).json({
// 		ok:true,
// 		mensaje:'Peticion realizada correctamente'
// 	})

// });

//escuachar peticiciones
app.listen(3000,()=>{
	console.log('Express server online')
})