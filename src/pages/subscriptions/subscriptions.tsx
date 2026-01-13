import { useState } from "react"
import { IoCheckmarkCircle, IoMusicalNotes, IoDownload, IoPhonePortrait, IoPeople, IoInfinite, IoSparkles } from "react-icons/io5"
import { Button } from "../../components/button/button"

interface SubscriptionFeature {
  text: string
  included: boolean
}

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: string
  popular?: boolean
  features: SubscriptionFeature[]
  color: string
}

// TODO: Update subscriptions/subscription rules. Add restrictions based on user status. Maybe remove FAQ section. Connect to backend.
const Subscriptions = () => {
  const currentPlan = "free"
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "yearly">("monthly")

  const plans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "forever",
      color: "gray",
      features: [
        { text: "Ad-supported streaming", included: true },
        { text: "Standard quality audio", included: true },
        { text: "Limited skips", included: true },
        { text: "Offline downloads", included: false },
        { text: "High quality audio", included: false },
        { text: "Ad-free experience", included: false },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: selectedPeriod === "monthly" ? 9.99 : 99.99,
      period: selectedPeriod === "monthly" ? "month" : "year",
      popular: true,
      color: "blue",
      features: [
        { text: "Ad-free music streaming", included: true },
        { text: "High quality audio (320kbps)", included: true },
        { text: "Unlimited skips", included: true },
        { text: "Download up to 10,000 songs", included: true },
        { text: "Listen on any device", included: true },
        { text: "Lyrics & music videos", included: true },
      ],
    },
    {
      id: "family",
      name: "Family",
      price: selectedPeriod === "monthly" ? 14.99 : 149.99,
      period: selectedPeriod === "monthly" ? "month" : "year",
      color: "purple",
      features: [
        { text: "All Premium features", included: true },
        { text: "Up to 6 family accounts", included: true },
        { text: "Family Mix playlist", included: true },
        { text: "Parental controls", included: true },
        { text: "Block explicit content", included: true },
        { text: "Individual profiles", included: true },
      ],
    },
  ]

  const currentSubscription = plans.find((p) => p.id === currentPlan)

  const benefits = [
    {
      icon: IoMusicalNotes,
      title: "Unlimited Music",
      description: "Access to millions of songs",
    },
    {
      icon: IoDownload,
      title: "Offline Listening",
      description: "Download and listen anywhere",
    },
    {
      icon: IoPhonePortrait,
      title: "Multi-Device",
      description: "Listen on phone, tablet, desktop",
    },
    {
      icon: IoPeople,
      title: "Family Sharing",
      description: "Share with up to 6 people",
    },
    {
      icon: IoInfinite,
      title: "Unlimited Skips",
      description: "Skip as many songs as you want",
    },
    {
      icon: IoSparkles,
      title: "High Quality",
      description: "Crystal clear 320kbps audio",
    },
  ]

  return (
    <div className="flex flex-col h-full text-white overflow-y-auto bg-black pb-10 rounded-md">
      <div className="sticky top-0 bg-gradient-to-b from-black via-black/95 to-transparent backdrop-blur-xl z-20 border-b border-white/5">
        <div className="px-6 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Unlock unlimited music and premium features
          </p>
        </div>
      </div>

      <div className="px-6 space-y-10">
        {currentSubscription && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
            <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{currentSubscription.name}</h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-400">
                    {currentSubscription.price === 0 ? (
                      "Free forever"
                    ) : (
                      <>
                        ${currentSubscription.price}/{currentSubscription.period} • Renews automatically
                      </>
                    )}
                  </p>
                </div>
                {currentSubscription.id !== "free" && (
                  <Button variant="ghost" size="sm" className="bg-white/5 hover:bg-white/10">
                    Manage Subscription
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="flex justify-center">
          <div className="inline-flex bg-white/5 rounded-full p-1 border border-white/10">
            <button
              onClick={() => setSelectedPeriod("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                selectedPeriod === "monthly"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPeriod("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative cursor-pointer ${
                selectedPeriod === "yearly"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                -17%
              </span>
            </button>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white/[0.03] border rounded-2xl p-6 transition-all hover:scale-[1.02] ${
                  plan.popular
                    ? "border-blue-500 shadow-lg shadow-blue-500/20"
                    : "border-white/10"
                } ${currentPlan === plan.id ? "ring-2 ring-green-500/50" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      ${plan.price}
                    </span>
                    <span className="text-gray-400 text-sm">/{plan.period}</span>
                  </div>
                  {selectedPeriod === "yearly" && plan.price > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      ${(plan.price / 12).toFixed(2)}/month billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <IoCheckmarkCircle
                        className={`flex-shrink-0 mt-0.5 ${
                          feature.included
                            ? "text-green-400"
                            : "text-gray-600"
                        }`}
                        size={18}
                      />
                      <span
                        className={`text-sm ${
                          feature.included ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  fullWidth
                  variant={currentPlan === plan.id ? "ghost" : plan.popular ? "primary" : "outline"}
                  className={
                    currentPlan === plan.id
                      ? "bg-green-500/20 text-green-400 border-green-500/30 cursor-default"
                      : ""
                  }
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? "Current Plan" : "Get Started"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-6">Why Go Premium?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/10 p-5 rounded-xl hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-500/20 rounded-lg">
                    <benefit.icon className="text-blue-400" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-6">
          <h2 className="text-lg font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.05] transition-all group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                <span>Can I cancel anytime?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 text-sm mt-3">
                Yes! You can cancel your subscription at any time. Your subscription will remain active until the end of your billing period.
              </p>
            </details>

            <details className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.05] transition-all group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                <span>What payment methods do you accept?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 text-sm mt-3">
                We accept all major credit cards, debit cards, PayPal, and Apple Pay.
              </p>
            </details>

            <details className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.05] transition-all group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                <span>Can I switch plans?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 text-sm mt-3">
                Yes, you can upgrade or downgrade your plan at any time. Changes will take effect immediately.
              </p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Subscriptions
