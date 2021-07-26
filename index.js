const express = require('express')
const cors = require('cors')
const axios = require('axios').default
const cheerio = require('cheerio')

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors())

app.get('/:query', async function(req, res){
    counter = 0;
    numOfPages = 5
    myData = []
    baseUrl = "https://jisho.org/search/"
    await getData(req.params.query, Math.ceil(Math.random()*15))
    res.header('Content-Type', 'application/json')
    res.send(myData)
})

app.post('/words', async function(req, res){
    counter = 0;
    numOfPages = 3
    myData = []
    baseUrl = "https://jisho.org/search/"
    let reqHiragana = ""
    abc = ""
    body = req.body.hiragana.split('/')
    
    body.forEach(element => {
        reqHiragana += (element.split(':')[0])
        abc += ((element.split(':')[1]) == undefined ? '' : (element.split(':')[1]))
    });

    abc = abc.substr(0,abc.length-1)
    await getDataFiltered(reqHiragana, abc)
    res.header('Content-Type', 'application/json')
    res.send(myData)
})

//JISHO
/*
async function getDataFilteredJisho(filter, abcArr){
    abcArr = abcArr.toString().split(',')
    query = abcArr[Math.floor(Math.random() * abcArr.length)]
    url = baseUrl+query+"%20%23words?page="+(newUrl+1)
    
    await axios({
        method: 'GET',
        url:url,
        responseType: 'text'
    })
    .then(async (response)=>{
        html = response.data
        $ = cheerio.load(html)
        $('div .concepts > .concept_light').each(function(x, elem){
            var finalFurigana = ""
            wordOk = true

            $('.furigana > span', elem).each((i, kanji)=>{
                finalFurigana += ($(kanji).text() == "" ? "" : $(kanji).text() + " ")
            })

            wordOk = myData.indexOf(finalFurigana) == -1 ? true : false
            
            if(wordOk){
                x = finalFurigana.length
                while(x--){
                    wordOk = finalFurigana[x] == " " ? true : filter.includes(finalFurigana[x])
                    if(!wordOk) break
                }
                console.log(filter)
                translation = $('.meaning-meaning',elem).first().text()
                translation = translation.replace(/\s+/g, ' ').trim()
                if(translation && finalFurigana.length > 2 && wordOk) myData.push({hiragana: finalFurigana, meaning: translation})
            }
        })
        newUrl = "https:"+($('.more').attr('href'))
        console.log(myData.length)
        if(myData.length >= 20){
            return
        } 
        await getDataFiltered(filter, abcArr, Math.ceil(Math.random()*15))	
    })
    return
}
*/

async function getDataFiltered(filter, abcArr, newUrl = 0){
    abcArr = abcArr.toString().split(',')
    query = abcArr[Math.floor(Math.random() * abcArr.length)]
    //url = baseUrl+query+"%20%23words?page="+(newUrl+1)
    url = "http://www.edrdg.org/jmdictdb/cgi-bin/srchres.py?s1=1&y1=2&t1="+query+"&src=2&search=Search&svc=jmdict&p1="+Math.floor(Math.random() * 10)
    await axios({
        method: 'GET',
        url:url,
        responseType: 'text'
    })
    .then(async (response)=>{
        html = response.data
        $ = cheerio.load(html)
        console.log(url)
        var hiragana = ""
        //$('div .concepts > .concept_light').each(function(x, elem){
        $('.resrow').each(function(x, elem){
            
            console.log()
            wordOk = true
            
            hiragana = $('.rdng', elem).text()
            //wordOk = myData.indexOf(hiragana) == -1 ? true : false
            wordOk = myData.map((e)=>{return e.hiragana}).indexOf(hiragana) == -1 ? true : false
            
            if(wordOk){
                x = hiragana.length
                while(x--){
                    wordOk = hiragana[x] == " " ? true : filter.includes(hiragana[x])
                    if(!wordOk) break
                }
                romaji = $('.gloss',elem).text()
            }
            if(wordOk) myData.push({hiragana: hiragana, meaning: romaji})
        })
    })
    
    
    console.log(myData.length)
    if(myData.length >= 20){
        return
    } 
    await getDataFiltered(filter, abcArr)
    
    return
}


async function getData(query, newUrl = 0){
    await axios({
        method: 'GET',
        url: (newUrl!=0 ? baseUrl+query+"%20%23words" + "?page="+newUrl : baseUrl+query+"%20%23words"),
        responseType: 'text'
    })
    .then((response)=>{
        counter = counter + 1
        html = response.data
        $ = cheerio.load(html)
        //concepts = cheerio.load(soup.html('div .concepts'))
        $('div .concepts .concept_light').each(function(x, elem){
            furigana = $('.furigana',elem).first().text()

            furigana = furigana.replace(/\s+/g, ' ').trim()
            translation = $('.meaning-meaning',elem).first().text()
            translation = translation.replace(/\s+/g, ' ').trim()
            if(translation && furigana && furigana.length > 1) myData.push({hiragana: furigana, meaning: translation})
        })
        newUrl = "https:"+($('.more').attr('href'))

        if(counter > numOfPages) return myData 

        getData(query, Math.round(Math.random()*15))	
    })

    
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});