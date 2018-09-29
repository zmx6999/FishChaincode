const router = require("express").Router();
const path = require("path");
const Invoke = require("../tools/invoke");
const Query = require("../tools/query");
router.post("/record",(req,res,next) => {
    let data = req.body;
    data.chaincodeId = "180928";
    data.fcn = "recordFish";
    data.channelId = "mychannel";
    data.store_path = path.join(__dirname, '../hfc-key-store/'+data.org);
    Invoke(data,() => {
        res.success()
    },(msg) => {
        res.fail(msg)
    });
});

router.post("/transfer",(req,res,next) => {
    let data = req.body;
    data.chaincodeId = "180928";
    data.fcn = "transferFish";
    data.channelId = "mychannel";
    data.store_path = path.join(__dirname, '../hfc-key-store/'+data.org);
    Invoke(data,() => {
        res.success()
    },(msg) => {
        res.fail(msg)
    });
});

router.post("/query",(req,res,next) => {
    let data = req.body;
    data.chaincodeId = "180928";
    data.fcn = "queryFish";
    data.channelId = "mychannel";
    data.store_path = path.join(__dirname, '../hfc-key-store/'+data.org);
    Query(data,(r) => {
        res.success(r)
    },(msg) => {
        res.fail(msg)
    });
});

router.post("/queryrange",(req,res,next) => {
    let data = req.body;
    data.chaincodeId = "180928";
    data.fcn = "queryFishByRange";
    data.channelId = "mychannel";
    data.store_path = path.join(__dirname, '../hfc-key-store/'+data.org);
    Query(data,(r) => {
        res.success(r)
    },(msg) => {
        res.fail(msg)
    });
});
module.exports = router;
