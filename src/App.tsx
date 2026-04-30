import { useState, useMemo, useRef } from 'react'
import emailjs from '@emailjs/browser'
import './index.css'
import './components/components.css'
import type { Hotspot } from './types'
import Navbar from './components/Navbar'
import TopBar from './components/TopBar'
import HotspotCard from './components/HotspotCard'
import Modal from './components/Modal'
import Toast from './components/Toast'
import { Analytics } from '@vercel/analytics/react'

// Sample Data
const INITIAL_HOTSPOTS: Hotspot[] = [
    {
        id: 1,
        name: "Jaja",
        ssid: "Jaja_AP_3N",
        icon: "🏫",
        category: "halls",
        location: "OPD Waiting Side",
        status: "up",
        speed: "Fast",
        coverage: "OPD waiting area",
        note: "Handshake is strongest directly at the OPD waiting side.",
        steps: [
            "Connect to Jaja_AP_3N",
            "Wait for login page",
            "Login with school details"
        ],
        lastUpdated: "4 mins ago"
    },
    {
        id: 101,
        name: "Jaja",
        ssid: "Jaja_Accgr1",
        icon: "🏫",
        category: "halls",
        location: "waiting main hall in jaja",
        status: "up",
        speed: "Fast",
        coverage: "waiting main hall",
        note: "Handshake is strongest in the waiting main hall area.",
        steps: [
            "Connect to Jaja_Accgr1",
            "Wait for login page",
            "Login with school details"
        ],
        lastUpdated: "10 mins ago"
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
        ssid: "Kuti_AP7",
        icon: "🏢",
        category: "halls",
        location: "E Block, Kuti",
        status: "down",
        speed: "N/A",
        coverage: "E Block surroundings",
        note: "Currently offline. Present at E block in Kuti.",
        steps: [
            "Connect to Kuti_AP7",
            "Accept security certificate if prompted",
            "Login with school details"
        ],
        lastUpdated: "22 mins ago"
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

            <div className="report-banner">
                <div className="report-content">
                    <span className="material-symbols-outlined text-gold">campaign</span>
                    <div>
                        <h4 className="banner-title">Know a spot that's wrong?</h4>
                        <p className="banner-text">Help the community by reporting inactive or slow hotspots.</p>
                    </div>
                </div>
                <button className="btn-report-banner" onClick={() => setIsReportModalOpen(true)}>
                    REPORT STATUS
                </button>
            </div>
          </section>
        )}

        {currentTab === 'submit' && (
          <section id="submit" className="submit-section">
            {!isSubmitted ? (
              <>
                <div className="screen-header">
                    <span className="label-caps text-gold">CROWDSOURCED DATA</span>
                    <h2 className="screen-title">Submit a School WiFi</h2>
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
              <section id="success" className="success-section">
            <div className="success-canvas">
                {/* Hero Illustration */}
                <div className="success-hero">
                    <div className="hero-blur"></div>
                    <div className="hero-icon-container">
                        <span className="material-symbols-outlined text-up fill-icon">check_circle</span>
                    </div>
                    <div className="radar-badge">
                        <span className="material-symbols-outlined">verified</span>
                    </div>
                </div>

                {/* Message Content */}
                <div className="success-message">
                    <h1 className="success-title">Submission Received</h1>
                    <p className="success-subtitle font-mono">
                        Thanks for contributing. We'll verify and add it to the map if valid.
                    </p>
                </div>

                {/* Bento Metadata */}
                <div className="metadata-bento">
                    <div className="bento-item">
                        <p className="label-caps text-muted">Status</p>
                        <div className="status-indicator">
                            <div className="dot-pulse"></div>
                            <p className="text-gold font-bold">Pending Review</p>
                        </div>
                    </div>
                    <div className="bento-item">
                        <p className="label-caps text-muted">Queue ID</p>
                        <p className="font-mono text-primary">#OPS-7729-X</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="success-actions">
                    <button 
                        className="btn-primary-action"
                        onClick={() => {
                            setCurrentTab('directory');
                            setIsSubmitted(false);
                        }}
                    >
                        <span className="material-symbols-outlined">home</span>
                        BACK TO HOME
                    </button>
                    <button 
                        className="btn-secondary-action"
                        onClick={() => setIsSubmitted(false)}
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        SUBMIT ANOTHER
                    </button>
                </div>

                <div className="success-footer-graphic">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgTIVAHuZNBIff9rfMr1eBSPgj8nkn1pV_MBSIwP96nL34ANLIfKwMN0rChHxUdoX9yo9TCEvpHDIElDhQeJiurB9POZgIMRqwB_qijdPf1DKc2JMEANySJwr_Ks5Wg0UnFiLGVjMunC3lCdEf0yQncQ8jMrE2asrBswrMkqHeAl68k9YiflYH-PiAHx2rHo1KtF9-3ykK5lj_SQMBd4S8CabFjIQkUT2JPJyUpd_JQUwfg3tA9RrfzIyUUVVtpk_19j65ZIWZr9E" alt="Abstract connection grid" />
                </div>
              </div>
            </section>
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


      </main>

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
                
                <div className="info-callout" style={{ 
                  marginTop: '16px', 
                  background: 'rgba(201, 150, 26, 0.1)', 
                  border: '1px solid rgba(201, 150, 26, 0.2)',
                  padding: '12px',
                  borderRadius: '4px'
                }}>
                    <p style={{ fontSize: '11px', color: 'var(--ui-gold)', lineHeight: '1.4' }}>
                        <strong>💡 PRO TIP:</strong> Not sure about your login details? Check the <strong>CONNECT</strong> tab for the full setup guide!
                    </p>
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
                <label className="label-caps">Select Specific WiFi Network</label>
                <div className="custom-select">
                    <select>
                        <option value="" disabled selected>Choose a network to update...</option>
                        {INITIAL_HOTSPOTS.map(h => (
                          <option key={h.id} value={h.id}>
                            {h.icon} {h.name} — {h.ssid}
                          </option>
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
      <Analytics />
    </div>
  )
}

export default App
