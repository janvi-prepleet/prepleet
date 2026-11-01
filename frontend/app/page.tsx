import Link from "next/link";
import { BookOpen, Calculator, ChevronRight } from "lucide-react";
import { CabEstimator } from "@/components/cab-estimator";
import { Logo } from "@/components/logo";
export default function Home() {
  return (
    <main id="main" className="scroll">
      <div className="wrap">
        <section className="hero">
          <div>
            <h1>Crack guesstimates before you crack cases.</h1>
            <p className="lead">
              Clear frameworks, worked examples and practical guides. Build the
              thinking behind a confident answer, one assumption at a time.
            </p>
            <div className="cta">
              <Link className="btn pri lg" href="/guesstimates">
                Start with guesstimates, free
              </Link>
              <Link className="btn lg" href="/learn">
                Explore Learn
              </Link>
            </div>
          </div>
          <CabEstimator />
        </section>
        <section className="feat">
          <div className="card">
            <span className="ficon">
              <BookOpen size={20} />
            </span>
            <h2>Learn</h2>
            <p className="muted">
              Build a strong foundation with guesstimate guides for consulting
              and product management.
            </p>
            <ul>
              <li>Quick revision sheets and core concepts</li>
              <li>Worked examples and interview patterns</li>
            </ul>
            <Link className="text-link" href="/learn">
              Explore guides <ChevronRight size={14} />
            </Link>
          </div>
          <div className="card">
            <span className="ficon">
              <Calculator size={20} />
            </span>
            <h2>Practice</h2>
            <p className="muted">
              A space to put your frameworks into practice is on its way.
            </p>
            <ul>
              <li>Start with the guides today</li>
              <li>Practice is coming soon</li>
            </ul>
            <Link className="text-link" href="/practice">
              See what’s next <ChevronRight size={14} />
            </Link>
          </div>
        </section>
        <section className="band">
          <h2>Your first step to a clearer estimate.</h2>
          <Link className="btn saf lg" href="/guesstimates">
            Explore guesstimates
          </Link>
        </section>
        <footer className="foot">
          <Logo />
          <span>Think clearly. Estimate confidently.</span>
        </footer>
      </div>
    </main>
  );
}
