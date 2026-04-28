"use client";

import {
  SignInButton,
  SignedOut,
  SignedIn,
  useUser,
  SignInWithMetamaskButton
} from '@clerk/nextjs'
import { BrowserProvider, Contract } from 'ethers';
import { useEffect, useState } from "react";


export default function Results() {
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
  const [games, setGames] = useState<{ name: string; voteCount: number }[]>([]);
  const [pollOpen, setPollOpen] = useState<boolean | null>(null);
  const [totalVotes, setTotalVotes] = useState<number | null>(null);
  const [closeMessage, setCloseMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      if (!(window as any).ethereum) return;
      const provider = new BrowserProvider((window as any).ethereum);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
      
      const open = await contract.pollOpen();
      setPollOpen(open);

      const gamesData = await contract.getGames();
      setGames(gamesData.map((game: any) => ({ name: game.name, voteCount: game.voteCount })));

      const total = await contract.totalVotes();
      setTotalVotes(Number(total));
    }
    if (isLoaded) checkStatus();
  }, [user, isLoaded]);

  async function closePoll() {
    if (!(window as any).ethereum) return;
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.closePoll();
      await tx.wait();
      setPollOpen(false);
      setCloseMessage('Poll closed successfully!');
    } catch (err: any) {
      console.error('Error: ' + (err.reason || err.message));
      setCloseMessage('Error closing poll: ' + (err.reason || err.message));
    }
  }

  return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-4 text-center">
        <h1 className="font-black text-[50px] tracking-[-3px] text-black font-bold underline normal-case small-caps text-center mx-auto">
          What Will Rowan Play Today?
        </h1>
        <img src="/drumroll.gif" alt="drumroll" className="p-4 my-4" />

        <p className="text-lg text-gray-700 mt-2">Total Votes: {totalVotes !== null ? totalVotes : 'Loading...'}</p>

        <div className="flex flex-row gap-6 mt-8">
          <div className="flex flex-col items-center gap-3">
            <img src="/r6-logo.png" alt="Rainbow Six" className="w-48 h-48 object-cover rounded-lg" />
            <p className="text-lg text-gray-700 mt-2">{games[0]?.voteCount} votes</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <img src="/LoL-Symbol.png" alt="League of Legends" className="w-48 h-48 object-cover rounded-lg" />
            <p className="text-lg text-gray-700 mt-2">{games[1]?.voteCount} votes</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <img src="/Apex-Legends-Logo.png" alt="Apex Legends" className="h-48 object-cover rounded-lg" />
            <p className="text-lg text-gray-700 mt-2">{games[2]?.voteCount} votes</p>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mt-8">{pollOpen ? "Poll is still open! If you are the owner, you can close it!" : "Poll is closed!"}</h2>
        <SignedIn>
          {pollOpen && (
            <button
              onClick={() => closePoll()}
              className="bg-[#E8151B] text-white rounded-full font-medium text-sm h-10 px-4 cursor-pointer">
              Close the poll?
            </button>
          )}
          {closeMessage && (
            <p className="text-lg text-red-600 mt-4">{closeMessage}</p>
          )}
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign In to Attempt to Close Poll
            </button>
          </SignInButton>
        </SignedOut>
      </main>
  );
}
