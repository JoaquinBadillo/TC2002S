import logging
import azure.functions as func
import os
import requests
from unidecode import unidecode
import json

secret_key = os.environ.get("API_KEY", "")
URL = "https://api-inference.huggingface.co/models/snrspeaks/KeyPhraseTransformer"

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Tokenizer HTTP trigger function processed a request.')
    
    if (secret_key == ""):
        logging.error('API_KEY is not set.')
        return func.HttpResponse(status_code=500)
    
    req_body = req.get_json()
    inputs = None
    try:
        inputs = req_body['inputs']
    except:
        logging.info('Bad Request: No inputs argument in request body.')

        return func.HttpResponse(
            "Inputs argument is required in the request body.",
            status_code=400
        )
    
    res = requests.post(
        url = URL,
        headers = {"Authorization": f"Bearer {secret_key}"},
        json = {
            "inputs": inputs,
            "options": {
                "use_cache": False,
                "wait_for_model": True
            }
        }
    )
    
    try:
        logging.info(res.json())
        tokens = res.json()[0]["generated_text"].split(" | ")
        return func.HttpResponse(
            json.dumps({"tokens": tokens}),
            mimetype="application/json",
            status_code=200)
    except:
        logging.error('Could not parse tokens')
        response = {"message": "Failed to parse tokens"}
        return func.HttpResponse(
            json.dumps(response), 
            mimetype="application/json",
            status_code=500
        )