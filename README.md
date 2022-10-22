# serendib-scholarship-ws

## Deploy the sample application

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 16](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

## Use the SAM CLI to build and test locally

Build your application with the `sam build` command.

```bash
serendib-scholarship-ws$ sam build
```

The SAM CLI installs dependencies defined in `hello-world/package.json`, compiles TypeScript with esbuild, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
serendib-scholarship-ws$ sam local invoke HelloWorldFunction --event events/event.json
```

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
serendib-scholarship-ws$ sam local start-api
serendib-scholarship-ws$ curl http://localhost:3000/
```

## Fetch, tail, and filter Lambda function logs

```bash
serendib-scholarship-ws$ sam logs -n HelloWorldFunction --stack-name serendib-scholarship-ws --tail
```

## Unit tests

Tests are defined in the `hello-world/tests` folder in this project. Use NPM to install the [Jest test framework](https://jestjs.io/) and run unit tests.

```bash
serendib-scholarship-ws$ cd hello-world
hello-world$ npm install
hello-world$ npm run test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
aws cloudformation delete-stack --stack-name serendib-scholarship-ws
```
