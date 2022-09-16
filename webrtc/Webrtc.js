const Webrtc = require('./Model');
const router = require('express').Router();
const axios = require('axios').default;
router.get("/",async(req,res)=>{
    axios.get("https://luma-webrtc.herokuapp.com/meeting")
    .then(re=>{
        console.log(re)
        res.status(200).send(re.data)
    })
})


module.exports = {
    router,
  };