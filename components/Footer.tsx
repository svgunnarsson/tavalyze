import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050d18]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
        <div>
          <Link href="/" className="text-xl font-bold tracking-tight">
            Tav<span className="text-green-500">alyze</span>
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
            Independent football market intelligence for fans. Estimates and
            model outputs are clearly separated from verified facts.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-white">Explore</p>
          <Link className="block text-gray-500 hover:text-white" href="/players">
            Players
          </Link>
          <Link className="block text-gray-500 hover:text-white" href="/compare">
            Battle Lab
          </Link>
          <Link
            className="block text-gray-500 hover:text-white"
            href="/market-values"
          >
            Market values
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-white">Trust</p>
          <Link
            className="block text-gray-500 hover:text-white"
            href="/methodology"
          >
            Data & methodology
          </Link>
          <p className="text-gray-600">© 2026 Tavalyze</p>
        </div>
      </div>
    </footer>
  );
}
