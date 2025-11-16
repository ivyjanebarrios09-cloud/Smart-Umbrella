/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onValueWritten } = require('firebase-functions/v2/database');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const fcm = admin.messaging();

setGlobalOptions({ maxInstances: 10 });

exports.onUmbrellaDisconnect = onValueWritten(
  '/weather/{umbrellaId}',
  async (event) => {
    // We only care about updates, not creations or deletions for this logic
    if (!event.data.before.exists() || !event.data.after.exists()) {
      return;
    }

    const beforeData = event.data.before.val();
    const afterData = event.data.after.val();

    // Check if the umbrella just disconnected
    if (beforeData.current?.connected === true && afterData.current?.connected === false) {
      const umbrellaId = event.params.umbrellaId;
      console.log(`Umbrella ${umbrellaId} disconnected. Preparing to send alert.`);

      try {
        // Find the user associated with this umbrella.
        // This query assumes there's a way to link an umbrella ID back to a user.
        // A common pattern is to have an 'umbrellas' collection where docs are named by umbrellaId
        // and contain a 'userId' field. For this example, we'll query for it.
        const usersSnapshot = await db.collectionGroup('umbrellas').where('bleDeviceId', '==', umbrellaId).limit(1).get();

        if (usersSnapshot.empty) {
          console.log(`No user found for umbrella ID: ${umbrellaId}`);
          return;
        }

        const userDoc = usersSnapshot.docs[0];
        const userId = userDoc.data().userId;

        // Now get the user's profile to find their FCM token
        const userProfileRef = db.collection('users').doc(userId);
        const userProfileSnap = await userProfileRef.get();

        if (!userProfileSnap.exists) {
          console.log(`User profile not found for userId: ${userId}`);
          return;
        }

        const fcmToken = userProfileSnap.data().fcmToken;
        if (!fcmToken) {
          console.log(`FCM token not found for user: ${userId}`);
          return;
        }

        // --- Send Push Notification via FCM v1 API ---
        const notificationMessage = 'It looks like you left your umbrella behind!';
        const payload = {
          token: fcmToken,
          notification: {
            title: 'Umbrella Left Behind!',
            body: notificationMessage,
          },
          webpush: {
            fcmOptions: {
              link: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/dashboard/notifications`,
            },
          },
        };

        await fcm.send(payload);
        console.log(`Successfully sent notification to user: ${userId}`);

        // --- Create Notification Log ---
        const notificationLog = {
          userId,
          umbrellaId,
          type: 'left_behind',
          message: notificationMessage,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };

        await db
          .collection('users')
          .doc(userId)
          .collection('notification_logs')
          .add(notificationLog);
        console.log(`Notification log created for user: ${userId}`);

      } catch (error) {
        console.error('Error sending disconnect alert:', error);
      }
    }
  }
);
