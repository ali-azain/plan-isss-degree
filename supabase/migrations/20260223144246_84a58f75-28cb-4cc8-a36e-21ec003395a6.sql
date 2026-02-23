
-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  start_semester_term TEXT NOT NULL DEFAULT 'WS',
  start_semester_year INTEGER NOT NULL DEFAULT 2025,
  focus_tag TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Modules table (public read)
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  ects INTEGER NOT NULL DEFAULT 6,
  module_group TEXT NOT NULL, -- A1, A2, A3, A4, A5
  area TEXT DEFAULT NULL, -- S1, S2, S3 (for A1 only)
  frequency TEXT NOT NULL DEFAULT 'every semester',
  language TEXT NOT NULL DEFAULT 'English',
  exam_type TEXT DEFAULT 'written exam',
  description TEXT DEFAULT '',
  variable_ects BOOLEAN NOT NULL DEFAULT false,
  max_ects INTEGER DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read modules" ON public.modules FOR SELECT USING (true);

-- User modules (user's planned/passed modules)
CREATE TABLE public.user_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'passed', 'failed')),
  semester_term TEXT NOT NULL DEFAULT 'WS',
  semester_year INTEGER NOT NULL DEFAULT 2025,
  custom_ects INTEGER DEFAULT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.user_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own modules" ON public.user_modules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own modules" ON public.user_modules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own modules" ON public.user_modules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own modules" ON public.user_modules FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_modules_updated_at BEFORE UPDATE ON public.user_modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SEED MODULE DATA

-- A1 S1 Theory
INSERT INTO public.modules (code, title, ects, module_group, area, frequency, language, exam_type, description) VALUES
('AISE-Auto', 'Automation of First- and Higher-Order Logic', 6, 'A1', 'S1', 'winter semester', 'English', 'written exam', 'Covers automated reasoning and theorem proving in first and higher-order logic.'),
('AISE-UL', 'Universal Logic & Universal Reasoning', 6, 'A1', 'S1', 'summer semester', 'English', 'written exam', 'Explores universal logic frameworks and reasoning systems.'),
('AlgoK-Algo-M', 'Algorithms', 6, 'A1', 'S1', 'winter semester', 'English', 'written exam', 'Advanced algorithm design and analysis techniques.'),
('GdI-FPRS-M', 'Functional Programming of Reactive Systems', 6, 'A1', 'S1', 'summer semester', 'English', 'written exam', 'Functional programming techniques for building reactive systems.'),
('GdI-IFP-M', 'Introduction to Functional Programming', 6, 'A1', 'S1', 'winter semester', 'English', 'written exam', 'Fundamentals of functional programming paradigms.');

-- A1 S2 Systems
INSERT INTO public.modules (code, title, ects, module_group, area, frequency, language, exam_type, description) VALUES
('COMNET-NES-M', 'Networked Embedded Systems', 6, 'A1', 'S2', 'winter semester', 'English', 'written exam', 'Design and implementation of networked embedded systems.'),
('DT-CPP-M', 'Advanced Systems Programming in C++', 6, 'A1', 'S2', 'summer semester', 'English', 'written exam', 'Advanced C++ programming for systems development.'),
('MOBI-DSC-M', 'Data Streams and Complex Event Processing', 6, 'A1', 'S2', 'winter semester', 'English', 'written exam', 'Processing data streams and complex event patterns.'),
('SYSNAP-OSE-M', 'Operating Systems Engineering', 6, 'A1', 'S2', 'summer semester', 'English', 'written exam', 'Engineering principles of modern operating systems.'),
('SYSNAP-PMAP-M', 'Processor Microarchitecture and Performance', 6, 'A1', 'S2', 'winter semester', 'English', 'written exam', 'Understanding processor architecture and performance optimization.'),
('SYSNAP-Virt-M', 'Virtualization', 6, 'A1', 'S2', 'summer semester', 'English', 'written exam', 'Virtualization technologies and their applications.');

-- A1 S3 Software
INSERT INTO public.modules (code, title, ects, module_group, area, frequency, language, exam_type, description) VALUES
('DT-DBCPU-M', 'Database Systems for Modern CPU', 6, 'A1', 'S3', 'winter semester', 'English', 'written exam', 'Modern database systems optimized for current CPU architectures.'),
('ESE-ESEng-M', 'Evidence-based Software Engineering', 6, 'A1', 'S3', 'summer semester', 'English', 'written exam', 'Applying evidence-based methods to software engineering practices.'),
('MOBI-ADM-M', 'Advanced Data Management', 6, 'A1', 'S3', 'winter semester', 'English', 'written exam', 'Advanced techniques in data management and storage systems.'),
('PSI-AdvaSP-M', 'Advanced Security and Privacy', 6, 'A1', 'S3', 'summer semester', 'English', 'written exam', 'Advanced topics in security and privacy for software systems.'),
('PSI-DiffPriv-M', 'Introduction to Differential Privacy', 6, 'A1', 'S3', 'winter semester', 'English', 'written exam', 'Foundations and applications of differential privacy.'),
('SWT-ASV-M', 'Applied Software Verification', 6, 'A1', 'S3', 'summer semester', 'English', 'written exam', 'Practical software verification techniques and tools.');

-- A2 Domain-specific
INSERT INTO public.modules (code, title, ects, module_group, area, frequency, language, exam_type, description) VALUES
('DS-ConvAI-M', 'Advanced Dialogue Systems and Conversational AI', 6, 'A2', NULL, 'summer semester', 'English', 'project', 'Building advanced conversational AI and dialogue systems.'),
('EESYS-ADAML-M', 'Applied Data Analytics and Machine Learning in R', 6, 'A2', NULL, 'winter semester', 'English', 'written exam', 'Practical data analytics and ML using R programming language.'),
('EESYS-ES-M', 'Energy Efficient Systems', 6, 'A2', NULL, 'summer semester', 'English', 'written exam', 'Design and optimization of energy efficient computing systems.'),
('HCI-US-B', 'Ubiquitous Systems', 6, 'A2', NULL, 'winter semester', 'English', 'written exam', 'Human-computer interaction in ubiquitous computing environments.'),
('ISPL-MDP-M', 'Managing Digital Platforms', 6, 'A2', NULL, 'summer semester', 'English', 'written exam', 'Strategy and management of digital platform ecosystems.'),
('NLPROC-DL4NLP-M', 'Deep Learning for NLP', 6, 'A2', NULL, 'winter semester', 'English', 'project', 'Deep learning architectures and techniques for NLP tasks.'),
('NLProc-EA-M', 'Emotion Analysis', 6, 'A2', NULL, 'summer semester', 'English', 'written exam', 'Computational methods for emotion detection and analysis.'),
('NLProc-ILT-M', 'Impact of Language Technology', 6, 'A2', NULL, 'winter semester', 'English', 'written exam', 'Societal impact and ethical considerations of language technology.'),
('NLProc-PGM4NLP-M', 'Probabilistic Graphical Models for NLP', 6, 'A2', NULL, 'summer semester', 'English', 'written exam', 'Applying probabilistic graphical models to NLP problems.'),
('SNA-OSN-M', 'Project Online Social Networks', 6, 'A2', NULL, 'summer semester', 'English', 'project', 'Analysis and design of online social network applications.'),
('VIS-IVVA-M', 'Advanced Information Visualization and Visual Analytics', 6, 'A2', NULL, 'winter semester', 'English', 'project', 'Advanced techniques in information visualization and analytics.'),
('xAI-DL-M', 'Deep Learning', 6, 'A2', NULL, 'summer semester', 'English', 'written exam', 'Comprehensive coverage of deep learning methods and applications.');

-- A3 Seminar & Project
INSERT INTO public.modules (code, title, ects, module_group, area, frequency, language, exam_type, description) VALUES
('ISoSySc-Proj-M', 'Master''s Project in Software System Science', 6, 'A3', NULL, 'every semester', 'English', 'project', 'A supervised project applying software systems science knowledge.'),
('ISoSySc-Sem-M', 'Master''s Seminar in Software System Science', 3, 'A3', NULL, 'every semester', 'English', 'seminar paper', 'Research seminar covering current topics in software systems science.');

-- A4 Thesis
INSERT INTO public.modules (code, title, ects, module_group, area, frequency, language, exam_type, description) VALUES
('SSS-Thesis-M', 'Master''s Thesis in Software Systems Science', 30, 'A4', NULL, 'every semester', 'English/German', 'thesis', 'Final master''s thesis demonstrating research competence.');

-- A5 International Experience
INSERT INTO public.modules (code, title, ects, module_group, area, frequency, language, exam_type, description) VALUES
('SSS-PraktIntKon-M', 'Internship in an International Context', 12, 'A5', NULL, 'every semester', 'English/German', 'internship report', 'Internship providing international professional experience.'),
('SSS-StudyAbroad', 'Guided Study Abroad Modules', 6, 'A5', NULL, 'every semester', 'Various', 'varies', 'Credits from approved study abroad programs. Variable ECTS up to 27.'),
('SSS-ForeignLang', 'Foreign Language Credits', 6, 'A5', NULL, 'every semester', 'Various', 'varies', 'Language courses for international competence. Variable ECTS up to 15.');

-- Make variable ECTS modules
UPDATE public.modules SET variable_ects = true, max_ects = 27 WHERE code = 'SSS-StudyAbroad';
UPDATE public.modules SET variable_ects = true, max_ects = 15 WHERE code = 'SSS-ForeignLang';
