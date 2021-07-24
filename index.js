const express = require('express')
const cors = require('cors')
const axios = require('axios').default
const cheerio = require('cheerio')

const app = express();
app.use(express.json())
//app.use(cors)

app.get('/:query', async function(req, res){
    counter = 0;
    numOfPages = 5
    myData = []
    baseUrl = "https://jisho.org/search/"
    await getData(req.params.query, Math.round(Math.random()*15))
    res.header('Content-Type', 'application/json')
    res.send(myData)
})

app.post('/:query', async function(req, res){
    console.log(req)
    console.log(req.params.query)
    counter = 0;
    numOfPages = 3
    myData = []
    baseUrl = "https://jisho.org/search/"
    await getDataFiltered(req.params.query, req.body.hiragana, Math.round(Math.random()*15))
    res.header('Content-Type', 'application/json')
    res.send(myData)
})


async function getDataFiltered(query, filter, newUrl = 0){
    await axios({
        method: 'GET',
        url: (newUrl!=0 ? baseUrl+query+"%20%23words" + "?page="+newUrl : baseUrl+query+"%20%23words"),
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
        if(myData.length >= 30){
            console.log('siu')
            return

        } 

        await getDataFiltered(query, filter, Math.round(Math.random()*15))	
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