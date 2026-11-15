import { useEffect, useRef, useState } from "react"

const EVENT_DATE = new Date("2026-12-03T13:00:00")

type IconName = "calendar" | "clock" | "location" | "arrow"

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M16 3v4M8 3v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    arrow: <path d="m8 5 7 7-7 7" />,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Countdown() {
  const getRemaining = () => Math.max(0, EVENT_DATE.getTime() - Date.now())
  const [remaining, setRemaining] = useState(getRemaining)

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const seconds = Math.floor(remaining / 1000)
  const items = [
    { value: Math.floor(seconds / 86400), label: "يوم" },
    { value: Math.floor((seconds % 86400) / 3600), label: "ساعة" },
    { value: Math.floor((seconds % 3600) / 60), label: "دقيقة" },
    { value: seconds % 60, label: "ثانية" },
  ]

  return (
    <div className="countdown" aria-label="الوقت المتبقي للمناسبة">
      {items.map((item, index) => (
        <div className="countdown-item" key={item.label}>
          <strong>{String(item.value).padStart(2, "0")}</strong>
          <span>{item.label}</span>
          {index < items.length - 1 && <i aria-hidden="true">:</i>}
        </div>
      ))}
    </div>
  )
}

function HeroEnvelope({
  opened,
  onOpen,
}: {
  opened: boolean
  onOpen: () => void
}) {
  return (
    <div className={`hero-envelope-scene ${opened ? "is-open" : ""}`}>
      <button
        className="green-envelope"
        type="button"
        onClick={onOpen}
        aria-label="اضغط على الظرف لرؤية الدعوة"
        disabled={opened}
      >
        <img
          className="envelope-closed"
          src={`${import.meta.env.BASE_URL}assets/green-envelope.png`}
          alt=""
        />
        <img
          className="envelope-open"
          src={`${import.meta.env.BASE_URL}assets/z-envelope-cutout.png`}
          alt=""
        />
        <span className="envelope-prompt">
          <b>اضغط على الظرف</b>
          <small>لرؤية الدعوة</small>
        </span>
      </button>
    </div>
  )
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const backdropVideoRef = useRef<HTMLVideoElement>(null)

  const revealInvitation = () => {
    setOpened(true)
    window.setTimeout(() => {
      videoRef.current?.play().catch(() => undefined)
      backdropVideoRef.current?.play().catch(() => undefined)
    }, 100)
  }

  return (
    <main dir="rtl" className={opened ? "invitation-opened" : ""}>
      <section className="hero" aria-label="دعوة أفراح عائلة العلواني">
        <video
          ref={backdropVideoRef}
          className="hero-video-backdrop"
          src={`${import.meta.env.BASE_URL}assets/invitation-background.mp4`}
          playsInline
          muted
          preload="auto"
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          className="hero-video"
          src={`${import.meta.env.BASE_URL}assets/invitation-background.mp4`}
          playsInline
          muted
          preload="auto"
          poster={`${import.meta.env.BASE_URL}assets/video-poster.jpg`}
        />
        <div className="hero-shade" />

        <div className="family-heading">
          <span>أفراح</span>
          <h1>عائلة العلواني</h1>
          <i />
        </div>

        <HeroEnvelope opened={opened} onOpen={revealInvitation} />

        <div className="incense-smoke" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <button
          className="scroll-hint"
          type="button"
          onClick={() =>
            document
              .querySelector("#invitation-card")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span>مرّر لرؤية الدعوة</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </section>

      <section className="content-section" id="invitation-card">
        <div className="fine-ornament" aria-hidden="true">
          <span />
        </div>

        <article className="invitation-card">
          <img
            src={`${import.meta.env.BASE_URL}assets/ornate-frame-cutout.png`}
            alt=""
            aria-hidden="true"
          />
          <div className="card-copy">
            <div className="your-text">
              <span className="second-line">بسم الله الرحمن الرحيم</span>
              <p className="honor">
                بكل ود، تتشرف عائلة الحاج
                <br />
                <strong>مصطفى العلواني</strong>
                <br />
                بدعوتكم لحضور مأدبة غداء وعقد قِران
              </p>
            </div>

            <p className="groom-label">نجلها</p>
            <h3>السلطان أيمن</h3>
            <p className="closing">بحضوركم تكتمل فرحتنا</p>
          </div>
        </article>

        <p className="event-intro">تفاصيل المناسبة</p>

        <div className="details-grid">
          <div className="detail-card">
            <span className="icon-disc">
              <Icon name="calendar" />
            </span>
            <div>
              <small>التاريخ</small>
              <strong>الخميس، 3 / 12 / 2026</strong>
            </div>
          </div>

          <div className="detail-card">
            <span className="icon-disc">
              <Icon name="clock" />
            </span>
            <div>
              <small>الوقت</small>
              <strong>الساعة 1:00 ظهراً</strong>
            </div>
          </div>

          <a
            className="detail-card location-card"
            href="https://www.google.com/maps/search/?api=1&query=%D9%82%D8%A7%D8%B9%D8%A9+%D8%A7%D9%84%D8%B9%D9%84%D9%88%D8%A7%D9%86%D9%8A"
            target="_blank"
            rel="noreferrer"
          >
            <span className="icon-disc">
              <Icon name="location" />
            </span>
            <div>
              <small>المكان</small>
              <strong>اضغط لرؤية موقع الصالة</strong>
            </div>
            <span className="location-arrow">
              <Icon name="arrow" />
            </span>
          </a>
        </div>

        <div className="countdown-heading">
          <span>باقي على فرحتنا</span>
        </div>
        <Countdown />

        <footer>
          <span>ننتظر حضوركم بكل محبة</span>
          <b>عائلة العلواني</b>
        </footer>
      </section>
    </main>
  )
}
