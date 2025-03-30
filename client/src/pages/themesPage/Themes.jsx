import React from "react";
import { THEMES } from "../../constants/index.js";
import { useThemeStore } from "../../store/useThemeStore.js";
function Themes() {
  const {theme,setTheme} = useThemeStore()

  return (
    <div className="flex flex-row justify-center h-screen w-full py-[70px] ">
      <div className="flex flex-col h-full w-[900px] p-4 rounded-xl overflow-hidden shadow-lg">
        <div className="gap-1">
          <h2 className="text-3xl font-semibold">Theme</h2>
          <p className="text-md text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div
                className="relative h-10 w-full rounded-md overflow-hidden"
                data-theme={t}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-4 p-2">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[15px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
// className={`btn btn-sm h-10 w-[290px]`}
export default Themes;
