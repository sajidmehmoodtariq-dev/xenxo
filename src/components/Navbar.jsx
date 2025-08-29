"use client"
import Image from 'next/image'
import Link from 'next/link'
import logo from "@/assets/logo.png"
import userImage from "@/assets/user.png"
import { ChevronFirst, ChevronLast } from 'lucide-react'
import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

const Navbar = () => {
  const [sidebar, setSidebar] = useState(true)
  const { data: session } = useSession()

  return (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white ${sidebar ? 'w-64' : 'w-16'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-teal-900/20 pointer-events-none"></div>
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${sidebar ? 'opacity-100' : 'opacity-0 w-0'}`}>
          <Image src={logo} alt="XenXO" width={40} height={40} />
          <span className="font-semibold text-lg">Xenxo</span>
        </div>
        <button onClick={() => setSidebar(!sidebar)} aria-label="Toggle sidebar" className="p-1.5 rounded-lg cursor-pointer bg-white/8 hover:bg-white/12">
          {sidebar ? <ChevronLast className='cursor-pointer' /> : <ChevronFirst className='cursor-pointer' />}
        </button>
      </div>

      <hr className={`border-white/10 mx-3 my-2 ${sidebar ? 'opacity-100' : 'opacity-0'}`} />

      <nav className={`flex-1 px-2 py-4 ${sidebar ? 'opacity-100' : 'opacity-0'}`}>
        <ul className="flex flex-col gap-1">
          <li>
            <Link href="/" className="block px-3 py-2 rounded-md text-white/95 hover:bg-white/10">Home</Link>
          </li>
          <li>
            <Link href="/game/ai" className="block px-3 py-2 rounded-md text-white/95 hover:bg-white/10">AI</Link>
          </li>
          <li>
            <Link href="/game/local" className="block px-3 py-2 rounded-md text-white/95 hover:bg-white/10">Local</Link>
          </li>
          <li>
            <Link href="/game/multiplayer" className="block px-3 py-2 rounded-md text-white/95 hover:bg-white/10">Multiplayer</Link>
          </li>
        </ul>
      </nav>

      <div className={`border-t border-white/6 p-3 ${sidebar ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md overflow-hidden">
            <Image src={session?.user?.image || userImage} alt="User" width={40} height={40} />
          </div>
          <div className="flex-1">
            {session ? (
              <div className="flex flex-col leading-4">
                <h4 className="font-semibold">{session.user.name}</h4>
                <span className="text-sm text-white/80">{session.user.email}</span>
              </div>
            ) : (
              <div className="flex flex-col leading-4">
                <h4 className="font-semibold">Guest</h4>
                <span className="text-sm text-white/80">Not signed in</span>
              </div>
            )}
          </div>
          <div>
            {session ? (
              <button onClick={() => signOut()} className="px-3 py-1 xenxo-btn-primary">Logout</button>
            ) : (
              <button onClick={() => signIn()} className="px-3 py-1 xenxo-btn-primary">Login</button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Navbar
