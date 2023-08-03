import React, { useState } from 'react';
import { Session } from 'next-auth';
import  { getUserByEmail, addFriend} from '@/app/lib/firebaseConfig';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
interface FriendSearchProps {
  session: Session; 
}

const FriendSearch: React.FC<FriendSearchProps> = ({ session }) => {
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try{
      addFriend(session.user?.email, searchValue);
      if(searchValue === session.user?.email){
        setError(true);
        setErrorMessage("Don't add urself dummy");
      }
      else{
        setError(false);
        setErrorMessage('');
      }
    }catch(e){

    }finally{
            setSearchValue('');
    }
    
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };


  return (
    <div >
      <form onSubmit={handleSubmit} style={{display:'flex',flexWrap:'wrap',alignItems:'center'}}>
        <TextField id="outlined-basic" 
         label="Enter Email"
         variant="outlined"
         placeholder='Search'
         value={searchValue}
         onChange={handleInputChange}
         error={error ? true : false}
         helperText={errorMessage}
         className='searchbar'
         />
        <IconButton type="submit" style={{color:'black', marginLeft: '8px'}}>
          <SendIcon />
        </IconButton>
      </form>
    </div>
  );
};

export default FriendSearch;
