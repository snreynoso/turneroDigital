// Referncias HTML
const lblEscritorio = document.querySelector('h1'); // El primer h1 que encuentre
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escriotiro es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;
});

// Escuchar si hay tickets pendientes
socket.on('tickets-pendientes', (pendientes) => {
    if(pendientes === 0) {
        lblPendientes.style.display = 'none';
    } else {
        divAlerta.style.display = 'none';
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
    }
});

btnAtender.addEventListener('click', () => {
    socket.emit('atender-ticket', { escritorio }, ({ ok, ticket, msg }) => {
        if (!ok) {
            lblTicket.innerText = 'nadie';
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = 'Ticket ' + ticket.numero;
    });
});