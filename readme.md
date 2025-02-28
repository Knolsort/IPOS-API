image build : docker build . -t rabeeh003/barter-backend
run :  docker run -p 3000:3000 -d rabeeh003/barter-backend
list running container : docker ps
stop running container : docker stop [container id]
- docker push rabeeh003/barter-backend
- docker pull rabeeh003/barter-backend