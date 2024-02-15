const { Router } = require("express");
const { rolesPermitidos } = require("../Middlewares/validarRol");
const { check } = require("express-validator");
const { validarJWT, validarJWTClient } = require("../Middlewares/validarJWT");
const {
  ProductosGet,
  ProductosGetPorCategoria,
  ProductosPost,
  ProductosPut,
  ProductosGetPag,
  ProductosGetBuscar,
  ProductosGetFac,
  ProductosGetID
} = require("../Controllers/productoController");
const { validarCampos } = require("../Middlewares/validarCampos");

const router = Router();

router.get("/", validarJWT, rolesPermitidos("Admin", "User"), ProductosGet);

router.get("/Fac", validarJWT, rolesPermitidos("Admin", "User"), ProductosGetFac);

router.get("/mov", validarJWTClient, rolesPermitidos("Client"), ProductosGet);

router.get(
  "/mov/Pag/:pag",
  check("pag", "Pag obligatorio un entero mayor que cero").isInt(),
  validarCampos,
  validarJWTClient,
  rolesPermitidos("Client"),
  ProductosGetPag
);

router.get(
  "/mov/Buscar/:pag",
  check("pag", "Pag obligatorio un entero mayor que cero").isInt(),
  check("text", "Ingrese el texto a buscar").notEmpty(),
  validarCampos,
  validarJWTClient,
  rolesPermitidos("Client"),
  ProductosGetBuscar
);

router.get("/categoria/:categoria", ProductosGetPorCategoria);
router.get("/Buscador/:id", ProductosGetID);

router.post("/", validarJWT, rolesPermitidos("Admin", "User"), ProductosPost);

router.put("/", validarJWT, rolesPermitidos("Admin", "User"), ProductosPut);

module.exports = router;
