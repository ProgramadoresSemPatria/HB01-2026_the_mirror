import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Database, Zap, Lock, Rocket, HardDrive, LineChart, ShieldCheck, ArrowRight, AlertCircle, MessageSquare, Eye } from 'lucide-react'
import {
  interviewApi,
  GapType,
  Failure,
  Scorecard,
  Diagnosis,
  InterviewResponse,
  Turn
} from '../api/interview'

type AppState = 'SETUP' | 'INTERVIEW' | 'VERDICT'

const SCENARIOS = [
  { id: 'auth', slug: 'authentication', label: 'Autenticação', icon: <ShieldCheck size={24} />, description: 'sabe como blindar o acesso do usuário sem criar brechas de segurança na sua arquitetura?', locked: false },
  { id: 'n1', slug: 'n-plus-one', label: 'Problema N+1', icon: <LineChart size={24} />, description: 'sabe como impedir que o seu ORM destrua a performance com milhares de consultas ocultas?', locked: false },
  { id: 'deploy', slug: 'zero-downtime-deploy', label: 'Deploy sem Downtime', icon: <Rocket size={24} />, description: 'sabe como enviar código para produção numa sexta-feira à tarde sem tirar o sistema do ar?', locked: false },
  { id: 'query', slug: 'query-optimization', label: 'Otimização de Query', icon: <Database size={24} />, description: 'sabe como eliminar gargalos em produção antes que derrubem o seu banco de dados?', locked: true },
  { id: 'race', slug: 'race-condition', label: 'Race Condition', icon: <Zap size={24} />, description: 'sabe como lidar com concorrência e evitar que múltiplos acessos simultâneos corrompam seus dados?', locked: true },
  { id: 'cache', slug: 'cache-strategy', label: 'Estratégia de Cache', icon: <HardDrive size={24} />, description: 'sabe como entregar alta velocidade de resposta sem servir dados defasados para o cliente?', locked: true },
]

const SCENARIO_BY_SLUG = Object.fromEntries(SCENARIOS.map((scenario) => [scenario.slug, scenario]))

const GAP_LABELS: Record<GapType, string> = {
  HAPPY_PATH_ONLY: 'Pensamento de Caminho Feliz',
  BUZZWORD_BLUFF: 'Blefe com Buzzwords',
  CHANGING_REQUIREMENTS: 'Colapso ao Mudar Requisito',
  DEFENSIVE_RESPONSE: 'Resposta Defensiva',
  NONE: 'Sem gap detectado',
}

const GAP_COLORS: Record<GapType, string> = {
  HAPPY_PATH_ONLY: '#f59e0b',
  BUZZWORD_BLUFF: '#8b5cf6',
  CHANGING_REQUIREMENTS: '#ef4444',
  DEFENSIVE_RESPONSE: '#f97316',
  NONE: '#6b7280',
}

// Score Ring
function ScoreRing({ score }: { score: number }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score < 40 ? '#ef4444' : score < 70 ? '#f59e0b' : '#22c55e'

  return (
    <div className="mirror-score-ring">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#1f2937" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="mirror-score-center">
        <span className="mirror-score-number" style={{ color }}>{score}</span>
        <span className="mirror-score-label">/ 100</span>
      </div>
    </div>
  )
}

// Setup Screen
function SetupScreen() {
  const navigate = useNavigate()

  return (
    <div className="mirror-setup">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mirror-setup-header"
      >
        <div className="mirror-logo-wrap">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <h1 className="mirror-title">The Mirror</h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-col items-center text-center mt-4"
      >
        <h2 className="mirror-scenario-label" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '6px', textTransform: 'none', letterSpacing: '-0.02em' }}>
          Você realmente...
        </h2>
      </motion.div>

      <div className="mirror-scenarios-grid">
        {SCENARIOS.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.4, duration: 0.4 }}
            className={`mirror-scenario-card group relative flex items-start gap-4 p-4 rounded-xl text-left border transition-all ${s.locked
                ? 'opacity-60 cursor-not-allowed border-[#162032] bg-[#04080f]/50 hover:opacity-100'
                : 'border-zinc-800 hover:border-[#38bdf8]/30 hover:bg-[#38bdf8]/5'
              }`}
            onClick={() => !s.locked && navigate(`/interviews/${s.slug}`)}
          >
            <div className={`flex items-start gap-4 w-full h-full transition-all duration-300 ${s.locked ? 'group-hover:blur-[3px] group-hover:opacity-30' : ''}`}>
              <span className={`mirror-scenario-icon mt-1 ${s.locked ? 'text-[#38bdf8]/30' : 'text-zinc-400'}`}>
                {s.locked ? <Lock size={20} /> : s.icon}
              </span>
              <div>
                <div className={`mirror-scenario-name font-semibold flex items-center gap-2 ${s.locked ? 'text-zinc-500' : 'text-white'}`}>
                  {s.label}
                </div>
                <div className={`text-sm mt-1 leading-relaxed ${s.locked ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {s.description}
                </div>
              </div>
            </div>

            {s.locked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 rounded-xl">
                <div className="text-xs text-zinc-300 font-mono flex items-center gap-1.5">
                  <Lock size={13} className="text-[#38bdf8]" />
                  Conteúdo bloqueado
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Interview Screen
function InterviewScreen({
  scenario,
  turns,
  isLoading,
  onSend,
  isCompleted,
  onShowVerdict,
}: {
  scenario: string
  turns: Turn[]
  isLoading: boolean
  onSend: (msg: string) => void
  isCompleted?: boolean
  onShowVerdict?: () => void
}) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns, isLoading])

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
    }
  }, [input])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <div className="mirror-interview">
      {/* Header */}
      <div className="mirror-interview-header">
        <div className="mirror-logo-sm">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
          <span className="mirror-title-sm">Simulador</span>
        </div>
        <div className="mirror-interview-scenario">
          <span className="mirror-scenario-pill">{scenario}</span>
        </div>
        <div className="flex items-center gap-3">
          {isCompleted && onShowVerdict && (
            <button
              onClick={onShowVerdict}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 border border-[#3b82f6]/30 text-[#60a5fa] font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              <Eye size={12} />
              Ver Relatório
            </button>
          )}
          <div className="mirror-interviewer-badge">
            <div className="mirror-avatar-dot" />
            <span>Entrevistador</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="mirror-chat">
        <AnimatePresence initial={false}>
          {turns.map((turn, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`mirror-bubble-wrap ${turn.role === 'candidate' ? 'mirror-bubble-wrap--candidate' : ''}`}
            >
              {turn.role === 'interviewer' && (
                <div className="mirror-avatar !bg-transparent border-none">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
              )}
              <div className={`flex flex-col gap-2 max-w-full ${turn.role === 'candidate' ? 'items-end' : 'items-start'}`}>
                <div className={`mirror-bubble ${turn.role === 'interviewer'
                  ? 'mirror-bubble--interviewer'
                  : turn.feedback
                    ? 'mirror-bubble--candidate mirror-bubble--candidate-feedback'
                    : 'mirror-bubble--candidate'
                  }`}>
                  <p>{turn.content}</p>
                  {turn.diagnosis && turn.diagnosis.gapDetected !== 'NONE' && (
                    <div className="mirror-gap-tag" style={{ borderColor: GAP_COLORS[turn.diagnosis.gapDetected] }}>
                      <span style={{ color: GAP_COLORS[turn.diagnosis.gapDetected] }}>
                        ⚑ {GAP_LABELS[turn.diagnosis.gapDetected]}
                      </span>
                    </div>
                  )}
                </div>

                {turn.role === 'candidate' && turn.feedback && (
                  <div className="mirror-feedback-box">
                    <AlertCircle className="mirror-feedback-icon" size={16} />
                    <span>{turn.feedback}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mirror-bubble-wrap"
            >
              <div className="mirror-avatar !bg-transparent border-none">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="mirror-bubble mirror-bubble--interviewer mirror-typing">
                <span /><span /><span />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {isCompleted && onShowVerdict ? (
        <div className="mirror-input-wrap flex items-center justify-between gap-4 py-4 px-6 border-t border-[var(--mirror-border)] bg-[var(--mirror-surface)]">
          <span className="text-zinc-500 font-mono text-xs">Simulação finalizada. O canal de mensagens está fechado.</span>
          <button
            onClick={onShowVerdict}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            <Eye size={14} />
            Exibir Relatório
          </button>
        </div>
      ) : (
        <div className="mirror-input-wrap">
          <textarea
            ref={textareaRef}
            className="mirror-input"
            placeholder="Sua resposta..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            rows={1}
            disabled={isLoading}
          />
          <button
            className="mirror-send-btn"
            disabled={!input.trim() || isLoading}
            onClick={handleSend}
            aria-label="Enviar"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

// Verdict Screen
function VerdictScreen({
  scorecard,
  diagnosis,
  onRestart,
  onMinimize,
}: {
  scorecard: Scorecard
  diagnosis: Diagnosis
  onRestart: () => void
  onMinimize: () => void
}) {
  const finalScore = scorecard?.finalScore ?? 0
  const scenarioTitle = scorecard?.scenarioTitle ?? 'Simulação Concluída'
  const failuresList = scorecard?.failures ?? []
  const successesList = scorecard?.successes ?? []

  return (
    <div className="mirror-verdict">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mirror-verdict-card"
      >
        {/* Top Right Minimize button */}
        <button
          onClick={onMinimize}
          title="Minimizar e ver histórico da conversa"
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
        >
          <MessageSquare size={18} />
        </button>

        {/* Header */}
        <div className="mirror-verdict-header" style={{
          background: finalScore >= 70 ? 'rgba(34, 197, 94, 0.05)' : 'rgba(220, 38, 38, 0.05)'
        }}>
          <div className="mirror-verdict-stamp" style={{
            color: finalScore >= 70 ? '#22c55e' : 'var(--mirror-accent)',
            borderColor: finalScore >= 70 ? '#22c55e' : 'var(--mirror-accent)'
          }}>
            {finalScore >= 70 ? 'APROVADO' : 'REPROVADO'}
          </div>
          <h2 className="mirror-verdict-title">Relatório de Performance</h2>
        </div>

        {/* Score */}
        <div className="mirror-verdict-score-section">
          <ScoreRing score={finalScore} />
          <div className="mirror-verdict-gap">
            <div
              className="mirror-gap-badge"
              style={{ background: `${GAP_COLORS[diagnosis.gapDetected]}22`, borderColor: GAP_COLORS[diagnosis.gapDetected] }}
            >
              <span style={{ color: GAP_COLORS[diagnosis.gapDetected] }}>
                ⚑ {GAP_LABELS[diagnosis.gapDetected]}
              </span>
            </div>
            {diagnosis.note && (
              <p className="mirror-verdict-note">{diagnosis.note}</p>
            )}
            {diagnosis.evidenceSpan && (
              <div className="mirror-evidence-container" style={{ borderColor: GAP_COLORS[diagnosis.gapDetected] }}>
                <div className="mirror-evidence-label" style={{ color: GAP_COLORS[diagnosis.gapDetected] }}>Evidência Citada</div>
                <blockquote className="mirror-evidence-quote">"{diagnosis.evidenceSpan}"</blockquote>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Grid (Side by side) */}
        <div className="mirror-verdict-details-grid">
          {/* Successes Column */}
          <div className="mirror-successes-column">
            <h3 className="mirror-column-title successes">
              <ShieldCheck size={16} />
              Pontos Fortes
            </h3>
            {successesList.length > 0 ? (
              <div className="mirror-list-items">
                {successesList.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i + 0.2, duration: 0.3 }}
                    className="mirror-detail-item"
                  >
                    <div className="mirror-detail-dot success" />
                    <div>
                      <div className="mirror-detail-criterion">{s.criterion}</div>
                      <div className="mirror-detail-desc">{s.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="mirror-verdict-note" style={{ fontStyle: 'italic' }}>Nenhum ponto forte relevante identificado.</p>
            )}
          </div>

          {/* Failures Column */}
          <div className="mirror-failures-column">
            <h3 className="mirror-column-title failures">
              <AlertCircle size={16} />
              Falhas Identificadas
            </h3>
            {failuresList.length > 0 ? (
              <div className="mirror-list-items">
                {failuresList.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i + 0.3, duration: 0.3 }}
                    className="mirror-detail-item"
                  >
                    <div className="mirror-detail-dot failure" />
                    <div>
                      <div className="mirror-detail-criterion">{f.criterion}</div>
                      <div className="mirror-detail-desc">{f.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="mirror-verdict-note" style={{ fontStyle: 'italic', color: '#22c55e' }}>Nenhuma falha técnica crítica detectada!</p>
            )}
          </div>
        </div>

        {/* Restart */}
        <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.1)' }}>
          <button className="mirror-restart-btn" onClick={onRestart} style={{ margin: 0 }}>
            ↺ Nova Simulação
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Main Interview Page (SPA state machine)
export default function TheMirrorPage({ userId }: { userId?: string }) {
  const [appState, setAppState] = useState<AppState>('SETUP')
  const [scenario, setScenario] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [verdict, setVerdict] = useState<{ scorecard: Scorecard; diagnosis: Diagnosis } | null>(null)
  const [interviewId, setInterviewId] = useState<string | null>(null)
  const { scenarioSlug, interviewId: sessionInterviewId } = useParams()
  const navigate = useNavigate()
  const startedSlugRef = useRef<string | null>(null)

  const handleStart = async (selectedScenario: string) => {
    setScenario(selectedScenario)
    setAppState('INTERVIEW')
    setIsLoading(true)
    try {
      const data = await interviewApi.start({
        scenario: selectedScenario,
        userId,
      })

      if (data.interviewId) {
        setInterviewId(data.interviewId)
        setTurns([{
          role: 'interviewer',
          content: data.nextInterviewerMessage,
          diagnosis: data.diagnosis,
        }])
        setVerdict(null)
        navigate(`/interviews/session/${data.interviewId}`, { replace: true })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao iniciar simulação'
      toast.error(message)
      setAppState('SETUP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async (msg: string) => {
    const newTurns: Turn[] = [...turns, { role: 'candidate', content: msg }]
    setTurns(newTurns)
    setIsLoading(true)

    try {
      const historyPayload = turns.map(t => ({ role: t.role, content: t.content, feedback: t.feedback }))

      const data = await interviewApi.sendMessage({
        interviewId,
        scenario,
        history: historyPayload,
        candidateMessage: msg,
        userId,
      })

      const updatedTurns: Turn[] = [
        ...turns,
        {
          role: 'candidate',
          content: msg,
          feedback: data.feedback,
        },
        {
          role: 'interviewer',
          content: data.nextInterviewerMessage,
          diagnosis: data.diagnosis,
        },
      ]
      setTurns(updatedTurns)

      if (data.isFinalVerdict && data.finalScorecard) {
        setVerdict({ scorecard: data.finalScorecard, diagnosis: data.diagnosis })
        setTimeout(() => setAppState('VERDICT'), 1800)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar mensagem'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestart = () => {
    startedSlugRef.current = null
    setAppState('SETUP')
    setScenario('')
    setTurns([])
    setVerdict(null)
    setInterviewId(null)
    navigate('/interviews')
  }

  useEffect(() => {
    if (sessionInterviewId) {
      if (interviewId === sessionInterviewId) {
        return
      }
      setIsLoading(true)
      interviewApi.getDetails(sessionInterviewId)
        .then((data) => {
          setInterviewId(data.id)
          setScenario(data.scenario.title)
          setTurns(data.history)
          if (data.currentStep === 'VERDICT') {
            setVerdict({
              scorecard: {
                scenarioTitle: data.scenario.title,
                finalScore: data.score ?? 0,
                failures: data.failures ?? [],
                successes: data.successes ?? [],
              },
              diagnosis: {
                gapDetected: data.gapDetected ?? 'NONE',
                evidenceSpan: data.evidence ?? '',
                note: data.note ?? '',
              }
            })
            setAppState('VERDICT')
          } else {
            setVerdict(null)
            setAppState('INTERVIEW')
          }
        })
        .catch((err) => {
          console.error(err)
          toast.error('Erro ao carregar detalhes da simulação')
          setAppState('SETUP')
        })
        .finally(() => {
          setIsLoading(false)
        })
      return
    }

    if (!scenarioSlug) {
      startedSlugRef.current = null
      setAppState('SETUP')
      return
    }

    if (startedSlugRef.current === scenarioSlug) return

    const selectedScenario = SCENARIO_BY_SLUG[scenarioSlug]

    if (!selectedScenario || selectedScenario.locked) {
      toast.error('Cenário indisponível')
      setAppState('SETUP')
      return
    }

    startedSlugRef.current = scenarioSlug
    setTurns([])
    setVerdict(null)
    setInterviewId(null)
    handleStart(selectedScenario.label)
  }, [scenarioSlug, sessionInterviewId, interviewId])

  return (
    <div className="mirror-root">
      <AnimatePresence mode="wait">
        {appState === 'SETUP' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mirror-page">
            <SetupScreen />
          </motion.div>
        )}
        {appState === 'INTERVIEW' && (
          <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mirror-page">
            <InterviewScreen
              scenario={scenario}
              turns={turns}
              isLoading={isLoading}
              onSend={handleSend}
              isCompleted={verdict !== null}
              onShowVerdict={() => setAppState('VERDICT')}
            />
          </motion.div>
        )}
        {appState === 'VERDICT' && verdict && (
          <motion.div key="verdict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mirror-page">
            <VerdictScreen
              scorecard={verdict.scorecard}
              diagnosis={verdict.diagnosis}
              onRestart={handleRestart}
              onMinimize={() => setAppState('INTERVIEW')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
