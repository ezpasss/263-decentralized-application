"use client"
import { useUser, SignInWithMetamaskButton } from '@clerk/nextjs';
import { useState } from 'react';

export default function WalletConnect() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (user?.primaryWeb3Wallet) {
    const addr = user.primaryWeb3Wallet.web3Wallet;
    return (
      <p className="text-sm font-medium">
        ✓ {addr.slice(0,6)}...{addr.slice(-4)}
      </p>
    );
  }

  return (
    <div>
        <p className="text-sm font-medium">
          Connect your wallet to vote!
        </p>
        
        <div className="flex items-center gap-2">
        <SignInWithMetamaskButton>
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm h-10 px-4 cursor-pointer">
            Sign In with MetaMask
            </button>
        </SignInWithMetamaskButton>
        </div>
    </div>
  );
}