import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_apigateway as apigw } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import * as path from 'path';

/**
 * A stack for our simple Lambda-powered web service
 */
export class CdkpipelinesDemoStack extends cdk.Stack {
    /**
     * The URL of the API Gateway endpoint, for use in the integ tests
     */
    public readonly urlOutput: cdk.CfnOutput;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The Lambda function that contains the functionality
        const handler = new lambda.Function(this, 'Lambda', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'handler.handler',
            code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
        });

        // An API Gateway to make the Lambda web-accessible
        const gw = new apigw.LambdaRestApi(this, 'Gateway', {
            description: 'Endpoint for a simple Lambda-powered web service',
            handler,
        });

        this.urlOutput = new cdk.CfnOutput(this, 'Url', {
            value: gw.url,
        });
    }
}