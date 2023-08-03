import { Session } from 'next-auth';
import React, { useState } from 'react';
import {sendMessage} from '@/app/lib/firebaseConfig';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
interface ChatBarProps {
  selectedFriend: string;
  session: Session;
}

const Chat: React.FC<ChatBarProps> = ({ selectedFriend, session }) => {
  const [chatValue, setChatValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(chatValue !== '' && selectedFriend !== '' && session.user?.email){
      sendMessage(session.user?.email, selectedFriend, chatValue);
    }
    setChatValue('');
  };

  return (
    <>
      <div style={{ height: "100%", width: "100%", overflow: 'hidden' }}>
        <form onSubmit={handleSubmit} style={{ height: "100%", width: "100%", padding: '10px', display: 'flex', alignItems: 'center' }}>
          <TextField
            id="outlined-multiline-static"
            multiline
            value={chatValue}
            onChange={handleInputChange}
            rows={4}
            style={{ width: '1000px' ,marginLeft:'150px',marginBottom:'20px'}}
          />
          <Button
            type="submit"
            style={{
              marginLeft: '10px',
              marginBottom: '20px',
              fontFamily: 'inherit', // Inherit the font from the parent element
              color: 'black', // Set the color to black
            }}
          >
            Send
          </Button>
        </form>
      </div>
    </>
  );
};

export default Chat;
