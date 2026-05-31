import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { interviewApi, HistoryItem } from '../api/interview';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await interviewApi.delete(deleteConfirmId);
      setHistory((prev) => prev.filter((item) => item.id !== deleteConfirmId));
      if (location.pathname === `/interviews/session/${deleteConfirmId}`) {
        navigate('/interviews');
      }
      toast.success('Simulação excluída com sucesso');
    } catch (err: unknown) {
      console.error(err);
      toast.error('Erro ao excluir simulação');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const userStr = localStorage.getItem('user');
  let userId: string | undefined;

  if (userStr) {
    try {
      const parsed = JSON.parse(userStr);
      if (parsed && typeof parsed === 'object' && 'id' in parsed && typeof parsed.id === 'string') {
        userId = parsed.id;
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = () => {
      interviewApi.getHistory(userId)
        .then((data) => setHistory(data))
        .catch((err) => console.error('[Sidebar] Error fetching history:', err));
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);

    return () => clearInterval(interval);
  }, [userId, location.pathname]);

  return (
    <nav className="bg-[#080e1a] w-64 h-screen flex flex-col border-r border-[#162032]">
      <div className="p-6 border-b border-[#162032] flex items-center gap-2.5">
        <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
        <h1 className="text-lg font-bold text-white tracking-tight">The Mirror</h1>
      </div>

      <div className="flex-1 p-4 flex flex-col min-h-0">
        <div className="space-y-2 flex-shrink-0">
          <div>
            <Link
              to="/interviews"
              className="flex items-center px-4 py-2.5 text-zinc-300 hover:bg-[#38bdf8]/10 hover:text-white rounded-lg transition-colors group"
            >
              <svg className="w-4 h-4 mr-3 text-zinc-400 group-hover:text-[#38bdf8] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium text-sm">Entrevistas</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 flex-1 flex flex-col min-h-0">
          <h3 className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 font-mono">Histórico</h3>
          <div className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
            {history.length === 0 ? (
              <div className="px-4 py-2 text-xs text-zinc-500 italic font-mono">Nenhuma simulação realizada</div>
            ) : (
              history.map((item) => {
                const isActive = location.pathname === `/interviews/session/${item.id}`;
                const firstAiMsg = item.history?.find((turn) => turn.role === 'interviewer');
                const fullDisplayName = firstAiMsg?.content || item.scenario.title;
                const displayName = fullDisplayName.length > 40
                  ? fullDisplayName.substring(0, 40) + '...'
                  : fullDisplayName;
                return (
                  <div
                    key={item.id}
                    className={`relative group flex items-center rounded-lg transition-all border ${isActive
                      ? 'bg-[#3b82f6]/10 border-[#3b82f6]/25'
                      : 'hover:bg-[#0d1625] border-transparent'
                      }`}
                  >
                    <Link
                      to={`/interviews/session/${item.id}`}
                      className={`flex-1 flex flex-col px-4 py-2 pr-8 text-sm min-w-0 ${isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                      <span className="font-medium truncate block text-xs tracking-tight" title={fullDisplayName}>{displayName}</span>
                      <div className="flex items-center justify-between mt-1 text-[9px] font-mono">
                        {item.verdict ? (
                          <span className={`px-1.5 py-0.5 rounded-[4px] font-bold ${item.verdict === 'APROVADO'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                            {item.verdict === 'APROVADO' ? 'Aprovado' : 'Reprovado'}
                          </span>
                        ) : (
                          <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded-[4px] font-bold">
                            Em progresso
                          </span>
                        )}
                        <span className="text-zinc-500">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-rose-400 hover:bg-[#162032] rounded opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer border-none bg-transparent"
                      title="Excluir entrevista"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[#162032] p-4 mt-auto flex-shrink-0">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="cursor-pointer flex items-center w-full px-4 py-2.5 text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-colors group border-none bg-transparent"
        >
          <svg className="w-4 h-4 mr-3 text-zinc-500 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#080e1a] border border-[#162032] rounded-xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-bold text-white mb-2 font-mono uppercase tracking-wider">Excluir Simulação</h3>
            <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
              Tem certeza que deseja excluir esta simulação? Esta ação é permanente e não poderá ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer border-none bg-transparent"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer border-none"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
