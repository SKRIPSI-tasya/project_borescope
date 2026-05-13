"use client"

import { Suspense, useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Download, ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Share2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

function AnalysisContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [zoom, setZoom] = useState(1)
  const [userName, setUserName] = useState<string>("")

  const id = searchParams.get("id")
  const status = searchParams.get("status") || "NORMAL"
  const confidence = parseFloat(searchParams.get("confidence") || "0")
  const imageUrl = searchParams.get("imageUrl") || ""
  const filename = searchParams.get("filename") || "Unknown File"
  const timestamp = searchParams.get("timestamp") ? new Date(searchParams.get("timestamp")!).toLocaleString() : new Date().toLocaleString()

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("name").eq("id", user.id).single()
        if (profile) setUserName(profile.name)
      }
    }
    getSession()
  }, [])

  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text("Berita Acara Inspeksi Borescope", 105, 20, { align: "center" })
    doc.setFontSize(12)
    doc.text("PLN Nusantara Power UP Arun", 105, 28, { align: "center" })
    doc.line(20, 32, 190, 32)

    // Information Table
    const tableData = [
      ["Item", "Informasi"],
      ["ID Inspeksi", id || "N/A"],
      ["Filename", filename],
      ["Waktu Inspeksi", timestamp],
      ["Teknisi", userName || "N/A"],
      ["Status Kondisi", status],
      ["Confidence Score", `${(confidence * 100).toFixed(2)}%`]
    ]

    // @ts-ignore
    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 40,
      theme: "grid",
      headStyles: { fillStyle: [37, 99, 235] }
    })

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 40
    doc.setFontSize(10)
    doc.text("Dokumen ini dihasilkan secara otomatis oleh Sistem Klasifikasi Borescope AI.", 20, finalY + 20)
    doc.text(`Dicetak pada: ${new Date().toLocaleString()}`, 20, finalY + 26)

    doc.save(`Laporan_Borescope_${id || 'result'}.pdf`)
    toast.success("Laporan PDF berhasil diunduh")
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5))
  const handleResetZoom = () => setZoom(1)

  return (
    <div className="flex flex-1 flex-col p-4 lg:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/analysis">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hasil Analisis AI</h1>
            <p className="text-muted-foreground text-xs font-mono mt-1">ID: {id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Tautan hasil analisis disalin")
          }}>
            <Share2 className="h-4 w-4" />
            Bagikan
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={generatePDF}>
            <Download className="h-4 w-4" />
            Unduh Laporan PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Result Card */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl ring-1 ring-border">
          <div className={`h-2 w-full ${status === "NORMAL" ? "bg-green-500" : "bg-red-500"}`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-xl">Preview Citra Inspeksi</CardTitle>
              <CardDescription>{filename}</CardDescription>
            </div>
            <Badge variant={status === "NORMAL" ? "default" : "destructive"} className="px-3 py-1 text-sm font-semibold uppercase tracking-wider">
              {status === "NORMAL" ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Kondisi NORMAL
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Kondisi ANOMALI
                </span>
              )}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="relative group aspect-video w-full rounded-xl bg-muted flex items-center justify-center overflow-hidden border shadow-inner">
              <div 
                className="transition-transform duration-200 ease-out h-full w-full"
                style={{ transform: `scale(${zoom})` }}
              >
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="Borescope Preview" 
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-10 w-10" />
                    <p>Gambar tidak tersedia</p>
                  </div>
                )}
              </div>
              
              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg" onClick={handleResetZoom}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Card */}
        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-lg ring-1 ring-border">
            <CardHeader>
              <CardTitle className="text-lg">Detail Klasifikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-muted-foreground">Confidence Score</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{(confidence * 100).toFixed(2)}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-blue-600 transition-all duration-1000 ease-in-out" 
                    style={{ width: `${confidence * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center italic">
                  Tingkat kepercayaan model ResNet-50 v2
                </p>
              </div>

              <div className="grid gap-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Waktu Selesai</span>
                  <span className="font-medium text-right">{timestamp}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Analisa Oleh</span>
                  <span className="font-medium">{userName || "Sistem"}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground font-semibold">Kesimpulan</span>
                  <span className={`font-bold ${status === "NORMAL" ? "text-green-600" : "text-red-600"}`}>
                    {status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
            <CardContent className="pt-6 text-sm text-blue-800 dark:text-blue-300 leading-relaxed italic">
              "Hasil klasifikasi ini merupakan rekomendasi sistem. Harap teknisi melakukan verifikasi visual lanjutan pada area yang ditandai."
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AnalysisResultPage() {
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
        <Suspense fallback={<div className="p-8 text-center">Memuat hasil analisis...</div>}>
          <AnalysisContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
