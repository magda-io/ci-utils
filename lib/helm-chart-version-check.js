#!/usr/bin/env node
const YAML = require("yaml");
const fse = require("fs-extra");

function checkChartVersion(chartFilePath, newVersion) {
    try {
        const chartFileContent = fse.readFileSync(chartFilePath, {
            encoding: "utf8"
        });
        if (!chartFileContent) {
            throw new Error(`Failed to read Chart.yaml from ${chartFilePath}`);
        }
        const chart = YAML.parseDocument(chartFileContent);
        const chartName = chart.getIn(["name"]);

        const chartVersion = chart.getIn(["version"], true);
        if (chartVersion) {
            console.log(
                `Current chart version of chart "${chartName}" is ${chartVersion.value}`
            );
            if (chartVersion != newVersion) {
                console.error(
                    `Inputted Github Release Tag Name Version ${newVersion} is different from Chart version ${chartVersion.value} in "${chartFilePath}".`
                );
                console.error(
                    `Please update "${chartFilePath}" and try again.`
                );
                process.exit(-1);
            } else {
                console.log(`Passed Chart version check.`);
            }
        } else {
            console.error(
                `Chart version ${chartVersion.value} in "${chartFilePath}" is blank but required to be match the inputted Github Release Tag Name Version ${newVersion}.`
            );
            console.error(`Please update "${chartFilePath}" and try again.`);
            process.exit(-1);
        }
    } catch (e) {
        console.error(`Failed to process ${chartFilePath}: ${e}`);
        process.exit(-1);
    }
}

const githubReleaseTagName = process.env["GITHUB_REF"];
if (typeof githubReleaseTagName !== "string" || !githubReleaseTagName) {
    throw new Error("Cannot locate Github Release Tag Name from env variable!");
}
const versionTag = githubReleaseTagName.split("/").pop();
if (typeof versionTag !== "string" || !versionTag) {
    throw new Error(
        `Invalid Github Release Tag Name env var value: ${githubReleaseTagName}!`
    );
}
const SEMVER_REGEX =
    /^v((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/;
const matchResult = versionTag.match(SEMVER_REGEX);
if (!matchResult) {
    console.log(githubReleaseTagName);
    console.log(matchResult);
    throw new Error(
        `The inputted Github Release Tag Name "${versionTag}" should match format letter 'v' + semver string. e.g. v1.0.0-alpha.1`
    );
}
const versionStr = matchResult[1];

console.log(
    `Checking if inputted Github Release Tag Name version ${versionStr} match the release chart version...`
);

const args = process.argv.slice(2);

checkChartVersion(args[0], versionStr);
