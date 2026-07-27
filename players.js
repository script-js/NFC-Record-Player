var ytplayer;

function loadYTPlayer(id) {
    ytplayer = new YT.Player('ytplayerdiv', {
        height: '1',
        width: '1',
        videoId: 'M7lc1UVf-VE',
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    var videoId = event.target.getVideoData().video_id
    startPlayingUI(`http://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, function() {
        event.target.playVideo()
    })
    enablePlayButton(function() {
        pauseUI()
        if (playing) {
            event.target.pauseVideo()
        } else {
            event.target.playVideo()
        }
    })
}

function onPlayerStateChange(event) {
    console.log(event)
}