import React, { useEffect, useState,useRef } from 'react';
import { Session } from 'next-auth';
import { conversationRef, getMessageData } from '@/app/lib/firebaseConfig';
import { onSnapshot } from 'firebase/firestore';
import { DocumentData } from 'firebase-admin/firestore';

interface Message {
  sender: string;
  message: string;
  name: string;
  timestamp: { seconds: number; nanoseconds: number };
}

interface ChatProps {
  selectedFriend: string;
  session: Session;
}

const Chat: React.FC<ChatProps> = ({ selectedFriend, session }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const getMessages = async () => {
      if (session.user?.email && selectedFriend) {
        const messageRef = await conversationRef(session.user?.email, selectedFriend);

        // Subscribe to changes in the messageRef collection
        const unsubscribe = onSnapshot(messageRef, (snapshot) => {
          // Get the updated message data
          const updatedMessagesData: DocumentData[] = snapshot.docs.map((doc) => doc.data());
          if (updatedMessagesData&&session.user?.email) {
            const sortedMessages = sortMessages(updatedMessagesData, session.user?.email);
            setMessages(sortedMessages);
          }
        });
  
        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
      }
    };
  
    getMessages();
    if(selectedFriend===''){
      setMessages([]);
    }
  }, [session, selectedFriend]);
  useEffect(() => {
    // Scroll to the newest message when the messages state changes
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  const sortMessages = (messageData: DocumentData[], currentUserEmail: string) => {
    const convertedMessages: Message[] = messageData.map((doc: any) => {
      const data = doc;
      return {
        sender: data.sender,
        message: data.message,
        name: data.name,
        timestamp: data.timestamp,
      };
    });
  
    // Sort the messages first by sender (current user on the left, other user on the right)
    convertedMessages.sort((a, b) => {
      if (a.sender === currentUserEmail && b.sender !== currentUserEmail) {
        return -1;
      } else if (a.sender !== currentUserEmail && b.sender === currentUserEmail) {
        return 1;
      } else {
        return 0; // both messages have the same sender or are from other users
      }
    });
  
    // Within each group (current user and other user), sort by timestamp in ascending order
    convertedMessages.sort((a, b) => {
      const timestampA = a.timestamp?.seconds || 0;
      const timestampB = b.timestamp?.seconds || 0;
      return timestampA - timestampB;
    });
  
    return convertedMessages;
  };

  // Format timestamp to a human-readable date string
  const formatTimestamp = (timestamp: { seconds: number; nanoseconds: number }) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString();
    } else {
      return "Timestamp not available";
    }
  };
  return (
    <>
<div>
  {messages.map((message, index) => (
    <div
      key={index}
      style={{
        textAlign: message.sender === session.user?.email ? 'right' : 'left',
        margin: '8px 0',
        wordWrap: 'break-word',
        overflow: 'auto',  
        whiteSpace: 'pre-wrap', 
        width: '1550px',
      }}
    >
      <p style={{ display: 'flex', flexDirection:'column' }}>
        {message.sender !== session.user?.email ? (
          <>
            <div style={{ 
              display: 'flex',
              justifyContent: 'flex-start',
              overflow: 'auto', whiteSpace: 'pre-wrap',
              width: '1000px' 
            }}>
            <div style={{paddingRight:'10px', width:'100px'}}>
              <strong>{message.name}: </strong>
            </div>
            <div>
             {message.message}
            </div>
          </div>
          </>
        ) : (
          <>
          <div style={{display:'flex',justifyContent: 'flex-end'}}>           
          <div style={{paddingRight:'10px', width:'100px'}}>
                {message.message}
              </div>
              <div>
                <strong>: {message.name}</strong>
              </div>
          </div>
          </>
        )}
      </p>
      <p>{formatTimestamp(message.timestamp)}</p>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>
    </>
  );
};

export default Chat;
