"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import '../styles/SigninButton.css';
import { Avatar } from '@mui/material'
const SigninButton = () => {
  const { data: session } = useSession();
  const userProfileImage = session?.user?.image || '';
  if (session && session.user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p>Hi,</p>
        <Avatar alt={session?.user?.name || 'User'} src={userProfileImage} style={{width: '30px',height:'30px',margin:'5px'}}/>
        <p>{session.user?.name}</p>
        
        <button onClick={() => signOut()}  className='Button'>
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <button onClick={() => signIn('google')} className="Button">
      Sign In
    </button>
    
  );
};

export default SigninButton;