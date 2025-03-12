
import PWABadge from './PWABadge.tsx'
import './App.css'

// Convert VAPID key to UInt8Array
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

function App() {
  // Send Test Notification
async  function sendNotification() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      await askPermission();
    }


    fetch('https://service-worker-test1-production.up.railway.app/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then(() => console.log('Notification sent'))
      .catch((error) => console.error('Error sending notification:', error));
  }

  // Ask for Notification Permission
  async function askPermission() {
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted.');
        await subscribeUser(); // Only subscribe after permission is granted
      } else {
        console.log('Notification permission denied.');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  }

  async function subscribeUser() {
    console.log('Subscribing user start');

    try {
      const registration = await navigator.serviceWorker.ready;
      const subs = await registration.pushManager.getSubscription();
      console.log({ subs , registration});
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BPs_1OoW7BpSARHd7L8F8PWMXjnE2oVO-DJw1N4ioj8ULcg9OFz0jFrQOxSaLPG3KHvwOqLpMH7SY0H2gTZzSIY",
        ),
      });

      console.log('User is subscribed:', subscription);

      await fetch('https://service-worker-test1-production.up.railway.app/save-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      console.log('Subscription saved on server');
    } catch (error) {
      console.error('Failed to subscribe user:', error);
    }

    console.log('Subscribing user end');
  }

  return (
    <>
      <div>
        <h1>Permission</h1>
        <button onClick={askPermission}>Give Permissions</button>
        <button onClick={subscribeUser}>Save User</button>
        <button onClick={sendNotification}>Send notification</button>
        <button onClick={()=>{
          new Notification("test", {body: "test"})
        }}>test</button>
      </div>
      <PWABadge />
    </>
  )
}

export default App
