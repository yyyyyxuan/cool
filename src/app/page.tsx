'use client'
import { signIn, signOut } from 'next-auth/react';

const LoginPage = () => {
  return (
    <>
      <div>
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      </div>
      <div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    </>

  );
};

export default LoginPage;
