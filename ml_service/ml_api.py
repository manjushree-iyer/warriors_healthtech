from flask import Flask, request, jsonify
from transformers import pipeline
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)

classifier = pipeline("text-classification")
summarizer = pipeline("summarization")

@app.route("/classify", methods=["POST"])
def classify():
    text = request.json["text"]
    result = classifier(text)
    return jsonify(result)

@app.route("/summarize", methods=["POST"])
def summarize():
    text = request.json["text"]
    summary = summarizer(text, max_length=40)
    return jsonify(summary)

@app.route("/predict", methods=["POST"])
def predict():
    age = request.json["age"]
    cholesterol = request.json["cholesterol"]
    bp = request.json["bp"]

    prediction = model.predict([[age, cholesterol, bp]])
    return jsonify({"risk": int(prediction[0])})

app.run(port=5001)