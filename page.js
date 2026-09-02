
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const revalidate = 3600 // rebuild every hour

export default async function Home() {
  const { data: notifications } = await supabase.from('notifications').select('*').order('created_at', {ascending:false}).limit(50)
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold"><span className="bg-orange-500 rounded-full px-2">EY</span> ExamYodha</h1>
          <span className="text-xs bg-green-600 px-2 py-1 rounded">AUTO-UPDATED TODAY 6AM</span>
        </div>
      </header>
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <h2 className="text-xl font-bold mb-4">Latest Notifications - Live from Supabase</h2>
          <div className="bg-white rounded-xl shadow">
            {notifications?.map(n => (
              <div key={n.id} className="p-4 border-b flex justify-between">
                <div><p className="font-semibold">{n.title}</p><p className="text-xs text-gray-500">{n.organization} | {n.category} | {n.notification_date}</p></div>
                <a href={n.official_link} target="_blank" className="bg-orange-500 text-white px-3 py-1 rounded text-sm h-fit">View</a>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white p-4 rounded-xl shadow mb-4">
            <h3 className="font-bold">Last Auto-Update</h3>
            <p className="text-sm text-green-600">Today 6:00 AM IST - {notifications?.length} new</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="font-bold">Your SSC Notes Format</h3>
            <p className="text-sm">Large text, tables, no images - auto embedded for each exam.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
