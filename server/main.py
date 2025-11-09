from flask import Flask, jsonify, request # type: ignore
from flask_cors import CORS # type: ignore

# Flask
app = Flask(__name__)

# Flask with CORS for React
cors = CORS(app, origins="*")

# Front end
@app.route("/api/signin", methods=["POST"])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    print(f"Login attempt - Email: {email}, Password: {password}")
    
    # Validation
    if email and password:
        return jsonify({"success": True, "message": "Login successful"})
    
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route("/api/create_account", methods=["POST"])
def create_account():
    pass

@app.route("/api/forgot_password", methods=["POST"])
def forgot_password():
    pass

if __name__ == "__main__":
    app.run(debug=False, port=3000)