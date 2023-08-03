import React, { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import { onSnapshot } from 'firebase/firestore';
import {  getUserByEmail, removeFriend,getUserRef,getFriendNames,getFriendImages } from '@/app/lib/firebaseConfig';
import Button from '@mui/material/Button';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { get } from 'http';
interface FriendListProps {
  session: Session;
  onFriendSelect: (friend: string) => void;
}
const FriendSearch: React.FC<FriendListProps> = ({ session,onFriendSelect}) => {
  const [friends, setFriends] = useState<string[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string>('');
  const [friendNames, setFriendNames] = useState<string[]>([]);
  const [friendImages, setFriendImages] = useState<string[]>([]); 

  useEffect(() => {
    const getFriendsData = async () => {
      const userData = await getUserByEmail(session.user?.email);
      const userRef = await getUserRef(session.user?.email);
      
      if(userData && userData?.friends && userRef){
        const unsubscribe = onSnapshot(userRef, (docSnapshot: any) => {
          const updatedData = docSnapshot.data();
          if (updatedData && updatedData.friends) {
            setFriends(updatedData.friends);
          }
        });
        return () => unsubscribe();
      }
    };
    if(session.user?.email){
      getFriendsData();
    }
  }, [session,selectedFriend,onFriendSelect,session?.user?.email]);

useEffect(() => {
  const getFriendsData = async () => {
    const userData = await getUserByEmail(session.user?.email);
    const userRef = await getUserRef(session.user?.email);
    if (userData && userRef) {
      const userNamesArray: string[] = await getFriendNames(userData.friends);
      const userImagesArray: string[] = await getFriendImages(userData.friends);
      setFriendNames(userNamesArray);
      setFriendImages(userImagesArray);
    }
  };
  if (session.user?.email) {
    getFriendsData();
  }
}, [session]);



  const handleRemoveFriend = (friendEmail: string) => {
    removeFriend(session.user?.email, friendEmail);
    if(selectedFriend===friendEmail){
      setSelectedFriend('');
      onFriendSelect('');
    }
  };
  function handleClickFriend(friend: string): void {
    onFriendSelect(friend);
    setSelectedFriend(friend);
  }
  return (
    <div  style={{ display: 'flex',flexDirection:'column',height:'90%',width:'99%' ,maxHeight:'500px',maxWidth:'280px',overflow:'auto'}}>
      {friends.map((friend, index) => (
        <div key={index}>
              <Button
                variant="contained"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  background: 'none',
                  textTransform: 'none',
                  fontSize: 'inherit',
                  color: 'black',
                  margin: '5px',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  maxWidth: '180px',
                  minWidth: '180px',
                }}
                startIcon={<Avatar alt={friendNames[index]} src={friendImages[index]} />}
                onClick={() => handleClickFriend(friend)}
              >
                {friendNames[index]}
            </Button>
            <IconButton onClick={() => handleRemoveFriend(friend)}>
              <PersonRemoveIcon style={{color:'black'}}/>
            </IconButton>
        </div>
      ))}
    </div>
  );
};

export default FriendSearch;
