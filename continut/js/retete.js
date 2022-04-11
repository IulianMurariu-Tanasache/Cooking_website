function incarcaRetete(){
    fetch('retete.xml', {method: 'GET'}).then(
        function(response) {
            if (response.status == 200) {
                response.text().then(function(data) {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(data,"application/xml");
                    
                    let table = document.createElement('table');
                    let headingRow = document.createElement('tr');
                    headingRow.append(document.createElement('th').innerHTML = "Nume");
                    headingRow.append(document.createElement('th').innerHTML = "Imagine");
                    headingRow.append(document.createElement('th').innerHTML = "Timp");
                    headingRow.append(document.createElement('th').innerHTML = "Portie");
                    headingRow.append(document.createElement('th').innerHTML = "Ingrediente");
                    headingRow.append(document.createElement('th').innerHTML = "Preparare");
                    table.append(headingRow)
                    console.log(table)

                    for(let reteta of xmlDoc.getElementsByTagName('reteta')){
                        let currentRow = document.createElement('tr')
                        console.log(reteta.getElementsByTagName('nume')[0])
                        currentRow.appendChild(document.createElement('td').innerHTML = reteta.getElementsByTagName('nume')[0]);
                        currentRow.appendChild(document.createElement('td').innerHTML = reteta.getElementsByTagName('poza')[0]);
                        currentRow.appendChild(document.createElement('td').innerHTML = reteta.getElementsByTagName('timp')[0]);
                        currentRow.appendChild(document.createElement('td').innerHTML = reteta.getElementsByTagName('portie')[0]);
                        currentRow.appendChild(document.createElement('td').innerHTML = reteta.getElementsByTagName('ingrediente')[0]);
                        currentRow.appendChild(document.createElement('td').innerHTML = reteta.getElementsByTagName('preparare')[0]);
                    }

                    document.getElementById("continut").appendChild(table);
                });
            }
        }
    );
}