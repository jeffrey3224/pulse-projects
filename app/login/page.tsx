"use client"

import { signIn } from "next-auth/react";
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, isAuthenticated, user, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.token);
      router.push("/");
    }
    catch(err) {
      console.error(err);
      setError("Something went wrong");
    }
  }

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <Image
            src="/pulse-main-white.svg"
            alt="pulse main logo"
            width={300}
            height={300}
            className="mb-10"
          />
      <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 dark:text-black">Login to your account</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-black"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-black"
              />
              <button
                type="submit"
                className="w-full bg-primary text-black py-2 rounded-md hover:bg-primary hover:cursor-pointer"
              >
                Login
              </button>
              <div className="w-full flex flex-row space-x-20 justify-center items-center">
              <button onClick={() => signIn("google", {
                callbackUrl: "/dashboard"
              })}>
                Login with Google
              </button>
              <button onClick={() => signIn("github")}>
                Login with GitHub
              </button>
              </div>
              <p className="text-black">New User? Sign up <a href="/register" className="underline">here.</a></p>
            </form>
      </div>
    </div>
    </div>
    </main>
  )
}