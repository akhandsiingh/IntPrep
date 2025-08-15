const admin = require("firebase-admin")

// Initialize Firebase Admin SDK
// Add your Firebase service account key here
// const serviceAccount = require("../config/firebase-service-account.json")

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error("Token verification error:", error)
    res.status(401).json({ message: "Invalid token" })
  }
}

module.exports = { verifyToken }
