function incarcaRetete(){
    fetch('retete.xml', {method: 'GET'}).then(
        function(response) {
            if (response.status == 200) {
                response.text().then(function(data) {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(data,"application/xml");
                    
                    let table = document.createElement('table');
                    let headingRow = document.createElement('tr');
                    let h1 = document.createElement('th');
                    h1.innerHTML = "Nume"
                    headingRow.append(h1);

                    let h2 = document.createElement('th');
                    h2.innerHTML = "Timp"
                    headingRow.append(h2);

                    let h3 = document.createElement('th');
                    h3.innerHTML = "Portie"
                    headingRow.append(h3);

                    let h4 = document.createElement('th');
                    h4.innerHTML = "Ingrediente"
                    headingRow.append(h4);

                    let h5 = document.createElement('th');
                    h5.innerHTML = "Preparare"
                    headingRow.append(h5);

                    headingRow.append(h1);
                    headingRow.append(h2);
                    headingRow.append(h3);
                    headingRow.append(h4);
                    headingRow.append(h5);
                    table.append(headingRow)
                    
                    for(let reteta of xmlDoc.getElementsByTagName('reteta')){
                        let currentRow = document.createElement('tr');

                        let td1 = document.createElement('td');
                        td1.innerHTML = reteta.getElementsByTagName('nume')[0].innerHTML;
                        currentRow.appendChild(td1);

                        let td2 = document.createElement('td');
                        td2.innerHTML = reteta.getElementsByTagName('timp')[0].innerHTML;
                        currentRow.appendChild(td2);

                        let td3 = document.createElement('td');
                        td3.innerHTML = reteta.getElementsByTagName('portie')[0].innerHTML;
                        currentRow.appendChild(td3);

                        let td4 = document.createElement('td');
                        let lista = document.createElement('ul');
                        for(let item of reteta.getElementsByTagName('ingredient'))
                        {
                            let li = document.createElement('li');
                            li.innerText = item.getElementsByTagName('nume')[0].innerHTML + " - " + item.getElementsByTagName('cantitate')[0].innerHTML;
                            li.style.textAlign = "left";
                            lista.appendChild(li);
                        }
                        td4.appendChild(lista);
                        currentRow.appendChild(td4);

                        let td5 = document.createElement('td');
                        td5.innerHTML = reteta.getElementsByTagName('preparare')[0].innerHTML;
                        td5.style = "width: 600px";
                        td5.style.textAlign = "justified";
                        currentRow.appendChild(td5);
                        
                        console.log(td5);
                        console.log(currentRow);
                        table.appendChild(currentRow);
                    }
                    console.log(table);
                    document.getElementById("continut").innerHTML = "";
                    let center_div = document.createElement('div');
                    center_div.className += 'center-div';
                    document.getElementById("continut").appendChild(center_div);
                    center_div.appendChild(table);
                });
            }
        }
    );
}