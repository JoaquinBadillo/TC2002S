import logging
import azure.functions as func
import os
import requests
from unidecode import unidecode
import json
from PIL import Image
from io import BytesIO

secret_key = os.environ.get("API_KEY", "")
URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Image HTTP trigger function processed a request.')
    req_body = req.get_json()
    inputs = None

    if (secret_key == ""):
        logging.error('API_KEY is not set.')
        return func.HttpResponse(status_code=500)
    
    try:
        inputs = req_body['inputs']

        if type(inputs) != list or len(inputs) < 1 or type(inputs[0]) != str:
            return func.HttpResponse(
            "Bad input: a list of strings is required as input.",
            status_code=400
        )
            
    except:
        logging.info('Bad Request: No inputs argument in request body.')

        return func.HttpResponse(
            "Inputs argument is required in the request body.",
            status_code=400
        )
    
    inputs.append("realistic, digital art")
    res = requests.post(
        url = URL,
        headers = {"Authorization": f"Bearer {secret_key}"},
        json = {
            "options": {
                "use_cache": False,
                "wait_for_model": True
            },
            "inputs": ", ".join(inputs)
        }
    )
    
    try:
        # Send image back to client
        logging.info("Reading image from response")
        binary = res.content
        img = Image.open(BytesIO(binary))
        img = img.convert("RGB")

        imgByteArr = BytesIO()
        img.save(imgByteArr, format='JPEG')
        imgByteArr = imgByteArr.getvalue()

        return func.HttpResponse(
            imgByteArr,
            mimetype="image/jpeg",
            status_code=200
        )        
    except:
        logging.error('Failed to create image')
        response = {"message": "Failed to create image"}
        return func.HttpResponse(
            json.dumps(response), 
            mimetype="application/json",
            status_code=500
        )