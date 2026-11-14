'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EXPENSE_CATEGORIES } from '@/lib/expenseUtils';
import type { RocketMoneyPreview, RocketMoneyRow } from '@/lib/rocketMoneyImport';
import { importRocketMoneyExpenses, previewRocketMoneyImport } from '@/app/actions/rocketMoneyImport';

const MAX_FILE_BYTES = 500_000;

export default function RocketMoneyImport() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<RocketMoneyPreview | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [bulkCategory, setBulkCategory] = useState<string>('Other');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const close = () => {
    setOpen(false);
    setFile(null);
    setPreview(null);
    setSelected(new Set());
    setCategories({});
    setError('');
  };

  const review = async () => {
    if (!file) {
      setError('Choose a CSV file.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError('CSV exceeds the 500 KB limit.');
      return;
    }
    setBusy(true);
    setError('');
    setPreview(null);
    setSelected(new Set());
    setCategories({});
    try {
      const result = await previewRocketMoneyImport(await file.text());
      if (!result.success) setError(result.error);
      else setPreview(result.preview);
    } catch (error) {
      console.error('Unable to preview Rocket Money CSV:', error);
      setError('Unable to read or preview the CSV. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const toggle = (row: RocketMoneyRow) => {
    setSelected(current => {
      const next = new Set(current);
      if (next.has(row.key)) next.delete(row.key);
      else next.add(row.key);
      return next;
    });
  };

  const submit = async () => {
    if (!preview || selected.size === 0) {
      setError('Select at least one transaction to import.');
      return;
    }
    if (selected.size > 400) {
      setError('Select at most 400 transactions at a time.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const selections = preview.rows.filter(row => selected.has(row.key)).map(row => ({
        row,
        category: categories[row.key] || 'Other',
      }));
      const result = await importRocketMoneyExpenses(selections);
      if (!result.success) setError(result.error);
      else {
        close();
        setNotice(`Imported ${result.count} expense${result.count === 1 ? '' : 's'}.`);
        router.refresh();
      }
    } catch (error) {
      console.error('Unable to import Rocket Money CSV:', error);
      setError('Import request failed. Review the file again before retrying.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => { setNotice(''); setOpen(true); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold">
          Import Rocket Money CSV
        </button>
        {notice && <span role="status" className="text-sm text-emerald-700">{notice}</span>}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="rocket-import-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between gap-4 p-5 border-b border-slate-200">
              <div>
                <h2 id="rocket-import-title" className="text-lg font-bold text-slate-900">Review Rocket Money expenses</h2>
                <p className="text-sm text-slate-600">Only Business rows are eligible. Nothing is imported until you confirm.</p>
              </div>
              <button type="button" disabled={busy} onClick={close} aria-label="Close import" className="text-slate-500 text-xl">×</button>
            </div>
            <div className="overflow-y-auto p-5 space-y-4">
              <div className="flex flex-wrap items-end gap-3">
                <label className="text-sm font-medium text-slate-700">
                  Rocket Money CSV
                  <input type="file" accept=".csv,text/csv" disabled={busy} onChange={event => {
                    setFile(event.target.files?.[0] || null);
                    setPreview(null);
                    setSelected(new Set());
                    setError('');
                  }} className="block mt-1 text-sm" />
                </label>
                <button type="button" disabled={busy} onClick={review} className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold disabled:opacity-50">Review file</button>
              </div>
              <p className="text-xs text-slate-500">Files are limited to 500 KB and 2,000 rows.</p>
              {error && <p role="alert" className="text-sm text-rose-700 bg-rose-50 p-3 rounded-lg">{error}</p>}
              {preview && (
                <>
                  <div className="text-sm text-slate-700 space-y-1">
                    <p>{preview.rows.length} eligible Business rows; {preview.otherCategories} non-Business rows excluded; {preview.skipped.length} invalid Business rows skipped.</p>
                    <p>Matches use date and amount across all dashboard expenses. They are possible duplicates, not proof. CSVs have no stable transaction ID; review repeated rows, withdrawals and transfers carefully.</p>
                    {preview.skipped.length > 0 && <p className="text-rose-700">Skipped CSV records: {preview.skipped.map(item => `${item.line} (${item.reason})`).join(', ')}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <button type="button" disabled={busy} onClick={() => setSelected(new Set(preview.rows.filter(row => !row.alreadyImported && !row.matches.length && !row.warnings.length).map(row => row.key)))} className="px-3 py-2 border rounded-lg">Select unflagged</button>
                    <button type="button" disabled={busy} onClick={() => setSelected(new Set())} className="px-3 py-2 border rounded-lg">Clear selection</button>
                    <label className="flex items-center gap-2">
                      Category for selected
                      <select value={bulkCategory} onChange={event => setBulkCategory(event.target.value)} className="border rounded-lg p-2">
                        {EXPENSE_CATEGORIES.map(category => <option key={category}>{category}</option>)}
                      </select>
                    </label>
                    <button type="button" disabled={busy || !selected.size} onClick={() => setCategories(current => {
                      const next = { ...current };
                      selected.forEach(key => { next[key] = bulkCategory; });
                      return next;
                    })} className="px-3 py-2 border rounded-lg disabled:opacity-50">Apply category</button>
                  </div>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr><th className="p-3">Select</th><th className="p-3">Date / amount</th><th className="p-3">Description and review flags</th><th className="p-3">Dashboard category</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {preview.rows.map(row => (
                          <tr key={row.key} className={row.warnings.length || row.matches.length ? 'bg-amber-50/50' : ''}>
                            <td className="p-3"><input type="checkbox" aria-label={`Select record ${row.line}: ${row.title}`} checked={selected.has(row.key)} disabled={busy || row.alreadyImported} onChange={() => toggle(row)} /></td>
                            <td className="p-3 whitespace-nowrap">{row.date}<br /><strong>${row.amount.toFixed(2)}</strong></td>
                            <td className="p-3">
                              <div className="font-medium text-slate-900">{row.title}</div>
                              <div className="text-xs text-slate-500">CSV record {row.line} · {row.paymentMethod}{row.notes ? ` · Note: ${row.notes}` : ''}</div>
                              {row.alreadyImported && <div className="text-xs text-emerald-700">Already imported from this CSV</div>}
                              {row.warnings.map(warning => <div key={warning} className="text-xs text-amber-800">{warning}</div>)}
                              {row.matches.map(match => <div key={match.id} className="text-xs text-amber-800">Possible existing match: {match.title} ({match.date.slice(0, 10)}, ${Number(match.amount).toFixed(2)})</div>)}
                            </td>
                            <td className="p-3">
                              <select aria-label={`Category for record ${row.line}`} disabled={busy || row.alreadyImported} value={categories[row.key] || 'Other'} onChange={event => setCategories(current => ({ ...current, [row.key]: event.target.value }))} className="border rounded-lg p-2 max-w-[190px]">
                                {EXPENSE_CATEGORIES.map(category => <option key={category}>{category}</option>)}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            {preview && <div className="flex flex-wrap items-center justify-between gap-3 border-t p-5">
              <span className="text-sm text-slate-700">{selected.size} selected · ${preview.rows.filter(row => selected.has(row.key)).reduce((sum, row) => sum + row.amount, 0).toFixed(2)}</span>
              <button type="button" disabled={busy || !selected.size} onClick={submit} className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg disabled:opacity-50">{busy ? 'Working…' : `Import ${selected.size} selected`}</button>
            </div>}
          </div>
        </div>
      )}
    </>
  );
}
