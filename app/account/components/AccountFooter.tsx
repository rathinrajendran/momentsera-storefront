"use client";

export default function AccountFooter() {
  return (
    <>
      <footer className="mx-auto max-w-[1800px] border-t border-[#e5e7eb] px-[5vw] py-5">
        <div className="flex items-center justify-between text-xs text-[#9ca3af]">
          <span>© 2026 Evllyne Studio</span>
          <span>v1.0.0</span>
        </div>
      </footer>
      {/* <footer className="border-t border-[#e5e7eb] py-4">
        <div className="flex flex-col gap-2 text-xs text-[#9ca3af] md:flex-row md:items-center md:justify-between">
          <span>© 2026 Evllyne Studio</span>

          <div className="flex items-center gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/support">Support</Link>
          </div>
        </div>
      </footer> */}
      {/* <footer className="border-t border-[#e5e7eb] py-5">
        <div className="flex flex-col items-center justify-between gap-1 text-center md:flex-row">
          <span className="text-xs text-[#9ca3af]">© 2026 Evllyne Studio</span>

          <span className="text-xs text-[#9ca3af]">Crafting memorable invitations.</span>
        </div>
      </footer> */}
      {/* <footer className="border-t border-[#e5e7eb] px-6 py-4">
        <p className="text-xs text-[#9ca3af]">© 2026 Evllyne Studio • Admin Panel</p>
      </footer> */}
    </>
  );
}
