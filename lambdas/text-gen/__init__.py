import logging
import azure.functions as func
import os
import requests
import json
from unidecode import unidecode

secret_key = os.environ.get("API_KEY", "")
URL = "https://api-inference.huggingface.co/models/Alred/t5-small-finetuned-summarization-cnn"

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Generation HTTP trigger function processed a request.')
    req_body = req.get_json()

    if (secret_key == ""):
        logging.error('API_KEY is not set.')
        return func.HttpResponse(status_code=500)
    
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
        output_text = unidecode(res.json()[0]['summary_text'])
        response = {"summary": output_text}
        return func.HttpResponse(
            json.dumps(response), 
            mimetype="application/json",
            status_code=200
        )
    except:
        logging.error('Could not get summary_text from response body.')
        response = {"message": "Could not get summary_text from response body."}
        return func.HttpResponse(
            json.dumps(response), 
            mimetype="application/json",
            status_code=500
        )