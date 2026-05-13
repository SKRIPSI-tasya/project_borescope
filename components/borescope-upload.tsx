"use client"

import { useState } from "react"
import { Upload, FileVideo, FileImage, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

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
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        // In a real app, we'd pass the result via state or query params
        // For MVP, we just navigate to analysis page
        router.push("/analysis")
      }
    } catch (error) {
      console.error("Classification failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="px-4 lg:px-6 mb-6">
      <Card className="border-dashed border-2 bg-muted/30">
        <CardHeader>
          <CardTitle>Unggah Data Inspeksi</CardTitle>
          <CardDescription>
            Tarik dan lepas file citra atau video borescope di bawah ini untuk memulai klasifikasi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
          >
            {file ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative rounded-full bg-primary/10 p-4">
                  {file.type.includes("video") ? (
                    <FileVideo className="h-8 w-8 text-primary" />
                  ) : (
                    <FileImage className="h-8 w-8 text-primary" />
                  )}
                  <button
                    onClick={() => setFile(null)}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button onClick={handleClassification} disabled={isAnalyzing} className="gap-2">
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Jalankan Klasifikasi
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer gap-4">
                <div className="rounded-full bg-muted p-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Klik untuk unggah atau tarik file ke sini</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG atau MP4 (Maks. 50MB)</p>
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
