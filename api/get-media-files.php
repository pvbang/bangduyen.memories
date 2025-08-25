<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

function scanMediaFiles() {
    $result = [
        'images' => [],
        'videos' => []
    ];
    
    // Image extensions
    $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    // Video extensions  
    $videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
    
    // Scan images folder
    $imagesPath = '../data/images/';
    if (is_dir($imagesPath)) {
        $imageFiles = scandir($imagesPath);
        foreach ($imageFiles as $file) {
            if ($file === '.' || $file === '..') continue;
            
            $filePath = $imagesPath . $file;
            if (is_file($filePath)) {
                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (in_array($extension, $imageExtensions)) {
                    $result['images'][] = [
                        'filename' => $file,
                        'path' => 'data/images/' . $file,
                        'size' => filesize($filePath),
                        'modified' => filemtime($filePath),
                        'extension' => $extension
                    ];
                }
            }
        }
    }
    
    // Scan videos folder
    $videosPath = '../data/videos/';
    if (is_dir($videosPath)) {
        $videoFiles = scandir($videosPath);
        foreach ($videoFiles as $file) {
            if ($file === '.' || $file === '..') continue;
            
            $filePath = $videosPath . $file;
            if (is_file($filePath)) {
                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (in_array($extension, $videoExtensions)) {
                    $result['videos'][] = [
                        'filename' => $file,
                        'path' => 'data/videos/' . $file,
                        'size' => filesize($filePath),
                        'modified' => filemtime($filePath),
                        'extension' => $extension
                    ];
                }
            }
        }
    }
    
    // Sort by modification time (newest first)
    usort($result['images'], function($a, $b) {
        return $b['modified'] - $a['modified'];
    });
    
    usort($result['videos'], function($a, $b) {
        return $b['modified'] - $a['modified'];
    });
    
    return $result;
}

try {
    $mediaFiles = scanMediaFiles();
    echo json_encode([
        'success' => true,
        'data' => $mediaFiles,
        'total_images' => count($mediaFiles['images']),
        'total_videos' => count($mediaFiles['videos'])
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
