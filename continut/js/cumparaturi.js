class Produs{
    constructor(nume,cantitate){
        this.nume = nume;
        this.cantitate = cantitate;
    }
}

var table;
var worker;
var n = null;

function adauga_cumparatura(){
    let nume = document.getElementById("nume-produs").value;
    let cantitate = document.getElementById("cantitate-produs").value;

    let p = new Produs(nume,cantitate);
    n = localStorage.getItem("nr");
    if(n == null){
        n = 0;
    } else {
        n = parseInt(n);
    }
    localStorage.setItem("" + n, JSON.stringify(p));
    localStorage.setItem("nr",n+1+"");
    worker = new Worker('worker.js');

    worker.onmessage = function(e) {
        let currentRow = document.createElement('tr');
    
        let td1 = document.createElement('td');
        td1.innerHTML = "" + n;
        currentRow.appendChild(td1);
    
        let td2 = document.createElement('td');
        td2.innerHTML = e.data.nume;
        currentRow.appendChild(td2);
    
        let td3 = document.createElement('td');
        td3.innerHTML = e.data.cantitate;
        currentRow.appendChild(td3);
    
        table.appendChild(currentRow);
        n = n + 1;
    }

    worker.postMessage(p);
}

function set_cumparaturi(){
    //localStorage.clear();
    console.log('loading...')
    var d = document.getElementById("cumparaturi");

    table = document.createElement('table');
    let headingRow = document.createElement('tr');
    
    let h1 = document.createElement('th');
    h1.innerHTML = "Nr.";
    headingRow.append(h1);

    let h2 = document.createElement('th');
    h2.innerHTML = "Nume";
    headingRow.append(h2);

    let h3 = document.createElement('th');
    h3.innerHTML = "Cantitate";
    headingRow.append(h3);

    table.append(headingRow);

    n = localStorage.getItem("nr");
    if(n == null){
        n = 0;
    } else {
        n = parseInt(n);
    }

    console.log("Cate produse " + n)
    for(let i = 0; i < n; ++i){
        let produs = JSON.parse(localStorage.getItem("" + i));
        console.log(produs);

        let currentRow = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerHTML = "" + i;
        currentRow.appendChild(td1);

        let td2 = document.createElement('td');
        td2.innerHTML = produs.nume;
        currentRow.appendChild(td2);

        let td3 = document.createElement('td');
        td3.innerHTML = produs.cantitate;
        currentRow.appendChild(td3);

        table.appendChild(currentRow);
    }
            
    console.log(table);
    d.appendChild(table);
};

function sterge_cumparatura(){
    n = localStorage.getItem("nr");
    if(n == null){
        n = 0;
    } else {
        n = parseInt(n);
    }
    let id = parseInt(document.getElementById("id-produs").value);
    if(id < n && n > 0){
        for(i = id; i < n; ++i){
            if(id == i){
                localStorage.removeItem(i);
                continue;
            }
            let p = localStorage.getItem(i);
            console.log(i + " " + p);
            localStorage.removeItem(i);
            localStorage.setItem((i-1) + "", p);
        }
        document.getElementById('cumparaturi').removeChild(table);
        localStorage.setItem("nr",n-1+"");
        set_cumparaturi();
    }
};

function clear_cumparatura() {
    localStorage.clear();
    document.getElementById('cumparaturi').removeChild(table);
    set_cumparaturi();
};