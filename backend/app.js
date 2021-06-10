const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
const Twitter = require('./api/helpers/twitter');
const twitter = new Twitter();
const port = 3000 || process.env.PORT;
require('dotenv').config();

app.get('/tweets', (req, res) => {
    const query = req.query.query;
    const count = req.query.max_results;
    const tweet_field = req.query["tweet.fields"];
    const expansions = req.query.expansions;
    const media_field = req.query["media.fields"];
    const user_field = req.query["user.fields"];
    const next_token = req.query.next_token

    twitter.get(query, count, tweet_field, expansions,media_field, user_field, next_token)
    .then((response) => {
        res.status(200).send(response.data);
    }).catch((error) => {
        res.status(400).send(error);
    })


})



app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
})