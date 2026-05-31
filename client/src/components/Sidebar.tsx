import { Link } from 'react-router-dom';

export function Sidebar() {
  return (
    <nav className="bg-zinc-800 w-64 h-screen flex flex-col border-r border-zinc-700">
      <div className="p-6 border-b border-zinc-700">
        <h1 className="text-xl font-bold text-white">The Mirror</h1>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-2">
          <div className="mb-6">
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
      </div>

      <div className="border-t border-zinc-700 p-4 mt-auto">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
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
