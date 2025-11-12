import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const go = (path: string) => () => {
    try {
      window.location.href = path;
    } catch (_) {}
  };

  return (
    <div className="relative h-[100vh] overflow-hidden bg-gradient-to-b from-[#F5FAFF] via-[#ECF4FF] to-[#EAF2FF]">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-blue-200 opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-blue-300 opacity-40 blur-3xl" />

      {/* Navbar */}
      <header className="sticky top-0 z-20 w-full backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-blue-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">VITgpt</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-blue-600/50 text-blue-700"
              onClick={go("/login")}
            >
              Login
            </Button>
            <Button
              className="rounded-full bg-blue-600 px-5 text-white hover:bg-blue-700"
              onClick={go("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        {/* Left copy */}
        <section className="relative z-10">
          <h1 className="text-4xl font-extrabold leading-tight text-blue-900 md:text-6xl">
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 bg-clip-text text-transparent">Transform your Internship Journey</span>
            <br />
            <span className="text-blue-500">with VITgpt</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-7 text-slate-600">
            Real‑time internship insights, placement statistics, company data,
            and wellbeing support — all from one intelligent assistant built for
            VIT students.
          </p>

          {/* CTAs */}
          

          {/* Feature chips */}
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-blue-100">Company‑wise intake</span>
            <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-blue-100">Placement timelines</span>
            <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-blue-100">Resume tips</span>
            <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-blue-100">Stress support</span>
          </div>
        </section>

        {/* Right visual */}
        <section className="relative z-5 flex items-center justify-center">
          <div className="relative w-full max-w-md rounded-3xl bg-white/60 p-6 shadow-xl ring-1 ring-white/50 backdrop-blur-md">
            {/* subtle inner glow */}
            <div className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-b from-blue-200/40 to-blue-100/30 blur" />
            {/* Robot illustration */}
            <div className="relative flex items-center justify-center">
              <img
                src="/robot.svg"
                alt="Friendly AI robot popping out of a laptop"
                className="w-full max-w-sm animate-float select-none"
                draggable={false}
              />
            </div>
          </div>
        </section>

        {/* Floating particles */}
        <div className="pointer-events-none absolute left-[10%] top-[22%] h-2 w-2 rounded-full bg-blue-400/60" />
        <div className="pointer-events-none absolute left-[14%] top-[26%] h-1.5 w-1.5 rounded-full bg-blue-300/70" />
        <div className="pointer-events-none absolute right-[12%] top-[18%] h-2 w-2 rounded-full bg-blue-400/60" />
        <div className="pointer-events-none absolute right-[16%] top-[24%] h-1.5 w-1.5 rounded-full bg-blue-300/70" />
      </main>

      {/* Local styles for tiny animations without extra libs */}
      <style>{`
        @keyframes float { 0% { transform: translateY(0px) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0px) } }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
