import { Usuario } from "../domain/usuarios/Usuario.js"
import { TipoUsuario } from "../domain/usuarios/enum_tiposUsuario.js"
import { UsuarioNoEncontradoError } from "../errors/usuariosErrors/UsuarioNoEncontradoError.js"
import { UsuariosNoExistenError } from "../errors/usuariosErrors/UsuariosNoExistenError.js"
import { ProductoRepository } from "../repositories/productoRepository.js"
import { ProductoService } from "./productoService.js"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { CredencialesInvalidasError } from '../errors/usuariosErrors/CredencialesInvalidasError.js'

class UsuarioService {
    constructor(usuarioRepository, notificacionService = null) {
        this.repoUsuarios = usuarioRepository
        this.notificacionService = notificacionService
        this.JWT_SECRET = process.env.JWT_SECRET || "mi_secreto"; // ✅ válido
    }



    createUser(user) {
        return bcrypt.hash(user.password, 10)
            .then(hashedPassword => {
                // Reemplazamos la contraseña por la encriptada
                user.password = hashedPassword;
                // Guardamos el usuario en la base de datos
                return this.repoUsuarios.save(user);
            })
            .catch(err => {
                // Manejo de errores
                console.error("Error al hashear la contraseña:", err);
                throw err; // para que el error se propague
            });
    }

    findAll() {
        return this.repoUsuarios.findAll()
            .then(users => {
                if (users.length === 0) {
                    throw new UsuariosNoExistenError()
                }
                return users
            })
            .catch(error => {
                throw error
            })
    }

    find(id) {
        return this.repoUsuarios.findById(id)
            .then(userFounded => {
                if (!userFounded) {
                    throw new UsuarioNoEncontradoError(id)
                }
                return userFounded
            })
            .catch(error => {
                throw error
            })
    }

    getNotificaciones(usuarioId, filtros = {}) {
        if (!this.notificacionService) {
            throw new Error('NotificacionService no está disponible')
        }

        // Asegurar que el filtro incluya el usuario destino
        const filtrosCompletos = { ...filtros, usuarioDestino: usuarioId };

        return this.notificacionService.findByFilters(filtrosCompletos);
    }

    login(credenciales) {
        return this.repoUsuarios.findByEmail(credenciales.email)
            .then(userFounded => {
                if (!userFounded) {
                    throw new CredencialesInvalidasError()
                }
                return bcrypt.compare(credenciales.password, userFounded.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            throw new CredencialesInvalidasError()
                        }
                        return {
                            token: jwt.sign(
                                { _id: userFounded._id, email: userFounded.email, nombre: userFounded.nombre, tipo: userFounded.tipo },
                                this.JWT_SECRET,
                                { expiresIn: "1h" }
                            )
                        }
                    })
            }).catch(error => {
                throw error
            })
    }
}

export { UsuarioService }