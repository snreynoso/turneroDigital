// Referencias HTML
const btnCrear       = document.querySelector('button');
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnCrear.disabled = true;
});

// Escuchar si hay nuevo ticket
socket.on('ultimo-ticket', (ultimoTkt) => {
    lblNuevoTicket.innerText = 'Ticket ' + ultimoTkt;
});

btnCrear.addEventListener('click', () => {
    socket.emit('siguiente-ticket', null, (ticket) => { // (ticket) => Callback con string "Ticket ##"
        lblNuevoTicket.innerText = ticket;
    });
});