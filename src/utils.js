export function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

function scale() {
    document.body.style.transform = `scale(${document.documentElement.clientWidth / 1920})`
    document.body.style.transformOrigin = "left top"
}

window.addEventListener("resize", scale)
scale()
