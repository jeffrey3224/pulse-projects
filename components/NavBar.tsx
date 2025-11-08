import Image from "next/image"
import { IoHomeSharp, IoCalendar } from "react-icons/io5";
import { GrProjects } from "react-icons/gr";
import Link from "next/link";


export default function NavBar() {

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
        
        <Link href="/projects">
          <GrProjects size={22}/>
        </Link>
            
        <IoCalendar size={25}/>
        </div>
      </div>
      

      <div></div>
    </nav>
  )
}