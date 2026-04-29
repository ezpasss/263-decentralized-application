import Image from "next/image";

export default function Home() {
  return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-4 text-center">
        <h1 className="font-black text-[50px] tracking-[-3px] text-black font-bold underline normal-case small-caps text-center mx-auto">
          What Should Rowan Play Today?
        </h1>
        <img src="/contact.png" alt="Contact Us" className="max-w-xs max-h-128 object-contain p-4 my-4" />
        <p className="mt-3 text-2xl">
          A web app to help me decide what to play when I have too many options. I play many games, but I hate having to choose which one 
          to play! Now only here can you vote on what I should play! As exciting as this may be I have limited your options to only my favorites,
          but don't fret as I will continue to add more games as time goes on! 
          I hope you enjoy voting and seeing the results as much as I will!
        </p>

        <div className="flex flex-row gap-6 mt-8">
          <img src="/r6-logo.png" alt="Placeholder 1" className="w-48 h-48 object-cover rounded-lg" />
          <img src="/LoL-Symbol.png" alt="Placeholder 2" className="w-48 h-48 object-cover rounded-lg" />
          <img src="/Apex-Legends-Logo.png" alt="Placeholder 3" className="h-48 object-cover rounded-lg" />
        </div>
        <p className="mt-3 text-2xl">
          Above are some of the game options you can vote for! In order to do this you must be logged into your web3 wallet and have some tBNB to vote with!
          You can login via clerk to your metamask wallet and then connect it to the app. 
        </p>
      </main>
  );
}
