"use client"

import { useState, useEffect } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ExternalLink, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Inspection {
  id: string
  created_at: string
  status: string
  confidence_score: number
  image_url: string
}

export function RecentInspections() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecent() {
      try {
        const { data, error } = await supabase
          .from("inspections")
          .select("id, created_at, status, confidence_score, image_url")
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) throw error
        setInspections(data || [])
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRecent()
  }, [])

  return (
    <Card className="border-none shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Inspeksi Terbaru</CardTitle>
          <CardDescription>5 aktivitas inspeksi terakhir di sistem.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-blue-600">
          <Link href="/history">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : inspections.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Belum ada data inspeksi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map((item) => (
                  <TableRow key={item.id} className="group transition-colors hover:bg-muted/50">
                    <TableCell className="text-sm">
                      {new Date(item.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })}, {new Date(item.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === "NORMAL" ? "default" : item.status === "ANOMALI" ? "destructive" : "secondary"}
                        className={
                          item.status === "NORMAL" ? "bg-green-500/10 text-green-600 border-green-200" : 
                          item.status === "ANOMALI" ? "bg-red-500/10 text-red-600 border-red-200" : 
                          "bg-blue-500/10 text-blue-600 border-blue-200 animate-pulse"
                        }
                      >
                        {item.status === "PROCESSING" ? "MEMPROSES..." : item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {item.status === "PROCESSING" ? "-" : `${(item.confidence_score * 100).toFixed(1)}%`}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/dashboard/inspections/${item.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
