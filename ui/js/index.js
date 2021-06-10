const URL = "https://twitter-api-clone-js.herokuapp.com/tweets?";
//const URL = 'http://localhost:3000/tweets?';

let nextPageUrl = null;

const onEnter = (e) => {
    if(e.key == "Enter") {
        getTwitterData();
    }
}

const onNextPage = () => {
    if(nextPageUrl) {
        getTwitterData(true);
    }
}

/**
 * Retrive Twitter Data from API
 */
const getTwitterData = (nextPage=false) => {
    let input =document.getElementById('user-search-input').value;
    if(!input) return;
    const encodedQuery = encodeURIComponent(input);
    let url = `${URL}query=${encodedQuery}&max_results=10&tweet.fields=lang,created_at,author_id&expansions=attachments.media_keys,author_id&media.fields=preview_image_url,url&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url`;
    if(nextPage && nextPageUrl) {
        url = nextPageUrl;
    }

    fetch(url).then(response => response.json())
    .then(data => {
        buildTweets(data, nextPage);
        saveNextPage(data.meta, encodedQuery);
        nextPageButtonVisibility(data.meta);
    });
}


/**
 * Save the next page data
 */
const saveNextPage = (metadata, query) => {
    if(metadata.next_token) {
        //url = `${URL}query=${encodedQuery}&max_results=10&tweet.fields=lang,created_at,author_id&expansions=attachments.media_keys,author_id&media.fields=preview_image_url,url&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url`
        nextPageUrl = `${URL}query=${query}&max_results=10&tweet.fields=lang,created_at,author_id&expansions=attachments.media_keys,author_id&media.fields=preview_image_url,url&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url&next_token=${metadata.next_token}`;
    } else {
        nextPageUrl = null;
    }
}

/**
 * Handle when a user clicks on a trend
 */
const selectTrend = (e) => {
    document.getElementById('user-search-input').value = e.target.innerHTML;
    getTwitterData();
}

/**
 * Set the visibility of next page based on if there is data on next page
 */
const nextPageButtonVisibility = (metadata) => {
    if(metadata.next_token) {
        document.getElementById("next-page").style.visibility = "visible";
    } else {
        document.getElementById("next-page").style.visibility = "hidden";
    }
}

/**
 * Build Tweets HTML based on Data from API
 */
const buildTweets = (tweets, nextPage) => {
    let twitterContent = "";
    let tweetArr = tweets.data;

    tweetArr.map((tweet) => {
        for(let i=0; i<tweets.includes.users.length; i++) {
            if(tweet.author_id == tweets.includes.users[i].id) {
                const createddate = moment(tweet.created_at).fromNow();
                twitterContent += `
                <div class="tweet-container">
                        <div class="tweet-user-info">
                            <div class="tweet-user-profile" style="background-image: url(${tweets.includes.users[i].profile_image_url})"></div>
                            <div class="tweet-user-name-container">
                                <div class="tweet-user-fullname">${tweets.includes.users[i].name}</div>
                                <div class="tweet-user-username">@${tweets.includes.users[i].username}</div>
                            </div>
                        </div>
                        `

            if(tweet.attachments) {
                let mediaArr = tweets.includes.media;
                twitterContent += buildImages(tweet.attachments, mediaArr);
                twitterContent += buildVideo(tweet.attachments, mediaArr);
            }
            twitterContent += `
                        <div class="tweet-text-container">
                            ${tweet.text}
                        </div>
                        <div class="tweet-date-container">
                            ${createddate}
                        </div>
                    </div>
                `;
            }
        }
    })
    
    /*
    tweetArr.map((tweet) => {
        const createddate = moment(tweet.created_at).fromNow();
        twitterContent += `
        <div class="tweet-container">
                        <div class="tweet-user-info">
                            <div class="tweet-user-profile" style="background-image: url(${tweets.includes.users[i].profile_image_url})"></div>
                            <div class="tweet-user-name-container">
                                <div class="tweet-user-fullname">${tweets.includes.users[i].name}</div>
                                <div class="tweet-user-username">@${tweets.includes.users[i].username}</div>
                            </div>
                        </div>
                        `

        if(tweet.attachments) {
            let mediaArr = tweets.includes.media;
            console.log(mediaArr);
            twitterContent += buildImages(tweet.attachments, mediaArr);
            twitterContent += buildVideo(tweet.attachments, mediaArr);
        }
        twitterContent += `
                        <div class="tweet-text-container">
                            ${tweet.text}
                        </div>
                        <div class="tweet-date-container">
                            ${createddate}
                        </div>
                    </div>
        `;
        //i++;

    });
    */

    if(nextPage) {
        document.querySelector('.tweets-list').insertAdjacentHTML('beforeend', twitterContent);
    } else {
        document.querySelector('.tweets-list').innerHTML = twitterContent;
    }
    
}
    

/**
 * Build HTML for Tweets Images
 */
const buildImages = (attachments, media) => {

    let keys = attachments.media_keys;
    let imageContent = `<div class="tweet-images-container">`;
    let imageExists = false;

    media.map((m) => {
        if(m.type == "photo") {
            for(let i = 0; i < keys.length; i++) {
                if(m.media_key == keys[i]) {
                    imageExists = true;
                    imageContent += `                  
                    <dvi class="tweet-image" style="background-image: url(${m.url})"></dvi>
                    `;
                }
            }
        } 
    })


    imageContent += `</div>`;
    return imageExists ? imageContent : '';

}

/**
 * Build HTML for Tweets Video
 */
const buildVideo = (attachments, media) => {
    let keys = attachments.media_keys;
    let videoContent = `<div class="tweet-video-container">`;
    let videoExists = false;

    media.map((m) => {
        if(m.type == "video") {
            
            for(let i = 0; i < keys.length; i++) {
                if(m.media_key == keys[i]) {
                    videoExists = true;
                    videoContent += `                  
                    <video controls>
                        <source src="" type="video/mp4">
                    </video>
                    `;
                }
            }
        } else if(m.type == "animated_gif") {
            videoExists = true;
            for(let i = 0; i < keys.length; i++) {
                if(m.media_key == keys[i]) {
                    videoContent += `
                <video controls>
                    <source src="" type="video/mp4">
                </video>`;
                }
            }
        } 
    })

    videoContent += `</div>`;
    return videoExists ? videoContent : '';
}
