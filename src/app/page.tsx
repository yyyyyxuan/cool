'use client'
import { useState } from 'react';
import SigninButton from './components/SigninButton';
import Chat from './components/ChatComponent/Chat';
import { useSession } from "next-auth/react";
import Friend from './components/FriendComponent/Friend';
import ChatBar from './components/ChatComponent/ChatBar';
const LoginPage = () => {
  const [selectedFriend, setSelectedFriend] = useState('');
  const handleFriendSelect = (friendName: string) => {
    setSelectedFriend(friendName);
  };

  const { data: session } = useSession();
  if(session){
    return(
      <>
<div style={{ display: 'flex', height: '91vh' }}>
  <div style={{ flex: '0 0 300px', overflow: 'auto', margin: '10px', backgroundColor: '#f0f0f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
   <Friend onFriendSelect={handleFriendSelect} session={session}/>
  </div>
  <div style={{ display: 'flex', flexDirection: 'column', flex: '1',overflow:'hidden' }}>
    <div style={{  overflow: 'auto', margin: '10px', height:'100%', backgroundColor: '#f0f0f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
      <Chat selectedFriend={selectedFriend} session={session}/>
    </div>
    <div style={{  overflow: 'auto', margin: '10px', height: '200px', marginTop: 'auto', backgroundColor: '#f0f0f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
      <ChatBar selectedFriend={selectedFriend} session={session}/>
    </div>
  </div>
</div>



      </>
    )
  }
  else{
    return( 
    <div style={{padding:'10px'}}>
      <h1>Next.JS + Firestore messager clone</h1>
      <h2>Log in using Google.</h2>
    </div>
    )
  }
};

export default LoginPage;
