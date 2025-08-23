"use client"
import Image from 'next/image'
import Link from 'next/link'
import logo from "@/assets/logo.png"
import userImage from "@/assets/user.png"
import { ChevronFirst, ChevronLast } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false)

  return (
    <nav
      className={`h-screen flex flex-col shadow-sm transition-all duration-300 ${
        sidebar ? "w-64" : "w-16"
      }`}
    >
      {/* Top section */}
      <div className="p-4 pb-2 flex justify-between items-center">
        <Image
          src={logo}
          alt="XenXO Logo"
          className={`transition-all duration-300 ${
            sidebar ? "w-32 opacity-100" : "w-0 opacity-0"
          }`}
        />
        <button
          onClick={() => setSidebar(!sidebar)}
          className="p-1.5 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
        >
          {sidebar ? <ChevronLast /> : <ChevronFirst />}
        </button>
      </div>

      {/* Divider */}
      <hr
        className={`transition-all duration-300 ${
          sidebar ? "w-[90%] mx-auto my-3 opacity-100" : "w-0 opacity-0"
        }`}
      />

      {/* Links */}
      <ul
        className={`flex-1 flex flex-col gap-6 px-3 py-6 text-gray-400 transition-all duration-300 overflow-hidden ${
          sidebar ? "opacity-100" : "opacity-0"
        }`}
      >
        <Link href="/">Home</Link>
        <Link href="/game/ai">AI</Link>
        <Link href="/game/local">Local</Link>
        <Link href="/game/multiplayer">Multiplayer</Link>
        <Link href="/leaderboard">LeaderBoard</Link>
      </ul>

      {/* Bottom user info */}
      <div
        className={`border-t flex items-center gap-3 p-3 transition-all duration-300 overflow-hidden ${
          sidebar ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image src={userImage} alt="User" className="w-10 h-10 rounded-md" />
        <div className="flex flex-col leading-4">
          <h4 className="font-semibold">John Doe</h4>
          <span className="text-sm text-gray-500">john@gmail.com</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
