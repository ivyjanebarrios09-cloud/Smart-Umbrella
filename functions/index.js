const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// This triggers when umbrella_status changes in Realtime Database
exports.sendUmbrellaAlert = functions.database
  .ref("/umbrella/status")
  .onUpdate(async (change, context) => {
    const newStatus = change.after.val();

    // Only send notification if umbrella is missing
    if (newStatus !== "missing") return null;

    console.log("Umbrella missing! Sending push notification...");

    // Retrieve saved tokens
    const tokensSnap = await admin.database().ref("/tokens").once("value");
    if (!tokensSnap.exists()) {
      console.log("No tokens saved");
      return null;
    }

    const tokens = Object.values(tokensSnap.val());

    const payload = {
      notification: {
        title: "Umbrella Alert!",
        body: "Your umbrella was left behind!",
      },
    };

    return admin.messaging().sendToDevice(tokens, payload);
  });
