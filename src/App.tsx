import { useEffect, useState } from 'react'
import {
  ArrowRight, Bot, Check, Clock3, HeartPulse, LoaderCircle, Menu,
  Phone, Send, ShieldCheck, X,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { sendChatMessage, type ChatMessage } from './services/chatbotService'
import { submitBooking } from './services/bookingService'
import { departments, demoSlots, doctors } from './data'
import type { BookingDetails, Department } from './types'

const initialForm: BookingDetails = {
  department: 'General Medicine', doctor: doctors[0].name, date: '', time: '',
  patientName: '', email: '', phone: '', reason: '',
}

function App() {
  const [form, setForm] = useState<BookingDetails>(initialForm)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [confirmationId, setConfirmationId] = useState('')
  const [error, setError] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setChatOpen(true), 3000)
    return () => window.clearTimeout(timer)
  }, [])

  const handleChatSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const message = chatInput.trim()
    if (!message || chatLoading) return

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: message,
    }
    setChatMessages((current) => [...current, userMessage])
    setChatInput('')
    setChatError('')
    setChatLoading(true)

    try {
      const response = await sendChatMessage(message)
      setChatMessages((current) => [...current, {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: response.reply,
      }])
    } catch {
      setChatError('I’m sorry, I couldn’t connect right now. Please try again in a moment.')
    } finally {
      setChatLoading(false)
    }
  }

  const openBooking = () => {
    setBookingOpen(true)
    setSubmitted(false)
    setError('')
    window.setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const update = (key: keyof BookingDetails, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const handleDepartment = (value: Department) => {
    const nextDoctor = doctors.find((doctor) => doctor.department === value)?.name ?? doctors[0].name
    setForm((current) => ({ ...current, department: value, doctor: nextDoctor }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const response = await submitBooking(form)
    if (!response.success) {
      setError(response.message)
      return
    }
    setConfirmationId(response.confirmationId ?? '')
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-cream text-navy">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <a href="#" className="flex items-center gap-3 text-lg font-bold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal text-white"><HeartPulse size={22} /></span>
            <span>Harborview<span className="text-teal"> Clinic</span></span>
          </a>
          <button className="rounded-lg p-2 lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav className={`${menuOpen ? 'absolute left-6 right-6 top-20 flex' : 'hidden'} flex-col gap-4 rounded-2xl bg-white p-5 shadow-soft lg:static lg:flex lg:flex-row lg:items-center lg:gap-8 lg:bg-transparent lg:p-0 lg:shadow-none`}>
            <a className="nav-link" href="#care" onClick={() => setMenuOpen(false)}>Our care</a>
            <a className="nav-link" href="#doctors" onClick={() => setMenuOpen(false)}>Our doctors</a>
            <a className="nav-link" href="#about" onClick={() => setMenuOpen(false)}>About us</a>
            <a className="nav-link" href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <button onClick={openBooking} className="btn-primary px-5 py-3 text-sm">Book an appointment <ArrowRight size={16} /></button>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-mint">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-36 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-44">
            <div className="relative z-10">
              <div className="eyebrow"><span className="h-2 w-2 rounded-full bg-teal" /> A better way to feel well</div>
              <h1 className="mt-6 max-w-xl font-display text-5xl font-semibold leading-[1.06] tracking-tight sm:text-6xl lg:text-[4.4rem]">Care that feels <em className="text-teal">closer.</em></h1>
              <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">Thoughtful, expert healthcare for every chapter of life. Find your care team and feel at home with Harborview Clinic.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button onClick={openBooking} className="btn-primary px-6 py-4">Book an appointment <ArrowRight size={17} /></button>
                <a href="#care" className="inline-flex items-center gap-2 px-4 py-3 font-semibold text-navy">Explore our care <ArrowRight size={16} className="text-teal" /></a>
              </div>
              <div className="mt-12 flex items-center gap-4 text-sm text-slate-600"><div className="flex -space-x-3"><span className="avatar bg-[#d9ad96]">MP</span><span className="avatar bg-[#9eb4b9]">AC</span><span className="avatar bg-[#d5bba2]">LN</span></div><span><strong className="text-navy">4.9/5</strong> from our patients</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -right-6 -top-8 h-52 w-52 rounded-full border border-teal/20" />
              <img className="relative z-10 aspect-[.83] w-full rounded-[2rem] object-cover shadow-soft" src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=88" alt="Doctor speaking with a patient" />
              <div className="absolute -bottom-5 -left-5 z-20 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-soft"><span className="grid h-10 w-10 place-items-center rounded-full bg-mint text-teal"><ShieldCheck size={21} /></span><div><p className="text-xs text-slate-500">Trusted care</p><p className="text-sm font-bold">Since 1998</p></div></div>
            </div>
          </div>
          <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-white/50" />
        </section>

        <section id="care" className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="eyebrow">Specialized support</div><h2 className="section-title mt-4">Care for your whole life</h2></div><p className="max-w-sm text-slate-600">From everyday check-ins to specialist support, we’re here to make your health feel simpler.</p></div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((department) => <button key={department.name} onClick={openBooking} className="group rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-teal/40 hover:shadow-soft"><span className="grid h-12 w-12 place-items-center rounded-xl bg-mint text-xl text-teal">{department.icon}</span><h3 className="mt-6 font-display text-xl font-semibold">{department.name}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{department.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal opacity-0 transition group-hover:opacity-100">Learn more <ArrowRight size={14} /></span></button>)}
          </div>
        </section>

        <section id="about" className="bg-navy text-white"><div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28"><div><div className="eyebrow text-teal-200">Why Harborview</div><h2 className="section-title mt-4 text-white">Medicine with more <em className="text-teal-200">humanity.</em></h2><p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">We believe the best care starts with listening. Our clinicians take time to understand you, your goals and what feeling well really means.</p><div className="mt-8 grid max-w-md grid-cols-2 gap-6"><div><p className="font-display text-4xl font-semibold text-teal-200">25+</p><p className="mt-1 text-sm text-slate-400">years of care</p></div><div><p className="font-display text-4xl font-semibold text-teal-200">18k</p><p className="mt-1 text-sm text-slate-400">patients supported</p></div></div></div><div className="relative"><img className="aspect-[1.2] w-full rounded-[2rem] object-cover opacity-90" src="/clinic-team.jpg" alt="Medical team collaborating" /><div className="absolute -bottom-5 -right-3 rounded-2xl bg-white px-5 py-4 text-navy shadow-soft sm:right-5"><div className="flex gap-1 text-amber-400">★★★★★</div><p className="mt-1 text-sm font-medium">“The care feels truly personal.”</p></div></div></div></section>

        <section id="doctors" className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"><div className="eyebrow">Meet the team</div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><h2 className="section-title mt-4">People who listen</h2><a href="#contact" className="inline-flex items-center gap-2 font-semibold text-teal">Meet all our doctors <ArrowRight size={16} /></a></div><div className="mt-12 grid gap-6 sm:grid-cols-3">{doctors.map((doctor) => <article key={doctor.name}><img className="aspect-[.95] w-full rounded-2xl object-cover" src={doctor.image} alt={`${doctor.name}, doctor portrait`} /><p className="mt-5 text-sm font-semibold text-teal">{doctor.specialty}</p><h3 className="mt-1 font-display text-2xl font-semibold">{doctor.name}</h3><button onClick={openBooking} className="mt-3 text-sm font-medium text-slate-500 underline decoration-slate-300 underline-offset-4">Book with {doctor.name.split(' ')[1]}</button></article>)}</div></section>

        <section id="booking" className="bg-[#f1f7f4] px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center"><div className="eyebrow justify-center">Your next step</div><h2 className="section-title mt-4">Let’s find a time for you</h2><p className="mt-4 text-slate-600">Tell us a little about what you need, and we’ll take care of the rest.</p></div>
          {bookingOpen ? <BookingForm form={form} update={update} handleDepartment={handleDepartment} handleSubmit={handleSubmit} submitted={submitted} confirmationId={confirmationId} error={error} /> : <div className="mt-10 text-center"><button onClick={openBooking} className="btn-primary px-7 py-4">Start booking <ArrowRight size={17} /></button></div>}
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-3 lg:px-8"><div><a href="#" className="flex items-center gap-3 font-bold"><span className="grid h-9 w-9 place-items-center rounded-lg bg-teal text-white"><HeartPulse size={19} /></span>Harborview<span className="text-teal"> Clinic</span></a><p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">Thoughtful healthcare for every chapter of life.</p></div><div><p className="font-semibold">Visit us</p><p className="mt-3 text-sm leading-6 text-slate-500">18 Harbor Street<br />Brookside, NY 10012</p></div><div><p className="font-semibold">Get in touch</p><a href="tel:+12125550198" className="mt-3 flex items-center gap-2 text-sm text-slate-500"><Phone size={15} /> (212) 555-0198</a><p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><Clock3 size={15} /> Mon–Fri, 8am–6pm</p></div></div><div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">© 2024 Harborview Clinic · Demo website with demo booking data</div></footer>

      <div className="fixed bottom-4 right-4 z-30 sm:bottom-6 sm:right-6">
        {!chatOpen && <div className="bot-hint absolute bottom-[calc(100%+0.9rem)] right-0 w-44 rounded-2xl rounded-br-md bg-white px-4 py-3 text-xs font-semibold leading-5 text-navy shadow-soft"><span className="text-teal">Hi, I’m Harbor!</span><br />Need a little help today?</div>}
        <button onClick={() => setChatOpen(!chatOpen)} className="group relative grid h-[4.25rem] w-[4.25rem] place-items-center rounded-full bg-teal text-white shadow-[0_12px_30px_rgba(27,138,135,.35)] transition hover:scale-105 hover:bg-[#146e6c]" aria-label={chatOpen ? 'Close chat' : 'Open chat'}>
          <span className="absolute inset-0 rounded-full border-4 border-teal/30 bot-ring" />
          <span className="relative grid h-12 w-12 place-items-center rounded-full bg-white text-teal"><Bot size={27} /><span className="absolute -right-2 -top-2 text-lg bot-wave">👋</span></span>
          <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-lime-400" />
        </button>
        {chatOpen && <div className="absolute bottom-[calc(100%+1rem)] right-0 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
          <div className="flex items-center justify-between bg-navy px-5 py-4 text-white"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-teal"><Bot size={20} /></span><div><p className="text-sm font-semibold">Harbor, your care assistant</p><p className="text-xs text-slate-300">Here to make things easier</p></div></div><button onClick={() => setChatOpen(false)} aria-label="Close chat"><X size={18} /></button></div>
          <div className="max-h-[min(430px,65vh)] overflow-y-auto p-5">
            <div className="space-y-3">
              <p className="max-w-[90%] rounded-xl rounded-tl-none bg-mint p-3 text-sm leading-5">Hi there! I’m Harbor 👋 How can I make your visit easier today?</p>
              {chatMessages.map((message) => message.role === 'assistant' ? (
                <div key={message.id} className="chat-markdown max-w-[90%] rounded-xl rounded-tl-none bg-slate-100 p-3 text-sm leading-5 text-navy">
                  <ReactMarkdown remarkPlugins={[remarkBreaks]}>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p key={message.id} className="ml-auto max-w-[90%] rounded-xl rounded-tr-none bg-teal p-3 text-sm leading-5 text-white">{message.content}</p>
              ))}
              {chatLoading && <div className="flex items-center gap-2 text-xs text-slate-500"><LoaderCircle size={15} className="animate-spin text-teal" /> Harbor is thinking...</div>}
              {chatError && <p className="rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700">{chatError}</p>}
            </div>
          </div>
          <form onSubmit={handleChatSubmit} className="flex items-center gap-2 border-t border-slate-100 p-3"><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} disabled={chatLoading} aria-label="Chat message" placeholder="Type your message..." className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/10" /><button type="submit" disabled={chatLoading || !chatInput.trim()} aria-label="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal text-white transition hover:bg-[#146e6c] disabled:cursor-not-allowed disabled:opacity-50"><Send size={16} /></button></form>
        </div>}
      </div>
    </div>
  )
}

function BookingForm({ form, update, handleDepartment, handleSubmit, submitted, confirmationId, error }: { form: BookingDetails; update: (key: keyof BookingDetails, value: string) => void; handleDepartment: (value: Department) => void; handleSubmit: (event: React.FormEvent) => void; submitted: boolean; confirmationId: string; error: string }) {
  if (submitted) return <div className="mx-auto mt-10 max-w-xl rounded-3xl bg-white p-10 text-center shadow-soft"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-teal"><Check size={30} /></span><h3 className="mt-6 font-display text-3xl font-semibold">You’re all set.</h3><p className="mt-3 text-slate-600">Your appointment request was received. We’ll be in touch shortly to confirm the details.</p><p className="mt-6 inline-block rounded-lg bg-slate-50 px-4 py-2 text-sm font-bold tracking-wide text-navy">Confirmation: {confirmationId}</p></div>
  return <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-4xl rounded-3xl bg-white p-6 shadow-soft sm:p-10"><div className="grid gap-6 md:grid-cols-2"><Field label="Department"><select value={form.department} onChange={(e) => handleDepartment(e.target.value as Department)}>{departments.map((item) => <option key={item.name}>{item.name}</option>)}</select></Field><Field label="Preferred doctor"><select value={form.doctor} onChange={(e) => update('doctor', e.target.value)}>{doctors.filter((doctor) => doctor.department === form.department).map((doctor) => <option key={doctor.name}>{doctor.name}</option>)}</select></Field><Field label="Preferred date"><input required type="date" value={form.date} onChange={(e) => update('date', e.target.value)} min={new Date().toISOString().split('T')[0]} /></Field><Field label="Available time"><select required value={form.time} onChange={(e) => update('time', e.target.value)}><option value="">Select a time</option>{demoSlots.map((slot) => <option key={slot}>{slot}</option>)}</select></Field><Field label="Your full name"><input required value={form.patientName} onChange={(e) => update('patientName', e.target.value)} placeholder="Jane Smith" /></Field><Field label="Email address"><input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@example.com" /></Field><Field label="Phone number"><input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(212) 555-0123" /></Field><Field label="What can we help with?"><input value={form.reason} onChange={(e) => update('reason', e.target.value)} placeholder="Optional" /></Field></div>{error && <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center"><p className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={16} className="text-teal" /> Your information is kept private.</p><button type="submit" className="btn-primary px-6 py-3.5">Request appointment <Send size={16} /></button></div></form>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="field"><span>{label}</span>{children}</label> }

export default App
