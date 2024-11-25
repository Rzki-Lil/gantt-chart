
if (!window.FIREBASE_API_KEY) {
    console.error('Firebase environment variables belum dimuat!');
    throw new Error('Firebase configuration tidak tersedia');
}

const firebaseConfig = {
    apiKey: window.FIREBASE_API_KEY,
    authDomain: window.FIREBASE_AUTH_DOMAIN,
    databaseURL: window.FIREBASE_DATABASE_URL,
    projectId: window.FIREBASE_PROJECT_ID,
    storageBucket: window.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID,
    appId: window.FIREBASE_APP_ID
};

let db;

try {
    // Cek Firebase sudah diinisialisasi
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app(); 
    }
    
    db = firebase.firestore();
    console.log("Firebase berhasil diinisialisasi");
} catch (error) {
    console.error("Error inisialisasi Firebase:", error);
    alert("Gagal menginisialisasi Firebase. Silakan muat ulang halaman.");
}

export { db }; 