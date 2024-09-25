import { useEffect, useState } from 'react'
import { sequenceWaas, googleClientId } from "./SequenceEmbeddedWallet";

import './App.css'
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";

function App() {
  const [walletAddress, setWalletAddress] = useState<any>(null)

  const handleGoogleLogin = async (tokenResponse: CredentialResponse) => {
    try {
      const res = await sequenceWaas.signIn(
        {
          idToken: tokenResponse.credential!,
        },
        'Google Embedded Wallet React Boilerplate'
      );

      setWalletAddress(res.wallet);
    } catch (error) {
      console.error(error);
    }
  }

  const signOut = async () => {
    try {
      const sessions = await sequenceWaas.listSessions()

      for(let i = 0; i < sessions.length; i++){
        await sequenceWaas.dropSession({ sessionId: sessions[i].id })
      }
      setWalletAddress(null)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    
  }, [walletAddress])

  return (
    <>
    <h1 className='title'>Embedded Wallet Google Auth</h1>
    <div style={{position: 'fixed', top:'60px', right: '60px'}}>
    {walletAddress&&<p style={{cursor: 'pointer'}} onClick={() =>signOut()}>sign out</p>}
    </div>
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20vh',
        margin: 'auto'
    }}>
      {!walletAddress&&<GoogleOAuthProvider clientId={googleClientId}>
          <GoogleLogin
            key="google"
            onSuccess={handleGoogleLogin}
            width={100}
          />
        </GoogleOAuthProvider>}
        <p>{walletAddress}</p>
    </div>
    </>
  )
}

export default App
