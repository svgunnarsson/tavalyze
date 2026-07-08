export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="text-2xl font-bold">
          Tav<span className="text-green-500">alyze</span>
        </div>

        <div className="flex items-center gap-8 text-sm text-gray-300">
          <a href="#" className="transition hover:text-white">
            Players
          </a>
          <a href="#" className="transition hover:text-white">
            Teams
          </a>
          <a href="#" className="transition hover:text-white">
            Market Values
          </a>
          <a href="#" className="transition hover:text-white">
            Transfers
          </a>
        </div>

        <button className="rounded-xl bg-green-500 px-5 py-2 font-semibold text-black transition hover:bg-green-400">
          Sign in
        </button>
      </div>
    </nav>
  );
}