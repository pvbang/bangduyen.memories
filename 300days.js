// ==========================================
// 300 DAYS CELEBRATION PAGE - JAVASCRIPT
// Three.js + Interactive Features
// ==========================================

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
    // Relationship dates
    startDate: new Date('2025-03-23'),
    celebrationDate: new Date('2026-01-17'),

    // Three.js settings
    heartCount: 300,
    particleCount: 500,

    // Gallery settings
    photoCount: 20, // Will use images from 300days folder
    galleryRadius: 400,

    // Animation settings
    rotationSpeed: 0.001,

    // Image paths
    imagePath: 'data/images/300days/',
    fallbackImagePath: 'data/images/'
};

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let scene, camera, renderer;
let hearts = [];
let particles = [];
let animationFrameId;
let isThreeJsInitialized = false;

// ==========================================
// LOADING SCREEN
// ==========================================

function updateLoadingProgress(progress) {
    const loadingBar = document.getElementById('loadingBar');
    if (loadingBar) {
        loadingBar.style.width = `${progress}%`;
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }

    // Show page
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';
}

// ==========================================
// THREE.JS INITIALIZATION
// ==========================================

function initThreeJS() {
    const container = document.getElementById('threejs-container');
    const canvas = document.getElementById('threejs-canvas');

    if (!container || !canvas) return;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 50;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create hearts
    createHearts();

    // Create particles
    createParticles();

    // Start animation
    animateThreeJS();

    isThreeJsInitialized = true;

    // Handle resize
    window.addEventListener('resize', onWindowResize);
}

function createHearts() {
    const heartShape = new THREE.Shape();

    // Draw heart shape
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.3, -0.5, -0.5, -0.5, 0);
    heartShape.bezierCurveTo(-0.5, 0.3, 0, 0.6, 0, 1);
    heartShape.bezierCurveTo(0, 0.6, 0.5, 0.3, 0.5, 0);
    heartShape.bezierCurveTo(0.5, -0.5, 0, -0.3, 0, 0);

    const extrudeSettings = {
        depth: 0.2,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.1,
        bevelThickness: 0.1
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

    for (let i = 0; i < CONFIG.heartCount; i++) {
        const color = new THREE.Color().setHSL(
            0.95 + Math.random() * 0.1, // Red to pink hue
            0.7 + Math.random() * 0.3,
            0.5 + Math.random() * 0.3
        );

        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3 + Math.random() * 0.5
        });

        const heart = new THREE.Mesh(geometry, material);

        // Random position
        heart.position.x = (Math.random() - 0.5) * 100;
        heart.position.y = (Math.random() - 0.5) * 100;
        heart.position.z = (Math.random() - 0.5) * 50;

        // Random scale
        const scale = 0.3 + Math.random() * 0.7;
        heart.scale.set(scale, scale, scale);

        // Random rotation
        heart.rotation.x = Math.random() * Math.PI;
        heart.rotation.y = Math.random() * Math.PI;
        heart.rotation.z = Math.random() * Math.PI;

        // Animation properties
        heart.userData = {
            speedX: (Math.random() - 0.5) * 0.02,
            speedY: 0.01 + Math.random() * 0.02,
            speedZ: (Math.random() - 0.5) * 0.01,
            rotationSpeed: 0.01 + Math.random() * 0.02,
            floatOffset: Math.random() * Math.PI * 2
        };

        scene.add(heart);
        hearts.push(heart);
    }
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < CONFIG.particleCount; i++) {
        positions.push(
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 50
        );

        // Pink/white particles
        const color = new THREE.Color().setHSL(
            0.9 + Math.random() * 0.1,
            0.5 + Math.random() * 0.5,
            0.7 + Math.random() * 0.3
        );
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    particles.push(particleSystem);
}

function animateThreeJS() {
    animationFrameId = requestAnimationFrame(animateThreeJS);

    const time = Date.now() * 0.001;

    // Animate hearts
    hearts.forEach((heart, i) => {
        // Float animation
        heart.position.y += heart.userData.speedY;
        heart.position.x += Math.sin(time + heart.userData.floatOffset) * 0.01;

        // Reset position if out of view
        if (heart.position.y > 60) {
            heart.position.y = -60;
            heart.position.x = (Math.random() - 0.5) * 100;
        }

        // Rotation
        heart.rotation.x += heart.userData.rotationSpeed * 0.5;
        heart.rotation.y += heart.userData.rotationSpeed;

        // Pulsing opacity
        heart.material.opacity = 0.3 + Math.sin(time * 2 + i) * 0.2;
    });

    // Rotate particle system
    particles.forEach(p => {
        p.rotation.y += 0.0005;
    });

    // Camera slight movement
    camera.position.x = Math.sin(time * 0.2) * 2;
    camera.position.y = Math.cos(time * 0.3) * 2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

function onWindowResize() {
    if (!camera || !renderer) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ==========================================
// GALAXY 3D PHOTO GALLERY
// ==========================================

// Galaxy state
let galaxyScene, galaxyCamera, galaxyRenderer;
let galaxyControls;
let photoMeshes = [];
let starParticles;
let nebulaParticles;
let galaxyAnimationId;
let isGalaxyAutoRotate = true;
let currentLightboxIndex = 0;
let slideShowInterval = null;
let galaxyRaycaster, galaxyMouse;
let hoveredPhoto = null;
let allPhotos = [];

const TOTAL_PHOTOS = 97;
const GALAXY_CONFIG = {
    starCount: 1500,    // Reduced for better performance
    nebulaCount: 600,   // Reduced for better performance
    photoSize: 12,       // Larger photos for better visibility
    spiralArms: 3,
    spiralTightness: 0.4,
    galaxyRadius: 180,
    rotationSpeed: 0.0002
};

// Image extensions mapping
const photoExtensions = {
    1: 'jpeg', 2: 'jpeg', 3: 'jpeg', 4: 'jpeg', 5: 'jpeg',
    6: 'jpeg', 7: 'jpeg', 8: 'jpeg', 16: 'jpeg', 17: 'jpeg',
    18: 'jpeg', 86: 'jpeg'
};

function getPhotoExtension(num) {
    return photoExtensions[num] || 'jpg';
}

// Initialize Galaxy
function initGalaxyGallery() {
    const container = document.getElementById('galaxyContainer');
    const canvas = document.getElementById('galaxyCanvas');
    const loading = document.getElementById('galaxyLoading');

    if (!container || !canvas) return;

    // Generate photo data
    for (let i = 1; i <= TOTAL_PHOTOS; i++) {
        const ext = getPhotoExtension(i);
        allPhotos.push({
            index: i,
            src: `${CONFIG.imagePath}image${i}.${ext}`,
            alt: `Kỷ niệm ${i}`
        });
    }

    // Scene
    galaxyScene = new THREE.Scene();

    // Camera
    galaxyCamera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        2000
    );
    galaxyCamera.position.set(0, 150, 300);
    galaxyCamera.lookAt(0, 0, 0);

    // Renderer
    galaxyRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    galaxyRenderer.setSize(container.clientWidth, container.clientHeight);
    galaxyRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    galaxyRenderer.setClearColor(0x000000, 0);

    // Raycaster for interaction
    galaxyRaycaster = new THREE.Raycaster();
    galaxyMouse = new THREE.Vector2();

    // Create galaxy elements
    createStarField();
    createNebula();
    createPhotoConstellation();

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    galaxyScene.add(ambientLight);

    // Setup controls (manual implementation for drag rotation)
    setupGalaxyControls(container);

    // Setup event listeners
    setupGalaxyEventListeners(container);

    // Start animation
    animateGalaxy();

    // Hide loading after textures load (faster now!)
    setTimeout(() => {
        loading?.classList.add('hidden');
    }, 800);

    // Handle resize
    window.addEventListener('resize', onGalaxyResize);
}

// Create circular texture for particles (instead of squares)
function createCircleTexture(color = '#ffffff', size = 64) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Create radial gradient for soft glow effect
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.3, color);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// Create star field
function createStarField() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < GALAXY_CONFIG.starCount; i++) {
        // Distribute stars in a sphere
        const radius = 100 + Math.random() * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta) - 50,
            radius * Math.cos(phi)
        );

        // Star colors: white to pink to purple
        const colorChoice = Math.random();
        let color;
        if (colorChoice < 0.6) {
            color = new THREE.Color(1, 1, 1); // White
        } else if (colorChoice < 0.85) {
            color = new THREE.Color(1, 0.7, 0.8); // Pink
        } else {
            color = new THREE.Color(0.8, 0.6, 1); // Purple
        }
        colors.push(color.r, color.g, color.b);

        // Random sizes
        sizes.push(0.5 + Math.random() * 2);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const starTexture = createCircleTexture('#ffffff', 32);
    const material = new THREE.PointsMaterial({
        size: 2,
        map: starTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        depthWrite: false
    });

    starParticles = new THREE.Points(geometry, material);
    galaxyScene.add(starParticles);
}

// Create nebula effect
function createNebula() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < GALAXY_CONFIG.nebulaCount; i++) {
        // Spiral distribution for nebula
        const arm = Math.floor(Math.random() * GALAXY_CONFIG.spiralArms);
        const armAngle = (arm / GALAXY_CONFIG.spiralArms) * Math.PI * 2;

        const distance = Math.random() * GALAXY_CONFIG.galaxyRadius * 1.5;
        const spiralAngle = distance * GALAXY_CONFIG.spiralTightness + armAngle;

        const scatter = 30 + distance * 0.2;

        positions.push(
            Math.cos(spiralAngle) * distance + (Math.random() - 0.5) * scatter,
            (Math.random() - 0.5) * 30,
            Math.sin(spiralAngle) * distance + (Math.random() - 0.5) * scatter
        );

        // Nebula colors: pink, purple, blue gradient
        const t = distance / (GALAXY_CONFIG.galaxyRadius * 1.5);
        const color = new THREE.Color();
        if (t < 0.5) {
            color.setHSL(0.9, 0.8, 0.5 + Math.random() * 0.3); // Pink
        } else {
            color.setHSL(0.75, 0.7, 0.4 + Math.random() * 0.3); // Purple
        }
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const nebulaTexture = createCircleTexture('#ff88cc', 32);
    const material = new THREE.PointsMaterial({
        size: 4,
        map: nebulaTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    nebulaParticles = new THREE.Points(geometry, material);
    galaxyScene.add(nebulaParticles);
}

// Create photo constellation in spiral pattern
function createPhotoConstellation() {
    allPhotos.forEach((photo, index) => {
        // Calculate spiral position
        const arm = index % GALAXY_CONFIG.spiralArms;
        const armAngle = (arm / GALAXY_CONFIG.spiralArms) * Math.PI * 2;

        const progress = index / TOTAL_PHOTOS;
        const distance = 25 + progress * GALAXY_CONFIG.galaxyRadius;
        const spiralAngle = distance * GALAXY_CONFIG.spiralTightness + armAngle;

        // Add some randomness
        const scatter = 12;
        const x = Math.cos(spiralAngle) * distance + (Math.random() - 0.5) * scatter;
        const y = (Math.random() - 0.5) * 20;
        const z = Math.sin(spiralAngle) * distance + (Math.random() - 0.5) * scatter;

        // Create photo plane - larger size
        const geometry = new THREE.PlaneGeometry(GALAXY_CONFIG.photoSize, GALAXY_CONFIG.photoSize);

        // Create canvas for texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;  // Higher resolution
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Initial gradient placeholder
        const hue = (index / TOTAL_PHOTOS) * 60 + 300;
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 1)`);
        gradient.addColorStop(0.7, `hsla(${hue + 20}, 70%, 40%, 0.8)`);
        gradient.addColorStop(1, `hsla(${hue + 40}, 60%, 25%, 0.6)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);

        // Add loading indicator
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`#${index + 1}`, 128, 128);

        const canvasTexture = new THREE.CanvasTexture(canvas);

        const material = new THREE.MeshBasicMaterial({
            map: canvasTexture,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.userData = { photoIndex: index, photo: photo, canvas: canvas, ctx: ctx, texture: canvasTexture };

        photoMeshes.push(mesh);
        galaxyScene.add(mesh);

        // Load image and draw to canvas (bypasses CORS for texture)
        const img = new Image();
        img.onload = function () {
            // Draw image to canvas
            ctx.clearRect(0, 0, 256, 256);

            // Calculate cover fit
            const imgRatio = img.width / img.height;
            let sx = 0, sy = 0, sw = img.width, sh = img.height;

            if (imgRatio > 1) {
                // Landscape - crop sides
                sw = img.height;
                sx = (img.width - sw) / 2;
            } else {
                // Portrait - crop top/bottom
                sh = img.width;
                sy = (img.height - sh) / 2;
            }

            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 256, 256);

            // Add subtle border glow
            ctx.strokeStyle = `hsla(${hue}, 80%, 70%, 0.5)`;
            ctx.lineWidth = 4;
            ctx.strokeRect(2, 2, 252, 252);

            // Update texture
            canvasTexture.needsUpdate = true;
        };

        img.onerror = function () {
            // Keep placeholder but add error indicator
            ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
            ctx.fillRect(0, 0, 256, 256);
            canvasTexture.needsUpdate = true;
        };

        // Stagger loading for performance (faster!)
        setTimeout(() => {
            img.src = photo.src;
        }, index * 20);
    });
}

// Setup controls for dragging
function setupGalaxyControls(container) {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    container.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            rotationVelocity.x = deltaY * 0.005;
            rotationVelocity.y = deltaX * 0.005;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        }

        // Update mouse for raycasting
        const rect = container.getBoundingClientRect();
        galaxyMouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
        galaxyMouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    // Scroll to zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        galaxyCamera.position.z += e.deltaY * zoomSpeed;
        galaxyCamera.position.z = Math.max(100, Math.min(600, galaxyCamera.position.z));
        galaxyCamera.position.y = galaxyCamera.position.z * 0.5;
    }, { passive: false });

    // Store for animation
    container.rotationVelocity = rotationVelocity;
}

// Setup event listeners
function setupGalaxyEventListeners(container) {
    // Click on photo
    container.addEventListener('click', (e) => {
        galaxyRaycaster.setFromCamera(galaxyMouse, galaxyCamera);
        const intersects = galaxyRaycaster.intersectObjects(photoMeshes);

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const photoIndex = clickedMesh.userData.photoIndex;
            openLightbox(photoIndex);
        }
    });

    // Control buttons
    document.getElementById('galaxyAutoRotate')?.addEventListener('click', function () {
        isGalaxyAutoRotate = !isGalaxyAutoRotate;
        this.classList.toggle('active', isGalaxyAutoRotate);
    });

    document.getElementById('galaxyZoomIn')?.addEventListener('click', () => {
        galaxyCamera.position.z = Math.max(100, galaxyCamera.position.z - 50);
        galaxyCamera.position.y = galaxyCamera.position.z * 0.5;
    });

    document.getElementById('galaxyZoomOut')?.addEventListener('click', () => {
        galaxyCamera.position.z = Math.min(600, galaxyCamera.position.z + 50);
        galaxyCamera.position.y = galaxyCamera.position.z * 0.5;
    });

    document.getElementById('galaxyReset')?.addEventListener('click', () => {
        galaxyCamera.position.set(0, 150, 300);
        galaxyCamera.lookAt(0, 0, 0);
    });

    document.getElementById('galaxySlideshow')?.addEventListener('click', toggleSlideShow);

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', handleLightboxKeyboard);
}

// Animate galaxy
function animateGalaxy() {
    galaxyAnimationId = requestAnimationFrame(animateGalaxy);

    const time = Date.now() * 0.001;
    const container = document.getElementById('galaxyContainer');

    // Auto rotate galaxy
    if (isGalaxyAutoRotate && container) {
        photoMeshes.forEach(mesh => {
            mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), GALAXY_CONFIG.rotationSpeed);
        });
        if (nebulaParticles) {
            nebulaParticles.rotation.y += GALAXY_CONFIG.rotationSpeed;
        }
    }

    // Apply drag rotation
    if (container?.rotationVelocity) {
        const vel = container.rotationVelocity;
        if (Math.abs(vel.x) > 0.0001 || Math.abs(vel.y) > 0.0001) {
            photoMeshes.forEach(mesh => {
                mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), vel.y);
            });
            if (nebulaParticles) {
                nebulaParticles.rotation.y += vel.y;
            }
            // Damping
            vel.x *= 0.95;
            vel.y *= 0.95;
        }
    }

    // Animate star twinkle
    if (starParticles) {
        starParticles.rotation.y += 0.0001;
        const sizes = starParticles.geometry.attributes.size.array;
        for (let i = 0; i < sizes.length; i++) {
            sizes[i] = 0.5 + Math.sin(time * 2 + i) * 0.5 + Math.random() * 0.5;
        }
        starParticles.geometry.attributes.size.needsUpdate = true;
    }

    // Photo billboard effect (face camera) and hover detection
    galaxyRaycaster.setFromCamera(galaxyMouse, galaxyCamera);
    const intersects = galaxyRaycaster.intersectObjects(photoMeshes);

    photoMeshes.forEach((mesh, i) => {
        // Billboard - always face camera
        mesh.lookAt(galaxyCamera.position);

        // Gentle float animation
        mesh.position.y += Math.sin(time * 0.5 + i * 0.5) * 0.01;

        // Hover effect
        const isHovered = intersects.length > 0 && intersects[0].object === mesh;
        const targetScale = isHovered ? 1.5 : 1;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        // Glow on hover
        if (mesh.material) {
            mesh.material.opacity = isHovered ? 1 : 0.9;
        }
    });

    galaxyRenderer.render(galaxyScene, galaxyCamera);
}

// Handle resize
function onGalaxyResize() {
    const container = document.getElementById('galaxyContainer');
    if (!container || !galaxyCamera || !galaxyRenderer) return;

    galaxyCamera.aspect = container.clientWidth / container.clientHeight;
    galaxyCamera.updateProjectionMatrix();
    galaxyRenderer.setSize(container.clientWidth, container.clientHeight);
}

// ==========================================
// LIGHTBOX (kept from original)
// ==========================================

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('photoLightbox');
    const image = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');

    if (!lightbox || !image) return;

    image.src = allPhotos[index].src;
    counter.textContent = `${index + 1} / ${allPhotos.length}`;
    lightbox.classList.add('active');

    createLightboxThumbnails();
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('photoLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        if (slideShowInterval) {
            clearInterval(slideShowInterval);
            slideShowInterval = null;
        }
    }
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;

    if (currentLightboxIndex < 0) {
        currentLightboxIndex = allPhotos.length - 1;
    } else if (currentLightboxIndex >= allPhotos.length) {
        currentLightboxIndex = 0;
    }

    updateLightboxImage();
}

function updateLightboxImage() {
    const image = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');

    if (image && allPhotos[currentLightboxIndex]) {
        image.style.opacity = '0';
        setTimeout(() => {
            image.src = allPhotos[currentLightboxIndex].src;
            image.style.opacity = '1';
        }, 150);

        counter.textContent = `${currentLightboxIndex + 1} / ${allPhotos.length}`;
        updateActiveThumbnail();
    }
}

function createLightboxThumbnails() {
    const container = document.getElementById('lightboxThumbnails');
    if (!container) return;

    container.innerHTML = '';

    allPhotos.forEach((photo, index) => {
        const thumb = document.createElement('div');
        thumb.className = `lightbox-thumb ${index === currentLightboxIndex ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${photo.src}" alt="Thumbnail ${index + 1}" loading="lazy">`;
        thumb.addEventListener('click', () => {
            currentLightboxIndex = index;
            updateLightboxImage();
        });
        container.appendChild(thumb);
    });

    scrollToActiveThumbnail();
}

function updateActiveThumbnail() {
    const thumbs = document.querySelectorAll('.lightbox-thumb');
    thumbs.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentLightboxIndex);
    });
    scrollToActiveThumbnail();
}

function scrollToActiveThumbnail() {
    const container = document.getElementById('lightboxThumbnails');
    const activeThumb = container?.querySelector('.lightbox-thumb.active');
    if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function handleLightboxKeyboard(e) {
    const lightbox = document.getElementById('photoLightbox');
    if (!lightbox?.classList.contains('active')) return;

    switch (e.key) {
        case 'ArrowLeft':
            navigateLightbox(-1);
            break;
        case 'ArrowRight':
            navigateLightbox(1);
            break;
        case 'Escape':
            closeLightbox();
            break;
    }
}

// ==========================================
// SLIDESHOW
// ==========================================

function toggleSlideShow() {
    const btn = document.getElementById('galaxySlideshow');

    if (slideShowInterval) {
        clearInterval(slideShowInterval);
        slideShowInterval = null;
        if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        const lightbox = document.getElementById('photoLightbox');
        if (!lightbox?.classList.contains('active')) {
            openLightbox(0);
        }

        slideShowInterval = setInterval(() => {
            navigateLightbox(1);
        }, 3000);

        if (btn) btn.innerHTML = '<i class="fas fa-stop"></i>';
    }
}

// ==========================================
// QUOTES CAROUSEL
// ==========================================

function initQuotesCarousel() {
    const track = document.getElementById('quotesTrack');
    const dotsContainer = document.getElementById('quotesDots');
    const prevBtn = document.getElementById('prevQuote');
    const nextBtn = document.getElementById('nextQuote');

    if (!track) return;

    const slides = track.querySelectorAll('.quote-slide');
    let currentSlide = 0;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `quote-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer?.appendChild(dot);
    });

    function updateDots() {
        document.querySelectorAll('.quote-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    prevBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    });

    nextBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    });

    // Auto-advance
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }, 8000);
}

// ==========================================
// LOVE LETTER ENVELOPE
// ==========================================

function initEnvelope() {
    const envelope = document.getElementById('envelope');

    envelope?.addEventListener('click', function () {
        this.classList.toggle('opened');

        // Play sound effect if available
        if (this.classList.contains('opened')) {
            createHeartBurst(this);
        }
    });
}

function createHeartBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-rain';
        heart.innerHTML = ['💖', '💕', '💗', '💘', '💝'][Math.floor(Math.random() * 5)];
        heart.style.left = `${centerX}px`;
        heart.style.top = `${centerY}px`;
        heart.style.fontSize = `${20 + Math.random() * 20}px`;

        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        heart.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px) scale(1)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'ease-out'
        });

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
    }
}

// ==========================================
// 300 PROMISES
// ==========================================

const promises = [
    // 1-10: Tình yêu và quan tâm cơ bản
    "Luôn iuu thưn em mỗi ngày",
    "Không bao giờ làm em buồn",
    "Luôn nghe lời em răm rắp",
    "Quan tâm em từng chút một",
    "Chăm sóc em khi em ốm",
    "Nắm tay em mỗi khi đi bên nhau",
    "Ôm em thật chặt khi em buồn",
    "Hôn trán em mỗi sáng thức dậy",
    "Nói 'iuu em' ít nhất 10 lần mỗi ngày",
    "Nhìn vào mắt em khi nói chuyện",

    // 11-20: Lắng nghe và thấu hiểu
    "Luôn lắng nghe khi em cần tâm sự",
    "Không ngắt lời khi em đang nói",
    "Cố gắng hiểu cảm xúc của em",
    "Không phán xét những điều em chia sẻ",
    "Luôn đứng về phía em trong mọi chuyện",
    "Hỏi han em mỗi ngày 'hôm nay thế nào'",
    "Nhớ tất cả những điều em kể",
    "Chia sẻ mọi niềm vui buồn với em",
    "Không giấu giếm bất cứ điều gì",
    "Luôn trung thực với em 100%",

    // 21-30: Chăm sóc sức khỏe
    "Nhắc em uống nước đầy đủ mỗi ngày",
    "Nhắc em ăn đúng giờ",
    "Nhắc em nghỉ ngơi khi mệt",
    "Nhắc em ngủ đủ giấc",
    "Mua thuốc cho em khi em ốm",
    "Nấu cháo cho em khi em bệnh",
    "Massage cho em khi em mỏi",
    "Đắp chăn cho em khi ngủ",
    "Canh em ngủ khi em mệt",
    "Lo lắng về sức khỏe của em",

    // 31-40: Ẩm thực
    "Nấu cho em những món em thích",
    "Đưa em đi ăn những quán ngon",
    "Mua trà sữa cho em mỗi tuần",
    "Nấu bữa sáng lãng mạn cho em",
    "Học nấu những món em yêu thích",
    "Tìm hiểu món mới để nấu cho em",
    "Đưa em đi ăn vặt cuối tuần",
    "Chia sẻ đồ ăn ngon với em trước",
    "Nhường phần ngon nhất cho em",
    "Nếm thử trước khi cho em ăn",

    // 41-50: Hẹn hò và kỷ niệm
    "Đưa em đi du lịch khám phá",
    "Cùng em đi photobooth nhiều hơn",
    "Dắt em đi dạo công viên",
    "Đi dã ngoại cùng em",
    "Cùng em ngắm hoàng hôn",
    "Đưa em đi xem phim",
    "Cùng em đi cafe dễ thương",
    "Khám phá các con đường Đà Nẵng cùng em",
    "Đi picnic cùng em",
    "Cùng em tạo thêm nhiều kỷ niệm",

    // 51-60: Lời nói ngọt ngào
    "Luôn khen em xinh mỗi ngày",
    "Không bao giờ quên nói 'iuu em'",
    "Gọi em là công chúa mãi mãi",
    "Viết thơ tình tặng em",
    "Đọc thơ tình cho em nghe",
    "Nói những lời ngọt ngào cho em",
    "Khen em giỏi khi em làm được gì",
    "Động viên em khi em thất bại",
    "An ủi em khi em buồn",
    "Làm em cười mỗi ngày ít nhất 3 lần",

    // 61-70: Tôn trọng và ủng hộ
    "Tôn trọng quyết định của em",
    "Ủng hộ mọi ước mơ của em",
    "Không ép buộc em làm gì",
    "Cho em không gian riêng khi cần",
    "Tin tưởng em tuyệt đối",
    "Không ghen tuông vô lý",
    "Tôn trọng bạn bè của em",
    "Tôn trọng gia đình em",
    "Không can thiệp quá mức vào việc của em",
    "Luôn hỏi ý kiến em trước khi quyết định",

    // 71-80: Bảo vệ và an toàn
    "Bảo vệ em khỏi mọi điều xấu",
    "Là điểm tựa vững chắc cho em",
    "Đưa đón em mỗi khi cần",
    "Đi phía ngoài đường để bảo vệ em",
    "Che mưa che nắng cho em",
    "Giữ em an toàn trong mọi tình huống",
    "Sẵn sàng bảo vệ em bất cứ lúc nào",
    "Không để ai bắt nạt em",
    "Luôn ở bên khi em sợ",
    "Là người em tin tưởng nhất",

    // 81-90: Thời gian bên nhau
    "Cùng em đón mọi buổi sáng",
    "Nhắn tin chúc em ngủ ngon mỗi đêm",
    "Gọi điện cho em mỗi ngày",
    "Dành thời gian chất lượng cho em",
    "Không bận rộn đến quên em",
    "Luôn ưu tiên thời gian cho em",
    "Chờ đợi em dù bao lâu",
    "Không để em chờ đợi lâu",
    "Hẹn em đúng giờ",
    "Sẵn sàng có mặt khi em cần",

    // 91-100: Ngày quan trọng
    "Nhớ tất cả ngày quan trọng",
    "Tổ chức sinh nhật thật đặc biệt cho em",
    "Kỷ niệm ngày tỏ tình mỗi năm",
    "Làm bất ngờ cho em vào dịp đặc biệt",
    "Tặng hoa cho em bất ngờ",
    "Viết thiệp tay cho em",
    "Chuẩn bị quà thật chu đáo",
    "Lên kế hoạch hẹn hò đặc biệt",
    "Không quên ngày 23 hàng tháng",
    "Làm video kỷ niệm cho đôi mình",

    // 101-110: Giải quyết mâu thuẫn
    "Không lớn tiếng với em",
    "Không cãi nhau khi đang giận",
    "Chủ động làm hòa trước",
    "Xin lỗi khi anh sai",
    "Không giận em quá 1 ngày",
    "Không đi ngủ khi còn giận nhau",
    "Lắng nghe phản hồi của em",
    "Cùng nhau giải quyết vấn đề",
    "Không nhắc lại chuyện cũ",
    "Học cách kiềm chế cảm xúc",

    // 111-120: Phát triển bản thân
    "Học hỏi để trở thành người đàn ông tốt hơn",
    "Sửa đổi những điểm em không thích",
    "Cố gắng hoàn thiện bản thân",
    "Đọc sách để hiểu em hơn",
    "Học cách yêu thương tốt hơn mỗi ngày",
    "Trở thành người em tự hào",
    "Phát triển sự nghiệp vì em",
    "Học thêm kỹ năng mới",
    "Trở nên trưởng thành hơn",
    "Luôn muốn làm tốt hơn vì em",

    // 121-130: Tương lai
    "Cùng em xây dựng tương lai",
    "Tiết kiệm để xây tổ ấm",
    "Lên kế hoạch tương lai cùng em",
    "Hứa sẽ cưới em làm vợ",
    "Xem em như vợ của anh từ bây giờ",
    "Xây dựng cuộc sống ổn định",
    "Chuẩn bị mọi thứ cho đám cưới",
    "Làm việc chăm chỉ vì tương lai",
    "Đầu tư cho tương lai đôi ta",
    "Cùng em lập kế hoạch từng bước",

    // 131-140: Giải trí cùng nhau
    "Xem phim cùng em dù không hiểu gì",
    "Chơi game cùng em dù thua liên tục",
    "Hát karaoke cùng em",
    "Nghe nhạc cùng em",
    "Đọc sách cùng em",
    "Học tiếng Anh cùng em",
    "Tập thể dục cùng em",
    "Nấu ăn cùng em",
    "Dọn dẹp nhà cùng em",
    "Làm mọi thứ cùng em",

    // 141-150: Tặng quà
    "Tặng em những món quà bất ngờ",
    "Chụp thật nhiều ảnh đẹp cho em",
    "Mua đồ em thích mà không cần hỏi",
    "Tặng em hoa vào ngày thường",
    "Mua kem cho em khi trời nóng",
    "Tặng em gấu bông dễ thương",
    "Mua quần áo đẹp cho em",
    "Tặng em trang sức xinh xắn",
    "Mua đồ skincare cho em",
    "Tặng em những gì em thích",

    // 151-160: Thói quen tốt
    "Luôn giữ lời hứa với em",
    "Không nói dối em bao giờ",
    "Báo cho em biết khi đi đâu",
    "Reply tin nhắn em nhanh nhất có thể",
    "Không để em lo lắng",
    "Luôn update tình hình cho em",
    "Không làm điều gì mờ ám",
    "Chia sẻ mật khẩu điện thoại",
    "Cho em xem mọi thứ nếu em muốn",
    "Không có bí mật với em",

    // 161-170: Cử chỉ yêu thương
    "Vuốt tóc em khi em buồn",
    "Lau nước mắt cho em",
    "Ôm em từ phía sau",
    "Hôn má em mỗi ngày",
    "Cầm tay em khi ngồi cạnh nhau",
    "Dựa vai em khi mệt",
    "Để em tựa đầu vào vai",
    "Khoác áo cho em khi lạnh",
    "Massage chân cho em",
    "Chải tóc cho em",

    // 171-180: Trách nhiệm
    "Chịu trách nhiệm về hành động của mình",
    "Không đổ lỗi cho em",
    "Nhận sai khi làm điều sai",
    "Sửa chữa lỗi lầm ngay lập tức",
    "Không tái phạm lỗi cũ",
    "Học từ sai lầm",
    "Chịu trách nhiệm với tương lai đôi ta",
    "Không bỏ cuộc với em",
    "Luôn giữ cam kết",
    "Xứng đáng với tình yêu của em",

    // 181-190: Sự kiên nhẫn
    "Kiên nhẫn với em mọi lúc",
    "Không nổi nóng với em",
    "Bình tĩnh khi em bực mình",
    "Chờ em khi em chưa sẵn sàng",
    "Không hối thúc em",
    "Thông cảm khi em mood swing",
    "Chịu đựng khi em khó chịu",
    "Dỗ dành em khi em giận dỗi",
    "Kiên nhẫn giải thích cho em hiểu",
    "Không bỏ đi khi em giận",

    // 191-200: Sự quan tâm chi tiết
    "Nhớ color yêu thích của em",
    "Nhớ món ăn em thích",
    "Nhớ nhạc em hay nghe",
    "Nhớ phim em thích xem",
    "Nhớ sách em muốn đọc",
    "Nhớ nơi em muốn đến",
    "Nhớ điều em sợ",
    "Nhớ điều làm em vui",
    "Nhớ điều làm em buồn",
    "Nhớ mọi thứ về em",

    // 201-210: Kỳ đặc biệt hàng tháng
    "Chăm sóc em chu đáo khi 'bà dì' đến",
    "Mua đồ nóng cho em những ngày đó",
    "Massage bụng cho em khi đau",
    "Không làm em bực mình những ngày đó",
    "Chiều em nhiều hơn những ngày đó",
    "Hiểu và thông cảm với em",
    "Dịu dàng hơn với em",
    "Chịu đựng em hơn những ngày đó",
    "Mua socola cho em",
    "Ôm em nhiều hơn",

    // 211-220: Gia đình
    "Tôn trọng ba mẹ em",
    "Quan tâm gia đình em",
    "Thăm hỏi ba mẹ em thường xuyên",
    "Giúp đỡ gia đình em khi cần",
    "Làm con rể tốt sau này",
    "Yêu thương gia đình em như gia đình mình",
    "Dành thời gian cho gia đình em",
    "Học hỏi từ ba mẹ em",
    "Cùng em về thăm nhà",
    "Biếu quà ba mẹ em vào dịp lễ",

    // 221-230: Sự chung thủy
    "Chung thủy với em suốt đời",
    "Chỉ nhìn mình em",
    "Không có tâm với ai khác",
    "Em là người duy nhất",
    "Không để ai thay thế em",
    "Giữ trái tim chỉ cho em",
    "Yêu em đến lúc chết",
    "Không bao giờ phản bội em",
    "Luôn ở bên em",
    "Em là cả bầu trời của anh",

    // 231-240: Thể hiện tình yêu
    "Thể hiện tình yêu qua hành động",
    "Không ngại thể hiện tình cảm",
    "Nói về em với bạn bè",
    "Khoe em với mọi người",
    "Công khai yêu em",
    "Để em làm background điện thoại",
    "Đăng ảnh em lên mạng xã hội",
    "Viết về em trên story",
    "Tự hào khi có em",
    "Cho cả thế giới biết anh yêu em",

    // 241-250: Sự hy sinh
    "Nhường nhịn em",
    "Hy sinh những điều anh thích vì em",
    "Đặt em lên trên bản thân",
    "Sẵn sàng từ bỏ vì em",
    "Làm mọi thứ để em vui",
    "Không đòi hỏi gì từ em",
    "Cho đi không cần nhận lại",
    "Yêu em vô điều kiện",
    "Sẵn sàng thay đổi vì em",
    "Làm những gì em cần",

    // 251-260: Thú cưng và sở thích
    "Cùng em nuôi thú cưng",
    "Yêu thương những gì em yêu",
    "Tìm hiểu sở thích của em",
    "Cùng em làm những gì em thích",
    "Học những gì em quan tâm",
    "Chia sẻ sở thích với em",
    "Tạo sở thích chung",
    "Cùng em khám phá điều mới",
    "Ủng hộ hobby của em",
    "Tham gia hoạt động em thích",

    // 261-270: Sự lãng mạn
    "Tổ chức date night hàng tuần",
    "Dắt em đi ăn tối lãng mạn",
    "Trang trí nhà cho em bất ngờ",
    "Viết love letter cho em",
    "Làm album ảnh kỷ niệm",
    "Tạo playlist nhạc cho đôi mình",
    "Dance với em dưới ánh trăng",
    "Nấu candle light dinner",
    "Tặng em bó hoa bất ngờ",
    "Tổ chức surprise date",

    // 271-280: Sự hài hước
    "Làm em cười mỗi ngày",
    "Kể chuyện hài cho em nghe",
    "Làm những điều dị dị cho em vui",
    "Nhảy nhót làm em cười",
    "Hát cho em nghe dù hát dở",
    "Làm mặt ngố cho em xem",
    "Tạo meme về đôi mình",
    "Chơi đùa với em",
    "Giữ cho mối quan hệ vui vẻ",
    "Không để em chán khi ở bên anh",

    // 281-290: Lời hứa thiêng liêng
    "Hứa yêu em mãi mãi",
    "Hứa không bao giờ bỏ em",
    "Hứa luôn ở bên em",
    "Hứa làm em hạnh phúc",
    "Hứa chăm sóc em suốt đời",
    "Hứa trung thành với em",
    "Hứa tôn trọng em mãi",
    "Hứa cùng em đến cuối đường",
    "Hứa làm chồng tốt sau này",
    "Hứa iuu em vô hạn",

    // 291-300: Đặc biệt cho công chúa
    "Luôn gọi em là 'công chúa iuu của anh'",
    "Đối xử với em như hoàng hậu",
    "Coi em như báu vật quý giá nhất",
    "Nâng niu em từng chút",
    "Trân trọng từng khoảnh khắc bên em",
    "Cảm ơn em đã đến với cuộc đời anh",
    "Biết ơn em mỗi ngày",
    "Yêu em nhiều hơn ngày hôm qua",
    "Iuu em vô điều kiện, vô lý do, vô hạn",
    "300 ngày chỉ là khởi đầu - còn cả đời để iuu em! 💕"
];

let promiseIndex = 0;
const promisesPerLoad = 9;

function initPromises() {
    loadMorePromises();

    document.getElementById('loadMorePromises')?.addEventListener('click', loadMorePromises);
}

function loadMorePromises() {
    const grid = document.getElementById('promisesGrid');
    if (!grid) return;

    const end = Math.min(promiseIndex + promisesPerLoad, promises.length);

    for (let i = promiseIndex; i < end; i++) {
        const card = document.createElement('div');
        card.className = 'promise-card reveal';
        card.innerHTML = `
            <div class="promise-number">${i + 1}</div>
            <p class="promise-text">${promises[i]}</p>
        `;
        grid.appendChild(card);

        // Trigger animation
        setTimeout(() => card.classList.add('visible'), 50 * (i - promiseIndex));
    }

    promiseIndex = end;

    // Hide button if all loaded
    if (promiseIndex >= promises.length) {
        document.getElementById('loadMorePromises').style.display = 'none';
    }
}

// ==========================================
// COUNTER ANIMATIONS
// ==========================================

function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// ==========================================
// SPECIAL EFFECTS
// ==========================================

function createHeartRain() {
    const hearts = ['💖', '💕', '💗', '💘', '💝', '❤️', '💓', '💞'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-rain';
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.fontSize = `${20 + Math.random() * 30}px`;
            heart.style.animationDuration = `${3 + Math.random() * 3}s`;

            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 6000);
        }, i * 100);
    }
}

function createFireworks() {
    const colors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#FF8E8E', '#DDA0DD', '#87CEEB'];

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.6;
            const color = colors[Math.floor(Math.random() * colors.length)];

            // Create explosion particles
            for (let j = 0; j < 20; j++) {
                const particle = document.createElement('div');
                particle.className = 'firework';
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.background = color;
                particle.style.boxShadow = `0 0 10px ${color}`;

                const angle = (Math.PI * 2 * j) / 20;
                const velocity = 50 + Math.random() * 100;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;

                particle.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 800 + Math.random() * 400,
                    easing: 'ease-out'
                });

                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1200);
            }
        }, i * 200);
    }
}

function createConfetti() {
    const colors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#FF8E8E', '#DDA0DD', '#87CEEB', '#98D8C8'];
    const shapes = ['square', 'circle'];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${5 + Math.random() * 10}px`;
            confetti.style.height = `${5 + Math.random() * 10}px`;
            confetti.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? '50%' : '0';
            confetti.style.animationDuration = `${2 + Math.random() * 2}s`;

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// ==========================================
// MINI GAMES
// ==========================================

// Heart Catch Game
function initHeartCatchGame() {
    document.getElementById('heartCatchGame')?.querySelector('.game-btn')?.addEventListener('click', () => {
        startHeartCatchGame();
    });
}

function startHeartCatchGame() {
    let score = 0;
    let timeLeft = 30;

    // Create game overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';
    overlay.innerHTML = `
        <div class="game-header">
            <div class="game-score">Score: <span id="gameScore">0</span></div>
            <div class="game-timer">Time: <span id="gameTimer">30</span>s</div>
            <button class="game-close" id="closeGame">✕</button>
        </div>
        <div class="game-area" id="gameArea"></div>
    `;

    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
    `;

    document.body.appendChild(overlay);

    const gameArea = document.getElementById('gameArea');
    gameArea.style.cssText = `
        width: 100%;
        max-width: 600px;
        height: 80vh;
        position: relative;
        overflow: hidden;
        border: 3px solid #FF6B6B;
        border-radius: 20px;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
    `;

    // Timer
    const timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('gameTimer').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            clearInterval(spawnInterval);
            showGameResult(score);
            overlay.remove();
        }
    }, 1000);

    // Spawn hearts
    const spawnInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.cssText = `
            position: absolute;
            font-size: ${30 + Math.random() * 30}px;
            cursor: pointer;
            left: ${Math.random() * (gameArea.offsetWidth - 60)}px;
            top: -60px;
            transition: transform 0.1s;
            animation: heartFallGame ${2 + Math.random() * 2}s linear forwards;
        `;

        heart.addEventListener('click', () => {
            score++;
            document.getElementById('gameScore').textContent = score;
            heart.style.transform = 'scale(1.5)';
            heart.style.opacity = '0';
            setTimeout(() => heart.remove(), 200);

            // Extra effect
            createMiniExplosion(heart);
        });

        gameArea.appendChild(heart);

        setTimeout(() => {
            if (heart.parentNode) heart.remove();
        }, 4000);
    }, 500);

    // Close button
    document.getElementById('closeGame')?.addEventListener('click', () => {
        clearInterval(timerInterval);
        clearInterval(spawnInterval);
        overlay.remove();
    });

    // Add game animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes heartFallGame {
            to { top: 100%; }
        }
    `;
    document.head.appendChild(style);
}

function createMiniExplosion(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '✨';
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 15px;
            pointer-events: none;
            z-index: 10001;
        `;

        const angle = (Math.PI * 2 * i) / 5;
        const vx = Math.cos(angle) * 50;
        const vy = Math.sin(angle) * 50;

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
        ], { duration: 500, easing: 'ease-out' });

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 500);
    }
}

function showGameResult(score) {
    const messages = [
        { min: 0, max: 10, text: "Cố gắng lên công chúa ơi! 💪" },
        { min: 11, max: 25, text: "Khá lắm! Em bắt trái tim anh rồi đó! 💕" },
        { min: 26, max: 40, text: "Tuyệt vời! Em thật giỏi! 🌟" },
        { min: 41, max: 100, text: "Amazing! Em là người bắt trái tim giỏi nhất! 👑" }
    ];

    const message = messages.find(m => score >= m.min && score <= m.max)?.text || "Xuất sắc!";

    alert(`🎮 Kết quả: ${score} trái tim!\n\n${message}`);
}

// Wish Jar
function initWishJar() {
    document.getElementById('wishJar')?.querySelector('.game-btn')?.addEventListener('click', () => {
        const wish = prompt("Viết một điều ước cho tình yêu của chúng mình:");
        if (wish) {
            // Save to localStorage
            const wishes = JSON.parse(localStorage.getItem('loveWishes') || '[]');
            wishes.push({
                text: wish,
                date: new Date().toISOString()
            });
            localStorage.setItem('loveWishes', JSON.stringify(wishes));

            alert("✨ Điều ước đã được thả vào bình ước nguyện! ✨\n\nCảm ơn em đã ước nguyện cho tình yêu của chúng mình! 💕");
            createConfetti();
        }
    });
}

// ==========================================
// MEMORY MATCH GAME
// ==========================================

function initMemoryGame() {
    document.getElementById('memoryGame')?.querySelector('.game-btn')?.addEventListener('click', () => {
        startMemoryGame();
    });
}

function startMemoryGame() {
    const emojis = ['💖', '💕', '💗', '💘', '💝', '❤️', '💓', '💞'];
    const cards = [...emojis, ...emojis]; // Duplicate for pairs

    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;

    // Create game overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';
    overlay.innerHTML = `
        <div class="game-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 500px; padding: 20px; color: white;">
            <div class="game-moves" style="font-size: 1.2rem;">Moves: <span id="gameMoves">0</span></div>
            <h2 style="font-family: 'Dancing Script', cursive; font-size: 1.8rem;">💕 Ghép Đôi Ký Ức 💕</h2>
            <button class="game-close" id="closeMemory" style="background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">✕</button>
        </div>
        <div class="memory-grid" id="memoryGrid" style="
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            max-width: 500px;
            padding: 20px;
        "></div>
    `;

    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(26, 26, 46, 0.98), rgba(22, 33, 62, 0.98));
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    document.body.appendChild(overlay);

    const grid = document.getElementById('memoryGrid');

    // Create cards
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.innerHTML = `
            <div class="card-inner" style="
                width: 80px;
                height: 80px;
                position: relative;
                transform-style: preserve-3d;
                transition: transform 0.5s;
            ">
                <div class="card-front" style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    background: linear-gradient(135deg, #FF6B6B, #E75480);
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                ">❓</div>
                <div class="card-back" style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    transform: rotateY(180deg);
                    background: linear-gradient(135deg, #fff, #FFE4E1);
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                ">${emoji}</div>
            </div>
        `;
        card.style.cssText = `cursor: pointer;`;

        card.addEventListener('click', () => {
            if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;

            // Flip card
            card.classList.add('flipped');
            card.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                canFlip = false;
                moves++;
                document.getElementById('gameMoves').textContent = moves;

                const [card1, card2] = flippedCards;

                if (card1.dataset.emoji === card2.dataset.emoji) {
                    // Match!
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matchedPairs++;
                    flippedCards = [];
                    canFlip = true;

                    // Add glow effect
                    card1.style.boxShadow = '0 0 20px #FFD700';
                    card2.style.boxShadow = '0 0 20px #FFD700';

                    if (matchedPairs === emojis.length) {
                        // Win!
                        setTimeout(() => {
                            showMemoryResult(moves);
                            overlay.remove();
                        }, 500);
                    }
                } else {
                    // No match - flip back
                    setTimeout(() => {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                        card1.querySelector('.card-inner').style.transform = '';
                        card2.querySelector('.card-inner').style.transform = '';
                        flippedCards = [];
                        canFlip = true;
                    }, 1000);
                }
            }
        });

        grid.appendChild(card);
    });

    // Close button
    document.getElementById('closeMemory')?.addEventListener('click', () => {
        overlay.remove();
    });
}

function showMemoryResult(moves) {
    let message = '';
    if (moves <= 12) {
        message = "🏆 Trí nhớ tuyệt vời! Em là thiên tài! 🌟";
    } else if (moves <= 18) {
        message = "💖 Giỏi lắm! Em nhớ rất tốt đó! 💕";
    } else if (moves <= 25) {
        message = "😊 Khá tốt! Cố gắng thêm chút nữa nha! 💪";
    } else {
        message = "💕 Cố gắng lên! Lần sau sẽ tốt hơn! 🌟";
    }

    alert(`🎮 Hoàn thành!\n\nSố lượt: ${moves}\n\n${message}`);
    createConfetti();
}

// ==========================================
// LOVE QUIZ GAME
// ==========================================

function initLoveQuiz() {
    document.getElementById('loveQuiz')?.querySelector('.game-btn')?.addEventListener('click', () => {
        startLoveQuiz();
    });
}

const quizQuestions = [
    {
        question: "Ngày tỏ tình của chúng mình là ngày nào?",
        options: ["23/03/2025", "28/02/2025", "06/03/2025", "08/02/2025"],
        correct: 0
    },
    {
        question: "Anh gọi em bằng nickname nào?",
        options: ["Bé yêu", "Công chúa iuu", "Em gái", "Honey"],
        correct: 1
    },
    {
        question: "Lần hẹn hò đầu tiên của chúng mình là ngày nào?",
        options: ["08/02/2025", "28/02/2025", "06/03/2025", "23/03/2025"],
        correct: 2
    },
    {
        question: "Ai là người nhắn tin trước?",
        options: ["Anh Bằng", "Em Duyên", "Cả hai cùng lúc", "Không nhớ"],
        correct: 1
    },
    {
        question: "Anh thường nói gì với em mỗi ngày?",
        options: ["Hello", "Chào em", "Iuu em", "Hi bé"],
        correct: 2
    },
    {
        question: "Tình yêu của anh dành cho em như thế nào?",
        options: ["Hữu hạn", "Bình thường", "Vô hạnnnnn", "Không biết"],
        correct: 2
    },
    {
        question: "Em sinh nhật vào ngày nào?",
        options: ["08/10", "28/10", "10/08", "18/10"],
        correct: 0
    },
    {
        question: "Anh sinh nhật vào ngày nào?",
        options: ["18/10", "08/10", "28/10", "28/09"],
        correct: 2
    },
    {
        question: "Ai rời đi trước sẽ bị gì?",
        options: ["Không sao", "Búng 3 cái nơi trán", "Phạt tiền", "Không nói chuyện"],
        correct: 1
    },
    {
        question: "300 ngày yêu nhau kỷ niệm ngày nào?",
        options: ["17/01/2026", "23/01/2026", "01/01/2026", "17/02/2026"],
        correct: 0
    }
];

function startLoveQuiz() {
    let currentQuestion = 0;
    let score = 0;

    // Shuffle questions and pick 5
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 5);

    const overlay = document.createElement('div');
    overlay.className = 'quiz-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(26, 26, 46, 0.98), rgba(22, 33, 62, 0.98));
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    document.body.appendChild(overlay);

    function renderQuestion() {
        const q = shuffled[currentQuestion];
        overlay.innerHTML = `
            <div style="max-width: 600px; width: 100%; text-align: center;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <span style="color: rgba(255,255,255,0.7);">Câu ${currentQuestion + 1}/${shuffled.length}</span>
                    <h2 style="font-family: 'Dancing Script', cursive; font-size: 2rem; color: white;">💕 Quiz Tình Yêu 💕</h2>
                    <button id="closeQuiz" style="background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">✕</button>
                </div>
                
                <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; margin-bottom: 30px;">
                    <h3 style="color: white; font-size: 1.3rem; margin-bottom: 30px; line-height: 1.6;">${q.question}</h3>
                    
                    <div style="display: grid; gap: 15px;">
                        ${q.options.map((opt, i) => `
                            <button class="quiz-option" data-index="${i}" style="
                                padding: 15px 25px;
                                background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
                                border: 2px solid rgba(255,255,255,0.2);
                                border-radius: 15px;
                                color: white;
                                font-size: 1.1rem;
                                cursor: pointer;
                                transition: all 0.3s;
                            ">${opt}</button>
                        `).join('')}
                    </div>
                </div>
                
                <div style="display: flex; justify-content: center; gap: 10px;">
                    ${shuffled.map((_, i) => `
                        <div style="
                            width: 12px;
                            height: 12px;
                            border-radius: 50%;
                            background: ${i === currentQuestion ? 'linear-gradient(135deg, #FF6B6B, #E75480)' : 'rgba(255,255,255,0.3)'};
                        "></div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add hover effects
        overlay.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'linear-gradient(135deg, rgba(255,107,107,0.3), rgba(231,84,128,0.3))';
                btn.style.borderColor = '#FF6B6B';
                btn.style.transform = 'scale(1.02)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))';
                btn.style.borderColor = 'rgba(255,255,255,0.2)';
                btn.style.transform = 'scale(1)';
            });

            btn.addEventListener('click', () => {
                const selected = parseInt(btn.dataset.index);

                // Show correct/wrong
                overlay.querySelectorAll('.quiz-option').forEach((b, i) => {
                    if (i === q.correct) {
                        b.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';
                        b.style.borderColor = '#4CAF50';
                    } else if (i === selected && selected !== q.correct) {
                        b.style.background = 'linear-gradient(135deg, #f44336, #e91e63)';
                        b.style.borderColor = '#f44336';
                    }
                    b.style.pointerEvents = 'none';
                });

                if (selected === q.correct) {
                    score++;
                }

                setTimeout(() => {
                    currentQuestion++;
                    if (currentQuestion < shuffled.length) {
                        renderQuestion();
                    } else {
                        showQuizResult(score, shuffled.length);
                        overlay.remove();
                    }
                }, 1500);
            });
        });

        // Close button
        document.getElementById('closeQuiz')?.addEventListener('click', () => {
            overlay.remove();
        });
    }

    renderQuestion();
}

function showQuizResult(score, total) {
    let message = '';
    const percentage = (score / total) * 100;

    if (percentage === 100) {
        message = "🏆 HOÀN HẢO! Em hiểu anh 100%! Em là soulmate của anh! 💕";
    } else if (percentage >= 80) {
        message = "💖 Tuyệt vời! Em hiểu anh rất rõ! Anh iuu em! 😍";
    } else if (percentage >= 60) {
        message = "💕 Khá tốt! Em biết khá nhiều về chúng mình đó! 😊";
    } else if (percentage >= 40) {
        message = "😊 Cố gắng thêm nhé! Còn nhiều điều để tìm hiểu! 💪";
    } else {
        message = "💔 Anh buồn rồi... nhưng không sao, chúng mình sẽ tìm hiểu thêm! 😢💕";
    }

    alert(`💕 Kết Quả Quiz Tình Yêu 💕\n\nĐúng: ${score}/${total} câu (${percentage}%)\n\n${message}`);

    if (percentage >= 80) {
        createConfetti();
        createHeartRain();
    }
}

// ==========================================
// MUSIC PLAYER
// ==========================================

function initMusicPlayer() {
    const audio = document.getElementById('bgMusic');
    const toggleBtn = document.getElementById('musicToggle');

    if (!audio || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(() => {
                console.log('Audio autoplay blocked');
            });
            toggleBtn.classList.add('playing');
            toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            toggleBtn.classList.remove('playing');
            toggleBtn.innerHTML = '<i class="fas fa-music"></i>';
        }
    });
}

// ==========================================
// LYRICS CAROUSEL
// ==========================================

function initLyricsCarousel() {
    const track = document.getElementById('lyricsTrack');
    const dotsContainer = document.getElementById('lyricsDots');
    const prevBtn = document.getElementById('prevLyrics');
    const nextBtn = document.getElementById('nextLyrics');

    if (!track || !dotsContainer) return;

    const cards = track.querySelectorAll('.lyrics-card');
    const totalCards = cards.length;
    let currentIndex = 0;
    let autoPlayInterval;

    // Create dots
    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('div');
        dot.className = `lyrics-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    function updateDots() {
        dotsContainer.querySelectorAll('.lyrics-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex < 0) currentIndex = totalCards - 1;
        if (currentIndex >= totalCards) currentIndex = 0;

        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    // Navigation
    prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }
    });

    // Autoplay
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 6000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Start autoplay
    startAutoPlay();

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
}

// ==========================================
// FLOATING ACTION BUTTONS
// ==========================================

function initFloatingButtons() {
    document.getElementById('heartRainBtn')?.addEventListener('click', createHeartRain);
    document.getElementById('fireworksBtn')?.addEventListener('click', createFireworks);
    document.getElementById('confettiBtn')?.addEventListener('click', createConfetti);

    document.getElementById('screenshotBtn')?.addEventListener('click', () => {
        alert('💡 Mẹo: Nhấn Ctrl + Shift + S (Windows) hoặc Cmd + Shift + 4 (Mac) để chụp màn hình!');
    });
}

// ==========================================
// MODAL HANDLERS
// ==========================================

function initModals() {
    // Image modal
    document.getElementById('modalClose')?.addEventListener('click', closeImageModal);
    document.getElementById('imageModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'imageModal') closeImageModal();
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

// ==========================================
// EASTER EGGS
// ==========================================

function initEasterEggs() {
    // Konami code
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Easter egg activated!
                activateRainbowMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Triple click on 300
    const badge = document.querySelector('.milestone-badge');
    let clickCount = 0;

    badge?.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 3) {
            createFireworks();
            createConfetti();
            createHeartRain();
            clickCount = 0;
        }
        setTimeout(() => clickCount = 0, 500);
    });
}

function activateRainbowMode() {
    document.body.style.animation = 'rainbowBg 5s linear infinite';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbowBg {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    createFireworks();
    createConfetti();
    createHeartRain();

    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 10000);
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async function () {
    // Super fast loading!
    for (let i = 0; i <= 100; i += 25) {
        updateLoadingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Initialize Three.js
    initThreeJS();

    // Initialize components
    initGalaxyGallery();
    initQuotesCarousel();
    initLyricsCarousel();
    initEnvelope();
    initPromises();
    initCounterAnimations();
    initScrollAnimations();
    initMusicPlayer();
    initFloatingButtons();
    initModals();
    initHeartCatchGame();
    initWishJar();
    initMemoryGame();
    initLoveQuiz();
    initEasterEggs();

    // Hide loading screen
    setTimeout(hideLoadingScreen, 500);

    // Initial celebration
    setTimeout(() => {
        createConfetti();
    }, 2000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (galaxyAnimationId) {
        cancelAnimationFrame(galaxyAnimationId);
    }
});
