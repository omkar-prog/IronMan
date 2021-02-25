if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('sw.js')
        .then(registration => {
            console.log('SW Registered')
            console.log(registration)
        })
        .catch(error => {
            console.log(`Error : ${error}`)
        })

}
const speechRecognition = window.webkitSpeechRecognition

function startListening() {
    const recog = new speechRecognition()
    recog.start()

    recog.onstart = console.log('Started listening')
    recog.onresult = function(data) {
        handleResults(data)
    }
}

let h2 = document.getElementById('text')
h2.addEventListener('click', startListening)

function handleResults(data) {
    let text = data.results[0][0].transcript
    text = text.toLowerCase()
    console.log(text)
    if (text.includes('jarvis')) {
        let jarvis_index = text.indexOf('jarvis')
        let final_command = text.slice(jarvis_index + 6, data.length)
        h2.innerHTML = final_command
        processCommand(final_command)
        if (final_command.includes('instagram')) {
            window.open('https://www.instagram.com')
        } else if (
            final_command.includes('search') &&
            final_command.includes('youtube') &&
            final_command.includes('for')
        ) {
            let for_index = final_command.indexOf('for') + 4
            let c = final_command.slice(for_index, final_command.length)
            console.log(c)
            window.open(`https://www.youtube.com/results?search_query=${c}`)
            Speak(`Searching youtube for ${c} , your majesty`)
        } else if (final_command.includes('youtube')) {
            window.open('https://www.youtube.com')
        } else if (final_command.includes('whatsapp')) {
            window.open('https://web.whatsapp.com/')
        } else if (
            final_command.includes('search') &&
            final_command.includes('google') &&
            final_command.includes('for')
        ) {
            let for_index = final_command.indexOf('for') + 4
            let c = final_command.slice(for_index, final_command.length)
            console.log(c)
            window.open(
                `https://in.search.yahoo.com/search?fr=mcafee&type=E211IN826G91441&p=${c}`
            )
            Speak(`Searching google for ${c} , your majesty`)
        } else if (final_command.includes('google')) {
            window.open('https://www.google.com')
        } else if (final_command.includes('classroom')) {
            Speak('Opening classroom')
            window.open('https://classroom.google.com/u/0/h')
        } else if (final_command.includes('facebook')) {
            window.open('https://www.facebook.com')
        } else if (final_command.includes('meet')) {
            window.open('http://meet.google.com/new')
        } else if (
            final_command.includes('search') &&
            final_command.includes('wikipedia') &&
            final_command.includes('for')
        ) {
            let for_index = final_command.indexOf('for') + 4
            let c = final_command.slice(for_index, final_command.length)
            console.log(c)
            window.open(`https://en.wikipedia.org/wiki/${c}`)
            Speak(`Searching wikipedia for ${c} , your majesty`)
        } else if (
            final_command.includes('song') &&
            final_command.includes('play')
        ) {
            let body = document.getElementsByTagName('body')[0]

            let a = document.createElement('input')
            a.setAttribute('type', 'file')
            a.setAttribute('name', 'myFile')
            a.setAttribute('id', 'myFile')

            body.appendChild(a)
            let music_file = document.getElementById('myFile')
            music_file.addEventListener('change', () => {
                let file = music_file.files[0]
                if (file) {
                    let reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onload = e => {
                        console.log(e.target.result, e.target.result.length)
                        let audio = document.getElementById('audio')
                        audio.setAttribute('src', e.target.result)
                    }
                }
            })
        } else if (
            final_command.includes('alarm') &&
            final_command.includes('at')
        ) {
            let at = final_command.indexOf('at') + 3
            let full_time = final_command.slice(at, final_command.length)
            if (full_time.length == 3) {
                let hour = full_time.slice(0, 1)
                let minute = full_time.slice(1, 3)
                setInterval(() => {
                    let date = new Date()
                    let hours = date.getHours()
                    let minutes = date.getMinutes()
                    if (hour == hours && minute == minutes) {
                        Speak('Wake up sir')
                    }
                }, 1000)
            } else if (full_time.length == 4) {
                let hour = full_time.slice(0, 2)
                let minute = full_time.slice(2, 4)
                setInterval(() => {
                    let date = new Date()
                    let hours = date.getHours()
                    let minutes = date.getMinutes()
                    if (hour == hours && minute == minutes) {
                        Speak('Wake up sir')
                    }
                }, 1000)
            }
        } else if (final_command.includes('weather')) {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(setPosition, showError)
            }
        } else if (final_command.includes('video')) {
            capture(final_command)
        } else if (final_command.includes('audio')) {
            capture_audio(final_command)
        }
    }

    function processCommand(UserText) {
        if (UserText.includes('instagram')) {
            Speak('Opening instagram')
        } else if (UserText.includes('youtube')) {
            Speak('Opening youtube')
        } else if (UserText.includes('whatsapp')) {
            Speak('Opening whatsapp')
        } else if (UserText.includes('google')) {
            Speak('Opening google')
        } else if (UserText.includes('facebook')) {
            Speak('Opening facebook')
        } else if (UserText.includes('the') && UserText.includes('time')) {
            Speak(`The time is : ${getCurrentTime()}`)
            console.log(`The time is : ${getCurrentTime()}`)
        }
    }
}

function getCurrentTime() {
    let date = new Date()
    let [hours, minutes] = [date.getHours(), date.getMinutes()]
    if (hours > 12) {
        return `${hours - 12}:${minutes}`
    } else {
        Speak('Good Morning')
        return `${hours}:${minutes}`
    }
}

function Speak(TEXT) {
    const utter = new window.SpeechSynthesisUtterance()
    utter.text = TEXT
    window.speechSynthesis.speak(utter)
}

function setPosition(position) {
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude
    getWeather(latitude, longitude)
}

function showError(error) {
    console.log(error)
}

const key = 'c5d0835c4bb055de464fcbbd305985ea'

function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`
    fetch(api)
        .then(response => {
            let data = response.json()
            return data
        })
        .then(data => {
            console.log(data)
            let [place, humidity, temperature, country] = [
                data.name,
                data.main.humidity,
                data.main.temp - 273,
                data.sys.country
            ]

            if (country == 'IN') {
                let full_country_name = 'India'
                Speak(
                    `The temperature at ${place} in ${full_country_name}, is ${Math.floor(
            temperature
          )} degree celsius and humidity is ${humidity} percent`
                )
            }
        })
}

function capture(command) {
    let body = document.getElementsByTagName('body')[0]
    let video = document.createElement('video')
    video.setAttribute('type', 'video/mp4')
    video.setAttribute('autoplay', 'true')
    video.setAttribute('controls', 'true')

    body.appendChild(video)

    if (command.includes('video') && command.includes('facing me')) {
        let stop = document.createElement('button')
        stop.setAttribute('id', 'stopBtn')
        stop.innerHTML = `<h2>Stop</h2>`
        body.appendChild(stop)
        let constraints = {
            audio: false,
            video: {
                facingMode: 'user',
                width: { min: 640, max: 1000 },
                height: { min: 480, max: 800 }
            }
        }

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(mediaStreamObject => {
                let video = document.querySelector('video')

                video.srcObject = mediaStreamObject
                console.log(mediaStreamObject)
                video.onloadedmetadata = e => {
                    video.play()
                    let stopBtn = document.getElementById('stopBtn')
                    let recorder = new MediaRecorder(mediaStreamObject)
                    let chunks = []
                    recorder.start()

                    stopBtn.addEventListener('click', () => {
                        recorder.stop()
                        let video2 = document.createElement('video')
                        video2.setAttribute('id', 'vid')
                        video2.setAttribute('controls', 'true')
                        body.appendChild(video2)

                        video.style.display = 'none'
                    })
                    recorder.ondataavailable = e => {
                        chunks.push(e.data)
                    }
                    recorder.onstop = e => {
                        let blob = new Blob(chunks, { type: 'video/mp4' })
                        chunks = []

                        let vidSave = document.getElementById('vid')
                        let videoURL = window.URL.createObjectURL(blob)
                        vidSave.src = videoURL
                    }
                }
            })
            .catch(err => {
                console.log(err.name, err.message)
            })
    } else if (command.includes('video') && command.includes('back camera')) {
        let stop = document.createElement('button')
        stop.setAttribute('id', 'stopBtn')
        stop.innerHTML = `<h2>Stop</h2>`
        body.appendChild(stop)
        let constraints = {
            audio: false,
            video: {
                facingMode: 'environment',
                width: { min: 640, max: 1000 },
                height: { min: 480, max: 800 }
            }
        }

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(mediaStreamObject => {
                let video = document.querySelector('video')

                video.srcObject = mediaStreamObject
                console.log(mediaStreamObject)
                video.onloadedmetadata = e => {
                    video.play()
                    let stopBtn = document.getElementById('stopBtn')
                    let recorder = new MediaRecorder(mediaStreamObject)
                    let chunks = []
                    recorder.start()

                    stopBtn.addEventListener('click', () => {
                        recorder.stop()
                        let video2 = document.createElement('video')
                        video2.setAttribute('id', 'vid')
                        video2.setAttribute('controls', 'true')
                        body.appendChild(video2)

                        video.style.display = 'none'
                    })
                    recorder.ondataavailable = e => {
                        chunks.push(e.data)
                    }
                    recorder.onstop = e => {
                        let blob = new Blob(chunks, { type: 'video/mp4' })
                        chunks = []

                        let vidSave = document.getElementById('vid')
                        let videoURL = window.URL.createObjectURL(blob)
                        vidSave.src = videoURL
                    }
                }
            })
            .catch(err => {
                console.log(err.name, err.message)
            })
    }
}

function capture_audio(command) {
    let body = document.getElementsByTagName('body')[0]
    let audio = document.createElement('audio')
    audio.setAttribute('type', 'audio/mpeg')
    audio.setAttribute('autoplay', 'true')
    audio.setAttribute('controls', 'true')

    body.appendChild(audio)

    if (command.includes('audio')) {
        let stop = document.createElement('button')
        stop.setAttribute('id', 'stopBtn')
        stop.innerHTML = `Stop`
        body.appendChild(stop)
        let constraints = {
            audio: true,
            video: false
        }

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(mediaStreamObject => {
                let audio = document.querySelectorAll('audio')[1]
                console.log(audio)

                audio.srcObject = mediaStreamObject
                console.log(mediaStreamObject)
                audio.onloadedmetadata = e => {
                    audio.play()
                    let stopBtn = document.getElementById('stopBtn')
                    let recorder = new MediaRecorder(mediaStreamObject)
                    let chunks = []
                    recorder.start()

                    stopBtn.addEventListener('click', () => {
                        recorder.stop()
                        let audio2 = document.createElement('audio')
                        audio2.setAttribute('id', 'audSave')
                        audio2.setAttribute('controls', 'true')
                        body.appendChild(audio2)

                        audio.style.display = 'none'
                    })
                    recorder.ondataavailable = e => {
                        chunks.push(e.data)
                    }
                    recorder.onstop = e => {
                        let blob = new Blob(chunks, { type: 'audio/mpeg' })
                        chunks = []

                        let audSave = document.getElementById('audSave')
                        console.log(audSave)
                        let audioURL = window.URL.createObjectURL(blob)
                        audSave.src = audioURL
                    }
                }
            })
            .catch(err => {
                console.log(err.name, err.message)
            })
    }
}