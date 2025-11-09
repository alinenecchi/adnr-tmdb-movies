const fs = require("fs");
const path = require("path");

const resultsPath = path.join(__dirname, "../coverage/test-results.json");
const htmlPath = path.join(__dirname, "../coverage/index.html");

try {
  if (!fs.existsSync(resultsPath)) {
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
  const failed = results.testResults.filter((t) => t.status === "failed");

  if (failed.length === 0 || !fs.existsSync(htmlPath)) {
    return;
  }

  let html = fs.readFileSync(htmlPath, "utf8");

  // Create failed tests section
  let failedTestsHtml =
    '\n    <div class="pad1" style="background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 4px; margin: 20px 0; padding: 20px;">\n';
  failedTestsHtml +=
    '        <h2 style="color: #856404; margin-top: 0;">❌ Failed Tests</h2>\n';
  failedTestsHtml +=
    '        <div style="background-color: white; padding: 15px; border-radius: 4px;">\n';

  failed.forEach((test) => {
    const failedTests = test.assertionResults.filter(
      (a) => a.status === "failed"
    );
    if (failedTests.length > 0) {
      const fileName = test.name.replace(process.cwd() + "/", "");
      failedTestsHtml += `            <div style="margin-bottom: 15px;">\n`;
      failedTestsHtml += `                <h3 style="color: #856404; margin: 10px 0 5px 0;">📁 ${fileName}</h3>\n`;
      failedTestsHtml +=
        '                <ul style="margin: 5px 0; padding-left: 20px;">\n';
      failedTests.forEach((test) => {
        failedTestsHtml += `                    <li style="color: #721c24; margin: 5px 0;">✗ ${test.title}</li>\n`;
      });
      failedTestsHtml += "                </ul>\n";
      failedTestsHtml += "            </div>\n";
    }
  });

  failedTestsHtml += "        </div>\n";
  failedTestsHtml += "    </div>\n";

  // Insert after the status line
  const statusLineIndex = html.indexOf("<div class='status-line high'></div>");
  if (statusLineIndex !== -1) {
    const insertIndex = html.indexOf("</div>", statusLineIndex) + 6;
    html =
      html.slice(0, insertIndex) + failedTestsHtml + html.slice(insertIndex);
    fs.writeFileSync(htmlPath, html, "utf8");
  }
} catch (error) {
  // Silently fail
}
