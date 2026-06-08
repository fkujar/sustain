/* global React */
const { useState, useEffect, useRef } = React;

const JOIN_URL = "https://stake.com/?offer=sustain&c=dmjlVbU4";
const KICK_URL = "https://kick.com/sustain";

/* ── icons ── */
const Ico = {
  home:    (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>),
  rewards: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M8 8H4l2 8h12l2-8h-4M9 16l1 5M15 16l-1 5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>),
  bonuses: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7S10 2 7 4s3 3 5 3 5-1 5-3-5 1-5 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>),
  link:    (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  kick:    ({style, ...rest})=>(<img src="assets/kick-logo.png" alt="Kick" style={{width:20,height:20,objectFit:'contain',...style}} {...rest}/>),
  x:      (p)=>(<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.483 2.25h6.945l4.262 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>),
  chev:    (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  check:   (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  play:    (p)=>(<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z"/></svg>),
};

/* ── falling emotes ── */
function FallingLogos({ enabled, density }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, W, H, parts = [], running = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let imgReady = false, imgEl = null;
    function resize(){ W=canvas.width=canvas.offsetWidth*devicePixelRatio; H=canvas.height=canvas.offsetHeight*devicePixelRatio; }
    function make(n){ parts = Array.from({length:n}, ()=>spawn(true)); }
    function spawn(any){
      const s=(30+Math.random()*42)*devicePixelRatio;
      return { x:Math.random()*W, y:any?Math.random()*H:-s, size:s,
        vy:(14+Math.random()*22)*devicePixelRatio/60, rot:(Math.random()-.5)*.5,
        vr:(Math.random()-.5)*.006, op:.12+Math.random()*.28,
        sway:Math.random()*Math.PI*2, swaySp:.004+Math.random()*.01,
        swayAmt:(6+Math.random()*18)*devicePixelRatio };
    }
    function frame(){
      if(!running) return;
      ctx.clearRect(0,0,W,H);
      if(imgReady && imgEl){
        for(const p of parts){
          p.y+=p.vy; p.rot+=p.vr; p.sway+=p.swaySp;
          const x=p.x+Math.sin(p.sway)*p.swayAmt;
          if(p.y-p.size>H) Object.assign(p,spawn(false));
          ctx.save(); ctx.globalAlpha=p.op;
          ctx.translate(x,p.y); ctx.rotate(p.rot);
          ctx.drawImage(imgEl,-p.size/2,-p.size/2,p.size,p.size);
          ctx.restore();
        }
      }
      raf=requestAnimationFrame(frame);
    }
    resize();
    const cnt=reduce?0:Math.round((density||1)*(W/devicePixelRatio>700?22:12));
    if(enabled&&!reduce) make(cnt);
    frame();
    const img=new Image(); img.onload=()=>{imgEl=img;imgReady=true;}; img.src="assets/sustain-emote.png";
    const onR=()=>{resize();make(enabled&&!reduce?Math.round((density||1)*(W/devicePixelRatio>700?22:12)):0);};
    window.addEventListener("resize",onR);
    return ()=>{running=false;cancelAnimationFrame(raf);window.removeEventListener("resize",onR);};
  },[enabled,density]);
  return <canvas id="fall-canvas" ref={ref}></canvas>;
}

/* ── background ── */
function Background({ falling, density }) {
  return (
    <div className="bg-root">
      <div className="bg-aurora"></div>
      <div className="bg-dots"></div>
      <FallingLogos enabled={falling} density={density} />
    </div>
  );
}

/* ── sidebar ── */
const NAV_ITEMS = [
  { id:"home",    label:"Home",    icon:"home",    active:true },
  { id:"rewards", label:"Rewards", icon:"rewards" },
  { id:"bonuses", label:"Bonuses", icon:"bonuses" },
];
const SOCIAL_ITEMS = [
  { id:"kick", label:"Watch Live", icon:"kick", url:KICK_URL },
  { id:"x",    label:"X / Twitter", icon:"x",    url:"https://x.com/SustainOnX" },
  { id:"stake",label:"Join Stake", icon:"link", url:JOIN_URL },
];

function Sidebar({ activeSection }) {
  const [active, setActive] = useState("home");
  const handleNav = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <img src="assets/sustain-rounded.png" alt="Sustain" />
        <div className="sb-logo-name">
          <span className="top">SUSTAIN</span>
          <span className="vip">REWARDS</span>
        </div>
      </div>

      <nav className="sb-nav">
        {NAV_ITEMS.map(item => {
          const Icon = Ico[item.icon];
          return (
            <div key={item.id}
              className={"sb-item"+(active===item.id?" active":"")}
              onClick={()=>handleNav(item.id)}>
              <Icon />{item.label}
              {item.badge && <span className={"sb-badge "+(item.badgeColor||"")}>{item.badge}</span>}
            </div>
          );
        })}
      </nav>

      <div className="sb-socials">
        <div className="sb-section-label">Socials <span>·</span></div>
        {SOCIAL_ITEMS.map(item => {
          const Icon = Ico[item.icon];
          return (
            <a key={item.id} className="sb-social" href={item.url} target="_blank" rel="noopener">
              <Icon />{item.label}
            </a>
          );
        })}
      </div>
    </aside>
  );
}

/* ── mountain ── */
function Mountain() {
  return (
    <div className="mountain-wrap">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <defs>
          <linearGradient id="mG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#030609"/>
            <stop offset="100%" stopColor="#020408"/>
          </linearGradient>
        </defs>
        {/* back mid peaks */}
        <path d="M-10,320 L-10,230 L80,160 L180,215 L300,135 L420,200 L545,110 L660,185 L770,98 L880,175 L990,105 L1100,182 L1220,118 L1340,188 L1450,140 L1450,320 Z"
          fill="#07111e"/>
        {/* main peaks */}
        <path d="M-10,320 L-10,262 L100,196 L210,248 L330,162 L445,222 L560,130 L670,198 L778,115 L888,192 L998,125 L1108,198 L1228,138 L1348,202 L1450,162 L1450,320 Z"
          fill="#040c16"/>
        {/* front dark fill — completely solid to bottom */}
        <path d="M-10,320 L-10,284 L120,256 L250,278 L380,248 L510,272 L640,240 L760,266 L880,236 L1000,262 L1120,238 L1250,264 L1380,244 L1450,256 L1450,320 Z"
          fill="url(#mG)"/>
        {/* extra bottom solid to prevent any gaps */}
        <rect x="-10" y="300" width="1470" height="25" fill="#020408"/>
      </svg>
    </div>
  );
}

/* ── hero ── */
function Hero() {
  return (
    <section className="hero" id="home">
      {/* characters */}
      <div className="char char-left" style={{left:'-350px', bottom:'-60px',
        WebkitMaskImage:'linear-gradient(to bottom, transparent 0%, black 8%, black 100%), linear-gradient(to right, black 0%, black 63%, transparent 80%)',
        WebkitMaskComposite:'source-in',
        maskImage:'linear-gradient(to bottom, transparent 0%, black 8%, black 100%), linear-gradient(to right, black 0%, black 63%, transparent 80%)',
        maskComposite:'intersect'}}>
        <video autoPlay loop muted playsInline
          style={{width:'940px',height:'auto',
            objectFit:'contain',display:'block',
            transform:'scaleX(-1)',
            mixBlendMode:'multiply'}}>
          <source src="assets/raccoon-video.webm" type="video/webm"/>
        </video>
      </div>
      <div className="char char-right">
        <img src="assets/slot-raccoon.gif" alt="Raccoon character"
          style={{filter:'drop-shadow(8px 0 28px rgba(74,158,255,.4))',transform:'scaleX(-1)'}} />
      </div>

      {/* floating slot badges removed per user request */}

      {/* center content */}
      <div className="hero-center">
        <div className="stake-label">Stake</div>
        <h1 className="hero-title">
          <span className="blue">SUSTAIN</span><br/>REWARDS
        </h1>
        <p className="hero-sub-text">
          Every wager on <b>Stake</b> under code <span className="hl">SUSTAIN</span> unlocks
          exclusive rewards, instant rakeback and VIP bonuses.
        </p>
        <div className="hero-cta">
          <a className="btn btn-lg btn-gold" href={JOIN_URL} target="_blank" rel="noopener">
            <Ico.bonuses style={{width:18,height:18}}/> Claim Bonuses
          </a>
          <a className="btn btn-lg btn-blue" href="#bonuses"
            onClick={e=>{e.preventDefault();document.getElementById('bonuses')?.scrollIntoView({behavior:'smooth'})}}>
            View Rewards
          </a>
        </div>
        <div className="chevrons">
          <Ico.chev/><Ico.chev/><Ico.chev/>
        </div>
      </div>

      <Mountain/>
    </section>
  );
}

/* ── perks strip ── */
const PERKS = [
  { big:"3.5%", small:"Instant Rakeback" },
  { big:"10%",  small:"Weekly Loss Back" },
  { big:"3×",   small:"Triple Weekly Bonus" },
  { big:"VIP",  small:"Rank-Up Rewards" },
];
function PerksStrip() {
  return (
    <section className="section reveal" style={{paddingTop:40,paddingBottom:20}} id="rewards">
      <div className="wrap perks-row">
        {PERKS.map((p,i)=>(
          <div className="perk" key={i}>
            <div className="perk-big">{p.big}</div>
            <div className="perk-small">{p.small}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── bonus cards ── */
function hi(t,cls="hi-gold"){return <span className={cls}>{t}</span>;}
const CARDS = [
  { key:"reload", iconImg:"assets/icon-scatter.png", feat:false,
    title:"7-Day Reload", sub:"New users only",
    items:[<span>Create a ticket with your {hi("Stake name")}</span>,<span>Deposit {hi("$14 or more")}</span>,<span>Free {hi("RELOAD")} every day for {hi("7 days")}</span>,<span>New accounts {hi("(May 5 2026+)")}</span>]},
  { key:"firstdepo", iconImg:"assets/icon-rainbow.png", feat:true,
    title:"First Deposit", sub:"First-time depositors",
    items:[<span>Deposit {hi("any amount","hi-blue")}</span>,<span>Wager {hi("$2,500","hi-blue")} total</span>,<span>Receive {hi("free $20 tip","hi-blue")}</span>,<span>Create a {hi("ticket","hi-blue")} to claim</span>]},
  { key:"tenpct", iconImg:"assets/badge-vs2.webp", feat:false,
    title:"10% Bonus", sub:"One deposit only",
    items:[<span>Valid for {hi("one deposit")} only</span>,<span>Deposit {hi("any amount")}</span>,<span>Get {hi("10%")} back after wagering {hi("10×")}</span>,<span>Bonus capped at {hi("$50")}</span>]},
];
function BonusCards() {
  return (
    <section className="section reveal" id="bonuses" style={{paddingTop:20}}>
      <div className="wrap">
        <div className="section-head">
          <div className="k">Pick your</div>
          <h2>Free <em>Bonus</em></h2>
        </div>
        <div className="cards">
          {CARDS.map(c=>(
            <div className={"card-v2 "+(c.feat?"feat":"")} key={c.key}>
              <div className="card-float-icon">
                <img src={c.iconImg} alt={c.title} style={{width:'100%',height:'100%',objectFit:'contain',filter:'drop-shadow(0 6px 16px rgba(0,0,0,.7))'}}/>
              </div>
              <div className="card-v2-title">{c.title}</div>
              <div className="card-v2-sub">{c.sub}</div>
              <div className="card-pills">{c.items.map((it,i)=><div className="card-pill" key={i}>{it}</div>)}</div>
              <a className="card-btn" href={JOIN_URL} target="_blank" rel="noopener">CLAIM BONUS</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── comparison table ── */
const COMP_ROWS = [
  {label:"Basic VIP Level Rewards",   no:true, yes:true},
  {label:"Weekly / Monthly Rewards",  no:true, yes:true},
  {label:"3.5% Boosted Rakeback",     no:false,yes:true},
  {label:"7-Day Free Reload",         no:false,yes:true},
  {label:"10% Deposit Bonus",         no:false,yes:true},
  {label:"Triple Weekly Bonus",       no:false,yes:true},
  {label:"Exclusive VIP Support",     no:false,yes:true},
];
function CompTable() {
  return (
    <section className="section reveal">
      <div className="wrap comp-wrap">
        <div className="section-head">
          <div className="k">Code benefits</div>
          <h2>With vs Without <em>SUSTAIN</em></h2>
        </div>
        <table className="comp-table">
          <thead>
            <tr>
              <th></th>
              <th className="col-no">Without Code</th>
              <th className="col-yes">Code: SUSTAIN</th>
            </tr>
          </thead>
          <tbody>
            {COMP_ROWS.map((r,i)=>(
              <tr key={i}>
                <td>{r.label}</td>
                <td>{r.no?<span className="ico-yes">✓</span>:<span className="ico-no">✕</span>}</td>
                <td><span className="ico-yes">✓</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="comp-cta">
          <a className="btn btn-lg btn-blue" href={JOIN_URL} target="_blank" rel="noopener">GET ALL PERKS NOW</a>
        </div>
      </div>
    </section>
  );
}

/* ── kick section ── */
function KickSection() {
  return (
    <section className="section reveal" id="kick">
      <div className="wrap kick-inner">
        <div className="kick-left">
          <div className="kick-logo">
            <div className="k-ico"><img src="assets/kick-logo.png" alt="Kick" style={{width:32,height:32,objectFit:'contain'}}/></div>
            <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:20}}>KICK.COM</div>
          </div>
          <h2>Watch <em>Sustain</em><br/>Live on Kick</h2>
          <p>Join the stream for live giveaways, bonus hunts and high-stakes action. Drop your Stake username in chat to be eligible for rewards.</p>
          <a className="btn btn-lg btn-kick" href={KICK_URL} target="_blank" rel="noopener" style={{display:'none'}}>
            <Ico.kick style={{width:20,height:20}}/> WATCH LIVE
          </a>
        </div>
        <div className="kick-card">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div className="live-badge"><span className="live-dot"></span>LIVE</div>
            <span className="kick-url">kick.com/sustain</span>
          </div>
          <a className="kick-preview" href={KICK_URL} target="_blank" rel="noopener">
            <div className="kick-play"><Ico.play/></div>
            <span>Watch Sustain Live</span>
          </a>
          <a className="btn btn-kick" href={KICK_URL} target="_blank" rel="noopener" style={{justifyContent:'center'}}>
            <Ico.kick style={{width:18,height:18}}/> JOIN STREAM
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── footer ── */
function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div>
          <div className="foot-brand">
            <img src="assets/sustain-rounded.png" alt="Sustain"/>
            <span>SUSTAIN<span className="vip">REWARDS</span></span>
          </div>
          <p>We are not responsible for any losses from gambling on casinos or betting sites linked or promoted on this site. As a player, you are solely responsible for your bets. 18+. Gamble responsibly.</p>
        </div>
        <div>
          <h4>Links</h4>
          <div className="foot-links">
            <a href="#home">Home</a>
            <a href="#bonuses">Bonuses</a>
            <a href="#rewards">Rewards</a>
            <a href={JOIN_URL} target="_blank" rel="noopener">Join Stake</a>
          </div>
        </div>
        <div>
          <h4>Community</h4>
          <div className="foot-links">
            <a href={KICK_URL} target="_blank" rel="noopener">
              <Ico.kick style={{width:16,height:16}}/>kick.com/sustain
            </a>
            <a href="https://x.com/SustainOnX" target="_blank" rel="noopener">
              <Ico.x style={{width:16,height:16}}/>x.com/SustainOnX
            </a>
          </div>
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>© 2026 SustainRewards — All rights reserved</span>
        <span>18+ · Gamble responsibly</span>
      </div>
    </footer>
  );
}

/* ── scroll reveal ── */
function useReveal() {
  useEffect(()=>{
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}
    }),{threshold:.1});
    els.forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  },[]);
}

Object.assign(window,{Background,Sidebar,Hero,PerksStrip,BonusCards,CompTable,KickSection,Footer,useReveal});
