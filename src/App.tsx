import { useEffect, useState } from "react";
import { Shell } from "./components/Shell";
import { parseHash, type AppRoute } from "./lib/route";
import { HomePage } from "./pages/HomePage";
import { LexiconPage } from "./pages/LexiconPage";
import { PrompterPage } from "./pages/PrompterPage";
import { VerbsPage } from "./pages/VerbsPage";
import { WordsPage } from "./pages/WordsPage";
import { ProgressProvider } from "./progress-context";

function useRoute(): AppRoute {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.tab, route.section, route.lex]);
  return route;
}

export function App() {
  const route = useRoute();

  return (
    <ProgressProvider>
      <Shell route={route}>
        {route.tab === "parcours" && <HomePage />}
        {route.tab === "verbes" && <VerbsPage route={route} />}
        {route.tab === "mots" && <WordsPage route={route} />}
        {route.tab === "utile" && <LexiconPage route={route} />}
        {route.tab === "lecture" && <PrompterPage route={route} />}
      </Shell>
    </ProgressProvider>
  );
}
