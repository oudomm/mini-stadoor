"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Route } from "lucide-react";

import { cn } from "@/lib/utils";

type MascotStage = {
  id: string;
  title: string;
  detail: string;
  x: string;
  y: string;
  align: "left" | "right";
};

const fallbackStages: MascotStage[] = [
  {
    id: "hero",
    title: "Start with one gateway",
    detail: "Group services under one workspace before you publish any route.",
    x: "14vw",
    y: "74vh",
    align: "left",
  },
  {
    id: "workflow",
    title: "Follow the sequence",
    detail: "Create gateway, then register service, then publish the route.",
    x: "80vw",
    y: "30vh",
    align: "right",
  },
  {
    id: "surface",
    title: "Protect by route",
    detail: "Pick the auth type per route instead of locking the whole gateway.",
    x: "16vw",
    y: "66vh",
    align: "left",
  },
  {
    id: "cta",
    title: "Open the workspace",
    detail: "Use the dashboard to run the full Mini Stadoor flow after the landing page.",
    x: "78vw",
    y: "66vh",
    align: "right",
  },
];

export function LandingMascot() {
  const [stages, setStages] = useState<MascotStage[]>(fallbackStages);
  const [activeStageId, setActiveStageId] = useState<string>(fallbackStages[0].id);
  const figureRef = useRef<HTMLDivElement>(null);
  const motionTargetRef = useRef({ eyeX: 0, eyeY: 0, tilt: 0 });
  const motionCurrentRef = useRef({ eyeX: 0, eyeY: 0, tilt: 0 });

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-guide-section]"));
    if (nodes.length === 0) {
      return;
    }

    const nextStages = nodes.map((node, index) => ({
      id: node.dataset.guideSection ?? fallbackStages[index]?.id ?? `section-${index}`,
      title: node.dataset.guideTitle ?? fallbackStages[index]?.title ?? "Section",
      detail: node.dataset.guideDetail ?? fallbackStages[index]?.detail ?? "",
      x: node.dataset.mascotX ?? fallbackStages[index]?.x ?? "14vw",
      y: node.dataset.mascotY ?? fallbackStages[index]?.y ?? "74vh",
      align: (node.dataset.mascotAlign as "left" | "right" | undefined) ?? fallbackStages[index]?.align ?? "left",
    }));

    setStages(nextStages);
    setActiveStageId(nextStages[0]?.id ?? fallbackStages[0].id);
  }, []);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-guide-section]"));
    if (nodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        const nextId = (current?.target as HTMLElement | undefined)?.dataset.guideSection;
        if (nextId) {
          setActiveStageId(nextId);
        }
      },
      {
        rootMargin: "-18% 0px -30% 0px",
        threshold: [0.2, 0.4, 0.6, 0.8],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [stages]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;

    const applyMotion = () => {
      const mascot = figureRef.current;
      if (!mascot) {
        return;
      }

      const current = motionCurrentRef.current;
      mascot.style.setProperty("--eye-x", `${current.eyeX.toFixed(2)}px`);
      mascot.style.setProperty("--eye-y", `${current.eyeY.toFixed(2)}px`);
      mascot.style.setProperty("--tilt", `${current.tilt.toFixed(2)}deg`);
    };

    const handleReducedMotionChange = () => {
      if (!reducedMotionQuery.matches) {
        return;
      }
      motionTargetRef.current = { eyeX: 0, eyeY: 0, tilt: 0 };
      motionCurrentRef.current = { eyeX: 0, eyeY: 0, tilt: 0 };
      applyMotion();
    };

    const tick = () => {
      const current = motionCurrentRef.current;
      const target = motionTargetRef.current;
      const easing = reducedMotionQuery.matches ? 1 : 0.16;

      current.eyeX += (target.eyeX - current.eyeX) * easing;
      current.eyeY += (target.eyeY - current.eyeY) * easing;
      current.tilt += (target.tilt - current.tilt) * easing;

      applyMotion();
      frameId = window.requestAnimationFrame(tick);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotionQuery.matches) {
        return;
      }

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const rawX = (event.clientX - centerX) / centerX;
      const rawY = (event.clientY - centerY) / centerY;

      motionTargetRef.current = {
        eyeX: Math.max(Math.min(rawX * 7, 7), -7),
        eyeY: Math.max(Math.min(rawY * 6, 6), -6),
        tilt: Math.max(Math.min(rawX * 10, 10), -10),
      };
    };

    const handlePointerLeave = () => {
      motionTargetRef.current = { eyeX: 0, eyeY: 0, tilt: 0 };
    };

    handleReducedMotionChange();
    frameId = window.requestAnimationFrame(tick);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    } else {
      reducedMotionQuery.addListener(handleReducedMotionChange);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (typeof reducedMotionQuery.removeEventListener === "function") {
        reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      } else {
        reducedMotionQuery.removeListener(handleReducedMotionChange);
      }
    };
  }, []);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-guide-section]"));
    nodes.forEach((node) => {
      node.dataset.guideActive = node.dataset.guideSection === activeStageId ? "true" : "false";
    });
  }, [activeStageId]);

  const activeStage = useMemo(
    () => stages.find((stage) => stage.id === activeStageId) ?? fallbackStages[0],
    [activeStageId, stages],
  );
  const activeStageIndex = useMemo(
    () => Math.max(stages.findIndex((stage) => stage.id === activeStage.id), 0),
    [activeStage.id, stages],
  );

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed z-40 hidden lg:flex",
          activeStage.align === "right" ? "items-end" : "items-start",
        )}
        style={{
          left: activeStage.x,
          top: activeStage.y,
          transform: "translate(-50%, -50%)",
          transition: "left 720ms cubic-bezier(0.22, 1, 0.36, 1), top 720ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className={cn("flex flex-col gap-3", activeStage.align === "right" ? "items-end text-right" : "items-start")}>
          <div className="max-w-[14rem] rounded-[1.15rem] border border-[color:color-mix(in_srgb,var(--border-strong)_88%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_96%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_94%,transparent)_100%)] px-4 py-3 shadow-[0_16px_42px_rgba(0,0,0,0.18)] backdrop-blur-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">{activeStage.id}</p>
            <p className="mt-1 text-sm font-semibold tracking-[-0.03em] text-[var(--text-strong)]">{activeStage.title}</p>
            <p className="mt-1.5 text-[13px] leading-5 text-[var(--text-muted)]">{activeStage.detail}</p>
          </div>

          <div
            ref={figureRef}
            className="mascot-motion relative h-[10.8rem] w-[9.4rem]"
            style={{
              transform: "rotate(var(--tilt, 0deg))",
              transformOrigin: "center bottom",
              willChange: "transform",
            }}
          >
            <div className="relative h-full w-full animate-[mascot-bob_4.8s_ease-in-out_infinite]">
              <div className="absolute left-1/2 top-[0.15rem] h-[3.9rem] w-[5.2rem] -translate-x-1/2">
                <div className="absolute inset-x-0 top-0 h-[2.15rem] rounded-full border border-[color:color-mix(in_srgb,var(--border-strong)_88%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_88%,transparent)_0%,color-mix(in_srgb,var(--surface-soft)_70%,transparent)_100%)] shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_16%,transparent)]" />
                <div className="absolute left-1/2 top-[0.35rem] h-[1.42rem] w-[3.6rem] -translate-x-1/2 rounded-full border border-[color:color-mix(in_srgb,var(--accent)_34%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_70%,transparent)]" />
                <div className="absolute left-1/2 top-[2rem] h-[1.75rem] w-px -translate-x-1/2 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent)_78%,transparent),transparent)]" />
                <div className="signal-drift absolute left-1/2 top-[0.1rem] h-[0.72rem] w-[0.72rem] -translate-x-1/2 rounded-full border border-[color:color-mix(in_srgb,var(--border-strong)_92%,transparent)] bg-[linear-gradient(180deg,var(--mascot-flame-bright)_0%,var(--mascot-flame)_100%)] shadow-[0_0_24px_var(--mascot-glow)]" />
                <div className="absolute right-[0.5rem] top-[0.85rem] h-[0.42rem] w-[0.42rem] rounded-full bg-[color:color-mix(in_srgb,var(--accent)_66%,transparent)] opacity-75" />
                <div className="absolute left-[0.5rem] top-[0.85rem] h-[0.42rem] w-[0.42rem] rounded-full bg-[color:color-mix(in_srgb,var(--accent)_66%,transparent)] opacity-75" />
              </div>

              <div className="absolute bottom-[0.2rem] left-1/2 h-[8.9rem] w-[9.15rem] -translate-x-1/2 rounded-[46%_54%_52%_48%/56%_56%_44%_44%] border border-[color:color-mix(in_srgb,var(--border-strong)_88%,transparent)] bg-[linear-gradient(180deg,var(--mascot-core-bright)_0%,var(--mascot-core)_100%)] shadow-[inset_0_-14px_24px_color-mix(in_srgb,var(--accent)_14%,transparent),0_0_56px_var(--mascot-glow)]">
                <div className="absolute left-1/2 top-[1.1rem] flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--border-strong)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_84%,transparent)] shadow-[0_6px_14px_color-mix(in_srgb,var(--accent)_18%,transparent)]">
                  <Route className="h-3.5 w-3.5 text-[color:color-mix(in_srgb,var(--accent)_72%,var(--text-strong))]" />
                </div>

                <div className="absolute inset-x-0 top-[2.85rem] flex items-center justify-center gap-4">
                  <span className="flex h-8 w-6 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--border-strong)_72%,transparent)] bg-[var(--mascot-eye)] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                    <span
                      className="h-3 w-2.5 rounded-full bg-[var(--mascot-pupil)]"
                      style={{ transform: "translate(var(--eye-x, 0px), var(--eye-y, 0px))" }}
                    />
                  </span>
                  <span className="flex h-8 w-6 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--border-strong)_72%,transparent)] bg-[var(--mascot-eye)] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                    <span
                      className="h-3 w-2.5 rounded-full bg-[var(--mascot-pupil)]"
                      style={{ transform: "translate(var(--eye-x, 0px), var(--eye-y, 0px))" }}
                    />
                  </span>
                </div>

                <div className="absolute bottom-[1.2rem] left-1/2 h-6 w-[3.7rem] -translate-x-1/2 rounded-full border border-[color:color-mix(in_srgb,var(--border-strong)_72%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_66%,transparent)]">
                  <div className="absolute inset-x-[24%] top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_58%,var(--text-strong))]" />
                </div>
              </div>

              <div className="absolute bottom-[-0.95rem] left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--mascot-glow)_0%,transparent_72%)] blur-xl" />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden"
      >
        <div className="mx-auto flex max-w-[25rem] items-start gap-3 rounded-[1.05rem] border border-[color:color-mix(in_srgb,var(--border-strong)_80%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_95%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_92%,transparent)_100%)] px-3.5 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-md">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--border-strong)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_80%,transparent)]">
            <Route className="h-3.5 w-3.5 text-[color:color-mix(in_srgb,var(--accent)_74%,var(--text-strong))]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-soft)]">{activeStage.id}</p>
            <p className="mt-1 text-sm font-semibold leading-5 tracking-[-0.02em] text-[var(--text-strong)]">{activeStage.title}</p>
            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{activeStage.detail}</p>

            <div className="mt-2.5 flex items-center gap-1.5">
              {stages.map((stage, index) => (
                <span
                  key={stage.id}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    index === activeStageIndex
                      ? "w-6 bg-[color:color-mix(in_srgb,var(--accent)_86%,transparent)]"
                      : "w-3 bg-[color:color-mix(in_srgb,var(--border-soft)_92%,transparent)]",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
