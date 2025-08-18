"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    })

    const data = await res.json()

    if (res.ok) {
      // redirect ke dashboard setelah login/register
      router.push("/dashboard")
    } else {
      setMessage(data.error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-5 border rounded">
      <h2 className="text-xl font-bold mb-4">Login / Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  )
}
