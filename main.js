function startPlayingUI(cover) {
    clickFeedback()
    display.innerText = "STARTING"
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

function powerOn(btn) {
    clickFeedback()
    btn.classList = "powerbtn on"
    btn.onclick = function () {
        clickFeedback()
        display.innerText = "POWERING OFF"
        stopPlayingUI()
        setTimeout(function () {
            location.reload()
        }, 1000)
    }
    startReader()
    display.innerText = "Scanning"
}

function clickFeedback() {
    navigator.vibrate(100);
    click.play()
}

function stopPlayingUI() {
    record.style.animationIterationCount = "1"
    setTimeout(function () {
        navigator.vibrate(500);
        arm.style.transform = "rotate(0deg)"
    }, 500)
}