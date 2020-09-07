#!/bin/bash
# YOUTUBE_API_TOKENにアクセストークンつけておく
VIDEO_ID=$1

LIVE_CHAT_ID=`curl -X GET "https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${VIDEO_ID}&key=${YOUTUBE_API_KEY}" | jq -r .items[0].liveStreamingDetails.activeLiveChatId`

echo $LIVE_CHAT_ID

curl -X GET "https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${LIVE_CHAT_ID}&part=id,snippet&hl=ja&maxResults=2000&key=${YOUTUBE_API_KEY}" | \
#  jq -r '.items[].snippet.textMessageDetails.messageText | select(.)'
  jq -r '.items[].snippet.publishedAt'

