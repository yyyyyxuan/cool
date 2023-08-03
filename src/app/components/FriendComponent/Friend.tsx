import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import FriendSearch from './FriendSearch';
import FriendRequests from './FriendRequests';
import FriendList from './FriendList';
import '../../styles/Friend.css'
interface FriendProps {
    session: Session; // Assuming the Session type comes from 'next-auth'
    onFriendSelect: (friendName: string) => void;
  }
  
const Friend: React.FC<FriendProps> = ({ session,onFriendSelect}) => {
    const [selectedFriend, setSelectedFriend] = useState('');
    const handleFriendSelect = (friendName:any) => {
        setSelectedFriend(friendName);
        onFriendSelect(friendName);
      };

    return (
        <div>
            <div  className='friendSearch'>
                <h1 style={{fontSize: '15px'}}>Search For Friends</h1>
                <FriendSearch session={session}/>
            </div>
            <div   className='friendRequests'>
                <h1 style={{fontSize:'15px'}}>Friend Requests</h1>
                <FriendRequests session={session}/>
            </div>
            <div className='friendList'>
                <h1 style={{fontSize:'15px'}}>Chats</h1>
                <FriendList onFriendSelect={handleFriendSelect}  session={session} />
            </div>
        </div>
    )
};

export default Friend;