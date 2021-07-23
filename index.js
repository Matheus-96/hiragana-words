const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios').default;


//mongoose.connect('mongodb')
const app = express();

app.get('/:query', function(req, res){
    
    
    // ### PYTHON - BAD USE FOR NODE/HEROKU ###
    // const {spawn} = require('child_process')
    // const process = spawn('python3', ["./python/main.py", req.params.query]);
    // process.stdout.on('data', function(data){
    //     res.header('Content-Type', 'application/json')
    //     res.send(data);
    // })


    axios({
        method: 'GET',
        url: 'https://jisho.org/search/ki',
        responseType: 'text'
    })
    .then((response)=>{

        res.send(response.data)
    })
    .then((error)=>{

    })
    .then(function(){
        console.log("teste")
    })

 
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});