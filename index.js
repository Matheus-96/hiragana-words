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
    hiragana = ""
    abc = ""
    body = req.body.hiragana.split('/')
    
    body.forEach(element => {
        hiragana += (element.split(':')[0])
        abc += ((element.split(':')[1]) == undefined ? "" : (element.split(':')[1]))
    });

    abc = abc.substr(0,abc.length-1)
    await getDataFiltered(hiragana, abc + '', Math.ceil(Math.random()*15))
    res.header('Content-Type', 'application/json')
    res.send(myData)
})


async function getDataFiltered(filter, abcArr, newUrl = 0){
    //abcArr+=''
    
    abcArr = abcArr.toString().split(',')
    query = abcArr[Math.floor(Math.random() * abcArr.length)]
    
    url = baseUrl+query+"%20%23words" + "?page="+newUrl
    console.log(url)
    await axios({
        method: 'GET',
        url:url,
        //url: (newUrl!=0 ? baseUrl+query+"%20%23words" + "?page="+newUrl : baseUrl+query+"%20%23words"),
        responseType: 'text'
    })
    .then(async (response)=>{
        //counter = counter + 1
        html = response.data
        $ = cheerio.load(html)
        //concepts = cheerio.load(soup.html('div .concepts'))
        $('div .concept_light').each(function(x, elem){
            wordOk = true
            furigana = $('.furigana',elem).first().text()
            furigana = furigana.replace(/\s+/g, ' ').trim()
            x = furigana.length
            while(x--){
                wordOk = filter.includes(furigana[x])
                if(!wordOk)break

            }
            translation = $('.meaning-meaning',elem).first().text()
            translation = translation.replace(/\s+/g, ' ').trim()
            if(translation && furigana && furigana.length > 1 && wordOk) myData.push({hiragana: furigana, meaning: translation})
        })
        newUrl = "https:"+($('.more').attr('href'))

        //if(counter > numOfPages) return myData 
        console.log(myData.length)
        if(myData.length >= 20){
            return

        } 

        await getDataFiltered(filter, abcArr, Math.round(Math.random()*15))	
    })

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
        $('div .concept_light').each(function(x, elem){
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