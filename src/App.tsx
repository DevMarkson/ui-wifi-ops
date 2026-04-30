import { useState, useMemo, useRef } from 'react'
import emailjs from '@emailjs/browser'
import './index.css'
import './components/components.css'
import type { Hotspot, NightPlan } from './types'
import Navbar from './components/Navbar'
import TopBar from './components/TopBar'
import HotspotCard from './components/HotspotCard'
import Modal from './components/Modal'
import Toast from './components/Toast'

// Sample Data
const INITIAL_HOTSPOTS: Hotspot[] = [
    {
        id: 1,
        name: "Jaja",
        ssid: "Jaja_Accgr1",
        icon: "🏫",
        category: "halls",
        location: "Opposite Jaja Clinic",
        status: "up",
        speed: "Fast",
        coverage: "Common Room, Block A",
        note: "Best signal is near the waiting arena inside the clinic.",
        steps: [
            "Connect to Jaja_Accgr1",
            "Wait for login page",
            "Enter matric number and password"
        ],
        lastUpdated: "4 mins ago"
    },
    {
        id: 2,
        name: "Kenneth Dike Library",
        ssid: "KDL_Main_WiFi",
        icon: "📚",
        category: "library",
        location: "Central Campus",
        status: "slow",
        speed: "Moderate",
        coverage: "Reading Room 1 & 2",
        note: "Avoid during peak hours (10am-2pm).",
        steps: [
            "Connect to KDL_Main_WiFi",
            "Navigate to 1.1.1.1 if portal doesn't show",
            "Login with library credentials"
        ],
        lastUpdated: "12 mins ago"
    },
    {
        id: 3,
        name: "Faculty of Arts",
        ssid: "Arts_AP_04",
        icon: "🎨",
        category: "faculty",
        location: "Near Theatre Arts",
        status: "down",
        speed: "N/A",
        coverage: "Department of English",
        note: "Router has been unresponsive since morning.",
        steps: [],
        lastUpdated: "1 hour ago"
    },
    {
        id: 4,
        name: "Kuti Hall",
        ssid: "Kuti_Hall_WiFi",
        icon: "🏢",
        category: "halls",
        location: "Student Residential Area",
        status: "up",
        speed: "Fast",
        coverage: "Blocks B and C",
        note: "Recently upgraded bandwidth.",
        steps: [
            "Connect to Kuti_Hall_WiFi",
            "Accept security certificate if prompted",
            "Login with portal details"
        ],
        lastUpdated: "22 mins ago"
    },
    {
        id: 5,
        name: "Tech Faculty",
        ssid: "Tech_Staff_WiFi",
        icon: "⚙️",
        category: "faculty",
        location: "Faculty of Technology",
        status: "up",
        speed: "Fast",
        coverage: "Lecture Theater 1",
        note: "Password may be required from department office.",
        steps: [
            "Connect to Tech_Staff_WiFi",
            "Obtain department code",
            "Login via captive portal"
        ],
        lastUpdated: "45 mins ago"
    },
    {
        id: 6,
        name: "Mellanby Hall",
        ssid: "Mellanby_WiFi",
        icon: "🏰",
        category: "halls",
        location: "Near SUB",
        status: "unknown",
        speed: "N/A",
        coverage: "Courtyard",
        note: "No recent reports from this location.",
        steps: [],
        lastUpdated: "2 days ago"
    }
];

const NIGHT_PLANS: NightPlan[] = [
    {
        provider: "MTN Night Plan",
        price: "₦50",
        volume: "500MB",
        time: "12am - 5am",
        code: "*406*3#"
    },
    {
        provider: "Airtel Night",
        price: "₦25",
        volume: "250MB",
        time: "12am - 5am",
        code: "*312#"
    },
    {
        provider: "Glo Night",
        price: "₦100",
        volume: "1GB",
        time: "12am - 5am",
        code: "*312#"
    }
];

function App() {
  const [currentTab, setCurrentTab] = useState('directory');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const filteredHotspots = useMemo(() => {
    return INITIAL_HOTSPOTS.filter(h => {
      const matchesFilter = currentFilter === 'all' || h.category === currentFilter;
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           h.ssid.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [currentFilter, searchQuery]);

  const workingCount = useMemo(() => INITIAL_HOTSPOTS.filter(h => h.status === 'up').length, []);

  const addToast = (msg: string) => {
    setToasts(prev => [...prev, msg]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast("Code copied to clipboard");
  };

  return (
    <div className="app">
      <div className="backdrop-grid"></div>
      <TopBar />
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      <main className="main-content">
        {currentTab === 'directory' && (
          <section id="directory">
            <div className="hero">
                <h2 className="hero-title">WIFI STATUS ACROSS CAMPUS</h2>
                <p className="hero-subtitle">Low on data on campus? Find active school WiFi in seconds.</p>
                
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-value">{INITIAL_HOTSPOTS.length}</span>
                        <span className="stat-label">TOTAL HOTSPOTS</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value text-up">{workingCount}</span>
                        <span className="stat-label">WORKING NOW</span>
                    </div>

                </div>
            </div>

            <div className="controls-row">
                <div className="filter-group">
                    {['all', 'halls', 'faculty', 'library'].map(f => (
                      <button 
                        key={f}
                        className={`filter-btn ${currentFilter === f ? 'active' : ''}`}
                        onClick={() => setCurrentFilter(f)}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                </div>
                <div className="search-box">
                    <input 
                      type="text" 
                      placeholder="SEARCH LOCATION OR SSID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="hotspot-grid">
                {filteredHotspots.map(h => (
                  <HotspotCard 
                    key={h.id} 
                    hotspot={h} 
                    onConnect={(hotspot) => setSelectedHotspot(hotspot)} 
                  />
                ))}
            </div>
          </section>
        )}

        {currentTab === 'submit' && (
          <section id="submit" className="submit-section">
            {!isSubmitted ? (
              <>
                <div className="screen-header">
                    <span className="label-caps text-gold">CROWDSOURCED DATA</span>
                    <h2 className="screen-title">Submit a WiFi Hotspot</h2>
                    <p className="screen-subtitle">Help fellow students by providing accurate connectivity data for your location.</p>
                </div>

                <div className="submit-card">
                    <form className="submit-form" ref={formRef} onSubmit={async (e) => { 
                        e.preventDefault(); 
                        if (!formRef.current) return;
                        
                        setIsSubmitting(true);
                        
                        try {
                            await emailjs.sendForm(
                                import.meta.env.VITE_EMAILJS_SERVICE_ID, 
                                import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
                                formRef.current, 
                                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                            );
                            
                            setIsSubmitted(true); 
                        } catch (error) {
                            console.error("EmailJS Error:", error);
                            addToast("Failed to send submission. Please try again.");
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}>
                        <div className="form-group">
                            <label className="label-caps">LOCATION</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined">location_on</span>
                                <input type="text" name="location" placeholder="e.g. Jaja, CS Department" required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label-caps">WIFI NAME (SSID)</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined">router</span>
                                <input type="text" name="ssid" placeholder="e.g. Jaja_Accgr1" className="font-ssid" required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label-caps">EXACT SPOT DESCRIPTION</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined">info</span>
                                <input type="text" name="description" placeholder="e.g. Near common room, beside staircase" required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label-caps">CURRENT STATUS</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined">signal_cellular_alt</span>
                                <select name="status" required>
                                    <option value="working">Working</option>
                                    <option value="slow">Slow / Unstable</option>
                                    <option value="unsure">Not sure</option>
                                </select>
                                <span className="material-symbols-outlined select-arrow">arrow_drop_down</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label-caps">NOTES (OPTIONAL)</label>
                            <textarea name="notes" placeholder="e.g. Works better at night" rows={3}></textarea>
                        </div>

                        <button type="submit" className="btn-primary-submit" disabled={isSubmitting}>
                            <span className={`material-symbols-outlined ${isSubmitting ? 'spin' : ''}`}>
                                {isSubmitting ? 'sync' : 'publish'}
                            </span>
                            {isSubmitting ? 'SENDING...' : 'SUBMIT HOTSPOT'}
                        </button>
                    </form>
                </div>

                <div className="submit-footer">
                    <div className="spec-item">
                        <div className="dot green"></div>
                        <span className="spec-label">OPS_READY</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-label">VERIFICATION: REQ</span>
                    </div>
                </div>
              </>
            ) : (
              <div className="success-screen">
                <div className="success-icon-wrapper">
                    <div className="success-glow"></div>
                    <div className="success-icon-box">
                        <span className="material-symbols-outlined fill-icon">check_circle</span>
                    </div>
                    <div className="success-badge">
                        <span className="material-symbols-outlined">verified</span>
                    </div>
                </div>

                <div className="success-content">
                    <h1 className="success-title">Submission Received</h1>
                    <p className="success-message">Thanks for contributing. We'll verify and add it to the map if valid.</p>
                </div>

                <div className="success-meta-grid">
                    <div className="meta-item">
                        <span className="meta-label">STATUS</span>
                        <div className="meta-status">
                            <div className="dot yellow pulse"></div>
                            <span className="text-gold">Pending Review</span>
                        </div>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">QUEUE ID</span>
                        <span className="font-mono">#OPS-7729-X</span>
                    </div>
                </div>

                <div className="success-actions">
                    <button className="btn-home" onClick={() => { setIsSubmitted(false); setCurrentTab('directory'); }}>
                        <span className="material-symbols-outlined">home</span>
                        BACK TO HOME
                    </button>
                    <button className="btn-another" onClick={() => setIsSubmitted(false)}>
                        <span className="material-symbols-outlined">add_circle</span>
                        SUBMIT ANOTHER
                    </button>
                </div>

                <div className="success-footer-graphic">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgTIVAHuZNBIff9rfMr1eBSPgj8nkn1pV_MBSIwP96nL34ANLIfKwMN0rChHxUdoX9yo9TCEvpHDIElDhQeJiurB9POZgIMRqwB_qijdPf1DKc2JMEANySJwr_Ks5Wg0UnFiLGVjMunC3lCdEf0yQncQ8jMrE2asrBswrMkqHeAl68k9YiflYH-PiAHx2rHo1KtF9-3ykK5lj_SQMBd4S8CabFjIQkUT2JPJyUpd_JQUwfg3tA9RrfzIyUUVVtpk_19j65ZIWZr9E" alt="Abstract connection grid" />
                </div>
              </div>
            )}
          </section>
        )}

        {currentTab === 'auth' && (
          <section id="auth" className="auth-section">
            <div className="screen-header">
                <span className="label-caps text-gold">AUTHENTICATION PROTOCOL</span>
                <h2 className="screen-title">WiFi Login Guide</h2>
                <p className="screen-subtitle">Follow these operational steps to secure a high-bandwidth connection on the campus network backbone.</p>
            </div>
            
            <div className="auth-container">
                <div className="security-alert">
                    <span className="material-symbols-outlined alert-icon">warning</span>
                    <div className="alert-content">
                        <h4 className="alert-title">SECURITY ALERT</h4>
                        <p>Verify the URL before entering credentials. Legitimate captive portals will never ask for your email password or banking details. Report suspicious login pages via the Connect tab.</p>
                    </div>
                </div>

                <div className="timeline">
                    <div className="timeline-line"></div>
                    
                    <div className="timeline-step">
                        <div className="step-box">1</div>
                        <div className="step-card">
                            <h3 className="step-title">System Settings</h3>
                            <p className="step-desc">Navigate to your device's WiFi settings and locate the official SSID. Select the network to initiate the handshake.</p>
                            <div className="step-action">
                                <span className="material-symbols-outlined action-icon">settings</span>
                                <span className="action-text">Find WiFi in settings</span>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-step">
                        <div className="step-box">2</div>
                        <div className="step-card">
                            <h3 className="step-title">Portal Redirection</h3>
                            <p className="step-desc">Wait for the captive portal to trigger automatically. This is the gated entry to the campus intranet.</p>
                            <div className="step-action">
                                <span className="material-symbols-outlined action-icon">open_in_browser</span>
                                <span className="action-text">Connect to captive portal</span>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-step">
                        <div className="step-box">3</div>
                        <div className="step-card">
                            <h3 className="step-title">Credential Access</h3>
                            <p className="step-desc">Input your secure portal password. Ensure caps lock is off to prevent lockout attempts.</p>
                            <div className="step-action">
                                <span className="material-symbols-outlined action-icon">key</span>
                                <span className="action-text">Enter School Email Address as username</span>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-step">
                        <div className="step-box">4</div>
                        <div className="step-card">
                            <h3 className="step-title">Encryption Trust</h3>
                            <p className="step-desc">Input your secure portal password. This was sent by mis@stu.ui.edu.ng or you can search for "STUDENT NETWORK/INTERNET ACCESS" in your student email.</p>
                            <div className="step-action">
                                <span className="material-symbols-outlined action-icon">verified_user</span>
                                <span className="action-text">Accept security certificate</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-footer">
                    <button className="btn-access">NETWORK ACCESS READY</button>
                    <p className="footer-note">Issue with connection? Contact OPS HQ via Connect tab.</p>
                </div>
            </div>
          </section>
        )}

        {currentTab === 'night' && (
          <section id="night">
            <div className="screen-header">
                <h2 className="screen-title">NIGHT FALLBACKS</h2>
                <p className="screen-subtitle">When campus WiFi is dead, these are your cheapest options.</p>
            </div>

            <div className="night-grid">
                {NIGHT_PLANS.map(p => (
                  <div className="telco-card" key={p.provider}>
                    <div className="telco-header">
                        <span className="telco-name">{p.provider}</span>
                        <span className="stat-label">DAILY</span>
                    </div>
                    <div className="plan-info">
                        <div className="plan-row">
                            <span className="plan-label">Price</span>
                            <span>{p.price}</span>
                        </div>
                        <div className="plan-row">
                            <span className="plan-label">Volume</span>
                            <span>{p.volume}</span>
                        </div>
                        <div className="plan-row">
                            <span className="plan-label">Window</span>
                            <span>{p.time}</span>
                        </div>
                    </div>
                    <div className="ussd-block">
                        <span className="ussd-code">{p.code}</span>
                        <button className="btn-copy" onClick={() => copyToClipboard(p.code)}>COPY</button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="info-callout">
                <p>Night plans activate at midnight. Make sure your SIM has at least the plan cost in airtime before dialing.</p>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="report-bar">
            <p>Know a spot that's wrong? Help others by reporting it.</p>
            <button className="btn-report" onClick={() => setIsReportModalOpen(true)}>REPORT STATUS</button>
        </div>
      </footer>

      {/* Connection Modal */}
      <Modal 
        isOpen={!!selectedHotspot} 
        onClose={() => setSelectedHotspot(null)}
        closePosition="left"
      >
        {selectedHotspot && (
          <div className="connection-guide">
            <div className="guide-header">
                <span className="guide-icon">{selectedHotspot.icon}</span>
                <h2 className="guide-name">{selectedHotspot.name}</h2>
                <p className="guide-loc">{selectedHotspot.ssid} &middot; {selectedHotspot.location}</p>
            </div>

            <div className="ssid-section">
                <span className="label-caps">NETWORK NAME (SSID)</span>
                <div className="ssid-box">
                    <span className="material-symbols-outlined">signal_cellular_alt</span>
                    <code>{selectedHotspot.ssid}</code>
                </div>
            </div>

            <div className="steps-section">
                <span className="label-caps">STEPS TO CONNECT</span>
                <div className="modal-steps">
                    {selectedHotspot.steps.map((s, idx) => (
                      <div className="modal-step" key={idx}>
                        <div className="step-circle">{idx + 1}</div>
                        <p>{s}</p>
                      </div>
                    ))}
                </div>
            </div>

            {selectedHotspot.note && (
                <div className="modal-note">
                    <span className="note-emoji">💡</span>
                    <p>{selectedHotspot.note}</p>
                </div>
            )}
          </div>
        )}
      </Modal>

      {/* Report Modal */}
      <Modal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)}
        title="Update Hotspot Status"
      >
        <div className="report-modal-body">
            <div className="form-group">
                <label className="label-caps">Select Active Location</label>
                <div className="custom-select">
                    <select>
                        {INITIAL_HOTSPOTS.map(h => (
                          <option key={h.id} value={h.id}>{h.icon} {h.name}</option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined select-arrow">expand_more</span>
                </div>
            </div>

            <div className="verification-group">
                <label className="label-caps centered">Crowdsourced Verification</label>
                <div className="report-actions">
                    <button className="report-btn working" onClick={() => { setIsReportModalOpen(false); addToast("Status confirmed: WORKING"); }}>
                        <div className="btn-main">
                            <span className="material-symbols-outlined btn-icon">check_circle</span>
                            <div className="btn-text">
                                <span className="title">It's Working</span>
                                <span className="subtitle">CONFIRM OPERATIONAL STATUS</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined arrow">arrow_forward</span>
                    </button>

                    <button className="report-btn broken" onClick={() => { setIsReportModalOpen(false); addToast("Status reported: BROKEN"); }}>
                        <div className="btn-main">
                            <span className="material-symbols-outlined btn-icon">error</span>
                            <div className="btn-text">
                                <span className="title">Not Working</span>
                                <span className="subtitle">REPORT CONNECTIVITY ISSUE</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined arrow">arrow_forward</span>
                    </button>
                </div>
            </div>

            <div className="form-group">
                <label className="label-caps">Additional Details (Optional)</label>
                <div className="custom-select">
                    <select>
                        <option value="">No specific issue selected</option>
                        <option>🐢 Connection very slow</option>
                        <option>🚫 Cannot obtain IP address</option>
                        <option>📉 Signal dropping frequently</option>
                        <option>🔒 Portal page won't load</option>
                    </select>
                    <span className="material-symbols-outlined select-arrow">expand_more</span>
                </div>
            </div>
        </div>

        <div className="modal-footer">
            <button className="btn-cancel" onClick={() => setIsReportModalOpen(false)}>CANCEL</button>
            <button className="btn-submit" onClick={() => { setIsReportModalOpen(false); addToast("Report submitted. Map updated."); }}>SUBMIT REPORT</button>
        </div>
      </Modal>

      <div className="toast-container">
        {toasts.map((t, i) => (
          <Toast key={i} message={t} onClose={() => setToasts(prev => prev.filter((_, idx) => idx !== i))} />
        ))}
      </div>
    </div>
  )
}

export default App
