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

function insert_column() {
    var poz = document.getElementById("pozitie").value;
    if(poz != ""){
        poz = parseInt(poz);
        var table = document.getElementById("s3-table");
        var colorTable = document.getElementById("color-table").value;
        for(let row of table.childNodes[1].children){
            let newCell = document.createElement("td");
            newCell.style.backgroundColor = colorTable;
            row.insertBefore(newCell, row.children[poz]);
        }
    }
}

function insert_row() {
    var poz = document.getElementById("pozitie").value;
    if(poz != ""){
        poz = parseInt(poz);
        var table = document.getElementById("s3-table");
        let newRow = document.createElement("tr");
        var colorTable = document.getElementById("color-table").value;
        for(let column of table.childNodes[1].children[0].children){
            let newCell = document.createElement("td");
            newCell.style.backgroundColor = colorTable;
            newRow.appendChild(newCell);
        }
        table.childNodes[1].insertBefore(newRow, table.childNodes[1].children[poz]);
    }
}

function inregistreaza(){
    var obj = {}
    var user = document.getElementById("username").value;
    var pass = document.getElementById("parola").value;
    var nume = document.getElementById("nume").value;
    var prenume = document.getElementById("prenume").value;
    var email = document.getElementById("email").value;
    var telefon = document.getElementById("tel").value;
    var caminar = document.getElementById("camin").value;
    var reteta = document.getElementById("retetele").value;
    var nastere = document.getElementById("data").value;
    var ora = document.getElementById("ora").value;
    var aptitudini = document.getElementById("skill").value;
    var pagina = document.getElementById("pagina").value;
    var comentarii = document.getElementById("comm").value;
    obj.user = user;
    obj.parola = pass;

    if(obj.user == "" || obj.parola == ""){
        alert("Username sau parola neintrodusă!");
        return;
    }

    obj.nume = nume;
    obj.prenume = prenume;
    obj.email = email;
    obj.telefon = telefon;
    obj.caminar = caminar;
    obj.reteta = reteta;
    obj.nastere = nastere;
    obj.ora = ora;
    obj.aptitudini = aptitudini;
    obj.pagina = pagina;
    obj.comentarii = comentarii;
    
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = 
            function() {
                if(this.readyState == 4 && this.status == 200)
                {
                    if(this.responseText != ''){
                        var lista = JSON.parse(this.responseText);
                        lista.push(obj);
                        var json = JSON.stringify(lista);
                        xhttp.open("POST",'utilizatori.json');
                        xhttp.send(json);
                        console.log(json);
                    }
                }
            }
    }
    xhttp.open("GET",'utilizatori.json');
    xhttp.send();

    for(let input of document.getElementById('primul-fieldset').getElementsByTagName('input')){
        input.value = "";
    }

    for(let input of document.getElementById('2-fieldset').getElementsByTagName('input')){
        input.value = "";
    }

    document.getElementById("comm").value = "Acesta este site-ul meu preferat.";
    document.getElementById("eval-apt").innerText = "50";

    alert("Te-ai înregistrat cu succes!");
}