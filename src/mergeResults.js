var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
export default class MergeResults {
    constructor(resultPath) {
        this.testDataResults = new Map();
        this.resultPath = resultPath;
    }
    ;
    aggregateResults() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Path is");
            console.log(this.resultPath);
            yield fs.readdirSync(this.resultPath).forEach((file) => __awaiter(this, void 0, void 0, function* () {
                const data = yield fs.readFileSync(`${this.resultPath}/${file}`, 'utf-8');
                const convertMap = new Map(Object.entries(JSON.parse(data)));
                for (const key of convertMap.keys()) {
                    this.testDataResults.set(key, convertMap.get(key));
                }
            }));
        });
    }
    convertMilliToHhMmSsMs(milliseconds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield console.log("The duration is " + milliseconds);
            const hh = Math.floor(milliseconds / 3600000);
            const getMin = Math.floor(milliseconds / 60000);
            const mm = getMin >= 60 ? getMin - 60 : getMin;
            const ss = Math.floor((milliseconds % 60000) / 1000);
            const ms = ((milliseconds / 1000) - Math.floor(milliseconds / 1000)).toFixed(3);
            return `${hh < 10 ? '0' + hh : hh}:${mm < 10 ? '0' + mm : mm}:${ss < 10 ? '0' + ss : ss}` +
                `:${ms.toString().substring(ms.toString().indexOf(".") + 1)}`;
        });
    }
    getPassCount() {
        return __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            for (const key of this.testDataResults.keys()) {
                if (this.testDataResults.get(key).includes('true')) {
                    count++;
                }
            }
            return count;
        });
    }
    getPagesCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const pageCountMap = new Map();
            for (const key of this.testDataResults.keys()) {
                const pageName = key.split("^")[0];
                if (pageCountMap.has(pageName)) {
                    pageCountMap.set(pageName, pageCountMap.get(pageName) + 1);
                }
                else {
                    pageCountMap.set(pageName, 1);
                }
            }
            return pageCountMap;
        });
    }
    getPassCountPerPage(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let passcount = 0;
            for (const key of this.testDataResults.keys()) {
                if (key.includes(page) && this.testDataResults.get(key).includes("true")) {
                    passcount++;
                }
            }
            return passcount;
        });
    }
    getTotalExecutionTime() {
        return __awaiter(this, void 0, void 0, function* () {
            let totalTime = 0;
            for (const key of this.testDataResults.keys()) {
                totalTime = totalTime + Number(this.testDataResults.get(key).split("^")[1]);
            }
            return yield this.convertMilliToHhMmSsMs(totalTime);
        });
    }
    getTotalExecutionTimePerPage(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let totalTime = 0;
            for (const key of this.testDataResults.keys()) {
                console.log("Pages are " + key);
                if (key.includes(page)) {
                    totalTime = totalTime + Number(this.testDataResults.get(key).split("^")[1]);
                }
            }
            return `${totalTime} ms`;
        });
    }
    createEmailBodyHtmlFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let content = `<!DOCTYPE html>`;
            content = `${content}\n<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">`;
            content = `${content}\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">`;
            content = `${content}\n<meta name="x-apple-disable-message-reformatting"><title>Merx-Shopify-Automation</title>`;
            content = `${content}\n<style>\ntable{\nfont-family: Arial, sans-serif;\nwidth: 100%;}\nth{\nborder: 0.5px solid #000000 !important;}\ntd{\nborder: 0.5px solid #000000 !important;}`;
            content = `${content}\n@media screen and (max-width: 700px){\ntable{\nfont-size: 2vw;}\n}\n</style>`;
            content = `${content}\n</head>`;
            content = `${content}\n<body style="margin:0;padding:0;">`;
            yield fs.writeFileSync(`${this.resultPath}/emailBodyReport.html`, content);
        });
    }
    write(content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.writeFileSync(`${this.resultPath}/emailBodyReport.html`, content, { flag: 'a+' });
        });
    }
    insertAggregateTableData(suite, brand) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateTimeIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            let content = `\n<table role="presentation"`;
            content = `${content}\nstyle="border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">`;
            content = `${content}\n<tr style="background:#bfd8cd;">`;
            content = `${content}\n<th align="center" style="padding:0;" colspan="5">\nSuite:${suite}&emsp;Date:${dateTimeIST} IST\n</th>`;
            content = `${content}\n</tr>\n<tr style="background:lightgrey;">`;
            content = `${content}\n<th align="center" style="padding:0;">\nBrand\n</th>`;
            content = `${content}\n<th align="center" style="padding:0;">\nTotal\n</th>`;
            content = `${content}\n<th align="center" style="padding:0;">\nPassed\n</th>`;
            content = `${content}\n<th align="center" style="padding:0;">\nFailed\n</th>`;
            content = `${content}\n<th align="center" style="padding:0;width:40%;">\nExecution Time (hh:mm:ss:ms)\n</th>`;
            content = `${content}\n</tr>\n<tr style="background:lightblue;">`;
            content = `${content}\n<td align="center" style="padding:0;">\n${brand.toUpperCase()}\n</td>`;
            content = `${content}\n<td align="center" style="padding:0;">\n${this.testDataResults.size}\n</td>`;
            content = `${content}\n<td align="center" style="padding:0;background:#33FFF6;">\n${yield this.getPassCount()}\n</td>`;
            content = `${content}\n<td align="center" style="padding:0;background:#FF5E33;">\n${this.testDataResults.size - (yield this.getPassCount())}\n</td>`;
            content = `${content}\n<td align="center" style="padding:0;">\n${yield this.getTotalExecutionTime()}\n</td>`;
            content = `${content}\n</tr>\n</table>\n`;
            yield this.write(content);
        });
    }
    insertIndividualTableData() {
        return __awaiter(this, void 0, void 0, function* () {
            let content = `\n<br><br>\n`;
            content = `${content}<table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">`;
            content = `${content}\n<tr style="background:#bfd8cd;">`;
            content = `${content}\n<th align="center" style="width:25%;">\nPage\n</th>`;
            content = `${content}\n<th align="center" style="width:45%;">\nTest Name\n</th>`;
            content = `${content}\n<th align="center" style="width:10%;">\nResult\n</th>`;
            content = `${content}\n<th align="center" style="width:20%;">\nExecution Time (hh:mm:ss:ms)\n</th>`;
            content = `${content}\n</tr>`;
            const pageCountMap = yield this.getPagesCount();
            let colorCount = 2;
            for (const keyPage of pageCountMap.keys()) {
                const bgColorCode = `${colorCount % 2 === 0 ? 'lightgrey' : 'lightblue'}`;
                content = `${content}\n<tr style="background:${bgColorCode};">`;
                content = `${content}\n<td align="center" style="padding:0;" rowspan="${pageCountMap.get(keyPage)}">\n${keyPage}\n</td>`;
                let rowCount = 1;
                for (const key of this.testDataResults.keys()) {
                    if (key.split("^")[0] === keyPage) {
                        if (rowCount !== 1) {
                            content = `${content}\n<tr style="background:${bgColorCode};">`;
                        }
                        content = `${content}\n<td align="center">\n${key.split("^")[1]}\n</td>`;
                        const result = this.testDataResults.get(key).includes('true');
                        content = `${content}\n<td align="center" style="padding:0;color:${result === true ? 'green' : 'red'}">\n${result === true ? 'Passed' : 'Failed'}\n</td>`;
                        const executionTime = yield this.convertMilliToHhMmSsMs(Number(this.testDataResults.get(key).split("^")[1]));
                        yield console.log("The Execution time is " + executionTime);
                        content = `${content}\n<td align="center">\n${executionTime}\n</td>`;
                        content = `${content}\n</tr>`;
                        rowCount++;
                    }
                }
                colorCount++;
            }
            content = `${content}\n</table>\n</body>\n</html>`;
            yield this.write(content);
        });
    }
    createEmailableReport(envProps) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.aggregateResults();
            yield this.createEmailBodyHtmlFile();
            yield this.insertAggregateTableData("BVT", "FTD");
            yield this.insertIndividualTableData();
            yield this.createRepresentiveReport();
        });
    }
    createRepresentiveReport() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalResults = this.testDataResults.size;
            const passedCount = yield this.getPassCount();
            const failedCount = this.testDataResults.size - passedCount;
            const skippedCount = 0;
            let content = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0">`;
            content = `${content}\n<title>Representable Report</title>`;
            content = `${content}\n<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>`;
            content = `${content}\n<style> @media screen and (max-width: 700px) { body { zoom: 35%; } .metal-text { zoom: 60% !important; } } @media (min-width: 700px) and (max-width: 1200px) { body { zoom: 80%; } } body { margin: 0; padding: 0; font-family: Arial, sans-serif; } .banner { background-color: #3c4619; color: #fff; text-align: center; padding-top: 5px; padding-bottom: 5px; width: 100%; } .logo { width: 8%; height: 8%; padding-top: 1%; } .block-row { display: flex; justify-content: space-between; margin-top: 2%; margin-left: 5%; margin-right: 5%; } .block { flex: 1; max-width: calc(16.666% - 10px); height: 150px; border: 1px solid #ccc; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; } canvas { max-width: 100%; width: 1%; padding-bottom: 3%; }`;
            content = `${content}\n .pageCard { width: calc(30% - 45px); padding: 20px; margin-top: 2%; margin-left: 8%; margin-bottom: 2%; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); background-color: #fff; float: left; } .testCard { width: calc(50% - 15px); padding: 20px; margin-left: 2%; margin-top: 2%; margin-bottom: 2%; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); background-color: #fff; float: left; } .card-title { font-size: 20px; margin-bottom: 10px; } .card-list { list-style: none; padding: 0; } .card-list-item { font-size: 16px; color: #555; margin-bottom: 16px; padding: 10px; background-color: #f0f0f0; margin-bottom: 10px; cursor: pointer; } .metal-text { background-color: #a8a9ad; box-shadow: inset 0 0 10px black; color: #fff; padding: 2px 3%; border-radius: 10px; zoom: 70%; width: auto; float: right; text-align: center; } .progress-container { width: 100%; background-color: #f0f0f0; border-radius: 4px; height: 15px; overflow: hidden; } .progress-bar { height: 100%; margin-top: 0.5%; border-radius: 4px; transition: width 0.5s ease-in-out; } .card-list-item:hover { transform: scale(1.05); } .hidden-card-list { display: none; } .error-message { color: red; background-color: #eed9d8; margin-top: 10px; margin-bottom: 10px; margin-left: 20px; margin-right: 20px; display: none; }`;
            content = `${content}\n</style>`;
            content = `${content}\n</head>\n<body>`;
            const logoLink = "https://images.ctfassets.net/h1eh3mhnbyvi/5DVINwuf5Ldy0WbQi25Wsm/664fed7a1dccb49abdf33265dc8c0ee7/ftd-logo.svg?w=256&fm=webp&q=70";
            content = `${content}\n<div class="banner"> <img src="${logoLink}" alt="Logo" class="logo"> <h1>Merx-Shopify-Automation</h1> <p>Representable Report</p> </div>`;
            content = `${content}\n<div class="block-row">`;
            content = `${content}\n<div class="block"><p>Tests: ${totalResults}</p>\n</div>`;
            content = `${content}\n<div class="block"><p>Passed: ${passedCount}</p>\n</div>`;
            content = `${content}\n<div class="block"><p>Failed: ${failedCount}</p>\n</div>`;
            content = `${content}\n<div class="block"><p>Skipped: 0</p>\n</div>`;
            content = `${content}\n<div class="block"><canvas id="pieChart"></canvas>\n</div>`;
            content = `${content}\n<div class="block"><canvas id="barGraph"></canvas>\n</div>`;
            content = `${content}\n</div>\n<script>`;
            content = `${content}\n const pieChartData = { labels: ['Passed', 'Failed', 'Skipped'], datasets: [{ data: [${passedCount}, ${failedCount}, ${skippedCount}], backgroundColor: ['#75FFAC', '#FF7575', '#FFD700'] }] };\n const barGraphData = { labels: ['Passed', 'Failed', 'Skipped'], datasets: [{ label: 'Cases', data: [${passedCount}, ${failedCount}, ${skippedCount}], backgroundColor: ['#75FFAC', '#FF7575', '#FFD700'] }] }; `;
            content = `${content}\n new Chart(document.getElementById('pieChart').getContext('2d'), { type: 'pie', data: pieChartData });\n new Chart(document.getElementById('barGraph').getContext('2d'), { type: 'bar', data: barGraphData, options: { scales: { y: { beginAtZero: true } } } }); `;
            content = `${content}\n</script>`;
            content = `${content}\n\n<div class="pageCard"> <h2 class="card-title">Pages</h2> <ul class="card-list">`;
            const pageCountMap = yield this.getPagesCount();
            for (const page of pageCountMap.keys()) {
                content = `${content}\n<li class="card-list-item" id="${page}" onclick="showCorrespondingItems('${page}')">`;
                const totalExectionTimeForPage = yield this.getTotalExecutionTimePerPage(page);
                content = `${content}\n<span class="metal-text">${totalExectionTimeForPage}</span>`;
                content = `${content}\n${page}`;
                content = `${content}\n<div class="progress-container">`;
                const passCountForPage = yield this.getPassCountPerPage(page);
                const totalTestCasesPerPage = (yield this.getPagesCount()).get(page);
                console.log("Pass Count is" + passCountForPage);
                console.log("Total Tests " + totalTestCasesPerPage);
                content = `${content}\n<div class="progress-bar half-progress" style="width: 100%; background: linear-gradient(to right, #75FFAC ${(passCountForPage / totalTestCasesPerPage) * 100}%, #FF7575 0%);"></div>`;
                content = `${content}\n</div></li>`;
            }
            content = `${content}\n</ul></div>`;
            for (const page of pageCountMap.keys()) {
                content = `${content}\n<div class="hidden-card-list" id="${page} 2"> <div class="testCard"> <h2 class="card-title">Test Cases</h2>`;
                content = `${content}\n<ul class="card-list">`;
                for (const key of this.testDataResults.keys()) {
                    const keyData = key.split("^");
                    if (page === keyData[0]) {
                        const status = this.testDataResults.get(key).split("^")[0].includes('true');
                        let errorMessage = this.testDataResults.get(key).split("^")[2];
                        if (errorMessage) {
                            // eslint-disable-next-line no-control-regex, no-useless-escape
                            errorMessage = errorMessage.replace(/(\x9B|\x1B\[)[0-?]*[ -\/]*[@-~]/g, '');
                            content = `${content}\n<li class="card-list-item" style="background-color: ${status ? '#badbcc' : '#f5c2c7'}" onclick="showErrorMessage('${keyData[1]}')">`;
                            content = `${content}\n<span class="metal-text" style="padding: 5px 3%;">${this.testDataResults.get(key).split("^")[1]} ms</span>`;
                            content = `${content}\n${keyData[1]}\n</li>`;
                            content = `${content}\n<div class="error-message" id="error-message" name="${keyData[1]}">${errorMessage}.\n</div>`;
                        }
                        else {
                            content = `${content}\n<li class="card-list-item" style="background-color: ${status ? '#badbcc' : '#f5c2c7'}">`;
                            content = `${content}\n<span class="metal-text" style="padding: 5px 3%;">${this.testDataResults.get(key).split("^")[1]} ms</span>`;
                            content = `${content}\n${keyData[1]}\n</li>`;
                        }
                    }
                }
                content = `${content}\n</ul>`;
                content = `${content}\n</div>\n</div>`;
            }
            content = `${content}\n\n<script>`;
            content = `${content}\nfunction showCorrespondingItems(page) { const event1 = document.getElementById(page);\n const event2 = document.getElementById(page + ' 2');\n const allTestCardContents = document.querySelectorAll('.hidden-card-list');\n allTestCardContents.forEach(function (content) { content.style.display = 'none'; });\n event2.style.display = 'block'; const allPagesCardContents = document.querySelectorAll('.pageCard .card-list-item');\n allPagesCardContents.forEach(function (content) { content.style.removeProperty('border'); });\n event1.style.border = '2px solid #ccc'; }`;
            content = `${content}\nfunction showErrorMessage(testCase) { const errorMessage = document.querySelector("div[name='" + testCase + "']");\n const allErrorMessages = document.querySelectorAll('.error-message');\n allErrorMessages.forEach(function (message) { message.style.display = 'none'; });\n errorMessage.style.display = 'block'; }`;
            content = `${content}\n</script>`;
            content = `${content}\n</body></html>`;
            yield fs.writeFileSync(`${this.resultPath}/representable-report.html`, content);
        });
    }
}
