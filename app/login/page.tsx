"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    
    const { login, user, loading } = useAuth();
    const router = useRouter();

    interface FirebaseError {
        code: string;
        message: string;
        name: string;
    }

    // Type guard function to check if the caught error is a FirebaseError
    function isFirebaseError(err: unknown): err is FirebaseError {
        return (
            typeof err === 'object' &&
            err !== null &&
            'code' in err &&
            typeof (err as { code: unknown }).code === 'string' &&
            'message' in err &&
            typeof (err as { message: unknown }).message === 'string'
        );
    }

    useEffect(() => {
        if (!loading && user) {
        router.push("/");
        }
    }, [user, loading, router]);

    const loginHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);        
        try {
            await login(email, password);
            router.push("/");
            toast.success("Login successful!");
        } catch (err) { // err is 'unknown'
            if (isFirebaseError(err)) {                
                if (err.code === 'auth/invalid-credential') {
                    setError("Invalid email or password. Please try again."); 
                } else if (err.code === 'auth/user-disabled') {
                    setError("Your account has been disabled. Please contact support.");
                } else {
                    setError(err.message);
                }
            } else {
                // Handle non-Firebase errors (e.g., network issues)
                console.error("Unknown error during login:", err);
                setError("An unexpected error occurred. Please check your connection.");
            }
            toast.error("Login failed.");
        }
    };
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-b from-cyan-100 w-full'>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>Login</h2>
        <p className='text-center text-sm mb-6'>Login to your account!</p>

        <form onSubmit={loginHandler}>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none' type="email" placeholder='Email' required/>
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <input onChange={e => setPassword(e.target.value)} value={password} className='bg-transparent outline-none' type="password" placeholder='Password' required/>
          </div>

          <button className='w-full py-2.5 rounded-full bg-linear-to-r from-blue-700 to-blue-600 text-white font-medium cursor-pointer'>{loading ? "Signing In..." : "Sign In"}</button>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login