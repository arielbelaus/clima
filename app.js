
function posicionActual(){
    navigator.geolocation.getCurrentPosition(mostrarPosicion)
} 

function mostrarPosicion(posicion) {
    const latitud = posicion.coords.latitude
    const longitud = posicion.coords.longitude
    localizacion(latitud, longitud)
    climaActual(latitud,longitud)
}

function climaActual(latitud, longitud){
    cargando()
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitud}&lon=${longitud}&appid=2fe0d33c62b177390719f03bcf7852b1&units=metric&lang=sp&exclude=minutely`)
    .then(respuesta => respuesta.json())
    .then(data => {
        const {current,daily,hourly} = data
        allSet()
        tempActualUI(current,daily)
        climaIcon(current)
        tempExtendidaUI(daily)
        infoComplementaria(current)
        infoHora(hourly)
    })
}

function localizacion(latitud, longitud){
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitud}+${longitud}&key=2ad9e242a5f84883b65848c345984b2e`)
    .then(respuesta => respuesta.json())
    .then(data => {
        const ciudad = data.results[0].components.town
        const provincia = data.results[0].components.state
        ubicacionUI(ciudad, provincia)
    })
}

//Funciones UI
function ubicacionUI(ciudad, provincia){
    const header = document.querySelector('header')
    header.innerHTML =`
    <h1>${ciudad}, ${provincia}</h1>`
}

function tempActualUI(current,daily){
    const slotTemp = document.createElement('p')
    const slotMax = document.createElement('p')
    const slotMin = document.createElement('p')

    const gradosActuales = document.querySelector('#temperatura img~div')
    const climaDesc = document.querySelector('#temperatura div p')
    const realFeel = document.querySelector('#realFeel')
    const maxMin = document.querySelector('#maxMin')

    slotTemp.innerText = `${parseInt(current.temp)}°`
    gradosActuales.insertBefore(slotTemp,climaDesc)
    climaDesc.textContent = `${capitalizeFirstLetter(current.weather[0].description)}`
    realFeel.innerText = `RealFeel ${parseInt(current.feels_like)}°`
    slotMax.innerText = `${parseInt(daily[0].temp.max)}°`
    slotMin.innerText = `${parseInt(daily[0].temp.min)}°`
    slotMax.setAttribute('class', 'tempMax')
    slotMin.setAttribute('class', 'tempMin')
    maxMin.appendChild(slotMax)
    maxMin.appendChild(slotMin)
}

function climaIcon(current){
    const imgTemp = document.querySelector('#temperatura img')
    const icon = current.weather[0].icon
    imgTemp.setAttribute('src',`http://openweathermap.org/img/wn/${icon}@2x.png`)
}

function tempExtendidaUI(daily){
    const espacioTempExt = document.querySelectorAll('#extendido div')
    const imgTempExt = document.querySelectorAll('#extendido div img')
    for(let i=0; i<imgTempExt.length; i++){
        const dia = document.createElement('p')
        const tempMax = document.createElement('p')
        const tempMin = document.createElement('p')
        const icon = daily[i+1].weather[0].icon
        imgTempExt[i].setAttribute('src',`http://openweathermap.org/img/wn/${icon}@2x.png`)
        dia.textContent = diaDeLaSemana(new Date((daily[i+1].dt)*1000).getDay())
        tempMax.textContent = `${parseInt(daily[i+1].temp.max)}°`
        tempMin.textContent = `${parseInt(daily[i+1].temp.min)}°`
        espacioTempExt[i].insertBefore(dia,imgTempExt[i])
        espacioTempExt[i].insertBefore(tempMax,dia[i])
        espacioTempExt[i].insertBefore(tempMin,tempMax[i])
    }
}

function diaDeLaSemana(numero){
    let diaSem = ''
    switch(numero){
        case 0: diaSem = 'DOM'
        break
        case 1: diaSem = 'LUN'
        break
        case 2: diaSem = 'MAR'
        break
        case 3: diaSem = 'MIÉ'
        break
        case 4: diaSem = 'JUE'
        break
        case 5: diaSem = 'VIE'
        break
        case 6: diaSem = 'SAB'
        break
        default: diaSem = 'N/A'
    }
    return diaSem
}
    
function infoComplementaria(current){
    const slotViento = document.createElement('p')
    const slotHumedad = document.createElement('p')
    const slotVisib = document.createElement('p')

    const viento = document.querySelector('#infoComplementaria div:nth-child(1)')
    const imgViento = document.querySelector('#infoComplementaria div:nth-child(1) img')
    const humedad = document.querySelector('#infoComplementaria div:nth-child(2)')
    const imgHumedad = document.querySelector('#infoComplementaria div:nth-child(2) img')
    const visibilidad = document.querySelector('#infoComplementaria div:nth-child(3)')
    const imgVisib = document.querySelector('#infoComplementaria div:nth-child(3) img')

    slotViento.innerText= `${(parseInt(current.wind_speed)*3.6)} km/h`
    viento.insertBefore(slotViento,imgViento)
    imgViento.setAttribute('src','imagenes/svg/windy.svg')
    slotHumedad.innerText= `${current.humidity}%`
    humedad.insertBefore(slotHumedad,imgHumedad)
    imgHumedad.setAttribute('src','imagenes/svg/025-humidity.svg')
    slotVisib.innerText= `${(current.visibility)/1000} km`
    visibilidad.insertBefore(slotVisib,imgVisib)
    imgVisib.setAttribute('src','imagenes/svg/eye.svg')
}

function infoHora(hourly){
    const infoHora = document.querySelector('#infoHora')
    const fechaActual = document.querySelector('#infoHora h1')
    mesDeHoy(new Date().getMonth())
    fechaActual.textContent =`${diaDeHoy(new Date().getDay())}, ${new Date().getDate()} DE ${mesDeHoy(new Date().getMonth())}`
    for(let i=1; i<hourly.length; i++){
        const climaHora = document.createElement('div')
        const slotHora = document.createElement('p')
        const imgHora = document.createElement('img')
        const slotTemp = document.createElement('p')
        const slotHumedad = document.createElement('p')
        const slotViento = document.createElement('p')
        if(new Date((hourly[i].dt)*1000).getHours().toString().length < 2){
            slotHora.textContent = `0${new Date((hourly[i].dt)*1000).getHours()}:00`
        } else{
            slotHora.textContent = `${new Date((hourly[i].dt)*1000).getHours()}:00`
        }
        imgHora.setAttribute('src', `http://openweathermap.org/img/wn/${hourly[i].weather[0].icon}@2x.png`)
        slotTemp.textContent = `${parseInt(hourly[i].temp)}°`
        slotHumedad.textContent = `${hourly[i].humidity}%`
        slotViento.textContent = `${parseInt((hourly[i].wind_speed)*3.6)} km/h`
        climaHora.appendChild(slotHora)
        climaHora.appendChild(imgHora)
        climaHora.appendChild(slotTemp)
        climaHora.appendChild(slotHumedad)
        climaHora.appendChild(slotViento)
        infoHora.appendChild(climaHora)
    }
}

function diaDeHoy(numero){
    let dia = ''
    switch(numero){
        case 0: dia = 'DOMINGO'
        break
        case 1: dia = 'LUNES'
        break
        case 2: dia = 'MARTES'
        break
        case 3: dia = 'MIÉRCOLES'
        break
        case 4: dia = 'JUEVES'
        break
        case 5: dia = 'VIERNES'
        break
        case 6: dia = 'SABADO'
        break
        default: dia = 'N/A'
    }
    return dia
}

function mesDeHoy(numero){
    let mes= ''
    switch(numero){
        case 0: mes = 'ENERO'
        break
        case 1: mes = 'FEBRERO'
        break
        case 2: mes = 'MARZO'
        break
        case 3: mes = 'ABRIL'
        break
        case 4: mes = 'MAYO'
        break
        case 5: mes = 'JUNIO'
        break
        case 6: mes = 'JULIO'
        break
        case 7: mes = 'AGOSTO'
        break
        case 8: mes = 'SEPTIEMBRE'
        break
        case 9: mes = 'OCTUBRE'
        break
        case 10: mes = 'NOVIEMBRE'
        break
        case 11: mes = 'DICIEMBRE'
        break
        default: mes = 'N/A'
    }
    return mes
}


//Generales
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function estilos(){
    const hora = new Date().getHours()
    if( hora>=6 && hora<12){
        document.querySelector('head link:nth-child(4)').setAttribute('href','estilosManana.css')
    } else if(hora>=12 && hora<18){
        document.querySelector('head link:nth-child(4)').setAttribute('href','estilosDia.css')
    } else if(hora>=18 && hora<20){
        document.querySelector('head link:nth-child(4)').setAttribute('href','estilosTarde.css')
    } else {
        document.querySelector('head link:nth-child(4)').setAttribute('href','estilosNoche.css')
    }
}

function cargando(){
    document.querySelector('#actual').style.display="none";
    document.querySelector('#extendido').style.display="none";
    document.querySelector('#infoComplementaria').style.display="none";
    document.querySelector('#infoHora').style.display="none";
}

function allSet(){
    document.querySelector('.sk-folding-cube').style.display="none";
    document.querySelector('#actual').style.display="block";
    document.querySelector('#extendido').style.display="flex";
    document.querySelector('#infoComplementaria').style.display="flex";
    document.querySelector('#infoHora').style.display="block";
}

document.addEventListener('DOMContentLoaded',estilos())
document.addEventListener('DOMContentLoaded',posicionActual())

