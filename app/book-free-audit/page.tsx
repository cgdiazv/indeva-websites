'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookFreeAuditPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const challenge = formData.getAll('challenge').map((value) => value.toString());

    const payload = {
      name: formData.get('name')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      phone: formData.get('phone')?.toString() ?? '',
      website: formData.get('website')?.toString() ?? '',
      goal: formData.get('goal')?.toString() ?? '',
      message: formData.get('message')?.toString() ?? '',
      challenge,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        window.location.href = '/thank-you';
        return;
      }

      setSubmissionError(result.error || 'There was an error submitting the form. Please try again.');
    } catch (error) {
      setSubmissionError('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Ready To Scale Your Business?
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
          <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Fill out the details below, and we’ll prepare a custom digital growth audit before our call.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 placeholder-gray-400 focus:border-[#FA8F27] focus:outline-none focus:ring-2 focus:ring-[#FA8F27]/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 placeholder-gray-400 focus:border-[#FA8F27] focus:outline-none focus:ring-2 focus:ring-[#FA8F27]/20"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone"
                className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 placeholder-gray-400 focus:border-[#FA8F27] focus:outline-none focus:ring-2 focus:ring-[#FA8F27]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <fieldset className="space-y-3 rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <legend className="text-sm font-semibold text-gray-900">
                What is your biggest business challenge right now?*
              </legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="inline-flex items-center space-x-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:border-[#FA8F27] cursor-pointer">
                  <input type="checkbox" name="challenge" value="leads" className="h-4 w-4 text-[#FA8F27] focus:ring-[#FA8F27]" />
                  <span>I need more leads/customers</span>
                </label>
                <label className="inline-flex items-center space-x-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:border-[#FA8F27] cursor-pointer">
                  <input type="checkbox" name="challenge" value="slowSite" className="h-4 w-4 text-[#FA8F27] focus:ring-[#FA8F27]" />
                  <span>My current website is slow/outdated</span>
                </label>
                <label className="inline-flex items-center space-x-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:border-[#FA8F27] cursor-pointer">
                  <input type="checkbox" name="challenge" value="brandImage" className="h-4 w-4 text-[#FA8F27] focus:ring-[#FA8F27]" />
                  <span>I need a professional brand image</span>
                </label>
                <label className="inline-flex items-center space-x-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:border-[#FA8F27] cursor-pointer">
                  <input type="checkbox" name="challenge" value="bookings" className="h-4 w-4 text-[#FA8F27] focus:ring-[#FA8F27]" />
                  <span>I want to automate my bookings/sales</span>
                </label>
              </div>
            </fieldset>

            <div className="space-y-4">
              <div>
                <label htmlFor="website" className="sr-only">
                  What is your current website URL?
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  placeholder="What is your current website URL?"
                  className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 placeholder-gray-400 focus:border-[#FA8F27] focus:outline-none focus:ring-2 focus:ring-[#FA8F27]/20"
                />
              </div>
              <div>
                <label htmlFor="goal" className="sr-only">
                  What is your primary goal for the next 6 months?
                </label>
                <input
                  type="text"
                  id="goal"
                  name="goal"
                  placeholder="What is your primary goal for the next 6 months?"
                  className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 placeholder-gray-400 focus:border-[#FA8F27] focus:outline-none focus:ring-2 focus:ring-[#FA8F27]/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="sr-only">
              Additional Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Additional Message"
              className="block w-full rounded-3xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 placeholder-gray-400 focus:border-[#FA8F27] focus:outline-none focus:ring-2 focus:ring-[#FA8F27]/20"
            />
          </div>

          {submissionError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {submissionError}
            </div>
          ) : null}

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full border border-[#FA8F27] bg-transparent px-9 py-4 text-base font-semibold uppercase tracking-[0.18em] text-[#FA8F27] shadow-[0_20px_50px_-20px_rgba(250,143,39,0.8)] transition hover:bg-[#FA8F27] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Book my free audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
