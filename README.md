### BrandMeister to Discord Notifier

This is a small nodejs package and script that will connect to the 
BrandMeister hoseline api, and send a set of discord channels a 
notification about new activity on a set of talkgroups.

# Configuration
This is configured off of 3 environmental variables, which can be
supplied by a .env file.

* CLIENT_TOKEN which is the discord bot token that you made when you
setup the bot identity

* CHANNELS which is a space seperated list of discord numeric channel
identifiers that need to be notified

* TALKGROUPS which is a space seperated list of Brand Meister talk 
group identifiers to watch for traffic on.

The discord bot identity will need 'bot', 'Read Messages/View Channels'
and 'Send Messages'

# Error handling
It crashes. 

Anything goes wrong at all, we crash.  The most common case is attempting
to write to a channel id that the bot has not been authorized to write
to.

# Timeouts and anti annoyance features

The notifier only runs on new transmissions.  A new transmission is 
defined as a transmission after X seconds of silence.  By default, X 
is 900 (15 minutes).  Short transmissions of 2 seconds or less are also
ignored.

# Acknowledgments

This is derived from https://github.com/klinquist/bmPushNotification/ 
who did most of the heavy lifting before I got here.  All bugs found
in this are my fault, however.

