import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Login</h1>
        <p className="mb-6 text-gray-600">Sign in to your ShopSphere account.</p>
        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-md border px-3 py-2 outline-none" placeholder="Enter your email" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-md border px-3 py-2 outline-none" placeholder="Enter your password" />
          </div>
          <button type="submit" className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800">Login</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">Don&apos;t have an account? <Link to="/register" className="font-medium underline">Register</Link></p>
      </div>
    </div>
  );
}

export default LoginPage;
