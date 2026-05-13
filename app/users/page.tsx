"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Shield, ShieldAlert, UserCog, Trash2, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Profile {
  id: string
  name: string
  role: string
  created_at: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)

  useEffect(() => {
    checkAdminAndFetchUsers()
  }, [])

  const checkAdminAndFetchUsers = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role !== "ADMIN") {
        setCurrentUserRole(profile?.role || "TEKNISI")
        setIsLoading(false)
        return
      }

      setCurrentUserRole("ADMIN")
      
      const { data: allUsers, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsers(allUsers || [])
    } catch (error) {
      console.error("Fetch users error:", error)
      toast.error("Gagal mengambil data pengguna")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "TEKNISI" : "ADMIN"
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId)

      if (error) throw error
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      toast.success(`Berhasil mengubah peran menjadi ${newRole}`)
    } catch (error) {
      toast.error("Gagal mengubah peran")
    }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (currentUserRole !== null && currentUserRole !== "ADMIN") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Akses Ditolak</h1>
        <p className="text-muted-foreground">Halaman ini hanya dapat diakses oleh Administrator.</p>
        <Button asChild variant="outline">
          <a href="/dashboard">Kembali ke Dashboard</a>
        </Button>
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
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
              <p className="text-muted-foreground">Kelola hak akses dan peran seluruh teknisi.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama teknisi..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nama Teknisi</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Terdaftar Sejak</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span>Memuat data pengguna...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      Tidak ada pengguna yang ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.role === "ADMIN" ? "default" : "secondary"}
                          className={user.role === "ADMIN" ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          {user.role === "ADMIN" ? (
                            <Shield className="mr-1 h-3 w-3" />
                          ) : null}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => toggleRole(user.id, user.role)}
                          >
                            <UserCog className="h-4 w-4" />
                            <span className="hidden md:inline">Ubah Peran</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
