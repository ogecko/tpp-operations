To Deploy a Meteor App that uses Nightmare headless browser 
We need to modify the meteord docker image to include an X Virtual Frame Buffer
Add this Dockerfile to the host server and build it

docker build . -t meteord-xvfb

The mup.js refers to this docker image rather than the abernix/meteord:node-8.4.0-base
    docker: {
      image: 'meteord-xvfb',


