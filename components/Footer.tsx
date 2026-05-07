export default function Footer() {
  return (
    <footer className="bg-white mt-auto">
      <div className="bg-[#FA8F27] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Ready To Turn Your Website Into Your Best Salesperson?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-orange-100/95 max-w-2xl">
                Stop guessing. Get a 15-minute audit of your current digital presence. No pressure, just a roadmap.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <a
                href="/book-free-audit"
                className="inline-flex items-center justify-center rounded-md border border-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
              >
                Get My Free Growth Audit
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_minmax(320px,420px)] lg:items-center">
            
            {/* Left: Phone UI with New Image */}
            <div className="flex items-center justify-center lg:justify-start">     
                  {/* Replaced Text Bubbles with Clickable Image */}
                  <a 
                    href="/book-free-audit" 
                    className="mt-4 flex flex-1 w-full items-center justify-center overflow-hidden rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <img 
                      src="/hand-holding-mobile.webp" 
                      alt="Mobile Growth Audit" 
                      className="h-full w-full object-contain" 
                    />
                  </a>  
            </div>

            {/* Right: Contact Information */}
            <div className="space-y-10">
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">Contact Us</h3>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Address</h4>
                  <p className="mt-4 text-base leading-7 text-slate-700">
                    12828 Willow Centre Dr Ste D
                    <br />Houston, TX 77066
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Telephone</h4>
                  <p className="mt-4 text-base leading-7 text-slate-700">(209) 286-6546</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Email</h4>
                  <p className="mt-4 text-base leading-7 text-slate-700">web@indevasa.com</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Social</h4>
                  <div className="mt-4 flex items-center gap-4 text-slate-700">
                    <a href="#" aria-label="Facebook" className="transition hover:text-[#FA8F27]">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.3v-2.9h2.3v-2.2c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .1 2.3.1v2.6h-1.5c-1.2 0-1.4.6-1.4 1.3v1.8h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
                      </svg>
                    </a>
                    <a href="#" aria-label="Twitter" className="transition hover:text-[#FA8F27]">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M8 19c7.2 0 11.2-6 11.2-11.2v-.5A8 8 0 0 0 21 5.2a7.9 7.9 0 0 1-2.3.6 4 4 0 0 0 1.7-2.2 8 8 0 0 1-2.6 1A4 4 0 0 0 11.5 8a11.4 11.4 0 0 1-8.3-4.2 4 4 0 0 0 1.2 5.3 4 4 0 0 1-1.8-.5v.1a4 4 0 0 0 3.2 4 4 4 0 0 1-1.7.1 4 4 0 0 0 3.7 2.7A8 8 0 0 1 2 17.6 11.4 11.4 0 0 0 8 19Z" />
                      </svg>
                    </a>
                    <a href="#" aria-label="Google" className="transition hover:text-[#FA8F27]">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M21.35 11.1H12v2.8h5.45c-.25 1.4-1.4 3.7-4.45 3.7-2.65 0-4.8-2.2-4.8-4.9s2.15-4.9 4.8-4.9c1.5 0 2.5.6 3.05 1.1l2.1-2.1C17.6 4.35 15.05 3 12 3 7.65 3 4 6.65 4 11s3.65 8 8 8c4.6 0 7.7-3.25 7.7-7.8 0-.55-.05-1-.1-1.1Z" />
                      </svg>
                    </a>
                    <a href="#" aria-label="LinkedIn" className="transition hover:text-[#FA8F27]">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M6.94 4.5a2.1 2.1 0 1 1 .02 0h-.02Zm-2.1 3.9h4.2v11.1h-4.2V8.4Zm8.05 0h4v1.5h.1c.5-.9 1.7-1.9 3.5-1.9 3.8 0 4.5 2.5 4.5 5.8v6.7h-4.2v-6c0-1.4 0-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1v6.1h-4.2V8.4Z" />
                      </svg>
                    </a>
                    <a href="#" aria-label="Instagram" className="transition hover:text-[#FA8F27]">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.5A4 4 0 0 0 3.5 7.5v9A4 4 0 0 0 7.5 20.5h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4h-9Zm9 2.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}