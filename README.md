Emoji Reactions (Reacji) 🙂👍
=============================

A Slack [internal integration](https://api.slack.com/slack-apps#internal_integrations) Slash Command for learning about your reacji habits!

### What it does

Reports on a user's most **recently** used or their most **frequently** used emoji reaction.

![example usage](https://cdn.glitch.com/0c38a686-d565-410c-8934-96e420fcadc2%2Fsample.png?1523035899535 "What it looks like")


### How

Invoke a Slack command to choose between which emoji statistic to display using interactive menu buttons.

From the Slack API, this command uses:
- [A Slash Command](https://api.slack.com/slash-commands)
- [Interactive Message Buttons](https://api.slack.com/docs/message-buttons)
- [Reactions List Web API](https://api.slack.com/methods/reactions.list)
- [An Incoming Webhook](https://api.slack.com/incoming-webhooks)

Slack **Permission Scopes** used by installing this app:
- [commands](https://api.slack.com/scopes/commands)
- [reactions:read](https://api.slack.com/scopes/reactions:read)

The app is hosted on Glitch and can be found [here](https://glitch.com/edit/#!/assignment-stuff)

The Github repository can be found [here](https://github.com/amarinelli/slack-reaction-command)

### Usage
Once your Slack app is created & configured and the Node App is hosted and hooked into your app (see [Setup](#setup) below), use the integration by simply typing `/reactions` in the message input of Slack (unsupported in threads) and selecting one of the button presented.

### Buttons

##### Recent
The Recent emoji function will present the user's five most recently used reactions.  That said, reactions are not timestamped, so new emoji on an older message that already contained reactions from that user will be considered as "recently used".

Placing five reactions on five separate messages or files, where those items were never reacted by that user before will work as you would expect, and those five reaction emoji will be reported back to the user.

##### Frequent
The Frequent emoji function will present the single emoji you have used the most within the last 100 reacjis.  Does not account for ties.

### Setup

1. Start by creating a [Slack App](https://api.slack.com/slack-apps)
2. In the *Add features and functionality* section of the app's Basic Information, add both a **Slash Command** and enable an **Interactive Component**
3. The **Request URL** for both of these components will need to point to the appropriate endpoint of your hosting Node App
4. While the `command` scope is added automatically when the Slash Command feature is added, you will need to manually add the `reactions:read` scope in the **OAuth & Permissions** section of the app's configuration.
5. Also on the OAuth & Permissions page, copy the **OAuth Access Token** *(xoxp-)* and add it as the **ACCESS_TOKEN** of the `.env` file.
6. Also required in this file is the **Verification Token** which can be found in the **App Credentials** section of your Slack app's Basic Information.

### Improvements
- For the frequent emoji function, also respond with the number of times the user reacted with the emoji
- Allow the user to bypass selecting one of the button functions by supporting an optional Slash Command parameter, example: `/reactions recent`
- Allow the user to select another workspace member to view their reaction stats from public channels.  Use a [Message menu](https://api.slack.com/docs/message-menus) to power the user selection.