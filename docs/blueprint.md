# **App Name**: UmbraGuard

## Core Features:

- BLE Connection: Connect to the smart chip inside the umbrella using BLE with auto-reconnect support and low-energy continuous scanning for proximity.
- Left-Behind Notification: Detect when the umbrella is out of BLE range and send a push notification with customizable distance/sensitivity settings.
- LED Control: Toggle the LED inside the umbrella handle from the app, with real-time status confirmation.
- Weather Alert: Integrate with WeatherAPI.com to fetch weather forecasts and send notifications if rain is predicted. Display weather in app dashboard.
- User Authentication: Firebase Authentication (Email/Password, Google Sign-in) to manage user accounts.
- Cloud Sync: Firestore database to store user device info, umbrella settings, notification logs, weather alert preferences, and BLE pairing/umbrella ownership.

## Style Guidelines:

- Primary color: Deep sky blue (#30A2FF) to convey reliability and connectivity, echoing the constant connection of the BLE umbrella.
- Background color: Very light blue (#E5F3FF), offering a clean and unobtrusive backdrop.
- Accent color: Cyan (#00FFFF) to add brightness, call attention to interactive elements, and suggest technological innovation.
- Font: 'Inter', a grotesque-style sans-serif, will be used for both headlines and body text.
- Use clear and modern icons to represent settings, alerts, and umbrella status.
- A clean and intuitive layout, focusing on easy access to key features and information.
- Subtle animations for weather updates and BLE connection status to enhance user experience.