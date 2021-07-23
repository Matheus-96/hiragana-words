const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios').default
const cheerio = require('cheerio')

//mongoose.connect('mongodb')
const app = express();

app.get('/:query', async function(req, res){
    
    // ### PYTHON - BAD USE FOR NODE/HEROKU ###
    // const {spawn} = require('child_process')
    // const process = spawn('python3', ["./python/main.py", req.params.query]);
    // process.stdout.on('data', function(data){
    //     res.header('Content-Type', 'application/json')
    //     res.send(data);
    // })
        

    counter = 0;
    numOfPages = 1
    myData = []
    console.log("iniciou")
    await getData(req.params.query)
    res.send(myData)
    console.log("finalizou")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

async function getData(query, newUrl = 0){
    await axios({
        method: 'GET',
        url: (newUrl!=0 ? newUrl : 'https://jisho.org/search/'+query+"%20%23words"),
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
            if(translation && furigana) myData.push({hiragana: furigana, meaning: translation})
        })
        newUrl = "https:"+($('.more').attr('href'))
        //console.log(myData)

        if(counter > numOfPages){
            console.log("teste")
            return myData
        } 

        getData(query, newUrl)	
    })

 
}