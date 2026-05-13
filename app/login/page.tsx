"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, CommandIcon } from "lucide-react"

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
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div 
          className="absolute inset-0 bg-zinc-900 bg-cover bg-center" 
          style={{ backgroundImage: "url('/auth-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent" />
        
        <div className="relative z-20 flex items-center text-lg font-medium">
          <CommandIcon className="mr-2 h-6 w-6" />
          PLN Nusantara Power
        </div>
        
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Sistem inspeksi borescope berbasis AI ini membantu kami mendeteksi anomali pada ruang bakar dengan tingkat akurasi dan efisiensi yang jauh lebih tinggi."
            </p>
            <footer className="text-sm text-zinc-400">Unit Pelaksana Arun</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Masuk ke Sistem
            </h1>
            <p className="text-sm text-muted-foreground">
              Masukkan email dan password Anda untuk masuk
            </p>
          </div>
          
          <div className="grid gap-6">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="nama@plnnp.co.id"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={loading}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    disabled={loading}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <Button disabled={loading}>
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Masuk
                </Button>
              </div>
            </form>
          </div>
          
          <p className="px-8 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Daftar Sekarang
            </Link>
          </p>
          
          <p className="px-8 text-center text-xs text-muted-foreground/60">
            Hanya untuk personel berwenang UP Arun.
          </p>
        </div>
      </div>
    </div>
  )
}
