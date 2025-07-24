# OneSignal Setup Guide

## Overview
This project has been configured with OneSignal web push notifications. Follow these steps to complete the setup:

## 1. Create OneSignal Account
1. Go to [OneSignal](https://onesignal.com/) and create an account
2. Create a new app for your church PWA
3. Choose "Web Push" as the platform

## 2. Configure Your App ID
1. In your OneSignal dashboard, go to **Settings** > **Keys & IDs**
2. Copy your **App ID**
3. Create a `.env` file in your project root (if it doesn't exist)
4. Add your OneSignal App ID to the `.env` file:

```bash
VITE_ONESIGNAL_APP_ID=your-actual-app-id-here
```

**Note**: The `.env` file is already configured to be ignored by git for security.

## 3. Web Push Configuration
1. In OneSignal dashboard, go to **Settings** > **Platforms**
2. Click on **Web Push**
3. Configure your site settings:
   - **Site Name**: Your Church Name
   - **Site URL**: Your production domain (e.g., https://yourchurch.com)
   - **Default Icon URL**: URL to your church logo/icon

## 4. HTTPS Requirement
- OneSignal requires HTTPS in production
- For local development, the configuration includes `allowLocalhostAsSecureOrigin: true`
- Make sure your production site uses HTTPS

## 5. Service Worker
The OneSignal service worker is already configured:
- Located at: `public/onesignal/OneSignalSDKWorker.js`
- Accessible at: `https://yoursite.com/onesignal/OneSignalSDKWorker.js`

## 6. Testing
1. Start your development server: `npm run dev`
2. Open your browser and navigate to `http://localhost:5173`
3. You should see a notification permission prompt
4. Allow notifications to test the integration

## 7. Sending Test Notifications
1. In OneSignal dashboard, go to **Messages** > **Push**
2. Click **New Push**
3. Create a test message and send it to test subscribers

## Features Included
- ✅ OneSignal SDK integration
- ✅ Service worker configuration
- ✅ Notification button with custom text
- ✅ Development-friendly settings
- ✅ Proper TypeScript support

## Additional Configuration
You can customize the notification behavior by modifying the `OneSignalInit.tsx` component:
- Change notification button text
- Modify notification prompts
- Add custom event handlers
- Configure advanced features like tags and user identification

For more advanced features, refer to the [OneSignal React Documentation](https://documentation.onesignal.com/docs/react-js-setup).