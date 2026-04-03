export async function onRequest(context) {
  return new Response(JSON.stringify({
    apiKey: context.env.FIREBASE_API_KEY,
    authDomain: context.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: context.env.FIREBASE_DB_URL,
    projectId: context.env.FIREBASE_PROJECT_ID,
    storageBucket: context.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: context.env.FIREBASE_MESSAGING_ID,
    appId: context.env.FIREBASE_APP_ID,
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
