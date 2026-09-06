"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

function slugify(s:string){ return s.toLowerCase().replace(/\s+/g,'-'); }

export default function Home(){
  const [exams, setExams] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [examTab, setExamTab] = useState("all");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [tab, setTab] = useState("notification");

  useEffect(()=>{
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    (async()=>{
      const { data: e } = await supabase.from('exams').select('*').order('name');
      const { data: n } = await supabase.from('notifications').select('*').order('notification_date',{ascending:false}).limit(150);
      setExams(e||[]); setAllData(n||[]);
    })();
  },[]);

  const states = Array.from(new Set(exams.filter((e:any)=>e.state!=='Central').map((e:any)=>e.state))).filter(Boolean).sort();
  const groups = ["All","PSC","Group C","Group D","Police","Teacher"];

  const filteredExams = exams.filter((e:any)=>{
    if(!e.name.toLowerCase().includes(search.toLowerCase())) return false;
    if(examTab==='central') return e.state==='Central';
    if(examTab==='state'){
      if(selectedState!=='All' && e.state!==selectedState) return false;
      if(e.state==='Central') return false;
      if(selectedGroup!=='All'){
        const g = selectedGroup.toLowerCase();
        return e.exam_group?.toLowerCase().includes(g) || e.category?.toLowerCase().includes(g) || e.name.toLowerCase().includes(g);
      }
      return true;
    }
    return true;
  });

  const filteredAll = allData.filter((n:any)=> n.title.toLowerCase().includes(search.toLowerCase()));
  const getList = (type:string) => {
    if(type==='result') return filteredAll.filter((n:any)=>n.type==='result');
    if(type==='admit card') return filteredAll.filter((n:any)=>n.type==='admit card');
    return filteredAll.filter((n:any)=>n.type==='notification'||!n.type);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-3 justify-between items-center">
          <h1 className="text-2xl font-black">ExamYodha</h1>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Bihar Police, UPPSC, Group D..." className="w-full md:w-96 px-4 py-2.5 rounded-full text-slate-900 text-sm" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-12 gap-6">
        <aside className="md:col-span-5">
          <div className="bg-white rounded-2xl border p-5 sticky top-24">
            <div className="flex gap-2 mb-3">
              <button onClick={()=>setExamTab('all')} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${examTab==='all'?'bg-slate-900 text-white':'bg-white'}`}>All ({exams.length})</button>
              <button onClick={()=>setExamTab('central')} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${examTab==='central'?'bg-blue-600 text-white':'bg-white'}`}>Central</button>
              <button onClick={()=>setExamTab('state')} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${examTab==='state'?'bg-green-600 text-white':'bg-white'}`}>State-wise</button>
            </div>

            {examTab==='state' && (
              <>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <button onClick={()=>setSelectedState('All')} className={`px-2.5 py-1 rounded-full text- border ${selectedState==='All'?'bg-green-600 text-white':'bg-slate-100'}`}>All States</button>
                  {states.map((s:any)=>(
                    <button key={s} onClick={()=>setSelectedState(s)} className={`px-2.5 py-1 rounded-full text- border ${selectedState===s?'bg-green-600 text-white':'bg-slate-100'}`}>{s}</button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2 border-t pt-3">
                  {groups.map(g=><button key={g} onClick={()=>setSelectedGroup(g)} className={`px-2.5 py-1 rounded-full text- border ${selectedGroup===g?'bg-orange-500 text-white':'bg-slate-50'}`}>{g}</button>)}
                </div>
                {selectedState!=='All' && (
                  <Link href={`/state/${slugify(selectedState)}`} className="block text-xs text-green-600 font-bold mt-2 mb-3 hover:underline">
                    View full {selectedState} page (PSC + Group C/D + Police) → /state/{slugify(selectedState)}
                  </Link>
                )}
              </>
            )}

            <h2 className="font-bold text-sm mb-3">📚 {examTab==='state'? `${selectedState} - ${selectedGroup}` : 'Exams'} ({filteredExams.length})</h2>
            <div className="space-y-2 max-h- overflow-auto pr-1">
              {filteredExams.map((e:any)=>(
                <Link key={e.id} href={`/exam/${e.id}`} className="block p-3 border rounded-xl hover:bg-indigo-50">
                  <div className="font-bold text-sm">{e.name}</div>
                  <div className="text- text-gray-500 flex justify-between"><span>{e.state} • {e.exam_group}</span><span className="text-blue-600">View →</span></div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <section className="md:col-span-7">
          <div className="bg-white rounded-2xl border p-5">
            <div className="flex gap-2 mb-5 flex-wrap">
              <button onClick={()=>setTab('notification')} className={`px-4 py-2 rounded-full text-xs font-bold border ${tab==='notification'?'bg-blue-600 text-white':'bg-white'}`}>🔔 Notifications ({getList('notification').length})</button>
              <button onClick={()=>setTab('result')} className={`px-4 py-2 rounded-full text-xs font-bold border ${tab==='result'?'bg-green-600 text-white':'bg-white'}`}>🎯 Results ({getList('result').length})</button>
              <button onClick={()=>setTab('admit card')} className={`px-4 py-2 rounded-full text-xs font-bold border ${tab==='admit card'?'bg-orange-600 text-white':'bg-white'}`}>🎫 Admit Cards ({getList('admit card').length})</button>
            </div>
            <div className="space-y-2">
              {getList(tab).map((n:any)=><a key={n.id} href={n.official_link||n.pdf_url} target="_blank" className="block p-3 border rounded-xl hover:bg-blue-50 text-sm">{n.title}<div className="text-xs text-gray-500">{n.notification_date}</div></a>)}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
