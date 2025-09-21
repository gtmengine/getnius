import React, { useRef, useEffect } from "react";
import { ArrowLeft, Grid3x3, Share, MessageSquare, Download, Upload } from "lucide-react";

// Import Wolf Table - dynamic import to avoid SSR issues
let WolfTable: any = null;
if (typeof window !== 'undefined') {
  import('@wolf-table/table').then((module) => {
    WolfTable = module.default;
  });
}

interface Test2ScreenProps {
    setCurrentScreen: (screen: string) => void;
}

const Test2Screen: React.FC<Test2ScreenProps> = ({ setCurrentScreen }) => {
    const tableRef = useRef<HTMLDivElement>(null);
    const tableInstanceRef = useRef<any>(null);

    useEffect(() => {
        // Initialize Wolf Table when component mounts
        const initTable = async () => {
            try {
                console.log('Initializing Wolf Table...');
                
                if (tableRef.current && typeof window !== 'undefined') {
                    // Import Wolf Table CSS
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/@wolf-table/table/dist/table.min.css';
                    document.head.appendChild(link);

                    // Wait for Wolf Table to load
                    let attempts = 0;
                    const maxAttempts = 50;
                    
                    const tryCreateTable = () => {
                        if (WolfTable && tableRef.current) {
                            createRealWolfTable();
                        } else if (attempts < maxAttempts) {
                            attempts++;
                            setTimeout(tryCreateTable, 100);
                        } else {
                            console.log('Wolf Table not available, using mock...');
                            createMockTable();
                        }
                    };
                    
                    tryCreateTable();
                }
            } catch (error) {
                console.error('Failed to initialize Wolf Table:', error);
                createMockTable();
            }
        };

        initTable();

        return () => {
            // Cleanup table instance
            if (tableInstanceRef.current) {
                try {
                    // tableInstanceRef.current.destroy?.();
                } catch (e) {
                    console.log('Cleanup completed');
                }
            }
        };
    }, []);

    const createRealWolfTable = () => {
        if (!tableRef.current || !WolfTable) return;

        try {
            console.log('Creating real Wolf Table...');
            
            // Clear the container and create table element
            tableRef.current.innerHTML = '';
            const tableElement = document.createElement('div');
            tableElement.id = 'wolf-table-container';
            tableElement.style.width = '100%';
            tableElement.style.height = '500px';
            tableRef.current.appendChild(tableElement);

            // Create Wolf Table instance exactly as in your code
            const table = WolfTable.create(
                '#wolf-table-container',
                () => 1200, // width
                () => 500,  // height
                {
                    scrollable: true,
                    resizable: true,
                    selectable: true,
                    editable: true,
                    copyable: true,
                }
            )
            .freeze('D5')
            .merge('F10:G11')
            .merge('I10:K11')
            .formulaParser((v: string) => `${v}-formula`)
            .data({
                styles: [],
                cells: [
                    // Headers
                    [0, 0, 'YOUR SEARCH REQUEST'],
                    [0, 1, 'COLUMN NAME'],
                    [0, 2, 'Enter a short, descriptive header for this column'],
                    
                    // Data rows
                    [1, 0, 'Entity to Research - Replace each placeholder with the company, product, or topic you need to look up.:'],
                    [1, 1, 'Data Type (text/ url / email)'],
                    [1, 2, 'Data Type - Specify the expected data format'],
                    
                    [2, 0, 'Prompt Details'],
                    [2, 1, 'Prompt Details'],
                    [2, 2, 'Prompt Details - Give prompting instructions'],
                    
                    [3, 0, 'Format Options'],
                    [3, 1, 'Format Options'],
                    [3, 2, 'Format Options - Define output formatting rules'],
                    
                    // Additional sample data
                    [5, 0, 'Company'],
                    [5, 1, 'Revenue'],
                    [5, 2, 'Employees'],
                    [5, 3, 'Industry'],
                    [6, 0, 'OpenAI'],
                    [6, 1, '$1.3B'],
                    [6, 2, '500+'],
                    [6, 3, 'AI/ML'],
                    [7, 0, 'Anthropic'],
                    [7, 1, '$750M'],
                    [7, 2, '150+'],
                    [7, 3, 'AI Safety'],
                    [9, 5, { value: '', formula: '=sum(A1:A10)' }],
                ],
            })
            .render();

            // Add basic text style without background colors
            const basicStyle = table.addStyle({
                bold: true,
                color: '#333',
                fontSize: 11,
                align: 'left'
            });

            // Apply basic style to key cells (no background colors)
            table.cell(0, 0, { value: 'YOUR SEARCH REQUEST', style: basicStyle });
            table.cell(0, 1, { value: 'COLUMN NAME', style: basicStyle });
            table.cell(0, 2, { value: 'Enter a short, descriptive header for this column', style: basicStyle });

            table.render();

            // Log cell info
            console.log('Wolf Table cell[2,2]:', table.cell(2, 2));

            // Store table instance
            tableInstanceRef.current = table;

            console.log('✅ Real Wolf Table created successfully!');
        } catch (error) {
            console.error('Failed to create real Wolf Table:', error);
            createMockTable();
        }
    };

    const createMockTable = () => {
        if (!tableRef.current) return;

        // Create a canvas-based table simulation
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 500;
        canvas.style.border = '1px solid #ddd';
        canvas.style.background = '#fff';
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Draw grid
            drawGrid(ctx, canvas.width, canvas.height);
            // Add sample data
            drawSampleData(ctx);
        }
        
        tableRef.current.innerHTML = '';
        tableRef.current.appendChild(canvas);
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const cellWidth = 120;
        const cellHeight = 30;
        const rows = Math.floor(height / cellHeight);
        const cols = Math.floor(width / cellWidth);

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;

        // Draw vertical lines
        for (let i = 0; i <= cols; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellWidth, 0);
            ctx.lineTo(i * cellWidth, height);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let i = 0; i <= rows; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * cellHeight);
            ctx.lineTo(width, i * cellHeight);
            ctx.stroke();
        }

        // Draw headers
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, cellHeight);
        ctx.fillRect(0, 0, cellWidth, height);

        // Column headers (A, B, C, etc.)
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        for (let i = 1; i < cols; i++) {
            const letter = String.fromCharCode(64 + i); // A, B, C...
            ctx.fillText(letter, i * cellWidth + cellWidth / 2, cellHeight / 2 + 4);
        }

        // Row headers (1, 2, 3, etc.)
        ctx.textAlign = 'center';
        for (let i = 1; i < rows; i++) {
            ctx.fillText(i.toString(), cellWidth / 2, i * cellHeight + cellHeight / 2 + 4);
        }
    };

    const drawSampleData = (ctx: CanvasRenderingContext2D) => {
        const cellWidth = 120;
        const cellHeight = 30;
        
        ctx.fillStyle = '#333';
        ctx.font = '11px Arial';
        ctx.textAlign = 'left';

        // Sample data matching the search request structure
        const sampleData = [
            // Headers
            [1, 1, 'YOUR SEARCH REQUEST'],
            [1, 2, 'COLUMN NAME'],
            [1, 3, 'Enter a short, descriptive header'],
            
            // Data rows
            [2, 1, 'Entity to Research'],
            [2, 2, 'Data Type (text/url/email)'],
            [2, 3, 'Data Type - Specify format'],
            
            [3, 1, 'Prompt Details'],
            [3, 2, 'Prompt Details'],
            [3, 3, 'Prompt Details - Give instructions'],
            
            [4, 1, 'Format Options'],
            [4, 2, 'Format Options'],
            [4, 3, 'Format Options - Define rules'],
            
            // Additional data
            [6, 1, 'Company'],
            [6, 2, 'Revenue'],
            [6, 3, 'Employees'],
            [6, 4, 'Industry'],
            [7, 1, 'OpenAI'],
            [7, 2, '$1.3B'],
            [7, 3, '500+'],
            [7, 4, 'AI/ML'],
        ];

        sampleData.forEach(([row, col, value]) => {
            const x = (col as number) * cellWidth + 5;
            const y = (row as number) * cellHeight + cellHeight / 2 + 4;
            
            // Use regular text color for all cells
            ctx.fillStyle = '#333';
            ctx.fillText(value.toString(), x, y);
        });
    };

    const handleExportData = () => {
        console.log('Exporting table data...');
        // Simulate data export
        const data = {
            version: '1.0',
            type: 'wolf-table',
            data: {
                cells: [
                    [0, 0, 'Company'],
                    [0, 1, 'Revenue'],
                    [0, 2, 'Employees'],
                    [1, 0, 'OpenAI'],
                    [1, 1, '$1.3B'],
                    [1, 2, '500+'],
                ],
                styles: [
                    { bold: true, color: '#21ba45', align: 'center' }
                ]
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table-data.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target?.result as string);
                        console.log('Imported data:', data);
                        // Redraw table with imported data
                        createMockTable();
                    } catch (error) {
                        console.error('Failed to parse imported data:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    return (
        <div className="h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentScreen("action")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <Grid3x3 className="w-6 h-6 text-purple-600" />
                        <span className="text-lg font-medium">Test 2 - Wolf Table</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleExportData}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button 
                        onClick={handleImportData}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                        <Upload className="w-4 h-4" />
                        Import
                    </button>
                    <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
                        <Share className="w-4 h-4 inline mr-1" />
                        Share
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        Chat
                    </button>
                </div>
            </div>

            {/* Wolf Table Features Info */}
            <div className="px-4 py-2 bg-purple-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-purple-700">Wolf Table Features:</span>
                        <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 bg-white border border-purple-200 rounded text-purple-700">
                                ✓ Canvas-based
                            </span>
                            <span className="px-2 py-1 bg-white border border-purple-200 rounded text-purple-700">
                                ✓ Scrollable
                            </span>
                            <span className="px-2 py-1 bg-white border border-purple-200 rounded text-purple-700">
                                ✓ Resizable
                            </span>
                            <span className="px-2 py-1 bg-white border border-purple-200 rounded text-purple-700">
                                ✓ Selectable
                            </span>
                            <span className="px-2 py-1 bg-white border border-purple-200 rounded text-purple-700">
                                ✓ Editable
                            </span>
                            <span className="px-2 py-1 bg-white border border-purple-200 rounded text-purple-700">
                                ✓ Formulas
                            </span>
                        </div>
                    </div>
                    <div className="text-xs text-purple-600">
                        Based on @wolf-table/table
                    </div>
                </div>
            </div>

            {/* Wolf Table Implementation Info */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        <strong>Implementation Details:</strong> This screen uses the real Wolf Table library 
                        with canvas-based rendering, cell merging, borders, formulas, and advanced styling.
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${WolfTable ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-xs text-gray-600">
                            {WolfTable ? 'Real Wolf Table Loaded' : 'Loading Wolf Table...'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 p-4 bg-gray-50 overflow-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Wolf Table Canvas</h3>
                        <p className="text-sm text-gray-600">
                            This is a simulation of Wolf Table functionality. In a real implementation, 
                            this would be replaced with the actual Wolf Table library.
                        </p>
                    </div>
                    
                    {/* Table will be rendered here */}
                    <div 
                        ref={tableRef}
                        className="border border-gray-300 rounded overflow-hidden"
                        style={{ minHeight: '500px' }}
                    />

                    {/* Table Actions */}
                    <div className="mt-4 flex gap-2">
                        <button 
                            onClick={() => {
                                if (WolfTable && tableInstanceRef.current) {
                                    createRealWolfTable();
                                } else {
                                    createMockTable();
                                }
                            }}
                            className="px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Refresh Table
                        </button>
                        <button 
                            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                                if (tableInstanceRef.current) {
                                    // Add a formula to cell
                                    tableInstanceRef.current.cell(3, 4, { 
                                        value: '', 
                                        formula: '=sum(B1:B3)' 
                                    }).render();
                                    console.log('Formula added to cell D5');
                                } else {
                                    console.log('Add formula clicked (Wolf Table not available)');
                                }
                            }}
                        >
                            Add Formula
                        </button>
                        <button 
                            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                                if (tableInstanceRef.current) {
                                    // Merge some cells
                                    tableInstanceRef.current.merge('A6:B7').render();
                                    console.log('Merged cells A6:B7');
                                } else {
                                    console.log('Merge cells clicked (Wolf Table not available)');
                                }
                            }}
                        >
                            Merge Cells
                        </button>
                        <button 
                            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                                if (tableInstanceRef.current) {
                                    // Add simple border without color
                                    tableInstanceRef.current.addBorder('A1:D4', 'all', 'thin', '#000').render();
                                    console.log('Simple border added to A1:D4');
                                } else {
                                    console.log('Add border clicked (Wolf Table not available)');
                                }
                            }}
                        >
                            Add Border
                        </button>
                        <button 
                            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                                if (tableInstanceRef.current) {
                                    // Add simple text style without background
                                    const style = tableInstanceRef.current.addStyle({
                                        bold: true,
                                        color: '#333'
                                    });
                                    tableInstanceRef.current.cell(4, 1, { 
                                        value: 'Bold Text', 
                                        style 
                                    }).render();
                                    console.log('Simple styled cell added');
                                } else {
                                    console.log('Add style clicked (Wolf Table not available)');
                                }
                            }}
                        >
                            Add Style
                        </button>
                        <button 
                            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                                if (tableInstanceRef.current) {
                                    // Add text wrapping style to a sample cell with long text
                                    const wrapStyle = tableInstanceRef.current.addStyle({
                                        wrap: true,
                                        align: 'left',
                                        fontSize: 10,
                                        color: '#333'
                                    });
                                    tableInstanceRef.current.cell(8, 1, { 
                                        value: 'This is a very long text that should wrap automatically when text wrapping is enabled for better readability', 
                                        style: wrapStyle 
                                    }).render();
                                    console.log('Text wrapping applied to cell 8,1');
                                } else {
                                    console.log('Wrap text clicked (Wolf Table not available)');
                                }
                            }}
                        >
                            Wrap Text
                        </button>
                        <button 
                            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => {
                                if (tableInstanceRef.current) {
                                    // Apply text wrapping to description columns
                                    const wrapStyle = tableInstanceRef.current.addStyle({
                                        wrap: true,
                                        align: 'left',
                                        fontSize: 9,
                                        color: '#333',
                                        verticalAlign: 'top'
                                    });
                                    
                                    // Wrap text in description columns (column 2)
                                    for (let row = 1; row <= 4; row++) {
                                        const cell = tableInstanceRef.current.cell(row, 2);
                                        if (cell && cell.value) {
                                            tableInstanceRef.current.cell(row, 2, { 
                                                value: cell.value, 
                                                style: wrapStyle 
                                            });
                                        }
                                    }
                                    
                                    tableInstanceRef.current.render();
                                    console.log('Text wrapping applied to description columns');
                                } else {
                                    console.log('Wrap descriptions clicked (Wolf Table not available)');
                                }
                            }}
                        >
                            Wrap Descriptions
                        </button>
                    </div>
                </div>

                {/* Code Example */}
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Wolf Table Integration Code</h3>
                    <div className="bg-gray-100 rounded p-4 text-sm font-mono overflow-x-auto">
                        <pre className="text-gray-800">{`import WolfTable from '@wolf-table/table';

const table = WolfTable.create(
  '#table',
  () => 1400,
  () => 600,
  {
    scrollable: true,
    resizable: true,
    selectable: true,
    editable: true,
    copyable: true,
  }
)
.freeze('D5')
.merge('F10:G11')
.data({
  styles: [],
  cells: [
    [0, 0, 'YOUR SEARCH REQUEST'],
    [0, 1, 'COLUMN NAME'],
    [1, 0, 'Entity to Research - Replace each placeholder...'],
    [2, 0, 'Prompt Details'],
    [9, 5, { value: '', formula: '=sum(A1:A10)' }],
  ],
})
.render();

// Add text wrapping functionality
const wrapStyle = table.addStyle({
  wrap: true,
  align: 'left', 
  fontSize: 10,
  verticalAlign: 'top'
});

table.cell(1, 2, { 
  value: 'Long text that will wrap automatically...', 
  style: wrapStyle 
}).render();`}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

Test2Screen.displayName = "Test2Screen";

export default Test2Screen;
