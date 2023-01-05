const { MongoClient } = require("mongodb");
const uri = require("./atlas_uri");

const client = new MongoClient(uri);
const dbname = "condominio";
const collection_name = "transacciones"

const transaccionesCollection = client.db(dbname).collection(collection_name)

const pipeline = [
    { $match: { monto: { $lt: 5000 } } },
    {
      $group: {
        _id: "$tipo",
        total_monto: { $sum: "$monto" },
        avg_monto: { $avg: "$monto" },
      },
    },
  ]

const main = async () => {
    try {
      await client.connect()
      console.log(`Conectado a la base de datos 🌍. \nCadena de conexión completa: ${uri}`)
      let result = await transaccionesCollection.aggregate(pipeline)
      
      for await (const doc of result) {
        console.log(doc)
      }
    } catch (err) {
      console.error(`Error al intentar conectar con la base de datos: ${err}`)
    } finally {
      await client.close()
    }
  }
  
  main()