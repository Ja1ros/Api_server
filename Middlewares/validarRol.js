const { request, response } = require('express')
const ResponseApi = require("../Models/response");


const esAdminRol = (req = request, res = response, next) => {
    let responseApi = new ResponseApi();
    if(!req.UsuarioAutenticado){
        responseApi.status = 500;
        responseApi.msg = "Erro al validar el Usuario - Rol"
        return res.status(500).json(responseApi);
    }
    next();
}

const rolesPermitidos= (...roles) => {
    return (req = request, res = response, next)=>{
       
        let responseApi = new ResponseApi();
        if(!req.UsuarioAutenticado){
            responseApi.status = 500;
            responseApi.msg = "Error al validar el Usuario - Rol"
            return res.status(500).json(responseApi);
        }
        // console.log(roles)
        // console.log(req.UsuarioAutenticado.RollName)
        // console.log(roles.includes(req.UsuarioAutenticado.RollName))
        if (!roles.includes(req.UsuarioAutenticado.RollName)){
            responseApi.status = 401;
            responseApi.msg = "El usuario no puede realizar esta acción";
            return res.status(401).json(responseApi);
        }
        next()


    }
     
}

module.exports = {
    esAdminRol,
    rolesPermitidos
}