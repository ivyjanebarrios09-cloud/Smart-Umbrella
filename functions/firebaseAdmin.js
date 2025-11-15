const admin = require('firebase-admin');
const serviceAccount = require('./"type": "service_account"
  "project_id": "studio-2370514225-ff786",
  "private_key_id":"2f51f86e5a5d42c1bbaffe3dee64706aca735a29",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDiSLJI5X6pX5BI\nF9yxz67OJvSmN+uJm0z7FgJPe/5+G0CmawUae1PlRSVnbYvuaqkdvMMQsntDzN12\nvQrpsJEMOsJnZvcvE+1wqGLjFFzSP1XgMo+fgoOicOcwKXRqW/1OEIQiNTuP8Js9\nWO3ZhTkQiHe3HSsHcEZ1qC8jELJIq1Z3NBv5YJagkSqC/UUfsG9xEF0uu0uSTt8q\n90xzN7QJouL+RB2DYdAA23nDpZ+7PhXXaukLmEmUbG8K8SzaN0hCUuaYwvZtllse\nunuUbJnBnfoOUCNr4+Aaw29a9+fskbUh2zOk4++nfiDd696kXFM+FZhMQt0V0sLZ\nofV+RuItAgMBAAECggEACDHPGF9h5uBUaUfz8LyEqBKLvuPniQ7cCtEROa+pLQfv\nn2yLaBoZ6ljxXH2AbnHjuJ/4BcgbjqkB8Xrcb6S6m/waGNncZGgPATVtNKwCxdpl\nUb6C/6kfpeemIlMIqZFglaMjey78/olywGtSsb3mrc1DXe5Ae1R642fjzRvzA46f\ncxPZ7aGAEn1u/Pq+enMKW0LXvxQ/yggQnlbJNajzWCsVytPCBWkbkuqjRfQgpTIa\nKD0ERA6YnkcJxaUmnjgL+k23S4nL6rp67WP7CqcYcjCuqITXL/HAxakVrgtuYR4C\neRULzY6CqJrHMwM2CYrOcWXH0QvVqrw3zsBySlJIQQKBgQD2ZkFzZnSKYmzcZtQd\nn0QhdML4GIc79YN8stzoJ7DlbjZMkdJMPK5axsBk1iXAdKBM2VxY1ilDmlDJWkt6\nDJles13GQ16RB77UZaS+GfU64L7pBNhTA6QakGQwzg9ZQf7b8MAHI88psO4k94UM\n5dFDKPKUedVttQ1AS1/UFCc1iwKBgQDrGcvcw70fXzOtok1PyVHmCvyH+Lh/ZwV9\nZFH0f6TmpfLZF/+tMfDoIv/zf2XZF7jkpB1SibD2yBh6U5FkM5XousioQJB2vlIG\nvKeG+V9zKYXOdmTcjBpNFRojUYjfAK4TGwJ8MAEwxfCm/yqW1zB1Koq439cjTrwH\n/Pj1G2RuJwKBgCbgE0uFyrVauho8DxNtYW514Z0LIasQHWK7RadLO9m2/dIu36Mv\nn8KqwQgn0WUAAZqeYLeTcoc7/asHGAl1m20Zl54EWxM+yZjxQIDNz6cudnCFVywh\n0u5uAaDBoiJPC0rgPSvjNng5dhlXBCL4z39tInjSkB3zBtgyDDiFxXnpAoGAOBV1\nTnrbWOqLF3bKXqg2A1zHlWA+ExZudtVBv8PbgLJB1owlEBoD0DzZNitEDp/cGZ8U\n56W1M4nUXQomevLbZiN4zrpoPAt24eiLRmWi4YQcSX5w3TQG6jCIhbhjoF83J5Of\n6iRBhHMTz6K7dDRteOXnJecwGVok/PraIQ6hzK0CgYEAn/VjGlw49uEzl5IcxWTm\nqupAo3AcABZ1UBi+f9V5P0c4Rfto3r+cu+o/XXQ0oWj3j1VckdY3bcnvEwboPak6\nzbV2P1i5ynQLFbnrlM7AcqFJD5BTBCvgy5qY0eIzoFJtXuYZz1Fre9/5tyuLSJcC\nOPHBAdWwJF296uUCYh//sY8=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@studio-2370514225-ff786.iam.gserviceaccount.com",
  "client_id": "118165561798464574005",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40studio-2370514225-ff786.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"); // replace with your JSON key path

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com", // replace with your database URL
  });
}

const db = admin.firestore(); // Firestore
const rtdb = admin.database(); // Realtime Database
const messaging = admin.messaging(); // FCM

module.exports = { admin, db, rtdb, messaging };
