
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main style={{minHeight:'100vh', padding:'20px', maxWidth:'900px', margin:'0 auto', fontFamily:'system-ui'}}>
      <div style={{background:'#2563eb', color:'white', padding:'24px', borderRadius:'12px', marginBottom:'24px'}}>
        <h1 style={{fontSize:'32px', fontWeight:'bold'}}>ExamYodha - LIVE!</h1>
        <p>Govt Exams • Results • Admit Cards</p>
        <div style={{marginTop:'12px', background:'#1d4ed8', display:'inline-block', padding:'6px 12px', borderRadius:'6px', fontSize:'14px'}}>
          ✅ DEPLOY SUCCESS - Version 3.0 No-Crash
        </div>
      </div>

      <div style={{display:'grid', gap:'20px'}}>
        <div style={{background:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
          <h2 style={{fontWeight:'bold', marginBottom:'12px'}}>🎉 Your Website is LIVE!</h2>
          <p style={{fontSize:'14px', color:'#666'}}>Now we will connect it to Supabase database step by step.</p>
          
          <div style={{marginTop:'16px', padding:'12px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'8px'}}>
            <div style={{fontWeight:'bold', color:'#15803d'}}>Next Steps:</div>
            <ol style={{fontSize:'13px', marginTop:'8px', paddingLeft:'20px'}}>
              <li>Go to Vercel -&gt; Settings -&gt; Environment Variables</li>
              <li>Add: NEXT_PUBLIC_SUPABASE_URL = https://vvwbjatzshinobzkpkkj.supabase.co</li>
              <li>Add: NEXT_PUBLIC_SUPABASE_ANON_KEY = your anon key</li>
              <li>Go to Deployments -&gt; Redeploy</li>
              <li>Then we switch to database version</li>
            </ol>
          </div>

          <div style={{marginTop:'16px'}}>
            <h3 style={{fontWeight:'bold'}}>Exams We Will Show:</h3>
            <div style={{fontSize:'13px', color:'#333', marginTop:'8px'}}>
              <div>• SSC CGL, CHSL, GD, MTS</div>
              <div>• UPSC Civil Services</div>
              <div>• RRB Railway NTPC, Group D</div>
              <div>• HSSC Haryana CET</div>
              <div>• Banking IBPS, SBI</div>
            </div>
          </div>
        </div>

        <div style={{background:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
          <h3 style={{fontWeight:'bold'}}>✅ Build Status</h3>
          <p style={{fontSize:'13px', marginTop:'8px'}}>If you see this page, Vercel deploy is 100% working. The previous error is gone.</p>
          <p style={{fontSize:'13px', marginTop:'8px', color:'#2563eb'}}>Paste this live link here so I can verify and connect your database next.</p>
        </div>
      </div>
    </main>
  );
}
