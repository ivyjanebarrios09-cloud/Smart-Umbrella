import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzJNObeXMkJ8QhJwsPE_CAwEwm4l7koos",
  authDomain: "studio-2370514225-ff786.firebaseapp.com",
  projectId: "studio-2370514225-ff786",
  storageBucket: "studio-2370514225-ff786.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;