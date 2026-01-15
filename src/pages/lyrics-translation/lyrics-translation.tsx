import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSubscription } from '../../hooks/use-subscription'
import { MdTranslate } from 'react-icons/md'
import { PremiumFeatureLock } from '../../components/premium-feature-lock/premium-feature-lock'

type Language = 'en' | 'uk' | 'es' | 'fr' | 'de' | 'it' | 'pl' | 'pt'

interface LanguageOption {
  code: Language
  name: string
  flag: string
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
]

const LyricsTranslation = () => {
  const navigate = useNavigate()
  const { hasLyrics: hasTranslation } = useSubscription()
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('uk')
  const [originalLanguage] = useState<Language>('en')

  const mockOriginal = `In the silence of the night
Stars are shining oh so bright
Whispers carried on the breeze
Dancing through the willow trees

We're chasing dreams across the sky
Learning how to laugh and cry
Every moment feels so right
Together in the pale moonlight`

  const mockTranslations: Record<Language, string> = {
    en: mockOriginal,
    uk: `У тиші ночі
Зірки сяють так яскраво
Шепіт несеться на вітрі
Танцюючи крізь верби

Ми ганяємось за мріями в небі
Вчимось сміятись і плакати
Кожна мить така правильна
Разом у блідому місячному світлі`,
    es: `En el silencio de la noche
Las estrellas brillan tan brillantes
Susurros llevados por la brisa
Bailando entre los sauces

Persiguiendo sueños por el cielo
Aprendiendo a reír y llorar
Cada momento se siente tan bien
Juntos bajo la pálida luz de la luna`,
    fr: `Dans le silence de la nuit
Les étoiles brillent si fort
Des murmures portés par la brise
Dansant à travers les saules

Nous poursuivons des rêves dans le ciel
Apprenant à rire et à pleurer
Chaque instant semble si juste
Ensemble sous la pâle lumière de la lune`,
    de: `In der Stille der Nacht
Leuchten die Sterne so hell
Flüstern auf der Brise getragen
Tanzend durch die Weiden

Wir jagen Träumen über den Himmel
Lernen zu lachen und zu weinen
Jeder Moment fühlt sich so richtig an
Zusammen im fahlen Mondlicht`,
    it: `Nel silenzio della notte
Le stelle brillano così luminose
Sussurri portati dalla brezza
Danzando tra i salici

Stiamo inseguendo sogni nel cielo
Imparando a ridere e piangere
Ogni momento sembra così giusto
Insieme nella pallida luce della luna`,
    pl: `W ciszy nocy
Gwiazdy świecą tak jasno
Szepty niesione przez wiatr
Tańczące wśród wierzb

Goniliśmy marzenia po niebie
Ucząc się śmiać i płakać
Każda chwila wydaje się tak słuszna
Razem w bladym świetle księżyca`,
    pt: `No silêncio da noite
As estrelas brilham tão brilhantes
Sussurros carregados pela brisa
Dançando entre os salgueiros

Estamos perseguindo sonhos pelo céu
Aprendendo a rir e chorar
Cada momento parece tão certo
Juntos na luz pálida da lua`,
  }

  if (!hasTranslation) {
    return (
      <PremiumFeatureLock
        icon={<MdTranslate className="w-24 h-24 mx-auto mb-6 text-gray-400" />}
        title="Premium Feature"
        description="Lyrics translation is available only for Premium and Family subscribers. Upgrade your plan to unlock translations."
        onUpgrade={() => navigate('/subscriptions')}
        onGoBack={() => navigate(-1)}
      />
    )
  }

  return (
    <div className="flex flex-col h-full bg-black p-6">
      <div className="flex-shrink-0 pb-4 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Translate to:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as Language)}
            className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm border border-gray-700 focus:outline-none focus:border-gray-600"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col min-h-0">
            <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2 flex-shrink-0">
              <span>{LANGUAGES.find(l => l.code === originalLanguage)?.flag}</span>
              <span>Original ({LANGUAGES.find(l => l.code === originalLanguage)?.name})</span>
            </h2>
            <div className="flex-1 min-h-0 rounded-2xl p-6 overflow-y-scroll">
              <pre className="font-sans text-base leading-relaxed whitespace-pre-wrap text-gray-300">
                {mockOriginal}
              </pre>
            </div>
          </div>

          <div className="flex flex-col min-h-0">
            <h2 className="text-sm font-medium text-white mb-3 flex items-center gap-2 flex-shrink-0">
              <span>{LANGUAGES.find(l => l.code === selectedLanguage)?.flag}</span>
              <span>{LANGUAGES.find(l => l.code === selectedLanguage)?.name}</span>
            </h2>
            <div className="flex-1 min-h-0 bg-purple-900/10 rounded-2xl p-6 border border-purple-500/20 overflow-y-scroll">
              <pre className="font-sans text-base leading-relaxed whitespace-pre-wrap text-white">
                {mockTranslations[selectedLanguage]}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LyricsTranslation
