import React, { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import { onSnapshot } from 'firebase/firestore';
import {  getUserByEmail, removeFriend,getUserRef,getFriendNames,getFriendImages, setGroup, returnGroupName } from '@/app/lib/firebaseConfig';
import Button from '@mui/material/Button';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';

interface FriendListProps {
  session: Session;
  onFriendSelect: (friend: string) => void;
}
const FriendSearch: React.FC<FriendListProps> = ({ session,onFriendSelect}) => {
  const [friends, setFriends] = useState<string[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string>('');
  const [friendNames, setFriendNames] = useState<string[]>([]);
  const [friendImages, setFriendImages] = useState<string[]>([]); 
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [mygroupName,setmyGroupName] = useState<string[]>([]);
  const [getGroup,setgetGroup]= useState<string[]>([]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const getFriendsData = async () => {
      const userData = await getUserByEmail(session.user?.email);
      const userRef = await getUserRef(session.user?.email);
      const groupNames: string[] =  await returnGroupName(session.user?.email??"");
      setmyGroupName(groupNames);
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
  const handleAddGroup = async () => {
    await setGroup(selectedMembers,groupName,session.user?.email??"")
    setOpen(false);
  };
  const formatSelectedNames = () => {
    if (selectedMembers.length === 1) {
      return friendNames[friends.findIndex((friend) => friend === selectedMembers[0])];
    } else if (selectedMembers.length === 2) {
      return `${friendNames[friends.findIndex((friend) => friend === selectedMembers[0])]}, ${friendNames[friends.findIndex((friend) => friend === selectedMembers[1])]}`;
    } else if (selectedMembers.length > 2) {
      return `${friendNames[friends.findIndex((friend) => friend === selectedMembers[0])]}, ${friendNames[friends.findIndex((friend) => friend === selectedMembers[1])]} ...`;
    } else {
      return '';
    }
  };
  
  return (
    <>
    <div> 
      <Button
        variant='contained'
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
        onClick={()=>handleClickOpen()}
      >Add Group</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the group name:
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Group Name'
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div>
          <DialogContentText>
            Please select members:
          </DialogContentText>
          <FormControl fullWidth>
          <Select
            multiple
            value={selectedMembers}
            onChange={(e) => setSelectedMembers(e.target.value as string[])}
            fullWidth

          >
            {friends.map((friend,index) => (
              <MenuItem key={index} value={friend}>
                {friendNames[index]}
              </MenuItem>
            ))}
          </Select>
          </FormControl>

          </div>
          <DialogContentText>
            Selected members: {formatSelectedNames()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddGroup}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
    <div  style={{ display: 'flex',flexDirection:'column',height:'90%',width:'99%' ,maxHeight:'500px',maxWidth:'280px',overflow:'auto'}}>
      {mygroupName.map((gN, index) => (
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
                  justifyContent: 'flex-start'
                }}
                onClick={() => handleClickFriend(gN)}
              >
                {gN}
            </Button>
            <IconButton onClick={() => handleRemoveFriend(friend)}>
              <PersonRemoveIcon style={{color:'black'}}/>
            </IconButton>
        </div>
      ))}
    </div>
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
                  justifyContent: 'flex-start'
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

    </>
  );
};

export default FriendSearch;
