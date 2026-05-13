"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function SectionCards() {
  const [stats, setStats] = useState({
    total: 0,
    bagus: 0,
    tidakBagus: 0,
    avgConfidence: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase.from("inspections").select("status, confidence_score")
        if (error) throw error

        if (data) {
          const total = data.length
          const bagus = data.filter(i => i.status === "Bagus").length
          const tidakBagus = total - bagus
          const avgConfidence = total > 0 ? data.reduce((acc, curr) => acc + curr.confidence_score, 0) / total : 0

          setStats({ total, bagus, tidakBagus, avgConfidence })
        }
      } catch (err) {
        console.error("Stats fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 md:grid-cols-2 lg:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Inspeksi</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.total}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              Real-time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Total seluruh data inspeksi
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Kondisi Bagus</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-600">
            {stats.bagus}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              {stats.total > 0 ? ((stats.bagus / stats.total) * 100).toFixed(1) : 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Jumlah kondisi aman terdeteksi
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Perlu Perhatian</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-destructive">
            {stats.tidakBagus}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-destructive">
              {stats.total > 0 ? ((stats.tidakBagus / stats.total) * 100).toFixed(1) : 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Kondisi tidak bagus terdeteksi</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Rata-rata Confidence</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-blue-600">
            {(stats.avgConfidence * 100).toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              Stable
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Tingkat kepercayaan model</div>
        </CardFooter>
      </Card>
    </div>
  )
}
