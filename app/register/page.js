'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
const [u, setU] = useState('');
const [p, setP] = useState('');
const [confirmP, setConfirmP] = useState('');
const [err, setErr] = useState('');
const router = useRouter();

async function onSubmit(e) {    
    e.preventDefault();
    setErr('');
    if(confirmP !== p) {
        setErr('Passwords do not match!');
        return;
    }

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username: u, password: p })
    });
    if (res.ok) {
        router.push('/login');
    } else {
        const { error } = await res.json();
        setErr(error || 'Registration failed');
    }
}

return (
    <div className="min-w-screen min-h-screen flex justify-center items-center">
        <form onSubmit={onSubmit} className="max-w-md mx-auto p-8 flex flex-col items-center text-center gap-6 bg-gray-800 rounded-lg shadow-lg w-1/2">
            <h1 className="text-3xl">Register</h1>
            {err && <p className="text-red-600">{err}</p>}
            <label><span className="font-bold">Username: </span>
            <input value={u} onChange={e=>setU(e.target.value)} required className="ml-3 bg-gray-900 p-1 rounded-lg shadow-lg hover:bg-gray-600 hover:scale-105 transition-all duration-200"/>
            </label>
            <label><span className="font-bold">Password: </span>
            <input
                type="password"
                value={p}
                onChange={e=>setP(e.target.value)}
                required
                className="ml-3 bg-gray-900 p-1 rounded-lg shadow-lg hover:bg-gray-600 hover:scale-105 transition-all duration-200"
            />
            </label>
            <label><span className="font-bold">Confirm Pass: </span>
            <input
                type="password"
                value={confirmP}
                onChange={e=>setConfirmP(e.target.value)}
                required
                className="ml-3 bg-gray-900 p-1 rounded-lg shadow-lg hover:bg-gray-600 hover:scale-105 transition-all duration-200"
            />
            </label>
            <button type="submit" className="bg-gray-600 p-2 rounded-lg shadow-lg hover:text-black hover:scale-105 hover:bg-gray-300 transition-all duration-200 ease-out w-1/3">Sign Up</button>

            <Link href="/login" className="text-gray-300 bg-gray-900/60 p-2 rounded-lg text-sm hover:underline">Login here</Link>
        </form>
    </div>

);
}
