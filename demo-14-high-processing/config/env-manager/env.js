const ssmPrefix = "/prod/curso-serverless01";

const variables = {
  ECS_TASK_DEFINITION: {
    value: "process-data:1",
    type: "String",
  },
  ECS_CLUSTER_NAME: {
    value: "surveys-ederfmatos-001",
    type: "String",
  },
  ECS_TASK_LAUNCH_TYPE: {
    value: "FARGATE",
    type: "String",
  },
  ECS_TASK_COUNT: {
    value: "1",
    type: "String",
  },
  ECS_TASK_PLATFORM_VERSION: {
    value: "LATEST",
    type: "String",
  },
  ECS_TASK_CONTAINER_NAME: {
    value: "process-data",
    type: "String",
  },
  ECS_TASK_CONTAINER_FILE_ENV_NAME: {
    value: "SURVEY_FILE",
    type: "String",
  },
  ECS_TASK_SUBNETS: {
    value: [
      "subnet-1a9f043b",
      "subnet-63a8852e",
      "subnet-f9bc219f",
      "subnet-87db7bb6",
      "subnet-cdd582c3",
      "subnet-1939a746",
    ].join(","),
    type: "StringList",
  },
  ECS_TASK_SECURITY_GROUPS: {
    value: ["sg-00b0b767b0a268107"].join(","),
    type: "StringList",
  },
  ECS_TASK_ASSIGN_PUBLIC_IP: {
    value: "ENABLED",
    type: "String",
  },
  ECS_PROCESS_DATA_IMAGE_URL: {
    value: "159857938245.dkr.ecr.us-east-1.amazonaws.com/process-data",
    type: "String",
  },
  BUCKET_REPORTS: {
    value: "reports",
    type: "String",
  },
  LOG_GROUP_NAME: {
    value: "/ecs/curso-serverless01",
    type: "String",
  },
  SSM_PREFIX: {
    value: ssmPrefix,
    type: "String",
  },
  BUCKET_SURVEYS: {
    value: "surveys-ederfmatos-001",
    type: "String",
  },
  REGION: {
    value: "us-east-1",
    type: "String",
  },
  SES_EMAIL_TO: {
    value: "ederfmatos@gmail.com",
    type: "String",
  },
  SES_EMAIL_FROM: {
    value: "ederfmatos@gmail.com",
    type: "String",
  },
};

module.exports = {
  variables,
  ssmPrefix,
};
