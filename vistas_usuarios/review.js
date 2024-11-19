// Funcionalidad para el slider
let currentIndex = 0;
const reviews = document.querySelectorAll('.review-box');
const totalReviews = reviews.length;
const slider = document.querySelector('.slider');
const slidesToShow = 3; 

const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

// Función para mover las diapositivas
function moveToSlide(index) {
    const maxIndex = totalReviews - slidesToShow; // El índice máximo para no salir del rango

    if (index < 0) {
        currentIndex = maxIndex; // Si es el inicio, ir al final
    } else if (index > maxIndex) {
        currentIndex = 0; // Si es el final, ir al principio
    } else {
        currentIndex = index;
    }

    // Calculamos el desplazamiento según el índice
    const offset = -currentIndex * (100 / slidesToShow); // Desplazamiento por porcentaje
    slider.style.transform = `translateX(${offset}%)`; // Aplicar el desplazamiento al slider
}

// Función para ir a la diapositiva anterior
prevButton.addEventListener('click', () => {
    moveToSlide(currentIndex - 1); // Mueve 1 elemento hacia atrás
});

// Función para ir a la diapositiva siguiente
nextButton.addEventListener('click', () => {
    moveToSlide(currentIndex + 1); // Mueve 1 elemento hacia adelante
});

// Iniciar en la primera diapositiva
moveToSlide(currentIndex);
