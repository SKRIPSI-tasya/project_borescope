import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 p-3 shadow-lg shadow-blue-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            PLN Nusantara Power
          </CardTitle>
          <CardDescription className="text-slate-400">
            Sistem Klasifikasi Ruang Bakar (Borescope)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-slate-200">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="border-slate-800 bg-slate-900/50 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-slate-200">Password</Label>
            <Input
              id="password"
              type="password"
              className="border-slate-800 bg-slate-900/50 text-white focus-visible:ring-blue-500"
            />
          </div>
          <Button asChild className="w-full bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-none shadow-lg shadow-blue-500/20 transition-all duration-300">
            <Link href="/dashboard">Masuk ke Sistem</Link>
          </Button>
          <div className="mt-4 text-center text-sm text-slate-500">
            Hanya untuk teknisi berwenang UP Arun.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
