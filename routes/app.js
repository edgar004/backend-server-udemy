var exprees= require('express')
var app=exprees()

app.get('/',(req,res,next)=>{
	res.status(200).json({
		ok:true,
		mensaje:'Peticion realizada correctamente'
	})

});
module.exports=app