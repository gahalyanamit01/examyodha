"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function Home(){
  const [exams, setExams] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [tab, setTab] = useState("notification");

  useEffect(()=>{
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    async function load(){
      const { data: examsData } = await supabase.from('exams').select('*').order('name');
      const { data: notiData } = await supabase.from('notifications').select('*').order('notification_date', {ascending:false}).limit(100);
      setExams(examsData||[]);
      setAllData(notiData||[]);
    }
    load();
  },[]);

  const notifications = allData.filter((n:any)=> n.type === 'notification' ||!n.type);
  const results = allData.filter((n:any)=> n.type === 'result');
  const admitCards = allData.filter((n:any)=> n.type === 'admit card');

  const getList = () => {
    if(tab === 'result') return results;
    if(tab === 'admit card') return admitCards;
    return notifications;
  };

  const getRealLink = (n:any) => {
    if((n.official_link||'').includes('sarkariresult') || (n.pdf_url||'').includes('sarkariresult')){
      const ex = exams.find((e:any)=> e.id === n.exam_id);
      return ex?.official_website || n.official_link;
    }
    return n.official_link || n.pdf_url || '#';
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">ExamYodha</h1>
            <p className="text-blue-100 text-sm">Govt Exams • Results • Admit Cards - Official Links Only</p>
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold">LIVE • {allData.length} Updates</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-12 gap-6">
        <aside className="md:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border p-5 sticky top-6">
            <h2 className="font-bold mb-4">📚 Exams ({exams.length})</h2>
            <div className="space-y-2 max-h- overflow-auto">
              {exams.map((e:any)=>(
                <a key={e.id} href={e.official_website||'#'} target="_blank" className="block p-4 border rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition">
                  <div className="font-bold text-sm">{e.name}</div>
                  <div className="text-xs text-gray-500 flex justify-between mt-1">
                    <span>{e.category}</span>
                    <span className="text-blue-600">Official →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </aside>

        <section className="md:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <div className="flex gap-2 mb-5">
              <button onClick={()=>setTab('notification')} className={`px-4 py-2 rounded-full text-sm font-bold border ${tab==='notification'?'bg-blue-600 text-white':'bg-white'}`}>🔔 Notifications ({notifications.length})</button>
              <button onClick={()=>setTab('result')} className={`px-4 py-2 rounded-full text-sm font-bold border ${tab==='result'?'bg-green-600 text-white':'bg-white'}`}>🎯 Results ({results.length})</button>
              <button onClick={()=>setTab('admit card')} className={`px-4 py-2 rounded-full text-sm font-bold border ${tab==='admit card'?'bg-orange-600 text-white':'bg-white'}`}>🎫 Admit Cards ({admitCards.length})</button>
            </div>

            <div className="space-y-3">
              {getList().map((n:any)=>(
                <a key={n.id} href={getRealLink(n)} target="_blank" rel="noopener noreferrer" className="block p-4 border rounded-xl hover:bg-blue-50 transition">
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{n.organization} • {n.notification_date} • {n.type}</div>
                </a>
              ))}
              {getList().length===0 && <div className="text-center text-sm text-gray-400 py-10">No {tab} yet — scraper will auto-add at 6 AM</div>}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
