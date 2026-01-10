const Avatar = () => {
  const avatarUrl = 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:240,cw:1440,ch:1080,q:80,w:1440/6nG6uFZVwojwN7LqV3rv6Z.png'

  return (
    <div className="w-full h-full rounded-full overflow-hidden">
      <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover"/>
    </div>
  )
}

export default Avatar