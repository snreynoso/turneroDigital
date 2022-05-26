const path = require('path');
const fs   = require('fs');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {
        this.ultimoTkt   = 0;
        this.hoy         = new Date().getDate();
        this.tickets     = [];
        this.ultimos4Tkt = [];

        this.init(); // Para que lea los datos de data.json e inicialice data
    }

    get toJson() {
        return {
            ultimoTkt   : this.ultimoTkt, 
            hoy         : this.hoy,
            tickets     : this.tickets,
            ultimos4Tkt : this.ultimos4Tkt  
        }
    }

    init() {
        const {hoy, ultimoTkt, tickets, ultimos4Tkt}  = require('../db/data.json');

        if(hoy === this.hoy) {
            this.tickets     = tickets;
            this.ultimoTkt   = ultimoTkt;
            this.ultimos4Tkt = ultimos4Tkt;
        } else { // Es un nuevo dia
            this.guardarDB();
        }
    }

    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguienteTkt() {
        this.ultimoTkt += 1;
        const ticket = new Ticket(this.ultimoTkt, null);
        this.tickets.push(ticket);

        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket(escritorio) {
        // No hay tickets por atender
        if(this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift(); // Remueve this.tickets[0] y lo retorna
       
        ticket.escritorio = escritorio;
        console.log(ticket);
        this.ultimos4Tkt.unshift(ticket); // Suma elemento nuevo al inicio del arreglo

        if(this.ultimos4Tkt.length > 4) { // Mantener no mas de 4 tickets en el arreglo
            this.ultimos4Tkt.splice(-1, 1); // Eliminar uno contando desde el ultimo 
        }

        this.guardarDB();

        return ticket;
    }
}

module.exports = TicketControl;