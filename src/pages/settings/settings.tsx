import { useState, useCallback, useEffect, useRef } from "react"
import { IoArrowBack, IoSettingsOutline } from "react-icons/io5"
import { useNavigate } from "react-router"
import { Button } from "../../components/button/button"
import Checkbox from "../../components/checkbox/checkbox"
import PremiumFeature from "../../components/premium-feature/premium-feature"
import { useSubscription } from "../../hooks/use-subscription"
import { useGetSupportedLanguagesQuery } from "../../store/api/lyrics.api"
import { useAudio } from "../../context/audio-context"

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
  const { hasHighQuality } = useSubscription()
  const { data: languages = [] } = useGetSupportedLanguagesQuery()
  const { setAutoReplay } = useAudio()
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
    <div className="flex flex-col h-full text-white overflow-y-auto bg-black">
      {/* Header */}
      <div className="sticky top-0 bg-black backdrop-blur-xl z-20 border-b border-white/5">
        <div className="mx-auto px-6 py-6 flex items-center justify-between w-full">
          <div className="flex items-center gap-5">
            <Button
              variant="ghost"
              size="circle"
              onClick={() => navigate(-1)}
              className="bg-white/5 hover:bg-white/10 border-transparent transition-all"
            >
              <IoArrowBack size={20} className="text-white" />
            </Button>
            <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full px-6 py-10 flex flex-col gap-10">
        {/* Language */}
        <section className="flex flex-col gap-6 relative">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-white/5 rounded-lg text-gray-400">
              <IoSettingsOutline size={20} />
            </div>
            <h2 className="text-lg font-medium">Language</h2>
            <span className="text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full">Coming soon</span>
          </div>
          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] opacity-40 pointer-events-none select-none">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                Choose your preferred interface language.
              </p>
              <select
                value={settings.language}
                disabled
                className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg px-4 py-2 min-w-[180px] outline-none cursor-not-allowed appearance-none"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Auto Replay */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-white/5 rounded-lg text-gray-400">
              <IoSettingsOutline size={20} />
            </div>
            <h2 className="text-lg font-medium">Auto replay</h2>
          </div>
          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                Automatically restart the current track when it ends.
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
            <div className="p-2 bg-white/5 rounded-lg text-gray-400">
              <IoSettingsOutline size={20} />
            </div>
            <h2 className="text-lg font-medium">Quality</h2>
            <span className="text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full">Coming soon</span>
          </div>
          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] space-y-6 opacity-40 pointer-events-none select-none">
            {/* Audio Quality */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-white font-medium">Audio quality</p>
                {!hasHighQuality && (
                  <p className="text-xs text-gray-500">
                    High and Very High quality require Premium.
                  </p>
                )}
              </div>
              <PremiumFeature
                requiredPlan={["premium", "family"]}
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
                    className={`bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg px-4 py-2 min-w-[180px] outline-none focus:border-gray-500 transition-colors appearance-none ${settings.autoQuality ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
                  className={`bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg px-4 py-2 min-w-[180px] outline-none focus:border-gray-500 transition-colors appearance-none ${settings.autoQuality ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {AUDIO_QUALITIES.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
              </PremiumFeature>
            </div>

            <div className="border-t border-white/5" />

            {/* Automatic Quality Setting */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-white font-medium">
                  Automatic quality setting
                </p>
                <p className="text-xs text-gray-500">
                  Adjust audio quality automatically based on your network
                  connection.
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
        <div className="sticky bottom-0 bg-black border-t border-white/5 px-6 py-4 flex justify-end">
          <Button variant="outline" onClick={handleSave} disabled={!isDirty && !saved}>
            {saved ? "Saved!" : "Save"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Settings
