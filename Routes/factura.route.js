const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../Middlewares/validarCampos");
const { validarJWT, validarJWTClient } = require("../Middlewares/validarJWT");
const { rolesPermitidos } = require("../Middlewares/validarRol");
const {
  FaturaId,
  Faturas,
  FaturasPost,
  FaturasPostClient,
  FaturasUser,
  FaturasClient,
} = require("../Controllers/facturaController");

const router = Router();



router.get("/GetInvoiceUser", validarJWT, rolesPermitidos("User"), FaturasUser);

router.get(
  "/mov/GetInvoiceClient",
  validarJWTClient,
  rolesPermitidos("Client"),
  FaturasClient
);



router.post(
  "/mov/",
  check("IdCliente", "ID CLIENTE OBLIGATORIO").not().isEmpty(),
  check("Productos", "Productos OBLIGATORIO").not().isEmpty(),
  validarCampos,
  validarJWTClient,
  rolesPermitidos("Client"),
  FaturasPostClient
);


router.get(
  "/:id",
  validarJWT,
  rolesPermitidos("Admin", "User", "Client"),
  check("id", "ID no válido").isInt(),
  FaturaId
);

router.get("/", validarJWT, rolesPermitidos("Admin"), Faturas);

router.get(
  "/mov/:id",
  check("id", "ID no válido").isInt(),
  validarCampos,
  validarJWTClient,
  rolesPermitidos("Client"),
  FaturaId
);

router.post(
  "/",
  check("IdCliente", "ID CLIENTE OBLIGATORIO").not().isEmpty(),
  check("Productos", "Productos OBLIGATORIO").not().isEmpty(),
  validarCampos,
  validarJWT,
  rolesPermitidos("User", "Admin"),
  FaturasPost
);

module.exports = router;
