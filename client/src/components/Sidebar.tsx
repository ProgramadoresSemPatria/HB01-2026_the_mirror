import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { interviewApi, HistoryItem } from '../api/interview';

export function Sidebar() {
  const location = useLocation();
  const [history, setHistory] = useState<HistoryItem[]>([]);

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
    <nav className="bg-zinc-800 w-64 h-screen flex flex-col border-r border-zinc-700">
      <div className="p-6 border-b border-zinc-700">
        <h1 className="text-xl font-bold text-white">The Mirror</h1>
      </div>

      <div className="flex-1 p-4 flex flex-col min-h-0">
        <div className="space-y-2 flex-shrink-0">
          <div>
            <Link
              to="/interviews"
              className="flex items-center px-4 py-3 text-zinc-300 hover:bg-red-900/40 rounded-lg transition-colors group"
            >
              <svg className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="font-medium text-red-400 group-hover:text-red-300">Entrevistas</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 flex-1 flex flex-col min-h-0">
          <h3 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Histórico</h3>
          <div className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
            {history.length === 0 ? (
              <div className="px-4 py-2 text-xs text-zinc-500 italic">Nenhuma entrevista realizada</div>
            ) : (
              history.map((item) => {
                const isActive = location.pathname === `/interviews/session/${item.id}`;
                const firstAiMsg = item.history?.find((turn) => turn.role === 'interviewer');
                const displayName = firstAiMsg?.content || item.scenario.title;
                return (
                  <Link
                    key={item.id}
                    to={`/interviews/session/${item.id}`}
                    className={`flex flex-col px-4 py-2 text-sm rounded-lg transition-colors border ${isActive
                        ? 'bg-zinc-700/40 text-white border-zinc-600'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-700/20 border-transparent'
                      }`}
                  >
                    <span className="font-medium truncate" title={displayName}>{displayName}</span>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className="text-zinc-500">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                      {item.verdict ? (
                        <span className={`px-1 rounded-[3px] font-bold uppercase ${item.verdict === 'APROVADO'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                          {item.verdict}
                        </span>
                      ) : (
                        <span className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 px-1 rounded-[3px] font-bold uppercase">
                          Em progresso
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-700 p-4 mt-auto flex-shrink-0">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="cursor-pointer flex items-center w-full px-4 py-3 text-zinc-300 hover:bg-red-500/50 rounded-lg transition-colors group"
        >
          <svg className="w-5 h-5 mr-3 text-zinc-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </nav>
  );
}
