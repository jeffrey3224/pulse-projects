"use client"

import { useState } from "react"

export default function Home() {

  const [title, setTitle] = useState("");
  return (
    <main>
      <form>
        <input
          type="text"
          value={title}
          onChange={((e) => setTitle(e.target.value))}
        />
      </form>
    </main>
  )
}
