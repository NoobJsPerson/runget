## RunGet Bot
RunGet Bot is a discord bot with the prefix **.** that posts recent verified runs from Speedrun.com
You can invite the official hosted version from [here](https://discord.com/api/oauth2/authorize?client_id=754827405813743676&permissions=52224&scope=bot)
![Screenshot of the embed](screenshots/Screenshot_20210307-135020-1.jpg)
## How to setup verified runs
1. Invite the bot to your server (or host it from source code)
2. Make sure bot has permission to send messages and embeds
3. Make a channel and name it #new-runs
4. add the game(s) you to see its/their runs using .addgame or .addgames (if you didn't add any it'll send all verified new runs from Speedrun.com)
## Commands
- .addgame: adds the mentioned game into the gamelist
- .addgames: same as .addgame but it can add multiple games when they're seperated by |
- .deletegame: deletes mentioned game from gamelist
- .gamelist: sends the current server's gamelist in embed(s)
- .help: sends a list of commands with their usage