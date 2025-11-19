import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Spline from '@splinetool/react-spline'

const brand = {
  cream: '#F5EFE6',
  black: '#0C0C0C',
  gold: '#D3C4A6',
}

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Splash({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: brand.cream }}>
      <div className="w-full h-[50vh] max-w-5xl">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <h1 className="text-4xl md:text-6xl font-serif tracking-tight" style={{ color: brand.black }}>RUVA</h1>
      <p className="mt-3 text-sm md:text-base opacity-70" style={{ color: brand.black }}>Face • Physique • Styling</p>
      <button onClick={onStart} className="mt-8 px-6 py-3 rounded-full text-sm font-medium shadow-sm transition-colors" style={{ background: brand.black, color: brand.cream }}>
        Get Started
      </button>
    </div>
  )
}

function Onboarding({ onSelect }) {
  const options = [
    { key: 'physique', title: 'Physique' },
    { key: 'lookmaxxing', title: 'Lookmaxxing' },
    { key: 'styling', title: 'Styling' },
  ]
  return (
    <div className="min-h-screen" style={{ background: brand.cream, color: brand.black }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-serif text-3xl md:text-5xl mb-8">Choose your focus</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {options.map(o => (
            <button key={o.key} onClick={() => onSelect(o.key)} className="rounded-2xl p-6 border hover:shadow-lg transition-all text-left" style={{ borderColor: brand.gold }}>
              <div className="text-xl font-medium">{o.title}</div>
              <div className="mt-2 text-sm opacity-70">Tap to continue</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Auth({ onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const url = mode === 'signup' ? `${apiBase}/auth/signup` : `${apiBase}/auth/login`
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      if (!r.ok) throw new Error((await r.json()).detail || 'Error')
      const data = await r.json()
      onAuthed(data.user_id, email)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const guest = async () => {
    setLoading(true); setError('')
    try {
      const r = await fetch(`${apiBase}/auth/guest`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email || `guest_${Date.now()}@ruva.app` }) })
      const data = await r.json()
      onAuthed(data.user_id, data.email)
    } catch (err) { setError('Guest login failed') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: brand.cream }}>
      <div className="w-full max-w-md rounded-3xl p-8 shadow-xl" style={{ background: '#fff', color: brand.black }}>
        <h3 className="font-serif text-3xl mb-6">{mode === 'signup' ? 'Create account' : 'Welcome back'}</h3>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full border rounded-xl px-4 py-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded-xl px-4 py-3" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="w-full rounded-full py-3" style={{ background: brand.black, color: brand.cream }}>{loading ? 'Please wait...' : (mode==='signup'?'Sign up':'Log in')}</button>
        </form>
        <div className="flex items-center justify-between mt-4 text-sm">
          <button onClick={()=>setMode(mode==='signup'?'login':'signup')} className="underline">{mode==='signup'?'I have an account':'Create an account'}</button>
          <button onClick={guest} className="opacity-80">Continue as guest</button>
        </div>
      </div>
    </div>
  )
}

function UserInputForm({ userId, onDone }) {
  const [form, setForm] = useState({ height_cm:'', weight_kg:'', age:'', goals:'', style_vibe:'' })
  const [photo, setPhoto] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const payload = {
      user_id: userId,
      face_photo_url: photo || null,
      height_cm: form.height_cm? Number(form.height_cm): null,
      weight_kg: form.weight_kg? Number(form.weight_kg): null,
      age: form.age? Number(form.age): null,
      goals: form.goals || null,
      style_vibe: form.style_vibe || null
    }
    await fetch(`${apiBase}/input`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    onDone()
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: brand.cream, color: brand.black }}>
      <div className="max-w-3xl mx-auto">
        <h3 className="font-serif text-3xl mb-6">Your baseline</h3>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full border rounded-xl px-4 py-3" placeholder="Face photo URL (optional)" value={photo} onChange={e=>setPhoto(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className="border rounded-xl px-4 py-3" placeholder="Height (cm)" value={form.height_cm} onChange={e=>setForm({...form, height_cm:e.target.value})} />
            <input className="border rounded-xl px-4 py-3" placeholder="Weight (kg)" value={form.weight_kg} onChange={e=>setForm({...form, weight_kg:e.target.value})} />
            <input className="border rounded-xl px-4 py-3" placeholder="Age" value={form.age} onChange={e=>setForm({...form, age:e.target.value})} />
            <input className="border rounded-xl px-4 py-3" placeholder="Style vibe (e.g., minimal)" value={form.style_vibe} onChange={e=>setForm({...form, style_vibe:e.target.value})} />
          </div>
          <textarea className="w-full border rounded-xl px-4 py-3" rows="4" placeholder="Goals" value={form.goals} onChange={e=>setForm({...form, goals:e.target.value})} />
          <button className="rounded-full px-6 py-3" style={{ background: brand.black, color: brand.cream }}>Continue</button>
        </form>
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: brand.cream, color: brand.black }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[color:var(--gold,#D3C4A6)] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Running your plan...</p>
      </div>
    </div>
  )
}

function Summary({ data, onDetails }) {
  return (
    <div className="min-h-screen px-6 py-10" style={{ background: brand.cream, color: brand.black }}>
      <div className="max-w-3xl mx-auto">
        <h3 className="font-serif text-3xl mb-6">Quick Summary</h3>
        <div className="grid gap-3">
          <Card title="Face" text={data.face_summary} />
          <Card title="Physique" text={data.physique_summary} />
          <Card title="Style" text={data.style_summary} />
          <Card title="Outfit" text={data.outfit_summary} />
        </div>
        <button onClick={onDetails} className="mt-6 rounded-full px-6 py-3" style={{ background: brand.black, color: brand.cream }}>See details</button>
      </div>
    </div>
  )
}

function Card({ title, text }){
  return (
    <div className="rounded-2xl p-4 border" style={{ borderColor: brand.gold }}>
      <div className="font-medium">{title}</div>
      <div className="opacity-70 text-sm mt-1 whitespace-pre-wrap">{text}</div>
    </div>
  )
}

function Details({ data, onNext }){
  return (
    <div className="min-h-screen px-6 py-10" style={{ background: brand.cream, color: brand.black }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Section title="Detailed Lookmaxxing" items={{
          'Face shape': data.face.face_shape,
          'Strong features': data.face.strong_features.join(', '),
          'Weak features': data.face.weak_features.join(', '),
          'Grooming': data.face.grooming.join('\n'),
          'Hairstyle': data.face.hairstyle.join('\n'),
          'Accessories': data.face.accessories.join(', ')
        }} />
        <Section title="Physique Plan" items={{
          'Body type': data.physique.body_type,
          '7 day workout': data.physique.workout_7_day.join('\n'),
          'Posture': data.physique.posture_cues.join(', '),
          'Diet': data.physique.diet_notes.join(', ')
        }} />
        <Section title="Styling & Outfit" items={{
          'Daily outfits': data.styling.daily_outfits.join('\n'),
          'Colours': data.styling.colours.join(', '),
          'Wardrobe': data.styling.wardrobe_essentials.join(', '),
          'Hairstyle synergy': data.styling.hairstyle_synergy.join(', ')
        }} />
        <Section title="90 Day Glow-Up Map" items={{
          'Roadmap': data.glow.week_by_week.join('\n')
        }} />
        <button onClick={onNext} className="rounded-full px-6 py-3" style={{ background: brand.black, color: brand.cream }}>Continue</button>
      </div>
    </div>
  )
}

function Paywall(){
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: brand.cream, color: brand.black }}>
      <div className="w-full max-w-lg rounded-3xl p-8 shadow-xl bg-white">
        <h3 className="font-serif text-3xl mb-3">RUVA Premium</h3>
        <p className="opacity-70 mb-6">Unlock advanced features and premium tone.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {label:'Weekly', price:99},
            {label:'Monthly', price:199},
            {label:'Yearly', price:599}
          ].map(t => (
            <div key={t.label} className="rounded-2xl p-4 border flex flex-col" style={{ borderColor: brand.gold }}>
              <div className="font-medium">{t.label}</div>
              <div className="text-2xl mt-1">${t.price}</div>
              <button className="mt-4 rounded-full px-4 py-2" style={{ background: brand.black, color: brand.cream }}>Choose</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Section({ title, items }){
  return (
    <div className="rounded-2xl p-4 border" style={{ borderColor: brand.gold }}>
      <div className="font-medium mb-2">{title}</div>
      <div className="opacity-70 text-sm whitespace-pre-wrap">
        {Object.entries(items).map(([k,v])=> (
          <div key={k} className="mb-2"><span className="font-medium opacity-100">{k}:</span> {v}</div>
        ))}
      </div>
    </div>
  )
}

export default function App(){
  const [screen, setScreen] = useState('splash')
  const [focus, setFocus] = useState(null)
  const [user, setUser] = useState({ id: null, email: null })
  const [result, setResult] = useState(null)

  useEffect(()=>{
    // simple route flow
  },[])

  const runWorkflow = async (userId) => {
    const r = await fetch(`${apiBase}/workflow/run`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ user_id: userId }) })
    const data = await r.json()
    setResult(data)
  }

  if (screen === 'splash') return <Splash onStart={()=>setScreen('onboarding')} />
  if (screen === 'onboarding') return <Onboarding onSelect={(f)=>{ setFocus(f); setScreen('auth') }} />
  if (screen === 'auth') return <Auth onAuthed={(id, email)=>{ setUser({ id, email }); setScreen('input') }} />
  if (screen === 'input') return <UserInputForm userId={user.id} onDone={async ()=>{ setScreen('loading'); await runWorkflow(user.id); setScreen('summary') }} />
  if (screen === 'loading') return <Loading />
  if (screen === 'summary') return <Summary data={result.summary} onDetails={()=> setScreen('details')} />
  if (screen === 'details') return <Details data={result} onNext={()=> setScreen('paywall')} />
  if (screen === 'paywall') return <Paywall />
  return null
}
