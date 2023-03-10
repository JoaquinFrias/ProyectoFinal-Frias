//DATOS JSON Y FETCH

const url = "./data/data.json";
fetch(url)
.then(res => res.json())
.then(data => {    
    renderizarProductos(data)
    prods = data;    
})

//VARIABLES

let carrito = [];
let prods = 0;
const contenedor = document.querySelector("#contenedor");
const carritoContenedor = document.querySelector("#carritoContenedor");
const vaciarCarrito = document.querySelector("#vaciarCarrito");
const precioTotal = document.querySelector("#precioTotal");
const activarFuncion = document.querySelector("#activarFuncion");
const procesarCompra = document.querySelector("#procesarCompra");
const totalProceso = document.querySelector("#totalProceso");
const formulario = document.querySelector('#procesar-pago')

//FUNCIONES DEL CARRITO

if (activarFuncion) {
    activarFuncion.addEventListener("click", procesarPedido);
}

document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    mostrarCarrito();
    document.querySelector("#activarFuncion").click(procesarPedido);
});

if(formulario){
    formulario.addEventListener('submit', enviarCompra)
}


if (vaciarCarrito) {
    vaciarCarrito.addEventListener("click", () => {
    carrito.length = [];
    mostrarCarrito();
    });
}

if (procesarCompra) {
    procesarCompra.addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire({
            title: "¡Tu carrito está vacio!",
            text: "Compra algo para continuar con la compra",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
    } else {
        location.href = "compra.html";
    }
    });
}

//RENDERIZAR PRODUCTOS HTML

function renderizarProductos(productos){
    const { id, nombre, precio, desc, img, cantidad } = productos;
    productos.forEach((prod) => {
    contenedor.innerHTML += `
        <div class="card mt-3" style="width: 18rem;">
        <img class="card-img-top mt-2 imagen" src="${prod.img}" alt="Card image cap">
        <div class="card-body">
        <h5 class="card-title">${prod.nombre}</h5>
        <p class="card-text">Precio: ${prod.precio}$</p>
        <p class="card-text">Descripcion: ${prod.desc}</p>
        <p class="card-text">Cantidad: ${prod.cantidad}</p>
        <button class="btn btn-primary" onclick="agregarProducto(${prod.id})">Comprar Producto</button>
        </div>
        </div>
    `
    
    })

}


//FUNCION AGREGAR PRODUCTOS AL CARRITO
function agregarProducto(id){
    const existe = carrito.some(prod => prod.id === id)
    if(existe){
        
        const prod = carrito.map(prod => {
            if(prod.id === id){
                prod.cantidad++
            }
        })
    } else {
        const elemento = prods.find((producto) => producto.id === id)
        carrito.push({
            ...elemento,
            numeroDeUnidades: 1,
        })
    }

    mostrarCarrito();
}

//CARRITO HTML
const mostrarCarrito = () => {
    const modalBody = document.querySelector(".modal .modal-body");
    if (modalBody) {
        modalBody.innerHTML = "";
        carrito.forEach((prod) => {
            const { id, nombre, precio, desc, img, cantidad } = prod;
            console.log(modalBody);
            modalBody.innerHTML += `
            <div class="modal-contenedor">
            <div>
            <img class="img-fluid img-carrito" src="${img}"/>
            </div>
            <div>
            <p>Producto: ${nombre}</p>
            <p>Precio: ${precio}</p>
            <p>Cantidad :${cantidad}</p>
            <button class="btn btn-danger"  onclick="eliminarProducto(${id})">Eliminar producto</button>
            </div>
            </div>
            `;
        });
    }

    if (carrito.length === 0) {
        console.log("Nada");
        modalBody.innerHTML = `
        <p class="text-center text-primary parrafo">¡Aun no agregaste nada!</p>
        `;
    } else {
        console.log("Algo");
    }
    carritoContenedor.textContent = carrito.length;

    if (precioTotal) {
        precioTotal.innerText = carrito.reduce(
        (acc, prod) => acc + prod.cantidad * prod.precio,
        0
        );
    }

    guardarStorage();
};

function guardarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarProducto(id) {
    const prodId = id;
    carrito = carrito.filter((prod) => prod.id !== prodId);
    mostrarCarrito();
}

function procesarPedido() {
    carrito.forEach((prod) => {
        const listaCompra = document.querySelector("#lista-compra tbody");
        const { id, nombre, precio, img, cantidad } = prod;
        if (listaCompra) {
            const row = document.createElement("tr");
            row.innerHTML += `
                <td>
                <img class="img-fluid img-carrito" src="${img}"/>
                </td>
                <td>${nombre}</td>
                <td>${precio}</td>
                <td>${cantidad}</td>
                <td>${precio * cantidad}</td>
                `;
            listaCompra.appendChild(row);
        }
    });
    totalProceso.innerText = carrito.reduce(
    (acc, prod) => acc + prod.cantidad * prod.precio,
    0
    );
}

//FUNCION COMPRA FINALIZADA / ERROR
function enviarCompra(e){
    e.preventDefault()
    const cliente = document.querySelector('#cliente').value
    const email = document.querySelector('#correo').value

    if(email === '' || cliente == ''){
        Swal.fire({
        title: "¡Debes completar tu email y nombre!",
        text: "Rellena el formulario",
        icon: "error",
        confirmButtonText: "Aceptar",
        })
    } else {
        
        const btn = document.getElementById('button');

        btn.value = 'Enviando...';

        const serviceID = 'default_service';
        const templateID = 'template_qxwi0jn';

        emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            btn.value = 'Finalizar compra';
            Swal.fire({
                position: 'top-front',
                icon: 'success',
                title: 'Correo enviado',
                showConfirmButton: false,
                timer: 1500
            })
        }, (err) => {
            btn.value = 'Finalizar compra';
            alert(JSON.stringify(err));
            }
        );

        const spinner = document.querySelector('#spinner')
        spinner.classList.add('d-flex')
        spinner.classList.remove('d-none')

        setTimeout(() => {
            spinner.classList.remove('d-flex')
            spinner.classList.add('d-none')
            formulario.reset()

        const alertExito = document.createElement('p')
        alertExito.classList.add('alert', 'alerta', 'd-block', 'text-center', 'col-12', 'mt-2', 'alert-success')
        alertExito.textContent = 'Compra realizada correctamente'
        formulario.appendChild(alertExito)

        setTimeout(() => {
            alertExito.remove()
        }, 3000)
        }, 3000)
    }
    localStorage.clear()

}

