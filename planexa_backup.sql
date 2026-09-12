--
-- PostgreSQL database dump
--

\restrict SU0gZVKdjquu4FoJeu8p6zoFgcQT9WWWH3hkkQlIlZWGyc2mGxFwb3SWyEVQGbr

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    status character varying(30) DEFAULT 'Pending'::character varying,
    start_date date,
    due_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    project_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    priority character varying(50) DEFAULT 'Medium'::character varying,
    status character varying(50) DEFAULT 'Pending'::character varying,
    due_date date,
    assignee character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, description, status, start_date, due_date, created_at, user_id) FROM stdin;
2	Mobile App	Build the mobile application	Pending	2026-09-01	2026-11-01	2026-08-23 17:49:21.490906	\N
3	E-Commerce Website	Build a full-stack online shopping platform	In Progress	2026-08-01	2026-10-15	2026-08-29 16:28:27.678348	\N
4	Mobile Banking App	Develop a secure mobile banking application	In Progress	2026-08-15	2026-11-30	2026-08-29 16:28:27.678348	\N
5	Customer Support Portal	Create a portal for managing customer support requests	Pending	2026-09-01	2026-12-15	2026-08-29 16:28:27.678348	\N
6	bookstore webapp	build the bookstore web app 1st	In Progress	2026-09-01	2026-09-05	2026-08-30 12:56:53.875723	\N
7	chanakyaauth	IN 1st step	Pending	2026-09-06	2026-09-08	2026-09-06 20:46:45.877598	2
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, project_id, title, description, priority, status, due_date, assignee, created_at) FROM stdin;
14	3	Design homepage	Create responsive homepage UI	High	Completed	2026-09-05	Alex	2026-08-29 16:31:10.663714
16	3	Develop product module	Build product listing and details	High	In Progress	2026-09-20	Sarah	2026-08-29 16:31:10.663714
17	3	Implement shopping cart	Develop cart functionality	Medium	Pending	2026-10-01	Mike	2026-08-29 16:31:10.663714
18	4	Design mobile UI	Create application screen designs	High	Completed	2026-09-10	David	2026-08-29 16:31:10.663714
19	4	Implement authentication	Build secure authentication flow	High	In Progress	2026-09-20	Emma	2026-08-29 16:31:10.663714
20	4	Build transaction module	Implement transaction functionality	High	Pending	2026-10-05	James	2026-08-29 16:31:10.663714
21	4	Perform security testing	Test authentication and transactions	High	Pending	2026-11-01	Sophia	2026-08-29 16:31:10.663714
22	5	Gather requirements	Document portal requirements	Medium	Completed	2026-09-15	Daniel	2026-08-29 16:31:10.663714
23	5	Design support dashboard	Create dashboard interface	Medium	In Progress	2026-09-25	Olivia	2026-08-29 16:31:10.663714
24	5	Build ticket management	Implement support ticket workflow	High	Pending	2026-10-20	Noah	2026-08-29 16:31:10.663714
27	7	first page	im certaing 1 st page	Medium	In Progress	2026-09-07	matthew	2026-09-06 20:47:30.500842
28	7	second page	doing 2 nd page upadtes 	Low	Completed	2026-09-10	chanakya	2026-09-09 14:58:55.455832
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, created_at) FROM stdin;
1	Chanakya	chanakya@test.com	$2b$10$seNvmrsWRsUAXC9dNITSueUGnA/8XMfbVIHEI9IhZbcK24bUxCc6K	2026-09-06 12:32:11.939069
2	chanakya	chanakya@gmail.com	$2b$10$emmqGn/asf3xRtxGZVCqvuQsEh3UOF7g1sEeAJXj0aR7WYexfJdoe	2026-09-06 19:39:21.850996
3	John	john@outlook.com	$2b$10$OaTwvDOoBs7iWtnkjvyM8uGw5NrIqfUZYBhFEfFySlQit3JnPR5sy	2026-09-11 16:54:46.833941
\.


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 7, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 28, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: projects projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tasks tasks_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict SU0gZVKdjquu4FoJeu8p6zoFgcQT9WWWH3hkkQlIlZWGyc2mGxFwb3SWyEVQGbr

