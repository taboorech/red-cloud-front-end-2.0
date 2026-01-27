import { useNavigate } from "react-router";

interface PlaylistProps {
  id: number;
  title: string;
  image?: string | null;
}

const Playlist = ({ id, title, image }: PlaylistProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/playlist/${id}`);
  };

  return (
    <div 
      className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
      onClick={handleClick}
      title={title}
    >
      <img 
        src={image || ''} 
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default Playlist;