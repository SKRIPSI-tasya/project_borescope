"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileDown, Calendar, Database, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { toast } from "sonner"

interface Inspection {
  id: string
  created_at: string
  status: string
  confidence_score: number
  profiles: {
    name: string
  }
}

export default function ReportsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("30") // days

  useEffect(() => {
    fetchReportData()
  }, [period])

  const fetchReportData = async () => {
    setIsLoading(true)
    const dateLimit = new Date()
    dateLimit.setDate(dateLimit.getDate() - parseInt(period))

    try {
      const { data, error } = await supabase
        .from("inspections")
        .select(`
          id,
          created_at,
          status,
          confidence_score,
          profiles (name)
        `)
        .gte("created_at", dateLimit.toISOString())
        .order("created_at", { ascending: false })

      if (error) throw error
      setInspections(data as any || [])
    } catch (error) {
      console.error("Fetch report error:", error)
      toast.error("Gagal memuat data laporan")
    } finally {
      setIsLoading(false)
    }
  }

  const stats = {
    total: inspections.length,
    bagus: inspections.filter(i => i.status === "Bagus").length,
    rusak: inspections.filter(i => i.status !== "Bagus").length,
    avgConfidence: inspections.length > 0 
      ? (inspections.reduce((acc, curr) => acc + curr.confidence_score, 0) / inspections.length * 100).toFixed(1)
      : 0
  }

  const exportSummaryPDF = () => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(18)
    doc.text("REKAPITULASI LAPORAN INSPEKSI BORESCOPE", 105, 20, { align: "center" })
    doc.setFontSize(11)
    doc.text(`Periode: ${period} Hari Terakhir`, 105, 28, { align: "center" })
    doc.text("PLN Nusantara Power UP Arun", 105, 34, { align: "center" })
    doc.line(20, 38, 190, 38)

    // Summary Section
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Ringkasan Statistik:", 20, 48)
    doc.setFont("helvetica", "normal")
    doc.text(`- Total Inspeksi: ${stats.total}`, 25, 56)
    doc.text(`- Kondisi Bagus: ${stats.bagus}`, 25, 62)
    doc.text(`- Perlu Perhatian: ${stats.rusak}`, 25, 68)
    doc.text(`- Rata-rata Confidence Score: ${stats.avgConfidence}%`, 25, 74)

    // Table
    const tableRows = inspections.map(ins => [
      new Date(ins.created_at).toLocaleDateString(),
      ins.profiles?.name || "N/A",
      ins.status.toUpperCase(),
      `${(ins.confidence_score * 100).toFixed(1)}%`
    ])

    // @ts-ignore
    doc.autoTable({
      head: [["Tanggal", "Teknisi", "Status", "Confidence"]],
      body: tableRows,
      startY: 85,
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] }
    })

    doc.save(`Rekap_Laporan_Borescope_${period}d.pdf`)
    toast.success("Rekapitulasi PDF berhasil diunduh")
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
              <h1 className="text-2xl font-bold tracking-tight">Rekapitulasi Laporan</h1>
              <p className="text-muted-foreground">Analisis data inspeksi untuk pemeliharaan rutin.</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px] bg-card">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Hari Terakhir</SelectItem>
                  <SelectItem value="30">30 Hari Terakhir</SelectItem>
                  <SelectItem value="90">90 Hari Terakhir</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportSummaryPDF} className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                <FileDown className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Data</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Inspeksi terdaftar</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-600">Kondisi Bagus</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bagus}</div>
                <p className="text-xs text-muted-foreground">Normal operation</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-600">Rusak/Haus</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rusak}</div>
                <p className="text-xs text-muted-foreground">Butuh perbaikan</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                <Badge variant="outline" className="text-blue-600 border-blue-200">{stats.avgConfidence}%</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgConfidence}%</div>
                <p className="text-xs text-muted-foreground">Rata-rata akurasi AI</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Table */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Teknisi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Akurasi AI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        <span>Memuat ringkasan data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : inspections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                      Tidak ada data untuk periode ini.
                    </TableCell>
                  </TableRow>
                ) : (
                  inspections.map((ins) => (
                    <TableRow key={ins.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>{new Date(ins.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{ins.profiles?.name || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant={ins.status === "Bagus" ? "default" : "destructive"} className="font-semibold">
                          {ins.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {(ins.confidence_score * 100).toFixed(1)}%
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
