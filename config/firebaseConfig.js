import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyA1ELhCHOBFKjVe_aHZY6wC0yn7-u5_rZk",
    authDomain: "nspeed-d89cf.firebaseapp.com",
    databaseURL: "https://nspeed-d89cf-default-rtdb.firebaseio.com",
    projectId: "nspeed-d89cf",
    storageBucket: "nspeed-d89cf.firebasestorage.app",
    messagingSenderId: "828466920001",
    appId: "1:828466920001:ios:85cb30e1571e01231d24c0"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
