
// Al llamar el modelo desde server.js => this.io.on('connection', socketController ); 
// al ejecutarse esa linea, llama a todo este archivo controller.js, por lo tanto tambien 
// crea o inicializa el objeto ticketControl que a su vez dispara el constructor.

const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => { 

    // Cuando un cliente se conecta ...
    socket.emit('ultimo-ticket', ticketControl.ultimoTkt); // Enviar el ultimo ticket cuando se inicia la App
    socket.emit('estado-actual', ticketControl.ultimos4Tkt);
    socket.emit('tickets-pendientes', ticketControl.tickets.length); // Enviarle cuantos tickets pendiente quedan por atender

    // Evento que se recibe del cliente
    socket.on('siguiente-ticket', (payload, callback) => { // En el callback va cual es el ticket que debe mostrar en pantalla

        const siguiente = ticketControl.siguienteTkt(); // Devuelve un string 'Ticket ##'
        callback(siguiente);

        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => { // Asignar nuevo ticket al escritorio
        if (!escritorio) {
            return callback({ // Msg que se mostrara en la consola del navegador
                ok: false,
                msg: 'El escritorio es oblogatorio'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);


        socket.broadcast.emit('estado-actual', ticketControl.ultimos4Tkt); // Para actulizar el cambio en los ultimos cuatros en el tablero publico
        socket.emit('tickets-pendientes', ticketControl.tickets.length); // Para que se actualice el numero de pendientes en el escritorio que hizo click en atender
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length); // Para que se actualice el numero de pendientes en el resto de los escritorios

        if (!ticket) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    });
}

module.exports = {
    socketController
}