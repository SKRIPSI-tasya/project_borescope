import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Simulasi delay pemrosesan model CNN
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulasi hasil prediksi
    const isBagus = Math.random() > 0.3 // 70% Bagus, 30% Tidak Bagus
    const confidence = 0.85 + Math.random() * 0.14 // 85% - 99%

    return NextResponse.json({
      status: isBagus ? "Bagus" : "Tidak Bagus",
      confidence: confidence,
      filename: file.name,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
