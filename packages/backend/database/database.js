import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
const URI_DB = process.env.URI_DB

const connectDB = () => {
    return mongoose.connect(URI_DB)
        .then(() => {
            console.log("Base de datos conectada correctamente")
        })
        .catch(error => {
            console.log("Error al conectarse a la base de datos")
            throw error
        })
}

export { connectDB }












