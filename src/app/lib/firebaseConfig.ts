
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, arrayUnion,getDoc,setDoc,addDoc } from "firebase/firestore";
import { onSnapshot,serverTimestamp, } from 'firebase/firestore';

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
const key = process.env.REACT_APP_API_KEY;  
export async function getUserByEmail(email:any) {
    console.log(key)
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      return null;
    }
  }
  export async function conversationRef(currentUserEmail: any, friendEmail: any) {
    const conversationCollection = collection(db, "conversations");
  
    // Fetch all conversations where the participants include both currentUserEmail and friendEmail
    const q = query(conversationCollection, 
      where("participants", "array-contains", currentUserEmail)
    );
    const querySnapshot = await getDocs(q);
    // Filter the conversations to find the one with both participants
    const conversationDoc = querySnapshot.docs.find(doc => {
      const participants = doc.data().participants;
      return participants.includes(currentUserEmail) && participants.includes(friendEmail);
    });
    // If the conversation exists, return the messages collection reference
    if (conversationDoc) {
      const messagesCollectionRef = collection(conversationDoc.ref, "messages");
      return messagesCollectionRef;
    } else {
      // If the conversation does not exist, create a new document and its messages subcollection
      const newConversationRef = await addDoc(conversationCollection, {
        participants: [currentUserEmail, friendEmail]
      });
      const messagesCollectionRef = collection(newConversationRef, "messages");
      return messagesCollectionRef;
    }
  }
  
  
  export async function conversationData(currentUserEmail:any, friendEmail:any) {
    // Get the reference to the messages subcollection using the conversationRef function
    const messagesCollectionRef = await conversationRef(currentUserEmail, friendEmail);
  
    // Get the parent conversation document reference
    const conversationDocRef = messagesCollectionRef.parent;
  
    // Get the conversation data using the parent document reference
    if(conversationDocRef){
      const conversationDocSnapshot = await getDoc(conversationDocRef);
    // Check if the conversation document exists
    if (conversationDocSnapshot.exists()) {
      // Get the data from the conversation document
      const conversationData = conversationDocSnapshot.data();
      return conversationData;
    } else {
      // Conversation document not found
      return null;
    }
    }
  }

  export async function addFriend(currentUserEmail: any, friendEmail: any) {
    const userData = await getUserByEmail(currentUserEmail);
    const friendRef = await getUserRef(friendEmail);
    const userRef = await getUserRef(currentUserEmail);
    if (currentUserEmail === friendEmail) {
      return;
    }
    if (userData && friendRef && userRef) {
      if (!userData.friends) {
        // If userData.friends is undefined, initialize it as an empty array
        userData.friends = [];
      }
      // Now, userData.friends is guaranteed to be an array (either existing or newly created)
      if (userData.friends.includes(friendEmail)) {
        return;
      } else {
        await updateDoc(friendRef, {
          friendRequests: arrayUnion(currentUserEmail),
        });
      }
    }
  }

  export async function removeFriend(userEmail:any, friendEmail:any){
    const userRef = await getUserRef(userEmail);
    const userData = await getUserByEmail(userEmail);
    const friendRef = await getUserRef(friendEmail);
    const friendData = await getUserByEmail(friendEmail);
    if(userData && friendData && userRef && friendRef){
      const updatedUserFriends = userData.friends.filter((email: string) => email !== friendEmail);
      const updatedFriendFriends = friendData.friends.filter((email: string) => email !== userEmail);
      await updateDoc(userRef,{
        friends: updatedUserFriends,
      });
      await updateDoc(friendRef,{
        friends: updatedFriendFriends,
      });
    }
  }
  export async function DisplayFriendReq(currentUserEmail: any) {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", currentUserEmail));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      const friendRequests = userData.friendRequests;
      return friendRequests ? friendRequests : [];
    } else {
      return [];
    }
  }

  export async function removeFriendRequest(currentUserEmail: any, friendEmail: any) {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", currentUserEmail));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data().friendRequests;
      const updatedUserData = userData.filter((friendEmail: string) => friendEmail !== friendEmail);
      const userDocRef = querySnapshot.docs[0].ref;
      await setDoc(userDocRef, { friendRequests: updatedUserData }, { merge: true });
    }
  }
  

  export async function getUserRef(currentUserEmail: any) {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", currentUserEmail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].ref;
      } else {
        return null;
      }
    } catch (error) {;
      return null;
    }
  }

  
  export async function acceptFriendRequest(currentUserEmail: string, friendEmail: string) {
    if(currentUserEmail){
      try {
        const userRef = await getUserRef(currentUserEmail);
        const userData = await getUserByEmail(currentUserEmail);
        const friendRef = await getUserRef(friendEmail);
        const friendData = await getUserByEmail(friendEmail);
    
        if (userRef && userData && friendRef && friendData) {
          const userFriendRequests = userData.friendRequests || [];
          const friendRequests = friendData.friendRequests || [];
          const updateduserFriendRequests = userFriendRequests.filter((email: string) => email !== friendEmail);
          const updatedFriendRequests = friendRequests.filter((email: string) => email !== currentUserEmail);
          console.log( updatedFriendRequests);
          await updateDoc(userRef, {
            friendRequests: updateduserFriendRequests,
          });
          await updateDoc(friendRef, {
            friendRequests: updatedFriendRequests,
          });
          const userFriends = userData.friends || [];
          await updateDoc(userRef, {
            friends: [...userFriends, friendEmail],
          });
          const friendFriends = friendData.friends || [];
          await updateDoc(friendRef, {
            friends: [...friendFriends, userData.email],
          });
          await getDoc(friendRef).then((doc) => {
            if(doc){
              console.log(doc.data())
            }
          })
        } 
      } catch (error) {
        console.error("Error accepting friend request:", error);
      }
    }
  }


  export async function getMessageData(currentUserEmail: any, friendEmail: any) {
    const messageRef = await conversationRef(currentUserEmail, friendEmail);
  
    if (messageRef) {
      const querySnapshot = await getDocs(messageRef);
      const messagesData = querySnapshot.docs.map((doc) => doc.data());
      return messagesData;
    }
  }
  export async function sendMessage(currentUserEmail: any, friendEmail: any, message: any) {
    const messageRef = await conversationRef(currentUserEmail, friendEmail);
    const userData = await getUserByEmail(currentUserEmail);
    console.log(messageRef);
    if (messageRef&&userData) {
      await addDoc(messageRef, {
        sender: currentUserEmail,
        message: message,
        name: userData.name,
        timestamp: serverTimestamp(),
      });
    }
  }

export async function getFriendNames(emails: string[]): Promise<string[]> {
  if (!emails || emails.length === 0) {
    return []; // Return an empty array if the 'emails' array is empty or undefined
  }
  const names: string[] = [];
  const q = query(collection(db, "users"), where("email", "in", emails));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const name = doc.data().name;
    names.push(name);
  });
  
  return names;
}

export async function getFriendImages(emails:any){
  const images:any=[]
  try{
    const userDocs = await Promise.all(emails.map(async (email:any) => {
      const userDocs = await Promise.all(
        emails.map((email:any) => {
          const usersRef = collection(db, 'users');
          const queryByEmail = query(usersRef, where('email', '==', email));
          return getDocs(queryByEmail);
        })
      );
      userDocs.forEach((querySnapshot) => {
        querySnapshot.forEach((doc:any) => {
          const data = doc.data();
          if (data.image) {
            images.push(data.image);
          }
        });
      });
    }))
  }catch(e){

  }finally{
    if(images.length>0){
      return images;
    }else{
      return [];
    }
  }
}