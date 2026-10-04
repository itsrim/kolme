import { useState } from "react";
import { Picture } from "../components/Picture";
import { LESSONS, WEEKS, lessonsForWeek } from "../data/path";
import { useProgress } from "../progress-context";

function greeting(date = new Date()): { fi: string; fr: string } {
  const hour = date.getHours();
  if (hour < 5 || hour >= 22) return { fi: "Hyvää yötä", fr: "Bonne nuit" };
  if (hour < 10) return { fi: "Hyvää huomenta", fr: "Bonjour" };
  if (hour < 18) return { fi: "Hyvää päivää", fr: "Bonjour" };
  return { fi: "Hyvää iltaa", fr: "Bonsoir" };
}

export function HomePage() {
  const progress = useProgress();
  const hello = greeting();
  const [week, setWeek] = useState(progress.week);
  const [picked, setPicked] = useState<string | null>(null);
  const weekPlan = WEEKS[week - 1];
  const lessons = lessonsForWeek(week);
  const lesson = lessons.find((item) => item.id === picked) ?? lessons.find((item) => !progress.isDone(item.id)) ?? lessons[0];
  const ratio = progress.total === 0 ? 0 : progress.doneCount / progress.total;
  const dayRatio = (progress.day ?? 0) / 90;

  function chooseWeek(next: number) {
    setWeek(next);
    const list = lessonsForWeek(next);
    const open = list.find((item) => !progress.isDone(item.id)) ?? list[0];
    setPicked(open?.id ?? null);
  }

  return (
    <div className="home">
      <header className="hero">
        <p className="kicker" lang="fi">
          {hello.fi}
          <span>{hello.fr}</span>
        </p>
        <div className="hero-art" aria-hidden="true">
          <Picture scene="sun" size={76} />
          <Picture scene="coffee" size={76} />
          <Picture scene="book" size={76} />
          <Picture scene="tree" size={76} />
        </div>
        <h1>Le finnois en trois mois.</h1>
        <p className="lede">
          Quatre-vingt-dix jours, vingt minutes par jour. Quatre leçons par semaine : les verbes, les mots du quotidien, les désinences qui se collent, et des textes à lire à voix haute.
        </p>
        {!progress.state.startedOn ? (
          <button type="button" className="cta" onClick={progress.start}>
            Commencer le jour 1
          </button>
        ) : (
          <div className="hero-actions">
            {lesson?.link ? (
              <a className="cta" href={lesson.link.hash}>
                {lesson.link.label}
              </a>
            ) : (
              <a className="cta" href="#lecon">
                {lesson?.title ?? "La leçon du jour"}
              </a>
            )}
            {!progress.studiedToday && (
              <button type="button" className="ghost" onClick={progress.markToday}>
                J'ai étudié aujourd'hui
              </button>
            )}
          </div>
        )}
      </header>

      <section className="stats" aria-label="Progression">
        <article className="stat">
          <Ring value={dayRatio} />
          <div>
            <p className="stat-k">Calendrier</p>
            <p className="stat-n">
              {progress.day ?? 0}
              <small>/ 90</small>
            </p>
            <p className="stat-d">Les jours 85 à 90 restent sur la dernière semaine.</p>
          </div>
        </article>
        <article className="stat">
          <Ring value={ratio} />
          <div>
            <p className="stat-k">Leçons</p>
            <p className="stat-n">
              {progress.doneCount}
              <small>/ {progress.total}</small>
            </p>
            <p className="stat-d">
              Série {progress.streak} jour{progress.streak > 1 ? "s" : ""} · niveau {progress.level}
            </p>
          </div>
        </article>
        <article className="stat levels">
          <p><b>A1</b> semaines 1–4</p>
          <p><b>A2</b> semaines 5–8</p>
          <p><b>B1</b> semaines 9–12</p>
          <p className="stat-d">Les onglets restent ouverts. Le parcours dit seulement par où passer.</p>
        </article>
      </section>

      <section className="plan" aria-label="Semaines">
        <div className="plan-head">
          <h2>Les douze semaines</h2>
          <button type="button" className="textish" onClick={() => chooseWeek(progress.week)}>
            Semaine du jour : {progress.week}
          </button>
        </div>
        <ol className="trail">
          {WEEKS.map((item) => {
            const done = lessonsForWeek(item.week).filter((lesson) => progress.isDone(lesson.id)).length;
            return (
              <li key={item.week}>
                <button
                  type="button"
                  className={item.week === week ? "on" : ""}
                  aria-current={item.week === week ? "true" : undefined}
                  onClick={() => chooseWeek(item.week)}
                >
                  <span className="trail-n">{item.week}</span>
                  <span className="trail-l">{item.level}</span>
                  <span className="trail-bar" style={{ transform: `scaleX(${done / 4})` }} />
                </button>
              </li>
            );
          })}
        </ol>

        {weekPlan && (
          <div className="week-copy">
            <p className="kicker">
              Semaine {weekPlan.week}
              <span>{weekPlan.level}</span>
            </p>
            <h3>{weekPlan.title}</h3>
            <p>{weekPlan.goal}</p>
          </div>
        )}

        <div className="lesson-layout">
          <ul className="lesson-list">
            {lessons.map((item, index) => {
              const done = progress.isDone(item.id);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={lesson?.id === item.id ? "lesson-btn on" : "lesson-btn"}
                    onClick={() => setPicked(item.id)}
                  >
                    <span className={done ? "tick on" : "tick"} aria-hidden="true" />
                    <span>
                      <strong>
                        {index + 1}. {item.title}
                      </strong>
                      <small>{item.minutes} min</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {lesson && (
            <article className="lesson-card" id="lecon">
              <header>
                <div className="lesson-title">
                  <Picture id={lesson.examples?.[0]?.fi ?? lesson.title} size={64} />
                  <h3>{lesson.title}</h3>
                </div>
                <button
                  type="button"
                  className={progress.isDone(lesson.id) ? "ghost on" : "ghost"}
                  aria-pressed={progress.isDone(lesson.id)}
                  onClick={() => progress.toggle(lesson.id)}
                >
                  {progress.isDone(lesson.id) ? "Fait" : "Marquer comme fait"}
                </button>
              </header>
              <ul>
                {lesson.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {lesson.examples && (
                <dl className="examples">
                  {lesson.examples.map((example) => (
                    <div key={example.fi}>
                      <Picture id={example.fi} size={48} />
                      <dt lang="fi">{example.fi}</dt>
                      <dd>{example.fr}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {lesson.link && (
                <a className="cta slim" href={lesson.link.hash}>
                  {lesson.link.label}
                </a>
              )}
            </article>
          )}
        </div>
      </section>

      <footer className="home-foot">
        <p>
          {LESSONS.length} leçons tiennent dans cet appareil. Sur téléphone, ajoute Kolme à l'écran d'accueil : le parcours reste là, sans compte.
        </p>
        {progress.state.startedOn && (
          <button
            type="button"
            className="textish danger"
            onClick={() => {
              if (window.confirm("Effacer le parcours, les coches et la série ?")) progress.reset();
            }}
          >
            Recommencer à zéro
          </button>
        )}
      </footer>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <svg className="ring" viewBox="0 0 88 88" aria-hidden="true">
      <circle cx="44" cy="44" r={radius} className="ring-track" />
      <circle
        cx="44"
        cy="44"
        r={radius}
        className="ring-value"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - clamped)}
      />
    </svg>
  );
}
