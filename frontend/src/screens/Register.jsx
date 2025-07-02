import React, { useState,useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context.jsx' // adjust the import path as necessary
import axios from '../config/axios'

const Register = () => {
  const [email, setEmail] = useState('')
  const { setUser } = useContext(UserContext) // Assuming you have a UserContext to manage user state
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

    const handleSubmit = (e) => {
  e.preventDefault();

  axios.post('/users/register', { email, password })
    .then((res) => {
      console.log(res.data);
      localStorage.setItem("token", res.data.token); // Store the token if needed
      setUser(res.data.user); // Update user context with the registered user
      navigate('/');
    })
    .catch((err) => {
      console.error(err);
    });
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md bg-gray-800/90 rounded-2xl shadow-2xl p-10 border border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 rounded-full p-3 mb-3 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm">Join us! Please enter your details.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition transform hover:-translate-y-0.5"
          >
            Register
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-gray-500 text-xs">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>
        <button
          type="button"
          className="w-full py-2 bg-white text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-200 transition flex items-center justify-center gap-2 mb-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.6 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.2 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.5 6.5 29.6 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/><path fill="#FBBC05" d="M24 44c5.6 0 10.5-1.9 14.3-5.2l-6.6-5.4C29.8 36 24 36 24 36c-5.8 0-10.6-2.9-13.7-7.2l-7 5.1C9.7 41.7 16.3 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7C34.6 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.5 6.5 29.6 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z" opacity=".3"/></g></svg>
          Continue with Google
        </button>
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register