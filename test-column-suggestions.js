// Simple test for column suggestions
const { getSuggestedColumns, getColumnReason } = require('./lib/column-suggestions.ts');

// Test cases
const testCases = [
  {
    name: "Competitive Analysis",
    context: {
      searchQuery: "competitors of openai",
      selectedCategory: "competitive analysis"
    }
  },
  {
    name: "Investment Research",
    context: {
      searchQuery: "funding rounds series a startups",
      selectedCategory: "investment"
    }
  },
  {
    name: "Technology Stack",
    context: {
      searchQuery: "companies using react and node.js",
      selectedCategory: "technology"
    }
  },
  {
    name: "Recruitment",
    context: {
      searchQuery: "hiring software engineers",
      selectedCategory: "recruitment"
    }
  }
];

console.log("Testing Dynamic Column Suggestions:\n");

testCases.forEach(testCase => {
  console.log(`\n=== ${testCase.name} ===`);
  console.log(`Query: "${testCase.context.searchQuery}"`);
  console.log(`Category: "${testCase.context.selectedCategory}"`);
  
  const suggestions = getSuggestedColumns(testCase.context);
  console.log("Suggested Columns:", suggestions);
  
  suggestions.forEach(column => {
    const reason = getColumnReason(column, testCase.context);
    console.log(`  - ${column}: ${reason}`);
  });
});

console.log("\n✅ Dynamic column suggestions test completed!"); 