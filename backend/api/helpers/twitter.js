const { default: axios } = require("axios");

const url = 'https://api.twitter.com/2/tweets/search/recent';

class Twitter {

    get = (query, count, tweet_field, expansions, media_field, user_field, next_token) => {
        return axios.get(url, {
            params: {
                query: query,
                max_results: count,
                'tweet.fields': tweet_field,
                expansions: expansions,
                'media.fields': media_field,
                'user.fields': user_field,
                next_token: next_token
            },
            headers: {
                "Authorization": `Bearer ${process.env.TWITTER_API_TOKEN}`
    
            }
        }) 
    }
}

module.exports = Twitter;