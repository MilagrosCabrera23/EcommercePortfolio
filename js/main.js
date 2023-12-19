
let dataProductos;
let productosFavoritos = []

document.addEventListener("DOMContentLoaded", function () {

    productosFavoritos = JSON.parse(localStorage.getItem("ProductoFavorito")) || [];

    fetch("../js/productos.json")
        .then((rta) => rta.json())
        .then(data => {
            dataProductos = data;
            mostrarProductos(dataProductos);
            buscarPalabraClave(busqueda.value, dataProductos);

        })
        .catch(err => { console.log('Error al cargar el archivo JSON de productos: ', err); });


    const productos = document.getElementById("productos");

    function mostrarProductos(array) {
        productos.innerHTML = "";
        array.forEach((producto) => {
            const divCardProd = document.createElement("div");
            divCardProd.className = "card text-center";
            divCardProd.id = `card${producto.id}`;
            divCardProd.style = "width: 13rem; ";
            divCardProd.innerHTML = `
            <div class="container">
                <img class="card-img" src="${producto.thumbnail}" alt="${producto.thumbnail} de ${producto.category}">
                <i class="fas fa-heart" id="productosFavoritos${producto.id}"></i>
                <div class="card-body-bg">
                    <p class="card-title m-1">${producto.title}</p>
                    <h6 class="price-card">$${producto.price}</h6>
                    <button id="detallesProducto${producto.id}" class="btn btn-color btn-success text-white">Ver detalles</button>
                </div>
            </div>
        `;

            productos.appendChild(divCardProd);

            // Codeando boton
            let verDetalles = document.getElementById(`detallesProducto${producto.id}`);
            verDetalles.addEventListener("click", () => {
                window.location.href = `detalleProductos.html?id=${producto.id}`;
            });


            let productoFavorito = document.getElementById(`productosFavoritos${producto.id}`);

            productoFavorito.addEventListener("click", () => {
                console.log("Producto agregado a favoritos correctamente.");
                agregarAFavoritos(producto);
                mostrarProductosFavoritos(productosFavoritos);
            });
        });
    }
});


//  

/*FUNCIONES DE AGREGAR A FAVORITOS: */
function agregarAFavoritos(array) {
    let productoFavorito = productosFavoritos.find((object) => object.id === array.id)

    if (productoFavorito === undefined) {

        productosFavoritos.push(array)

        localStorage.setItem("ProductoFavorito", JSON.stringify(productosFavoritos))


        Swal.fire({
            text: `El producto ${array.title} ha sido agregado a Favoritos`,
            position: 'center',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        })
    }
    else {
        Swal.fire({
            title: `El producto ya existe en Favoritos`,
            icon: "error",
            timer: 1400,
            showConfirmButton: false
        });
    }
}

let bodyDeFavoritos = document.getElementById("bodyDeFavoritos");

function mostrarProductosFavoritos(array) {
    bodyDeFavoritos.innerHTML = "";

    if (array.length >= 1) {
        array.forEach(productoFav => {
            bodyDeFavoritos.innerHTML += `
                    <div class="card-favoritos card" id="productosFavoritos${productoFav.id}">
                        <div class="row g-0">
                                <img src="${productoFav.thumbnail}" class="img-fluid img-favoritos" alt="">
                            <div class="col-md-8 card d-flex flex-column justify-content-center">
                                <h5 class="title-carrito">${productoFav.title}</h5> 
                                <h6 class="text-carrito">Precio: $${productoFav.price}</h6>
                            </div>
                        </div>
                    </div>
                `;
        });
    }
}


/*FUNCIONES  DEL SELECT DE OPCIONES:*/
let selectOpciones = document.getElementById("selectOpciones");

if (selectOpciones) {
    document.addEventListener("change", () => {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            text: 'Cargando,espere unos minutos',
            showConfirmButton: false,
            timer: 1000,
        })

        switch (selectOpciones.value) {
            case "1":
                filtrarPrecioMayor(dataProductos)
                break

            case "2":
                filtrarPrecioMenor(dataProductos)
                break

            case "3":
                filtrarPorCategoria(dataProductos)
                break
        }
    })
}

// 1)Crear un acopia de  array. 2) Con el metodo sort o clasifica de mayor-menor/ menor-mayor-3) muestra los productos(mi array)

function filtrarPrecioMayor(array) {
    const precioMayor = [].concat(array);
    precioMayor.sort((a, b) => b.price - a.price);
    mostrarProductos(precioMayor)
    console.log(precioMayor)
}


function filtrarPrecioMenor(array) {
    const precioMenor = [].concat(array)
    precioMenor.sort((elem1, elem2) => elem1.price - elem2.price)
    mostrarProductos(precioMenor)
}

function filtrarPorCategoria(array) {

    const categorias = [].concat(array)

    categorias.sort((categoryA, categoryB) => {
        if (categoryA.category > categoryB.category) {
            //  Devuelve 1 para indicar que ele3 debe ir después de ele4
            return 1
        }
        if (categoryA.category < categoryB.category) {
            // Devuelve -1 para indicar que ele3 debe ir antes de ele4
            return -1
        }

        if (categoryA.title > categoryB.title) {
            return 1
        }
        if (categoryA.title < categoryB.title) {
            return -1
        }
        else {
            // Si las categorías y los títulos son iguales, no se cambia el orden
            return 0
        }
    })
    mostrarProductos(categorias)
}


/*BARRA  DE BUSQUEDA:FILTRA LAS COINCIDENCIAS:*/
let busqueda = document.getElementById("searchBar");

function buscarPalabraClave(searchbar, array) {
    const resultadosBusqueda = array.filter(
        (objetos) =>
            objetos.title.toLowerCase().includes(searchbar.value.toLowerCase())
    )
    console.log(resultadosBusqueda)
    mostrarProductos(resultadosBusqueda)

}

busqueda.addEventListener("input", () => {
    buscarPalabraClave(busqueda, dataProductos)
})





