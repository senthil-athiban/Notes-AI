import React from 'react'
import { SignUp} from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className='flex h-screen justify-center items-center'>
        <SignUp appearance={{variables: {colorPrimary: "#0F172A"}}} />
    </div>
  )
}

export default SignUpPage