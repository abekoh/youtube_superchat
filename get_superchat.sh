#!/bin/bash
# YOUTUBE_API_TOKENにアクセストークンつけておく
VIDEO_ID="XxqwxFgJa0w"

LIVE_CHAT_ID=`curl -X GET -H "Authorization:Bearer ${YOUTUBE_API_TOKEN}" "https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${VIDEO_ID}" | jq -r .items[0].liveStreamingDetails.activeLiveChatId`

echo $LIVE_CHAT_ID

curl -X GET -H "Authorization:Bearer ${YOUTUBE_API_TOKEN}" "https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${LIVE_CHAT_ID}&part=id,snippet&hl=ja"
