"use client"

import Link from "next/link";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import { useState, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
// browserProvider is just the wrapper for metamask to make it work
// formatEther converts the balance from wei to eth 

const tabsBar = () => {
	const { user, isLoaded } = useUser();
  	const [balance, setBalance] = useState('');
	
	useEffect(() => {
		async function getBalance() {
			if (!user?.primaryWeb3Wallet || !window.ethereum) return;
			const provider = new BrowserProvider(window.ethereum);
			const bal = await provider.getBalance(user.primaryWeb3Wallet.web3Wallet);
			setBalance(parseFloat(formatEther(bal)).toFixed(4));
}
    if (isLoaded) getBalance();
}, [user, isLoaded]);

    return (
		<div className="navbar">
			<ul className="nav nav-tabs justify-content-center nav-fill">
				<li className="nav-item">
					<Link className="nav-link" href="/">
						Home
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" href="/game_vote">
						Game Vote
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" href="/results">
						Results
					</Link>
				</li>
			</ul>
			<div className="flex items-center gap-4">
			<SignedOut>
				<SignInButton>
				<button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
					Sign In
				</button>
				</SignInButton>

				{/* <SignUpButton>
				<button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
					Sign Up
				</button>
				</SignUpButton> */}
			</SignedOut>

			<SignedIn>
				{user?.primaryWeb3Wallet && (
					<p className="text-sm text-gray-500">
						{user.primaryWeb3Wallet.web3Wallet.slice(0,6)}...{user.primaryWeb3Wallet.web3Wallet.slice(-4)}
					</p>)}
				{balance && <p className="text-sm font-medium">{balance} tBNB</p>}
				<UserButton />
			</SignedIn>
			</div>

  		</div>
		)}

export default tabsBar;