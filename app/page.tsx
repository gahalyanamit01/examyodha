import { createClient } from '@supabase/supabase-js';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData(){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);
  const { data: exams } = await supabase.from('exams').select('*').order('name');
  const { data: notifications } = await supabase.from('notifications').select('*').order('notification_date', {ascending:false}).limit(50);
  return { exams: exams||[], notifications: notifications||[] };
}

export default async function Home(){
  const { exams, notifications } = await getData();
  return (
    <main className="min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight">ExamYodha</h1>
              <p className="text-blue-100 text-sm mt-1">Govt Exams • Results • Admit Cards - Auto Updated Daily</p>
            </div>
            <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold">LIVE • Connected to Supabase</div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-12 gap-6">
        <aside className="md:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border p-5 sticky top-6">
            <h2 className="font-bold text-slate-800 mb-4">📚 Exams ({exams.length})</h2>
            <div className="space-y-2 max-h- overflow-auto pr-1">
              {exams.map((e: any) => (
                <a
                  key={e.id}
                  href={e.official_website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition cursor-pointer"
                >
                  <div className="font-bold">{e.name}</div>
                  <div className="text-xs text-gray-500 flex justify-between mt-1">
                    <span>{e.category}</span>
                    <span className="text-blue-600 font-bold">Official →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </aside>

        <section className="md:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <h2 className="font-bold text-slate-800 mb-5">🔔 Latest Notifications ({notifications.length})</h2>
            <div className="space-y-3">
              {notifications.map((n: any) => (
                <a
                  key={n.id}
                  href={n.official_link || n.pdf_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border rounded-xl hover:bg-blue-50 transition"
                >
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-gray-500">{n.organization} • {n.notification_date}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
