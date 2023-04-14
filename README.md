This is a Chatbot App built with Expo and React Native. The app supports both chat and voice features. This README will guide you on how to set up the project locally and how to build and deploy it.

Requirements
------------

-   Node.js (LTS version)
-   Yarn
-   Expo CLI
-   iOS or Android device with Expo Go app installed

Installation
------------

1.  Clone the repository:

bashCopy code

`git clone https://github.com/your-repo/chatbot-app.git`

1.  Change to the project directory:

bashCopy code

`cd chatbot-app`

1.  Install dependencies:

bashCopy code

`yarn install`

Running the App
---------------

You can run the app in different environments:

-   Development: `yarn start`
-   Staging: `yarn start:staging`
-   Production: `yarn start:production`

Scan the QR code using the Expo Go app on your device, or run the app on an emulator:

-   Android: `yarn android`
-   iOS: `yarn ios`

Environment Variables
---------------------

The app uses environment variables to configure different API endpoints. Set up your environment variables in the `.env` file by copying the example file:

bashCopy code

`cp example.env .env`

Replace the placeholders with your actual API URLs:

makefileCopy code

`ChatAPI="https://your-chat-api-url.com"
ChatVoiceAPI="https://your-chat-voice-api-url.com"`

Building and Deploying
----------------------

To build and submit the app for iOS and Android:

1.  Configure the `eas.json` file with your Expo account details.
2.  Update the `app.json` file with your app-specific settings.
3.  Build and submit the app to the App Store and Google Play Store:

bashCopy code

`yarn eas:submit:ios
yarn eas:submit:android`

Troubleshooting
---------------

If you encounter any issues, try the following:

-   Nuke the `node_modules` directory and reinstall dependencies:

bashCopy code

`yarn nuke:modules`


License
-------

This project is licensed under the MIT License - see the [LICENSE.md](https://chat.openai.com/LICENSE.md) file for details.