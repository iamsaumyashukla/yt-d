const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core'); 
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        
        if (!ytdl.validateURL(videoURL)) {
            return res.status(400).send('Invalid YouTube URL');
        }

        console.log(`Starting download for: ${videoURL}`);

        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, ''); 
        
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(videoURL, { filter: 'audioandvideo' }).pipe(res);

    } catch (error) {
        console.error("Download Error:", error.message);
        res.status(500).send('An error occurred during the download. YouTube may be blocking the request.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});