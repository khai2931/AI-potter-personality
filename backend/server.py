import socket
# import time
from questions_answers import get_question_and_answers

# Define the host and port
SERVER_HOST = '0.0.0.0'
SERVER_PORT = 8080

# ---------- CREATE SOCKET ----------

# socket.socket() -> initializes a new socket.

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# server_socket.setblocking(False)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

server_socket.bind((SERVER_HOST, SERVER_PORT))

server_socket.listen(5)

print(f'Listening on port {SERVER_PORT} ...') # if all goes well, we will print that we have started listening on a specific port

while True: # so that we continuously keep listening to new client connections
    
    # try:
    print('ran') # <----- add print statement to explain the blocking
    client_socket, client_address = server_socket.accept()
    print('ran2')  # <----- add print statement to explain the blocking
    # except BlockingIOError:
    #     time.sleep(1)
    #     continue
    request = client_socket.recv(1500).decode() # decode converts binary to string
    print(request)

    # This request is composed of a request line, headers, and 
    # an optional message body.

    # Returns HTTP response
    headers = request.split('\n')
    first_header_components = headers[0].split()

    http_method = first_header_components[0]
    path = first_header_components[1]

    if http_method == 'GET':
        # if path == '/':
        #     fin = open('index.html')
        # elif path == '/book':
        #     fin = open('book.json')
        # elif path == '/favicon.ico':
        #     fin = open('index.html')
        # else:
        #     # handle the edge case
        #     pass
        
        # content = fin.read()
        # fin.close()
        if path == '/qs-as':
            question, answers = get_question_and_answers("What do you like to do in your free time?")
            content = question + "\n"
            for answer in answers:
                content += answer + "\n"
        else:
            content = "INVALID PATH"

        response = 'HTTP/1.1 200 OK\n\n' + content
    else:
        response = 'HTTP/1.1 405 Method Not Allowed\n\nAllow: GET'

    client_socket.sendall(response.encode()) # encode converts string to bytes

    # Close connection - show what happens if the client socket
    # is not closed.
    client_socket.close()

# Close socket
server_socket.close()