const router = require("express").Router();


router.get('/api',(req,res)=>{
   res.send(true);
});


module.exports = router;