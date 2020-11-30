/************************************* Localizacion *****************************************/
function posicionActual() {
    navigator.geolocation.getCurrentPosition(mostrarPosicion)
}

function mostrarPosicion(posicion) {
    const latitud = posicion.coords.latitude
    const longitud = posicion.coords.longitude
    localizacion(latitud, longitud)
    climaActual(latitud, longitud)
}

/************************************* Fetchs *****************************************/
function climaActual(latitud, longitud) {
    cargando()
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitud}&lon=${longitud}&appid=2fe0d33c62b177390719f03bcf7852b1&units=metric&lang=sp&exclude=minutely`)
        .then(respuesta => respuesta.json())
        .then(data => {
            const {
                current,
                daily,
                hourly
            } = data
            allSet()
            tempActualUI(current, daily)
            climaIcon(current)
            tempExtendidaUI(daily)
            infoComplementaria(current)
            infoHora(hourly)
        })
}

function localizacion(latitud, longitud) {
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitud}+${longitud}&key=2ad9e242a5f84883b65848c345984b2e`)
        .then(respuesta => respuesta.json())
        .then(data => {
            const hamlet = data.results[0].components.hamlet
            const city = data.results[0].components.city
            const village = data.results[0].components.village
            const municipality = data.results[0].components.municipality
            const town = data.results[0].components.town
            const provincia = data.results[0].components.state
            const state_district = data.results[0].components.state_district
            if (typeof city !== 'undefined') {
                ubicacionUI(city, provincia)
            } else if (typeof town !== 'undefined') {
                ubicacionUI(town, provincia)
            } else if (typeof village !== 'undefined') {
                ubicacionUI(village, provincia)
            } else if (typeof municipality !== 'undefined') {
                ubicacionUI(municipality, provincia)
            } else if (typeof hamlet !== 'undefined') {
                ubicacionUI(hamlet, provincia)
            } else {
                ubicacionUI(state_district, provincia)
            }
        })
}

/************************************* Funciones UI *****************************************/
function ubicacionUI(ciudad, provincia) {
    const header = document.querySelector('header')
    if (typeof ciudad == 'undefined') {
        header.innerHTML = `<h1>${provincia}</h1>`
    }
    if (typeof provincia == 'undefined') {
        header.innerHTML = `<h1>${ciudad}</h1>`
    } else {
        header.innerHTML = `<h1>${ciudad}, ${provincia}</h1>`
    }
}

function tempActualUI(current, daily) {
    const slotTemp = document.createElement('p')
    const slotMax = document.createElement('p')
    const slotMin = document.createElement('p')

    const gradosActuales = document.querySelector('#temperatura img~div')
    const climaDesc = document.querySelector('#temperatura div p')
    const realFeel = document.querySelector('#realFeel')
    const maxMin = document.querySelector('#maxMin')

    slotTemp.innerText = `${parseInt(current.temp)}°`
    gradosActuales.insertBefore(slotTemp, climaDesc)
    climaDesc.textContent = `${capitalizeFirstLetter(current.weather[0].description)}`
    realFeel.innerText = `RealFeel ${parseInt(current.feels_like)}°`
    slotMax.innerText = `${parseInt(daily[0].temp.max)}°`
    slotMin.innerText = `${parseInt(daily[0].temp.min)}°`
    slotMax.setAttribute('class', 'tempMax')
    slotMin.setAttribute('class', 'tempMin')
    maxMin.appendChild(slotMax)
    maxMin.appendChild(slotMin)
}

function climaIcon(current) {
    const imgTemp = document.querySelector('#temperatura img')
    const icon = current.weather[0].icon
    imgTemp.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`)
}

function tempExtendidaUI(daily) {
    const espacioTempExt = document.querySelectorAll('#extendido div')
    const imgTempExt = document.querySelectorAll('#extendido div img')
    for (let i = 0; i < imgTempExt.length; i++) {
        const dia = document.createElement('p')
        const tempMax = document.createElement('p')
        const tempMin = document.createElement('p')
        const icon = daily[i + 1].weather[0].icon
        imgTempExt[i].setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`)
        dia.textContent = diaDeLaSemana(new Date((daily[i + 1].dt) * 1000).getDay())
        tempMax.textContent = `${parseInt(daily[i+1].temp.max)}°`
        tempMin.textContent = `${parseInt(daily[i+1].temp.min)}°`
        espacioTempExt[i].insertBefore(dia, imgTempExt[i])
        espacioTempExt[i].insertBefore(tempMax, dia[i])
        espacioTempExt[i].insertBefore(tempMin, tempMax[i])
    }
}

function diaDeLaSemana(numero) {
    let diaSem = ''
    switch (numero) {
        case 0:
            diaSem = 'DOM'
            break
        case 1:
            diaSem = 'LUN'
            break
        case 2:
            diaSem = 'MAR'
            break
        case 3:
            diaSem = 'MIÉ'
            break
        case 4:
            diaSem = 'JUE'
            break
        case 5:
            diaSem = 'VIE'
            break
        case 6:
            diaSem = 'SAB'
            break
        default:
            diaSem = 'N/A'
    }
    return diaSem
}

function infoComplementaria(current) {
    const slotViento = document.createElement('p')
    const slotHumedad = document.createElement('p')
    const slotVisib = document.createElement('p')

    const viento = document.querySelector('#infoComplementaria div:nth-child(1)')
    const imgViento = document.querySelector('#infoComplementaria div:nth-child(1) img')
    const humedad = document.querySelector('#infoComplementaria div:nth-child(2)')
    const imgHumedad = document.querySelector('#infoComplementaria div:nth-child(2) img')
    const visibilidad = document.querySelector('#infoComplementaria div:nth-child(3)')
    const imgVisib = document.querySelector('#infoComplementaria div:nth-child(3) img')

    slotViento.innerText = `${(parseInt(current.wind_speed)*3.6)} km/h`
    viento.insertBefore(slotViento, imgViento)
    imgViento.setAttribute('src', 'images/svg/windy.svg')
    slotHumedad.innerText = `${current.humidity}%`
    humedad.insertBefore(slotHumedad, imgHumedad)
    imgHumedad.setAttribute('src', 'images/svg/025-humidity.svg')
    slotVisib.innerText = `${(current.visibility)/1000} km`
    visibilidad.insertBefore(slotVisib, imgVisib)
    imgVisib.setAttribute('src', 'images/svg/eye.svg')
}

function infoHora(hourly) {
    const infoHora = document.querySelector('#infoHora')
    const fechaActual = document.querySelector('#infoHora h1')
    mesDeHoy(new Date().getMonth())
    fechaActual.textContent = `${diaDeHoy(new Date().getDay())}, ${new Date().getDate()} DE ${mesDeHoy(new Date().getMonth())}`
    for (let i = 1; i < hourly.length; i++) {
        const climaHora = document.createElement('div')
        const slotHora = document.createElement('p')
        const imgHora = document.createElement('img')
        const slotTemp = document.createElement('p')
        const slotHumedad = document.createElement('p')
        const slotViento = document.createElement('p')
        if (new Date((hourly[i].dt) * 1000).getHours().toString().length < 2) {
            slotHora.textContent = `0${new Date((hourly[i].dt)*1000).getHours()}:00`
        } else {
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

function diaDeHoy(numero) {
    let dia = ''
    switch (numero) {
        case 0:
            dia = 'DOMINGO'
            break
        case 1:
            dia = 'LUNES'
            break
        case 2:
            dia = 'MARTES'
            break
        case 3:
            dia = 'MIÉRCOLES'
            break
        case 4:
            dia = 'JUEVES'
            break
        case 5:
            dia = 'VIERNES'
            break
        case 6:
            dia = 'SABADO'
            break
        default:
            dia = 'N/A'
    }
    return dia
}

function mesDeHoy(numero) {
    let mes = ''
    switch (numero) {
        case 0:
            mes = 'ENERO'
            break
        case 1:
            mes = 'FEBRERO'
            break
        case 2:
            mes = 'MARZO'
            break
        case 3:
            mes = 'ABRIL'
            break
        case 4:
            mes = 'MAYO'
            break
        case 5:
            mes = 'JUNIO'
            break
        case 6:
            mes = 'JULIO'
            break
        case 7:
            mes = 'AGOSTO'
            break
        case 8:
            mes = 'SEPTIEMBRE'
            break
        case 9:
            mes = 'OCTUBRE'
            break
        case 10:
            mes = 'NOVIEMBRE'
            break
        case 11:
            mes = 'DICIEMBRE'
            break
        default:
            mes = 'N/A'
    }
    return mes
}


/************************************* Funciones Generales *****************************************/
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function styles() {
    const hora = new Date().getHours()
    if (hora >= 6 && hora < 12) {
        document.querySelector('head link:nth-child(4)').setAttribute('href', 'styles/estilosManana.css')
    } else if (hora >= 12 && hora < 18) {
        document.querySelector('head link:nth-child(4)').setAttribute('href', 'styles/estilosDia.css')
    } else if (hora >= 18 && hora < 20) {
        document.querySelector('head link:nth-child(4)').setAttribute('href', 'styles/estilosTarde.css')
    } else {
        document.querySelector('head link:nth-child(4)').setAttribute('href', 'styles/estilosNoche.css')
    }
}

function cargando() {
    document.querySelector('#actual').style.display = "none";
    document.querySelector('#extendido').style.display = "none";
    document.querySelector('#infoComplementaria').style.display = "none";
    document.querySelector('#infoHora').style.display = "none";
    document.querySelector('nav').style.display = "none";
}

function allSet() {
    document.querySelector('.sk-folding-cube').style.display = "none";
    document.querySelector('#actual').style.display = "block";
    document.querySelector('#extendido').style.display = "flex";
    document.querySelector('#infoComplementaria').style.display = "flex";
    document.querySelector('#infoHora').style.display = "block";
    document.querySelector('nav').style.display = "block";
}

/************************************* Eventos *****************************************/
document.addEventListener('DOMContentLoaded', styles())
document.addEventListener('DOMContentLoaded', posicionActual())

//************************************************************************************//

/************************************* Seccion Selectores *****************************************/
document.addEventListener('DOMContentLoaded', provincias())

const selectorP = document.querySelector('#provincias')
const selectorM = document.querySelector('#municipios')
const ubicar = document.querySelector('nav button')

selectorP.addEventListener('change', () => {
    const seleccion = selectorP.value
    municipios(seleccion)
})

ubicar.addEventListener('click', () => {
    const provSelec = selectorP.value
    const muniSelec = selectorM.value
    let latitud
    let longitud
    if (provSelec == 'default') {
        location.reload()
    } else if (provSelec == 30 || provSelec == 78 || provSelec == 02 || provSelec == 86 || provSelec == 94) {
        // 38: Entre Rios; 78: Santa Cruz; 02: Ciudad autonoma de bs as; 86: Santiago del estero; 94: Tierra del fuego
        switch (provSelec) {
            case '30':
                latitud = -31.7747
                longitud = -60.4956
                break
            case '78':
                latitud = -51.6353
                longitud = -69.2474
                break
            case '02':
                latitud = -34.6037
                longitud = -58.3816
                break
            case '86':
                latitud = -27.7834
                longitud = -64.2642
                break
            default:
                latitud = -54.8054
                longitud = -68.3242
        }
        localizacion(latitud, longitud)
        borrarContenidos()
        climaActual(latitud, longitud)
    } else {
        fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${provSelec}&max=1000`)
            .then(result => result.json())
            .then(datos => {
                datos.municipios.forEach((objetos, index) => {
                    if (objetos.id == muniSelec) {
                        latitud = objetos.centroide.lat
                        longitud = objetos.centroide.lon
                    }
                })
                localizacion(latitud, longitud)
                borrarContenidos()
                climaActual(latitud, longitud)
            })
    }
})

/************************************* Selector Provincias *****************************************/
function provincias() {
    fetch('https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre')
        .then(result => result.json())
        .then(datos => {
            selectorProvincias(datos)
        })
}

function selectorProvincias(datos) {
    const selector = document.querySelector('#provincias')
    const provincias = datos.provincias
    provincias.sort((a, b) => {
        if (a.nombre > b.nombre) {
            return 1
        }
        if (a.nombre < b.nombre) {
            return -1
        }
        return 0
    })
    for (let i = 0; i < provincias.length; i++) {
        const opcion = document.createElement('option')
        opcion.setAttribute('value', provincias[i].id)
        opcion.textContent = provincias[i].nombre
        selector.appendChild(opcion)
    }
}

/************************************* Selector Municipios *****************************************/
function municipios(seleccion) {
    fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${seleccion}&max=1000`)
        .then(result => result.json())
        .then(datos => {
            selectorMunicipios(datos)
        })
}

function selectorMunicipios(datos) {
    const selector = document.querySelector('#municipios')
    const municipios = datos.municipios
    municipios.sort((a, b) => {
        if (a.nombre > b.nombre) {
            return 1
        }
        if (a.nombre < b.nombre) {
            return -1
        }
        return 0
    })
    let opciones = document.querySelectorAll('#municipios option')
    if (opciones.length == 0) {
        for (let i = 0; i < municipios.length; i++) {
            const opcion = document.createElement('option')
            opcion.setAttribute('value', municipios[i].id)
            opcion.textContent = municipios[i].nombre
            selector.appendChild(opcion)
        }
    } else {
        for (let y = 0; y < opciones.length; y++) {
            selector.removeChild(opciones[y])
        }
        for (let i = 0; i < municipios.length; i++) {
            const opcion = document.createElement('option')
            opcion.setAttribute('value', municipios[i].id)
            opcion.textContent = municipios[i].nombre
            selector.appendChild(opcion)
        }
    }
}

/************************************* Borrar contenidos *****************************************/
function borrarContenidos() {
    const slotTemp = document.querySelector('#temperatura div p')
    const maxMin = document.querySelectorAll('#maxMin p')
    const elementosTempExtendida = document.querySelectorAll('#extendido div p')
    const elementosInfoComplementaria = document.querySelectorAll('#infoComplementaria div p')
    const elementosInfoHora = document.querySelectorAll('#infoHora div p')
    const imgInfoHora = document.querySelectorAll('#infoHora div img')
    slotTemp.remove()
    maxMin.forEach(temperaturas => temperaturas.remove())
    elementosTempExtendida.forEach(elementos => elementos.remove())
    elementosInfoComplementaria.forEach(elementos => elementos.remove())
    elementosInfoHora.forEach(elementos => elementos.remove())
    imgInfoHora.forEach(img => img.remove())
}