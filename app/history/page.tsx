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
import { Search, FileText, ExternalLink, Download, Loader2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Inspection {
  id: string
  created_at: string
  status: string
  confidence_score: number
  image_url: string
  profiles: {
    name: string
  } | null
}

export default function HistoryPage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("inspections")
        .select(`
          id,
          created_at,
          status,
          confidence_score,
          image_url,
          profiles (name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      
      // Map data to handle the profiles array returning from Supabase
      const formattedData = (data as any[]).map(item => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      }))

      setInspections(formattedData)
    } catch (error) {
      console.error("Fetch history error:", error)
      toast.error("Gagal mengambil data riwayat")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      // 1. Extract file path from URL
      // URL format: .../storage/v1/object/public/borescope-images/uploads/filename.ext
      const pathParts = imageUrl.split("borescope-images/")
      if (pathParts.length > 1) {
        const filePath = pathParts[1]
        
        // 2. Delete from Storage
        const { error: storageError } = await supabase.storage
          .from("borescope-images")
          .remove([filePath])
        
        if (storageError) console.error("Storage delete error:", storageError)
      }

      // 3. Delete from Database
      const { error: dbError } = await supabase
        .from("inspections")
        .delete()
        .eq("id", id)

      if (dbError) throw dbError

      toast.success("Data inspeksi berhasil dihapus")
      fetchHistory() // Refresh list
    } catch (error: any) {
      console.error("Delete error:", error)
      toast.error(error.message || "Gagal menghapus data")
    }
  }

  const filteredData = inspections.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.profiles?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <h1 className="text-2xl font-bold tracking-tight">Riwayat Inspeksi</h1>
              <p className="text-muted-foreground">Kelola dan tinjau kembali data hasil inspeksi borescope.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari ID atau teknisi..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">ID Inspeksi</TableHead>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Teknisi</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>File Preview</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span>Memuat data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      Tidak ada data riwayat inspeksi.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-[10px]">{item.id.slice(0, 8)}...</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {new Date(item.created_at).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="font-medium">{item.profiles?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === "NORMAL" ? "default" : item.status === "ANOMALI" ? "destructive" : "secondary"}
                          className={
                            item.status === "NORMAL" ? "bg-green-500 hover:bg-green-600" : 
                            item.status === "PROCESSING" ? "animate-pulse" : ""
                          }
                        >
                          {item.status === "PROCESSING" ? "MEMPROSES" : item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.status === "PROCESSING" ? "-" : `${(item.confidence_score * 100).toFixed(1)}%`}
                      </TableCell>
                      <TableCell>
                        <div className="h-10 w-16 rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                          {item.image_url?.endsWith('.mp4') ? (
                            <div className="flex items-center justify-center h-full w-full bg-blue-500/10">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                          ) : (
                            <img 
                              src={item.image_url} 
                              alt="Preview" 
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/inspections/${item.id}`} className="gap-2">
                              <ExternalLink className="h-3.5 w-3.5" />
                              Detail
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-9 w-9 text-destructive hover:bg-destructive hover:text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Data Inspeksi?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Data inspeksi dan file media terkait akan dihapus secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(item.id, item.image_url)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
