// Local Wolf Table TypeScript wrapper
declare global {
    interface Window {
        WolfTable: any;
        Table: any;
    }
}

export interface WolfTableConfig {
    scrollable?: boolean;
    resizable?: boolean;
    selectable?: boolean;
    editable?: boolean;
    copyable?: boolean;
}

export interface WolfTableStyle {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    wrap?: boolean;
    border?: any;
    padding?: number;
    lineHeight?: number;
    whiteSpace?: string;
}

export interface WolfTableCell {
    value?: any;
    formula?: string;
    style?: number;
}

let WolfTable: any = null;
let isLoading = false;
let isLoaded = false;

export const loadWolfTable = (): Promise<any> => {
    if (typeof window === 'undefined') {
        return Promise.reject('Window not available (SSR)');
    }

    if (isLoaded && WolfTable) {
        return Promise.resolve(WolfTable);
    }

    if (isLoading) {
        return new Promise((resolve) => {
            const checkLoaded = () => {
                if (isLoaded && WolfTable) {
                    resolve(WolfTable);
                } else {
                    setTimeout(checkLoaded, 100);
                }
            };
            checkLoaded();
        });
    }

    isLoading = true;

    return new Promise((resolve, reject) => {
        // Check if already loaded globally
        const wolf = (window as any).wolf;
        if (wolf?.table) {
            WolfTable = wolf.table;
            isLoaded = true;
            isLoading = false;
            resolve(WolfTable);
            return;
        }

        // Load CSS first
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = '/lib/table.min.css';
        
        cssLink.onload = () => {
            // Load the browser-compatible wrapper
            const script = document.createElement('script');
            script.src = '/lib/wolf-table-browser.js';
            
            // Listen for the custom event that indicates Wolf Table is ready
            const handleWolfTableReady = () => {
                const wolf = (window as any).wolf;
                WolfTable = wolf?.table;
                
                console.log('🔍 Wolf object found:', wolf);
                console.log('🔍 Wolf Table constructor:', WolfTable);
                
                if (WolfTable) {
                    isLoaded = true;
                    isLoading = false;
                    console.log('✅ Wolf Table loaded successfully from local files');
                    resolve(WolfTable);
                } else {
                    isLoading = false;
                    console.log('❌ Wolf Table constructor not found in window.wolf.table');
                    reject(new Error('Wolf Table not found at window.wolf.table after loading script'));
                }
                
                // Clean up event listener
                window.removeEventListener('wolfTableReady', handleWolfTableReady);
            };
            
            window.addEventListener('wolfTableReady', handleWolfTableReady);
            
            script.onerror = () => {
                isLoading = false;
                window.removeEventListener('wolfTableReady', handleWolfTableReady);
                reject(new Error('Failed to load Wolf Table browser wrapper'));
            };
            
            document.head.appendChild(script);
        };
        
        cssLink.onerror = () => {
            isLoading = false;
            reject(new Error('Failed to load Wolf Table CSS'));
        };
        
        document.head.appendChild(cssLink);
    });
};

export const getWolfTable = () => WolfTable;
export const isWolfTableLoaded = () => isLoaded;

export default {
    loadWolfTable,
    getWolfTable,
    isWolfTableLoaded
};
