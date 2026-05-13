"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      toast.success("Berhasil masuk!")
      router.refresh()
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Email atau password salah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 p-3 shadow-lg shadow-blue-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            PLN Nusantara Power
          </CardTitle>
          <CardDescription className="text-slate-400">
            Sistem Klasifikasi Ruang Bakar (Borescope)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="border-slate-800 bg-slate-900/50 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-slate-800 bg-slate-900/50 text-white focus-visible:ring-blue-500"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-none shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Masuk ke Sistem"}
            </Button>
            <div className="text-center text-sm text-slate-400">
              Belum punya akun?{" "}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                Daftar
              </Link>
            </div>
            <div className="mt-2 text-center text-xs text-slate-500">
              Hanya untuk teknisi berwenang UP Arun.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
