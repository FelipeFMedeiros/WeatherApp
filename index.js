// Declarando dados importantes
const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const calendarBox = document.querySelector('.box-calendar');
const Calendar = document.querySelector('.calendar');
const weekName = document.querySelector('.week-name');


const secret = process.env.APIKey;
console.log(secret);
console.log("Secret acima!");


// Pesquisar apertando a tecla "ENTER"
const searchInput = document.querySelector('.search-box input');

searchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        search.click();
    }
});


// Função de desabilitar o botão para evitar bugs
function disableButton() {
    search.disabled = true;
    setTimeout (function() {
    search.disabled = false;
    }, 1200);
    search.style.transform = "none";
    search.style.boxShadow = "none";
}


// Evento ao apertar o botão de pesquisa
search.addEventListener('click', () => {
    disableButton(); // Acionando a função de desabilitar o botão
    // Transição ao apertar o botão
    const buttonOriginalColor = search.style.color; // salva a cor original do botão
    const buttonOriginalTransform = search.style.transform; // salva o transform original do botão
    const buttonOriginalBackground = search.style.background; // salva a cor do background original do botão
    search.style.color = '#fff' // muda a cor do botão
    search.style.transform = 'translateY(4px)'; // muda o estilo do botão
    search.style.background = '#06283D'; // muda a cor do background do botão
    search.addEventListener('transitionend', () => {
        search.style.color = buttonOriginalColor; // retorna a cor original do botão após a transição terminar
        search.style.transform = buttonOriginalTransform; // retorna o transform original do botão após a transição terminar
        search.style.background = buttonOriginalBackground; // retorna a cor do background original após a transição terminar
    }, { once: true }); // remove o listener após a transição ocorrer uma vez


    // Script para funcionar tudo
    const APIKey = 'b8e9cc118639cd4491d6aae15fd2b57e'; // API do Openweathermap
    const city = document.querySelector('.search-box input').value;

    console.log(`*** BUSCANDO EM: ${city} ***`);

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${APIKey}`)
        .then(response => response.json())

        // Puxando fatores climáticos e cidade
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                calendarBox.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }
            error404.style.display = 'none';
            error404.classList.remove('fadeIn');
            
            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':          // Céu limpo
                    image.src = 'images/wi-day-sunny.svg';
                    break;

                case 'Rain':           // Chuva
                    image.src = 'images/wi-rain.svg';
                    break;

                case 'Snow':           // Neve
                    image.src = 'images/wi-snow.svg';
                    break;

                case 'Clouds':         // Nuvens
                    image.src = 'images/wi-cloudy.svg';
                    break;

                case 'Drizzle':        // Névoa
                    image.src = 'images/wi-cloudy-gusts.svg';
                    break;

                case 'Thunderstorm':   // Tempestade
                    image.src = 'images/wi-day-thunderstorm.svg';
                    break;

                case 'Drizzle':        // Chuvisco
                    image.src = 'images/wi-rain-mix.svg';
                    break;

                case 'Fog':            // Névoa
                    image.src = 'images/wi-fog.svg';
                    break;

                case 'Mist':           // Céu limpo
                    image.src = 'images/wi-fog.svg';
                    break;

                case 'Haze':           // Neblina
                    image.src = 'images/wi-fog.svg';
                    break;

                case 'Smoke':          // Fumaça
                    image.src = 'images/wi-smoke.svg';
                    break;

                case 'Dust':           // Poeira
                    image.src = 'images/wi-dust.svg';
                    break;

                case 'Sand':           // Areia
                    image.src = 'images/wi-sandstorm.svg';
                    break;

                case 'Squall':         // Temporal
                    image.src = 'images/wi-storm-showers.svg';
                    break;

                case 'Tornado':       // Tornado
                    image.src = 'images/wi-tornado.svg';
                    break;

                case 'Ash':           // Cinzas
                    image.src = 'images/wi-smog.svg';
                    break;

                default:
                    image.src = '';
            }

            console.log(`Tempo: ${json.weather[0].main}`);
            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${(json.wind.speed)} m/s`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '650px';


            // Puxando dias
            const timezoneOffset = json.timezone;
            const currentDate = new Date((json.dt + timezoneOffset) * 1000);

            const dayOfWeek = currentDate.toLocaleDateString('pt-BR', { weekday: 'long' });
            const dayOfMonth = currentDate.getDate();
            const month = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
            const year = currentDate.getFullYear();

            Calendar.innerHTML = `${dayOfMonth} de ${month} de ${year}`;
            weekName.innerHTML = `${dayOfWeek}`;
            calendarBox.style.display = '';
            calendarBox.classList.add('fadeIn');

            console.log(`=> ${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}`);


            // Obter hora da cidade
            const API_KEY = '3J2V8MCLVT2Z'; // API do TimeZoneDB
            const lat = json.coord.lat;
            const lon = json.coord.lon;
            //console.log(`Latitude: ${lat}`);  // Mostrar a latitude da cidade puxada no console
            //console.log(`Longitude: ${lon}`); // Mostrar a longitude da cidade puxada no console
            const timezoneURL = `https://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`;
            //console.log(`API TimeZoneDB: ${timezoneURL}`);    // Link para ter acesso as informações recebidas da API

            fetch(timezoneURL)
                .then(response => response.json())
                .then(data => {

                    // Salvando a hora
                    const formattedTime = data.formatted;

                    // Manipular dados de hora
                    const hour = document.querySelector('.weather-box .hour');

                    const timestamp = data.timestamp;
                    const hora = formattedTime.split(' ')[1].split(':')[0];
                    const minuto = formattedTime.split(' ')[1].split(':')[1];
                    console.log(`São ${hora}:${minuto} em ${city}.`);
                    const cityTimezone = data.zoneName;
                    //const cityTime = new Date(timestamp * 1000).toLocaleTimeString('pt-BR', { timeZone: cityTimezone });
                    const cityTime = `${hora}:${minuto}`;
                    hour.innerText = cityTime;
                    console.log(`Fuso Horário: ${cityTimezone}`);
                    console.log(`"formatted": "${formattedTime}"`);

                    // Definindo se está de dia ou de noite

                    if (hora >= 18 && json.weather[0].main == 'Clear' || hora <= 4 && json.weather[0].main == 'Clear') {
                        //console.log('Está de noite, contudo a imagem foi alterada.');
                        image.src = 'images/wi-night-clear.svg';
                        //image.style.width = '30%';
                    }
                    if (hora >= 18 && json.weather[0].main == 'Thunderstorm' || hora <= 4 && json.weather[0].main == 'Thunderstorm') {
                        //console.log('Está de noite, contudo a imagem foi alterada.');
                        image.src = 'images/wi-night-alt-thunderstorm.svg';
                        //image.style.width = '50%';
                    }
                })
                .catch(error => console.log(error));
            //return fetch(timezoneURL);

        })

});
