#!/usr/bin/env node
import { App, Stack } from 'aws-cdk-lib';
import { CdkpipelinesDemoPipelineStack } from '../lib/cdkpipelines-demo-pipeline-stack';

const app = new App();

new CdkpipelinesDemoPipelineStack(app, 'CdkpipelinesDemoPipelineStack', {
    env: { account: '810526023897', region: 'us-east-1' },
});

app.synth();