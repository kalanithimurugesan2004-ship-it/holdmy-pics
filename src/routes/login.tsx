import { useMemo, useRef, useState, type ChangeEvent, type FormEvent, type Ref, type CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { jsPDF } from "jspdf";

const MAX_PHOTOS = 36;
const GRID_COLUMNS = 4;
const GRID_ROWS = 9;

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [uploadKey, setUploadKey] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<"rectangle" | "square" | "strip">("rectangle");
  const previewRef = useRef<HTMLDivElement | null>(null);

  const previewExportStyles: CSSProperties = {
    "--background": "#ffffff",
    "--foreground": "#0f172a",
    "--card": "#ffffff",
    "--card-foreground": "#0f172a",
    "--popover": "#ffffff",
    "--popover-foreground": "#0f172a",
    "--primary": "#8b5cf6",
    "--primary-foreground": "#ffffff",
    "--secondary": "#eef2ff",
    "--secondary-foreground": "#0f172a",
    "--muted": "#f8fafc",
    "--muted-foreground": "#64748b",
    "--accent": "#c7d2fe",
    "--accent-foreground": "#ffffff",
    "--destructive": "#ef4444",
    "--destructive-foreground": "#ffffff",
    "--border": "#e5e7eb",
    "--input": "#f8fafc",
    "--ring": "#c7d2fe",
    "--color-background": "#ffffff",
    "--color-foreground": "#0f172a",
    "--color-card": "#ffffff",
    "--color-card-foreground": "#0f172a",
    "--color-popover": "#ffffff",
    "--color-popover-foreground": "#0f172a",
    "--color-primary": "#8b5cf6",
    "--color-primary-foreground": "#ffffff",
    "--color-secondary": "#eef2ff",
    "--color-secondary-foreground": "#0f172a",
    "--color-muted": "#f8fafc",
    "--color-muted-foreground": "#64748b",
    "--color-accent": "#c7d2fe",
    "--color-accent-foreground": "#ffffff",
    "--color-destructive": "#ef4444",
    "--color-destructive-foreground": "#ffffff",
    "--color-border": "#e5e7eb",
    "--color-input": "#f8fafc",
    "--color-ring": "#c7d2fe",
    "--color-slate-100": "#f8fafc",
    "--color-slate-200": "#e5e7eb",
    "--color-slate-400": "#94a3b8",
    "--shadow-soft": "0 4px 24px -8px rgba(15, 23, 42, 0.18)",
    "--shadow-card": "0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 12px 40px -12px rgba(15, 23, 42, 0.15)",
    "backgroundColor": "#ffffff",
    "color": "#0f172a",
  } as CSSProperties;

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setIsAuthenticated(true);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const nextFiles = Array.from(selectedFiles).slice(0, MAX_PHOTOS);
    const nextPreviews = await Promise.all(
      nextFiles.map((file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("Failed to read file preview"));
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        })
      )
    );

    setFiles(nextFiles);
    setPhotoPreviews(nextPreviews);
    setUploadKey((k) => k + 1);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setFiles([]);
    setError("");
  };

  const [exporting, setExporting] = useState(false);

  const loadImage = (src: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const drawCoverImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    const scale = Math.max(width / img.width, height / img.height);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sx = Math.max(0, (img.width - sourceWidth) / 2);
    const sy = Math.max(0, (img.height - sourceHeight) / 2);
    ctx.drawImage(img, sx, sy, sourceWidth, sourceHeight, x, y, width, height);
  };

  const handleExportPDF = async () => {
    if (photoPreviews.length === 0) {
      window.alert("Upload at least one photo before exporting.");
      return;
    }

    setExporting(true);

    try {
      const dpi = 150;
      const pageWidth = 13 * dpi;
      const pageHeight = 19 * dpi;
      const canvas = document.createElement("canvas");
      canvas.width = pageWidth;
      canvas.height = pageHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Unable to create canvas context");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageWidth, pageHeight);

      const margin = 80;
      const gridWidth = pageWidth - margin * 2;
      const gridHeight = pageHeight - margin * 2;
      const titleHeight = 120;
      const slotGap = 18;
      const titleY = margin;

      ctx.fillStyle = "#111827";
      ctx.font = "bold 46px Plus Jakarta Sans";
      ctx.fillText(
        selectedTemplate === "rectangle"
          ? "13×19 Rectangular Polaroid"
          : selectedTemplate === "square"
          ? "13×19 Square Polaroid"
          : "13×19 Strip Polaroid",
        margin,
        titleY + 50,
      );

      ctx.font = "24px Plus Jakarta Sans";
      ctx.fillStyle = "#475569";
      ctx.fillText(
        selectedTemplate === "rectangle"
          ? "Classic rectangular slots with a larger bottom white border."
          : selectedTemplate === "square"
          ? "Square photo frames with a wider lower margin."
          : "Tall strip-style polaroids with a darker border.",
        margin,
        titleY + 90,
      );

      const slotsTop = margin + titleHeight;
      const slotsHeight = pageHeight - slotsTop - margin;

      if (selectedTemplate !== "strip") {
        const cols = 4;
        const rows = 9;
        const slotW = (gridWidth - slotGap * (cols - 1)) / cols;
        const slotH = (slotsHeight - slotGap * (rows - 1)) / rows;

        for (let index = 0; index < cols * rows; index += 1) {
          const x = margin + (index % cols) * (slotW + slotGap);
          const y = slotsTop + Math.floor(index / cols) * (slotH + slotGap);

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x, y, slotW, slotH);
          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, slotW, slotH);

          const innerX = x + 14;
          const innerY = y + 14;
          const innerW = slotW - 28;
          const innerH = selectedTemplate === "rectangle" ? slotH - 28 : innerW;
          ctx.fillStyle = "#f1f5f9";
          ctx.fillRect(innerX, innerY, innerW, innerH);

          const photo = photoPreviews[index];
          if (photo) {
            const img = await loadImage(photo);
            drawCoverImage(ctx, img, innerX, innerY, innerW, innerH);
          } else {
            ctx.fillStyle = "#cbd5e1";
            ctx.font = "18px Plus Jakarta Sans";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("EMPTY", innerX + innerW / 2, innerY + innerH / 2);
          }
        }
      } else {
        const cols = 4;
        const slotW = (gridWidth - slotGap * (cols - 1)) / cols;
        const cardHeight = slotsHeight;
        const cardGap = slotGap;

        for (let col = 0; col < cols; col += 1) {
          const x = margin + col * (slotW + cardGap);
          const y = slotsTop;
          ctx.fillStyle = "#6b0f17";
          ctx.fillRect(x, y, slotW, cardHeight);
          ctx.strokeStyle = "#4f0711";
          ctx.lineWidth = 6;
          ctx.strokeRect(x, y, slotW, cardHeight);

          const innerGap = 16;
          const itemH = (cardHeight - innerGap * 4) / 3;
          for (let row = 0; row < 3; row += 1) {
            const iy = y + innerGap + row * (itemH + innerGap);
            const innerX = x + innerGap;
            const innerW = slotW - innerGap * 2;
            const innerH = itemH;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(innerX, iy, innerW, innerH);
            ctx.strokeStyle = "#e5e7eb";
            ctx.lineWidth = 3;
            ctx.strokeRect(innerX, iy, innerW, innerH);

            const photo = photoPreviews[col * 3 + row];
            if (photo) {
              const img = await loadImage(photo);
              drawCoverImage(ctx, img, innerX, iy, innerW, innerH);
            } else {
              ctx.fillStyle = "#cbd5e1";
              ctx.font = "18px Plus Jakarta Sans";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("EMPTY", innerX + innerW / 2, iy + innerH / 2);
            }
          }
        }
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "in", format: [13, 19] });
      pdf.addImage(imgData, "PNG", 0, 0, 13, 19);
      pdf.save("HoldMyPics-layout.pdf");
    } catch (error) {
      console.error("PDF export failed:", error);
      window.alert("PDF export failed. Please check the console for details.");
    } finally {
      setExporting(false);
    }
  };

  const photoSlots = useMemo(() => {
    return Array.from({ length: GRID_COLUMNS * GRID_ROWS }, (_, index) => {
      return photoPreviews[index] ?? null;
    });
  }, [photoPreviews]);

  function PolaroidPreview({
    title,
    subtitle,
    type,
    containerRef,
    style,
  }: {
    title: string;
    subtitle: string;
    type: "rectangle" | "square" | "strip";
    containerRef?: Ref<HTMLDivElement>;
    style?: CSSProperties;
  }) {
    const chunk = (arr: (string | null)[], size: number) => {
      const out: (string | null)[][] = [];
      for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
      return out;
    };
    return (
      <div ref={containerRef} style={style} className="pdf-export-safe overflow-hidden rounded-3xl border border-border/80 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-foreground/70">{subtitle}</p>
          </div>
        </div>

        <div
          className="mx-auto w-full max-w-[950px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]"
          style={{ aspectRatio: "13 / 19" }}
        >
          {type !== "strip" ? (
            <div className="grid h-full w-full grid-cols-4 gap-3">
              {photoSlots.map((src, index) => (
                <div
                  key={index}
                  className="flex h-full flex-col overflow-hidden border border-slate-200 bg-white shadow-soft px-2 pt-2 pb-10"
                >
                  {type === "rectangle" ? (
                    <div className="relative flex-1 overflow-hidden bg-slate-100 rounded-[4px]">
                      {src ? (
                        <img
                          src={src}
                          alt={`slot-${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.24em] text-slate-400">
                          empty
                        </div>
                      )}
                    </div>
                  ) : null}

                  {type === "square" ? (
                    <div className="overflow-hidden bg-slate-100 p-2">
                      <div className="aspect-square w-full overflow-hidden bg-slate-100 rounded-[4px]">
                        {src ? (
                          <img
                            src={src}
                            alt={`slot-${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.24em] text-slate-400">
                            empty
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            // For strips, render grouped 3-photo stacked cards across the page
            <div className="grid h-full w-full grid-cols-4 gap-3">
              {chunk(photoSlots, 3).map((group, gIndex) => (
                <div
                  key={gIndex}
                  className="flex flex-col overflow-hidden shadow-soft"
                  style={{ backgroundColor: "#6b0f17", padding: 8, minHeight: 420, boxSizing: 'border-box' }}
                >
                  <div className="p-1 bg-transparent flex-1 flex">
                    <div className="flex flex-1 flex-col gap-3 w-full" style={{ minHeight: 0 }}>
                      {group.map((src, i) => (
                        <div key={i} className="flex-1 bg-white overflow-hidden rounded-[4px]">
                          {src ? (
                            <img src={src} alt={`strip-${gIndex}-${i}`} className="w-full h-full object-cover block" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.24em] text-slate-400">empty</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 100, backgroundColor: "#6b0f17" }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl border border-border/80 bg-card p-8 shadow-card">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Hold My Pics Designer</h1>
            <p className="mt-2 max-w-2xl text-sm text-foreground/70">
              Login and place up to 36 photos on a 13×19 layout. The system will align them automatically and export a PDF.
            </p>
          </div>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-destructive px-4 py-2 text-sm font-medium text-background transition hover:bg-destructive/90"
            >
              Logout
            </button>
          ) : null}
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-5 rounded-3xl border border-border/80 bg-background/80 p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Username</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Password</label>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Login to design
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-3xl border border-border/80 bg-background/80 p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Upload Photos</h2>
                <p className="mt-2 text-sm text-foreground/70">
                  Select a layout first, then upload as few as one photo. Images will be placed into the chosen 13×19 format.
                </p>
                <label className="mt-5 flex cursor-pointer flex-col rounded-3xl border border-dashed border-primary/70 bg-primary/5 px-4 py-6 text-center transition hover:border-primary">
                  <span className="text-sm font-medium text-primary">Select images</span>
                  <span className="mt-2 text-xs text-foreground/60">PNG, JPG, JPEG — max 36 files</span>
                  <input
                    key={uploadKey}
                    type="file"
                    accept="image/png,image/jpeg"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <div className="mt-4 grid gap-3 text-sm text-foreground/70">
                  <div>Uploaded: {files.length} / {MAX_PHOTOS}</div>
                  <div>Photo slot size is fixed to create a 13×19 PDF-ready layout.</div>
                </div>
                <div className="mt-6">
                  <p className="mb-2 text-sm font-medium text-foreground">Select layout</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "rectangle", label: "Rectangle" },
                      { id: "square", label: "Square" },
                      { id: "strip", label: "Strip" },
                    ].map((layout) => (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => setSelectedTemplate(layout.id as "rectangle" | "square" | "strip")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          selectedTemplate === layout.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-background border border-border text-foreground hover:bg-primary/10"
                        }`}
                      >
                        {layout.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border/80 bg-background/80 p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Export PDF</h2>
                <p className="mt-2 text-sm text-foreground/70">Download a printable 13×19 PDF with your aligned photos.</p>
                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={files.length === 0 || exporting}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:bg-primary/50 hover:bg-primary/90"
                >
                  {exporting ? "Exporting..." : "Export PDF"}
                </button>
              </div>
            </div>

            <PolaroidPreview
              title={
                selectedTemplate === "rectangle"
                  ? "13×19 Rectangular Polaroid"
                  : selectedTemplate === "square"
                  ? "13×19 Square Polaroid"
                  : "13×19 Strip Polaroid"
              }
              subtitle={
                selectedTemplate === "rectangle"
                  ? "Classic rectangular slots with a larger bottom white border for the 13×19 layout."
                  : selectedTemplate === "square"
                  ? "Square photo frames with a wide lower white margin, keeping the same 13×19 page size."
                  : "Tall strip-style polaroids with a thicker bottom border inside the same 13×19 section."
              }
              type={selectedTemplate}
              containerRef={previewRef}
              style={previewExportStyles}
            />
          </div>
        )}
      </div>
    </div>
  );
}
