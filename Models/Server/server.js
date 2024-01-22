const express = require('express');
var cors = require('cors');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            productos: '/api/products',
            clientes: '/api/clients',
            factura: '/api/invoice',
            usuarios: '/api/users',
            auth: '/api/auth',

            
        }

        // Middelwares
        this.middlewares();
        // Rutas
        this.routes();
    }

    start(){
        this.app.listen(this.port, ()=>{
            console.log('Server Run PORT: ', this.port)
        });
    }

    middlewares(){
        // Lectura Parseo Body
        this.app.use(express.json());
        // CORS
        this.app.use(cors({origin: true, credentials:true}));
        // Directorio
        this.app.use(express.static('Public'));
    }

    routes(){
        this.app.use(this.paths.productos, require('../../Routes/productos.route.js'));
        this.app.use(this.paths.clientes, require('../../Routes/clientes.route'));
        this.app.use(this.paths.factura, require('../../Routes/factura.route.js'));
        this.app.use(this.paths.usuarios, require('../../Routes/usuario.route.js'));
        this.app.use(this.paths.auth, require('../../Routes/auth.route'));
    }
}

module.exports = Server;