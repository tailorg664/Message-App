import { THEMES } from "../../constants";
import { useThemeStore } from "../../store/useThemeStore";

function Themes() {
  const { theme, setTheme } = useThemeStore();

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
          {THEMES.map((currentTheme) => (
            <button
              key={currentTheme}
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                theme === currentTheme ? "bg-base-200" : "hover:bg-base-200/50"
              }`}
              onClick={() => setTheme(currentTheme)}
            >
              <div
                className="relative h-10 w-full rounded-md overflow-hidden"
                data-theme={currentTheme}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-4 p-2">
                  <div className="rounded bg-primary" />
                  <div className="rounded bg-secondary" />
                  <div className="rounded bg-accent" />
                  <div className="rounded bg-neutral" />
                </div>
              </div>
              <span className="text-[15px] font-medium truncate w-full text-center">
                {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Themes;
