import { UsuarioModel } from "../schemas/usuarioSchema.js"

class UsuarioRepository {
    constructor() {
        // this.usuarios = []
        // this.nextId = 1
        this.model = UsuarioModel
    }

    save(usuario) {
        let nuevo_usuario = new this.model(usuario)
        return nuevo_usuario.save()
    }

    findAll() {
        return this.model.find()
    }

    findById(id) {
        // const idNumber = Number(id)
        // return this.usuarios.find(user => Number(user.id) === idNumber)
        return this.model.findById(id)
    }

    findByEmail(email) {
        return this.model.findOne({ email: email })
    }
}

export { UsuarioRepository }