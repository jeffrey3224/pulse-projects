"use client"

import NavBar from "@/components/NavBar";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function Home() {
  const {user} = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <>
    <NavBar/>
    <main>
      <h1 className="text-white">Home</h1>
      <form>
        <input
          type="text"
          value={title}
          onChange={((e) => setTitle(e.target.value))}
        />
      </form>
    </main>
    </>
  )
}
