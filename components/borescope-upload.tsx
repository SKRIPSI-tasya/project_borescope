"use client"

import { useState } from "react"
import { Upload, X, Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export function BorescopeUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleClassification = async () => {
    if (!file) return

    setIsAnalyzing(true)
    
    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Anda harus login untuk melakukan analisis")
        return
      }

      toast.info("Memulai unggahan file...", { duration: 2000 })

      // 2. Upload to Storage
      const fileExt = file.name.split(".").pop()
      const isVideo = file.type.startsWith("video")
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("borescope-images")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("borescope-images")
        .getPublicUrl(filePath)

      // 4. Create Initial Record with PROCESSING status
      const { data: inspection, error: dbError } = await supabase
        .from("inspections")
        .insert({
          status: "PROCESSING",
          confidence_score: 0,
          image_url: publicUrl,
          technician_id: user.id,
          metadata: {
            filename: file.name,
            filesize: file.size,
            mimetype: file.type,
            is_video: isVideo
          }
        })
        .select()
        .single()

      if (dbError) throw dbError

      toast.success("File berhasil diunggah. Analisis berjalan di latar belakang.", {
        description: "Anda dapat memantau progres di Dashboard atau Riwayat.",
        duration: 5000,
      })

      // 5. Trigger Background Analysis Simulation
      // In a real app, this would be an Edge Function or background job
      simulateBackgroundAnalysis(inspection.id)

      // Redirect to the new detailed inspection page
      router.push(`/dashboard/inspections/${inspection.id}`)
      
    } catch (error: any) {
      console.error("Analysis failed:", error)
      toast.error(error.message || "Gagal memulai analisis")
    } finally {
      setIsAnalyzing(false)
      setFile(null)
    }
  }

  const simulateBackgroundAnalysis = async (id: string) => {
    // Simulate processing time (5-8 seconds)
    const delay = Math.floor(Math.random() * 3000) + 5000
    
    setTimeout(async () => {
      const isAnomali = Math.random() > 0.7
      const status = isAnomali ? "ANOMALI" : "NORMAL"
      const confidence = parseFloat((Math.random() * (0.99 - 0.85) + 0.85).toFixed(4))

      await supabase
        .from("inspections")
        .update({
          status,
          confidence_score: confidence,
        })
        .eq("id", id)
      
      // Notify user if they are still on the site
      toast.success("Analisis AI Selesai", {
        description: `Hasil untuk inspeksi #${id.slice(0, 8)} adalah ${status}.`,
      })
    }, delay)
  }

  return (
    <div className="mb-6">
      <Card className="border-dashed border-2 bg-muted/30">
        <CardHeader>
          <CardTitle>Unggah Data Inspeksi</CardTitle>
          <CardDescription>
            Format yang didukung: Gambar (JPG/PNG) atau Video Borescope (MP4).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
          >
            {file ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative rounded-xl overflow-hidden bg-muted aspect-video w-full max-w-[300px] flex items-center justify-center border shadow-sm">
                  {file.type.startsWith("video") ? (
                    <video 
                      src={URL.createObjectURL(file)} 
                      className="h-full w-full object-cover"
                      muted
                    />
                  ) : (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                    />
                  )}
                  <button
                    onClick={() => setFile(null)}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-md hover:scale-110 transition-transform"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/50 text-[10px] text-white backdrop-blur-sm">
                    {file.type.startsWith("video") ? "VIDEO" : "IMAGE"}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold truncate max-w-[250px]">{file.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button onClick={handleClassification} disabled={isAnalyzing} className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Mulai Analisis
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer gap-4 w-full py-6">
                <div className="rounded-full bg-blue-500/10 p-5 text-blue-600 dark:text-blue-400">
                  <Upload className="h-10 w-10" />
                </div>
                <div className="text-center">
                  <p className="text-base font-medium">Klik untuk pilih file</p>
                  <p className="text-sm text-muted-foreground mt-1">Atau tarik file gambar/video ke sini</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleChange}
                />
              </label>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
