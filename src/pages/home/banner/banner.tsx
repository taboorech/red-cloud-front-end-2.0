import { useTranslation } from 'react-i18next';

interface BannerProps {
  text: string
  image: string
  btnText?: string
}

const Banner = ({ text, image, btnText }: BannerProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-[200px] md:h-[260px] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-400 p-6 md:p-10 flex flex-col justify-end">
      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
        <img src={image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
        <span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-white text-[11px] tracking-[0.18em] font-semibold uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          Editor's pick
        </span>
        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">
          {text}
        </h1>
        <div className="flex items-center gap-3">
          <button className="bg-white text-black px-6 h-11 rounded-full font-semibold hover:bg-neutral-200 transition-colors cursor-pointer">
            {btnText || t('common.listenNow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
