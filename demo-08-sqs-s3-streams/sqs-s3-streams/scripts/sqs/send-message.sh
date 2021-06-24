QUEUE_URL=$1

aws sqs send-message --queue-url $QUEUE_URL --message-body  'Hey ho lets go' 
    # --endpoint-url=localhost:4566

aws sqs receive-message --queue-url=$QUEUE_URL \
    