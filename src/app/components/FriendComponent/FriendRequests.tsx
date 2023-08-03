import React, { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { DisplayFriendReq,removeFriendRequest,getUserByEmail,acceptFriendRequest,getUserRef } from '@/app/lib/firebaseConfig';
import IconButton from '@mui/material/IconButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';

interface FriendRequestsProps {
  session: Session;
}
const FriendSearch: React.FC<FriendRequestsProps> = ({ session }) => {
  const [friendRequests, setFriendRequests] = useState<string[]>([]);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await getUserByEmail(session.user?.email);
        const userRef = await getUserRef(session.user?.email);
        if (userData && userData.friendRequests && userRef) {
          setFriendRequests(userData.friendRequests);
          const unsubscribe = onSnapshot(userRef, (docSnapshot: any) => {
            const updatedData = docSnapshot.data();
            if (updatedData && updatedData.friendRequests) {
              setFriendRequests(updatedData.friendRequests);
            }
          });
  
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    if (session?.user?.email) {
      getUserData();
    }
  }, [session]);

  const handleAcceptRequest = (friendEmail: string) => {
    if (session.user?.email) {
      acceptFriendRequest(session.user.email, friendEmail);
    } 
  };
  const handleDenyRequest = (friendEmail: string) => {
    removeFriendRequest(session.user?.email, friendEmail);
  };

  return (
    <div style={{overflow:'auto',maxHeight:'110px', width:'100%'}}>
      {friendRequests.map((friendRequest, index) => (
        <form>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
            style={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            flex: '1',
            }}>{friendRequest}</div>
            <IconButton onClick={() => handleAcceptRequest(friendRequest)}>
              <PersonAddIcon style={{color:'black'}}/>
            </IconButton>
            <IconButton onClick={() => handleDenyRequest(friendRequest)}>
              <PersonAddDisabledIcon style={{color:'black'}}/>
            </IconButton>
          </div>
        </form>
      ))}
    </div>
  );
};

export default FriendSearch;
