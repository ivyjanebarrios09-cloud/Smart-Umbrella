async function registerFCMToken(userId) {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
  
      const currentToken = await getToken(messaging, { vapidKey: "YOUR_PUBLIC_VAPID_KEY" });
      if (!currentToken) return;
  
      const userRef = db.collection('users').doc(userId);
      await userRef.set({
        fcmTokens: admin.firestore.FieldValue.arrayUnion(currentToken),
        lastUpdated: new Date()
      }, { merge: true });
  
      console.log("FCM token registered for user:", currentToken);
    } catch (err) {
      console.error(err);
    }
  }
  