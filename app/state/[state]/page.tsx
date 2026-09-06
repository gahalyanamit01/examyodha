import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

function slugify(s:string){ return s.toLowerCase().replace(/\s+/g,'-'); }

export async function generateMetadata({ params }: { params: { state: string } }){
  const stateName = params.state.replace(/-/g,' ').replace(/\b\w/g,(l:any)=>l.toUpperCase());
  return {
    title: `${stateName} Govt Exams 2026 - PSC, Group C, Police, Teacher | ExamYodha`,
    description: `Latest ${stateName} Government Exams 2026: ${stateName} PSC, Group C, Group D, Police Constable, Teacher Recruitment. Official.gov.in links only.`,
  }
}

export default async function StatePage({ params }: { params: { state: string } }){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: allStates } = await supabase.from('exams').select('state').neq('state','Central');
  const states = Array.from(new Set((allStates||[]).map((e:any)=>e.state))).filter(Boolean);
  const realState = states.find((s:any)=> slugify(s) === params.state);

  if(!realState) return <div className="p-10">State not found. <Link href="/state" className="text-blue-600">View all states</Link></div>;

  const { data: exams } = await supabase.from('exams').select('*').eq('state', realState).order('exam_group');

  const grouped: any = {};
  (exams||[]).forEach((e:any)=>{
    const g = e.exam_group || 'Others';
    if(!grouped[g]) grouped[g]=[];
    grouped[g].push(e);
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/state" className="text-sm bg-white/20 px-3 py-1 rounded-full">← All States</Link>
          <h1 className="text-3xl font-black mt-4">{realState} Government Exams 2026</h1>
          <p className="text-green-100 text-sm mt-1">PSC • Group C • Group D • Police • Teacher • Official Links Only</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {Object.keys(grouped).map((group)=>(
          <div key={group} className="bg-white rounded-2xl border p-5">
            <h2 className="font-bold mb-3">📌 {group} Exams - {realState} ({grouped[group].length})</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {grouped[group].map((e:any)=>(
                <Link key={e.id} href={`/exam/${e.id}`} className="block p-4 border rounded-xl hover:bg-green-50">
                  <div className="font-bold text-sm">{e.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{e.organization} • {e.official_website}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
