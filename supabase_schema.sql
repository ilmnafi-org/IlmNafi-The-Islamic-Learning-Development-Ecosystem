-- ====================================================================
-- Ilm Nafi Academy - Supabase Relational Database Schema Setup
-- Run this script in your Supabase SQL Editor to prepare your tables.
-- ====================================================================

-- 1. Single Table Fallback Store (Highly Recommended)
CREATE TABLE IF NOT EXISTS public.ilm_naafi_store (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.ilm_users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    weekly_minutes INTEGER DEFAULT 0 NOT NULL,
    lessons_completed JSONB DEFAULT '[]'::jsonb NOT NULL,
    saved_scholarships JSONB DEFAULT '[]'::jsonb NOT NULL,
    recent_recitations JSONB DEFAULT '[]'::jsonb NOT NULL,
    certificates JSONB DEFAULT '[]'::jsonb NOT NULL,
    joined_forums JSONB DEFAULT '[]'::jsonb NOT NULL,
    notifications JSONB DEFAULT '[]'::jsonb NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Forum Threads Table
CREATE TABLE IF NOT EXISTS public.ilm_threads (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    author_avatar TEXT,
    thumbs_up INTEGER DEFAULT 0 NOT NULL,
    liked_by JSONB DEFAULT '[]'::jsonb NOT NULL,
    replies JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Admin and Student Support Issues (Bugs/Feedback) Table
CREATE TABLE IF NOT EXISTS public.ilm_issues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    description TEXT NOT NULL,
    screenshot TEXT,
    status TEXT DEFAULT 'Pending' NOT NULL,
    admin_memo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- Enable Row Level Security (RLS) & Bypass Policies
-- ====================================================================

-- By default, server-side Admin connection uses the SERVICE_ROLE_KEY 
-- which automatically bypasses RLS policies securely.
ALTER TABLE public.ilm_naafi_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ilm_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ilm_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ilm_issues ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticating public reads if you decide to connect from client elements:
CREATE POLICY "Allow Service Role Admin Access" ON public.ilm_naafi_store FOR ALL USING (true);
CREATE POLICY "Allow Service Role Admin Access on Users" ON public.ilm_users FOR ALL USING (true);
CREATE POLICY "Allow Service Role Admin Access on Threads" ON public.ilm_threads FOR ALL USING (true);
CREATE POLICY "Allow Service Role Admin Access on Issues" ON public.ilm_issues FOR ALL USING (true);
