const Webrtc = require('./Model');
const router = require('express').Router();
const axios = require('axios').default;
router.get("/",async(req,res)=>{
    axios.get("http://localhost:3030/meeting")
    .then(re=>{
        console.log(re)
        res.status(200).send(re.data)
    })
})


module.exports = {
    router,
  };