import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate('/login');
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Create Account</h1>
        <p className="mb-6 text-gray-600">Create your ShopSphere account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">Name</label>
            <input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} required className="w-full rounded-md border px-3 py-2 outline-none" placeholder="Enter your name" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-md border px-3 py-2 outline-none" placeholder="Enter your email" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-md border px-3 py-2 outline-none" placeholder="Create a password" />
          </div>
          <button type="submit" className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800">Register</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link to="/login" className="font-medium underline">Login</Link></p>
      </div>
    </div>
  );
}

export default RegisterPage;
