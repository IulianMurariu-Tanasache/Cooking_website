var timer = null;

function onload_display_info() {
    let url = window.location.href;
    window.navigator.geolocation.getCurrentPosition(showPosition);
    timer = setInterval(update_time, 1000);
    document.getElementById("url-meu").innerHTML = url;
    document.getElementById("browser-nume").innerHTML = window.navigator.userAgent;
    document.getElementById("os-meu").innerHTML = window.navigator.platform
}

function update_time() {
    let elem = document.getElementById("data-mea");
    elem.innerHTML = new Date();
}

function showPosition(position) {
    document.getElementById("locatia-mea").innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
}

var rect_first = null;
var canvas_clicks = 0;

function onclick_canvas(e) {
    canvas_clicks = canvas_clicks + 1;
    console.log(canvas_clicks)
    switch(canvas_clicks){
        case 1:
            rect_first = [e.offsetX, e.offsetY];
            break;
        case 2:
            let rect_second = [e.offsetX, e.offsetY];
            canvas_clicks = 0;
            let canvas_obj = document.getElementById("canvas-sec2");
            let ctx = canvas_obj.getContext("2d");
            let border_color = document.getElementById('Border-color').value;
            let fill_color = document.getElementById('Fill-color').value;
            ctx.clearRect(0,0,canvas_obj.width,canvas_obj.height);
            console.log(rect_first[1]);
            console.log(rect_second[1]);
            ctx.fillStyle = fill_color;
            ctx.strokeStyle = border_color;
            ctx.fillRect(Math.min(rect_first[0], rect_second[0]), Math.min(rect_first[1], rect_second[1]), Math.abs(rect_first[0] - rect_second[0]), Math.abs(rect_first[1] - rect_second[1]));
            ctx.strokeRect(Math.min(rect_first[0], rect_second[0]) - 1, Math.min(rect_first[1], rect_second[1]) - 1, Math.abs(rect_first[0] - rect_second[0]) + 1, Math.abs(rect_first[1] - rect_second[1]) + 1);
            rect_first = null;
            break;
    }
}

function schimbaContinut(resursa, jsFisier, jsFunctie){
    if(timer != null){
        clearInterval(timer);
        timer = null;
    }
    
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = 
            function() {
                if(this.readyState == 4 && this.status == 200)
                    {
                        document.getElementById("continut").innerHTML = this.responseText;
                        if (jsFisier) {
                            var elementScript = document.createElement('script');
                            elementScript.onload = function () {
                                console.log("hello");
                                if (jsFunctie) {
                                    window[jsFunctie]();
                                }
                            };
                            elementScript.src = jsFisier;
                            document.head.appendChild(elementScript);
                        } else {
                            if (jsFunctie) {
                                window[jsFunctie]();
                            }
                        }
                    }
            }
        xhttp.open("GET",resursa);
        xhttp.send();
        xhttp = new XMLHttpRequest();
        xhttp.open("GET","stil.css");
        xhttp.send();
        console.log("stil cerut")
    }
}

function changeRange() {
    var range = document.getElementById('skill');
    var span = document.getElementById('eval-apt');
    span.innerHTML = parseInt(range.value);
}