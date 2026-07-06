'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Enquiry {
  id: string
  name: string
  business_name: string
  email: string
  phone: string | null
  current_website: string | null
  message: string
  status: 'new' | 'contacting' | 'onboarded' | 'archived'
  created_at: string
}

export default function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [currentWebsite, setCurrentWebsite] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'new' | 'contacting' | 'onboarded' | 'archived'>('new')
  const [isAdding, setIsAdding] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchErr } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr
      setEnquiries(data || [])
    } catch (err: any) {
      setError(err.message || 'Could not fetch enquiries')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name || !businessName || !email || !message) {
      setError('Please fill out all required fields')
      return
    }

    try {
      const { error: insertErr } = await supabase
        .from('enquiries')
        .insert([
          {
            name,
            business_name: businessName,
            email,
            phone: phone || null,
            current_website: currentWebsite || null,
            message,
            status,
          },
        ])

      if (insertErr) throw insertErr

      setSuccess('Enquiry added successfully!')
      setName('')
      setBusinessName('')
      setEmail('')
      setPhone('')
      setCurrentWebsite('')
      setMessage('')
      setStatus('new')
      setIsAdding(false)
      fetchEnquiries()
    } catch (err: any) {
      setError(err.message || 'Could not add enquiry')
    }
  }

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacting' | 'onboarded' | 'archived') => {
    setError(null)
    setSuccess(null)
    try {
      const { error: updateErr } = await supabase
        .from('enquiries')
        .update({ status: newStatus })
        .eq('id', id)

      if (updateErr) throw updateErr
      setSuccess('Status updated successfully!')
      setEnquiries(prev =>
        prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
      )
    } catch (err: any) {
      setError(err.message || 'Could not update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return
    setError(null)
    setSuccess(null)
    try {
      const { error: delErr } = await supabase.from('enquiries').delete().eq('id', id)
      if (delErr) throw delErr
      setSuccess('Enquiry deleted successfully')
      setEnquiries(prev => prev.filter(item => item.id !== id))
    } catch (err: any) {
      setError(err.message || 'Could not delete enquiry')
    }
  }

  const filteredEnquiries = enquiries.filter(item => {
    if (filterStatus === 'all') return true
    return item.status === filterStatus
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 font-bold">Incoming Leads & Enquiries</h2>
          <p className="text-sm text-slate-500">Review and manage incoming prospect leads from South Wales</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="self-start px-4 py-2 bg-[#C56A3C] hover:bg-[#b05a2f] text-white font-bold rounded transition text-sm"
        >
          {isAdding ? 'Close Manual Entry' : '+ Log Phone/Walk-in Lead'}
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 text-sm bg-red-50 text-[#DC2626] rounded border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 mb-4 text-sm bg-green-50 text-[#16A34A] rounded border border-green-200">
          {success}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-[#F3E9D8]/30 p-6 rounded-lg border border-stone-200 mb-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-serif">Record a Manual Enquiry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Contact Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Gareth Bowen"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Business Name *</label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="Bowen & Sons Plumbing"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="gareth@bowenplumbing.co.uk"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="01792 000000"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Current Website (If any)</label>
              <input
                type="text"
                value={currentWebsite}
                onChange={e => setCurrentWebsite(e.target.value)}
                placeholder="www.oldplumbingsite.co.uk"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm bg-white"
              >
                <option value="new">New</option>
                <option value="contacting">Contacting</option>
                <option value="onboarded">Onboarded</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">Requirements / Message *</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="What do they need help with?"
              className="w-full mt-1 p-2 border border-stone-300 rounded text-sm h-24 focus:ring-1 focus:ring-[#C56A3C]"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C56A3C] hover:bg-[#b05a2f] text-white font-bold rounded text-sm"
            >
              Save Enquiry
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 border-b border-stone-100">
        {['all', 'new', 'contacting', 'onboarded', 'archived'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition ${
              filterStatus === st
                ? 'bg-[#C56A3C] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8 text-stone-500">Loading enquiries...</div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="text-center py-8 text-stone-400">No enquiries found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-slate-700 uppercase tracking-wider text-xs font-bold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Business & Contact</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredEnquiries.map(enq => (
                <tr key={enq.id} className="hover:bg-stone-50 text-sm">
                  <td className="py-4 px-4 whitespace-nowrap text-stone-500">
                    {new Date(enq.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{enq.business_name}</div>
                    <div className="text-xs text-stone-600">{enq.name}</div>
                    <div className="text-xs text-stone-500">{enq.email}</div>
                    {enq.phone && <div className="text-xs text-stone-500">{enq.phone}</div>}
                    {enq.current_website && (
                      <a
                        href={enq.current_website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#C56A3C] underline block mt-0.5"
                      >
                        {enq.current_website}
                      </a>
                    )}
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <p className="text-xs text-stone-700 line-clamp-3 whitespace-pre-wrap">
                      {enq.message}
                    </p>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <select
                      value={enq.status}
                      onChange={e => handleStatusChange(enq.id, e.target.value as any)}
                      className={`text-xs font-bold p-1 rounded border ${
                        enq.status === 'new'
                          ? 'bg-red-50 text-[#DC2626] border-red-200'
                          : enq.status === 'contacting'
                          ? 'bg-amber-50 text-[#D97706] border-amber-200'
                          : enq.status === 'onboarded'
                          ? 'bg-green-50 text-[#16A34A] border-green-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      <option value="new">🔴 New</option>
                      <option value="contacting">🟡 Contacting</option>
                      <option value="onboarded">🟢 Onboarded</option>
                      <option value="archived">⚫ Archived</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(enq.id)}
                      className="px-2 py-1 text-xs text-[#DC2626] hover:bg-red-50 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}