QUEUE_NAME=$1

aws sqs create-queue --queue-name $QUEUE_NAME 
    --endpoint-url=http://localhost:4566

aws \
    --endpoint-url=http://localhost:4566 \
    sqs list-queues 