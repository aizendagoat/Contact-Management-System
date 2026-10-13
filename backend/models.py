#importing the instance that gives us access to sqlalchemy
from config import db

#this is a database model represented as a python class
class Contact(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    #we cannot have the first name as null
    first_name = db.Column(db.String(80),unique= False, nullable = False)
    last_name = db.Column(db.String(80),unique= False, nullable = False)
    #we set the email to unique so no 2 contacts can have the same email
    email = db.Column(db.String(120),unique= True, nullable = False)

    def to_json(self):
        return{
            "id":self.id,
            "firstName":self.first_name,
            "lastName":self.last_name,
            "email":self.email,
        }