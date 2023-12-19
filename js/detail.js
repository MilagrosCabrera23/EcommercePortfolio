let productosCarrito = []
let productosDelCarrito = [];


document.addEventListener("DOMContentLoaded", function () {

  productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || []

  fetch("../js/productos.json")
    .then((rta) => rta.json())
    .then(data => {
      dataProductos = data;
      // Obtener el id del producto de la URL
      //             const urlParams = new URLSearchParams(window.location.search);: Se utiliza URLSearchParams para obtener los parámetros de la URL actual. En este caso, está buscando el parámetro 'id' en la URL.

      // const productId = urlParams.get('id');: Se obtiene el valor del parámetro 'id' de la URL.
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('id');

      // Buscar el producto por id en el array dataProductos
      const productoSeleccionado = dataProductos.find(prod => prod.id === parseInt(productId));

      // Mostrar detalles del producto seleccionado llamando a la función detallesDelProducto
      detallesDelProducto(productoSeleccionado);
    })
    .catch(err => { console.log('Error al cargar el archivo JSON de detalles: ', err); });




  const detalleProducto = document.getElementById("detalle_Del_Producto");

  function detallesDelProducto(producto) {
    detalleProducto.innerHTML = "";
    let divDetails = document.createElement("div");
    divDetails.id = `detailsContainer${producto.id}`;
    divDetails.innerHTML = `
          <div class="m-3 d-flex">
    <div class="me-4">
      <img src="${producto.thumbnail}" class="d-block w-20" alt="...">
      </div>
              <div id="cardInfo ">
              <h4 class="title-detalles"><strong>${producto.title} </strong></h4> 
              <h6>Precio: <strong> ${producto.price} </strong></h6>
              <h6>Categoria:  <strong>${producto.category}  </strong></h6>
              <h6>Descripcion: <strong> ${producto.description} </strong></h6>
                  <h6>Stock disponible: <strong>${producto.stock}</strong></h6>

                  <div>
                  <button class="btn btn-success" id="agregarProducto${producto.id}"> Agregar al carrito </button>

                  <button class="btn btn-primary" id="btnSumarUnidades${producto.id}">+</button>
                  <span class="unidades" id="cantProd${producto.id}">1</span>
                  <button class="btn btn-dark btnRestarUnidades" data-product-id="${producto.id}">-</button>
                </div>
                  </div>
              </div>
          `;

    detalleProducto.appendChild(divDetails);


   let cantProd = document.getElementById(`cantProd${producto.id}`);

    // Agregar al carrito funciones

    let agregarProducto = document.getElementById(`agregarProducto${producto.id}`);

    agregarProducto.addEventListener("click", () => {
      
      // Intentamos capturar el vallor del contador, verificar si el contador esta correcto.
    
      let cantidadSeleccionada = parseInt(cantProd.textContent);
      console.log(`Has agregado ${cantidadSeleccionada} unidades del producto correctamente`);
      
      // Tenemos una funcion por debajo de este scoupe, el cual esta la logica de agregar al carrito, la  llamamos aqui en ell boton. "añadirAlCarrito"
      añadirAlCarrito(producto, cantidadSeleccionada);

      mostrarProductosCarrito(productosCarrito);



      // Fragmento de codigo, para dar una idea de como podria ser. Esto deberia ir en al funcion "añadirAllCarrito" ya que toda lal logica de lboton lo estamos haciendo en aquela funcion que lluego llamamos aqui.

      // const productoExistente = productosCarrito.findIndex((item) => item.id === producto.id);
  
      // if (productoExistente !== -1) {
      //   actualizarCarro = [...productosCarrito];
      //   actualizarCarro[productoExistente].cantidad += cantidadSeleccionada;
      //   actualizarCarro[productoExistente].price += producto.price * cantidadSeleccionada;
      // }else {
      //   actualizarCarro.push({...producto, quantity: cantidadSeleccionada, price: producto.price * cantidadSeleccionada})
      // }
    })


    // Boton del contador para sumar

    let botonSumarUnidades = document.getElementById(`btnSumarUnidades${producto.id}`);

    botonSumarUnidades.addEventListener("click", () => {
      console.log("Has agregado una cantidad más");
      let cantidad = parseInt(cantProd.textContent);
      cantidad++;

      cantProd.textContent = cantidad;
    });

    // Boton del contador para restar

    let botonRestarUnidades = document.querySelector(`.btnRestarUnidades[data-product-id="${producto.id}"]`);
    botonRestarUnidades.addEventListener("click", () => {
      console.log("Has eliminado una cantidad");
      let cantidad = parseInt(cantProd.textContent);
      if (cantidad > 1) {
        cantidad--;

        cantProd.textContent = cantidad;
      }

    });

    let productoFavorito = document.getElementById(`productoFavoritos${producto.id}`);
    productoFavorito.addEventListener("click", () => {
      console.log("Producto agregado a favoritos correctamente.");
      agregarAFavoritos(producto);
      mostrarProductosFavoritos(productosFavoritos);
    });
  }
});

// PARA CREAR FUNCIONALIDADES DE LOS BOTONES DE CARRITO HAY QUE HACER: 1) CAPTURAR TODO LO NECESARIO(BODY,BOTONES,ETC),2)AL BODY LE CREO EL EVENTO EN BASE A UN CONDICIONAL CONTROLO LOS EVENTOS,  3) CREAR FUNCIONALIDAD DE MOSTRAR CARRITO  Y AHI MISMO CAPTURO LOS 3 BOTONES DONDE A ESOS BOTONES LE CREO SU EVENTO A CADA UNO Y LUEGO LOS DESVINCULO,4) CREAR LAS FUNCIONALIDADES DE LOS 3 BOTONES , 5) Actualizar el Local Storage y Recalcular Total, y OPCIONAL: Desvincular Eventos si es Necesario. 

// AÑADE LOS PRODUCTOS AL CARRITO
function añadirAlCarrito(card, cantidad) {
  let productoAgregado = productosCarrito.find((item) => item.id === card.id);

  if (productoAgregado === undefined) {
    // card.quantity = cantidad;
    productosCarrito.push(card)
    // console.log(productosCarrito)

    localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito))

    Swal.fire({
      text: `El producto ${card.title} ha sido agregado`,
      position: 'center',
      icon: 'success',
      timer: 2500,
      showConfirmButton: false
    })
  }

  else {

    productoAgregado.price * cantidad;
    productoAgregado.quantity += cantidad;

    // Swal.fire({
    //   title: `El producto ya existe en el carrito`,
    //   icon: "error",
    //   timer: 1400,
    //   showConfirmButton: false
    // })
    localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));

    // Muestra los productos en el carrito
    mostrarProductosCarrito(productosCarrito);
  }

}


// event: Es un objeto que representa el evento que ha ocurrido. 
// target para referenciar el elemento específico en el que se hizo clic.
// event.target: Es una propiedad del objeto evento que devuelve el elemento que desencadenó el evento.
let bodyDelCarrito = document.getElementById("bodyDelCarrito");

// 1) EVENTO DE BOTONES DEL CARRITO:Crear un evento  al body del carrito.
bodyDelCarrito.addEventListener("click", (event) => {

  const target = event.target;
  //2) const target = event.target;: Obtiene el elemento específico que fue clicado dentro del contenedor.
  const productId = target.dataset.productId;
  // 3) 

  //4) Luego, hay una serie de condicionales que determinan qué tipo de botón se hizo clic  y ejecutan la acción correspondiente llamando a las funciones correspondiente con el ID del producto.
  if (productId) {
    const id = parseInt(productId, 10);

    if (target.classList.contains("btnSumarUnidades")) {
      console.log("Has agregado una cantidad más");
      sumarUnidades(id);
    } else if (target.classList.contains("btnRestarUnidades")) {
      console.log("Has eliminado una cantidad");
      restarUnidades(id);
    } else if (target.classList.contains("btnEliminar")) {
      console.log("Has eliminado el producto");
      eliminarUnidades(id);
    }
  }
});





function mostrarProductosCarrito(array) {
  bodyDelCarrito.innerHTML = "";
  array.forEach((productosDelCarrito) => {
    bodyDelCarrito.innerHTML += `
      <div class="card row m-2" id="productosCarrito${productosDelCarrito.id}">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${productosDelCarrito.thumbnail}" class="img-fluid img-carrito" alt="">
          </div>
          <div class="col-md-8 card-carrito row">
            <h5 class="title-carrito">${productosDelCarrito.title}</h5>
            <h6 class="text-carrito column-detalles">Cantidad de unidades: ${productosDelCarrito.quantity}</h6>
            <h6 class="text-carrito column-detalles">SubTotal: $${productosDelCarrito.quantity * productosDelCarrito.price}</h6>
            <button class="btn btn-danger btnEliminar" data-product-id="${productosDelCarrito.id}"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>`;


    // Eventos para sumar, restar y eliminar unidades
    let botonEliminar = document.querySelector(`.btnEliminar[data-product-id="${productosDelCarrito.id}"]`);
    botonEliminar.addEventListener("click", () => {
      console.log("Has eliminado el producto");
      eliminarUnidades(productosDelCarrito.id);
    })


    // Desvincula eventos antiguos
    // botonSumarUnidades.removeEventListener("click");
    // botonRestarUnidades.removeEventListener("click");

    // No es necesario desvincular eventos antiguos o agregar nuevos eventos aquí.
    // El evento se maneja a nivel del contenedor (bodyDelCarrito).
  });

  calcularPrecioTotal(array);
}


function eliminarUnidades(id) {
  //  1) ELIMINO DEL DOM EL PRODUCTO:
  let productoDom = document.getElementById(`productosCarrito${id}`);
  productoDom.remove();

  //2) Eliminar del array (carrito)

  let prodCarrito = productosCarrito.find(obj => obj.id === id);
  let indexProd = productosCarrito.indexOf(prodCarrito)
  productosCarrito.splice(indexProd, 1)

  // 3)Actualizar localStorage
  localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));

  // 4)Recalcular el total o realizar otras acciones necesarias
  // calcularPrecioTotal()
}

let precioTotal = document.getElementById("precioTotal")

function calcularPrecioTotal(array) {
  let total = array.reduce((acc, productosDelCarrito) => acc + (productosDelCarrito.price * productosDelCarrito.quantity), 1);

  total === 0 ? precioTotal.innerHTML = `<h6 class="text-center">No hay productos en el carrito </h6>` : precioTotal.innerHTML = `<strong><p>SUBTOTAL: ${total}</p></strong>`;

  return total;
}

/*PRODUCTOS SIMILARES*/

