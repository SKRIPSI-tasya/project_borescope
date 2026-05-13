"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, CommandIcon, ChevronRight } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEKNISI",
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role,
          },
        },
      })

      if (error) throw error

      toast.success("Registrasi berhasil! Silakan login untuk masuk.")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat registrasi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className="absolute right-4 top-4 z-30 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground lg:right-8 lg:top-8"
      >
        Kembali
        <ChevronRight className="h-4 w-4" />
      </Link>
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
              "Bergabunglah dengan ekosistem digital kami untuk meningkatkan efisiensi pemeliharaan unit pembangkit melalui teknologi Computer Vision."
            </p>
            <footer className="text-sm text-zinc-400">Teknologi Pemeliharaan Terintegrasi</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Daftar Akun Baru
            </h1>
            <p className="text-sm text-muted-foreground">
              Lengkapi data di bawah ini untuk mendaftar
            </p>
          </div>
          
          <div className="grid gap-6">
            <form onSubmit={handleRegister}>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap"
                    disabled={loading}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="nama@plnnp.co.id"
                    type="email"
                    autoCapitalize="none"
                    disabled={loading}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="Buat password"
                    type="password"
                    disabled={loading}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEKNISI">Teknisi</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button disabled={loading}>
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Daftar
                </Button>
              </div>
            </form>
          </div>
          
          <p className="px-8 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
