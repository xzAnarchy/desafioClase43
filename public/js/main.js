const socket = io.connect();

//------------------------------------------------------------------------------------

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value
    }
    socket.emit('update', producto);
    formAgregarProducto.reset()
})

socket.on('productos', productos => {
    // EN CASO DE USAR HTML
    renderProducts(productos)
    // makeHtmlTable(productos).then(html => {
    //     document.getElementById('productos').innerHTML = html
    // })
});

const renderProducts = (data) => {
    const html = data.map(products => {
        return (`<tr class="d-flex justify-content-between align-items-center"><td><strong>${products.title}</strong></td> <td class="d-flex justify-content-center align-items-center""><em>$${products.price}</em></td> <td class="d-flex justify-content-center"><img src="${products.thumbnail}" height="70px" width="70"></td></tr>`)
    }).join(' ')
    document.getElementById('productos').innerHTML = html
}

function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}

//-------------------------------------------------------------------------------------

// MENSAJES

/* --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- */
// Definimos un esquema de autor
const authorSchema = new normalizr.schema.Entity('authors',{}, {idAttribute:"mail"});

// Definimos un esquema de mensaje
const textSchema = new normalizr.schema.Entity('text');

// Definimos un esquema de posts
const mensajeSchema = new normalizr.schema.Entity('messages', {
    author: authorSchema,
    text: [textSchema]
})
/* ----------------------------------------------------------------------------- */

const inputUsername = document.getElementById('username')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()

    const mensaje = {
        author: {
            mail: inputUsername.value,
            name: document.getElementById('firstname').value,
            lastName: document.getElementById('lastname').value,
            age: document.getElementById('age').value,
            username: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: inputMensaje.value
    }

    socket.emit('nuevoMensaje', mensaje);
    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('mensajes', mensajesN => {
// Dernomalizamos los mensajes recibidos por el socket y los integramos al html
let mensajesDenormalized = normalizr.denormalize(mensajesN.result, [mensajeSchema], mensajesN.entities)
const html = makeHtmlList(mensajesDenormalized)
document.getElementById('mensajes').innerHTML = html;

// Guardamos el tamaño de la data y hacemos el porcentaje
let mensajesNsize = JSON.stringify(mensajesN).length
console.log(mensajesN, mensajesNsize);
let mensajesDsize = JSON.stringify(mensajesDenormalized).length
console.log(mensajesDenormalized, mensajesDsize);

// Logica del porcentaje
let porcentajeC = parseInt((mensajesNsize * 100) / mensajesDsize)
console.log(`Porcentaje de compresión ${porcentajeC}%`)
document.getElementById('compresion-info').innerText = porcentajeC
})

function makeHtmlList(mensajes) {
    return mensajes.map(mensaje => {
        return (`
        <div>
            <b style="color:blue;">${mensaje.author.mail}</b>
            [<span style="color:brown;">${mensaje.date}</span>] :
            <i style="color:green;">${mensaje.text}</i>
            <img width="50" src="${mensaje.author.avatar}" alt=" ">
        </div>
    `)
    }).join(" ");
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})
