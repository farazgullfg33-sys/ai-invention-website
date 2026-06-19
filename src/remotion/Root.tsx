import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

function fadeUp(frame: number, start: number, duration: number) {
  return {
    opacity: interpolate(frame, [start, start + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    }),
    transform: `translateY(${interpolate(frame, [start, start + duration], [28, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    })}px)`,
  };
}

function loopPulse(frame: number, fps: number, strength = 1) {
  const phase = (Math.sin((frame / fps) * Math.PI * 2) + 1) / 2;
  return 0.5 + phase * 0.5 * strength;
}

const serviceIcons = [
  "vps-deployment",
  "document-loading",
  "telegram-agent",
  "website-build",
  "monitoring-maintenance",
  "security-control",
];

export function ServiceIconsLoop() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#ffffff", fontFamily: "Inter, Arial, sans-serif" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 18%, rgba(8, 145, 178, 0.08), transparent 32%), radial-gradient(circle at 84% 18%, rgba(13, 148, 136, 0.08), transparent 30%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 72,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 28,
        }}
      >
        {serviceIcons.map((name, index) => {
          const reveal = fadeUp(frame, index * 8, 22);
          const float = Math.sin((frame / fps) * Math.PI * 2 + index * 0.75) * 8;
          return (
            <div
              key={name}
              style={{
                ...reveal,
                display: "grid",
                placeItems: "center",
                border: "1px solid rgba(226, 232, 240, 0.9)",
                borderRadius: 18,
                background: "rgba(255,255,255,0.92)",
                boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
              }}
            >
              <Img
                src={staticFile(`images/service-icons/${name}.png`)}
                style={{
                  width: 198,
                  height: 198,
                  objectFit: "contain",
                  transform: `translateY(${float}px) scale(${1 + loopPulse(frame + index * 6, fps, 0.03) * 0.03})`,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

export function ProcessTimelineLoop() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glow = loopPulse(frame, fps, 0.7);
  const rotation = (frame / (fps * 10)) * 360;
  const packetRotation = (frame / (fps * 4)) * 360;
  const steps = [
    { title: "Discovery", subtitle: "Call", icon: "01", angle: -90 },
    { title: "Documents", subtitle: "Upload", icon: "02", angle: 0 },
    { title: "Deploy", subtitle: "VPS", icon: "03", angle: 90 },
    { title: "Telegram", subtitle: "Access", icon: "04", angle: 180 },
  ];

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #f8fafc 0%, #ecfeff 100%)", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(20,184,166,0.16), transparent 28%), radial-gradient(circle at 18% 20%, rgba(8,145,178,0.1), transparent 22%), radial-gradient(circle at 82% 78%, rgba(13,148,136,0.12), transparent 24%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 352,
          top: 72,
          width: 576,
          height: 576,
          borderRadius: 999,
          border: "1px solid rgba(8,145,178,0.18)",
          boxShadow: `0 0 ${32 + glow * 42}px rgba(13,148,136,0.18)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 414,
          top: 134,
          width: 452,
          height: 452,
          borderRadius: 999,
          border: "2px dashed rgba(8,145,178,0.26)",
          transform: `rotate(${rotation}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 486,
          top: 206,
          width: 308,
          height: 308,
          borderRadius: 999,
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(8,145,178,0.14)",
          boxShadow: "0 24px 80px rgba(15,23,42,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 536,
          top: 286,
          width: 208,
          textAlign: "center",
        }}
      >
        <div style={{ color: "#0891b2", fontSize: 28, fontWeight: 800, letterSpacing: 0 }}>AI Agent</div>
        <div style={{ marginTop: 8, color: "#0f172a", fontSize: 46, fontWeight: 900, lineHeight: 1 }}>Deployment</div>
        <div style={{ marginTop: 12, color: "#475569", fontSize: 22, fontWeight: 600 }}>4-step workflow</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 632,
          top: 92,
          width: 16,
          height: 16,
          borderRadius: 999,
          background: "#14b8a6",
          boxShadow: "0 0 24px rgba(20,184,166,0.72)",
          transformOrigin: "8px 268px",
          transform: `rotate(${packetRotation}deg)`,
        }}
      />
      {steps.map((step) => {
        const reveal = fadeUp(frame, 10 + Number(step.icon) * 10, 18);
        const radius = 226;
        const rad = (step.angle * Math.PI) / 180;
        const x = 640 + Math.cos(rad) * radius;
        const y = 360 + Math.sin(rad) * radius;
        return (
          <div
            key={step.title}
            style={{
              ...reveal,
              position: "absolute",
              left: x - 106,
              top: y - 72,
              width: 212,
              height: 144,
              display: "grid",
              placeItems: "center",
              borderRadius: 28,
              border: "1px solid rgba(8,145,178,0.16)",
              background: "rgba(255,255,255,0.88)",
              boxShadow: `0 18px 48px rgba(15,23,42,0.1), 0 0 ${14 + glow * 18}px rgba(8,145,178,0.13)`,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-grid",
                  width: 44,
                  height: 44,
                  placeItems: "center",
                  marginBottom: 10,
                  borderRadius: 999,
                  color: "#ffffff",
                  background: "linear-gradient(135deg, #0891b2, #0d9488)",
                  fontSize: 18,
                  fontWeight: 900,
                }}
              >
                {step.icon}
              </div>
              <div style={{ color: "#0f172a", fontSize: 24, fontWeight: 850 }}>{step.title}</div>
              <div style={{ color: "#64748b", fontSize: 18, fontWeight: 650, marginTop: 4 }}>{step.subtitle}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

export function TrustSecurityLoop() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glow = loopPulse(frame, fps, 0.72);
  const beamShift = interpolate(frame % (fps * 6), [0, fps * 6], [-180, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#f8fafc" }}>
      <Img
        src={staticFile("images/trust-security-visual.webp")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${1 + glow * 0.012})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, rgba(20, 184, 166, ${0.08 + glow * 0.06}), transparent 36%)`,
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 155,
          left: 420 + beamShift,
          width: 420,
          height: 420,
          borderRadius: "50%",
          border: `2px solid rgba(20, 184, 166, ${0.1 + glow * 0.16})`,
          filter: "blur(0.2px)",
        }}
      />
      {[0, 1, 2].map((line) => (
        <div
          key={line}
          style={{
            position: "absolute",
            left: 360,
            right: 360,
            top: 255 + line * 90,
            height: 3,
            borderRadius: 999,
            background: `linear-gradient(90deg, transparent, rgba(20,184,166,${0.22 + glow * 0.2}), transparent)`,
            transform: `translateX(${beamShift * (line % 2 === 0 ? 1 : -1)}px)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
}

export function LogoAgenticLoop() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = loopPulse(frame, fps, 0.8);
  const fastPulse = loopPulse(frame + 18, fps, 1);
  const scan = interpolate(frame % (fps * 4), [0, fps * 4], [-520, 520], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beam = interpolate(frame % (fps * 3), [0, fps * 3], [-180, 1460], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const underline = interpolate(frame % 90, [0, 46, 90], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nodes = [
    { x: 152, y: 92, delay: 0 },
    { x: 270, y: 235, delay: 10 },
    { x: 1010, y: 84, delay: 18 },
    { x: 1128, y: 238, delay: 28 },
    { x: 640, y: 54, delay: 36 },
    { x: 640, y: 304, delay: 44 },
  ];

  return (
    <AbsoluteFill style={{ background: "#ffffff", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(8,145,178,0.1), transparent 34%), radial-gradient(circle at 22% 28%, rgba(13,148,136,0.1), transparent 24%), radial-gradient(circle at 80% 70%, rgba(8,145,178,0.08), transparent 26%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 120,
          right: 120,
          height: 264,
          border: "1px solid rgba(8,145,178,0.14)",
          borderRadius: 28,
          background: "rgba(255,255,255,0.72)",
          boxShadow: `0 28px 90px rgba(15,23,42,0.09), 0 0 ${24 + pulse * 34}px rgba(8,145,178,0.13)`,
        }}
      />
      {[0, 1, 2, 3].map((line) => (
        <div
          key={line}
          style={{
            position: "absolute",
            left: 180,
            right: 180,
            top: 96 + line * 54,
            height: line === 1 ? 3 : 2,
            borderRadius: 999,
            background: `linear-gradient(90deg, transparent, rgba(8,145,178,${0.2 + fastPulse * 0.16}), rgba(20,184,166,${
              0.14 + pulse * 0.16
            }), transparent)`,
            transform: `translateX(${scan * (line % 2 === 0 ? 1 : -1) * 0.75}px)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: beam,
          top: 54,
          width: 140,
          height: 252,
          borderRadius: 999,
          background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.24), rgba(255,255,255,0.64), transparent)",
          filter: "blur(0.2px)",
          transform: "skewX(-18deg)",
          opacity: 0.84,
        }}
      />
      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1280 360">
        <path d="M152 92 C330 72 410 160 512 180" fill="none" stroke="rgba(8,145,178,0.33)" strokeWidth="3" />
        <path d="M270 235 C380 245 450 195 512 180" fill="none" stroke="rgba(13,148,136,0.3)" strokeWidth="3" />
        <path d="M768 180 C876 128 928 80 1010 84" fill="none" stroke="rgba(8,145,178,0.33)" strokeWidth="3" />
        <path d="M768 180 C870 228 1008 236 1128 238" fill="none" stroke="rgba(13,148,136,0.3)" strokeWidth="3" />
        <path d="M640 54 L640 118" fill="none" stroke="rgba(8,145,178,0.34)" strokeWidth="3" />
        <path d="M640 242 L640 304" fill="none" stroke="rgba(13,148,136,0.32)" strokeWidth="3" />
      </svg>
      {nodes.map((node) => {
        const nodePulse = loopPulse(frame + node.delay, fps, 0.75);
        return (
          <div
            key={`${node.x}-${node.y}`}
            style={{
              position: "absolute",
              left: node.x - 8,
              top: node.y - 8,
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#0d9488",
              boxShadow: `0 0 0 ${7 + nodePulse * 9}px rgba(13,148,136,0.11), 0 0 ${12 + nodePulse * 22}px rgba(8,145,178,0.28)`,
              opacity: 0.68 + nodePulse * 0.32,
            }}
          />
        );
      })}
      {[0, 1, 2, 3].map((packet) => {
        const packetProgress = interpolate((frame + packet * 22) % 110, [0, 110], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = interpolate(packetProgress, [0, 1], [205, 1075]);
        const y = 180 + Math.sin(packetProgress * Math.PI * 2 + packet) * 78;
        return (
          <div
            key={packet}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 9,
              height: 9,
              borderRadius: 999,
              background: packet % 2 === 0 ? "#0891b2" : "#14b8a6",
              boxShadow: "0 0 18px rgba(8,145,178,0.6)",
              opacity: packetProgress < 0.06 || packetProgress > 0.95 ? 0 : 0.9,
            }}
          />
        );
      })}
      <Img
        src={staticFile("images/ai-invention-logo.png")}
        style={{
          position: "absolute",
          left: 380,
          top: 96,
          width: 520,
          height: 168,
          objectFit: "contain",
          filter: `drop-shadow(0 18px 34px rgba(15,23,42,0.12)) drop-shadow(0 0 ${10 + pulse * 18}px rgba(8,145,178,0.18))`,
          transform: `scale(${1 + pulse * 0.012})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 424,
          top: 262,
          width: 432,
          height: 4,
          borderRadius: 999,
          background: `linear-gradient(90deg, transparent, rgba(8,145,178,${0.28 + underline * 0.4}), rgba(20,184,166,${
            0.3 + underline * 0.45
          }), transparent)`,
          boxShadow: `0 0 ${12 + underline * 30}px rgba(20,184,166,0.34)`,
          transform: `scaleX(${0.82 + underline * 0.18})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 376 + scan,
          top: 88,
          width: 120,
          height: 184,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.72), transparent)",
          transform: "skewX(-14deg)",
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
}

export function RemotionRoot() {
  return (
    <>
      <Composition id="LogoAgenticLoop" component={LogoAgenticLoop} durationInFrames={180} fps={30} width={1280} height={360} />
      <Composition id="ServiceIconsLoop" component={ServiceIconsLoop} durationInFrames={180} fps={30} width={1280} height={720} />
      <Composition id="ProcessTimelineLoop" component={ProcessTimelineLoop} durationInFrames={240} fps={30} width={1280} height={720} />
      <Composition id="TrustSecurityLoop" component={TrustSecurityLoop} durationInFrames={180} fps={30} width={1280} height={720} />
    </>
  );
}
