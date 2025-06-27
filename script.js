let progress = document.getElementById("progress-bar");
let song = document.getElementById("playing-song");
let playpause_btn = document.getElementById("playpause-song");
let next_btn = document.getElementById("next-song");
let prev_btn = document.getElementById("prev-song");
let fileInput = document.getElementById("file-input");
let dirInput = document.getElementById("dir-input");
let songNameElement = document.getElementById("song-name");
let artistElement = document.getElementById("song-artist");
let playlistElement = document.getElementById("playlist");

let playlist = [];
let currentSongIndex = 0;


function openNav(){
    document.getElementById("sidenav").style.width = "320px";
}
function closeNav() {
  document.getElementById("sidenav").style.width = "0";
}

document.getElementById("import-song-btn").addEventListener("click",function(e){
    e.preventDefault();
    document.getElementById("file-input").click();
});

document.getElementById("import-playlist-btn").addEventListener("click",function(e){
    e.preventDefault();
    document.getElementById("dir-input").click();
});


fileInput.addEventListener('change', function(e) {
    const files = e.target.files;
    if (files.length > 0) {
        addFilesToPlaylist(files);
        if (playlist.length > 0) {
            playSong(0);
        }
    }
});

dirInput.addEventListener('change', function(e) {
    const files = e.target.files;
    if (files.length > 0) {
        addFilesToPlaylist(files);
        if (playlist.length > 0) {
            playSong(0);
        }
    }
});

function addFilesToPlaylist(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('audio/')) {
            const fileURL = URL.createObjectURL(file);
            playlist.push({
                url: fileURL,
                name: file.name.replace(/\.[^/.]+$/, ""),
                artist: "Unknown Artist",
                file: file
            });
        }
    }
    updatePlaylistDisplay();
}


function updatePlaylistDisplay() {
    playlistElement.innerHTML = '';
    playlist.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${item.name}`;
        li.addEventListener('click', () => playSong(index));
        if (index === currentSongIndex) {
            li.classList.add('active');
        }
        playlistElement.appendChild(li);
    });
}

function playSong(index) {
    if (index >= 0 && index < playlist.length) {
        currentSongIndex = index;
        const currentSong = playlist[currentSongIndex];
        
        song.src = currentSong.url;
        song.play()
            .then(() => {
                updateSongInfo(currentSong.name, currentSong.artist);
                playpause_btn.classList.add("fa-pause");
                playpause_btn.classList.remove("fa-play");
                updatePlaylistDisplay();
            })
            .catch(error => {
                console.error("Error al reproducir:", error);
            });
    }
}



function updateSongInfo(title, artist) {
    songNameElement.textContent = title;
    artistElement.textContent = artist;
}


song.onloadedmetadata = function(){
    progress.max = song.duration;
    progress.value = song.currentTime;
    }

    song.onended = function() {
        playNext();
    };


    function playPause() {
        if (song.paused) {
            song.play()
                .then(() => {
                    playpause_btn.classList.add("fa-pause");
                    playpause_btn.classList.remove("fa-play");
                });
        } else {
            song.pause();
            playpause_btn.classList.remove("fa-pause");
            playpause_btn.classList.add("fa-play");
        }
    }
    
    function playNext() {
        const nextIndex = (currentSongIndex + 1) % playlist.length;
        playSong(nextIndex);
    }
    
    function playPrev() {
        const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        playSong(prevIndex);
    }

    if (song.play) {
        setInterval(() => {
            progress.value = song.currentTime;
        }, 500);
    }
    
    progress.onchange = function() {
        song.currentTime = progress.value;
        if (song.paused) {
            playPause();
        }
    };
    
    // Eventos de los botones de control
    next_btn.addEventListener('click', playNext);
    prev_btn.addEventListener('click', playPrev);
    playpause_btn.addEventListener('click', playPause);