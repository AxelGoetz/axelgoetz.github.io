from flask import Flask, request, jsonify, render_template 
import requests
from box import Box

import dialogflow_v2 as dialogflow

app = Flask(__name__)

SITE = Box({
    "title": "Axel Goetz",
    "author": "Axel Goetz",
    "email": "contact@agoetz.me",
    "description": "Axel Goetz' personal website.",
    "timezone": "Europe/London",
    "github_username": "AxelGoetz",
    "facebook_url": "https://www.facebook.com/axel.goetz.9",
    "linkedin_url": "https://www.linkedin.com/in/axel-goetz-09427598",
})

DIALOGFLOW_CLIENT = dialogflow.SessionsClient()
DIALOGFLOW_PROJECT = "pa2-nxsvms"

WEATHERKEY = "8bed9b281d7a2785c3648768052e8f4f"

@app.route("/")
def index():
    return render_template("chat.html", site=SITE, title="Index")

@app.route("/detect-intent", methods=["GET"])
def detect_intent():
    text = request.args.get("text", "")
    session_id = request.args.get("session_id", "123")

    session = DIALOGFLOW_CLIENT.session_path(DIALOGFLOW_PROJECT, session_id)
    text_input = dialogflow.types.TextInput(text=text, language_code="en-GB")
    query_input = dialogflow.types.QueryInput(text=text_input)

    response = DIALOGFLOW_CLIENT.detect_intent(session=session, query_input=query_input)

    return jsonify({"response": response.query_result.fulfillment_text})

@app.route("/weather", methods=["GET"])
def weather():
    query = request.args.get("query", "London")

    url = f"http://api.weatherstack.com/current?access_key={WEATHERKEY}&query={query}"

    return requests.get(url).json()

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html", site=SITE, title="404 Page Not Found"), 404


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)