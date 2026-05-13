import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // 1. Upload ke Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('borescope-images')
      .upload(filePath, file)

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('borescope-images')
      .getPublicUrl(filePath)

    // 2. Simulasi delay pemrosesan model CNN
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 3. Simulasi hasil prediksi
    const isBagus = Math.random() > 0.3 // 70% Bagus, 30% Tidak Bagus
    const confidence = 0.85 + Math.random() * 0.14 // 85% - 99%

    return NextResponse.json({
      status: isBagus ? "Bagus" : "Tidak Bagus",
      confidence: confidence,
      filename: file.name,
      fileType: file.type,
      imageUrl: publicUrl,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
