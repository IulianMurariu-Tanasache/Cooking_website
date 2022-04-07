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

                    for(let reteta of xmlDoc.getElementsByTagName('reteta')){
                        let currentRow = document.createElement('tr')
                        currentRow.append(document.createElement('td').innerHTML = reteta.getElementByTagName('nume'))
                        currentRow.append(document.createElement('td').innerHTML = reteta.getElementByTagName('poza'))
                        currentRow.append(document.createElement('td').innerHTML = reteta.getElementByTagName('timp'))
                        currentRow.append(document.createElement('td').innerHTML = reteta.getElementByTagName('portie'))
                        currentRow.append(document.createElement('td').innerHTML = reteta.getElementByTagName('ingrediente'))
                        currentRow.append(document.createElement('td').innerHTML = reteta.getElementByTagName('preparare'))
                    }

                    document.getElementById("continut").innerHTML = table;
                });
            }
        }
    );
}