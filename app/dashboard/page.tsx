import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { RecentInspections } from "@/components/recent-inspections"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
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
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard Ringkasan</h1>
              <p className="text-muted-foreground">Monitor kondisi ruang bakar dan aktivitas inspeksi secara real-time.</p>
            </div>
            <Button asChild className="gap-2 shadow-lg shadow-primary/20">
              <Link href="/analysis">
                <Plus className="h-4 w-4" />
                Analisis Baru
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Kartu Statistik Utama */}
            <SectionCards />
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Grafik Tren */}
              <ChartAreaInteractive />
              
              {/* Tabel Aktivitas Terakhir */}
              <RecentInspections />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
