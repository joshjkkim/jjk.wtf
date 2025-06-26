'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username: u, password: p })
    });
    if (res.ok) {
      router.push('/world');
    } else {
      const { error } = await res.json();
      setErr(error || 'Login failed');
    }
  }

  useEffect(() => {
    const getSession = async () => {
        const res = await fetch('/api/session', {
            method: 'GET',
            headers: {'Content-Type':'application/json'},
        });

        if(res.ok) {
            router.push('/world')
        }
    }

    getSession();
  }, [])

  return (
    <div className="min-w-screen min-h-screen flex flex-col justify-center items-center">
        <form onSubmit={onSubmit} className="max-w-md mx-auto p-4 bg-gray-800 rounded-lg flex flex-col w-1/2 text-center gap-3 items-center">
            <h1 className="text-4xl">Login</h1>
            {err && <p className="text-red-600">{err}</p>}
            <label><span className="font-bold text-lg">Username:</span>
                <input value={u} onChange={e=>setU(e.target.value)} required className="p-1 bg-gray-600 ml-2 rounded-lg shadow-lg hover:scale-105 hover:bg-gray-500 transition-color duration-250 ease-out"/>
            </label>
            <label><span className="font-bold text-lg">Password:</span>
                <input
                type="password"
                value={p}
                onChange={e=>setP(e.target.value)}
                required
                className="p-1 bg-gray-600 ml-2 rounded-lg shadow-lg hover:scale-105 hover:bg-gray-500 transition-color duration-250 ease-out"
                />
            </label>
            <button type="submit" className="bg-gray-900 w-1/3 p-2 rounded-lg shadow-lg hover:bg-gray-400 hover:text-black hover:scale-105 transition-all duration-300 ease-in-out">Sign In</button>
        </form>
    </div>
    
  );
}
