"use client"

import { useState, useEffect, use } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Clock, 
  User,
  FileText,
  Activity,
  Loader2,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

export default function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [inspection, setInspection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [technician, setTechnician] = useState<any>(null)

  useEffect(() => {
    fetchInspection()

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`inspection-${resolvedParams.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'inspections',
          filter: `id=eq.${resolvedParams.id}`,
        },
        (payload) => {
          setInspection(payload.new)
          if (payload.new.status !== 'PROCESSING') {
            toast.success("Analisis selesai diperbarui!")
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [resolvedParams.id])

  const fetchInspection = async () => {
    try {
      const { data, error } = await supabase
        .from("inspections")
        .select("*")
        .eq("id", resolvedParams.id)
        .single()

      if (error) throw error
      setInspection(data)

      if (data.technician_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.technician_id)
          .single()
        setTechnician(profile)
      }
    } catch (error: any) {
      toast.error("Gagal memuat detail inspeksi")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = () => {
    if (!inspection) return
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text("Laporan Detil Inspeksi Borescope", 105, 20, { align: "center" })
    doc.setFontSize(12)
    doc.text("PLN Nusantara Power UP Arun", 105, 28, { align: "center" })
    doc.line(20, 32, 190, 32)

    const tableData = [
      ["Kategori", "Detail"],
      ["ID Inspeksi", inspection.id],
      ["Waktu", new Date(inspection.created_at).toLocaleString()],
      ["Status", inspection.status],
      ["Confidence", `${(inspection.confidence_score * 100).toFixed(2)}%`],
      ["Teknisi", technician?.name || "N/A"],
      ["File", inspection.metadata?.filename || "N/A"]
    ]

    // @ts-ignore
    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 40,
      theme: "grid",
    })

    doc.save(`Inspeksi_${inspection.id.slice(0, 8)}.pdf`)
    toast.success("Laporan berhasil diunduh")
  }

  const handleDelete = async () => {
    try {
      const pathParts = inspection.image_url.split("borescope-images/")
      if (pathParts.length > 1) {
        await supabase.storage.from("borescope-images").remove([pathParts[1]])
      }

      const { error } = await supabase.from("inspections").delete().eq("id", inspection.id)
      if (error) throw error

      toast.success("Inspeksi berhasil dihapus")
      router.push("/history")
    } catch (error: any) {
      toast.error("Gagal menghapus inspeksi")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!inspection) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
        <p className="text-lg font-medium">Inspeksi tidak ditemukan</p>
        <Button asChild>
          <Link href="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    )
  }

  const isVideo = inspection.metadata?.is_video || inspection.image_url?.endsWith(".mp4")

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
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Detail Inspeksi</h1>
                <p className="text-muted-foreground text-xs font-mono">ID: {inspection.id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={generatePDF} disabled={inspection.status === 'PROCESSING'}>
                <Download className="mr-2 h-4 w-4" />
                Laporan PDF
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-white">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Data Inspeksi?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan. Data inspeksi dan file media terkait akan dihapus secara permanen dari server.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Hapus Permanen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Media Preview */}
            <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl ring-1 ring-border">
              <div className={`h-1.5 w-full ${
                inspection.status === 'NORMAL' ? 'bg-green-500' : 
                inspection.status === 'ANOMALI' ? 'bg-red-500' : 'bg-blue-500'
              }`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle>Preview Citra/Video</CardTitle>
                  <CardDescription>{inspection.metadata?.filename || "Borescope Data"}</CardDescription>
                </div>
                <Badge 
                  variant={
                    inspection.status === 'NORMAL' ? 'default' : 
                    inspection.status === 'ANOMALI' ? 'destructive' : 'secondary'
                  }
                  className="px-3 py-1 font-bold"
                >
                  {inspection.status === 'PROCESSING' ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" /> MENGANALISIS...
                    </span>
                  ) : inspection.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="relative group aspect-video w-full rounded-xl bg-muted flex items-center justify-center overflow-hidden border">
                  <div 
                    className="h-full w-full transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                  >
                    {isVideo ? (
                      <video 
                        src={inspection.image_url} 
                        controls 
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <img 
                        src={inspection.image_url} 
                        alt="Inspection Preview" 
                        className="h-full w-full object-contain"
                      />
                    )}
                  </div>
                  
                  {!isVideo && (
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" onClick={() => setZoom(1)}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" onClick={() => setZoom(z => Math.min(z + 0.2, 3))}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Details */}
            <div className="flex flex-col gap-6">
              <Card className="border-none shadow-lg ring-1 ring-border">
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Inspeksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {inspection.status === 'PROCESSING' ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="relative mb-4">
                        <Activity className="h-12 w-12 text-blue-500 animate-pulse" />
                        <Loader2 className="absolute -bottom-1 -right-1 h-5 w-5 animate-spin text-blue-600 bg-background rounded-full" />
                      </div>
                      <h4 className="font-semibold">Analisis Sedang Berjalan</h4>
                      <p className="text-xs text-muted-foreground mt-2 px-4">
                        AI sedang mengevaluasi kondisi visual. Hasil akan diperbarui secara otomatis.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Confidence Score</span>
                          <span className="font-bold">{(inspection.confidence_score * 100).toFixed(2)}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              inspection.status === 'NORMAL' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${inspection.confidence_score * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-3 pt-4 border-t text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Waktu</span>
                          </div>
                          <span className="font-medium">{new Date(inspection.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Teknisi</span>
                          </div>
                          <span className="font-medium">{technician?.name || "Unknown"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>Jenis File</span>
                          </div>
                          <span className="font-medium uppercase">{isVideo ? "Video" : "Gambar"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-muted/50 border-none">
                <CardContent className="pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Catatan</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {inspection.notes || "Tidak ada catatan tambahan untuk inspeksi ini."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
