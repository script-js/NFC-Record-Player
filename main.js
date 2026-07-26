var playing = false;

function startPlayingUI(cover) {
    display.innerText = "STARTING"
    if (playing) {
        stopPlayingUI()
        setTimeout(startPlayingUI(cover), 1000)
    } else {
        playing = true;
        record.style.backgroundImage = 'url("' + cover + '")'
        setTimeout(function () {
            navigator.vibrate(500);
            arm.style.transform = "rotate(20deg)"
        }, 500)
        setTimeout(function () {
            record.style.animation = "playing linear 1000ms"
            record.style.animationIterationCount = "infinite"
            display.innerText = "PLAY"
        }, 1500)
    }
}

function enablePlayButton(pauseAction) {
    playbtn.onclick = pauseAction
    playbtn.disabled = false
}

function showPopup() {
    popup.style.display = "block"
    setTimeout(function () {
        popup.style.bottom = "-2%"
    }, 100)
}

function hidePopup() {
    popup.style.bottom = "-50%"
    setTimeout(function () {
        popup.style.display = "none"
    }, 100)
}


function powerOn(btn) {
    clickFeedback()
    btn.classList = "powerbtn on"
    btn.onclick = function () {
        clickFeedback()
        display.innerText = "POWERING OFF"
        if (playing) { stopPlayingUI() }
        setTimeout(function () {
            location.reload()
        }, 1000)
    }
    startReader()
    display.innerText = "Scanning"
    writebtn.disabled = false
}

function clickFeedback() {
    navigator.vibrate(50);
    click.play()
}

function stopPlayingUI() {
    record.style.animationIterationCount = "1"
    setTimeout(function () {
        navigator.vibrate(500);
        arm.style.transform = "rotate(0deg)"
    }, 500)
}
