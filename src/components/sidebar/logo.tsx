import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span className="relative grid place-items-center w-8 h-8 rounded-md bg-brand-500 shadow-[0_0_20px_-2px_rgba(239,54,54,0.7)] group-hover:shadow-[0_0_24px_-1px_rgba(239,54,54,0.85)] transition-shadow">
        <span className="absolute inset-1 rounded-sm border-2 border-black/30" />
      </span>
      <span className="text-lg font-bold tracking-tight text-app-text">RedCloud</span>
    </Link>
  );
};

export default Logo;
