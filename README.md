# ci-utils

A set of CI scripts that helps set up CI.


## check-helm-chart-version

Make sure the helm chart version is same as current Github Release Tag Name Version.

Usage:

```bash
yarn check-helm-chart-version [path to chart.yaml file of the chart...]
```


## update-helm-chart-version

Update the version of all helm charts in a folder to a new version number.

You can set `versionUpdateExclude` field of package.json to specify a list charts that should be excluded from changing version.

Usage:

Add the following `scripts` entries to your package.json:

```
"add-all-chart-version-changes": "git ls-files -m | grep Chart.yaml | xargs git add && git ls-files -m | grep Chart.lock | xargs git add",
"add-all-helm-docs-changes": "helm-docs && git ls-files -m | grep -i readme.md | xargs git add",
"version": "yarn update-helm-chart-version && yarn update-all-charts && yarn add-all-chart-version-changes && yarn add-all-helm-docs-changes"
```

Then you can run:

```bash
npm version [new version number]
```

to set version.