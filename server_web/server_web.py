import ctypes
import gzip
from io import BytesIO, StringIO
import multiprocessing
import socket
import os
from urllib import response
import select

root_dir = 'F:\AnuIII\PW\proiect-1-IulianMurariu-Tanasache\continut'
raspuns_http = ""

dict_resp_code = {
    200: 'OK',
    404: 'Not Found'
}

list_clienti = []

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

class Client:
    def __init__(self, conn, addr):
        self.conn = conn
        self.addr = addr

    def fileno(self):
        return self.conn.fileno() 
        

def asamblare_raspuns(response_code, mesaj, type, gzip_accepted):
    raspuns = "HTTP/1.1 " + str(response_code) + ' ' + dict_resp_code[response_code] + "\r\n"
    raspuns += 'Content-Length: ' + ('0' if mesaj is None else str(len(mesaj))) + "\n"
    raspuns += 'Content-type: ' + tipuriMedia[type] + "\n"
    if gzip_accepted:
        raspuns += "Content-Encoding: gzip\n"
    raspuns += 'Server: Cel mai bun server web facut azi' + "\n\r\n"
    return raspuns 


def get_content_of_file(path, gzip_compress):
    tip = path[path.rfind('.')+1:]
    print(tip)
    content = ""
    with open(path, 'rb') as file:
            content = file.read()
    if gzip_compress and tip in ['css', 'html', 'js']:
        out = BytesIO()
        f = gzip.GzipFile(fileobj=out, mode='w', compresslevel=5)
        f.write(content)
        f.close()
        content = out.getvalue()
    return content ,tip


def handle_client(client):
    global list_clienti
    clientsocket = client.conn
    cerere = ''
    linieDeStart = ''
    data = clientsocket.recv(1024)
    cerere = cerere + data.decode()
    pozitie = cerere.find('\r\n')
    if (pozitie > -1):
        linieDeStart = cerere[0:pozitie]
        print('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
    else:
        return
    print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
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
        if '.xml' in  file_name:
            dir_name += '\\resurse'
        for file in os.listdir(dir_name):
            if file == file_name:
                find_file = True
                file_abs_path = dir_name + "\\" + file
                break
        if not find_file:
            # 404 NotFound
            raspuns_http = asamblare_raspuns(404, None, 'text', gzip_accepted=False)
        else:
            gzip_use = 'gzip' in cerere
            content, tip = get_content_of_file(file_abs_path, gzip_compress=gzip_use)
            gzip_use = gzip_use and tip in ['css', 'html', 'js']
            raspuns_http = asamblare_raspuns(200, content, tip, gzip_accepted=gzip_use)
            print('raspuns: ' + raspuns_http)
    # TODO trimiterea răspunsului HTTP
        clientsocket.sendall(bytes(raspuns_http, encoding='utf-8'))
        if find_file:
            clientsocket.sendall(content)
    client.conn.close()

def listen(server_on, list_clienti, serversocket):
    while server_on:
        try:
            # Asteapta cereri de conectare, apel blocant
            conn, addr = serversocket.accept()
            # mai intai astept packetul de connect, apoi setez ca e connected
            # new_client.setConnected(True)
            new_client = Client(conn,addr)
            list_clienti.append(new_client)
            print(f'Client conectat cu adresa: {addr}')
        except KeyboardInterrupt:
            print('Closed')
            server_on = False
            break
        except Exception:
            print("Eroare la pornirea thread‐ului")
            server_on = False
            break
    

if __name__ == '__main__':
    # creeaza un server socket
    serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
    serversocket.bind(('', 5678))
    # serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
    serversocket.listen()
    print('#########################################################################')
    print('Se incearca pornirea thread-urilor')
    # handle_clients_thread = multiprocessing.Process(target=handle_clients)
    # handle_clients_thread.start()
    manager = multiprocessing.Manager()
    server_on = manager.Value(ctypes.c_bool, True)
    list_clienti = manager.list()
    listen_thread = multiprocessing.Process(target=listen, args=(server_on,list_clienti,serversocket))
    listen_thread.start()
    print('Serverul asculta potentiali clienti.')
    while server_on:
        if len(list_clienti) == 0:
            continue
        try:
            to_read, _, _ = select.select(list_clienti, [], [], 1)
        except KeyboardInterrupt:
            print('Closed')
            server_on = False
            break
        except Exception:
            continue
        for client in to_read:
            try:
                handle_client(client)
                break
            except Exception as e:
                try:
                    print(e)
                    client.conn.close()
                    list_clienti.remove(client)
                finally:
                    break
    listen_thread.join(30)
    listen_thread.terminate()