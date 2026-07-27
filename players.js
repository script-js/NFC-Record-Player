var ytp;

function onYouTubeIFrameAPIReady() {
    ytp = new YT.Player('ytplayer', {
        height: '1',
        width: '1',
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': () => { window.open(url) }
        }
    });
}

function loadYTPlayer(url) {
    var videoId = url.split("youtu")[1].replace("be.com", "").replace(".be/", "/watch?v=").split("watch?v=")[1].split("?")[0].split("&")[0]
    ytp.loadVideoById({ videoId })
}

function onPlayerReady(event) {
    var videoId = event.target.getVideoData().video_id
    startPlayingUI(`http://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, function () {
        event.target.playVideo()
    })
    enablePlayButton(function () {
        if (playing) {
            event.target.pauseVideo()
        } else {
            event.target.playVideo()
        }
        pauseUI(event.target.getPlayerState() === 1)
    })
}

function onPlayerStateChange(event) {
    console.log(event)
}