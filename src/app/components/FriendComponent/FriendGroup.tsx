import React from 'react'
import {Session} from 'next-auth'
interface FriendGroup {
    session: Session;
  }
const FriendGroup: React.FC<FriendGroup> = ({session}) => {
    console.log(session.user?.name)
  return (
    <div>
      <p>{session.user?.name}</p>
    </div>
  )
}

export default FriendGroup
