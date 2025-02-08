var express = require('express');
var app = express();
var cors = require('cors')
var ytdl = require('ytdl-core');
const fs = require('fs');

app.use(cors())
app.use(express.json());

app.listen('4000', function () {
  console.log("listening on 4000");
});

app.post('/download', function (req, res) {
  const videoId = req.body.videoId;
  const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
  const video = ytdl(videoLink, { filter: 'audioonly' });

  video.pipe(fs.createWriteStream(`./${videoId}.mp3`));

  video.on('end', () => {
    res.send({ videoId });
  });
});
