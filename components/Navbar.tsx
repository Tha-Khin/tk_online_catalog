"use client";

import Image from "next/image"
import Link from 'next/link';
import {assets} from "../assets/assets"
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, loading, logout } = useAuth();

  return (
    <div className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-primary/70 py-4 bg-[#FDF9E9]`}>
      <Link href="/">
        <Image src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' priority/>
      </Link>
      {!loading && (
        <div className='hidden md:flex items-center gap-5 text-gray-500'>
          <Link href="/">Home</Link>
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <button onClick={async () => { await logout(); toast.success("Logged out successfully!"); }} disabled={loading} className='bg-primary text-white px-5 py-2 rounded-full cursor-pointer'>Logout</button>
            </>
            ) : (
            <>
              <Link href="/login"><button className='bg-primary text-white px-5 py-2 rounded-full cursor-pointer'>Login</button></Link>
            </>
          )}
        </div>
      )}
      {/* For Phone Screens */}
      {!loading && (
        <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
          {user ? (
            <>
              <button onClick={async () => { await logout(); toast.success("Logged out successfully!"); }} disabled={loading} className='bg-primary text-black px-5 py-2 rounded-full cursor-pointer'>Logout</button>
            </>
            ) : (
            <>
              <Link href="/login"><button className='bg-primary text-black px-5 py-2 rounded-full cursor-pointer'>Login</button></Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Navbar