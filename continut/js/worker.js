onmessage = function(e) {
    console.log('Primit un produs nou!');
    postMessage(e.data);
}