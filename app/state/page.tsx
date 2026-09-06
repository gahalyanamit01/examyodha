import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

function slugify(s:string){ return s.toLowerCase().replace(/\s+/g,'-'); }

export default async function StatesPage(){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await supabase.from('exams').select('state').neq('state','Central');
  const states = Array.from(new Set((data||[]).map((e:any)=>e.state))).filter(Boolean).sort();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/" className="text-sm bg-white border px-3 py-1 rounded-full">← Back</Link>
        <h1 className="text-3xl font-black mt-6">State-wise Govt Exams 2026</h1>
        <p className="text-sm text-gray-500 mt-2">PSC, Group C, Group D, Police, Teacher — All States Official Links</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
          {states.map((s:any)=>(
            <Link key={s} href={`/state/${slugify(s)}`} className="bg-white border p-4 rounded-xl hover:bg-green-50 font-bold">
              {s} <div className="text-xs font-normal text-gray-500">View all {s} exams →</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
