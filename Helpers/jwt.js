
const jwt = require('jsonwebtoken');
//JWT para web
const GenerarJWT = (uid = '') => {
    return new Promise ((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.secret,{
            expiresIn: '6h'
        }, (err, token) => {
            if(err){
                reject('No se pudo generar token')
            }else {
                resolve(token)
            }
        })
    })
}
//JWT para movil
const GenerarJWTClient = (uid = '') => {
    return new Promise ((resolve, reject) => {
        const payload = { uid };//la informacion que se va a guardar
        jwt.sign(payload, process.env.secret,{
            expiresIn: '6h'
        }, (err, token) => {
            if(err){
                reject('No se pudo generar token')
            }else {
                resolve(token)
            }
        })
    })
}

module.exports = {
    GenerarJWT,
    GenerarJWTClient
}