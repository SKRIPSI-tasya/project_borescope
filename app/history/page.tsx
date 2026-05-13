"use client"

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
import { Search, FileText, ExternalLink, Download } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  // Mock data for history
  const historyData = [
    {
      id: "INS-001",
      date: "2024-05-12 14:30",
      technician: "Teknisi Arun-01",
      status: "Bagus",
      confidence: "98.5%",
      file: "borescope_01.jpg",
    },
    {
      id: "INS-002",
      date: "2024-05-12 15:45",
      technician: "Teknisi Arun-01",
      status: "Tidak Bagus",
      confidence: "82.1%",
      file: "borescope_02.mp4",
    },
    {
      id: "INS-003",
      date: "2024-05-11 09:15",
      technician: "Teknisi Arun-02",
      status: "Bagus",
      confidence: "95.0%",
      file: "borescope_03.jpg",
    },
    {
      id: "INS-004",
      date: "2024-05-10 11:20",
      technician: "Teknisi Arun-03",
      status: "Tidak Bagus",
      confidence: "89.4%",
      file: "borescope_04.jpg",
    },
  ]

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
                  <TableHead>File</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell className="text-muted-foreground">{item.date}</TableCell>
                    <TableCell>{item.technician}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === "Bagus" ? "default" : "destructive"}
                        className={item.status === "Bagus" ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.confidence}</TableCell>
                    <TableCell className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span className="text-xs truncate max-w-[100px]">{item.file}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href="/analysis">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
