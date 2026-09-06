
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
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">📚 Exams ({exams.length})</h2>
            <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
             {exams.map((e) => (
  <div key={e.id} className="p-4 border rounded-xl">
    <div className="font-bold">{e.name}</div>
    <div className="text-xs text-gray-500">{e.category}</div>
  </div>
))}
            </div>
          </div>
        </aside>

        <section className="md:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-slate-800">🔔 Latest Notifications ({notifications.length})</h2>
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">Auto-scraped daily 6 AM</span>
            </div>

            {notifications.length===0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">🤖</div>
                <div className="font-bold text-amber-800">Scraper Ready to Run!</div>
                <div className="text-sm text-amber-700 mt-2">Your database is connected but empty. Run the scraper now:</div>
                <div className="mt-3 text-xs font-mono bg-white border rounded-lg p-3 text-left">
                  GitHub → Your Repo → Actions → Daily Exam Scrape → Run workflow
                </div>
                <div className="text-xs text-slate-500 mt-3">After 2 minutes, refresh this page - notifications will appear here automatically.</div>
              </div>
            ) : (
              <div className="space-y-3">
               {notifications.map((n) => (
  <a 
    key={n.id} 
    href={n.pdf_url || n.official_link || '#'} 
    target="_blank" 
    rel="noopener noreferrer"
    className="block p-4 border rounded-xl hover:bg-blue-50 transition"
  >
    <div className="font-medium">{n.title}</div>
    <div className="text-xs text-gray-500">{n.organization} • {n.notification_date}</div>
  </a>
))}
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">ExamYodha v3.0 • Powered by Supabase + Vercel • Auto-updates daily</div>
        </section>
      </div>
    </main>
  )
}
