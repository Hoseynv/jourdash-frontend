"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import "./login.css"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        throw new Error("نام کاربری یا رمز عبور اشتباه است")
      }

      const data = await res.json()

      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)

      console.log("✅ Login success:", data)

      window.location.href = "/"

    } catch (err: any) {
      alert(err.message || "خطا در ورود")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="login-container">
      <div className="login-overlay"></div>

      {/* Floating glass orbs for visual interest */}
      <div className="floating-orbs">
        <div className="glass-orb glass-orb-large"></div>
        <div className="glass-orb glass-orb-medium"></div>
        <div className="glass-orb glass-orb-small"></div>
      </div>

      <Card className="login-card hover-lift shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold  text-card-foreground">خوش آمدید</CardTitle>
          <CardDescription className="text-card-foreground/70 ">
            برای ادامه وارد حساب کاربری خود شوید
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-card-foreground ">
                نام کاربری
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="نام کاربری خود را وارد کنید"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input placeholder-gray-400 text-card-foreground login-input-ltr"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-card-foreground ">
                رمز عبور
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input text-card-foreground login-input-ltr"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full ripple-effect hover-lift  font-bold login-button transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "در حال ورود..." : "ورود"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
