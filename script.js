/*
Потрібно за допомогою fetch та async/await витягнути дані з OMDb API.

Витягуємо дані по імені фільму
Дані розпарсуємо на сторінці
При натисканні на More Details має відкритися модалка з усіма даними про той фільм.
Все має працювати.
------------------------------------------------------------------------------------------
*/
const getS = (selector) => document.querySelector(selector);


const movieSearch = document.querySelector('.inputMovie');
const searchList = document.querySelector('.list-container');
const detailInfo = document.querySelector('.detail-container');


//OMDb API
// http://www.omdbapi.com/?i=tt3896198&apikey=a84974eb

//ключ API з OMDb API
const apiKey = 'a84974eb';


// Додаємо слухача події "input" на поле введення для відображення хрестика
getS('.inputMovie').addEventListener('input', () => {
    getS('.cross').classList.remove('hidden');
});
// Додаємо слухача події "click" на хрестик для очищення поля введення
getS('.cross').addEventListener('click', () => {
    getS('.inputMovie').value = ''; // Очищаємо вміст поля введення
});


// Функція для завантаження списку фільмів з API
async function loadMovies(searchTerm) {
    const URL = `http://omdbapi.com/?s=${searchTerm}&apikey=a84974eb`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response == "True") displayMovieList(data.Search);
}

// Функція для пошуку фільмів
function findMovies() {
    let searchInput = (movieSearch.value).trim();
    if (searchInput.length > 0) {
        searchList.classList.remove('hidden');
        loadMovies(searchInput);
    }
    else {
        searchList.classList.add('hidden');
    }
}

// Функція для відображення списку фільмів
function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // Зберігаємо ID фільму в атрибуті data-id
        movieListItem.classList.add('list-items');
        if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
        else moviePoster = "./image/image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Type}</p>
            <p>${movies[idx].Year}</p>
        </div>
        <button class="movies-detail">More details</button>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

// Функція для завантаження деталей фільму
function loadMovieDetails() {
    const moviesDetailButtons = document.querySelectorAll(".movies-detail");
    moviesDetailButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const button = event.target; // Кнопка, на яку був здійснений клік
            const listItem = button.closest('.list-items'); // Шукаємо найближчий елемент з класом "list-items"
            getS('.getMovie').disabled = true; // Вимикаємо кнопку "Отримати фільм"
            movieSearch.disabled = true; // Вимикаємо поле введення
            if (listItem) {
                const movieId = listItem.dataset.id; // Отримуємо ID фільму
                searchList.style.display = "none"; // Приховуємо список фільмів
                detailInfo.classList.remove('hidden'); // Відображаємо контейнер для деталей
                movieSearch.value = ""; // Очищаємо поле введення

                const result = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=a84974eb`);
                const movieDetails = await result.json();
                console.log(movieDetails);
                displayMovieDetails(movieDetails);
            }
        });
    });
}

// Функція для відображення деталей фільму
function displayMovieDetails(details) {
    detailInfo.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <div class="grid">
        <h3 class = "movie-title">${details.Title}</h3>
        <p class="movie-params">${details.Rated} ${details.Year} ${details.Genre}</p>
        <p class="movie-description"> ${details.Plot}</p>
        <p class="movie-description"><b>Written by:</b> ${details.Writer}</p>
        <p class="movie-description"><b>Directed by: </b>${details.Director}</p>
        <p class="movie-description"><b>Starring:</b> ${details.Actors}</p>
        <p class="movie-description"><b>BoxOffice:</b> ${details.BoxOffice}</p>
        <p class="movie-description"><b>Awards:</b> ${details.Awards}</p>
        <div class="movie-description ratting"><b>Ratings:</b> 
        </div>
        </div>
    </div>
    `;
    const ratings = details.Ratings;
    // Знаходимо елемент, де ви будете відображати дані про рейтинги
    const ratingsContainer = document.querySelector('.ratting')

    // Перебираємо масив і виводимо дані на сторінку
    for (const rating of ratings) {
        const source = rating.Source; // Отримуємо джерело рейтингу
        const value = rating.Value;   // Отримуємо значення рейтингу
        // Створюємо елемент для відображення рейтингу і додаємо його до контейнера
        const ratingElement = document.createElement('p');
        ratingElement.innerHTML = `${source} ${value}`;
        ratingsContainer.appendChild(ratingElement);
    }


    // Додаємо слухача події "click" на контейнер для приховування деталей фільму
    getS('.container').addEventListener('click', (event) => {
        if (event.target === getS('.container')) {
            searchList.style.display = "grid"; // Відображаємо список фільмів
            detailInfo.classList.add('hidden'); // Приховуємо контейнер для деталей
            detailInfo.innerHTML = ''; // Очищаємо контейнер для деталей
            getS('.getMovie').disabled = false; // Увімкнення кнопки "Отримати фільм"
            movieSearch.disabled = false; // Увімкнення поля введення
        }
    })
}

