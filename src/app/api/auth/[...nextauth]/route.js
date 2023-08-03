
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";


import { collection, doc, setDoc,getDoc,query,where,getDocs } from "firebase/firestore"; 


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCRF2TO_JmyjB4gqZ23W-hEn-Ex40fa-kg",
    authDomain: "dabase-d5ba0.firebaseapp.com",
    projectId: "dabase-d5ba0",
    storageBucket: "dabase-d5ba0.appspot.com",
    messagingSenderId: "619405589719",
    appId: "1:619405589719:web:d5b6f8009c481fd2bf0492",
    measurementId: "G-1JGRM7BPN8"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
  

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID??"",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET??""
          })
    ],
    adapter: FirestoreAdapter({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
          }),
    }),
    callbacks: {
        async session(session, user) {
            const users = collection(db, "users");
            const q = query(users, where('email', '==', session.user.email));
            const querySnapshot = await getDocs(q); 

            if (querySnapshot.empty) {
                await setDoc(doc(users), {
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image,
                }) 
            }
            return session;
        }
    }
})

export {handler as GET, handler as POST};

