// arrays modals
let prodFavHome;

/* CAROUSEL DEL NAVBAR*/
const swiper = new Swiper('.swiper', {
    // Optional parameters
    slidesPerView: "auto",
    direction: 'horizontal',
    loop: true,
    allowTouchMove: true,
    effect: "slide",
    autoplay: {
        pauseOnMouseEnter: true,
    },

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

/* LAS CARD  DEL HOME: */
document.addEventListener('DOMContentLoaded', function () {
    let carruselHome = document.getElementById("carrusel");

    fetch("../js/home.json")
        .then(rta => rta.json())
        .then(data => {
            prodFavHome = data;
            
            function mostrarTarjetas() {
                carruselHome.innerHTML = ''; // Limpiar el carrusel antes de agregar nuevas tarjetas
                data.forEach(producto => {
                    let carruselItem = document.createElement('div');
                    carruselItem.className = 'carrusel-item ';
                    carruselItem.innerHTML = `
                        <div id="${producto.id}" class="border-card">
                            <div class="boxImg">
                                <img src="${producto.thumbnail}" alt="${producto.title}">
                            </div>
                            <p class="m-2 title-card">${producto.title}</p>
                            <p class="price-card">$${producto.price}</p>
                        </div>

                    `;

                    carruselHome.appendChild(carruselItem); // Agregar carruselItem al carruselHome

                    // Agrega el evento de clic al contenedor de productos 
                    carruselItem.addEventListener("click", () => {
                        window.location.href = `pages/detalleProductos.html?id=${producto.id}`;
                    })
                });
            }

            // Mostrar las primeras tarjetas al cargar la página
            mostrarTarjetas();

        })
        .catch(error => {
            console.log("Error al cargar el archivo JSON Del Home: ", error);
        });
})


