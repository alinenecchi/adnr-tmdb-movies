#!/bin/bash

# Run tests with coverage
npm run test:coverage

# Check if there are failed tests
if [ -f "./coverage/test-results.json" ]; then
  FAILED_TESTS=$(node -e "
    const fs = require('fs');
    const results = JSON.parse(fs.readFileSync('./coverage/test-results.json', 'utf8'));
    const failed = results.testResults.filter(r => r.status === 'failed');
    if (failed.length > 0) {
      console.log('\n\n❌ FAILED TESTS SUMMARY:');
      console.log('═══════════════════════════════════════════════════════════');
      failed.forEach(test => {
        console.log(\`\n📁 File: \${test.name}\`);
        test.assertionResults.filter(a => a.status === 'failed').forEach(assertion => {
          console.log(\`  ✗ \${assertion.title}\`);
          if (assertion.failureMessages && assertion.failureMessages.length > 0) {
            console.log(\`    Error: \${assertion.failureMessages[0].split('\\n')[0]}\`);
          }
        });
      });
      console.log('\n═══════════════════════════════════════════════════════════\n');
      process.exit(1);
    }
  ")
  
  if [ $? -ne 0 ]; then
    echo "$FAILED_TESTS"
    exit 1
  fi
fi

