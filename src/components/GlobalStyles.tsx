export function GlobalStyles() {
    return (
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

      * { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        background: #0a0f0c;
        color: #e8f5e2;
        font-family: 'DM Sans', sans-serif;
      }

      @keyframes fadeSlide {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
      }

      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #1e3a2e; border-radius: 3px; }
    `}</style>
    );
}