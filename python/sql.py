import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="agm",
  password="ti@2019#..",
  database="db_teste_jp"
)

mycursor = mydb.cursor()

mycursor.execute("SELECT * FROM hiragana order by rand()")

myresult = mycursor.fetchall()

for x in myresult:
    ok=False
    for carat in list(x[1]):
        if(("""さけ""").find (carat) >-1):
            ok = True
        else:
            ok = False
            break
    if(ok):print(x[1] + " = " + x[2])
        
