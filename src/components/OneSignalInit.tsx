import { useEffect, useRef } from 'react';
import OneSignal from 'react-onesignal';

/**
 * OneSignal initialization component
 * Handles the setup and configuration of OneSignal push notifications
 */
const OneSignalInit = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Ensure this code runs only on the client side and hasn't been initialized yet
    if (typeof window !== 'undefined' && !isInitialized.current) {
      isInitialized.current = true;
      OneSignal.init({
        appId: import.meta.env.VITE_ONESIGNAL_APP_ID, // OneSignal App ID from environment variables
        serviceWorkerParam: {
          scope: '/onesignal/'
        },
        serviceWorkerPath: '/onesignal/OneSignalSDKWorker.js',
        notifyButton: {
          enable: true,
          prenotify: true,
          showCredit: true,
          text: {
             'message.action.subscribed': 'Thanks for subscribing!',
             'message.action.resubscribed': 'You\'re subscribed to notifications',
             'message.action.unsubscribed': 'You won\'t receive notifications again',
             'message.action.subscribing': 'Thanks for subscribing!',
             'message.prenotify': 'Click to subscribe to notifications',
             'dialog.main.title': 'Manage Site Notifications',
             'dialog.main.button.subscribe': 'SUBSCRIBE',
             'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
             'dialog.blocked.title': 'Unblock Notifications',
             'dialog.blocked.message': 'Follow these instructions to allow notifications:',
             'tip.state.blocked': 'You\'ve blocked notifications',
             'tip.state.subscribed': 'You\'re subscribed to notifications',
             'tip.state.unsubscribed': 'Subscribe to notifications'
           }
        },
        allowLocalhostAsSecureOrigin: true, // For development
      });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default OneSignalInit;