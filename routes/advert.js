var express = require('express');
const { transferFundsGetFees, transferFundsRequest, transferFundsVerify, finishAdvert } = require('../service/api');
var router = express.Router();
const { VIDEOS } = require('../util/VIDEOS');

router.get('/request', (req, res, next) => {
    console.log(req.headers);
    let user_id = req.query.userID;
    // logic for getting video -> return: video id, amount
    // possible logic if same video as watched last time
    var index = Math.floor(Math.random() * Object.keys(VIDEOS).length);
    var video_ids = Object.keys(VIDEOS);

    return res.json({
        user_id,
        url: VIDEOS[video_ids[index]].url,
        amount: VIDEOS[video_ids[index]].amount,
        video_id: video_ids[index]
    });
});

router.post('/end', async (req, res, next) => {
    // send finish advert request
    // if fail check 2 more times (possible solution but request times could make this innacurate)
    // add 1-2 secs after time to account for delay etc.
    var { userID: user_id,
            previousTime: previous_time,
            videoID: video_id} = req.body;
    var current_time = new Date().getTime();
    console.log(req.body);
    var video_duration = VIDEOS[video_id].duration;

    // successfully watched whole ad
    if( (current_time - previous_time + 2) > video_duration ){
        var payment_amount = VIDEOS[video_id].amount;
        try {
            await transferFundsGetFees(process.env.play_token, 'player_id', payment_amount, user_id);
            var pending_payment_id = await transferFundsRequest(process.env.play_token, 'player_id', payment_amount, user_id);
            await transferFundsVerify(process.env.play_token, pending_payment_id);
            console.log('finished and sent money');
            res.send("DONE");
        } catch(err) {
            console.log("ERROR:");
            console.log(err);
            res.send("ERROR");
        }
    }
});

module.exports = router;