"use client";
import { useState } from "react";
import { estimateCabs, formatEstimate } from "@/lib/estimation";
export function CabEstimator() {
  const [share, setShare] = useState(4),
    [trips, setTrips] = useState(1.5),
    [perCab, setPerCab] = useState(12);
  const estimate = estimateCabs(share, trips, perCab);
  return (
    <section className="est" aria-labelledby="estimate-title">
      <h2 id="estimate-title">Try one now: how many cabs run in Mumbai?</h2>
      <p className="sub">Move the assumptions and watch the answer change.</p>
      <div className="node">
        <span>Mumbai population</span>
        <b>2 crore</b>
      </div>
      <div className="link" />
      <div className="node">
        <span>Daily cab riders</span>
        <b>{formatEstimate(estimate.riders)}</b>
      </div>
      <div className="link" />
      <div className="node">
        <span>Cab trips per day</span>
        <b>{formatEstimate(estimate.trips)}</b>
      </div>
      <div className="link" />
      <div className="node final" aria-live="polite">
        <span>Cabs needed</span>
        <b>{formatEstimate(estimate.cabs)}</b>
      </div>
      <div className="sl">
        <label htmlFor="share">
          Share who ride daily <b>{share}%</b>
        </label>
        <input
          id="share"
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={share}
          onChange={(e) => setShare(+e.target.value)}
        />
        <label htmlFor="trips">
          Trips per rider <b>{trips}</b>
        </label>
        <input
          id="trips"
          type="range"
          min="1"
          max="3"
          step="0.5"
          value={trips}
          onChange={(e) => setTrips(+e.target.value)}
        />
        <label htmlFor="per-cab">
          Trips per cab per day <b>{perCab}</b>
        </label>
        <input
          id="per-cab"
          type="range"
          min="6"
          max="20"
          value={perCab}
          onChange={(e) => setPerCab(+e.target.value)}
        />
      </div>
      <p className="sanity">
        Sanity check: about one cab for every {Math.round(20e6 / estimate.cabs)}{" "}
        residents.
      </p>
      <p className="assumption-note">Illustrative interview assumptions.</p>
    </section>
  );
}
