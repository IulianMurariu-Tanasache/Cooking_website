function verif_cont(){
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = 
            function() {
                if(this.readyState == 4 && this.status == 200)
                {
                    var valid = false;
                    var obj = JSON.parse(this.responseText);
                    console.log(obj);
                    var username = document.getElementById("username-verif").value;
                    var pass = document.getElementById("parola-verif").value;
                    for(let user of obj) {
                        if(user.user == username && user.parola == pass)
                        {
                            valid = true;
                        }
                    }
                    console.log(valid);
                    document.getElementById("logat").innerHTML = valid ? "Te-ai logat cu succes" : "Ai scris prost credentialele";

                    document.getElementById("username-verif").value = "";
                    document.getElementById("parola-verif").value = "";
                }
            }
    }
    xhttp.open("GET",'utilizatori.json');
    xhttp.send();
}