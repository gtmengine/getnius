// Local Wolf Table wrapper
let WolfTable = null;

if (typeof window !== 'undefined') {
    // Load from local files instead of external CDN
    const loadWolfTable = () => {
        return new Promise((resolve, reject) => {
            // Load CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = '/lib/table.min.css';
            cssLink.onload = () => {
                // Load JS
                const script = document.createElement('script');
                script.src = '/lib/table.min.js';
                script.onload = () => {
                    // Wolf Table should now be available globally
                    WolfTable = window.WolfTable || window.Table;
                    resolve(WolfTable);
                };
                script.onerror = reject;
                document.head.appendChild(script);
            };
            cssLink.onerror = reject;
            document.head.appendChild(cssLink);
        });
    };

    // Auto-load when module is imported
    loadWolfTable().catch(console.error);
}

export { WolfTable, loadWolfTable };
export default WolfTable;
