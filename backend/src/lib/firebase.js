import admin from 'firebase-admin';

const initializeFirebase = () => {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      console.warn('[Firebase] WARNING: FIREBASE_SERVICE_ACCOUNT_KEY is missing. Phone verification will fail.');
      return;
    }

    const serviceAccount = JSON.parse(serviceAccountKey);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('[Firebase] Admin SDK initialized successfully');
  } catch (error) {
    console.error('[Firebase] Initialization Error:', error.message);
  }
};

initializeFirebase();

export { admin };
