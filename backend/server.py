import socket
# import time
from questions_answers import get_question_and_answers
import json

# Define the host and port
SERVER_HOST = '0.0.0.0'
SERVER_PORT = 8080

# helper for string formatting
def get_nice_qs_as(prev_question: str, context: str = None) -> str:
    question, answers = get_question_and_answers(prev_question, context)
    content = question + "\n"
    for answer in answers:
        content += answer + "\n"
    return content

# ---------- CREATE SOCKET ----------

# socket.socket() -> initializes a new socket.

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# server_socket.setblocking(False)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

server_socket.bind((SERVER_HOST, SERVER_PORT))

server_socket.listen(5)

print(f'Listening on port {SERVER_PORT} ...') # if all goes well, we will print that we have started listening on a specific port

while True: # so that we continuously keep listening to new client connections
    
    client_socket, client_address = server_socket.accept()
    request = client_socket.recv(1500).decode() # decode converts binary to string
    # print(request)

    # This request is composed of a request line, headers, and 
    # an optional message body.

    # Returns HTTP response
    headers = request.split('\n')
    first_header_components = headers[0].split()

    http_method = first_header_components[0]
    path = first_header_components[1]

    # default case
    response = 'HTTP/1.1 405 Method Not Allowed\n\nAllow: GET'

    if http_method == 'GET':
        if path == '/qs-as':
            content = get_nice_qs_as("What do you like to do in your free time?")
        else:
            content = "INVALID PATH"

        response = 'HTTP/1.1 200 OK\n\n' + content
    elif http_method == 'POST':
        if path == '/qs-as':
            body_json = request.split("\r\n\r\n")[1]
            # content = "DEBUG: THE DATA WAS RECEIVED:\n" + body_json

            json_obj = json.loads(body_json)

            # print("question: " + json_obj["question"])
            # print("context: " + json_obj["context"])
            content = get_nice_qs_as(json_obj["question"], json_obj["context"])
        else:
            content = "INVALID PATH"


        response = 'HTTP/1.1 200 OK\n\n' + content

    client_socket.sendall(response.encode()) # encode converts string to bytes

    # Close connection - show what happens if the client socket
    # is not closed.
    client_socket.close()

# Close socket
server_socket.close()