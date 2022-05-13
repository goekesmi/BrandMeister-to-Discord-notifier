### BrandMeister to Discord Notifier

This is a small nodejs package and script that will connect to the 
BrandMeister hoseline api, and send a set of discord channels a 
notification about new activity on a set of talkgroups.

# Configuration
This is configured off of 3 environmental variables, which can be
supplied by a .env file.  See the included example.env for a template
with, what I assure you, are invalid tokens.

* CLIENT_TOKEN which is the discord bot token that you made when you
setup the bot identity

* CHANNELS which is a space seperated list of discord numeric channel
identifiers that need to be notified

* TALKGROUPS which is a space seperated list of Brand Meister talk 
group identifiers to watch for traffic on.

The discord bot identity will need 'bot', 'Read Messages/View Channels'
and 'Send Messages'

# Intended operational environment

Build the docker container using the Docker file.
```
ubuntu@a6a3aeb3-dac3-44ef-8048-43fb42793eea:~/brand-meister-to-discord-notifier$ docker build . -t goekesmi/brand-meister-to-discord-notifier
Sending build context to Docker daemon  115.2kB
Step 1/5 : FROM node:16
 ---> 74b4ba5546c1
Step 2/5 : WORKDIR /usr/src/app
 ---> Using cache
 ---> 6fa4d170484f
Step 3/5 : COPY package*.json index.js ./
 ---> 4af97dc23bca
Step 4/5 : RUN npm install
 ---> Running in ea89a0161b1d

added 103 packages, and audited 104 packages in 7s

8 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
npm notice 
npm notice New minor version of npm available! 8.5.5 -> 8.10.0
npm notice Changelog: <https://github.com/npm/cli/releases/tag/v8.10.0>
npm notice Run `npm install -g npm@8.10.0` to update!
npm notice 
Removing intermediate container ea89a0161b1d
 ---> ecf506c74251
Step 5/5 : CMD [ "node", "index.js" ]
 ---> Running in b6f58d08aca6
Removing intermediate container b6f58d08aca6
 ---> 35378769594c
Successfully built 35378769594c
Successfully tagged goekesmi/brand-meister-to-discord-notifier:latest
```

Setup your env file
```
ubuntu@a6a3aeb3-dac3-44ef-8048-43fb42793eea:~/brand-meister-to-discord-notifier$ cp example.env .env
ubuntu@a6a3aeb3-dac3-44ef-8048-43fb42793eea:~/brand-meister-to-discord-notifier$ vi .env
```

Launch your instance
```
ubuntu@a6a3aeb3-dac3-44ef-8048-43fb42793eea:~/brand-meister-to-discord-notifier$ docker run --env-file=.env -d goekesmi/brand-meister-to-discord-notifier
aef062d555e52b2ffa53fca14a23d3aeb92770d58863a0da1d01d636ae1b0e57
ubuntu@a6a3aeb3-dac3-44ef-8048-43fb42793eea:~/brand-meister-to-discord-notifier$ docker logs aef062d555e52b2ffa53fca14a23d3aeb92770d58863a0da1d01d636ae1b0e57
Logged in as BrandMeisterTG98638Notifier#2455!
971516057804218478
Connected to BM API
TALK_GROUPS_TO_MONITOR [ 98638 ]
ubuntu@a6a3aeb3-dac3-44ef-8048-43fb42793eea:~/brand-meister-to-discord-notifier$ 
```


# Error handling
It crashes. 

Anything goes wrong at all, we crash.  The most common case is attempting
to write to a channel id that the bot has not been authorized to write
to. The second most common case is not having a valid CLIENT_TOKEN for 
Discord.

# Timeouts and anti annoyance features

The notifier only runs on new transmissions.  A new transmission is 
defined as a transmission after X seconds of silence.  By default, X 
is 900 (15 minutes).  Short transmissions of 2 seconds or less are also
ignored.

# Acknowledgments

This is derived from https://github.com/klinquist/bmPushNotification/ 
who did most of the heavy lifting before I got here.  All bugs found
in this are my fault, however.

