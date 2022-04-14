class Produs{
    constructor(nume,cantitate){
        this.nume = nume;
        this.cantitate = cantitate;
    }
}

function adauga_cumparatura(){
    let nume = document.getElementById("nume-produs").value;
    let cantitate = document.getElementById("cantitate-produs").value;

    let p = new Produs(nume,cantitate);
    let n = localStorage.getItem("nr");
    if(n == null){
        n = 0;
    } else {
        n = parseInt(n);
    }
    localStorage.setItem("" + n, JSON.stringify(p));
    localStorage.set("nr",n+1+"");
}

function set_cumparaturi(){
    var d = document.getElementById("cumparaturi");

    var table = document.createElement('table');
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

    headingRow.append(h1);
    headingRow.append(h2);
    headingRow.append(h3);
    table.append(headingRow);

    var n = localStorage.getItem("nr");
    if(n == null){
        n = 0;
    } else {
        n = parseInt(n);
    }

    for(let i = 0; i < n; ++i){
        let produs = JSON.parse(localStorage.getItem("" + i));

        let currentRow = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerHTML = produs.nume;
        currentRow.appendChild(td1);

        let td2 = document.createElement('td');
        td2.innerHTML = produs.cantitate;
        currentRow.appendChild(td2);

        table.appendChild(currentRow);
    }
            
    console.log(table);
    d.appendChild(table);
});
}