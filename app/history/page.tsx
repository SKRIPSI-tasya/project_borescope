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
import { Search, FileText, ExternalLink, Download, Loader2 } from "lucide-react"
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
      setInspections(data || [])
    } catch (error) {
      console.error("Fetch history error:", error)
      toast.error("Gagal mengambil data riwayat")
    } finally {
      setIsLoading(false)
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
                      <TableCell className="font-mono text-xs">{item.id.split('-')[0]}...</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(item.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>{item.profiles?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === "Bagus" ? "default" : "destructive"}
                          className={item.status === "Bagus" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{(item.confidence_score * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        <div className="h-10 w-16 rounded overflow-hidden border bg-muted">
                          <img 
                            src={item.image_url} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/analysis?imageUrl=${item.image_url}&status=${item.status}&confidence=${item.confidence_score}&timestamp=${item.created_at}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
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
