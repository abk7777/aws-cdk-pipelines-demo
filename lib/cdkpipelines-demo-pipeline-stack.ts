import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { CdkpipelinesDemoStage } from './cdkpipelines-demo-stage';

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            // The pipeline name
            pipelineName: 'MyServicePipeline',
            crossAccountKeys: true,
            // How it will be built and synthesized
            synth: new ShellStep('Synth', {
                // Where the source can be found
                input: CodePipelineSource.gitHub('abk7777/aws-cdk-pipelines-demo', 'main'),

                // Install dependencies, build and run cdk synth
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ],
            }),
        });

        // This is where we add the application stages
        const dev = new CdkpipelinesDemoStage(this, 'DEV', {
            env: { account: '810526023897', region: 'us-east-1' }
        });

        const devStage = pipeline.addStage(dev, {
            post: [
              new ShellStep('TestService', {
                commands: [
                  // Use 'curl' to GET the given URL and fail if it returns an error
                  'curl -Ssf $ENDPOINT_URL',
                ],
                envFromCfnOutputs: {
                  // Get the stack Output from the Stage and make it available in
                  // the shell script as $ENDPOINT_URL.
                  ENDPOINT_URL: dev.urlOutput,
                },
              }),
        
            ],
          });
        

        // add manual approval step
        devStage.addPost(new ManualApprovalStep('approval'));

        // This is where we add the application stages
        const prodStage = pipeline.addStage(new CdkpipelinesDemoStage(this, 'PROD', {
            env: { account: '531868584498', region: 'us-east-1' }
        }));

    }
}