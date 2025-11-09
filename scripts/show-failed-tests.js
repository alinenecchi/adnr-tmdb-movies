const fs = require("fs");
const path = require("path");

const resultsPath = path.join(__dirname, "../coverage/test-results.json");

try {
  if (!fs.existsSync(resultsPath)) {
    console.log("\n⚠️  Test results file not found. Run tests first.\n");
    process.exit(0);
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
  const failed = results.testResults.filter((t) => t.status === "failed");

  console.log("\n" + "=".repeat(60));

  if (failed.length > 0) {
    console.log("❌ FAILED TESTS IN COVERAGE REPORT:");
    console.log("=".repeat(60));

    failed.forEach((test) => {
      const failedTests = test.assertionResults.filter(
        (a) => a.status === "failed"
      );
      if (failedTests.length > 0) {
        const fileName = test.name.replace(process.cwd() + "/", "");
        console.log(`\n📁 ${fileName}`);
        failedTests.forEach((test) => {
          console.log(`  ✗ ${test.title}`);
        });
      }
    });

    console.log("\n" + "=".repeat(60) + "\n");
    process.exit(1);
  } else {
    console.log("✅ ALL TESTS PASSED - NO FAILURES IN COVERAGE REPORT");
    console.log("=".repeat(60) + "\n");
    process.exit(0);
  }
} catch (error) {
  console.log("\n⚠️  Error parsing test results:", error.message);
  console.log("=".repeat(60) + "\n");
  process.exit(0);
}
