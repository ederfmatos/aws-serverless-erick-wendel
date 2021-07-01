HOST=http://0.0.0.0:3000/dev
APIKEY="d41d8cd98f00b204e9800998ecf8427e"

curl --silent  \
    -H "x-api-key: $APIKEY" \
    $HOST/hello