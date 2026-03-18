import { useTranslation } from 'react-i18next';

interface BannerProps {
  text: string
  image: string
  btnText?: string
}

const Banner = ({ text, image, btnText }: BannerProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-[120px] sm:h-[160px] md:h-[200px] lg:h-[250px] rounded-xl overflow-hidden bg-gradient-to-r from-red-600 to-red-400 p-3 sm:p-4 md:p-6 lg:p-8 flex items-end justify-between">
      <div className="flex flex-col gap-1 sm:gap-2 z-10 flex-1">
        <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight">
          {text}
        </h1>
      </div>
      <button className="z-10 bg-transparent border-2 border-white text-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 lg:px-8 lg:py-2 rounded-full font-medium hover:bg-white hover:text-red-600 transition-all text-xs sm:text-sm md:text-base whitespace-nowrap ml-2">
        {btnText || t('common.listenNow')}
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