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



Finally, one last note

WARNING: simpl-schema no longer works with cheerio objects in the AutoValue functions
to fix this we must monkey patch the file node_modules/simpl-schema/dist/clean/AutoValueRunner.js
and change the line 136 not to use clone
```
	mongoObject.setValueForPosition(position, autoValue);
```
