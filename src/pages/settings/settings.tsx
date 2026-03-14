import { useState, useCallback, useEffect, useRef } from "react"
import { IoArrowBack, IoSettingsOutline } from "react-icons/io5"
import { useNavigate } from "react-router"
import { useTranslation } from 'react-i18next'
import { useTheme } from "../../context/theme-context"
import { Button } from "../../components/button/button"
import Checkbox from "../../components/checkbox/checkbox"
import PremiumFeature from "../../components/premium-feature/premium-feature"
import { useSubscription } from "../../hooks/use-subscription"
import { useGetSupportedLanguagesQuery } from "../../store/api/lyrics.api"
import { useAudio } from "../../context/audio-context"
import { SubscriptionType } from "../../types/subscription.types"

const AUDIO_QUALITIES = [
  { value: "low", label: "Low (96 kbps)" },
  { value: "normal", label: "Normal (128 kbps)" },
  { value: "high", label: "High (256 kbps)" },
  { value: "very_high", label: "Very High (320 kbps)" },
]

interface SettingsState {
  language: string
  autoReplay: boolean
  audioQuality: string
  autoQuality: boolean
}

const DEFAULT_SETTINGS: SettingsState = {
  language: "en",
  autoReplay: false,
  audioQuality: "normal",
  autoQuality: true,
}

const loadSettings = (): SettingsState => {
  try {
    const saved = localStorage.getItem("app_settings")
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
  } catch {}
  return DEFAULT_SETTINGS
}

const Settings = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { hasHighQuality } = useSubscription()
  const { data: languages = [] } = useGetSupportedLanguagesQuery()
  const { setAutoReplay } = useAudio()
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState<SettingsState>(loadSettings)
  const [saved, setSaved] = useState(false)
  const savedSettingsRef = useRef<SettingsState>(loadSettings())
  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSettingsRef.current)

  const update = useCallback(
    <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }))
      setSaved(false)
    },
    []
  )

  const handleSave = () => {
    localStorage.setItem("app_settings", JSON.stringify(settings))
    savedSettingsRef.current = { ...settings }
    setSaved(true)

    setAutoReplay(settings.autoReplay)
  }

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2000)
      return () => clearTimeout(t)
    }
  }, [saved])

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-20 border-b border-gray-200 dark:border-white/5">
        <div className="mx-auto px-6 py-6 flex items-center justify-between w-full">
          <div className="flex items-center gap-5">
            <Button
              variant="ghost"
              size="circle"
              onClick={() => navigate(-1)}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border-transparent transition-all"
            >
              <IoArrowBack size={20} className="text-gray-900 dark:text-white" />
            </Button>
            <h1 className="text-xl font-semibold tracking-tight">{t('settings.title')}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full px-6 py-10 flex flex-col gap-10">
        {/* Language */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-600 dark:text-gray-400">
              <IoSettingsOutline size={20} />
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('settings.language')}</h2>
          </div>
          <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-8 rounded-[2rem]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('settings.languageDescription')}
              </p>
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg px-4 py-2 min-w-[180px] outline-none hover:border-gray-400 dark:hover:border-gray-600 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code.toLowerCase()}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Theme */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-600 dark:text-gray-400">
              <IoSettingsOutline size={20} />
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('settings.theme')}</h2>
          </div>
          <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-8 rounded-[2rem]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('settings.themeDescription')}
              </p>
              <div className="flex gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 text-sm rounded-md transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {t('settings.themeLight')}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 text-sm rounded-md transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {t('settings.themeDark')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Auto Replay */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-600 dark:text-gray-400">
              <IoSettingsOutline size={20} />
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('settings.autoReplay')}</h2>
          </div>
          <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-8 rounded-[2rem]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('settings.autoReplayDescription')}
              </p>
              <Checkbox
                checked={settings.autoReplay}
                onChange={(e) => update("autoReplay", e.target.checked)}
              />
            </div>
          </div>
        </section>

        {/* Quality */}
        <section className="flex flex-col gap-6 relative">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-600 dark:text-gray-400">
              <IoSettingsOutline size={20} />
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('settings.quality.label')}</h2>
            <span className="text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full">{t('comingSoon')}</span>
          </div>
          <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-8 rounded-[2rem] space-y-6 opacity-40 pointer-events-none select-none">
            {/* Audio Quality */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-900 dark:text-white font-medium">{t('settings.quality.label')}</p>
                {!hasHighQuality && (
                  <p className="text-xs text-gray-500">
                    {t('settings.quality.highQualityRequirePremium')}
                  </p>
                )}
              </div>
              <PremiumFeature
                requiredPlan={[SubscriptionType.PREMIUM, SubscriptionType.FAMILY]}
                fallback={
                  <select
                    value={
                      settings.audioQuality === "high" ||
                      settings.audioQuality === "very_high"
                        ? "normal"
                        : settings.audioQuality
                    }
                    onChange={(e) => update("audioQuality", e.target.value)}
                    disabled={settings.autoQuality}
                    className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg px-4 py-2 min-w-[180px] outline-none focus:border-gray-500 transition-colors appearance-none ${settings.autoQuality ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {AUDIO_QUALITIES.filter(
                      (q) => q.value !== "high" && q.value !== "very_high"
                    ).map((q) => (
                      <option key={q.value} value={q.value}>
                        {q.label}
                      </option>
                    ))}
                  </select>
                }
              >
                <select
                  value={settings.audioQuality}
                  onChange={(e) => update("audioQuality", e.target.value)}
                  disabled={settings.autoQuality}
                  className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg px-4 py-2 min-w-[180px] outline-none focus:border-gray-500 transition-colors appearance-none ${settings.autoQuality ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {AUDIO_QUALITIES.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
              </PremiumFeature>
            </div>

            <div className="border-t border-gray-200 dark:border-white/5" />

            {/* Automatic Quality Setting */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  {t('settings.quality.auto')}
                </p>
                <p className="text-xs text-gray-500">
                  {t('settings.quality.autoDescription')}
                </p>
              </div>
              <Checkbox
                checked={settings.autoQuality}
                onChange={(e) => update("autoQuality", e.target.checked)}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Save button */}
      {(isDirty || saved) && (
        <div className="sticky bottom-0 bg-white/80 dark:bg-black/80 border-t border-gray-200 dark:border-white/5 px-6 py-4 flex justify-end">
          <Button variant="outline" onClick={handleSave} disabled={!isDirty && !saved}>
            {saved ? "Saved!" : "Save"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Settings
