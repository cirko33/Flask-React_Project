from Configuration.config import *
from Routes.__init__ import *
from Models.User import *

if __name__ == '__main__':
    app.run(port=5000)

@app.route('/register')
def addPerson():
    db.create_all()
    #Dummy data.
    user = User(firstName="Zdravko", lastName="Milinkovic", address="Bihacka 33",city="Subotica",phoneNumber="024323232",email="zdravko@gmail.com",password="zdravko123")
    db.session.add(user)
    db.session.commit()
    return 200;

@app.route('/login')
def loginPerson():
    conn = mysql.connect()
    cursor = conn.cursor()
    #form will exist later
    cursor.execute("select * from user where email={form.email} and password={form.password}")
    user = cursor.fetchone()
    if(user == None):
        return 404;
    else:
        session["user"] = user;
        return 200;