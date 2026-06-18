-- Allow anonymous users to browse open vacancies
CREATE POLICY "public_select_open_vacancies" ON vacancies
  FOR SELECT TO anon USING (status = 'open');

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz DEFAULT now(),
  vacancy_id     uuid REFERENCES vacancies(id) ON DELETE SET NULL,
  job_title      text NOT NULL,
  full_name      text NOT NULL,
  email          text NOT NULL,
  phone          text,
  location       text,
  linkedin_url   text,
  years_experience text,
  cover_letter   text,
  heard_about    text,
  status         text NOT NULL DEFAULT 'new'
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_job_applications" ON job_applications
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "auth_select_job_applications" ON job_applications
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_update_job_applications" ON job_applications
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_delete_job_applications" ON job_applications
  FOR DELETE TO authenticated USING (true);
