"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Register() {

  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    try {
      const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
  
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return  
    }
  
    setSuccess("Registration successful");
    setTimeout(() => router.push("/login"), 1500);
    }

    catch(err) {
      console.error(err);
      setError("Something weent wrong");
    }
  };

    return (
      <main className="w-full h-full">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-black">Create an account</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-primary text-black py-2 rounded-md hover:cursor-pointer"
          >
            Register
          </button>
        </form>
        <p className="text-black mt-4">
          Already have an account? <a href="/login" className="underline">Login here</a>.
        </p>
      </div>
    </div>
    </main>
    ) 
}