import { ICON_MAP } from "./iconMap"
import { getWeather, getSampleWeather } from "./weather"
import "./style.css"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({ coords }) {
    getWeather(
        coords.latitude,
        coords.longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone
    )
        .then(renderWeather)
        .catch(e => {
            console.error(e)
            alert("Error Retrieving Weather")
        })
}

function positionError() {
    alert("Error getting your location. Please allow us to use your location and refresh the page")
}

// getSampleWeather()
//     .then(renderWeather)
//     .catch(e => {
//         console.error(e)
//         alert("Error Boop")
//     })


function renderWeather({current, daily, hourly}) {
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    renderHourlyWeather(hourly)
    document.body.classList.remove("blurred")
}

function setVal(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode) {
    return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
    currentIcon.src = getIconUrl(current.iconCode)
    setVal("current-temp", current.currentTemp)
    setVal("current-high", current.highTemp)
    setVal("current-low", current.lowTemp)
    setVal("current-fl-high", current.highFeelsLike)
    setVal("current-fl-low", current.lowFeelsLike)
    setVal("current-wind", current.windSpeed)
    setVal("current-precip", current.precip)
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" })
const dailySection = document.querySelector("[data-day-section]")
const dailyCardTemplate = document.getElementById("day-card-template")

function renderDailyWeather(daily) {
    dailySection.innerHTML = ""
    daily.forEach(day => {
        const element = dailyCardTemplate.content.cloneNode(true)
        setVal("temp", day.maxTemp, { parent: element })
        setVal("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
        element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
        dailySection.append(element)
    })
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" })
const hourlySection = document.querySelector("[data-hour-section]")
const hourlyCardTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
    hourlySection.innerHTML = ""
    hourly.forEach(hour => {
        const element = hourlyCardTemplate.content.cloneNode(true)
        setVal("day", DAY_FORMATTER.format(hour.timestamp), { parent: element })
        setVal("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element })
        setVal("temp", hour.temp, { parent: element })
        setVal("fl-temp", hour.feelsLike, { parent: element })
        setVal("wind", hour.windSpeed, { parent: element })
        setVal("precip", hour.precip, { parent: element })
        element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
        hourlySection.append(element)
    })
}