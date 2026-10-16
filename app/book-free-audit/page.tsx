'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BookFreeAuditPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    goal: '',
    message: '',
    challenge: [] as string[],
  });

  const toggleChallenge = (item: string) => {
    setFormData((prev) => {
      const exists = prev.challenge.includes(item);
      if (exists) {
        return { ...prev, challenge: prev.challenge.filter((c) => c !== item) };
      }
      return { ...prev, challenge: [...prev.challenge, item] };
    });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');

    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.email.trim()) {
        setSubmissionError('Please provide your name and work email.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'Provided during video booking',
          website: formData.website || 'No website provided',
          goal: formData.goal || 'Platform modernization & growth',
          message: formData.message || '15-min growth audit requested.',
          challenge: formData.challenge,
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        window.location.href = '/thank-you';
        return;
      }

      setSubmissionError(
        result.error || 'There was an issue submitting your request. Please try again.'
      );
    } catch {
      setSubmissionError('An unexpected network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 selection:bg-[#F06A1A] selection:text-white min-h-screen">
      {/* Header matching Figma */}
      <section className="pt-16 pb-12 lg:pt-20 lg:pb-16 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs sm:text-sm font-mono tracking-wider text-slate-500 uppercase">
            Contact / A conversation, not a pitch
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.1]">
            Let&apos;s find your next growth lever.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tell us where you want to go. We&apos;ll help you understand what&apos;s holding your website or operations back—and what to do next.
          </p>
        </div>
      </section>

      {/* Main Grid: Left Value Summary + Right Qualification Multi-Step Form */}
      <section className="py-16 lg:py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Value & Expectation Column (matching Figma) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Zero Pressure Shield Box */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F06A1A] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    15-Minute Free Growth Audit — Zero Pressure
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                    A focused technical discussion about your real bottlenecks, not a forced sales script.
                  </p>
                </div>
              </div>

              {/* What We Cover */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  What we&apos;ll cover
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
                    <span className="text-xs font-mono font-bold text-[#F06A1A]">01</span>
                    <p className="text-sm text-slate-700">
                      A quick review of your website and customer journey
                    </p>
                  </div>
                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
                    <span className="text-xs font-mono font-bold text-[#F06A1A]">02</span>
                    <p className="text-sm text-slate-700">
                      One high-impact engineering or automation opportunity
                    </p>
                  </div>
                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
                    <span className="text-xs font-mono font-bold text-[#F06A1A]">03</span>
                    <p className="text-sm text-slate-700">
                      A clear, practical next step—with no obligation
                    </p>
                  </div>
                </div>
              </div>

              {/* Fast response & digital office facts */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                    Our digital office
                  </span>
                  <a
                    href="https://indevasa.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-slate-900 hover:text-[#F06A1A] transition-colors"
                  >
                    indevasa.com ↗
                  </a>
                  <p className="text-xs text-slate-500 mt-1">
                    Consultations by video call. Office details shared when needed.
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                    You won&apos;t be left waiting
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">
                    Within 1 business day
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Our response-time promise for audit enquiries.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Multi-Step Qualification Form (matching Figma) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl">
                
                {/* Step Progress Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-8">
                  <div className="flex items-center gap-6 text-xs sm:text-sm font-medium">
                    <span
                      className={`pb-2 transition-colors ${
                        currentStep === 1
                          ? 'text-[#F06A1A] font-bold border-b-2 border-[#F06A1A]'
                          : currentStep > 1
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      1. Your details
                    </span>
                    <span
                      className={`pb-2 transition-colors ${
                        currentStep === 2
                          ? 'text-[#F06A1A] font-bold border-b-2 border-[#F06A1A]'
                          : currentStep > 2
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      2. Your goals
                    </span>
                    <span
                      className={`pb-2 transition-colors ${
                        currentStep === 3
                          ? 'text-[#F06A1A] font-bold border-b-2 border-[#F06A1A]'
                          : 'text-slate-400'
                      }`}
                    >
                      3. Book a time
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Step {currentStep} of 3
                  </span>
                </div>

                {submissionError && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
                    {submissionError}
                  </div>
                )}

                {/* STEP 1: Details */}
                {currentStep === 1 && (
                  <form onSubmit={handleNextStep} className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Let&apos;s start with you.
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Tell us a little about your business. We&apos;ll use it to make your 15 minutes useful.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F06A1A] focus:ring-1 focus:ring-[#F06A1A] text-sm text-slate-900 placeholder-slate-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Work email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@company.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F06A1A] focus:ring-1 focus:ring-[#F06A1A] text-sm text-slate-900 placeholder-slate-400"
                        />
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Only used for your audit and its follow-up.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Website URL
                        </label>
                        <input
                          type="text"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://yourwebsite.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F06A1A] focus:ring-1 focus:ring-[#F06A1A] text-sm text-slate-900 placeholder-slate-400"
                        />
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          No website yet? You can leave this blank.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone number (optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(555) 000-0000"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F06A1A] focus:ring-1 focus:ring-[#F06A1A] text-sm text-slate-900 placeholder-slate-400"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-4 px-6 rounded-xl text-base font-semibold text-white bg-[#F06A1A] hover:bg-[#dc580b] shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <span>Continue to your goals</span>
                        <span>↗</span>
                      </button>
                      <p className="text-[11px] text-slate-400 text-center mt-3">
                        By continuing, you agree to our Privacy policy. No newsletter signup or unsolicited marketing.
                      </p>
                    </div>
                  </form>
                )}

                {/* STEP 2: Goals & Bottlenecks */}
                {currentStep === 2 && (
                  <form onSubmit={handleNextStep} className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        What is your primary challenge?
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Select all that apply so our engineering team can prepare specific audit benchmarks.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        'Low conversion rates / traffic not generating leads',
                        'Slow page speeds & poor Core Web Vitals',
                        'Outdated legacy monolithic architecture (WordPress / Wix / Shopify limitations)',
                        'Manual processes needing Stripe / CRM / invoice automation',
                        'Building a brand-new custom platform from scratch',
                      ].map((item) => {
                        const isSelected = formData.challenge.includes(item);
                        return (
                          <div
                            key={item}
                            onClick={() => toggleChallenge(item)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 text-xs sm:text-sm ${
                              isSelected
                                ? 'border-[#F06A1A] bg-orange-50/60 font-semibold text-slate-900'
                                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border ${
                                isSelected
                                  ? 'bg-[#F06A1A] border-[#F06A1A] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <span className="text-xs">✓</span>}
                            </div>
                            <span>{item}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        What does success look like for your business in the next 12 months?
                      </label>
                      <input
                        type="text"
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        placeholder="e.g. 2x customer acquisition, eliminate manual admin work..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F06A1A] text-sm text-slate-900 placeholder-slate-400"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="py-3.5 px-5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 px-6 rounded-xl text-base font-semibold text-white bg-[#F06A1A] hover:bg-[#dc580b] shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <span>Continue to time &amp; notes</span>
                        <span>↗</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: Confirm & Message */}
                {currentStep === 3 && (
                  <form onSubmit={handleFinalSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Final details &amp; preferences.
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Any specific notes or questions you want addressed during your 15-minute audit?
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                        <div className="font-semibold text-slate-900">
                          {formData.name} ({formData.email})
                        </div>
                        {formData.website && (
                          <div className="font-mono text-slate-500">{formData.website}</div>
                        )}
                        <div className="text-[11px] text-[#F06A1A] font-semibold pt-1">
                          {formData.challenge.length} challenges identified
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Notes / Preferred consultation window (optional)
                        </label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="e.g. mornings EST preferred, currently on WordPress needing migration advice..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F06A1A] text-sm text-slate-900 placeholder-slate-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        disabled={isSubmitting}
                        className="py-3.5 px-5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 px-6 rounded-xl text-base font-semibold text-white bg-[#F06A1A] hover:bg-[#dc580b] shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-75"
                      >
                        {isSubmitting ? (
                          <span>Dispatching Audit Request...</span>
                        ) : (
                          <>
                            <span>Confirm &amp; Request 15-Min Audit</span>
                            <span>↗</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQs Section: A few things worth knowing (matching Figma) */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              A few things worth knowing.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-6 md:pt-0 md:pr-8 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">
                Do I need a technical brief?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No. Bring a business goal or a recurring frustration. We&apos;ll ask the questions that translate it into a useful technical direction.
              </p>
            </div>

            <div className="pt-6 md:pt-0 md:px-8 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">
                Will I get a proposal?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Only if there&apos;s a clear fit and you want one. The audit is a focused conversation, not a commitment to a project.
              </p>
            </div>

            <div className="pt-6 md:pt-0 md:pl-8 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">
                What happens after the call?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                You&apos;ll have a short summary of the opportunities discussed and a recommended next step. You decide where to take it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}