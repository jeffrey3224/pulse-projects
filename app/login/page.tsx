"use client"
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const { login, isAuthenticated, user, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")

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
        {isAuthenticated ? (
          <div className="text-center">
            <h2 className="text-black text-xl font-bold mb-4">Welcome, {user?.name}</h2>
            <button
              onClick={logout}
              className="w-full bg-gray-800 text-black py-2 rounded-md hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 dark:text-black">Login</h2>
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
              <p className="text-black">New User? Sign up <a href="/register" className="underline">here.</a></p>
            </form>
          </>
        )}
      </div>
    </div>
    </div>
    </main>
  )
}