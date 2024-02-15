const config = {
  user: "Asesja_SQLLogin_3",
  password: "uo942gdhnr",
  database: "SearchBD",
  server: "SearchBD.mssql.somee.com",
  /*user: "sa",
  password: "123",
  database: "ProductsBD",
  server: "OMEN\\SQLEXPRESS",*/
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

module.exports = config;
