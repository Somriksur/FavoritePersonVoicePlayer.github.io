// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
}

document.getElementById('single-loop').addEventListener('click', function() {
    let audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        audio.loop = true;
    });
    this.classList.add('active');
    document.getElementById('all-in-loop').classList.remove('active');
    document.getElementById('reset').classList.remove('clicked'); // Reset button color on loop change
});

document.getElementById('all-in-loop').addEventListener('click', function() {
    let audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        audio.loop = false;
    });
    this.classList.add('active');
    document.getElementById('single-loop').classList.remove('active');
    document.getElementById('reset').classList.remove('clicked'); // Reset button color on loop change
});

document.getElementById('reset').addEventListener('click', function() {
    let audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        audio.loop = false;
        audio.pause();
        audio.currentTime = 0;
    });
    document.getElementById('single-loop').classList.remove('active');
    document.getElementById('all-in-loop').classList.remove('active');
    this.classList.add('clicked'); // Change color on click
});

let audios = document.querySelectorAll('audio');
audios.forEach((audio, index) => {
    audio.addEventListener('play', function() {
        audios.forEach((otherAudio, otherIndex) => {
            if (index !== otherIndex) {
                otherAudio.pause();
                otherAudio.currentTime = 0;
            }
        });
    });

    audio.addEventListener('ended', function() {
        let nextAudio = audios[(index + 1) % audios.length];
        nextAudio.play();
    });
});

// Page Visibility API
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        audios.forEach(audio => {
            if (!audio.paused) {
                audio.pause();
                audio.dataset.wasPlaying = true;
            }
        });
    } else {
        audios.forEach(audio => {
            if (audio.dataset.wasPlaying) {
                audio.play();
                delete audio.dataset.wasPlaying;
            }
        });
    }
});

// Media Session API
if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', function() {
        let playingAudio = document.querySelector('audio:not([paused])');
        if (playingAudio) {
            playingAudio.play();
        }
    });

    navigator.mediaSession.setActionHandler('pause', function() {
        let playingAudio = document.querySelector('audio:not([paused])');
        if (playingAudio) {
            playingAudio.pause();
        }
    });
}
self.addEventListener('install', function(event) {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker activating.');
});

self.addEventListener('fetch', function(event) {
    console.log('Fetching:', event.request.url);
});

