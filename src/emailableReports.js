var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import WDIOReporter from '@wdio/reporter';
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
        };
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
    onRunnerEnd(runnerStats) {
        const mergeResults = new MergeResults(folderPath);
        ((envProps) => __awaiter(this, void 0, void 0, function* () {
            yield mergeResults.createEmailableReport(envProps);
        }))();
    }
}
