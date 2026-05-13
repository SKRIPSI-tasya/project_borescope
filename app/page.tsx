"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Camera, Database, ShieldCheck, FileText, Zap, LayoutDashboard } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground font-sans">
      {/* MagicUI: Grid Pattern Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/20 to-transparent blur-3xl opacity-50" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
            <Zap className="size-5 fill-white" />
          </div>
          <span>Borescope AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-blue-500 transition-colors">Masuk</Link>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-white border-none">
            <Link href="/register">Mulai Sekarang</Link>
          </Button>
          <ModeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Powered by ResNet-50 Deep Learning
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          Otomatisasi Inspeksi Ruang Bakar Dengan AI
        </h1>
        
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Tingkatkan akurasi dan efisiensi pemeliharaan pembangkit dengan sistem klasifikasi kondisi borescope cerdas. Dirancang khusus untuk PLN Nusantara Power.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white border-none text-base shadow-xl shadow-blue-500/25 group">
            <Link href="/login" className="flex items-center gap-2">
              Buka Dashboard <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 border-border bg-background/50 hover:bg-accent text-base">
            <Link href="/history">Lihat Riwayat</Link>
          </Button>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-20 relative max-w-5xl w-full mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="size-2.5 rounded-full bg-red-500/50" />
              <div className="size-2.5 rounded-full bg-yellow-500/50" />
              <div className="size-2.5 rounded-full bg-green-500/50" />
              <div className="ml-4 text-[10px] text-muted-foreground font-mono tracking-widest uppercase">System Dashboard</div>
            </div>
            <div className="aspect-[16/9] bg-background flex items-center justify-center">
               <div className="flex flex-col items-center gap-4 text-muted-foreground/20">
                  <LayoutDashboard className="size-20" />
                  <span className="text-sm font-medium tracking-widest uppercase">Preview Mode</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features: Bento Grid Style */}
      <section className="relative z-10 px-6 py-24 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative group overflow-hidden rounded-3xl border border-border bg-card p-8 hover:bg-accent/50 transition-colors">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 bg-blue-600/10 blur-3xl rounded-full" />
            <Camera className="size-10 text-blue-500 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Klasifikasi Otomatis</h3>
            <p className="text-muted-foreground max-w-md">
              Unggah citra borescope dan biarkan model AI kami mengklasifikasikan kondisi ruang bakar dalam hitungan detik dengan akurasi tinggi.
            </p>
          </div>
          
          <div className="relative group overflow-hidden rounded-3xl border border-border bg-card p-8 hover:bg-accent/50 transition-colors">
            <Database className="size-10 text-cyan-500 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Database Terintegrasi</h3>
            <p className="text-muted-foreground">
              Penyimpanan data riwayat inspeksi yang aman dan terorganisir di Supabase.
            </p>
          </div>

          <div className="relative group overflow-hidden rounded-3xl border border-border bg-card p-8 hover:bg-accent/50 transition-colors">
            <FileText className="size-10 text-emerald-500 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Laporan PDF</h3>
            <p className="text-muted-foreground">
              Generate berita acara inspeksi secara instan dalam format PDF profesional.
            </p>
          </div>

          <div className="md:col-span-2 relative group overflow-hidden rounded-3xl border border-border bg-card p-8 hover:bg-accent/50 transition-colors">
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 size-64 bg-cyan-600/10 blur-3xl rounded-full" />
            <ShieldCheck className="size-10 text-purple-500 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Keamanan Enterprise</h3>
            <p className="text-muted-foreground max-w-md">
              Dilengkapi dengan Row Level Security (RLS) dan autentikasi multi-role untuk melindungi data operasional pembangkit.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-muted/20 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tighter opacity-70">
            <Zap className="size-4 text-blue-500" />
            <span>Borescope AI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2026 PLN Nusantara Power UP Arun. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
