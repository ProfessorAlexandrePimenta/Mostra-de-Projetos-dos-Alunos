"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowUpRight, BrainCircuit, ExternalLink, FolderPlus, Pencil, Plus, Search, Sparkles, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

type Project = { id: number; title: string; authors: string; summary: string; problem: string; solution: string; tools: string; category: string; url: string; createdAt: string };
type FormData = Omit<Project, "id" | "createdAt">;
const categories = ["Gestão", "Finanças", "Marketing", "Educação", "Saúde", "Sustentabilidade", "Outros"];
const blank: FormData = { title: "", authors: "", summary: "", problem: "", solution: "", tools: "", category: "Outros", url: "" };

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todas");
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<FormData>(blank);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoadError("");
      const response = await fetch("/api/projects", { cache: "no-store" });
      const data = await response.json() as { projects: Project[]; error?: string };
      if (!response.ok) throw new Error(data.error);
      setProjects(data.projects);
    } catch (error) { setLoadError(error instanceof Error ? error.message : "Não foi possível carregar os projetos."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const shown = useMemo(() => projects.filter(project => {
    const matches = `${project.title} ${project.authors} ${project.summary} ${project.tools}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"));
    return matches && (filter === "Todas" || project.category === filter);
  }), [projects, query, filter]);
  function openForm(project?: Project) {
    setEditing(project ?? null);
    setForm(project ? { title: project.title, authors: project.authors, summary: project.summary, problem: project.problem, solution: project.solution, tools: project.tools, category: project.category, url: project.url } : blank);
    setFormError(""); setFormOpen(true);
  }
  function update(key: keyof FormData, value: string) { setForm(current => ({ ...current, [key]: value })); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setFormError("");
    try {
      const response = await fetch(editing ? `/api/projects/${editing.id}` : "/api/projects", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error);
      setFormOpen(false); toast.success(editing ? "Projeto atualizado." : "Projeto publicado."); await load();
    } catch (error) { setFormError(error instanceof Error ? error.message : "Não foi possível salvar o projeto."); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/projects/${deleting.id}`, { method: "DELETE" });
      const data = await response.json() as { error?: string }; if (!response.ok) throw new Error(data.error);
      setDeleting(null); toast.success("Projeto excluído."); await load();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível excluir."); }
    finally { setBusy(false); }
  }
  return <>
    <header className="site-header"><div className="wrap header-inner"><a href="#inicio" className="brand" aria-label="Mostra de Projetos IFMG — início"><span className="brand-mark" aria-hidden="true"><span/><span/><span/><span/><i/></span><span><strong>Mostra de Projetos 2026-02</strong><small>IA Aplicada para Negócios Sem Código</small></span></a><nav aria-label="Navegação principal"><a href="#projetos">Projetos</a><a href="#sobre">Sobre</a><Button onClick={() => openForm()} className="nav-button"><Plus size={17}/> Cadastrar projeto</Button></nav></div></header>
    <main id="inicio">
      <section className="hero"><div className="hero-glow" aria-hidden="true"/><div className="wrap hero-inner"><div className="hero-copy"><span className="eyebrow">IFMG • Instituto Federal de Minas Gerais</span><h1>Mostra de Projetos <em>2026-02</em></h1><p className="hero-course">IA Aplicada para Negócios Sem Código</p><p className="hero-description">Conheça os projetos inovadores desenvolvidos pelos alunos, utilizando inteligência artificial e ferramentas no-code para resolver problemas reais de negócios.</p><div className="hero-actions"><a className="hero-link" href="#projetos">Explorar projetos <ArrowUpRight size={18}/></a><Button onClick={() => openForm()} className="hero-outline"><Plus size={18}/> Cadastrar projeto</Button></div></div><div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-core"><BrainCircuit size={70} strokeWidth={1.1}/></div><span className="art-node n1"/><span className="art-node n2"/><span className="art-node n3"/><span className="art-node n4"/><span className="art-node n5"/></div></div></section>
      <section id="projetos" className="catalog wrap"><div className="section-top"><div><span className="section-kicker">Vitrine da turma</span><h2>Projetos dos alunos</h2><p>Explore as soluções criadas na disciplina ou apresente a sua.</p></div><Button onClick={() => openForm()} className="add-button"><Plus size={18}/> Novo projeto</Button></div><div className="toolbar"><label className="search"><Search size={19}/><span className="sr-only">Buscar projetos</span><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por projeto, autor ou ferramenta"/></label><Select value={filter} onValueChange={setFilter}><SelectTrigger aria-label="Filtrar por categoria" className="category-filter"><SelectValue placeholder="Categoria"/></SelectTrigger><SelectContent><SelectItem value="Todas">Todas as categorias</SelectItem>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><span className="project-count">{shown.length} {shown.length === 1 ? "projeto" : "projetos"}</span></div>
        {loadError ? <div className="state-panel"><h3>Não foi possível carregar os projetos</h3><p>{loadError}</p><Button variant="outline" onClick={() => { setLoading(true); void load(); }}>Tentar novamente</Button></div> : loading ? <div className="state-panel"><p>Carregando projetos…</p></div> : shown.length === 0 ? <div className="state-panel empty"><span className="empty-icon"><FolderPlus size={29}/></span><h3>{projects.length ? "Nenhum projeto encontrado" : "A mostra está pronta para o primeiro projeto"}</h3><p>{projects.length ? "Experimente outra busca ou categoria." : "Cadastre seu projeto e compartilhe com a turma o problema que ele resolve."}</p>{!projects.length && <Button onClick={() => openForm()}><Plus size={17}/> Cadastrar primeiro projeto</Button>}</div> : <div className="project-grid">{shown.map(project => <article className="project-card" key={project.id}><div className="card-top"><span className="category-pill">{project.category}</span><Sparkles size={20} aria-hidden="true"/></div><h3>{project.title}</h3><p className="card-summary">{project.summary}</p><p className="card-authors"><span>Por</span> {project.authors}</p>{project.tools && <p className="card-tools"><strong>Ferramentas</strong> {project.tools}</p>}{(project.problem || project.solution) && <details><summary>Conhecer o projeto</summary>{project.problem && <p><strong>Problema</strong><br/>{project.problem}</p>}{project.solution && <p><strong>Solução</strong><br/>{project.solution}</p>}</details>}<div className="card-footer">{project.url ? <a href={project.url} target="_blank" rel="noopener noreferrer">Ver projeto <ExternalLink size={15}/></a> : <span/>}<div className="card-actions"><button onClick={() => openForm(project)} aria-label={`Editar ${project.title}`} title="Editar"><Pencil size={17}/></button><button onClick={() => setDeleting(project)} aria-label={`Excluir ${project.title}`} title="Excluir"><Trash2 size={17}/></button></div></div></article>)}</div>}
      </section>
      <section id="sobre" className="about"><div className="wrap about-inner"><div><span className="section-kicker">Sobre a disciplina</span><h2>Ideias reais.<br/><em>Sem código.</em></h2></div><p>IA Aplicada para Negócios Sem Código aproxima tecnologia e negócios. Nesta mostra, os alunos apresentam protótipos e soluções desenvolvidos com inteligência artificial e ferramentas no-code para desafios reais.</p></div></section>
    </main><footer><div className="wrap footer-inner"><span>IFMG • Instituto Federal de Minas Gerais</span><span>Mostra de Projetos 2026-02</span></div></footer>
    <Dialog open={formOpen} onOpenChange={open => { if (!busy) setFormOpen(open); }}><DialogContent className="form-dialog"><DialogHeader><DialogTitle>{editing ? "Editar projeto" : "Cadastrar projeto"}</DialogTitle><DialogDescription>Preencha as informações da solução desenvolvida na disciplina. Campos com * são obrigatórios.</DialogDescription></DialogHeader><form onSubmit={submit} className="project-form"><label>Título do projeto *<Input required maxLength={120} value={form.title} onChange={e => update("title", e.target.value)} placeholder="Ex.: Assistente de vendas com IA"/></label><label>Nome dos alunos *<Input required maxLength={180} value={form.authors} onChange={e => update("authors", e.target.value)} placeholder="Nomes separados por vírgula"/></label><label>Resumo *<Textarea required maxLength={600} value={form.summary} onChange={e => update("summary", e.target.value)} placeholder="O que o projeto faz?" rows={3}/></label><div className="form-row"><label>Categoria<Select value={form.category} onValueChange={value => update("category", value)}><SelectTrigger className="form-select"><SelectValue/></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></label><label>Ferramentas utilizadas<Input maxLength={250} value={form.tools} onChange={e => update("tools", e.target.value)} placeholder="Ex.: Lovable, ChatGPT"/></label></div><label>Problema de negócio<Textarea maxLength={1200} value={form.problem} onChange={e => update("problem", e.target.value)} placeholder="Qual desafio motivou o projeto?" rows={2}/></label><label>Solução proposta<Textarea maxLength={1200} value={form.solution} onChange={e => update("solution", e.target.value)} placeholder="Como a solução funciona?" rows={2}/></label><label>Link do projeto<Input type="url" maxLength={500} value={form.url} onChange={e => update("url", e.target.value)} placeholder="https://..."/></label><p className="open-note">Cadastro aberto: qualquer visitante pode editar ou excluir projetos.</p>{formError && <p className="form-error" role="alert">{formError}</p>}<DialogFooter><Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={busy}>Cancelar</Button><Button type="submit" disabled={busy}>{busy ? "Salvando…" : editing ? "Salvar alterações" : "Publicar projeto"}</Button></DialogFooter></form></DialogContent></Dialog>
    <AlertDialog open={!!deleting} onOpenChange={open => { if (!open && !busy) setDeleting(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir projeto?</AlertDialogTitle><AlertDialogDescription>“{deleting?.title}” será removido da mostra. Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={event => { event.preventDefault(); void remove(); }} className="delete-button">{busy ? "Excluindo…" : "Excluir projeto"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    <Toaster position="top-right" richColors/>
  </>;
}
