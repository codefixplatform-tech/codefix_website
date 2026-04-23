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
  const timeAgo = created_at ? formatDistanceToNow(new Date(created_at)) + " ago" : "Just now";

  return (
    <div 
      onClick={() => navigate(`${isDashboard ? '/dashboard' : ''}/questions/${id}`)}
      className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 md:p-8 rounded-[2.5rem] hover:border-primary/50 hover:bg-white/[0.05] transition-all duration-500 cursor-pointer overflow-hidden shadow-lg"
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
        
        {/* 1. Stats Sidebar */}
        <div className="hidden md:flex flex-col gap-3 min-w-[80px]">
          
          {/* Votes Count */}
          <div className="flex flex-col items-center justify-center py-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/20 transition-all">
            <p className="text-xl font-semibold text-white">{votes_count || 0}</p>
            <p className="text-[9px] uppercase font-semibold tracking-widest text-center text-secondary/40">Votes</p>
          </div>

          {/* Answers Count */}
          <div className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-all duration-500 ${
            answer_count > 0 
            ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10' 
            : 'bg-transparent border-white/10 text-secondary/40'
          }`}>
            <p className="text-xl font-semibold">{answer_count || 0}</p>
            <p className="text-[9px] uppercase font-semibold tracking-widest text-center">Answers</p>
          </div>
        </div>

        {/* 2. Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="text-xl md:text-2xl font-semibold text-white group-hover:text-primary transition-all duration-300 leading-tight tracking-tight">
              {title}
            </h3>
            <div className="bg-white/5 p-2 rounded-full opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                <FaChevronRight className="text-primary" size={14} />
            </div>
          </div>

          <p className="text-secondary/70 text-sm md:text-base line-clamp-2 leading-relaxed font-semibold mb-6 opacity-80">
            {content}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {tags && tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-[10px] bg-white/5 text-secondary px-4 py-1.5 rounded-xl border border-white/5 font-semibold uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 py-2.5 px-4 bg-white/5 rounded-2xl border border-white/5 ml-auto sm:ml-0 group-hover:bg-white/10 transition-colors">
              <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-primary/20 bg-background flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={authorName} className="w-full h-full object-cover" />
                ) : (
                  <FaUserCircle className="text-secondary" size={24} />
                )}
              </div>
              
              <div className="flex flex-col">
                <span className="text-[11px] text-white font-semibold uppercase tracking-wider">{authorName}</span>
                <span className="text-[10px] text-secondary/60 flex items-center gap-1 font-semibold">
                  <FaRegClock size={10} className="text-primary/50" /> {timeAgo}
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