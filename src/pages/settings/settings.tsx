import { useState, useCallback, useEffect, useRef } from "react"
import {
  IoSettingsOutline,
  IoArrowBack,
  IoLockClosed,
} from "react-icons/io5"
import {
  HiOutlineLanguage,
  HiOutlineSwatch,
  HiOutlineArrowPath,
  HiOutlineSpeakerWave,
  HiOutlineBellAlert,
  HiOutlineShieldCheck,
} from "react-icons/hi2"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import classNames from "classnames"
import { useTheme } from "../../context/theme-context"
import Checkbox from "../../components/checkbox/checkbox"
import PremiumFeature from "../../components/premium-feature/premium-feature"
import { useSubscription } from "../../hooks/use-subscription"
import { useAudio } from "../../context/audio-context"
import { SubscriptionType } from "../../types/subscription.types"
import { Helmet } from "react-helmet-async"
import Card from "../../components/editor-card/card"
import CardHeader from "../../components/editor-card/card-header"
import LockedCard from "../../components/editor-card/locked-card"
import FieldHeader from "../../components/editor-card/field-header"
import PageLayout from "../../components/page-layout/page-layout"

const UI_LANGUAGES = [
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "uk", flag: "🇺🇦", name: "Українська" },
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "it", flag: "🇮🇹", name: "Italiano" },
  { code: "pl", flag: "🇵🇱", name: "Polski" },
  { code: "pt", flag: "🇵🇹", name: "Português" },
]

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

type TabKey = "general" | "playback" | "notifications" | "privacy"

const Settings = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { hasHighQuality } = useSubscription()
  const currentLang = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0]
  const { setAutoReplay } = useAudio()
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState<SettingsState>(loadSettings)
  const [saved, setSaved] = useState(false)
  const savedSettingsRef = useRef<SettingsState>(loadSettings())
  const [activeTab, setActiveTab] = useState<TabKey>("general")
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
      const tid = setTimeout(() => setSaved(false), 2000)
      return () => clearTimeout(tid)
    }
  }, [saved])

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; locked?: boolean }[] = [
    { key: "general", label: t("settings.tabs.general"), icon: IoSettingsOutline },
    { key: "playback", label: t("settings.tabs.playback"), icon: HiOutlineArrowPath },
    { key: "notifications", label: t("settings.tabs.notifications"), icon: HiOutlineBellAlert, locked: true },
    { key: "privacy", label: t("settings.tabs.privacy"), icon: HiOutlineShieldCheck, locked: true },
  ]

  return (
    <>
      <Helmet>
        <title>{t("pageTitles.settings")}</title>
      </Helmet>
      <PageLayout maxWidth="max-w-6xl" padded={false} className="pt-8 pb-32">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-app-text-muted hover:text-app-text transition cursor-pointer mb-4"
        >
          <IoArrowBack className="w-5 h-5" />
          <span className="text-sm font-medium">{t("common.goBack")}</span>
        </button>

        <header className="flex items-start gap-5 flex-wrap mb-8">
          <span className="w-14 h-14 grid place-items-center rounded-2xl bg-brand-500/15 text-brand-400 shrink-0">
            <IoSettingsOutline className="text-2xl" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-app-text leading-tight">
              {t("settings.title")}
            </h1>
            <p className="text-app-text-muted text-sm mt-1">
              {t("settings.subtitle")}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          {/* LEFT: Tabs */}
          <aside>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto sidebar-scroll lg:overflow-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={classNames(
                      "relative flex items-center gap-3 px-3 h-11 rounded-xl text-[14px] font-medium transition-colors cursor-pointer whitespace-nowrap",
                      isActive
                        ? "bg-app-soft text-app-text"
                        : "text-app-text-muted hover:text-app-text hover:bg-app-soft"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-brand-500" />
                    )}
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left truncate">{tab.label}</span>
                    {tab.locked && (
                      <IoLockClosed
                        className="w-3.5 h-3.5 shrink-0 text-amber-500"
                        aria-label={t("comingSoon")}
                      />
                    )}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* RIGHT: Content */}
          <div className="flex flex-col gap-5">
            {activeTab === "general" && (
              <>
                <Card>
                  <CardHeader
                    index="1"
                    icon={<HiOutlineLanguage className="w-5 h-5" />}
                    title={t("settings.language")}
                    subtitle={t("settings.languageDescription")}
                  />
                  <div className="mt-3">
                    <FieldHeader>{t("settings.languageLabel")}</FieldHeader>
                    <div className="relative max-w-xs">
                      <select
                        value={currentLang}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        className="w-full appearance-none h-11 pl-4 pr-9 rounded-xl bg-app-soft border border-app-line text-app-text text-sm cursor-pointer hover:bg-app-soft-2 focus:outline-none focus:border-brand-500 transition-colors"
                      >
                        {UI_LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none">▾</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader
                    index="2"
                    icon={<HiOutlineSwatch className="w-5 h-5" />}
                    title={t("settings.theme")}
                    subtitle={t("settings.themeDescription")}
                  />
                  <div className="mt-3">
                    <FieldHeader>{t("settings.themeLabel")}</FieldHeader>
                    <div className="inline-flex bg-app-soft border border-app-line rounded-full p-1">
                      <button
                        onClick={() => setTheme("light")}
                        className={classNames(
                          "px-5 h-10 rounded-full text-sm font-semibold transition cursor-pointer",
                          theme === "light"
                            ? "bg-brand-500 text-white shadow-sm"
                            : "text-app-text-muted hover:text-app-text"
                        )}
                      >
                        {t("settings.themeLight")}
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={classNames(
                          "px-5 h-10 rounded-full text-sm font-semibold transition cursor-pointer",
                          theme === "dark"
                            ? "bg-brand-500 text-white shadow-sm"
                            : "text-app-text-muted hover:text-app-text"
                        )}
                      >
                        {t("settings.themeDark")}
                      </button>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {activeTab === "playback" && (
              <>
                <Card>
                  <CardHeader
                    index="1"
                    icon={<HiOutlineArrowPath className="w-5 h-5" />}
                    title={t("settings.autoReplay")}
                    subtitle={t("settings.autoReplayDescription")}
                    done={settings.autoReplay}
                  />
                  <div className="mt-3">
                    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                      <Checkbox
                        checked={settings.autoReplay}
                        onChange={(e) => update("autoReplay", e.target.checked)}
                      />
                      <span className="text-sm text-app-text">
                        {settings.autoReplay
                          ? t("settings.enabled")
                          : t("settings.disabled")}
                      </span>
                    </label>
                  </div>
                </Card>

                <LockedCard
                  index="2"
                  icon={<HiOutlineSpeakerWave className="w-5 h-5" />}
                  title={t("settings.quality.label")}
                  subtitle={t("settings.quality.highQualityRequirePremium")}
                  badge={t("comingSoon")}
                >
                  <FieldHeader>{t("settings.quality.label")}</FieldHeader>
                  <PremiumFeature
                    requiredPlan={[SubscriptionType.PREMIUM, SubscriptionType.FAMILY]}
                    fallback={
                      <div className="relative max-w-xs">
                        <select
                          value={
                            settings.audioQuality === "high" || settings.audioQuality === "very_high"
                              ? "normal"
                              : settings.audioQuality
                          }
                          onChange={(e) => update("audioQuality", e.target.value)}
                          disabled
                          className="w-full appearance-none h-11 pl-4 pr-9 rounded-xl bg-app-soft border border-app-line text-app-text text-sm cursor-not-allowed"
                        >
                          {AUDIO_QUALITIES.filter((q) => q.value !== "high" && q.value !== "very_high").map((q) => (
                            <option key={q.value} value={q.value}>{q.label}</option>
                          ))}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none">▾</span>
                      </div>
                    }
                  >
                    <div className="relative max-w-xs">
                      <select
                        value={settings.audioQuality}
                        onChange={(e) => update("audioQuality", e.target.value)}
                        disabled
                        className="w-full appearance-none h-11 pl-4 pr-9 rounded-xl bg-app-soft border border-app-line text-app-text text-sm cursor-not-allowed"
                      >
                        {AUDIO_QUALITIES.map((q) => (
                          <option key={q.value} value={q.value}>{q.label}</option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none">▾</span>
                    </div>
                  </PremiumFeature>
                  <label className="mt-3 inline-flex items-center gap-3 cursor-not-allowed select-none opacity-80">
                    <Checkbox checked={settings.autoQuality} onChange={() => {}} />
                    <span className="text-sm text-app-text">{t("settings.quality.auto")}</span>
                  </label>
                  {!hasHighQuality && (
                    <p className="text-[11px] text-app-text-muted mt-3">
                      {t("settings.quality.highQualityRequirePremium")}
                    </p>
                  )}
                </LockedCard>
              </>
            )}

            {activeTab === "notifications" && (
              <>
                <LockedCard
                  index="1"
                  icon={<HiOutlineBellAlert className="w-5 h-5" />}
                  title={t("settings.pushNotifications")}
                  subtitle={t("settings.notificationsDescription")}
                  badge={t("comingSoon")}
                >
                  <label className="inline-flex items-center gap-3 cursor-not-allowed select-none opacity-80">
                    <Checkbox checked={false} onChange={() => {}} />
                    <span className="text-sm text-app-text">{t("settings.disabled")}</span>
                  </label>
                </LockedCard>

                <LockedCard
                  index="2"
                  icon={<HiOutlineBellAlert className="w-5 h-5" />}
                  title={t("settings.emailNewsletters")}
                  subtitle={t("settings.newslettersDescription")}
                  badge={t("comingSoon")}
                >
                  <label className="inline-flex items-center gap-3 cursor-not-allowed select-none opacity-80">
                    <Checkbox checked={false} onChange={() => {}} />
                    <span className="text-sm text-app-text">{t("settings.disabled")}</span>
                  </label>
                </LockedCard>
              </>
            )}

            {activeTab === "privacy" && (
              <>
                <LockedCard
                  index="1"
                  icon={<HiOutlineShieldCheck className="w-5 h-5" />}
                  title={t("settings.publicProfile")}
                  subtitle={t("settings.publicProfileDesc")}
                  badge={t("comingSoon")}
                >
                  <label className="inline-flex items-center gap-3 cursor-not-allowed select-none opacity-80">
                    <Checkbox checked onChange={() => {}} />
                    <span className="text-sm text-app-text">{t("settings.enabled")}</span>
                  </label>
                </LockedCard>

                <LockedCard
                  index="2"
                  icon={<HiOutlineShieldCheck className="w-5 h-5" />}
                  title={t("settings.listeningActivity")}
                  subtitle={t("settings.listeningActivityDesc")}
                  badge={t("comingSoon")}
                >
                  <label className="inline-flex items-center gap-3 cursor-not-allowed select-none opacity-80">
                    <Checkbox checked onChange={() => {}} />
                    <span className="text-sm text-app-text">{t("settings.enabled")}</span>
                  </label>
                </LockedCard>
              </>
            )}
          </div>
        </div>

        {(isDirty || saved) && (
          <div className="fixed bottom-[100px] right-6 md:right-10 z-20">
            <div className="flex gap-3 bg-app-elev border border-app-line shadow-2xl rounded-full p-2">
              {isDirty && !saved && (
                <button
                  onClick={() => {
                    setSettings(savedSettingsRef.current)
                    setSaved(false)
                  }}
                  className="h-10 px-5 rounded-full text-app-text-soft hover:text-app-text text-sm font-semibold transition cursor-pointer"
                >
                  {t("common.discard")}
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!isDirty && !saved}
                className={classNames(
                  "h-10 px-5 rounded-full text-sm font-semibold transition cursor-pointer inline-flex items-center gap-2",
                  saved
                    ? "bg-emerald-500 text-white"
                    : "bg-brand-500 hover:bg-brand-600 text-white"
                )}
              >
                {saved ? <>✓ {t("common.saved")}</> : t("common.save")}
              </button>
            </div>
          </div>
        )}
      </PageLayout>
    </>
  )
}

export default Settings
