"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { BorescopeUpload } from "@/components/borescope-upload"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AnalysisPage() {
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
            <h1 className="text-2xl font-bold tracking-tight">Analisis Baru</h1>
            <p className="text-muted-foreground">Mulai proses klasifikasi kondisi ruang bakar dengan mengunggah data baru.</p>
          </div>
          
          <div className="max-w-4xl">
            <BorescopeUpload />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 max-w-4xl">
            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Panduan Penggunaan</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                <li>Pastikan pencahayaan pada citra borescope cukup terang.</li>
                <li>Gunakan format file yang didukung (JPG, PNG, atau MP4).</li>
                <li>Hindari mengunggah file yang terlalu buram atau bergetar.</li>
                <li>Satu kali analisis dapat memakan waktu 3-10 detik.</li>
              </ul>
            </div>
            
            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Informasi Model</h3>
              <p className="text-sm text-muted-foreground">
                Sistem ini menggunakan arsitektur Deep Learning ResNet-50 yang telah dilatih khusus untuk mendeteksi anomali pada ruang bakar mesin.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Model Aktif: ResNet-50-v2</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
