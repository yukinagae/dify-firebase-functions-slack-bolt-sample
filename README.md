# dify-firebase-functions-slack-bolt-sample

`dify-firebase-functions-slack-bolt-sample` is a beginner-friendly guide to using Dify, an open-source large language model (LLM) application development platform. This sample project demonstrates how to integrate Dify with a Slack Bolt app deployed on Firebase Functions.

- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Making Changes](#making-changes)
- [License](#license)

## Requirements

Before you start, make sure you have these installed:

- **Node.js** version 22 or later
- **npm**
- **Firebase CLI**
- **ngrok**

For Firebase CLI installation, see the [Firebase - Firebase CLI reference](https://firebase.google.com/docs/cli).

Check your installations by running:

```bash
$ node --version # the below version is on my environment
v22.4.1
$ npm --version # the below version is on my environment
10.7.0
$ firebase --version # the below version is on my environment
13.13.0
$ ngrok --version # the below version is on my environment
ngrok version 3.3.0
```

**Important**: Ensure all subsequent commands are executed within the `functions` directory. To navigate to this directory, use the command `cd functions` and verify your current working directory if necessary.

## Setup

Install Project Dependencies: Open your terminal, navigate to this project's `functions` folder, and run:

```bash
$ npm install
```

## Usage

### Setup Your Firebase Project

Before deploying your application, complete the following preparatory steps:

1. **Create a Firebase project**:

Navigate to the Firebase Console. Click on `Create a project` and follow the prompts to create a new Firebase project.

2. **Switch to the Blaze plan**:

Firebase Functions require the `Blaze (Pay as you go) plan` for deployment. In the Firebase Console, select your project, then navigate to the left side bar section to change your plan.

3. **Configure your Firebase project locally**:

Update the `.firebaserc` file in your project's root directory to include your Firebase project name:

```json
{
  "projects": {
    "default": "your_project_name"
  }
}
```

### Setup Your Slack App

1. Navigate to [Slack - Your Apps](https://api.slack.com/apps) and click `Create New App`.
2. Choose `From an app manifest` option, select a workspace under `Pick a workspace to develop your app`, and then click `Next`.
3. In the app manifest JSON below, replace `[your_app_name]` with your app's name, paste the updated JSON, then proceed by clicking `Next` and `Create`.

```json
{
  "display_information": {
    "name": "[your_app_name]"
  },
  "features": {
    "bot_user": {
      "display_name": "[your_app_name]",
      "always_online": true
    }
  },
  "oauth_config": {
    "scopes": {
      "bot": [
        "app_mentions:read",
        "channels:history",
        "chat:write",
        "files:read"
      ]
    }
  },
  "settings": {
    "event_subscriptions": {
      "request_url": "http://dummy/events", // NOTE: replace this later
      "bot_events": ["app_mention"]
    },
    "org_deploy_enabled": false,
    "socket_mode_enabled": false,
    "token_rotation_enabled": false
  }
}
```

4. Navigate to `Settings` and select `Install App`, then click `Install to Workspace` and `Allow` button.
5. Your `Bot User OAuth Token` will appear. This is your `SLACK_BOT_TOKEN` for later use.
6. Find your `Signing Secret` under `Basic Information`. This is your `SLACK_SIGNING_SECRET` for later use.
7. To add your bot to a Slack channel, use the command:

```bash
/invite @[your_app_name]
```

### Local Emulator

To facilitate local development and testing of Firebase Functions, use the Firebase Emulator Suite. Follow these steps to run your functions locally:

To run Firebase Functions locally using the emulator, set your secret values in `functions/.secret.local`:

```bash
$ cp -p ./.secret.local.example ./secret.local
$ vim ./secret.local # replace the secrets with your own values
DIFY_API_KEY=your_api_key
SLACK_BOT_TOKEN=your_bot_token
SLACK_SIGNING_SECRET=your_signing_secret
```

To launch the emulator, execute:

```bash
$ npm run emulator
✔  functions[us-central1-slack]: http function initialized (http://127.0.0.1:5001/[your_project_name]/us-central1/slack).
```

To make your local emulator accessible online, use ngrok to forward port `5001`:

```bash
$ ngrok http 5001
Forwarding https://[your_ngrok_id].ngrok-free.app -> http://localhost:5001
```

This command provides a public URL. Replace [your_ngrok_id] in the URL `https://[your_ngrok_id].ngrok-free.app` with the ID provided by ngrok.

To configure Slack event subscriptions:

1. Go to the `Event Subscriptions` page on your Slack app's dashboard.
2. In the `Request URL` field, enter `https://[your_ngrok_id].ngrok-free.app/[your_project_name]/us-central1/slack/events`.
3. Wait for the `Request URL Verified` confirmation, then click the `Save changes` button.

To test in a Slack channel, mention your bot using `@[your_app_name]` followed by a greeting message, like so:

```bash
@[your_app_name] hello
```

### Deploy

To authenticate with Firebase and access your projects, use the Firebase CLI login command:

```bash
$ firebase login
```

To keep your secret keys safe when using Firebase Functions, store then as secret values in Google Cloud Secret Manger:

```bash
$ firebase functions:secrets:set DIFY_API_KEY
? Enter a value for DIFY_API_KEY [input is hidden]
$ firebase functions:secrets:set SLACK_BOT_TOKEN
? Enter a value for SLACK_BOT_TOKEN [input is hidden]
$ firebase functions:secrets:set SLACK_SIGNING_SECRET
? Enter a value for SLACK_SIGNING_SECRET [input is hidden]
```

To confirm your secret keys are correctly stored as secrets, use the following command:

```bash
$ firebase functions:secrets:access DIFY_API_KEY
your_api_key
$ firebase functions:secrets:access SLACK_BOT_TOKEN
your_bot_token
$ firebase functions:secrets:access SLACK_SIGNING_SECRET
your_signing_secret
```

After securing your secret keys, you're ready to deploy your application to Firebase Functions:

```bash
$ npm run deploy
```

To monitor the behavior and troubleshoot your deployed functions, view the logs:

```bash
$ npm run logs
```

The final step involves linking your deployed function to the Slack app for integration.

To configure Slack event subscriptions:

1. Go to the `Event Subscriptions` page on your Slack app's dashboard.
2. In the `Request URL` field, enter `https://slack-[your_function_id]-uc.a.run.app/events`.
3. Wait for the `Request URL Verified` confirmation, then click the `Save changes` button.

NOTE: Replace `[your_function_id]` with your Firebase project value, found in the Firebase Console under the Functions Dashboard.

To test in a Slack channel, mention your bot using `@[your_app_name]` followed by a greeting message, like so:

```bash
@[your_app_name] hello
```

## Making Changes

### Building the Project

After making changes, you might need to build the project to see your changes in action:

```bash
$ npm run build
```

### Formatting and Linting

To ensure your code follows the project's coding standards, run the formatting and linting tools:

```bash
$ npm run typecheck # type check without modifying files
$ npm run check     # scan without modifying files
$ npm run fix       # modify files
```

## License

MIT
