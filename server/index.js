import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/twitter', function (req, res) {
  fetch(`https://publish.twitter.com/oembed?url=${req.query.url}`)
    .then(response => response.json())
    .then(embedTweet => res.send(embedTweet));
});

app.get('/videos', function (req, res) {
  const offset = (req.query.page - 1) * req.query.limit;
  const query = encodeURIComponent(`+tags:en +accesslevel:Free ${req.query.q}`);

  const search = `?q=${query}&sort=-published_at&limit=${req.query.limit}&offset=${offset}`;
  const accountId = process.env.BRIGHTCOVE_ACCOUNT_ID;
  const policyKey = process.env.BRIGHTCOVE_POLICY_KEY;

  fetch(`https://edge.api.brightcove.com/playback/v1/accounts/${accountId}/videos${search}`, {
    method: 'GET',
    headers: {
      'Authorization': `BCOV-Policy ${policyKey}`,
      'Cache-Control': 'no-cache',
    }
  })
  .then(response => response.json())
  .then(brightcoveVideos => res.send(brightcoveVideos.videos));
})

app.listen(3001, function () {
  console.log('Server running on port 3001!');
});
