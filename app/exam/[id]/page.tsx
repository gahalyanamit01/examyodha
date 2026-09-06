import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getExamData(id: string){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: exam } = await supabase.from('exams').select('*').eq('id', id).single();
  if(!exam) return { exam: null, all: [] };
}
  // Fetch by exam_id OR by title contains exam name (fallback)
  const keyword = exam.name.split(' ')[0]; // SSC, BPSC, IBPS...
  const { data: byId } = await supabase.from('notifications').select('*').eq('exam_id', id).order('notification_date', {ascending:false}).limit(100);
  const { data: byTitle } = await supabase.from('notifications').select('*').ilike('title', `%${keyword}%`).order('notification_date', {ascending:false}).limit(100);

  // Merge both and deduplicate by id
  const merged = [...(byId||[]),...(byTitle||[])];
  const unique = Array.from(new Map(merged.map((m:any)=>[m.id, m])).values());

  return { exam, all: unique };
}

export default async function ExamPage({ params }: { params: { id: string } }){
  const { exam, all } = await getExamData(params.id);
  if(!exam) return <div className="p-10">Exam not found</div>;

  const notifications = all.filter((n:any)=> n.type==='notification' || !n.type);
  const results = all.filter((n:any)=> n.type==='result');
  const admitCards = all.filter((n:any)=> n.type==='admit card');

  const getRealLink = (n:any) => {
    if((n.official_link||'').includes('sarkariresult')) return exam.official_website || n.official_link;
    return n.official_link || n.pdf_url || exam.official_website;
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/" className="text-sm bg-white/20 px-3 py-1 rounded-full">← Back to all exams</Link>
          <h1 className="text-3xl font-black mt-4">{exam.name}</h1>
          <p className="text-blue-100 text-sm mt-1">{exam.category} • {exam.organization || ''}</p>
          <a href={exam.official_website} target="_blank" className="inline-block mt-4 bg-white text-blue-600 px-5 py-2 rounded-full text-sm font-bold">Visit Official Website → {exam.official_website}</a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-bold mb-4">🔔 Notifications ({notifications.length})</h2>
          <div className="space-y-2">
            {notifications.map((n:any)=>(
              <a key={n.id} href={getRealLink(n)} target="_blank" className="block p-3 border rounded-xl hover:bg-blue-50 text-sm">{n.title}<div className="text-xs text-gray-500">{n.notification_date}</div></a>
            ))}
            {notifications.length===0 && <div className="text-sm text-gray-400">No notifications yet</div>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-bold mb-4">🎯 Results ({results.length})</h2>
          <div className="space-y-2">
            {results.map((n:any)=>(
              <a key={n.id} href={getRealLink(n)} target="_blank" className="block p-3 border rounded-xl hover:bg-green-50 text-sm">{n.title}<div className="text-xs text-gray-500">{n.notification_date}</div></a>
            ))}
            {results.length===0 && <div className="text-sm text-gray-400">No results declared yet — will auto-update at 6 AM</div>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-bold mb-4">🎫 Admit Cards ({admitCards.length})</h2>
          <div className="space-y-2">
            {admitCards.map((n:any)=>(
              <a key={n.id} href={getRealLink(n)} target="_blank" className="block p-3 border rounded-xl hover:bg-orange-50 text-sm">{n.title}<div className="text-xs text-gray-500">{n.notification_date}</div></a>
            ))}
            {admitCards.length===0 && <div className="text-sm text-gray-400">No admit cards yet</div>}
          </div>
        </div>
      </div>
    </main>
  )
}
