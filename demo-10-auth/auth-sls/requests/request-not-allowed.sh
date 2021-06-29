HOST=http://0.0.0.0:3000/dev

TOKEN=$(curl -X POST \
    --silent \
    -H 'Content-Type: application/json'\
    --data '{ "username": "tevez", "password": "5432" }'  \
    $HOST/login \
    | jq '.token' \
    | sed 's/"//g' \
    | tee token.log
    )

echo "Token: $TOKEN"
echo

curl --silent $HOST/public | xargs  echo "Public API: $1"

curl \
    --silent \
    -H "Authorization:$TOKEN" \
    $HOST/private \
    | xargs echo "Private API: $1"

echo