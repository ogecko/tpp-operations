# Deploying TPP
To Deploy a Meteor App that uses Nightmare headless browser 
We need to modify the meteord docker image to include an X Virtual Frame Buffer
Add this Dockerfile to the host server and build it

```
docker build . -t meteord-xvfb:node-8.9.3-base
```

Then change mup.js to refer to the newly created docker image (rather than the default `abernix/meteord:node-8.4.0-base`)


```
    docker: {
      image: 'meteord-xvfb:node-8.9.3-base',
      ....
```

Also ensure the server hosting docker has the correct timezone using

````
	sudo timedatectl set-timezone Australia/Sydney
````
