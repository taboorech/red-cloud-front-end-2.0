interface AvatarProps {
  src?: string;
  alt?: string;
}

const Avatar = ({ src, alt = 'User Avatar' }: AvatarProps) => {
  const defaultAvatarUrl = 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:240,cw:1440,ch:1080,q:80,w:1440/6nG6uFZVwojwN7LqV3rv6Z.png';

  return (
    <div className="w-full h-full rounded-full overflow-hidden">
      <img 
        src={src || defaultAvatarUrl} 
        alt={alt} 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = defaultAvatarUrl;
        }}
      />
    </div>
  );
};

export default Avatar;