# AI-potter-personality
which house are you? find out with this cool AI-powered personality quiz!!

Credits to Charles Niu for the idea!

## Installation

### Requirements
- NPM
- React
- Python 3.12

### Backend Setup
1. Make `backend` your current directory
2. Run `python server.py` or `python3 server.py`

### Frontend Setup
1. Make `frontend` your current directory
2. Run `npm install`
3. Run `npm start`

## Running the program
1. Do Backend Setup steps to run the server
2. Do Frontend Setup steps to run the client, but skip `npm install`

## Speeding things up and customizing the LLM
If you would like to avoid re-downloading entire models and save time running the server,
1. Go to `backend/llm_calls.py`
2. Set `USE_OFFLINE = True`
3. Change `MODEL_NAME` to the name of the model you'd like; this will determine the directory of the model
4. Manually download the model in a root level folder for `models`

To customize the LLM,
1. Edit `backend/llm_calls.py` to fit your model to your liking
