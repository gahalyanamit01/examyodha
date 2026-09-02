
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

async function getData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: exams } = await supabase.from('exams').select('*').limit(20);
  const { data: notifications } = await supabase.from('notifications').select('*').order('published_date', { ascending: false }).limit(30);
  return { exams: exams || [], notifications: notifications || [] };
}

export default async function Home() {
  const { exams, notifications } = await getData();
  return (
    <main className="min-h-screen p-4 max-w-6xl mx-auto">
      <header className="bg-blue-600 text-white p-6 rounded-xl mb-6">
        <h1 className="text-3xl font-bold">ExamYodha</h1>
        <p className="opacity-90">Govt Exams • Results • Admit Cards - Auto Updated Daily</p>
        <div className="mt-2 text-sm bg-blue-700 inline-block px-3 py-1 rounded">LIVE - Connected to Supabase</div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">Exams ({exams.length})</h2>
          {exams.map((e:any) => (
            <div key={e.id} className="border-b py-2">
              <div className="font-semibold">{e.name}</div>
              <div className="text-xs text-gray-500">{e.short_name} • {e.category}</div>
            </div>
          ))}
          {exams.length===0 && <div className="text-sm text-gray-500">No exams yet - run supabase_schema.sql</div>}
        </div>

        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">Latest Notifications ({notifications.length})</h2>
          {notifications.map((n:any) => (
            <div key={n.id} className="border p-3 rounded mb-2">
              <div className="text-xs text-blue-600 font-bold">{n.notification_type}</div>
              <div className="font-semibold">{n.title}</div>
              <div className="text-xs text-gray-500">{n.published_date} {n.source_url && <a href={n.source_url} className="text-blue-600 underline ml-2" target="_blank">Official Link</a>}</div>
            </div>
          ))}
          {notifications.length===0 && <div className="text-sm text-gray-500">Scraper will fill this daily at 6 AM. Go to GitHub Actions and run workflow manually to fill now.</div>}
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-gray-500">ExamYodha v1.0 - Your supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0,30)}...</footer>
    </main>
  );
}
