/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakSlider,
   Background, Sidebar, Hero, PerksStrip, BonusCards, CompTable, KickSection, Footer, useReveal */
const { useEffect } = React;

const TWEAK_DEFAULTS = { "falling": true, "density": 1 };

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();

  return (
    <div className="app-layout">
      <Background falling={t.falling} density={t.density} />
      <Sidebar />
      <main className="main">
        <Hero />
        <div className="content">
          <PerksStrip />
          <BonusCards />
          <CompTable />
          <KickSection />
          <Footer />
        </div>
      </main>
      <TweaksPanel>
        <TweakSection label="Falling Emotes" />
        <TweakToggle label="Emotes on/off" value={t.falling} onChange={v=>setTweak("falling",v)} />
        <TweakSlider label="Density" value={t.density} min={0.3} max={2} step={0.1} onChange={v=>setTweak("density",v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
