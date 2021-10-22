import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC_V0kvoddWytH3_DrqJ-rOoSOpRYCL-Kg',  // This is non-secret. https://firebase.google.com/docs/projects/api-keys
  authDomain: 'better-sg-attendance.firebaseapp.com',
  projectId: 'better-sg-attendance',
};

interface FirebaseResources {
  app: firebase.app.App
  fs: firebase.firestore.Firestore
  auth: firebase.auth.Auth
}

let globalResources: FirebaseResources | undefined;

export function initFirebase() {
  if (firebase.apps.length === 0 || globalResources === undefined) {
    console.log('Cold start - initializing Firebase resources.');
    const app = firebase.initializeApp(firebaseConfig);
    globalResources = {
      app,
      fs: app.firestore(),
      auth: app.auth()
    };
  }
  return globalResources;
}