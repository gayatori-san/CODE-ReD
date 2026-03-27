import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map as MapIcon, 
  Navigation, 
  Star, 
  Info, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Users,
  Bus,
  ShieldAlert
} from 'lucide-react';

type ViewType = 'live' | 'planner' | 'ratings' | 'about';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('live');
  const [eta, setEta] = useState(7);
  const [tickets, setTickets] = useState(18);
  const [stats, setStats] = useState({ active: 24, green: 16, yellow: 6, red: 2 });
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [selectedSOS, setSelectedSOS] = useState<string | null>(null);
  
  // Planner state
  const [routeResult, setRouteResult] = useState<any>(null);
  
  // Ratings state
  const [ticketVerified, setTicketVerified] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Live updates
  useEffect(() => {
    const etaInterval = setInterval(() => {
      setEta(prev => {
        const next = prev - 1;
        return next <= 1 ? 7 + Math.floor(Math.random() * 5) : next;
      });
    }, 5000);

    const ticketInterval = setInterval(() => {
      setTickets(prev => {
        const delta = Math.random() > 0.6 ? 1 : 0;
        return Math.min(40, prev + delta);
      });
    }, 4000);

    const statsInterval = setInterval(() => {
      const a = 22 + Math.floor(Math.random() * 4);
      const g = Math.floor(a * 0.65);
      const y = Math.floor(a * 0.25);
      const r = a - g - y;
      setStats({ active: a, green: g, yellow: y, red: r });
    }, 8000);

    return () => {
      clearInterval(etaInterval);
      clearInterval(ticketInterval);
      clearInterval(statsInterval);
    };
  }, []);

  const planRoute = () => {
    const pref = (document.getElementById('pref') as HTMLSelectElement).value;
    const data: any = {
      'least-crowd': { eta: '22 min', crowd: 'GREEN', bus: 'BUS-17', stops: 4, steps: [
        { t: 'Board at Pimpri', d: 'BUS-17 arriving in 4 min · Platform 2' },
        { t: 'Ride to Akurdi', d: '~8 min · Green zone · 6 passengers' },
        { t: 'Change at Shivajinagar', d: 'Transfer to BUS-42 for FC Road' },
        { t: 'Arrive at Swargate', d: 'ETA 22 min total · Final stop' },
      ]},
      'fastest': { eta: '18 min', crowd: 'YELLOW', bus: 'BUS-05', stops: 3, steps: [
        { t: 'Board at Pimpri', d: 'BUS-05 · Direct route · Departing in 2 min' },
        { t: 'Express via FC Road', d: '~12 min · Yellow zone · Some standing' },
        { t: 'Arrive at Swargate', d: 'ETA 18 min total' },
      ]},
      'fewest-stops': { eta: '20 min', crowd: 'GREEN', bus: 'BUS-42', stops: 2, steps: [
        { t: 'Board at Pimpri', d: 'BUS-42 · 2-stop express' },
        { t: 'Arrive at Swargate', d: 'Direct · ETA 20 min · Comfortable' },
      ]},
    };
    setRouteResult(data[pref]);
  };

  const submitRating = () => {
    setRatingSuccess(true);
    setTimeout(() => setRatingSuccess(false), 3000);
  };

  const submitReport = () => {
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 4000);
  };

  const sendSOS = () => {
    setSosSent(true);
  };

  const closeSOS = () => {
    setIsSOSOpen(false);
    setTimeout(() => {
      setSosSent(false);
      setSelectedSOS(null);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[var(--border)] bg-[var(--bg)]/95 sticky top-0 z-50 backdrop-blur-md">
        <div className="text-xl md:text-2xl font-extrabold tracking-tighter">
          CODE<span className="text-[var(--accent)]">_RED</span>
        </div>
        <div className="hidden md:flex gap-1">
          {(['live', 'planner', 'ratings', 'about'] as ViewType[]).map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === view ? 'text-[var(--accent)] bg-[var(--surface2)]' : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
              {view === 'ratings' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--red)] align-super ml-1"></span>}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setIsSOSOpen(true)}
          className="px-4 py-2 bg-[var(--red)] text-white rounded-lg font-bold text-sm animate-pulse-red"
        >
          🆘 SOS
        </button>
      </nav>

      {/* MOBILE NAV (Visible on small screens) */}
      <div className="md:hidden flex justify-around p-2 border-b border-[var(--border)] bg-[var(--surface)]">
        {(['live', 'planner', 'ratings', 'about'] as ViewType[]).map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`p-2 rounded-lg transition-all ${activeView === view ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}
          >
            {view === 'live' && <MapIcon size={20} />}
            {view === 'planner' && <Navigation size={20} />}
            {view === 'ratings' && <Star size={20} />}
            {view === 'about' && <Info size={20} />}
          </button>
        ))}
      </div>

      {/* TICKER */}
      <div className="bg-[var(--surface)] border-y border-[var(--border)] py-2 overflow-hidden relative">
        <div className="flex gap-12 whitespace-nowrap animate-ticker">
          <TickerItems />
          <TickerItems />
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {activeView === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Buses Active" value={stats.active} color="var(--accent)" />
                <StatCard label="Green Routes" value={stats.green} color="var(--green)" />
                <StatCard label="Yellow Routes" value={stats.yellow} color="var(--yellow)" />
                <StatCard label="Red Routes" value={stats.red} color="var(--red)" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <SectionHeader title="Live Map" subtitle="GPS refresh every 5s · Route: Pimpri → Swargate" />
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden relative h-[480px]">
                    <div className="absolute inset-0 bg-[#0d1117]">
                      {/* Grid lines */}
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(var(--blue) 1px, transparent 1px), linear-gradient(90deg, var(--blue) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>
                      
                      {/* Roads */}
                      <div className="absolute inset-0">
                        <div className="absolute h-2.5 w-full bg-[var(--surface2)] top-[20%]"></div>
                        <div className="absolute h-2.5 w-full bg-[#1c2436] top-[38%]"></div>
                        <div className="absolute h-2.5 w-full bg-[var(--surface2)] top-[58%]"></div>
                        <div className="absolute h-2.5 w-full bg-[var(--surface2)] top-[78%]"></div>
                        <div className="absolute w-2.5 h-full bg-[var(--surface2)] left-[20%]"></div>
                        <div className="absolute w-2.5 h-full bg-[#1c2436] left-[45%]"></div>
                        <div className="absolute w-2.5 h-full bg-[var(--surface2)] left-[68%]"></div>
                        <div className="absolute w-2.5 h-full bg-[var(--surface2)] left-[85%]"></div>
                      </div>

                      {/* Route SVG */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polyline points="15,38 38,38 45,30 62,30 62,38 80,38" fill="none" stroke="var(--blue)" strokeWidth="0.8" strokeDasharray="2,1.5" opacity="0.7"/>
                      </svg>

                      {/* Stops */}
                      <StopDot top="36%" left="15%" label="Pimpri" />
                      <StopDot top="36%" left="38%" label="Akurdi" />
                      <StopDot top="28%" left="45%" label="Nigdi" />
                      <StopDot top="28%" left="62%" label="FC Road" />
                      <StopDot top="36%" left="80%" label="Swargate" />

                      {/* Bus */}
                      <div className="absolute w-5 h-5 bg-[var(--accent)] rounded-full border-2 border-white shadow-[0_0_0_6px_rgba(0,229,255,0.2)] z-20 animate-bus-move flex items-center justify-center">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-black font-mono text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">BUS-42</div>
                      </div>

                      {/* Map Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex gap-3 z-30">
                        <EtaChip label="ETA to your stop" value={eta} unit="min" />
                        <EtaChip label="Distance" value="3.2" unit="km" color="var(--green)" />
                        <EtaChip label="Traffic" value="MOD." unit="" color="var(--yellow)" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono mb-4">Crowd Monitor — BUS-42</h3>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-4xl font-extrabold font-mono">{tickets}</span>
                        <span className="text-[var(--muted)]">/ 40 tickets</span>
                      </div>
                      <div className="h-2 bg-[var(--surface2)] rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-1000" 
                          style={{ 
                            width: `${(tickets / 40) * 100}%`,
                            backgroundColor: tickets <= 20 ? 'var(--green)' : tickets <= 30 ? 'var(--yellow)' : 'var(--red)'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <CrowdZone color="green" active={tickets <= 20} name="Green Zone" desc="0–20 tickets · Comfortable" count={tickets <= 20 ? tickets : '—'} />
                      <CrowdZone color="yellow" active={tickets > 20 && tickets <= 30} name="Yellow Zone" desc="21–30 tickets · Limited seats" count={tickets > 20 && tickets <= 30 ? tickets : '—'} />
                      <CrowdZone color="red" active={tickets > 30} name="Red Zone" desc="31–40 tickets · Overcrowded" count={tickets > 30 ? tickets : '—'} />
                    </div>
                  </div>

                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono mb-4">Nearby Buses</h3>
                    <div className="space-y-2">
                      <BusItem num="42" route="Pimpri → Swargate" eta="7 min" color="var(--green)" />
                      <BusItem num="17" route="Pimpri → Shivajinagar" eta="4 min" color="var(--green)" />
                      <BusItem num="88" route="Wakad → Hinjewadi" eta="11 min" color="var(--yellow)" />
                      <BusItem num="05" route="Chinchwad → Katraj" eta="18 min" color="var(--red)" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'planner' && (
            <motion.div
              key="planner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <SectionHeader title="Plan Your Route" subtitle="Real-time ETA + crowd-aware routing" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 h-fit">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono mb-4">Route Details</h3>
                  <div className="space-y-4">
                    <InputGroup label="From">
                      <select className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg p-3 text-sm outline-none focus:border-[var(--accent)] transition-all">
                        <option>Pimpri</option><option>Chinchwad</option><option>Akurdi</option>
                        <option>Nigdi</option><option>Wakad</option><option>Hinjewadi</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="To">
                      <select className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg p-3 text-sm outline-none focus:border-[var(--accent)] transition-all">
                        <option>Swargate</option><option>Shivajinagar</option><option>FC Road</option>
                        <option>Katraj</option><option>Hadapsar</option><option>Kothrud</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="Preference">
                      <select id="pref" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg p-3 text-sm outline-none focus:border-[var(--accent)] transition-all">
                        <option value="least-crowd">Least Crowded</option>
                        <option value="fastest">Fastest ETA</option>
                        <option value="fewest-stops">Fewest Stops</option>
                      </select>
                    </InputGroup>
                    <button onClick={planRoute} className="w-full py-3 bg-[var(--accent)] text-black font-bold rounded-lg hover:opacity-90 transition-all">
                      Find Best Route →
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  {routeResult ? (
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono mb-4">Recommended Route</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-[var(--surface2)] rounded-xl">
                        <RouteStat label="Total ETA" value={routeResult.eta} color="var(--accent)" />
                        <RouteStat label="Crowd Level" value={routeResult.crowd} color={routeResult.crowd === 'GREEN' ? 'var(--green)' : 'var(--yellow)'} />
                        <RouteStat label="Bus No." value={routeResult.bus} />
                        <RouteStat label="Stops" value={routeResult.stops} />
                      </div>
                      <div className="space-y-6">
                        {routeResult.steps.map((step: any, i: number) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-black font-bold flex items-center justify-center shrink-0 font-mono text-xs">{i + 1}</div>
                            <div>
                              <div className="font-bold text-sm">{step.t}</div>
                              <div className="text-xs text-[var(--muted)] mt-1">{step.d}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center">
                      <div className="text-4xl mb-4">🗺️</div>
                      <div className="font-bold mb-1">Select your stops</div>
                      <div className="text-sm text-[var(--muted)]">Real-time crowd and ETA data will appear here</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'ratings' && (
            <motion.div
              key="ratings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <SectionHeader title="Rate & Report" subtitle="ETIM-verified · Ticket ID required" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono mb-4">Rate Your Trip</h3>
                  <div className="space-y-4">
                    <InputGroup label="Ticket ID">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. TK-2026-00482" 
                          className="flex-1 bg-[var(--surface2)] border border-[var(--border)] rounded-lg p-3 text-sm outline-none focus:border-[var(--accent)] transition-all"
                        />
                        <button onClick={() => setTicketVerified(true)} className="px-4 bg-[var(--accent)] text-black font-bold rounded-lg text-xs">Verify</button>
                      </div>
                    </InputGroup>

                    {ticketVerified ? (
                      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                        <RatingSection label="Cleanliness" />
                        <RatingSection label="Driver Behaviour" />
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono">Tags</label>
                          <div className="flex flex-wrap gap-2">
                            {['AC Working', 'On Time', 'Smooth Ride', 'Overcrowded', 'Seat Available', 'Rash Driving'].map(tag => (
                              <button key={tag} className="px-3 py-1.5 rounded-full border border-[var(--border)] text-[10px] font-bold text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">{tag}</button>
                            ))}
                          </div>
                        </div>
                        <button onClick={submitRating} className="w-full py-3 bg-[var(--accent)] text-black font-bold rounded-lg">Submit Rating</button>
                        {ratingSuccess && <div className="p-3 bg-[var(--green)]/10 border border-[var(--green)] rounded-lg text-[var(--green)] text-sm font-bold flex items-center gap-2"><CheckCircle2 size={16} /> Rating submitted. Thank you!</div>}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--muted)]">Enter your ticket ID to unlock the rating form.</p>
                    )}
                  </div>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono mb-4">Discreet Harassment Report</h3>
                  <p className="text-xs text-[var(--muted)] mb-6 leading-relaxed">Your report is automatically tagged with Bus ID, Route, and Timestamp. This is secure and confidential.</p>
                  <div className="space-y-4">
                    <InputGroup label="Bus Number">
                      <input type="text" placeholder="e.g. 42" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg p-3 text-sm outline-none focus:border-[var(--accent)] transition-all" />
                    </InputGroup>
                    <InputGroup label="Incident Type">
                      <select className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg p-3 text-sm outline-none focus:border-[var(--accent)] transition-all">
                        <option>Verbal harassment</option>
                        <option>Physical harassment</option>
                        <option>Theft / pickpocket</option>
                        <option>Unsafe driving</option>
                        <option>Other emergency</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="Brief Description (optional)">
                      <textarea rows={3} placeholder="Describe the incident..." className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg p-3 text-sm outline-none focus:border-[var(--accent)] transition-all resize-none"></textarea>
                    </InputGroup>
                    <button onClick={submitReport} className="w-full py-3 bg-[var(--accent)] text-black font-bold rounded-lg">Send Report Securely</button>
                    {reportSuccess && <div className="p-3 bg-[var(--green)]/10 border border-[var(--green)] rounded-lg text-[var(--green)] text-sm font-bold flex items-center gap-2"><ShieldAlert size={16} /> Report sent to authorities. Stay safe.</div>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <SectionHeader title="About CODE_RED" subtitle="TECHNOVA 2026 · Team CODE_RED" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono mb-4">The Problem</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">Passengers had no way to know if a bus was crowded before boarding. Long waits, overcrowded buses, zero real-time data — public transport was a guessing game.</p>
                  <div className="flex gap-4">
                    <div className="flex-1 p-4 bg-[var(--surface2)] rounded-xl text-center">
                      <div className="text-2xl font-extrabold text-[var(--red)]">40%</div>
                      <div className="text-[10px] text-[var(--muted)] mt-1">Commute time wasted waiting</div>
                    </div>
                    <div className="flex-1 p-4 bg-[var(--surface2)] rounded-xl text-center">
                      <div className="text-2xl font-extrabold text-[var(--red)]">3×</div>
                      <div className="text-[10px] text-[var(--muted)] mt-1">More frustration without live info</div>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono mb-4">The Solution</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">BusTrack connects the ticket machine to a live dashboard via an IoT/internet module. Each ticket purchase updates the crowd counter, which is sent to a central server — passengers check crowd status online before boarding.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Implementation Roadmap</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PhaseCard badge="✓ PHASE 1" status="done" title="MVP Launch" items={['Install GPS modules on buses', 'Build live map with real-time location', 'Basic ETA calculation']} />
                  <PhaseCard badge="► PHASE 2" status="active" title="Smart Features" items={['Integrate traffic APIs', 'Push notifications for delays', 'Route visualization overlay']} />
                  <PhaseCard badge="○ PHASE 3" status="upcoming" title="Scale & Refine" items={['ML model for ETA improvement', 'Multi-route support', 'Admin dashboard']} />
                </div>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono mb-4">Tech Stack</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TechItem label="MAP & ROUTING" desc="Google Maps Platform · Directions API · Leaflet.js" />
                  <TechItem label="GPS & STREAMING" desc="MQTT Protocol · WebSockets · Firebase Realtime DB" />
                  <TechItem label="BACKEND" desc="Node.js + Express · PostgreSQL · Redis" />
                  <TechItem label="FRONTEND" desc="React Native (mobile) · React.js (web)" />
                  <TechItem label="NOTIFICATIONS" desc="Firebase Cloud Messaging · Twilio SMS" />
                  <TechItem label="TRAFFIC & ETA" desc="Google Maps Traffic Layer · HERE Traffic API" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* SOS MODAL */}
      <AnimatePresence>
        {isSOSOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[var(--surface)] border border-[var(--red)] rounded-3xl p-8 max-w-md w-full shadow-[0_0_60px_rgba(255,23,68,0.3)]"
            >
              {!sosSent ? (
                <>
                  <div className="text-2xl font-extrabold text-[var(--red)] mb-2 flex items-center gap-2">
                    <ShieldAlert size={28} /> SOS Emergency
                  </div>
                  <p className="text-sm text-[var(--muted)] mb-6 leading-relaxed">Send an immediate alert to the transport control centre. Your GPS location, Bus ID, and timestamp will be automatically attached.</p>
                  <div className="space-y-2 mb-8">
                    {['Accident / Breakdown', 'Harassment / Safety threat', 'Medical Emergency', 'Vehicle Issue'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setSelectedSOS(type)}
                        className={`w-full flex items-center gap-3 p-4 border rounded-xl font-bold text-sm transition-all ${
                          selectedSOS === type ? 'border-[var(--red)] bg-[var(--red)]/10' : 'border-[var(--border)] hover:border-[var(--red)]'
                        }`}
                      >
                        <span className="text-xl">{type.includes('Accident') ? '🔥' : type.includes('Harassment') ? '😰' : type.includes('Medical') ? '🚑' : '🔧'}</span>
                        {type}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={closeSOS} className="flex-1 py-3 border border-[var(--border)] rounded-xl font-bold text-[var(--muted)]">Cancel</button>
                    <button onClick={sendSOS} className="flex-1 py-3 bg-[var(--red)] text-white rounded-xl font-bold tracking-wider">SEND ALERT</button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-[var(--green)] mb-2">Alert Sent</h3>
                  <p className="text-sm text-[var(--muted)] mb-6">Authorities notified. Help is on the way.<br/>Response ETA: ~30 minutes</p>
                  <button onClick={closeSOS} className="w-full py-3 border border-[var(--border)] rounded-xl font-bold text-[var(--muted)]">Close</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TickerItems() {
  return (
    <>
      <span className="text-[10px] font-mono text-[var(--muted)]">BUS-42 (Nigdi → Swargate): <span className="text-[var(--accent)]">Crowd — GREEN ✓</span></span>
      <span className="text-[10px] font-mono text-[var(--muted)]">BUS-17 (Pimpri → Shivajinagar): <span className="text-[var(--accent)]">ETA 4 min</span></span>
      <span className="text-[10px] font-mono text-[var(--muted)]">BUS-88 (Wakad → Hinjewadi): <span className="text-[var(--accent)]">Crowd — YELLOW ⚠</span></span>
      <span className="text-[10px] font-mono text-[var(--muted)]">BUS-05 (Chinchwad → Katraj): <span className="text-[var(--accent)]">Slight delay – traffic on FC Road</span></span>
      <span className="text-[10px] font-mono text-[var(--muted)] text-[var(--red)] font-bold">ALERT: BUS-33 breakdown reported — alternate via BUS-61</span>
    </>
  );
}

function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4">
      <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">{label}</div>
      <div className="text-3xl font-extrabold mt-1" style={{ color }}>{value}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <h2 className="text-xl font-extrabold">{title}</h2>
      <span className="text-[10px] font-mono text-[var(--muted)]">{subtitle}</span>
    </div>
  );
}

function StopDot({ top, left, label }: { top: string, left: string, label: string }) {
  return (
    <div className="group absolute w-2.5 h-2.5 bg-[var(--yellow)] rounded-full border-2 border-black z-10 cursor-pointer" style={{ top, left }}>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-[var(--yellow)] text-[9px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{label}</div>
    </div>
  );
}

function EtaChip({ label, value, unit, color }: { label: string, value: string | number, unit: string, color?: string }) {
  return (
    <div className="flex-1 bg-black/85 backdrop-blur-md border border-[var(--border)] rounded-xl p-3">
      <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--muted)]">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-extrabold" style={{ color: color || 'var(--accent)' }}>{value}</span>
        <span className="text-[10px] text-[var(--muted)]">{unit}</span>
      </div>
    </div>
  );
}

function CrowdZone({ color, active, name, desc, count }: { color: string, active: boolean, name: string, desc: string, count: string | number }) {
  const colors: any = {
    green: 'text-[var(--green)] bg-[var(--green)]/5',
    yellow: 'text-[var(--yellow)] bg-[var(--yellow)]/5',
    red: 'text-[var(--red)] bg-[var(--red)]/5'
  };
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${active ? `border-current ${colors[color]}` : 'border-transparent opacity-50'}`}>
      <div className={`w-2.5 h-2.5 rounded-full bg-current`}></div>
      <div className="flex-1">
        <div className="text-xs font-bold">{name}</div>
        <div className="text-[10px] text-[var(--muted)]">{desc}</div>
      </div>
      <div className="font-mono text-sm font-bold">{count}</div>
    </div>
  );
}

function BusItem({ num, route, eta, color }: { num: string, route: string, eta: string, color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--surface2)] rounded-xl hover:bg-[var(--border)] transition-all cursor-pointer">
      <div className="bg-[var(--blue)] text-white font-mono font-bold text-xs px-2 py-1 rounded min-w-[40px] text-center">{num}</div>
      <div className="flex-1 text-xs font-medium">{route}</div>
      <div className="text-xs font-mono text-[var(--accent)]">{eta}</div>
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
    </div>
  );
}

function RouteStat({ label, value, color }: { label: string, value: string | number, color?: string }) {
  return (
    <div>
      <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--muted)]">{label}</div>
      <div className="text-xl font-extrabold" style={{ color }}>{value}</div>
    </div>
  );
}

function InputGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono">{label}</label>
      {children}
    </div>
  );
}

function RatingSection({ label }: { label: string }) {
  const [rating, setRating] = useState(0);
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <button 
            key={star} 
            onClick={() => setRating(star)}
            className={`text-2xl transition-all ${rating >= star ? 'text-[var(--yellow)] opacity-100' : 'text-[var(--muted)] opacity-40 hover:scale-110'}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

function PhaseCard({ badge, status, title, items }: { badge: string, status: 'done' | 'active' | 'upcoming', title: string, items: string[] }) {
  const statusStyles = {
    done: 'bg-[var(--green)]/15 text-[var(--green)]',
    active: 'bg-[var(--accent)]/15 text-[var(--accent)]',
    upcoming: 'bg-[var(--muted)]/15 text-[var(--muted)]'
  };
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
      <div className={`inline-block px-2 py-1 rounded text-[9px] font-bold font-mono tracking-wider mb-3 ${statusStyles[status]}`}>{badge}</div>
      <div className="font-bold text-sm mb-3">{title}</div>
      <div className="space-y-1.5">
        {items.map(item => (
          <div key={item} className="text-[11px] text-[var(--muted)] flex gap-2">
            <span className="text-[var(--accent)]">→</span> {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function TechItem({ label, desc }: { label: string, desc: string }) {
  return (
    <div className="p-4 bg-[var(--surface2)] rounded-xl">
      <div className="text-[9px] text-[var(--accent)] font-mono font-bold mb-1.5 tracking-wider">{label}</div>
      <div className="text-[11px] text-[var(--muted)] leading-relaxed">{desc}</div>
    </div>
  );
}
