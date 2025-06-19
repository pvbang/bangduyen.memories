/**
 * Authentication Guard for Bang & Duyen Memories Website
 * This script protects all pages except index.html
 * Checks if user is authenticated and redirects to login if not
 */

(function() {
    'use strict';
    
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
    }
    
    // Function to redirect to login page
    function redirectToLogin() {
        // Show a loading message before redirect
        document.body.innerHTML = `
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
                z-index: 9999;
                font-family: 'Poppins', sans-serif;
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.95);
                    padding: 40px;
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(255, 182, 193, 0.3);
                    text-align: center;
                    backdrop-filter: blur(20px);
                ">
                    <i class="fas fa-heart" style="
                        font-size: 48px;
                        color: #ff69b4;
                        animation: heartbeat 1s infinite;
                        margin-bottom: 20px;
                        display: block;
                    "></i>
                    <h2 style="
                        color: #e91e63;
                        margin-bottom: 10px;
                        font-size: 24px;
                    ">Phiên đăng nhập đã hết hạn</h2>
                    <p style="
                        color: #666;
                        margin-bottom: 20px;
                    ">Đang chuyển hướng về trang đăng nhập...</p>
                    <div style="
                        width: 20px;
                        height: 20px;
                        border: 2px solid #ff69b4;
                        border-top: 2px solid transparent;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto;
                    "></div>
                </div>
            </div>
            <style>
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
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
    });
    
    // Check authentication immediately when script loads
    if (checkAuthentication()) {
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
    }
    
    // Expose functions to global scope for use in other scripts
    window.AuthGuard = {
        checkAuthentication: checkAuthentication,
        getRemainingTime: getRemainingTime,
        refreshAuthentication: refreshAuthentication,
        logout: logout
    };
})();
