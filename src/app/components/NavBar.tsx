import React from 'react'
import '../styles/NavBar.css'
import SigninButton from './SigninButton'

export default function NavBar (){
    return(

        <div className='NavBar'>
            <div>
                <h1>
                    <span role="img" aria-label="cool">😎</span>
                    Very Cool Website
                </h1>
            </div>
            <div style={{ display: 'right'}}>
                <SigninButton />
            </div>
            
        </div>

    )
}