// Browser compatibility wrapper for Wolf Table
(function() {
    // Define CommonJS globals that the Wolf Table library expects
    if (typeof module === 'undefined') {
        window.module = { exports: {} };
    }
    if (typeof exports === 'undefined') {
        window.exports = window.module.exports;
    }
    
    // Load the actual Wolf Table library
    const script = document.createElement('script');
    script.src = '/lib/table.min.js';
    script.onload = function() {
        // After loading, the table should be available at window.wolf.table
        console.log('Wolf Table loaded successfully');
        
        // Clean up the CommonJS globals
        if (window.module && window.module.exports === window.exports) {
            delete window.module;
            delete window.exports;
        }
        
        // Dispatch a custom event to notify that Wolf Table is ready
        window.dispatchEvent(new CustomEvent('wolfTableReady'));
    };
    script.onerror = function() {
        console.error('Failed to load Wolf Table');
    };
    document.head.appendChild(script);
})();

