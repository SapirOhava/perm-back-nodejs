# the first command that we always need to do is to specify the base image or a known image
# (image that docker has access to - is on docker hub) the base image is the official node image.
#  because really thats the only thing that i need to run , and anything else is needed to run node
#  i got my specific node version -> with node -v command
FROM node:18.14.1
# this command sets our working directory of our container, he knows that /app directory exists 
# in the container because he have run the node image before and he knows it got a /app directory
# setting the working directory is helpful because anytime you run a command its going to run from this directory
# so i can put all of our app code in /app and run node index.js file on /app
WORKDIR /app
# the next thing is to copy my package.json file( which contains all the dependencies for my app ) 
# into my docker image
# i wrote package.json because this is the path to it because its in my root directory.
# the thing after the package.json is the directory to copy it into in my image.
#  the . means the current directory ( which is /app as i set before)
COPY package.json .
# once i have my package.json i need to install all of the dependencies, so i need to run the command npm install
# in dockerfile to run a command - use run.
RUN npm install
# now all the dependencies are  installed
# now i am going to copy the rest of my files and source code into my image
COPY . ./
# expose the port my app listen to (port 3000)
EXPOSE 3000
# when we start the container - tell it which command to run
# since my app is a node app and the entry point is index.js file
# so the command it need to run is node index.js
CMD [ "node","index.js" ]
# so when i deploy my container its going to run index.js
#  the run command - is at build time(building the image) ,
#  and the cmd command is at runtime(when run the container)

# to build the image now , in the terminal and stop my express server from running 
# on my local machine, because i am no longer going to develop on
#  my local machine , i am going to develop in the docker container
#  so to build the image is the command - docker build <the path to my dockerfile which is in my corrent directory so i'll write . >
#  in short this is my command - docker build .