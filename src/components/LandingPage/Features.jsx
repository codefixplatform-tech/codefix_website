import { useLocation } from 'react-router-dom';
import { 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineDocumentDuplicate, 
  HiOutlineCommandLine,
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineSparkles 
} from "react-icons/hi2";

const Features = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <section className={`relative overflow-hidden bg-background ${isDashboard ? 'pt-10 pb-20' : 'pt-32 pb-20 lg:pt-40'}`}>
      {/* Background Glows - Hero Consistency */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-5%] right-[-10%] w-[45%] h-[45%] bg-primary/20 blur-[130px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[0%] left-[-5%] w-[35%] h-[35%] bg-emerald-500/10 blur-[110px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className={`text-center space-y-6 ${isDashboard ? 'mb-12' : 'mb-24'}`}>
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md">
            <HiOutlineSparkles className="text-primary w-4 h-4" />
            <span className="text-[10px] font-semibold font-black text-slate-300 tracking-[3px] uppercase">
              Deep Dive
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold font-black text-white leading-[1.1] tracking-tight">
            Engineered for <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Peak Performance
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-secondary text-lg leading-relaxed">
            Everything you need to build, fix, and optimize your code in one high-speed ecosystem. 
            No more tab-switching, no more friction.
          </p>
        </div>

        {/* Features Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <FeatureDetailCard 
            icon={<HiOutlineChatBubbleLeftRight className="w-7 h-7" />}
            title="Dev Q&A Hub"
            description="A community-driven knowledge base. Post your trickiest bugs and get solutions from verified experts."
            points={["Rich Text Editor", "Code Highlighting", "Verified Badges"]}
          />

          <FeatureDetailCard 
            icon={<HiOutlineDocumentDuplicate className="w-7 h-7" />}
            title="File Power Tools"
            description="Manage your documents without leaving the platform. Fast, secure, and client-side processing."
            points={["PDF Merging", "Image Compression", "Docx to PDF"]}
            highlight={true}
          />

          <FeatureDetailCard 
            icon={<HiOutlineCommandLine className="w-7 h-7" />}
            title="AI Script Agent"
            description="Automate repetitive tasks. Ask our AI to write scripts, regex, or optimize your existing functions."
            points={["Auto Code Generation", "Complexity Analysis", "Multi-lang Support"]}
          />

          <FeatureDetailCard 
            icon={<HiOutlineBolt className="w-7 h-7" />}
            title="Instant Search"
            description="Lightning fast global search across all questions and tools. Find what you need in milliseconds."
            points={["Semantic Search", "Filter by Tags", "Saved Queries"]}
          />

          <FeatureDetailCard 
            icon={<HiOutlineShieldCheck className="w-7 h-7" />}
            title="Secure Ecosystem"
            description="Your data is yours. We use end-to-end encryption for all your private files and snippets."
            points={["Privacy Focused", "No Data Logging", "Encrypted Storage"]}
          />

          <FeatureDetailCard 
            icon={<HiOutlineSparkles className="w-7 h-7" />}
            title="Custom Themes"
            description="Work in the environment you love. Switch between multiple dark and light professional themes."
            points={["Glassmorphism", "OLED Dark Mode", "High Contrast"]}
          />

        </div>
      </div>
    </section>
  );
};

const FeatureDetailCard = ({ icon, title, description, points, highlight }) => (
  <div className={`group p-8 rounded-[2.5rem] bg-surface/30 border ${highlight ? 'border-primary/40 bg-primary/5' : 'border-white/10'} backdrop-blur-md hover:-translate-y-2 transition-all duration-300`}>
    <div className={`mb-6 w-14 h-14 flex items-center justify-center rounded-2xl ${highlight ? 'bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-primary'} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    
    <h3 className="text-2xl font-black text-white mb-3 font-bold group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-secondary text-sm leading-relaxed mb-6">
      {description}
    </p>

    <ul className="space-y-3">
      {points.map((point, idx) => (
        <li key={idx} className="flex items-center gap-3 text-[13px] font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#3b82f6]" />
          {point}
        </li>
      ))}
    </ul>
  </div>
);

export default Features;