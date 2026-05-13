"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Download, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AnalysisPage() {
  // Mock data for demonstration
  const result = {
    status: "Bagus",
    confidence: 0.985,
    timestamp: new Date().toLocaleString(),
    technician: "Teknisi Arun-01",
    fileType: "image",
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
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Hasil Analisis Borescope</h1>
                <p className="text-muted-foreground">Detail klasifikasi kondisi ruang bakar.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Simpan ke Riwayat
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4" />
                Unduh Laporan
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Result Card */}
            <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
              <div className={`h-2 w-full ${result.status === "Bagus" ? "bg-green-500" : "bg-red-500"}`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Preview Citra Inspeksi</CardTitle>
                  <CardDescription>Citra yang diunggah untuk dianalisis.</CardDescription>
                </div>
                <Badge variant={result.status === "Bagus" ? "default" : "destructive"} className="px-3 py-1 text-sm font-semibold">
                  {result.status === "Bagus" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Kondisi Bagus
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Perlu Perhatian
                    </span>
                  )}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden border">
                  {/* Placeholder for uploaded image */}
                  <img 
                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000" 
                    alt="Borescope Preview" 
                    className="h-full w-full object-cover opacity-80"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Metrics Card */}
            <div className="flex flex-col gap-6">
              <Card className="border-none shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg">Metrik Prediksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Confidence Score</span>
                      <span className="font-bold text-primary">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                      <div 
                        className="h-full rounded-full bg-blue-500 transition-all duration-1000" 
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Waktu Inspeksi</span>
                      <span className="font-medium">{result.timestamp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Teknisi</span>
                      <span className="font-medium">{result.technician}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Format File</span>
                      <span className="font-medium uppercase">{result.fileType}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                <CardContent className="pt-6 text-sm text-blue-700 dark:text-blue-300 italic">
                  "Hasil ini dihasilkan oleh model AI ResNet-50. Silakan tinjau kembali secara manual jika diperlukan."
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
