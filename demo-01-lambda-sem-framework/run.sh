# 1° passo - criar arquivo de politicas de segurança
# 2° passo - criar role de segurança na AWS

aws iam create-role \
    --role-name lambda-example \
    --assume-role-policy-document file://politicas.json \
    | tee logs/role.log

# 3° passo - criar arquivo com conteudo e zipa-lo

zip function.zip index.js

# 4° passo - criar lambda

aws lambda create-function \
    --function-name hello-cli \
    --zip-file fileb://function.zip \
    --handler index.handler \
    --runtime nodejs14.x \
    --role arn:aws:iam::159857938245:role/lambda-example \
    | tee logs/lambda-create.log

# 5° passo - invocar lambda

aws lambda invoke |
    --function-name hello-cli \
    --log-type Tail \
    logs/lambda-exec.log

# 6° passo - atualizar lambda e zipar

zip function.zip index.js

aws lambda update-function-code \
    --zip-file fileb://function.zip \
    --function-name hello-cli \
    --publish \
    | tee logs/lambda-update.log

aws lambda invoke |
    --function-name hello-cli \
    --log-type Tail \
    logs/lambda-exec-update.log

# 6° passo - remover function e role

aws lambda delete-function \
    --function-name hello-cli

aws iam delete-role \
    --role-name lambda-example