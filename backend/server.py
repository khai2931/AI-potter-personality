import socket
import time
# from questions_answers import get_question_and_answers, get_answer
from open_ai_calls import get_openai_response
import json

# "predeploy": "concurrently \"npm run build\" \"python ../backend/server.py\"",

# Define the initial generating question and context
# GEN_QUESTION = None
# GEN_CONTEXT = "You are making a quiz to sort people into Harry Potter houses."

# Define the host and port
SERVER_HOST = '0.0.0.0'
SERVER_PORT = 8080

# prompt ideas
# spicy love triangle 
# let user decide what kind of Q's

# the string used to generate questions
# Q_GENERATOR = "Create some spicy multiple-choice questions about love triangles to help the Sorting Hat sort someone in one of the four houses in Harry Potter. Format the questions in JSON with the keys \"question\", \"answer1\", \"answer2\", \"answer3\", and \"answer4\""
Q_GENERATOR = "Create some dark, twisted, psychological multiple-choice questions to help the Sorting Hat sort someone in one of the four houses in Harry Potter. Format the questions in JSON with the keys \"question\", \"answer1\", \"answer2\", \"answer3\", and \"answer4\""

# let questions be an array of arrays, such that each array is
# [question, answer1, answer2, answer3, answer4]
all_questions = []

# string formatting for helper below assumes questions look like this:
"""
```json
[
    {
        "question": "You stumble upon a hidden room filled with your greatest fears manifesting before you. How do you react?",
        "answer1": "Confront each fear head-on, seeking to dominate them.",
        "answer2": "Run away and lock the door, refusing to face what terrifies you.",
        "answer3": "Manipulate the fears into an illusion to control the situation.",
        "answer4": "Observe quietly, studying the fears of others before deciding your move."
    },
    {
        "question": "You have the power to change one person's destiny in a brutal way. Who do you choose and why?",
        "answer1": "A rival, to ensure your own ascension to power.",
        "answer2": "An innocent, just to see how far you can twist their life.",
        "answer3": "A loved one, to teach them a lesson about loyalty.",
        "answer4": "A stranger, for the sake of curiosity and experiment."
    },
    {
        "question": "In a game where only one survives, what strategy do you employ?",
        "answer1": "Betray your closest ally to take their position.",
        "answer2": "Sacrifice yourself if it means ensuring the survival of someone you secretly despise.",
        "answer3": "Play mind games, leading others into a trap of their own making.",
        "answer4": "Wait and observe, striking only when the moment is perfect."
    },
    {
        "question": "You find a magical artifact that grants immense power, but it comes at a horrific price. What do you do?",
        "answer1": "Take the power, believing you can handle the consequences.",
        "answer2": "Destroy the artifact to prevent anyone from misusing it, even at the cost of your own ambition.",
        "answer3": "Use it for your own gain while ensuring a scapegoat carries the blame.",
        "answer4": "Sabotage others who seek it, ensuring that you remain the only contender."
    },
    {
        "question": "An unexpected betrayal leaves you alone and vulnerable. What does your heart urge you to do?",
        "answer1": "Seek revenge with a cold, calculating plan.",
        "answer2": "Give in to despair, isolating yourself from the world.",
        "answer3": "Use the moment to grow stronger, turning your pain into a weapon.",
        "answer4": "Rebuild trust with others, even if it involves deception."
    }
]
```

"""

# helper to get next harry potter question
def get_next_q() -> str:
    # each iteration of get_openai sends ~5 questions,
    # so we only need to call when we run out of Q's
    if not all_questions:
        raw_text = get_openai_response(Q_GENERATOR)
        parts = raw_text.split("```")
        json_text = (parts[1])[4:]
        # print("DEBUG: json_text")
        # print(json_text)
        json_arr = json.loads(json_text)
        # print("DEBUG: json_arr")
        # print(str(json_arr))
        for q_answers in json_arr:
            all_questions.append([
                q_answers["question"],
                q_answers["answer1"],
                q_answers["answer2"],
                q_answers["answer3"],
                q_answers["answer4"]
            ])
    q_arr = all_questions.pop(0)
    ret = ""
    for elem in q_arr:
        ret += elem + "\n"
    print("DEBUG: returned question")
    print(ret)
    return ret

# # helper for string formatting or question-making
# def get_nice_qs_as(prev_question: str, context: str = None) -> str:
#     question, answers = get_question_and_answers(prev_question, context)
#     content = question + "\n"
#     for answer in answers:
#         content += answer + "\n"
#     return content
def get_house(context: str) -> str:
    return get_openai_response("Which of the 4 Harry Potter houses do I belong in: Gryffindor, Hufflepuff, Ravenclaw, or Slytherin? For context, I said that I \"" + context + "\"")

# helper to get sorting house dialogue
def get_sorting_hat(context: str) -> str:
    # the string used to make sorting hat dialogue
    DIA_GENERATOR = "Imagine you are the Sorting Hat in Harry Potter. Write a brief, one-sentence response of max 30 words to someone who said: "
    return get_openai_response(DIA_GENERATOR + "\"" + context + "\"")

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

    if request.strip() == "":
        client_socket.close()
        continue

    # This request is composed of a request line, headers, and
    # an optional message body.

    # Returns HTTP response
    # print("DEBUG: request")
    # print(request)
    headers = request.split('\n')
    first_header_components = headers[0].split()

    http_method = first_header_components[0]
    path = first_header_components[1]

    # default case
    response = 'HTTP/1.1 405 Method Not Allowed\n\nAllow: GET'
    content = "INVALID PATH"

    if http_method == 'POST':
        body_json = request.split("\r\n\r\n")[1]
        # content = "DEBUG: THE DATA WAS RECEIVED:\n" + body_json
        json_obj = json.loads(body_json)
        if path == '/get-openai':
            print("OPENAI QUERY: " + json_obj["query"])
            content = get_openai_response(json_obj["query"])
        elif path == '/get-house':
            print("HOUSE CONTEXT: " + json_obj["context"])
            print("JSON CONTEXT: " + str(json_obj))
            content = get_house(json_obj["context"])
        elif path == '/qs-as':
            content = get_next_q()
        elif path == '/get-sorting-hat':
            print("HAT CONTEXT: " + json_obj["context"])
            content = get_sorting_hat(json_obj["context"])

    # if http_method == 'GET':
    #     if path == '/qs-as':
    #         content = get_nice_qs_as(GEN_QUESTION, GEN_CONTEXT)
    # elif http_method == 'POST':
        # body_json = request.split("\r\n\r\n")[1]
        # # content = "DEBUG: THE DATA WAS RECEIVED:\n" + body_json
        # json_obj = json.loads(body_json)
    #     if path == '/qs-as':
    #         # print("question: " + json_obj["question"])
    #         # print("context: " + json_obj["context"])
    #         content = get_nice_qs_as(json_obj["question"], json_obj["context"])
    #     elif path == '/get-house':
    #         print("HOUSE CONTEXT: " + json_obj["context"])
    #         print("JSON CONTEXT: " + str(json_obj))
    #         content = get_house(json_obj["context"])
    #     elif path =='/get-openai':
    #         print("OPENAI QUERY: " + json_obj["query"])
    #         content = get_openai_response(json_obj["query"])


    response =  'HTTP/1.1 200 OK\r\n'
    response += 'Access-Control-Allow-Origin: http://localhost:3000\r\n'
    response += 'Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept\r\n'

    response += '\r\n' + content

    # DEBUG
    # print("DEBUG: response")
    # print(response)

    client_socket.sendall(response.encode()) # encode converts string to bytes

    # Close connection - show what happens if the client socket
    # is not closed.
    client_socket.close()

# Close socket
server_socket.close()