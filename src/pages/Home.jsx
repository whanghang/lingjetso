import { useEffect, useMemo, useState } from "react"
import PromoCard from "../components/PromoCard.jsx"

function isExpired(expiry){
  if(!expiry) return false
  const d = new Date(expiry + "T23:59:59")
  return d < new Date()
}

export default function Home(){
  const [promos, setPromos] = useState([])
  const [query, setQuery] = useState("")
  const [tag, setTag] = useState("")

  useEffect(()=>{
    fetch("/promos.json")
      .then(r => r.json())
      .then(data => setPromos(data.filter(p => !isExpired(p.expiry))))
      .catch(()=> setPromos([]))
  }, [])

  const allTags = useMemo(()=>{
    const t = new Set()
    promos.forEach(p => (p.tags || []).forEach(x => t.add(x)))
    return [...t]
  }, [promos])

  const filtered = promos.filter(p => {
    const q = query.trim().toLowerCase()
    const mq = !q || [p.store, p.description, p.code, p.url].filter(Boolean).some(x => String(x).toLowerCase().includes(q))
    const mt = !tag || (p.tags || []).includes(tag)
    return mq && mt
  })

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🎁 最新優惠</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="搜尋…"
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-80"
        />
        <select
          value={tag}
          onChange={(e)=>setTag(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">所有標籤</option>
          {allTags.map(t => (<option key={t} value={t}>{t}</option>))}
        </select>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map(p => (<PromoCard key={p.id} promo={p} />))}
        {filtered.length === 0 && (<p className="text-gray-500">暫時未有符合的優惠。</p>)}
      </div>
    </div>
  )
}
