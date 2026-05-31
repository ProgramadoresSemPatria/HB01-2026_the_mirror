import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useInView } from 'framer-motion';
import {
  ArrowLeftIcon,
  ChatCircleDotsIcon,
  WarningCircleIcon,
  ListIcon,
  XIcon,
  ArrowDownIcon
} from '@phosphor-icons/react';
import { cn } from '../lib/utils';

// Helper components mapping globals
function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20', className)}>
      {children}
    </div>
  );
}

function SectionHeading({ children, className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn('mb-4 text-3xl text-balance md:text-4xl lg:text-5xl font-headline', className)}
      {...props}
    >
      {children}
    </h2>
  );
}

// Logo brand
function Logo() {
  return (
    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <img
        src="https://i.postimg.cc/sgmLmSb2/logo.png"
        alt="The Mirror logo"
        className="size-8 lg:size-9 rounded-sm object-contain"
      />
      <span className="text-xl font-semibold tracking-tight text-foreground lg:text-2xl font-mono">
        The Mirror
      </span>
    </div>
  );
}

// Types for Mock simulator
type AppState = 'setup' | 'interview' | 'verdict';

interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  difficultyColor: string;
  stack: string;
  description: string;
  tags: string[];
}

interface Message {
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
  hasGap?: boolean;
  gapNote?: string;
}

const INTERVIEW_CHALLENGES: Challenge[] = [
  {
    id: 'query-optimization',
    title: 'Otimização de Query',
    difficulty: 'Médio',
    difficultyColor: 'text-warning border-warning/20 bg-warning/5',
    stack: 'SQL · PostgreSQL',
    description:
      'Um endpoint de relatório está demorando 12 segundos. O banco tem 50 milhões de linhas. O entrevistador quer saber exatamente o que você faria, passo a passo, agora.',
    tags: ['N+1 Problem', 'Índices', 'EXPLAIN ANALYZE'],
  },
  {
    id: 'memory-overflow',
    title: 'Estouro de Memória em Filas',
    difficulty: 'Difícil',
    difficultyColor: 'text-error border-error/20 bg-error/5',
    stack: 'Node.js · Redis · Bull',
    description:
      'Seu worker de processamento de e-mails está crashando em produção com OOM Killed. A fila tem 2 milhões de jobs. O sistema precisa voltar em menos de 5 minutos.',
    tags: ['Memory Leak', 'Backpressure', 'Dead Letter Queue'],
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Escolha o cenário',
    description:
      'Selecione um problema técnico real: otimização de query, leak de memória, race condition. Cada desafio é baseado em incidentes reais de produção.',
  },
  {
    step: '02',
    title: 'Entre na entrevista',
    description:
      'O entrevistador de IA conduz uma sessão técnica adversarial. Ele faz perguntas reais, detecta gaps na sua resposta e pressiona em pontos fracos.',
  },
  {
    step: '03',
    title: 'Receba o veredito',
    description:
      'No final, você recebe um scorecard de reprovação detalhado: cada gap identificado, cada resposta vaga, cada oportunidade perdida — grifados.',
  },
];

const MOCK_TRANSCRIPT: Message[] = [
  {
    role: 'interviewer',
    content:
      'Bom, vamos direto ao ponto. Você tem um endpoint de relatório que está demorando 12 segundos. Banco PostgreSQL, 50 milhões de linhas na tabela principal. O que você faz primeiro?',
    timestamp: new Date(),
  },
  {
    role: 'candidate',
    content:
      'Eu adicionaria um índice na tabela para melhorar a performance.',
    timestamp: new Date(),
    hasGap: true,
    gapNote: 'Resposta vaga: não especificou qual coluna, tipo de índice ou como diagnosticaria antes de agir.',
  },
  {
    role: 'interviewer',
    content:
      'Índice em qual coluna? E como você sabe que a ausência de índice é o problema real? Você já rodou o EXPLAIN ANALYZE?',
    timestamp: new Date(),
  },
  {
    role: 'candidate',
    content:
      'Não, não rodei ainda. Eu presumiria que é o índice pelo tempo de resposta.',
    timestamp: new Date(),
    hasGap: true,
    gapNote: 'Gap crítico: presumir diagnóstico sem evidências. Falta metodologia de investigação.',
  },
  {
    role: 'interviewer',
    content:
      'Presumir em produção com 50M de linhas pode causar um ALTER TABLE que trava a tabela por horas. Vamos encerrar aqui. Você será avaliado.',
    timestamp: new Date(),
  },
];

const SCORECARD_ITEMS = [
  { label: 'Diagnóstico antes de agir', passed: false, note: 'Propôs solução sem rodar EXPLAIN ANALYZE' },
  { label: 'Conhecimento de índices', passed: false, note: 'Não soube especificar tipo nem coluna do índice' },
  { label: 'Consciência de impacto em produção', passed: false, note: 'Não mencionou ALTER TABLE concorrente nem lock' },
  { label: 'Metodologia de investigação', passed: false, note: 'Ausência total de processo estruturado' },
  { label: 'Comunicação técnica', passed: true, note: 'Linguagem clara, mas sem profundidade' },
];

function ChallengeCard({
  challenge,
  onSelect,
}: {
  challenge: Challenge;
  onSelect: (c: Challenge) => void;
}) {
  return <div />;
}

function ChatBubble({ message, index }: { message: Message; index: number }) {
  return <div />;
}

function InterviewSimulator({ isInView }: { isInView: boolean }) {
  return <div />;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleStartSimulation = () => {
    navigate('/interviews');
  };

  return (
    <div className="landing-page relative min-h-screen selection:bg-primary/20 selection:text-foreground overflow-x-hidden">
      {/* Scroll indicator bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 right-0 left-0 z-50 h-1 origin-left bg-primary"
      />

      {/* Header Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 1 }}
        className="fixed top-0 left-0 z-50 w-full bg-linear-to-b from-black via-black/60 to-transparent md:py-2"
      >
        <Container>
          <div className="relative flex items-center justify-between py-4">
            <Logo />

            <nav className="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:items-center md:gap-6">
              <a href="#como-funciona" className="text-sm text-text-secondary transition-colors hover:text-foreground">
                Como funciona
              </a>
              <a href="#desafios" className="text-sm text-text-secondary transition-colors hover:text-foreground">
                Desafios
              </a>
            </nav>

            <div className="hidden md:flex md:items-center md:gap-4">
              <button
                onClick={handleStartSimulation}
                id="header-cta-start"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover cursor-pointer"
              >
                Começar Simulação
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="-mr-2 flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface md:hidden cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isMobileMenuOpen ? <XIcon size={24} weight="bold" /> : <ListIcon size={24} weight="bold" />}
            </button>
          </div>
        </Container>
      </motion.header>

      {/* Mobile nav menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex h-full flex-col items-center justify-center gap-8"
            >
              <a
                href="#como-funciona"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-medium text-foreground transition-colors hover:text-primary"
              >
                Como funciona
              </a>
              <a
                href="#desafios"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-medium text-foreground transition-colors hover:text-primary"
              >
                Desafios
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleStartSimulation();
                }}
                className="mt-4 rounded-lg bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary-hover cursor-pointer"
              >
                Começar Simulação
              </button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24">
        {/* Placeholder for sections */}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 relative bg-background">
        <Container>
          <div className="relative flex flex-col items-center justify-between gap-4 md:flex-row">
            <Logo />

            <nav className="flex items-center gap-6 text-sm text-text-secondary md:absolute md:left-1/2 md:-translate-x-1/2">
              <a href="#como-funciona" className="transition-colors hover:text-foreground">
                Como funciona
              </a>
              <a href="#desafios" className="transition-colors hover:text-foreground">
                Desafios
              </a>
            </nav>

            <div className="text-sm text-text-muted font-mono">
              Simulações baseadas em produção real
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-text-muted font-mono">
            © 2026 The Mirror · Simulador de Entrevistas Técnicas
          </div>
        </Container>
      </footer>
    </div>
  );
}
