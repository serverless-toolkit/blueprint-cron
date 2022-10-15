import {
  aws_lambda_nodejs,
  Stack,
  App,
  CfnOutput,
  Duration,
  aws_lambda,
  StackProps,
  aws_logs,
} from "aws-cdk-lib";
import { Construct } from "constructs";

class LambdaCronStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const handler = new aws_lambda_nodejs.NodejsFunction(
      this,
      "lambda-handler",
      {
        timeout: Duration.minutes(15),
        memorySize: 128,
        handler: "handler",
        awsSdkConnectionReuse: true,
        runtime: aws_lambda.Runtime.NODEJS_16_X,
        logRetention: aws_logs.RetentionDays.ONE_WEEK,                
      }
    );

    const fnUrl = new aws_lambda.FunctionUrl(this, "lambda-handler-url", {
      function: handler,
      authType: aws_lambda.FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, "lambda-name", {
      value: handler.functionName,
    });

    new CfnOutput(this, "lambda-url", {
      value: fnUrl.url,
    });

    new CfnOutput(this, "lambda-log-group-name", {
      value: handler.logGroup.logGroupName,
    });
  }
}

const app = new App();
const stackname = app.node.tryGetContext("stackname");
new LambdaCronStack(app, "lambda-cron-stack", { stackName: stackname });
