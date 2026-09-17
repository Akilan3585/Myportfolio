import { ImageResponse } from "next/og";
import { person } from "@/content/resume";

export const alt = `${person.name}, ${person.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PODS = ["react", "node", "mongodb", "nextjs", "argocd", "prometheus", "grafana", "docker", "gitlab-ci"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0a0c10 0%, #0e1116 60%, #11151b 100%)",
          color: "#e6e8eb",
          padding: 72,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 72,
            top: 72,
            width: 330,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "flex-end",
          }}
        >
          {PODS.map((p) => (
            <div
              key={p}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 98,
                height: 98,
                borderRadius: 22,
                border: "1.5px solid rgba(47,155,255,0.6)",
                background: "rgba(47,155,255,0.08)",
                color: "#2f9bff",
                fontSize: 15,
                fontFamily: "monospace",
              }}
            >
              {p}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #2f9bff, #7b86ff)",
              color: "#0a0c10",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {person.initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
            <div style={{ fontSize: 22, color: "#2f9bff", letterSpacing: 4 }}>{person.badge.toUpperCase()}</div>
            <div style={{ marginTop: 14, fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{person.name}</div>
            <div style={{ marginTop: 18, fontSize: 28, color: "#9aa3b8", lineHeight: 1.3 }}>
              {"MERN and Next.js apps shipped to Kubernetes on AWS with GitLab CI and ArgoCD. AWS Certified Cloud Practitioner, 914 / 1000."}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
