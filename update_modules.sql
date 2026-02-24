-- COMPREHENSIVE ISSS MODULE SYNCHRONIZATION SCRIPT
-- This script ensures all courses exist and aligns their titles and frequencies with the handbook.

INSERT INTO public.modules (code, title, ects, module_group, area, frequency, language, exam_type, description) VALUES
-- A1 S1 Theory
('AISE-Auto', 'Automation of First- and Higher-Order Logic', 6, 'A1', 'S1', 'every summer semester', 'English', 'written exam', 'Covers automated reasoning and theorem proving in first and higher-order logic.'),
('AISE-UL', 'Universal Logic & Universal Reasoning', 6, 'A1', 'S1', 'every winter semester', 'English', 'written exam', 'Explores universal logic frameworks and reasoning systems.'),
('AlgoK-Algo-M', 'Algorithms', 6, 'A1', 'S1', 'alle 4 Semester', 'English', 'written exam', 'Advanced algorithm design and analysis techniques.'),
('GdI-FPRS-M', 'Functional Programming of Reactive Systems', 6, 'A1', 'S1', 'every summer semester', 'English', 'written exam', 'Functional programming techniques for building reactive systems.'),
('GdI-IFP-M', 'Introduction to Functional Programming', 6, 'A1', 'S1', 'every winter semester', 'English', 'written exam', 'Fundamentals of functional programming paradigms.'),

-- A1 S2 Systems
('COMNET-NES-M', 'Networked Embedded Systems', 6, 'A1', 'S2', 'every winter semester', 'English', 'written exam', 'Design and implementation of networked embedded systems.'),
('DT-CPP-M', 'Advanced Systems Programming in C++ (Master)', 6, 'A1', 'S2', 'every winter semester', 'English', 'written exam', 'Advanced C++ programming for systems development.'),
('MOBI-DSC-M', 'Data Streams and Complex Event Processing', 6, 'A1', 'S2', 'every winter semester', 'English', 'written exam', 'Processing data streams and complex event patterns.'),
('SYSNAP-OSE-M', 'Operating Systems Engineering', 6, 'A1', 'S2', 'every summer semester', 'English', 'written exam', 'Engineering principles of modern operating systems.'),
('SYSNAP-PMAP-M', 'Processor Microarchitecture and Performance', 6, 'A1', 'S2', 'every summer semester', 'English', 'written exam', 'Understanding processor architecture and performance optimization.'),
('SYSNAP-Virt-M', 'Virtualization', 6, 'A1', 'S2', 'every winter semester', 'English', 'written exam', 'Virtualization technologies and their applications.'),

-- A1 S3 Software
('DT-DBCPU-M', 'Database Systems for modern CPU', 6, 'A1', 'S3', 'every summer semester', 'English', 'written exam', 'Modern database systems optimized for current CPU architectures.'),
('ESE-ESEng-M', 'Evidence-based Software Engineering', 6, 'A1', 'S3', 'every semester', 'English', 'written exam', 'Applying evidence-based methods to software engineering practices.'),
('MOBI-ADM-M', 'Advanced Data Management', 6, 'A1', 'S3', 'every summer semester', 'English', 'written exam', 'Advanced techniques in data management and storage systems.'),
('PSI-AdvaSP-M', 'Advanced Security and Privacy', 6, 'A1', 'S3', 'every summer semester', 'English', 'written exam', 'Advanced topics in security and privacy for software systems.'),
('PSI-DiffPriv-M', 'Introduction to Differential Privacy', 6, 'A1', 'S3', 'every winter semester', 'English', 'written exam', 'Foundations and applications of differential privacy.'),
('SWT-ASV-M', 'Applied Software Verification', 6, 'A1', 'S3', 'every summer semester', 'English', 'written exam', 'Practical software verification techniques and tools.'),

-- A2 Domain-specific
('DS-ConvAI-M', 'Advanced Dialogue Systems and Conversational AI', 6, 'A2', NULL, 'every summer semester', 'English', 'project', 'Building advanced conversational AI and dialogue systems.'),
('EESYS-ADAML-M', 'Applied Data Analytics and Machine Learning in R', 6, 'A2', NULL, 'every winter semester', 'English', 'written exam', 'Practical data analytics and ML using R programming language.'),
('EESYS-ES-M', 'Energy Efficient Systems', 6, 'A2', NULL, 'every summer semester', 'English', 'written exam', 'Design and optimization of energy efficient computing systems.'),
('HCI-US-B', 'Ubiquitous Systems', 6, 'A2', NULL, 'every winter semester', 'English', 'written exam', 'Human-computer interaction in ubiquitous computing environments.'),
('ISPL-MDP-M', 'Managing Digital Platforms', 6, 'A2', NULL, 'every summer semester', 'English', 'written exam', 'Strategy and management of digital platform ecosystems.'),
('NLPROC-DL4NLP-M', 'Deep Learning for Natural Language Processing', 6, 'A2', NULL, 'every summer semester', 'English', 'project', 'Deep learning architectures and techniques for NLP tasks.'),
('NLProc-EA-M', 'Emotion Analysis', 6, 'A2', NULL, 'every semester', 'English', 'written exam', 'Computational methods for emotion detection and analysis.'),
('NLProc-ILT-M', 'Impact of Language Technology', 6, 'A2', NULL, 'every winter semester', 'English', 'written exam', 'Societal impact and ethical considerations of language technology.'),
('NLProc-PGM4NLP-M', 'Probabilistic Graphical Models for Natural Language Processing', 6, 'A2', NULL, 'every winter semester', 'English', 'written exam', 'Applying probabilistic graphical models to NLP problems.'),
('SNA-OSN-M', 'Project Online Social Networks', 6, 'A2', NULL, 'every winter semester', 'English', 'project', 'Analysis and design of online social network applications.'),
('VIS-IVVA-M', 'Advanced Information Visualization and Visual Analytics', 6, 'A2', NULL, 'every winter semester', 'English', 'project', 'Advanced techniques in information visualization and analytics.'),
('xAI-DL-M', 'Deep Learning', 6, 'A2', NULL, 'every winter semester', 'English', 'written exam', 'Comprehensive coverage of deep learning methods and applications.'),

-- A3 Seminar & Project
('ISoSySc-Proj-M', 'Master''s Project in Software System Science', 6, 'A3', NULL, 'every semester', 'English', 'project', 'A supervised project applying software systems science knowledge.'),
('ISoSySc-Sem-M', 'Master''s Seminar in Software System Science', 3, 'A3', NULL, 'every semester', 'English', 'seminar paper', 'Research seminar covering current topics in software systems science.'),

-- A4 Thesis
('SSS-Thesis-M', 'Master''s Thesis in Software Systems Science', 30, 'A4', NULL, 'every semester', 'English/German', 'thesis', 'Final master''s thesis demonstrating research competence.'),

-- A5 International Experience
('SSS-PraktIntKon-M', 'Internship in an International Context', 12, 'A5', NULL, 'every semester', 'English/German', 'internship report', 'Internship providing international professional experience.'),
('SSS-StudyAbroad', 'Guided Study Abroad Modules', 0, 'A5', NULL, 'every semester', 'Various', 'varies', 'Credits from approved study abroad programs. Variable ECTS up to 27.'),
('LANG-GER-A1', 'German A1', 6, 'A5', NULL, 'every semester', 'German', 'written exam', 'Introductory German language course at A1 level.'),
('LANG-GER-A2', 'German A2', 3, 'A5', NULL, 'every semester', 'German', 'written exam', 'German language course at A2 level.'),
('LANG-SPA-A1', 'Spanish A1', 3, 'A5', NULL, 'every semester', 'Spanish', 'written exam', 'Introductory Spanish language course at A1 level.')

ON CONFLICT (code) DO UPDATE SET 
  title = EXCLUDED.title,
  ects = EXCLUDED.ects,
  frequency = EXCLUDED.frequency;

-- Make variable ECTS modules
UPDATE public.modules SET variable_ects = true, max_ects = 27 WHERE code = 'SSS-StudyAbroad';

-- Clean up any generic legacy foreign language module
DELETE FROM public.modules WHERE code = 'SSS-ForeignLang';
