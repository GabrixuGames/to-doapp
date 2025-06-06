from flask import Flask
from flask_cors import CORS
from routes import auth, tasks
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)



# Registrar rutas
app.register_blueprint(auth.bp_auth)
app.register_blueprint(tasks.bp)

if __name__ == "__main__":
    app.run(debug=True)
