export class Usuario {
    constructor(id, nombre, email, password, telefono, tipo) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.telefono = telefono;
        this.tipo = tipo;
        this.fechaAlta = new Date();
    }
}