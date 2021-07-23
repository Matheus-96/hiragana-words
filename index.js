const express = require('express')
//const mongoose = require('mongoose')
//const axios = require('axios').default;

//mongoose.connect('mongodb')
const app = express();
const {spawn} = require('child_process')
 
app.get('/:query', function(req, res){
    
    

    const process = spawn('python3', ["./python/main.py", req.params.query]);
    process.stdout.on('data', function(data){
        res.header('Content-Type', 'application/json')
        res.send(data);
    })
    // axios({
    //     method: 'GET',
    //     url: 'https://jisho.org/search/ki',
    //     responseType: 'text'
    // })
    // .then((response)=>{

    //     res.send(response.data)
    // })
    // .then((error)=>{

    // })
    // .then(function(){
    //     console.log("teste")
    // })

 
})

app.listen(process.env.PORT || 3000)