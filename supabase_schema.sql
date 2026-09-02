
-- ExamYodha Supabase Schema
create table exams (
  id uuid primary key default gen_random_uuid(),
  name text not null, -- e.g. SSC CGL
  organization text not null, -- SSC
  category text not null, -- SSC, UPSC, Banking, Railway, State PCS, Insurance, Defence, Teaching
  official_url text,
  created_at timestamp default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  category text not null,
  exam_id uuid references exams(id),
  notification_date date default CURRENT_DATE,
  last_date date,
  pdf_url text,
  official_link text not null,
  status text default 'New', -- New, Closing Soon, Extended
  summary text, -- AI rewritten 2-line summary to avoid copyright
  teacher_notes text, -- Your SSC format notes link
  created_at timestamp default now(),
  unique(title, organization)
);

create table admit_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text,
  exam_date date,
  download_link text not null,
  created_at timestamp default now()
);

create table results (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text,
  result_date date default CURRENT_DATE,
  pdf_link text,
  created_at timestamp default now()
);

-- Enable RLS read for public
alter table notifications enable row level security;
create policy "Public read" on notifications for select using (true);
alter table admit_cards enable row level security;
create policy "Public read" on admit_cards for select using (true);
alter table results enable row level security;
create policy "Public read" on results for select using (true);
alter table exams enable row level security;
create policy "Public read" on exams for select using (true);

-- Seed master exams
insert into exams (name, organization, category, official_url) values
('UPSC CSE 2026', 'UPSC', 'UPSC', 'https://upsc.gov.in'),
('SSC CGL 2026', 'SSC', 'SSC', 'https://ssc.gov.in'),
('SSC CHSL 2026', 'SSC', 'SSC', 'https://ssc.gov.in'),
('IBPS PO 2026', 'IBPS', 'Banking', 'https://ibps.in'),
('SBI PO 2026', 'SBI', 'Banking', 'https://sbi.co.in'),
('RRB NTPC 2026', 'RRB', 'Railway', 'https://rrbcdg.gov.in'),
('LIC AAO 2026', 'LIC', 'Insurance', 'https://licindia.in'),
('UPPSC PCS 2026', 'UPPSC', 'State PCS', 'https://uppsc.up.nic.in'),
('BPSC 71st 2026', 'BPSC', 'State PCS', 'https://bpsc.bih.nic.in'),
('MPSC Rajyaseva 2026', 'MPSC', 'State PCS', 'https://mpsc.gov.in');
