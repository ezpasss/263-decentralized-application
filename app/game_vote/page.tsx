"use client";

import Link from 'next/link';
import {
  SignInButton,
  SignedOut,
  SignedIn,
  useUser,
  SignInWithMetamaskButton
} from '@clerk/nextjs'
import { BrowserProvider, Contract } from 'ethers';
import { useEffect, useState } from "react";


export default function game_vote() {
  const CONTRACT_ADDRESS = "0x9e2CbE59bE380dc1E10FFf07Ff2fd46f6A31514d";

  const ABI = [
    "function vote(uint gameIndex) public",
    "function closePoll() public",
    "function getGames() public view returns (tuple(string name, uint voteCount)[])",
    "function getVoteCount(uint gameIndex) public view returns (uint)",
    "function pollOpen() public view returns (bool)",
    "function totalVotes() public view returns (uint)",
    "function hasVoted(address) public view returns (bool)"];

  const { user, isLoaded } = useUser();
  const [voted, setVoted] = useState<boolean | null>(null);
  const [pollOpen, setPollOpen] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkStatus() {
      if (!window.ethereum) return;
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
      
      const open = await contract.pollOpen();
      setPollOpen(open);

      if (user?.primaryWeb3Wallet) {
        const result = await contract.hasVoted(user.primaryWeb3Wallet.web3Wallet);
        setVoted(result);
      }
    }
    if (isLoaded) checkStatus();
  }, [user, isLoaded]);
  
  async function vote(gameIndex: number) {
    if (!window.ethereum) return;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.vote(gameIndex);
      await tx.wait();
      setVoted(true);
    } catch (err: any) {
      console.error('Error: ' + (err.reason || err.message));
    }
  }

  return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-4 text-center">
        <h1 className="font-black text-[50px] tracking-[-3px] text-black font-bold underline normal-case small-caps text-center mx-auto">
          What Should Rowan Play Today?
        </h1>
        <img src="/what_play.jpg" alt="what to play" className="w-[400px] h-[256px] object-contain p-4 my-4" />

        <SignedOut>
          <SignInButton>
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign In to Vote
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          {pollOpen === false && (
            <p className="text-lg text-red-600 mt-4">The poll is closed.</p>
          )}
          {pollOpen === true && voted === false && (
            <p className="text-lg text-gray-600 mt-4">
              Cast your vote for the game Rowan should play today! Choose from the options below:
            </p>
          )}
          {pollOpen === true && voted === true && (
            <div>
              <p className="text-lg text-green-600 mt-4">You have already voted!</p>
              <Link href="/results" className="text-blue-500 underline mt-2">See current results</Link>
            </div>
          )}

          <div className="flex flex-row gap-6 mt-8">

          <div className="flex flex-col items-center gap-3">
            <img src="/r6-logo.png" alt="Rainbow Six" className="w-48 h-48 object-cover rounded-lg" />
            {!voted && (
              <button
                onClick={() => vote(0)}
                className="bg-[#E8151B] text-white rounded-full font-medium text-sm h-10 px-4 cursor-pointer">
                Vote for Rainbow Six!
              </button>
            )}
          </div>
          <div className="flex flex-col items-center gap-3">
            <img src="/LoL-Symbol.png" alt="League of Legends" className="w-48 h-48 object-cover rounded-lg" />
            {!voted && (
              <button
                onClick={() => vote(1)}
                className="bg-[#0BC4E3] text-white rounded-full font-medium text-sm h-10 px-4 cursor-pointer">
                Vote for League of Legends!
              </button>
            )}
          </div>
          <div className="flex flex-col items-center gap-3">
            <img src="/Apex-Legends-Logo.png" alt="Apex Legends" className="h-48 object-cover rounded-lg" />
            {!voted && (
              <button
                onClick={() => vote(2)}
                className="bg-[#8B0000] text-white rounded-full font-medium text-sm h-10 px-4 cursor-pointer">
                Vote for Apex Legends!
              </button>
            )}
          </div>
        </div>
        </SignedIn>

      </main>
  );
}
