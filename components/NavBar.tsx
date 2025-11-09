import Image from "next/image"
import { IoHomeSharp, IoCalendar } from "react-icons/io5";
import { GrProjects } from "react-icons/gr";
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
    <nav className="w-full flex flex-row py-5">
      <div className="flex flex-row px-15 justify-between w-full mx-auto">
        <Image
          src="/pulse-main-white.svg"
          alt="pulse main logo"
          width={200}
          height={200}
        />
        <div className="flex flex-row space-x-20 items-center">
          <Link href="/">
            <IoHomeSharp size={25}/>
          </Link>
            
        <IoCalendar size={25}/>

        <div className="relative flex flex-end">
          <button onClick={handleSignOut}>
            <FaUser size={22}/>
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