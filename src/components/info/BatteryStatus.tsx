"use client";

export default function BatteryStatus() {
  // ASCII art Vault Boy (simplified version)
  const vaultBoyArt = `
    ⠀⠀⠀⢀⣀⣀⣀⡀⠀⠀⠀
    ⠀⢀⣾⣿⣿⣿⣿⣿⣷⡀⠀
    ⠀⣾⣿⣿⣿⣿⣿⣿⣿⣷⠀
    ⢸⣿⣿⡟⠛⠛⢻⣿⣿⣿⡇
    ⢸⣿⣿⣇⣀⣀⣸⣿⣿⣿⡇
    ⠘⢿⣿⣿⣿⣿⣿⣿⣿⡿⠃
    ⠀⠀⠙⠻⠿⠿⠿⠟⠋⠀⠀
    ⠀⢰⣶⣶⣶⣶⣶⣶⡆⠀⠀
    ⠀⠸⣿⣿⣿⣿⣿⣿⠇⠀⠀
    ⠀⠀⠈⠉⠉⠉⠉⠁⠀⠀⠀
  `.trim();

  return (
    <div className="flex items-start gap-4 mb-6 p-3 border border-[var(--pipboy-green-dark)] rounded">
      <div className="vault-boy-container text-[8px] md:text-[10px] leading-none">
        <pre>{vaultBoyArt}</pre>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm md:text-base glow-text font-[family-name:var(--font-pipboy)]">
          ▸ LOW BATTERY LEVEL
        </span>
        <div className="flex items-center gap-2">
          <div className="w-20 h-3 border border-[var(--pipboy-green-dim)] rounded-sm overflow-hidden">
            <div
              className="h-full bg-[var(--pipboy-amber)]"
              style={{ width: "23%" }}
            />
          </div>
          <span className="text-xs glow-text">23%</span>
        </div>
      </div>
    </div>
  );
}
