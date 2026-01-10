interface BannerProps {
  text: string
  image: string
  btnText?: string
}

const Banner = ({ text, image, btnText }: BannerProps) => {
  return (
    <div className="relative w-full h-[250px] rounded-xl overflow-hidden bg-gradient-to-r from-red-600 to-red-400 p-8 flex items-end justify-between">
      <div className="flex flex-col gap-2 z-10">
        <h1 className="text-white text-4xl font-bold">
          { text }
        </h1>
      </div>
      <button className="z-10 bg-transparent border-2 border-white text-white px-8 py-2 rounded-full font-medium hover:bg-white hover:text-red-600 transition-all">
        { btnText || "Listen Now" }
      </button>
      
      <div className="absolute inset-0 opacity-40">
        <img 
          src={image} 
          alt="background" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;