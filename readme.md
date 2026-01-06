# build image
docker build -t exhibition-guide-prod .

# upload docker image on server
scp -r dockerImageFile user@server:/path/to/app

# build the docker image
docker build -t exhibition-app:1.0 .

# save docker image to dir
docker save -o exhibition-app.tar exhibition-app:1.0

# load docker image to images 
docker load -i exhibition-app.tar

# run docker image
docker run -d -p 80:80 --name exhibition-app --restart unless-stopped exhibition-app:1.0

# down docker
docker stop exhibition-app

