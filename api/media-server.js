const fs = require('fs');
const path = require('path');
const http = require('http');

// Cấu hình server
const PORT = 3000;
const HOST = 'localhost';

// Danh sách extension hỗ trợ
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];

function scanMediaFiles() {
    const result = {
        images: [],
        videos: []
    };

    try {
        // Scan images folder
        const imagesPath = path.join(__dirname, '../data/images/');
        if (fs.existsSync(imagesPath)) {
            const imageFiles = fs.readdirSync(imagesPath);
            
            imageFiles.forEach(file => {
                const filePath = path.join(imagesPath, file);
                if (fs.statSync(filePath).isFile()) {
                    const extension = path.extname(file).toLowerCase().slice(1);
                    if (imageExtensions.includes(extension)) {
                        const stats = fs.statSync(filePath);
                        result.images.push({
                            filename: file,
                            path: `data/images/${file}`,
                            size: stats.size,
                            modified: Math.floor(stats.mtime.getTime() / 1000),
                            extension: extension
                        });
                    }
                }
            });
        }

        // Scan videos folder
        const videosPath = path.join(__dirname, '../data/videos/');
        if (fs.existsSync(videosPath)) {
            const videoFiles = fs.readdirSync(videosPath);
            
            videoFiles.forEach(file => {
                const filePath = path.join(videosPath, file);
                if (fs.statSync(filePath).isFile()) {
                    const extension = path.extname(file).toLowerCase().slice(1);
                    if (videoExtensions.includes(extension)) {
                        const stats = fs.statSync(filePath);
                        result.videos.push({
                            filename: file,
                            path: `data/videos/${file}`,
                            size: stats.size,
                            modified: Math.floor(stats.mtime.getTime() / 1000),
                            extension: extension
                        });
                    }
                }
            });
        }

        // Sort by modification time (newest first)
        result.images.sort((a, b) => b.modified - a.modified);
        result.videos.sort((a, b) => b.modified - a.modified);

    } catch (error) {
        console.error('Error scanning media files:', error);
    }

    return result;
}

// Tạo HTTP server
const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Handle OPTIONS request (preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle GET request for media files
    if (req.url === '/api/get-media-files' && req.method === 'GET') {
        try {
            const mediaFiles = scanMediaFiles();
            const response = {
                success: true,
                data: mediaFiles,
                total_images: mediaFiles.images.length,
                total_videos: mediaFiles.videos.length
            };

            res.writeHead(200);
            res.end(JSON.stringify(response, null, 2));
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({
                success: false,
                error: error.message
            }));
        }
        return;
    }

    // 404 for other requests
    res.writeHead(404);
    res.end(JSON.stringify({
        success: false,
        error: 'Not found'
    }));
});

// Start server
server.listen(PORT, HOST, () => {
    console.log(`Media API Server đang chạy tại http://${HOST}:${PORT}`);
    console.log(`Endpoint: http://${HOST}:${PORT}/api/get-media-files`);
    console.log('Press Ctrl+C to stop server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
