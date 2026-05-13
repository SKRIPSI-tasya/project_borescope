"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, Save, User } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar_url: ""
  })

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("name, avatar_url")
          .eq("id", user.id)
          .single()

        if (error) throw error
        setProfile({
          name: data.name || "",
          email: user.email || "",
          avatar_url: data.avatar_url || ""
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user")

      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)

      if (error) throw error
      toast.success("Profil berhasil diperbarui")
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h1>
            <p className="text-muted-foreground">Kelola informasi profil dan preferensi akun Anda.</p>
          </div>

          <div className="max-w-2xl">
            <Card className="border-none shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader>
                <CardTitle>Profil Teknisi</CardTitle>
                <CardDescription>Informasi publik yang akan ditampilkan di riwayat inspeksi.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border-2 border-primary/10">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="bg-primary/5 text-xl">
                      <User className="h-10 w-10 text-primary/40" />
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Ganti Foto</Button>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input 
                      id="name" 
                      value={profile.name} 
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Masukkan nama lengkap" 
                    />
                  </div>
                  <div className="grid gap-2 opacity-60">
                    <Label htmlFor="email">Email (Read-only)</Label>
                    <Input id="email" value={profile.email} readOnly disabled />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 px-6 py-4">
                <Button 
                  onClick={updateProfile} 
                  disabled={saving}
                  className="ml-auto gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Simpan Perubahan
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
