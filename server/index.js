
import express from 'express';
import cors from 'cors';
import YTDlpWrap from 'yt-dlp-wrap';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize yt-dlp
// In Docker, we install yt-dlp via pip, so it's in the system PATH.
// We just initialize the wrapper with the command name.
const ytDlpWrap = new YTDlpWrap.default('yt-dlp');

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Map yt-dlp format to our VideoFormat interface
const mapFormat = (f) => {
    const isVideo = f.vcodec !== 'none' && f.video_ext !== 'none';
    const isAudio = f.acodec !== 'none' && f.audio_ext !== 'none';

    // Skip if neither (e.g. some manifests)
    if (!isVideo && !isAudio) return null;

    let type = 'video';
    if (isAudio && !isVideo) type = 'audio';

    let quality = '';
    if (isVideo) {
        quality = f.format_note || (f.height ? `${f.height}p` : 'Unknown');
    } else {
        quality = f.abr ? `${Math.round(f.abr)}kbps` : 'Audio';
    }

    // Estimate size if filesize is missing
    let size = 'Unknown';
    if (f.filesize) {
        size = (f.filesize / 1024 / 1024).toFixed(1) + ' MB';
    } else if (f.filesize_approx) {
        size = '~' + (f.filesize_approx / 1024 / 1024).toFixed(1) + ' MB';
    }

    return {
        id: f.format_id,
        quality: quality,
        format: f.ext,
        size: size,
        type: type,
        // Keep raw format for sorting/debugging
        _raw: f
    };
};

app.post('/analyze', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, error: 'URL is required' });
    }

    try {
        console.log('Analyzing:', url);
        const metadata = await ytDlpWrap.getVideoInfo(url);

        let formats = [];
        if (metadata.formats) {
            formats = metadata.formats
                .map(mapFormat)
                .filter(f => f !== null)
                // Remove duplicates based on ID
                .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
                .reverse(); // Best quality usually at the end
        }

        const videoInfo = {
            title: metadata.title,
            thumbnail: metadata.thumbnail,
            duration: metadata.duration_string,
            author: metadata.uploader,
            formats: formats
        };

        res.json({
            success: true,
            platform: metadata.extractor,
            videoInfo: videoInfo
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze video'
        });
    }
});

app.get('/download', async (req, res) => {
    const { url, formatId } = req.query;

    if (!url || !formatId) {
        return res.status(400).send('URL and formatId are required');
    }

    try {
        console.log(`Downloading ${url} format ${formatId}`);

        // Get metadata first to get filename
        const metadata = await ytDlpWrap.getVideoInfo(url);
        const title = metadata.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        // Find extension
        const format = metadata.formats.find(f => f.format_id === formatId);
        const ext = format ? format.ext : 'mp4';

        const filename = `${title}.${ext}`;

        res.header('Content-Disposition', `attachment; filename="${filename}"`);

        const command = ytDlpWrap.execStream([
            url,
            '-f', formatId
        ]);

        command.pipe(res);

        command
            .on('error', (error) => {
                console.error('Download error:', error);
                if (!res.headersSent) {
                    res.status(500).send('Download failed: ' + error.message);
                }
            })
            .on('close', () => {
                console.log('Download complete');
            });

    } catch (error) {
        console.error('Setup download error:', error);
        res.status(500).send('Failed to start download');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Ensure you have an internet connection to download yt-dlp binary on first run.`);
});
