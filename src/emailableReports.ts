import WDIOReporter, { RunnerStats } from '@wdio/reporter';
import fs from 'fs';
import MergeResults from './mergeResults.js';
let folderPath;
let envProps;

export default class EmailableReports extends WDIOReporter {
    constructor(options) {
        options = Object.assign(options);
        if (options.outputDir === undefined) {
            options.outputDir = "./emailable-results";
        }
        folderPath = options.outputDir;
        envProps = {
            suite: options.suite,
            brand: options.brand !== undefined ? options.brand : ''
        }
        super(options);
    }

    onTestEnd(test) {
        const timeStamp = Math.floor(Date.now() / 100);
        console.log("Test Data is");
        console.log(test);
        const status = test.state === 'passed' ? true : false;
        const testInfo = JSON.stringify(`${test.parent}^${test.title}`);
        const result = JSON.stringify(`${status}^${test._duration}^${test.error !== undefined ? (test.error.stack) : ''}`);

        let content = `{${testInfo}: ${result}}`;
        fs.writeFileSync(`${folderPath}/result_${timeStamp}.json`, content, { flag: 'a+' });
    }

    onRunnerEnd(runnerStats): void {
        const mergeResults = new MergeResults(folderPath);
        (async (envProps) => {
            await mergeResults.createEmailableReport(envProps);
        })();

    }

}