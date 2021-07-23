from bs4 import BeautifulSoup

import requests
import sys
import mysql.connector
import json

# texto = open('teste.txt', 'a', encoding='utf16')
global counter
counter = 0
numOfPages = 1
myData = []

# def insertIntoDB():
#     mydb = mysql.connector.connect(
#     host="localhost",
#     user="agm",
#     password="ti@2019#..",
#     database="db_teste_jp"
#     )

#     mycursor = mydb.cursor()

#     texto = open('teste.txt', 'r', encoding="utf16")
    
#     myData = []
#     for row in texto:
#         myData = row.split('|')
#         #print(myData[1])
#         mycursor.execute("INSERT INTO hiragana(hiragana, meaning) VALUES (%s, %s)", (myData[0],myData[1]))
#         mydb.commit()

def newLink(url, counter):
    counter = counter + 1
    texto = open('teste.txt', 'a', encoding='utf16')
    html = requests.get(url).content
    soup = BeautifulSoup(html, 'html.parser')
    concepts = soup.find('div', class_='concepts')
    palavras = concepts.find_all('div', class_='concept_light clearfix')

    

    for e in palavras:
        word = e.find('span', class_='furigana')
        translation = e.find('span', class_='meaning-meaning')
        if word:
            word = word.text.replace("\n",'')
            translation = translation.text.replace("\n",'')
            myData.append({"hiragana": word, "meaning": translation})
            ######print(word + ":" + translation)
            #texto.write(word + "|" + translation +"\n")
    newUrl = soup.find('a', class_='more')
    #texto.close()

    if(counter > numOfPages):
        return

    if(newUrl['href']):
        
        newLink("https:" + newUrl['href'], counter)	


newLink("https://jisho.org/search/"+sys.argv[1]+"%20%23words", counter = 0)
print(json.dumps(myData))
# newLink("https://jisho.org/search/ki%20%23words", counter = 0)
# newLink("https://jisho.org/search/chi%20%23words", counter = 0)
# newLink("https://jisho.org/search/se%20%23words", counter = 0)
# newLink("https://jisho.org/search/ta%20%23words", counter = 0)


# insertIntoDB()