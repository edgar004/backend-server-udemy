var jwt=require('jsonwebtoken')
var SEED=require('../config/config').SEED




exports.verificaToken=function(req,res,next){
	//Validar Token

	var token=req.query.token
	jwt.verify(token,SEED,(err,decode)=>{
		if(err){
			return res.status(401).json({
				ok:false,
				mensaje:"Token no valido",
				error:err
			})
		}
		req.usuarioToken=decode.usuario
		next()
	})


}



