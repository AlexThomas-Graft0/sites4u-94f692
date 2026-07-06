'use client'

import React, { useState, useEffect } from 'react'
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

  // Form states for manual additions
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [currentWebsite, setCurrentWebsite] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'new' | 'contacting' | 'onboarded' | 'archived'>('new')
  const [isAdding, setIsAdding] = useState(false)

  // Filter state
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
      const { data, error: insertErr } = await supabase
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
        .select()

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

      {/* Filter Tabs */}
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
 Amelia Bowen generated this component. Ensure strict rendering and responsive layouts. No hydration mismatch.@@FILE:components/dashboard/BlogManager.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image_url: string | null
  published_at: string | null
  created_at: string
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [isEditing, setIsEditing] = useState<string | null>(null) // ID of post being edited, or 'new'
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [featuredImageUrl, setFeaturedImageUrl] = useState('')
  const [isPublished, setIsPublished] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchErr } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr
      setPosts(data || [])
    } catch (err: any) {
      setError(err.message || 'Could not fetch blog posts')
    } finally {
      setLoading(false)
    }
  }

  const handleAutoSlug = (val: string) => {
    setTitle(val)
    if (!isEditing || isEditing === 'new') {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
      )
    }
  }

  const startNew = () => {
    setIsEditing('new')
    setTitle('')
    setSlug('')
    setContent('')
    setExcerpt('')
    setFeaturedImageUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80')
    setIsPublished(true)
  }

  const startEdit = (post: BlogPost) => {
    setIsEditing(post.id)
    setTitle(post.title)
    setSlug(post.slug)
    setContent(post.content)
    setExcerpt(post.excerpt || '')
    setFeaturedImageUrl(post.featured_image_url || '')
    setIsPublished(!!post.published_at)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title || !slug || !content) {
      setError('Please fill out all required fields (Title, Slug, Content)')
      return
    }

    const payload = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      featured_image_url: featuredImageUrl || null,
      published_at: isPublished ? new Date().toISOString() : null,
    }

    try {
      if (isEditing === 'new') {
        const { error: insertErr } = await supabase.from('blog_posts').insert([payload])
        if (insertErr) throw insertErr
        setSuccess('Blog post published successfully!')
      } else {
        const { error: updateErr } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', isEditing)
        if (updateErr) throw updateErr
        setSuccess('Blog post updated successfully!')
      }

      setIsEditing(null)
      fetchPosts()
    } catch (err: any) {
      setError(err.message || 'Could not save blog post')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    setError(null)
    setSuccess(null)
    try {
      const { error: delErr } = await supabase.from('blog_posts').delete().eq('id', id)
      if (delErr) throw delErr
      setSuccess('Blog post deleted successfully')
      setPosts(prev => prev.filter(item => item.id !== id))
    } catch (err: any) {
      setError(err.message || 'Could not delete blog post')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 font-bold">Small Business Hub (CMS)</h2>
          <p className="text-sm text-slate-500">Publish and manage educational guides for South Wales business owners</p>
        </div>
        {!isEditing && (
          <button
            onClick={startNew}
            className="px-4 py-2 bg-[#C56A3C] hover:bg-[#b05a2f] text-white font-bold rounded transition text-sm"
          >
            + Write New Article
          </button>
        )}
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

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-stone-50 p-6 rounded-lg border border-stone-200 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-serif">
            {isEditing === 'new' ? 'Publish a New Article' : 'Edit Article'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Article Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => handleAutoSlug(e.target.value)}
                placeholder="e.g., How to Get Your Swansea Business Listed on Google Maps"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">URL Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="e.g., get-listed-on-google-maps"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Featured Image URL</label>
              <input
                type="text"
                value={featuredImageUrl}
                onChange={e => setFeaturedImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  className="rounded text-[#C56A3C] focus:ring-[#C56A3C] h-4 w-4"
                />
                Publish Instantly (Make visible to public)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">Short Excerpt (Pre-view text) *</label>
            <input
              type="text"
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Learn how to claim your free Google Maps listing and rank higher..."
              className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">Article Body Content (Markdown Supported) *</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your plain-English guide content here..."
              className="w-full mt-1 p-2 border border-stone-300 rounded text-sm h-64 font-mono focus:ring-1 focus:ring-[#C56A3C]"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(null)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C56A3C] hover:bg-[#b05a2f] text-white font-bold rounded text-sm"
            >
              {isEditing === 'new' ? 'Publish Article' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : loading ? (
        <div className="text-center py-8 text-stone-500">Loading articles...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-stone-400">No blog posts found. Write your first one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => (
            <div key={post.id} className="border border-stone-200 rounded-lg p-4 hover:shadow-md transition bg-white flex flex-col justify-between">
              <div>
                {post.featured_image_url && (
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    post.published_at ? 'bg-green-100 text-[#16A34A]' : 'bg-amber-100 text-[#D97706]'
                  }`}>
                    {post.published_at ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(post.created_at).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-slate-900 text-lg line-clamp-1">{post.title}</h4>
                <p className="text-xs text-stone-500 font-mono mb-2">/{post.slug}</p>
                <p className="text-xs text-stone-600 line-clamp-2 mb-4">{post.excerpt || 'No excerpt provided.'}</p>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  onClick={() => startEdit(post)}
                  className="px-3 py-1 text-xs font-bold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 text-xs font-bold text-[#DC2626] bg-red-50 hover:bg-red-100 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
 Amelia Bowen generated this component. Ensure strict rendering and responsive layouts. No hydration mismatch.@@FILE:components/dashboard/CaseStudiesManager.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface CaseStudy {
  id: string
  client_name: string
  industry: string | null
  challenge: string | null
  solution: string | null
  result_metric_highlight: string | null
  image_url: string | null
  display_order: number
  created_at: string
}

export default function CaseStudiesManager() {
  const [studies, setStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [isEditing, setIsEditing] = useState<string | null>(null) // ID or 'new'
  const [clientName, setClientName] = useState('')
  const [industry, setIndustry] = useState('')
  const [challenge, setChallenge] = useState('')
  const [solution, setSolution] = useState('')
  const [resultMetric, setResultMetric] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(0)

  useEffect(() => {
    fetchStudies()
  }, [])

  const fetchStudies = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchErr } = await supabase
        .from('case_studies')
        .select('*')
        .order('display_order', { ascending: true })

      if (fetchErr) throw fetchErr
      setStudies(data || [])
    } catch (err: any) {
      setError(err.message || 'Could not fetch case studies')
    } finally {
      setLoading(false)
    }
  }

  const startNew = () => {
    setIsEditing('new')
    setClientName('')
    setIndustry('')
    setChallenge('')
    setSolution('')
    setResultMetric('')
    setImageUrl('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80')
    setDisplayOrder(0)
  }

  const startEdit = (cs: CaseStudy) => {
    setIsEditing(cs.id)
    setClientName(cs.client_name)
    setIndustry(cs.industry || '')
    setChallenge(cs.challenge || '')
    setSolution(cs.solution || '')
    setResultMetric(cs.result_metric_highlight || '')
    setImageUrl(cs.image_url || '')
    setDisplayOrder(cs.display_order)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!clientName) {
      setError('Client name is required')
      return
    }

    const payload = {
      client_name: clientName,
      industry: industry || null,
      challenge: challenge || null,
      solution: solution || null,
      result_metric_highlight: resultMetric || null,
      image_url: imageUrl || null,
      display_order: Number(displayOrder),
    }

    try {
      if (isEditing === 'new') {
        const { error: insertErr } = await supabase.from('case_studies').insert([payload])
        if (insertErr) throw insertErr
        setSuccess('Case study created successfully!')
      } else {
        const { error: updateErr } = await supabase
          .from('case_studies')
          .update(payload)
          .eq('id', isEditing)
        if (updateErr) throw updateErr
        setSuccess('Case study updated successfully!')
      }

      setIsEditing(null)
      fetchStudies()
    } catch (err: any) {
      setError(err.message || 'Could not save case study')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return
    setError(null)
    setSuccess(null)
    try {
      const { error: delErr } = await supabase.from('case_studies').delete().eq('id', id)
      if (delErr) throw delErr
      setSuccess('Case study deleted successfully')
      setStudies(prev => prev.filter(item => item.id !== id))
    } catch (err: any) {
      setError(err.message || 'Could not delete case study')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 font-bold">Local Success Transformations</h2>
          <p className="text-sm text-slate-500">Manage Before & After stories and real growth metrics for South Wales SMEs</p>
        </div>
        {!isEditing && (
          <button
            onClick={startNew}
            className="px-4 py-2 bg-[#C56A3C] hover:bg-[#b05a2f] text-white font-bold rounded transition text-sm"
          >
            + Add Case Study
          </button>
        )}
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

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-stone-50 p-6 rounded-lg border border-stone-200 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-serif">
            {isEditing === 'new' ? 'New Local Case Study' : 'Edit Case Study'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Client / Business Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="The Uplands Cafe"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="Cafe & Restaurant"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Display Order (Sort rank)</label>
              <input
                type="number"
                value={displayOrder}
                onChange={e => setDisplayOrder(Number(e.target.value))}
                placeholder="0"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Result Metric Highlight (Green Badge)</label>
              <input
                type="text"
                value={resultMetric}
                onChange={e => setResultMetric(e.target.value)}
                placeholder="e.g., ★ +140% Table Bookings & Ranked #1 for 'Breakfast in Uplands'"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">The Challenge (Before)</label>
            <textarea
              value={challenge}
              onChange={e => setChallenge(e.target.value)}
              placeholder="Describe what was hold holding them back..."
              className="w-full mt-1 p-2 border border-stone-300 rounded text-sm h-24 focus:ring-1 focus:ring-[#C56A3C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">The Solution (The sites4u Way)</label>
            <textarea
              value={solution}
              onChange={e => setSolution(e.target.value)}
              placeholder="How we step in to make it secure, simple, and fast..."
              className="w-full mt-1 p-2 border border-stone-300 rounded text-sm h-24 focus:ring-1 focus:ring-[#C56A3C]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(null)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C56A3C] hover:bg-[#b05a2f] text-white font-bold rounded text-sm"
            >
              {isEditing === 'new' ? 'Add Case Study' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : loading ? (
        <div className="text-center py-8 text-stone-500">Loading case studies...</div>
      ) : studies.length === 0 ? (
        <div className="text-center py-8 text-stone-400">No case studies yet. Create one!</div>
      ) : (
        <div className="space-y-4">
          {studies.map(cs => (
            <div key={cs.id} className="border border-stone-200 rounded-lg p-4 bg-white hover:shadow-sm transition flex flex-col md:flex-row gap-4">
              {cs.image_url && (
                <img
                  src={cs.image_url}
                  alt={cs.client_name}
                  className="w-full md:w-48 h-32 object-cover rounded border border-stone-100"
                />
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-lg">{cs.client_name}</h4>
                    <span className="text-xs text-stone-500 uppercase tracking-wider">{cs.industry || 'Local SME'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-stone-100 text-stone-800 text-xs px-2 py-1 rounded font-mono">
                      Order: {cs.display_order}
                    </span>
                    {cs.result_metric_highlight && (
                      <span className="bg-green-100 text-[#16A34A] text-xs font-bold px-2 py-1 rounded">
                        {cs.result_metric_highlight}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-700 mb-4">
                  <div>
                    <strong className="text-slate-900 block mb-1">🔴 The Challenge:</strong>
                    <p className="line-clamp-3">{cs.challenge || 'No challenge description provided'}</p>
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-1">🟢 The Solution:</strong>
                    <p className="line-clamp-3">{cs.solution || 'No solution description provided'}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => startEdit(cs)}
                    className="px-3 py-1 text-xs font-bold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cs.id)}
                    className="px-3 py-1 text-xs font-bold text-[#DC2626] bg-red-50 hover:bg-red-100 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
 Amelia Bowen generated this component. Ensure strict rendering and responsive layouts. No hydration mismatch.@@FILE:components/dashboard/AnalyticsManager.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Profile {
  id: string
  email: string | null
  business_name: string | null
  role: 'admin' | 'client'
  created_at: string
}

interface AnalyticsReport {
  id: string
  client_id: string
  month_year: string
  total_visits: number
  google_maps_views: number
  phone_clicks: number
  seo_health_score: number
  notes: string | null
  updated_at: string
  created_at: string
}

export default function AnalyticsManager() {
  const [reports, setReports] = useState<AnalyticsReport[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [isEditing, setIsEditing] = useState<string | null>(null) // ID or 'new'
  const [clientId, setClientId] = useState('')
  const [monthYear, setMonthYear] = useState('')
  const [totalVisits, setTotalVisits] = useState<number>(0)
  const [googleMapsViews, setGoogleMapsViews] = useState<number>(0)
  const [phoneClicks, setPhoneClicks] = useState<number>(0)
  const [seoHealthScore, setSeoHealthScore] = useState<number>(100)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch profiles to link
      const { data: profs, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .order('business_name', { ascending: true })
      if (profErr) throw profErr
      setProfiles(profs || [])

      // 2. Fetch reports
      const { data: reps, error: repErr } = await supabase
        .from('analytics_reports')
        .select('*')
        .order('created_at', { ascending: false })
      if (repErr) throw repErr
      setReports(reps || [])
    } catch (err: any) {
      setError(err.message || 'Could not load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const startNew = () => {
    setIsEditing('new')
    setClientId(profiles[0]?.id || '')
    setMonthYear('October 2024')
    setTotalVisits(1240)
    setGoogleMapsViews(3850)
    setPhoneClicks(84)
    setSeoHealthScore(98)
    setNotes('Great growth this month! Your local map optimization is working perfectly.')
  }

  const startEdit = (rep: AnalyticsReport) => {
    setIsEditing(rep.id)
    setClientId(rep.client_id)
    setMonthYear(rep.month_year)
    setTotalVisits(rep.total_visits)
    setGoogleMapsViews(rep.google_maps_views)
    setPhoneClicks(rep.phone_clicks)
    setSeoHealthScore(rep.seo_health_score)
    setNotes(rep.notes || '')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!clientId || !monthYear) {
      setError('Please select a client and specify a reporting period')
      return
    }

    const payload = {
      client_id: clientId,
      month_year: monthYear,
      total_visits: Number(totalVisits),
      google_maps_views: Number(googleMapsViews),
      phone_clicks: Number(phoneClicks),
      seo_health_score: Number(seoHealthScore),
      notes: notes || null,
      updated_at: new Date().toISOString(),
    }

    try {
      if (isEditing === 'new') {
        const { error: insertErr } = await supabase.from('analytics_reports').insert([payload])
        if (insertErr) throw insertErr
        setSuccess('Monthly analytics report published to client portal!')
      } else {
        const { error: updateErr } = await supabase
          .from('analytics_reports')
          .update(payload)
          .eq('id', isEditing)
        if (updateErr) throw updateErr
        setSuccess('Monthly analytics report updated successfully!')
      }

      setIsEditing(null)
      fetchData()
    } catch (err: any) {
      setError(err.message || 'Could not save report')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analytics report?')) return
    setError(null)
    setSuccess(null)
    try {
      const { error: delErr } = await supabase.from('analytics_reports').delete().eq('id', id)
      if (delErr) throw delErr
      setSuccess('Report deleted successfully')
      setReports(prev => prev.filter(item => item.id !== id))
    } catch (err: any) {
      setError(err.message || 'Could not delete report')
    }
  }

  const getClientBusinessName = (cid: string) => {
    const prof = profiles.find(p => p.id === cid)
    return prof ? prof.business_name || prof.email : 'Unknown Client'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 font-bold">Monthly Client Performance Summary</h2>
          <p className="text-sm text-slate-500">Publish simple, jargon-free SEO & website traffic metrics directly to the client portal</p>
        </div>
        {!isEditing && (
          <button
            onClick={startNew}
            className="px-4 py-2 bg-[#C56A3C] hover:bg-[#b05a2f] text-white font-bold rounded transition text-sm"
            disabled={profiles.length === 0}
          >
            {profiles.length === 0 ? 'No Clients Available' : '+ Generate Monthly Report'}
          </button>
        )}
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

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-[#F3E9D8]/20 p-6 rounded-lg border border-stone-200 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-serif">
            {isEditing === 'new' ? 'Publish a Performance Report' : 'Edit Performance Report'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Select Client Profile *</label>
              <select
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm bg-white focus:ring-1 focus:ring-[#C56A3C]"
                required
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.business_name ? `${p.business_name} (${p.email})` : p.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Reporting Period *</label>
              <input
                type="text"
                value={monthYear}
                onChange={e => setMonthYear(e.target.value)}
                placeholder="e.g., October 2024"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Website Visitors *</label>
              <input
                type="number"
                value={totalVisits}
                onChange={e => setTotalVisits(Number(e.target.value))}
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Google Maps Views *</label>
              <input
                type="number"
                value={googleMapsViews}
                onChange={e => setGoogleMapsViews(Number(e.target.value))}
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Phone Clicks *</label>
              <input
                type="number"
                value={phoneClicks}
                onChange={e => setPhoneClicks(Number(e.target.value))}
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">SEO Health Score (1-100) *</label>
              <input
                type="number"
                value={seoHealthScore}
                onChange={e => setSeoHealthScore(Number(e.target.value))}
                min="1"
                max="100"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">Plain-English Admin Notes (Shown to Client)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Great growth this month! Your local map optimization is working perfectly."
              className="w-full mt-1 p-2 border border-stone-300 rounded text-sm h-20 focus:ring-1 focus:ring-[#C56A3C]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(null)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C56A3C] hover:bg-[#b05a2f] text-white font-bold rounded text-sm"
            >
              {isEditing === 'new' ? 'Publish Report' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : loading ? (
        <div className="text-center py-8 text-stone-500">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-8 text-stone-400">No client reports generated yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-slate-700 uppercase tracking-wider text-xs font-bold">
                <th className="py-3 px-4">Client / Business</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4 text-center">Visitors</th>
                <th className="py-3 px-4 text-center">Maps Views</th>
                <th className="py-3 px-4 text-center">Phone Clicks</th>
                <th className="py-3 px-4 text-center">SEO Health</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reports.map(rep => (
                <tr key={rep.id} className="hover:bg-stone-50 text-sm">
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{getClientBusinessName(rep.client_id)}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-stone-600">{rep.month_year}</td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-[#C56A3C]">
                    {rep.total_visits.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">
                    {rep.google_maps_views.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-[#16A34A]">
                    {rep.phone_clicks}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="bg-green-50 text-[#16A34A] border border-green-200 text-xs px-2 py-0.5 rounded font-mono font-bold">
                      {rep.seo_health_score}/100
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => startEdit(rep)}
                      className="px-2 py-1 text-xs text-slate-700 hover:bg-stone-100 rounded mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rep.id)}
                      className="px-2 py-1 text-xs text-[#DC2626] hover:bg-red-50 rounded"
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
 Amelia Bowen generated this component. Ensure strict rendering and responsive layouts. No hydration mismatch.@@FILE:components/dashboard/ProfilesManager.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Profile {
  id: string
  email: string | null
  business_name: string | null
  role: 'admin' | 'client'
  created_at: string
}

export default function ProfilesManager() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [role, setRole] = useState<'admin' | 'client'>('client')

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr
      setProfiles(data || [])
    } catch (err: any) {
      setError(err.message || 'Could not fetch profiles')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (p: Profile) => {
    setIsEditing(p.id)
    setEmail(p.email || '')
    setBusinessName(p.business_name || '')
    setRole(p.role)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!isEditing) return

    try {
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          email: email || null,
          business_name: businessName || null,
          role,
        })
        .eq('id', isEditing)

      if (updateErr) throw updateErr

      setSuccess('Profile updated successfully!')
      setIsEditing(null)
      fetchProfiles()
    } catch (err: any) {
      setError(err.message || 'Could not update profile')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile? All associated analytics reports and support requests will be permanently lost!')) return
    setError(null)
    setSuccess(null)
    try {
      const { error: delErr } = await supabase.from('profiles').delete().eq('id', id)
      if (delErr) throw delErr
      setSuccess('Profile deleted successfully')
      setProfiles(prev => prev.filter(item => item.id !== id))
    } catch (err: any) {
      setError(err.message || 'Could not delete profile')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-slate-900 font-bold">Client Portals & User Profiles</h2>
        <p className="text-sm text-slate-500">Manage registered business owner accounts and their access level</p>
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

      {isEditing && (
        <form onSubmit={handleSave} className="bg-stone-50 p-6 rounded-lg border border-stone-200 mb-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-serif">Edit User Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="Bowen & Sons Plumbing"
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-[#C56A3C]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full mt-1 p-2 border border-stone-300 rounded text-sm bg-white"
              >
                <option value="client">Client (Access to portal analytics)</option>
                <option value="admin">Admin (Full operations dashboard)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(null)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C56A3C] hover:bg-[#b05a2f] text-white font-bold rounded text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8 text-stone-500">Loading user profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-8 text-stone-400">No registered profiles found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-slate-700 uppercase tracking-wider text-xs font-bold">
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {profiles.map(p => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="py-4 px-4 text-stone-500 whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {p.business_name || <span className="text-stone-400 italic">Not set</span>}
                  </td>
                  <td className="py-4 px-4 text-stone-600 font-mono text-xs">{p.email || 'No email'}</td>
                  <td className="py-4 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                      p.role === 'admin' ? 'bg-red-100 text-[#DC2626]' : 'bg-[#F3E9D8] text-slate-800'
                    }`}>
                      {p.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => startEdit(p)}
                      className="px-2 py-1 text-xs text-slate-700 hover:bg-stone-100 rounded mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-2 py-1 text-xs text-[#DC2626] hover:bg-red-50 rounded"
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
 Amelia Bowen generated this component. Ensure strict rendering and responsive layouts. No hydration mismatch.@@FILE:components/dashboard/SupportManager.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Profile {
  id: string
  email: string | null
  business_name: string | null
}

interface SupportRequest {
  id: string
  client_id: string
  message: string
  created_at: string
}

export default function SupportManager() {
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch support requests
      const { data: reqs, error: reqErr } = await supabase
        .from('support_requests')
        .select('*')
        .order('created_at', { ascending: false })
      if (reqErr) throw reqErr
      setRequests(reqs || [])

      // 2. Fetch profiles for lookup
      const { data: profs, error: profErr } = await supabase
        .from('profiles')
        .select('id, email, business_name')
      if (profErr) throw profErr
      setProfiles(profs || [])
    } catch (err: any) {
      setError(err.message || 'Could not fetch support requests')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Mark this support request as resolved and delete it?')) return
    setError(null)
    setSuccess(null)
    try {
      const { error: delErr } = await supabase.from('support_requests').delete().eq('id', id)
      if (delErr) throw delErr
      setSuccess('Support request marked as resolved')
      setRequests(prev => prev.filter(item => item.id !== id))
    } catch (err: any) {
      setError(err.message || 'Could not delete support request')
    }
  }

  const getClientInfo = (cid: string) => {
    const prof = profiles.find(p => p.id === cid)
    return prof
      ? { name: prof.business_name || 'No Business Name', email: prof.email || 'No Email' }
      : { name: 'Unknown Client', email: '' }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-slate-900 font-bold">Client Support & Website Updates</h2>
        <p className="text-sm text-slate-500">Live requests submitted by active Welsh business owners through their portals</p>
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

      {loading ? (
        <div className="text-center py-8 text-stone-500">Loading support requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-stone-200 rounded-lg bg-stone-50">
          <p className="text-stone-400 font-serif text-lg">🎉 All Quiet on the Western Front!</p>
          <p className="text-xs text-stone-500 mt-1">No pending website updates or technical tickets.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => {
            const client = getClientInfo(req.client_id)
            return (
              <div
                key={req.id}
                className="p-5 rounded-lg border border-stone-200 bg-stone-50/50 hover:shadow-sm transition flex flex-col sm:flex-row justify-between items-start gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#C56A3C]/10 text-[#C56A3C] text-xs font-bold px-2 py-0.5 rounded">
                      Update Requested
                    </span>
                    <span className="text-xs text-stone-400">
                      {new Date(req.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{client.name}</h4>
                    <p className="text-xs text-stone-500 font-mono">{client.email}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-stone-100 text-sm text-stone-800 whitespace-pre-wrap">
                    {req.message}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(req.id)}
                  className="px-4 py-2 bg-green-100 hover:bg-green-200 text-[#16A34A] font-bold text-xs rounded transition self-start whitespace-nowrap"
                >
                  ✓ Mark Resolved
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
 Amelia Bowen generated this component. Ensure strict rendering and responsive layouts. No hydration mismatch.@@FILE:app/dashboard/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

// Import Dashboard Sections
import EnquiriesManager from '@/components/dashboard/EnquiriesManager'
import BlogManager from '@/components/dashboard/BlogManager'
import CaseStudiesManager from '@/components/dashboard/CaseStudiesManager'
import AnalyticsManager from '@/components/dashboard/AnalyticsManager'
import ProfilesManager from '@/components/dashboard/ProfilesManager'
import SupportManager from '@/components/dashboard/SupportManager'

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<'leads' | 'blog' | 'cases' | 'analytics' | 'profiles' | 'support'>('leads')
  const [stats, setStats] = useState({
    enquiriesCount: 0,
    blogCount: 0,
    caseCount: 0,
    supportCount: 0,
    clientCount: 0,
  })
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserAndStats()
  }, [])

  const fetchUserAndStats = async () => {
    setLoading(true)
    try {
      // Get logged in user details
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setCurrentUser({ ...user, ...profile })
      }

      // Fetch quick counts
      const { count: enqCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: true })
      const { count: blogCount } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true })
      const { count: caseCount } = await supabase.from('case_studies').select('*', { count: 'exact', head: true })
      const { count: supportCount } = await supabase.from('support_requests').select('*', { count: 'exact', head: true })
      const { count: clientCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client')

      setStats({
        enquiriesCount: enqCount || 0,
        blogCount: blogCount || 0,
        caseCount: caseCount || 0,
        supportCount: supportCount || 0,
        clientCount: clientCount || 0,
      })
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      {/* Top Header Row */}
      <header className="bg-[#1E293B] text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#C56A3C] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Internal Team
            </span>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-white">
              sites<span className="text-[#C56A3C]">4u</span> Operations
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-stone-300 hover:text-white transition text-xs font-bold uppercase tracking-wider"
            >
              ← Back to Site
            </Link>
            <div className="h-4 w-[1px] bg-stone-700 hidden md:block" />
            <span className="text-xs text-stone-300">
              Logged in: <strong className="text-[#C56A3C]">{currentUser?.email || 'Admin'}</strong>
            </span>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-bold uppercase tracking-wider transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Jargon-free Welcoming Banner */}
        <div className="bg-[#F3E9D8] rounded-xl p-6 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif text-slate-900 font-bold">
              Shwmae, {currentUser?.business_name || 'Team member'}!
            </h2>
            <p className="text-sm text-stone-700 max-w-2xl mt-1">
              Welcome to your master control station. Keep South Wales’ high streets competitive by tracking active enquiries, publishing fresh guides, and updating performance reports for our independent partners.
            </p>
          </div>
          <button
            onClick={fetchUserAndStats}
            className="self-start md:self-auto px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded transition"
          >
            🔄 Refresh All Data
          </button>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Leads & Enquiries</span>
            <span className="text-3xl font-serif font-bold text-[#C56A3C] block mt-1">
              {loading ? '...' : stats.enquiriesCount}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">Total incoming submissions</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Active Clients</span>
            <span className="text-3xl font-serif font-bold text-slate-800 block mt-1">
              {loading ? '...' : stats.clientCount}
            </span>
            <span className="text-[10px] text-[#16A34A] font-bold block mt-1">Registered portals</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Hub Guides</span>
            <span className="text-3xl font-serif font-bold text-slate-800 block mt-1">
              {loading ? '...' : stats.blogCount}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">SEO articles published</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Local Successes</span>
            <span className="text-3xl font-serif font-bold text-slate-800 block mt-1">
              {loading ? '...' : stats.caseCount}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">Case studies on main site</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Support Tickets</span>
            <span className="text-3xl font-serif font-bold text-[#DC2626] block mt-1">
              {loading ? '...' : stats.supportCount}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">Unresolved requests</span>
          </div>
        </div>

        {/* Tab System */}
        <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition uppercase tracking-wider ${
              activeTab === 'leads'
                ? 'bg-[#C56A3C] text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            📞 Leads ({stats.enquiriesCount})
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition uppercase tracking-wider ${
              activeTab === 'support'
                ? 'bg-[#C56A3C] text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            🛠 Support Tickets ({stats.supportCount})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition uppercase tracking-wider ${
              activeTab === 'analytics'
                ? 'bg-[#C56A3C] text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            📊 Client Reports
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition uppercase tracking-wider ${
              activeTab === 'blog'
                ? 'bg-[#C56A3C] text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            ✍ Blog CMS
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition uppercase tracking-wider ${
              activeTab === 'cases'
                ? 'bg-[#C56A3C] text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            🏆 Case Studies
          </button>

          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition uppercase tracking-wider ${
              activeTab === 'profiles'
                ? 'bg-[#C56A3C] text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            👥 User Accounts
          </button>
        </div>

        {/* Active Tab View */}
        <div className="transition-all duration-150">
          {activeTab === 'leads' && <EnquiriesManager />}
          {activeTab === 'support' && <SupportManager />}
          {activeTab === 'analytics' && <AnalyticsManager />}
          {activeTab === 'blog' && <BlogManager />}
          {activeTab === 'cases' && <CaseStudiesManager />}
          {activeTab === 'profiles' && <ProfilesManager />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 px-6 mt-16 text-center border-t border-stone-800">
        <p className="text-xs uppercase tracking-widest font-bold text-stone-500 mb-2">
          Internal operations panel • sites4u Swansea
        </p>
        <p className="text-sm">
          Built with care for West Glamorgan, Gower, Llanelli, and beyond. Speak Business, Not Code.
        </p>
      </footer>
    </div>
  )
}
 Amelia Bowen generated this component. Ensure strict rendering and responsive layouts. No hydration mismatch.