var ytplayer;
var yterror = false;

function loadYTPlayer(url) {
    var id = url.split("youtu")[1].replace("be.com", "").replace(".be/", "/watch?v=").split("watch?v=")[1].split("?")[0].split("&")[0]
    console.log(id)
    ytplayer = new YT.Player('ytplayerdiv', {
        height: '1',
        width: '1',
        videoId: id,
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
        pauseUI()
    })
}

function onPlayerStateChange(event) {
    console.log(event)
}