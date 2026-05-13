import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="z-10 flex max-w-2xl flex-col items-center text-center gap-6">
        <div className="rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 p-4 shadow-2xl shadow-blue-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-white"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Sistem Klasifikasi <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Borescope</span>
          </h1>
          <p className="mx-auto max-w-[600px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Otomatisasi inspeksi ruang bakar menggunakan Deep Learning ResNet-50 untuk efisiensi pemeliharaan di PLN Nusantara Power UP Arun.
          </p>
        </div>
        <div className="flex flex-col gap-3 min-[400px]:flex-row">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white border-none shadow-lg shadow-blue-500/20">
            <Link href="/login">Masuk ke Sistem</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-slate-700 text-slate-200 hover:bg-slate-800">
            <a href="https://plnnusantarapower.co.id" target="_blank" rel="noreferrer">Tentang Perusahaan</a>
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-slate-500 text-sm font-mono">
        Rancang Bangun Sistem Klasifikasi Kondisi Ruang Bakar © 2026
      </div>
    </div>
  )
}
