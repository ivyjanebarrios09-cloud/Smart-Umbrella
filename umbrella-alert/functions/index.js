cat > index.js <<EOL
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.reportUmbrella = functions.https.onRequest(async (req, res) => {
  try {
    const data = req.body;
    if (!data.umbrellaId || typeof data.connected !== "boolean") {
      return res.status(400).send("Invalid request data");
    }

    await db.collection("umbrellas").doc(data.umbrellaId).set({
      connected: data.connected,
      timestamp: admin.firestore.Timestamp.now()
    }, { merge: true });

    if (!data.connected) {
      console.log(\`Umbrella \${data.umbrellaId} disconnected!\`);
    }

    res.status(200).send("Status updated");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

exports.getUmbrellaStatus = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await db.collection("umbrellas").get();
    const umbrellas = {};
    snapshot.forEach(doc => umbrellas[doc.id] = doc.data());
    res.status(200).json(umbrellas);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
EOL
