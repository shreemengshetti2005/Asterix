import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Code2, Users, Trophy, MessageSquare } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../context/authContext";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(email, password, (isAdmin) => {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    });
    
    if (!success) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Code2 className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold">Stack It</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Knowledge sharing made simple
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Ask questions, share answers, grow together
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ask Questions</h3>
                <p className="text-purple-100">Get help from the community</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Share Knowledge</h3>
                <p className="text-purple-100">Help others and learn</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Build Reputation</h3>
                <p className="text-purple-100">
                  Earn recognition for your expertise
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile header */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-purple-500 rounded-xl">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Stack It</h1>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              icon={<Mail className="w-5 h-5" />}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={<Lock className="w-5 h-5" />}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="#"
                className="text-sm text-purple-600 hover:text-purple-500"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              New to Stack It?{" "}
              <Link
                to="/signup"
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
