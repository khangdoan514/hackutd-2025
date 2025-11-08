from flask import Flask, jsonify, request # type: ignore
from flask_cors import CORS # type: ignore

# Flask
app = Flask(__name__)

# Flask with CORS for React
cors = CORS(app, origins="*")

# Front end
@app.route("/api/message", methods=["GET"])
def message():
    return jsonify(
        {
            "message": [
                "Hello",
                "World",
                "from",
                "the",
                "main.py"
            ]
        }
    )

if __name__ == "__main__":
    app.run(debug=False, port=3000)