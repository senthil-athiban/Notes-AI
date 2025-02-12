import React from 'react'
import {SignIn} from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className='flex h-screen justify-center items-center'>
        <SignIn appearance={{variables: {colorPrimary: "#0F172A"}}} />
    </div>
  )
}

export default SignInPage