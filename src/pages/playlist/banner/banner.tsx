import BannerMainInfo from "./banner-main-info/banner-main-info";

const Banner = () => {
  return (
    <div className="full">
      <BannerMainInfo title="My Playlist" image="https://picsum.photos/seed/UjYKtS/447/96" duration={{ songs: 10, time: 3600 }} additionalInfo="Some additional info" />
      <div></div>
    </div>
  )
}

export default Banner;