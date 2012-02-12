# JavaScript IRC Stats

IRC statistics generator powered by JavaScript



## What is this?

Generates statistics of IRC logs. If you don't know what IRC is, you probably don't care either.



## Why is this?

I grew bored of looking at the old pisg etc. stats.



## Where is it?

Everything you need should be at [https://github.com/lietu/jsis](https://github.com/lietu/jsis)


## Is it ready?

No. It's ready for use, but still missing several features. You're welcome to help.

Some such features are:
* Automatically following nicks through nick changes etc.
* Configurable user details, aliases, gender, etc.
* Calculating references to nicks
* Better lists of foul & aggressive words, smileys, etc.
* A few of the fragments, some might need some of the above features to finish.
* Maybe copy a few more ideas off pisg/fisg/mIRCStats/others



## Requirements

 - Node.js (v0.6.7 has been tested)
 - ejs module for Node.js



## How to use it?

1. Make sure you have node and NPM, you can probably install them via some installer from their homepage ( [http://nodejs.org/]( http://nodejs.org/ ) ) or NVM ([https://github.com/creationix/nvm](https://github.com/creationix/nvm )). Ask them how.

2. You'll need a place for the application .. think of one, download the files from [https://github.com/lietu/jsis](https://github.com/lietu/jsis) and put them there.

3. Install the node module "ejs", assuming you've got NPM open a terminal/whatever to the place you put the files in and run "npm install ejs" and wait a few secs.

4. Configure JSIS, copy config.example.js to config.js and edit it.

5. Run JSIS, "node jsis.js". Good luck.



## It is still unclear to me how to use it, can you tell me more?

You can try your luck at finding help through [https://github.com/lietu/jsis](https://github.com/lietu/jsis) .. no promises though



## How about licensing?

Short answer: new BSD, and MIT. Long answer: Read the LICENSE -file


