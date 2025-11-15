const functions = require('firebase-functions');
const { db, messaging } = require('./firebaseAdmin');

exports.umbrellaAlert = functions.https.onRequest(async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).send({ error: 'Missing userId or message' });
    }

    await db.collection('alerts').add({
      userId,
      message,
      timestamp: new Date(),
    });

    await messaging.send({
      token: "<USER_FCM_TOKEN>", // replace with user's FCM token
      notification: {
        title: "Umbrella Alert!",
        body: message,
      },
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
});
