// Ever so slightly modified, localized and minified by Bjorn Sortland
var maxCircles = 150,
    canvas, stage, audio, image, barL, barR, bg, star, star2, bmp, glow, pos, playing, volumeData, scanLineImage, frontSphere, backSphere, light, circles, frontCircles, backCircles, scanLines, fpsFld, loadingFld;

function init() {
    canvas = document.getElementById("vslzr");
    stage = new Stage(canvas);
    stage.autoClear = false;
    audio = document.getElementById("dmb");
    var w = canvas.width,
        h = canvas.height;
    scanLineImage = new Image();
    scanLineImage.src = "scanlines.png";
    loadMusic("dmb.jpg");
    var screen = new Shape();
    screen.graphics.beginFill("rgba(16,16,16,.25)").drawRect(0, 0, w + 1, h + 1);
    star = new Shape();
    star.graphics.beginFill(Graphics.getRGB(128, 40, 255, .03)).drawPolyStar(0, 0, h * .7, 48, .95);
    star.graphics.beginFill(Graphics.getRGB(128, 40, 255, .18)).drawPolyStar(0, 0, h * .75, 6, .93);
    star.graphics.beginFill(Graphics.getRGB(128, 40, 255, .05)).drawPolyStar(0, 0, h * .72, 24, .93);
    star.compositeOperation = "lighter";
    star2 = star.clone();
    star2.alpha = .4;
    bg = new Container();
    bg.addChild(star, star2);
    fpsFld = new Text("", "10px Arial", "#FFF");
    fpsFld.alpha = .4;
    fpsFld.x = 20;
    fpsFld.y = 26;
    var r = 40;
    backSphere = new Shape();
    backSphere.graphics.beginFill("#111").drawCircle(0, 0, r);
    frontSphere = new Shape();
    frontSphere.graphics.beginRadialGradientFill(["rgba(0,0,0,0)", "rgba(0,0,0,.6)"], [0, 1], -r * .2, -r * .2, 0, -r * .1, -r * .1, r);
    frontSphere.graphics.drawCircle(0, 0, r);
    glow = new Shape();
    glow.graphics.beginRadialGradientFill(["rgba(230,180,255,.5)", "rgba(10,30,255,0)"], [0, 1], 0, 0, 0, 0, 0, w / 2).drawCircle(0, 0, w / 2);
    glow.graphics.beginFill("rgba(128,0,128,.1)").drawCircle(0, 0, r * 3);
    glow.graphics.beginFill("rgba(160,128,255,.1)").drawCircle(0, 0, r * 2);
    glow.compositeOperation = "lighter";
    light = new Shape();
    light.graphics.beginFill("#95F").drawCircle(0, 0, r);
    light.x = backSphere.x = glow.x = frontSphere.x = w / 2;
    light.y = backSphere.y = glow.y = frontSphere.y = h / 2;
    light.compositeOperation = "lighter";
    scanLines = new Shape();
    bg.x = canvas.width / 2;
    bg.y = canvas.height / 2;
    bg.scaleX = canvas.width / canvas.height;
    frontCircles = new Container();
    backCircles = new Container();
    frontCircles.x = backCircles.x = w / 2;
    frontCircles.y = backCircles.y = h / 2;
    loadingFld = new Text("Loading audio...", "21px Arial", "#333");
    loadingFld.textAlign = "center";
    loadingFld.textBaseline = "middle";
    loadingFld.x = w / 2;
    loadingFld.y = h / 2;
    stage.addChild(screen, fpsFld, loadingFld);
    stage.update();
    circles = [];
    Ticker.setFPS(20);
}

function addCircle() {
    var circle = new Shape();
    circle.compositeOperation = "lighter";
    circle.graphics.beginFill(Graphics.getRGB(20, 10, 90, Math.random() * .1 + .1)).drawCircle(0, 0, 50);
    circle.graphics.beginFill(Graphics.getRGB(55, 30, 65, Math.random() * .2 + .2), 100, Math.random() * 5 + 90, 1).drawPolyStar(0, 0, 20, 6);
    var a = Math.random() * Math.PI * 2,
        d = Math.random() * 110 + 40;
    circle._x = Math.cos(a) * d;
    circle._y = Math.sin(a) * d;
    circle.z = Math.random() * 50 + 100;
    a = Math.random() * Math.PI * 2;
    d = Math.random() * 15 + 10;
    circle.velX = Math.cos(a) * d;
    circle.velY = Math.sin(a) * d;
    circle.velZ = Math.random() * 30 - 15;
    circle.alpha = .5;
    circles.push(circle);
}

function removeCircle() {
    if (circles.length == 0) {
        return;
    }
    var circle = circles.pop();
    if (circle.parent) {
        circle.parent.removeChild(circle);
    }
}

function loadMusic(dataImageURL) {
    image = new Image();
    image.src = dataImageURL;
    playing = false;
    Ticker.addListener(window);
}

function tick() {
    fpsFld.text = Math.round(Ticker.getMeasuredFPS()) + "fps";
    if (!playing && image.complete && scanLineImage.complete && audio.readyState >= 4) {
        playing = true;
        volumeData = new VolumeData(image);
        volumeData.gain = 1;
        audio.play();
        scanLines.graphics.beginBitmapFill(scanLineImage).drawRect(0, 0, canvas.width + 1, canvas.height + 1);
        stage.removeChild(loadingFld);
        stage.addChild(bg, glow, backCircles, backSphere, light, frontSphere, frontCircles, scanLines, fpsFld);
        stage.clear();
    } else {
        audio.play();
    }
    if (!playing) {
        return;
    }
    var t = audio.currentTime,
        vol = volumeData.getVolume(t),
        avgVol = volumeData.getAverageVolume(t - .1, t),
        volDelta = volumeData.getVolume(t - .05);
    volDelta.left = vol.left - volDelta.left;
    volDelta.right = vol.right - volDelta.right;
    star.rotation += avgVol.right * avgVol.left * 4 - .3;
    star2.rotation = -star.rotation;
    glow.alpha = vol.right;
    light.alpha = avgVol.right * avgVol.left;
    glow.scaleX = glow.scaleY = star.scaleX = star.scaleY = vol.right * vol.right * .8 + .5;
    bg.alpha = vol.left * .5 - .1;
    scanLines.alpha = 1 - vol.right * vol.left * .7;
    frontSphere.alpha = Math.min(1, 3 - light.alpha * 2.6);
    var s = avgVol.right * avgVol.right * .8 + .3;
    frontCircles.scaleX = frontCircles.scaleY = backCircles.scaleX = backCircles.scaleY = Math.max(s, backCircles.scaleX + (s - backCircles.scaleX) * .1);
    frontSphere.scaleX = frontSphere.scaleY = backSphere.scaleX = backSphere.scaleY = light.scaleX = light.scaleY = 1 + avgVol.right * avgVol.right * .6;
    var l = circles.length,
        c = .3;
    while (l < maxCircles && volDelta.right + volDelta.left > c) {
        addCircle();
        c += .02;
        l++;
    }
    var max = (avgVol.right + avgVol.left) / 2 * maxCircles,
        focalDistance = 350;
    for (var i = l - 1; i >= 0; i--) {
        var circle = circles[i];
        circle.velX += circle.x * -.005;
        circle.velY += circle.y * -.005;
        circle.velZ += circle.z * -.005;
        circle._x += circle.velX;
        circle._y += circle.velY;
        circle.z += circle.velZ;
        var p = focalDistance / (circle.z + 400);
        circle.x = circle._x * p;
        circle.y = circle._y * p;
        circle.scaleX = circle.scaleY = (vol.left * vol.left * 1.1 + .4) * p * 2;
        circle.alpha = vol.left + vol.right + .4;
        if (circle.z > 0) {
            if (Math.sqrt(circle.x * circle.x + circle.y * circle.y) < 60 || (Math.random() < .15 && circle.z >= 100) && l > max) {
                if (circle.parent) {
                    circle.parent.removeChild(circle);
                }
                circles.splice(i, 1);
            } else {
                backCircles.addChild(circle);
            }
        } else {
            frontCircles.addChild(circle);
        }
    }
    stage.update();
}
