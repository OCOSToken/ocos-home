import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Search, Layers, Sparkles, Globe2, Info, BarChart3, PlayCircle, ShieldCheck, Wallet, Zap, Cpu, Gamepad2, FlaskConical, BookOpenText, Headphones, Activity, FileText, Users, GitBranch, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, ResponsiveContainer, Tooltip as RTooltip } from "recharts";

// -----------------------------
// OCOS Home — 21 Platform Hub
// -----------------------------
// Styling notes:
// - Tailwind CSS utility classes
// - Dark, premium feel (deep charcoal + sapphire accents)
// - Animated cards with framer-motion
// - Modal with rich content + optional live-stats placeholders

const BRAND = {
  bg: "bg-[radial-gradient(1200px_600px_at_80%_-10%,#0a0f1f_0%,#070b16_35%,#05070f_70%,#05060c_100%)]",
  card: "backdrop-blur-xl bg-white/5 border-white/10",
  ring: "focus-visible:ring-2 focus-visible:ring-sky-400/60",
  glow: "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,170,255,0.25)]",
  accent: "from-sky-500/20 via-indigo-500/10 to-transparent",
};

const ALL_PLATFORMS = [
  { key: "crypto", title: "OCOS Crypto", url: "https://crypto.ocos.io", icon: <BarChart3 className="w-5 h-5" />, tag: "Market & Price", blurb: "Canlı qiymət qrafikləri, həcmlər və market dərinliyi." },
  { key: "trc20", title: "TRC-20 OCOS", url: "https://trc20.ocos.io", icon: <GitBranch className="w-5 h-5" />, tag: "TRON", blurb: "TRC-20 şəbəkəsində əməliyyatlar və analitika." },
  { key: "app", title: "OCOS App", url: "https://app.ocos.io", icon: <Zap className="w-5 h-5" />, tag: "Web DApp", blurb: "Bir-bə bir ticarət, staking və airdrop modul sistemi." },
  { key: "game", title: "OCOS Game", url: "https://game.ocos.io", icon: <Gamepad2 className="w-5 h-5" />, tag: "Play", blurb: "Web3 oyunları, NFT-lər və turnirlər." },
  { key: "ai", title: "OCOS AI", url: "https://ai.ocos.io", icon: <Cpu className="w-5 h-5" />, tag: "AI", blurb: "AI Film, botlar və ağıllı analitika mərkəzi." },
  { key: "wallet", title: "OCOS Wallet", url: "https://wallet.ocos.io", icon: <Wallet className="w-5 h-5" />, tag: "Non-Custodial", blurb: "Çox-zəncirli kripto cüzdanı və QR ödənişləri." },
  { key: "dao", title: "OCOS DAO", url: "https://dao.ocos.io", icon: <Users className="w-5 h-5" />, tag: "Governance", blurb: "İcma səsvermələri və təkliflər sistemi." },
  { key: "dex", title: "OCOS DEX", url: "https://dex.ocos.io", icon: <Layers className="w-5 h-5" />, tag: "DeFi", blurb: "Likvidlik hovuzları, swap və farm alətləri." },
  { key: "cex", title: "OCOS CEX", url: "https://cex.ocos.io", icon: <Globe2 className="w-5 h-5" />, tag: "Exchange", blurb: "Mərkəzləşdirilmiş ticarət üçün qapı." },
  { key: "explorer", title: "OCOS Explorer", url: "https://explorer.ocos.io", icon: <Info className="w-5 h-5" />, tag: "Scan", blurb: "Bloklar, əməliyyatlar və smart-kontaktlar." },
  { key: "bridge", title: "OCOS Bridge", url: "https://bridge.ocos.io", icon: <GitBranch className="w-5 h-5" />, tag: "Cross-Chain", blurb: "22+ şəbəkə arası sürətli körpüləmə." },
  { key: "staking", title: "OCOS Staking", url: "https://staking.ocos.io", icon: <ShieldCheck className="w-5 h-5" />, tag: "Earn", blurb: "Stake et, ödüllər qazan və təsdiqlə." },
  { key: "airdrop", title: "OCOS Airdrop", url: "https://airdrop.ocos.io", icon: <Sparkles className="w-5 h-5" />, tag: "Rewards", blurb: "Airdrop kampaniyaları və missiyalar." },
  { key: "nft", title: "OCOS NFT", url: "https://nft.ocos.io", icon: <PlayCircle className="w-5 h-5" />, tag: "Collectibles", blurb: "NFT bazarı və yaradıcı ekosistem." },
  { key: "labs", title: "OCOS Labs", url: "https://labs.ocos.io", icon: <FlaskConical className="w-5 h-5" />, tag: "R&D", blurb: "Eksperimentlər, PoC və innovasiya." },
  { key: "docs", title: "OCOS Docs", url: "https://docs.ocos.io", icon: <BookOpenText className="w-5 h-5" />, tag: "Docs", blurb: "Ağ kağızlar, API-lər və inteqrasiya bələdçiləri." },
  { key: "support", title: "OCOS Support", url: "https://support.ocos.io", icon: <Headphones className="w-5 h-5" />, tag: "Helpdesk", blurb: "Bilet sistemi və canlı həll mərkəzi." },
  { key: "status", title: "OCOS Status", url: "https://status.ocos.io", icon: <Activity className="w-5 h-5" />, tag: "Uptime", blurb: "Real-time xidmət statusları və hadisələr." },
  { key: "blog", title: "OCOS Blog", url: "https://blog.ocos.io", icon: <FileText className="w-5 h-5" />, tag: "News", blurb: "Yeniliklər, məqalələr və elanlar." },
  { key: "careers", title: "OCOS Careers", url: "https://careers.ocos.io", icon: <Users className="w-5 h-5" />, tag: "Hiring", blurb: "Komandamıza qoşul – açıq vakansiyalar." },
  { key: "governance", title: "OCOS Governance", url: "https://governance.ocos.io", icon: <ShieldCheck className="w-5 h-5" />, tag: "Protocol", blurb: "Protokol qaydaları və yönetişim modulları." },
];

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-white/60">{label}</span>
      <div className="flex items-end gap-2">
        <span className="text-lg md:text-xl font-semibold tracking-tight text-white">{value}</span>
        {hint && <span className="text-[10px] text-emerald-400/80">{hint}</span>}
      </div>
    </div>
  );
}

const sampleChart = Array.from({ length: 24 }).map((_, i) => ({ t: i, v: 60 + Math.round(20 * Math.sin(i / 2) + (Math.random() * 10)) }));

export default function OCOSHome() {
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [tab, setTab] = useState("about");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_PLATFORMS;
    return ALL_PLATFORMS.filter(p => p.title.toLowerCase().includes(q) || p.key.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
  }, [query]);

  const active = useMemo(() => ALL_PLATFORMS.find(p => p.key === openKey) || null, [openKey]);

  return (
    <TooltipProvider>
      <div className={`min-h-screen ${BRAND.bg} text-white selection:bg-sky-500/40`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400/80 to-indigo-500/80 shadow-lg" />
              <span className="font-semibold tracking-wide">OCOS</span>
            </div>
            <Badge className="bg-white/10 text-white border-white/10">21 Platforms</Badge>
            <div className="ml-auto w-full max-w-sm">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <Input
                  placeholder="Axtar: AI, DEX, Wallet…"
                  className={`pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 ${BRAND.ring}`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl md:text-5xl font-extrabold leading-tight">
                  Real həyatdan öyrənə bilmədiklərinizi,
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-indigo-300"> virtual həyatda öyrənin.</span>
                </motion.h1>
                <p className="mt-4 text-white/70 max-w-xl">
                  OCOS — 21 platformadan ibarət multi‑chain ekosistem: ticarət, AI, oyun, DAO, cüzdan və daha çoxu. Hamısı premium dizayn və
                  institusional səviyyəli arxitektura ilə.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Kpi label="Şəbəkələr" value="22+" hint="Cross‑chain" />
                  <Kpi label="Uptime" value="> 99.9%" hint="Status" />
                  <Kpi label="TPS" value="~3,500" hint="DeFi/DApp" />
                </div>
              </div>
              <div>
                <Card className={`${BRAND.card} ${BRAND.glow}`}>
                  <CardHeader className="pb-0">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <BarChart3 className="w-4 h-4" /> Canlı Eko Qrafik
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sampleChart} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                          <RTooltip contentStyle={{ background: "rgba(10,14,25,0.9)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }} />
                          <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-white/70">
                      <div>
                        <div className="text-white font-semibold">Liquidity</div>
                        <div>$14.4B</div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">24h Vol</div>
                        <div>$0.00</div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Active Users</div>
                        <div>0</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          {/* Decorative gradient */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-500/10 via-indigo-600/5 to-transparent" />
        </section>

        {/* Platforms Grid */}
        <section className="py-6 md:py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Platformalar</h2>
              <div className="text-white/60 text-sm">{filtered.length} / {ALL_PLATFORMS.length} göstərilir</div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p, idx) => (
                <motion.button
                  key={p.key}
                  onClick={() => { setOpenKey(p.key); setTab("about"); }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  className={`${BRAND.card} ${BRAND.glow} group text-left rounded-2xl border p-4 md:p-5 hover:border-sky-400/40 hover:bg-white/10 ${BRAND.ring}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/30 to-indigo-600/30 grid place-items-center">
                      {p.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{p.title}</div>
                      <div className="text-xs text-white/60 truncate">{p.url.replace("https://", "")}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-white/70 line-clamp-2">{p.blurb}</div>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="outline" className="border-white/15 text-white/70">{p.tag}</Badge>
                    <span className="text-xs text-white/50 inline-flex items-center gap-1">Daha çox <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-10">
          <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-white/60 flex flex-col md:flex-row gap-3 md:gap-6 items-center md:items-start justify-between">
            <div>© {new Date().getFullYear()} OCOS — Bütün hüquqlar qorunur.</div>
            <div className="flex gap-4">
              <a href="https://docs.ocos.io" target="_blank" className="hover:text-white/90">Sənədlər</a>
              <a href="https://status.ocos.io" target="_blank" className="hover:text-white/90">Status</a>
              <a href="https://support.ocos.io" target="_blank" className="hover:text-white/90">Dəstək</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setOpenKey(null)}>
        <DialogContent className={`max-w-3xl sm:max-w-4xl ${BRAND.card} border-white/10 text-white`}> 
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/30 to-indigo-600/30 grid place-items-center">
                {active?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-lg leading-tight truncate">{active?.title}</div>
                <a href={active?.url} target="_blank" className="text-xs text-sky-300 inline-flex items-center gap-1 hover:underline">
                  {active?.url} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white" onClick={() => setOpenKey(null)}>
                <X className="w-5 h-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={tab} onValueChange={setTab} className="mt-2">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="about">Təsvir</TabsTrigger>
              <TabsTrigger value="stats">Statistika</TabsTrigger>
              <TabsTrigger value="media">Logo/Şəkil</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Card className={`${BRAND.card} ${BRAND.glow}`}>
                    <CardContent className="p-5 text-sm text-white/80 leading-6">
                      <p className="mb-3">{active?.blurb} Bu platforma OCOS ekosistemində kritik bir hissədir və təhlükəsiz, miqyaslana bilən infrastruktura əsaslanır.</p>
                      <ul className="list-disc list-inside space-y-1 text-white/75">
                        <li>Premium UI/UX və sürətli performans</li>
                        <li>Multi‑chain uyumluluq (22+ şəbəkə)</li>
                        <li>Auditoriya yönümlü analitika və hesabatlar</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4">
                  <Card className={`${BRAND.card} ${BRAND.glow}`}>
                    <CardContent className="p-4">
                      <div className="text-xs text-white/60 mb-2">Qısa Bələdçi</div>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-white/80">
                        <li>Sayta daxil ol və cüzdanını qoş</li>
                        <li>Təhlükəsizlik parametrlərini yoxla</li>
                        <li>Modulları sına və geribildirim ver</li>
                      </ol>
                    </CardContent>
                  </Card>
                  <Button asChild className="w-full">
                    <a href={active?.url} target="_blank" rel="noreferrer">Sayta keç</a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              <Card className={`${BRAND.card} ${BRAND.glow}`}>
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-2 text-white/80 text-sm"><BarChart3 className="w-4 h-4"/> Canlı göstəricilər (demo)</div>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sampleChart} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                            <RTooltip contentStyle={{ background: "rgba(10,14,25,0.9)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }} />
                            <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Kpi label="TVL" value="$127.4M" />
                      <Kpi label="24h Vol" value="$18.2M" />
                      <Kpi label="Aktiv istifadəçi" value="42,713" />
                      <Kpi label="Qovşaqlar" value="21/21" hint="Validator" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className={`${BRAND.card} ${BRAND.glow}`}>
                  <CardContent className="p-5">
                    <div className="text-xs text-white/60 mb-2">Logo Yer Tutucu</div>
                    <div className="h-28 rounded-xl bg-gradient-to-br from-white/10 to-white/5 grid place-items-center border border-white/10">
                      <span className="text-white/60">{active?.title} Logo</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className={`${BRAND.card} ${BRAND.glow}`}>
                  <CardContent className="p-5">
                    <div className="text-xs text-white/60 mb-2">Vizual Yer Tutucu</div>
                    <div className="h-28 rounded-xl bg-gradient-to-br from-indigo-500/10 to-sky-500/10 border border-white/10" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
