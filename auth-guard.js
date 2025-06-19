/**
 * Authentication Guard for Bang & Duyen Memories Website
 * This script protects all pages except index.html
 * Checks if user is authenticated and redirects to login if not
 */

(function() {
    'use strict';
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Skip authentication for index.html (login page)
    if (currentPage === 'index.html') {
        return;
    }
    
    // Hide page content immediately to prevent flash of content
    document.documentElement.style.visibility = 'hidden';
    document.documentElement.style.opacity = '0';
    
    // Add a loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'auth-loading-screen';
    loadingScreen.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #ffeef2 0%, #ffe0e6 50%, #ffd1dc 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            font-family: 'Poppins', sans-serif;
        ">
            <div style="
                text-align: center;
                color: #e91e63;
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid #ff69b4;
                    border-top: 3px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <p style="margin: 0; font-size: 16px;">Đang xác thực...</p>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    // Add loading screen to document immediately
    if (document.head) {
        document.head.appendChild(loadingScreen);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.head.appendChild(loadingScreen);
        });
    }
    
    // Function to check authentication
    function checkAuthentication() {
        const authData = localStorage.getItem('authData');
        
        if (!authData) {
            redirectToLogin();
            return false;
        }
        
        try {
            const data = JSON.parse(authData);
            const currentTime = new Date().getTime();
            
            // Check if authentication is still valid (30 minutes = 1800000 ms)
            if (currentTime - data.timestamp < 1800000) {
                // Authentication is still valid
                return true;
            } else {
                // Authentication expired
                localStorage.removeItem('authData');
                redirectToLogin();
                return false;
            }
        } catch (e) {
            // Invalid data, remove it and redirect
            localStorage.removeItem('authData');
            redirectToLogin();
            return false;
        }
    }    // Function to redirect to login page
    function redirectToLogin() {
        // Use replace to prevent back button issues
        window.location.replace('index.html');
    }
    
    // Function to show authenticated content
    function showAuthenticatedContent() {
        // Remove loading screen
        const loadingScreen = document.getElementById('auth-loading-screen');
        if (loadingScreen) {
            loadingScreen.remove();
        }
        
        // Show page content
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '1';
    }
    
    // Function to get remaining time in minutes
    function getRemainingTime() {
        const authData = localStorage.getItem('authData');
        if (!authData) return 0;
        
        try {
            const data = JSON.parse(authData);
            const currentTime = new Date().getTime();
            const remainingMs = 1800000 - (currentTime - data.timestamp); // 30 minutes in ms
            return Math.max(0, Math.ceil(remainingMs / 60000)); // Convert to minutes
        } catch (e) {
            return 0;
        }
    }
    
    // Function to refresh authentication (extend session)
    function refreshAuthentication() {
        const authData = localStorage.getItem('authData');
        if (authData) {
            try {
                const data = JSON.parse(authData);
                data.timestamp = new Date().getTime(); // Update timestamp
                localStorage.setItem('authData', JSON.stringify(data));
                console.log('Session refreshed successfully');
            } catch (e) {
                console.error('Failed to refresh session');
            }
        }
    }
    
    // Function to logout
    function logout() {
        localStorage.removeItem('authData');
        window.location.href = 'index.html';
    }
    
    // Auto-refresh session on any user activity
    let activityTimer;
    function resetActivityTimer() {
        clearTimeout(activityTimer);
        activityTimer = setTimeout(() => {
            // If user is inactive for 5 minutes, show warning
            if (confirm('Bạn có muốn gia hạn phiên đăng nhập không? Nếu không, bạn sẽ bị đăng xuất sau 1 phút nữa.')) {
                refreshAuthentication();
            }
        }, 1500000); // 25 minutes (5 minutes before expiry)
    }
    
    // Track user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.addEventListener(event, resetActivityTimer, true);
    });    // Check authentication immediately when script loads
    // Use setTimeout to ensure the check happens after DOM is ready
    setTimeout(function() {
        if (checkAuthentication()) {
            // Show page content only if authenticated
            showAuthenticatedContent();
            console.log('User authenticated successfully');
            resetActivityTimer();
            
            // Add logout functionality to any element with class 'logout-btn'
            document.addEventListener('DOMContentLoaded', function() {
                const logoutBtns = document.querySelectorAll('.logout-btn');
                logoutBtns.forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
                            logout();
                        }
                    });
                });
            });
            
            // Periodic check every minute
            setInterval(() => {
                if (!checkAuthentication()) {
                    console.log('Authentication expired during session');
                }
            }, 60000);
        } else {
            // If not authenticated, redirect immediately
            console.log('User not authenticated, redirecting to login');
            redirectToLogin();
        }
    }, 10); // Small delay to ensure DOM is ready
    
    // Expose functions to global scope for use in other scripts
    window.AuthGuard = {
        checkAuthentication: checkAuthentication,
        getRemainingTime: getRemainingTime,
        refreshAuthentication: refreshAuthentication,
        logout: logout
    };
})();
