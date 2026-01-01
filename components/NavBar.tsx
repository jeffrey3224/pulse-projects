"use client"

import Image from "next/image"
import { IoHomeSharp, IoCalendar } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";


export default function NavBar() {

  const [signOut, setSignOut] = useState(false);
  const { user } = useAuth();

  const handleSignOut = () => {
    setSignOut((prev) => !prev);
  }

  return (
    <nav className="w-full flex flex-row py-5 fixed top-0 left-0 bg-dark-gray z-20">
      <div className="flex flex-row px-7 lg:px-15 justify-between w-full mx-auto">
        <Image
          src="/pulse-main.svg"
          alt="pulse main logo"
          width={200}
          height={200}
        />
        <div className="flex flex-row space-x-20 items-center">
          <Link href="/" className="bg-dark-gray hover:bg-zinc-800 h-10 w-10 flex items-center justify-center rounded-[20px] cursor-pointer">
            <IoHomeSharp size={25}/>
          </Link>
            
        <button>
          <Link href="/calendar" className="bg-dary-gray hover:bg-zinc-800 h-10 w-10 flex items-center justify-center rounded-[20px] cursor-pointer">
            <IoCalendar size={25}/>
          </Link>
        </button>
        
        <div className="relative flex flex-end">
          <button onClick={handleSignOut}>
            <div className="bg-dary-gray hover:bg-zinc-800 h-10 w-10 flex items-center justify-center rounded-[20px] cursor-pointer">
              <FaUser size={22}/>
            </div>
            
          </button>

          <div className={`absolute min-w-[175px] bg-dark-gray border-1 border-zinc-700 top-10 -left-40 rounded-md flex flex-col justify-center shadow-2xl ${signOut ? "block" : "hidden"}`}>
            <div className="space-y-1 px-2 py-2">
              <p>{user?.name}</p>
              <p>{user?.email}</p>
            </div>
              
            
            <div className="border-t border-zinc-700 hover:bg-zinc-800">
              <button className="text-left py-1 px-2">
                Sign Out
              </button>
            </div>
           
          </div>
        </div>
        </div>
      </div>
      

      <div></div>
    </nav>
  )
}