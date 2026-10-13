from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# initializes the flask app and wraps the app in CORS to communicate with front end
app = Flask(__name__)
CORS(app)

#this specifies the location of the local sql database on our machine
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
#the following code means every modification we do to the database is not tracked
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#creating a database instance
db = SQLAlchemy(app)
