# gm identify -verbose ./app/resources/images/homer-simpson.jpg

gm convert \
    ./app/resources/images/homer-simpson.jpg \
    -font ./app/resources/fonts/impact.ttf \
    -pointsize 50 \
    -fill "#FFF" \
    -stroke "#000" \
    -strokewidth 1 \
    -draw "gravity center text 0,-155 \"Quando\"" \
    -draw "gravity center text 0,155 \"te chamam para uma festa\"" \
    output.png

echo "complete"