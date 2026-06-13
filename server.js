const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();
// Use the port provided by the hosting service, or 4000 for local testing
const PORT = process.env.PORT || 4000;

// Enable CORS
app.use(cors());

// Serve the frontend HTML file natively so we don't have to hardcode URLs
app.use(express.static(path.join(__dirname, 'public')));

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        
        if (!ytdl.validateURL(videoURL)) {
            return res.status(400).send('Invalid YouTube URL');
        }

        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, ''); // Clean title
        
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(videoURL, { format: 'mp4' }).pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during the download.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});