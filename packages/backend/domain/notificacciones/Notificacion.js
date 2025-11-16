export class Notificacion {
    constructor(id, usuarioDestino, mensaje, fechaAlta) {
        this.id = id;
        this.usuarioDestino = usuarioDestino;
        this.mensaje = mensaje;
        this.fechaAlta = fechaAlta;
        this.leida = false;
        this.fechaLeida = "";
    }

    marcarComoLeida() {
        this.leida = true;
        this.fechaLeida = new Date();
    }
}