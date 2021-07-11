IMAGE_URL="159857938245.dkr.ecr.us-east-1.amazonaws.com/process-data"
REGION="us-east-1"
docker build -t $IMAGE_URL .

docker run $IMAGE_URL

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin 159857938245.dkr.ecr.region.amazonaws.com

docker push $IMAGE_URL