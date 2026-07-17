import { useNavigate, useLocation } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns'; 
import { 
  FaRegClock, 
  FaChevronRight,
  FaUserCircle
} from 'react-icons/fa';

const QuestionCard = ({ question }) => {
  const navigate = useNavigate(); 
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  // Props se data nikalna (Destructuring)
  const { 
    id, 
    title, 
    content, 
    tags, 
    created_at, 
    profiles,
    answer_count,
    votes_count 
  } = question;

  const authorName = profiles?.full_name || "Unknown Dev";
  const avatarUrl = profiles?.avatar_url;
  // Time ago format krte hain using date-fns
  const timeAgo = created_at ? formatDistanceToNow(new Date(created_at)) + " ago" : "Just now";

  return (
    <div 
      onClick={() => navigate(`${isDashboard ? '/dashboard' : ''}/questions/${id}`)}
      className="group relative bg-white border border-slate-200 p-6 md:p-10 rounded-[3rem] hover:border-primary/40 transition-all duration-500 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl text-slate-900"
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
        
        {/* Mobile Stats (only visible below md) */}
        <div className="flex md:hidden items-center gap-4 w-full border-b border-slate-100 pb-4 mb-2">
          {/* Votes pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-700 font-heading">{votes_count || 0}</span>
            <span className="text-[8px] uppercase font-bold tracking-wider text-slate-400">Votes</span>
          </div>

          {/* Answers pill */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
            answer_count > 0 
            ? 'bg-emerald-50 border-emerald-500/20 text-emerald-600' 
            : 'bg-slate-50 border-slate-100 text-slate-400'
          }`}>
            <span className="text-xs font-bold font-heading">{answer_count || 0}</span>
            <span className="text-[8px] uppercase font-bold tracking-wider">Answers</span>
          </div>
        </div>

        {/* 1. Stats Sidebar (visible only md and up) */}
        <div className="hidden md:flex flex-col gap-3 min-w-[80px]">
          
          {/* Votes Count */}
          <div className="flex flex-col items-center justify-center py-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-primary/20 transition-all">
            <p className="text-xl md:text-2xl font-semibold text-slate-900 font-heading">{votes_count || 0}</p>
            <p className="text-[9px] uppercase font-bold tracking-[2px] text-center text-slate-400">Votes</p>
          </div>

          {/* Answers Count - Logic: Agar jawab ho to highlight krdo */}
          <div className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all duration-500 ${
            answer_count > 0 
            ? 'bg-emerald-50 border-emerald-500/30 text-emerald-600 shadow-sm' 
            : 'bg-transparent border-slate-100 text-slate-300'
          }`}>
            <p className="text-xl md:text-2xl font-semibold font-heading">{answer_count || 0}</p>
            <p className="text-[9px] uppercase font-bold tracking-[2px] text-center">Answers</p>
          </div>
        </div>

        {/* 2. Main Content Area */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="text-xl md:text-2xl font-semibold font-heading text-slate-900 group-hover:text-primary transition-all duration-300 leading-tight tracking-tight">
               {title}
             </h3>
            <div className="bg-slate-50 p-2 rounded-full opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 border border-slate-100 shrink-0">
                <FaChevronRight className="text-primary" size={14} />
            </div>
          </div>

          <p className="text-slate-500 text-sm md:text-base line-clamp-2 leading-relaxed font-medium mb-6 sm:mb-8">
            {content}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {tags && tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-[10px] bg-slate-50 text-slate-600 px-4 py-2 rounded-xl border border-slate-100 font-bold uppercase tracking-[2px] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 py-2.5 px-4 sm:py-3 sm:px-5 bg-slate-50 rounded-2xl border border-slate-100 ml-auto sm:ml-0 group-hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/10 bg-white flex items-center justify-center shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={authorName} className="w-full h-full object-cover" />
                ) : (
                  <FaUserCircle className="text-slate-300" size={24} />
                )}
              </div>
              
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-900 font-bold uppercase tracking-wider">{authorName}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                  <FaRegClock size={10} className="text-primary/40" /> {timeAgo}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;