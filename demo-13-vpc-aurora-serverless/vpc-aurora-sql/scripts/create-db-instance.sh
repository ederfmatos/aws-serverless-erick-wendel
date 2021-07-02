CLUSTER_NAME=serverlesscourse
USERNAME=ederfmatos
PASSWORD=123456Abc
DB_NAME=heroes
SECRET_NAME=aurora-secret01

RESOURCE_ARN=arn:aws:rds:us-east-1:159857938245:cluster:serverlesscourse
SECRET_ARN=arn:aws:secretsmanager:us-east-1:159857938245:secret:aurora-secret01-dN3U8v

aws rds create-db-cluster \
    --engine-version 5.6.10a \
    --db-cluster-identifier $CLUSTER_NAME \
    --engine-mode serverless \
    --engine aurora \
    --master-username $USERNAME \
    --master-user-password $PASSWORD \
    --scaling-configuration MinCapacity=2,MaxCapacity=4,AutoPause=false,TimeoutAction=ForceApplyCapacityChange \
    --enable-http-endpoint \
    --region us-east-1 \
    | tee rds-cluster.log

CREATING="creating"
STATUS=$CREATING

while  [ $STATUS == $CREATING ]
do
    STATUS=$(aws rds describe-db-clusters \
        --db-cluster-identifier $CLUSTER_NAME \
        --query 'DBClusters[0].Status' \
        | tee rds-status.log
        )

    echo $STATUS
    sleep 1
done

aws secretsmanager create-secret \
    --name $SECRET_NAME \
    --description "Credentials for aurora serverless DB" \
    --secret-string '{"username": "'$USERNAME'", "password": "'$PASSWORD'"}' \
    --region us-east-1 \
    | tee secret.log

aws rds-data execute-statement \
    --resouce-arn $RESOURCE_ARN \ 
    --secret-arn $SECRET_ARN \
    --database mysql \
    --sql "show databases;" \
    --region us-east-1 \
    | tee chmod-show-dbs.log

aws rds-data execute-statement \
    --resource-arn $RESOURCE_ARN \ 
    --secret-arn $SECRET_ARN \ 
    --database "mysql" \
    --sql "CREATE DATABASE $DB_NAME;" \
    --region us-east-1 \
    | tee chmod-create-db.log

aws rds describe-db-subnet-groups | tee subnets.log

aws secretsmanager delete-secret --secret-id $SECRET_NAME
aws rds delete-db-cluster --db-cluster-identifier $CLUSTER_NAME --skip-final-snapshot | tee delete-db-cluster.log