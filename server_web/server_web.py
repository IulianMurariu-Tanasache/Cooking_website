import socket
import os
from urllib import response

# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
serversocket.bind(('', 5678))
# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
serversocket.listen(5)

root_dir = 'F:\AnuIII\PW\proiect-1-IulianMurariu-Tanasache\continut'
raspuns_http = ""

dict_resp_code = {
    200: 'OK',
    404: 'Not Found'
}

tipuriMedia = {
			'html': 'text/html; charset=utf-8',
			'css': 'text/css; charset=utf-',
			'js': 'text/javascript; charset=utf-8',
			'png': 'image/png',
			'jpg': 'image/jpeg',
			'jpeg': 'image/jpeg',
			'gif': 'image/gif',
			'ico': 'image/x-icon',
			'xml': 'application/xml; charset=utf-8',
			'json': 'application/json; charset=utf-8',
            'text': 'text/text'
		}

def asamblare_raspuns(response_code, mesaj, type):
    raspuns = "HTTP/1.1 " + str(response_code) + ' ' + dict_resp_code[response_code] + "\r\n"
    raspuns += 'Content-Length: ' + ('0' if mesaj is None else str(len(mesaj))) + "\n"
    raspuns += 'Content-type: ' + tipuriMedia[type] + "\n"
    raspuns += 'Server: Cel mai bun server web facut azi' + "\n\r\n"
    return raspuns 


def get_content_of_file(path):
    tip = path[path.rfind('.')+1:]
    print(tip)
    content = ""
    with open(path, 'rb') as file:
        content = file.read()
    return content ,tip

while True:
    print('#########################################################################')
    print('Serverul asculta potentiali clienti.')
    # asteapta conectarea unui client la server
    # metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
    (clientsocket, address) = serversocket.accept()
    print('S-a conectat un client.')
    # se proceseaza cererea si se citeste prima linie de text
    cerere = ''
    linieDeStart = ''
    while True:
        data = clientsocket.recv(1024)
        cerere = cerere + data.decode()
        print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
        pozitie = cerere.find('\r\n')
        if (pozitie > -1):
            linieDeStart = cerere[0:pozitie]
            print('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
            break
    print('S-a terminat cititrea.')
    # TODO interpretarea sirului de caractere `linieDeStart` pentru a extrage numele resursei cerute
    find_file = False
    print('GET' in linieDeStart)
    if 'GET' in linieDeStart:
        file_name = linieDeStart.split()[1]
        file_name = file_name[file_name.rfind('/') + 1:]
        print(file_name)
        file_abs_path = ""
        dir_name = root_dir
        if '.css' in file_name:
            dir_name += '\css'
        if '.js' in file_name:
            dir_name += '\js'
        for file in os.listdir(dir_name):
            if file == file_name:
                find_file = True
                file_abs_path = dir_name + "\\" + file
                break
        if not find_file:
            raspuns_http = asamblare_raspuns(404, None, 'text')
            # 404 NotFound
        else:
            content, tip = get_content_of_file(file_abs_path)
            raspuns_http = asamblare_raspuns(200, content, tip)
            print('raspuns: ' + raspuns_http)
    # TODO trimiterea răspunsului HTTP
        clientsocket.sendall(bytes(raspuns_http, encoding='utf-8'))
        clientsocket.sendall(content)
    clientsocket.close()
    print('S-a terminat comunicarea cu clientul.')