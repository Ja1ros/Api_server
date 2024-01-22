const { response } = require("express");

const sql = require("mssql");
var config = require("../DataBase/dbconfig");

const FaturaId = async (req, res = response) => {
  const { id } = req.params;
  try {
    let pool = await sql.connect(config);
    let products = await pool
      .request()
      .query ( `SELECT f.ID, c.CedRuc, c.Direccion, c.Telefono, c.Nombres + ' ' + c.Apellidos as Cliente, FORMAT(f.Fecha, 'dd/MM/yyyy hh:mm:ss') as Fecha, ISNULL( f.Subtotal, 0) as Subtotal, ISNULL( f.Total, 0) as Total, ISNULL(f.IVA,0) as IVA from Factura as f 
      join Cliente as c on f.ID_Cliente = c.ID
      where f.estado = 1 and f.id = ${id}`  );
    let items = await pool
      .request()
      .query(` SELECT df.ID, df.ID_Fac, p.Nombre, df.Precio, df.Cant, df.SubTotal 
        from Detalle_Factura as df 
        join Producto p on df.ID_Pro = p.ID
        where Id_Fac = ${id} and df.Estado = 1 `);

    var resp = { "Factura":products.recordsets[0][0], "Detalle":  items.recordsets[0] }

    var result = [products.recordsets[0][0], items.recordsets[0]];
    pool.close();
    res.json(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

const Faturas = async (req, res = response) => {
  try {
    let pool = await sql.connect(config);
    let products = await pool
      .request()
      .query( `SELECT f.ID, c.Nombres + ' ' + c.Apellidos as Cliente, FORMAT(f.Fecha, 'dd/MM/yyyy hh:mm:ss') as Fecha, ISNULL( f.Subtotal, 0) as Subtotal, ISNULL( f.Total, 0) as Total, ISNULL(f.IVA,0) as IVA from Factura as f 
      join Cliente as c on f.ID_Cliente = c.ID
      where f.estado = 1`);
    var result = products.recordset;
    pool.close();
    res.json({
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error,
    });
  }
};


const FaturasUser = async (req, res = response) => {
  
  try {
    let pool = await sql.connect(config);
    let products = await pool
      .request()
      .input("userName", sql.NVarChar, req.UsuarioAutenticado.userName)
      .query( `SELECT f.ID, c.Nombres + ' ' + c.Apellidos as Cliente, FORMAT(f.Fecha, 'dd/MM/yyyy hh:mm:ss') as Fecha, ISNULL( f.Subtotal, 0) as Subtotal, ISNULL( f.Total, 0) as Total, ISNULL(f.IVA,0) as IVA from Factura as f 
      join Cliente as c on f.ID_Cliente = c.ID
      where f.estado = 1 and f.Usuario = @userName`);
    var result = products.recordset;
    pool.close();
    res.json({
      result,
    });
  } catch (error) {
    
    return res.status(500).json({
      msg: error,
    });
  }
};


const FaturasClient = async (req, res = response) => {
  
  try {
    let pool = await sql.connect(config);
    let products = await pool
      .request()
      .input("userName", sql.NVarChar, req.UsuarioAutenticado.Correo)
      .query( `SELECT f.ID, c.Nombres + ' ' + c.Apellidos as Cliente, FORMAT(f.Fecha, 'dd/MM/yyyy hh:mm:ss') as Fecha, ISNULL( f.Subtotal, 0) as Subtotal, ISNULL( f.Total, 0) as Total, ISNULL(f.IVA,0) as IVA from Factura as f 
      join Cliente as c on f.ID_Cliente = c.ID
      where f.estado = 1 and f.Usuario = @userName`);
    var result = products.recordset;
    pool.close();
    res.json({
      result,
    });
  } catch (error) {
    
    return res.status(500).json({
      msg: error,
    });
  }
};


async function getProductId(id) {
  try {
    let pool = await sql.connect(config);

    let products = await pool
      .request()
      .query("SELECT * from Producto where id = " + id);
    pool.close();
    return products.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function saveDetail(id, p, resultDB) {
 
  try {
    let pool = await sql.connect(config);

    let products = await pool
      .request()
      .input("Id", sql.Int, id)
      .input("ID_Pro", sql.Int, resultDB.ID)
      .input("Precio", sql.Real, resultDB.Precio)
      .input("Cant", sql.Int, p.Cantidad)
      .input("SubTotal", sql.Real, resultDB.Precio * p.Cantidad)
      .input("Des", sql.Real, resultDB.Stock - p.Cantidad)
      .input("ID_ProD", sql.Real, resultDB.ID)
      .query(
        `INSERT INTO [dbo].[Detalle_Factura]
                  ([ID_Fac]
                  ,[ID_Pro]
                  ,[Precio]
                  ,[Cant]
                  ,[SubTotal]
                  ,[Estado])
              VALUES
                  (@Id
                  ,@ID_Pro
                  ,@Precio
                  ,@Cant
                  ,@SubTotal
                  ,1); update Producto set Stock = @Des where Id = @ID_ProD `,
        (err, res) => {
          //   pool.close();
          if (err) {
            // console.log(err);
            return false;
          }
          //   console.log(res);
          return true;
        }
      );

    //   console.log(products.recordsets)

    //   return products.recordsets;
  } catch (error) {
    console.log(error);
  }
}

const FaturasPost = async (req, res = response) => {
  try {
    const { IdCliente, Productos } = req.body;
    let usuario = req.UsuarioAutenticado
    
    //let usuario = "admin";
    let sub = 0,
      total = 0,
      iva = 0.12;

    for (const p of Productos) {
      let result = await getProductId(p.Id_Pro).then((data) => {
        return data[0][0];
      });
      sub += result.Precio * p.Cantidad;
    }
    iva = sub * iva;
    total = sub + iva;
    // console.log(total.toFixed(2), iva.toFixed(2), sub.toFixed(2));

    let pool = await sql.connect(config);

    const transaction = new sql.Transaction(pool);
    await transaction.begin((err, result) => {
      // ... error checks
      let rolledBack = false;
      transaction.on("rollback", (aborted) => {
        // emited with aborted === true
        rolledBack = true;
      });

      transaction
        .request()
        .input("Id", sql.Int, IdCliente)
        .input("Total", sql.Real, total)
        .input("Iva", sql.Real, iva)
        .input("Usuario", sql.VarChar, usuario.userName)
        .input("Sub", sql.Real, sub)
        .query(
          `INSERT INTO [dbo].[Factura]
                                    ([ID_Cliente]
                                    ,[Usuario]
                                    ,[Total]
                                    ,[IVA]
                                    ,[Estado]
                                    ,[Subtotal])
                            VALUES
                                    (
                                    @Id
                                    ,@Usuario
                                    ,@Total
                                    ,@Iva
                                    ,1
                                    ,@Sub); Select Scope_Identity() as Id`,
          async (err, result) => {
            if (err) {
              if (!rolledBack) {
                transaction.rollback((err1) => {
                  // ... error checks
                  console.log(err1);
                });
                return res.status(500).json({
                  err,
                });
              }
              return res.status(400).json({
                err,
              });
            } else {
              if (result.recordset) {
                var id = result.recordset[0].Id;
                // console.log('Produictos guardar')
                for (const p of Productos) {
                  let result = await getProductId(p.Id_Pro).then((data) => {
                    return data[0][0];
                  });

                     console.log(result)
                     console.log(result.Stock, p.Cantidad)
                  if (result.Stock >= p.Cantidad && p.Cantidad > 0) {
                    // console.log("Entro");
                    // Guardar Detalle

                    let b = await saveDetail(id, p, result);
                    if (b) {
                      transaction.rollback((err1) => {
                        // ... error checks
                        console.log(err1);
                      });
                      return res.status(500).json({
                        err,
                      });
                    }

                    //let c = await updateProduct();
                  } else {
                    transaction.rollback((err1) => {
                      // ... error checks
                      console.log(err1);
                    });
                    return res.status(500).json({
                      err: "No se puede Guardar esa Cantidad",
                    });
                  }
                }

                transaction.commit((err) => {});
                return res.json({
                  msg: "Se guardo",
                });
              }
            }
          }
        );
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

const FaturasPostClient = async (req, res = response) => {
  try {
    const { IdCliente, Productos } = req.body;
    let usuario = req.UsuarioAutenticado
    
    //let usuario = "admin";
    let sub = 0,
      total = 0,
      iva = 0.12;

    for (const p of Productos) {
      let result = await getProductId(p.Id_Pro).then((data) => {
        return data[0][0];
      });
      sub += result.Precio * p.Cantidad;
    }
    iva = sub * iva;
    total = sub + iva;
    // console.log(total.toFixed(2), iva.toFixed(2), sub.toFixed(2));

    let pool = await sql.connect(config);

    const transaction = new sql.Transaction(pool);
    await transaction.begin((err, result) => {
      // ... error checks
      let rolledBack = false;
      transaction.on("rollback", (aborted) => {
        // emited with aborted === true
        rolledBack = true;
      });

      transaction
        .request()
        .input("Id", sql.Int, IdCliente)
        .input("Total", sql.Real, total)
        .input("Iva", sql.Real, iva)
        .input("Usuario", sql.VarChar, usuario.Correo)
        .input("Sub", sql.Real, sub)
        .query(
          `INSERT INTO [dbo].[Factura]
                                    ([ID_Cliente]
                                    ,[Usuario]
                                    ,[Total]
                                    ,[IVA]
                                    ,[Estado]
                                    ,[Subtotal])
                            VALUES
                                    (
                                    @Id
                                    ,@Usuario
                                    ,@Total
                                    ,@Iva
                                    ,1
                                    ,@Sub); Select Scope_Identity() as Id`,
          async (err, result) => {
            if (err) {
              if (!rolledBack) {
                transaction.rollback((err1) => {
                  // ... error checks
                  console.log(err1);
                });
                return res.status(500).json({
                  err,
                });
              }
              return res.status(400).json({
                err,
              });
            } else {
              if (result.recordset) {
                var id = result.recordset[0].Id;
                // console.log('Produictos guardar')
                for (const p of Productos) {
                  let result = await getProductId(p.Id_Pro).then((data) => {
                    return data[0][0];
                  });

                  //   console.log(result)
                  //   console.log(result.Stock, p.Cantidad)
                  if (result.Stock >= p.Cantidad && p.Cantidad > 0) {
                    // console.log("Entro");
                    // Guardar Detalle

                    let b = await saveDetail(id, p, result);
                    if (b) {
                      transaction.rollback((err1) => {
                        // ... error checks
                        console.log(err1);
                      });
                      return res.status(500).json({
                        err,
                      });
                    }

                    //let c = await updateProduct();
                  } else {
                    transaction.rollback((err1) => {
                      // ... error checks
                      console.log(err1);
                    });
                    return res.status(500).json({
                      err: "No se puede Guardar esa Cantidad",
                    });
                  }
                }

                transaction.commit((err) => {});
                return res.json({
                  msg: "Se guardo",
                });
              }
            }
          }
        );
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error,
    });
  }
};


module.exports = {
  FaturaId,
  Faturas,
  FaturasPost,
  FaturasPostClient,
  FaturasUser,
  FaturasClient
};
