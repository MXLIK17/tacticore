const navigation = [
  ["home", "Home"], ["squad", "Squad"], ["draft", "Draft"], ["simulation", "Simulate"], ["results", "Results"],
];

function AppShell({ activePage, onNavigate, mode, children }) {
  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate("home")} aria-label="TactiCore home"><span className="brand-mark">T</span><span>TactiCore</span></button>
      <nav aria-label="Main navigation">{navigation.map(([id, label]) => <button key={id} className={activePage === id ? "nav-link is-active" : "nav-link"} onClick={() => onNavigate(id)}>{label}</button>)}</nav>
      <span className="mode-label">{mode === "premier" ? "Premier League" : "World Cup"}</span>
    </header>
    <main>{children}</main>
  </div>;
}
export default AppShell;
