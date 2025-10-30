import React from 'react';

// Utility: compute the time parts between now and a target date.
// Returns an object with days, hours, minutes, seconds and a boolean "isPast".
function getTimeRemaining(targetDate: Date) {
	const now = new Date();
	const totalMs = targetDate.getTime() - now.getTime();
	const clamped = Math.max(totalMs, 0); // never go below 0 for display

	const seconds = Math.floor((clamped / 1000) % 60);
	const minutes = Math.floor((clamped / (1000 * 60)) % 60);
	const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
	const days = Math.floor(clamped / (1000 * 60 * 60 * 24));

	return {
		days,
		hours,
		minutes,
		seconds,
		isPast: totalMs < 0,
	};
}

// Background options the user can choose from. You can add more later.
const BACKGROUNDS = [
	{ id: 'city-night', label: 'Twice', url: 'https://lv2-cdn.azureedge.net/twice/862494b8a03e4b38a214c6b80247cace-11-%E1%84%83%E1%85%A1%E1%86%AB%E1%84%8E%E1%85%A6_%E1%84%8F%E1%85%A5%E1%86%AB%E1%84%89%E1%85%A6%E1%86%B83_%E1%84%8F%E1%85%B3%E1%86%AF%E1%84%85%E1%85%B5%E1%86%AB%E1%84%87%E1%85%A9%E1%86%AB-2.jpg' },

];

// LocalStorage key to remember the user's chosen background across visits.
const BG_STORAGE_KEY = 'countdown:bg';

export default function App() {
	// 1) Target date: your concert on May 30.
	//    We set the year dynamically: if May 30 this year is already past, use next year.
	const today = new Date();
	const currentYear = today.getFullYear();
	const targetThisYear = new Date(currentYear, 4 /* May is 4 (0-indexed) */, 30, 0, 0, 0);
	const targetYear = targetThisYear.getTime() >= today.getTime() ? currentYear : currentYear + 1;
	const concertDate = new Date(targetYear, 4, 30, 0, 0, 0);

	// 2) Live countdown state. We tick every second.
	const [nowTick, setNowTick] = React.useState<number>(() => Date.now());
	const time = getTimeRemaining(concertDate);

	// Update the tick every 1000ms to re-render the countdown.
	React.useEffect(() => {
		const id = setInterval(() => setNowTick(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	// 3) Background selection with persistence in localStorage.
	const [backgroundId, setBackgroundId] = React.useState<string>(() => {
		// Initial read from localStorage (if present), else default to first option.
		try {
			return localStorage.getItem(BG_STORAGE_KEY) || BACKGROUNDS[0].id;
		} catch {
			return BACKGROUNDS[0].id;
		}
	});

	// Persist changes to localStorage whenever user selects a new background.
	React.useEffect(() => {
		try {
			localStorage.setItem(BG_STORAGE_KEY, backgroundId);
		} catch {
			// If storage fails (privacy mode), silently ignore.
		}
	}, [backgroundId]);

	// Resolve the background image URL from the selected id.
	const bg = BACKGROUNDS.find(b => b.id === backgroundId) || BACKGROUNDS[0];

	// Helper: pad numbers to two digits for HH:MM:SS readability.
	const pad2 = (n: number) => n.toString().padStart(2, '0');

	return (
		<div className="app">
			{/* Background image layer */}
			<div className="background" style={{ backgroundImage: `url(${bg.url})` }} />
			{/* Semi-transparent scrim to keep text legible over the photo */}
			<div className="scrim" />

			<div className="card">
				<h1 className="title">Concert Countdown</h1>
				<p className="subtitle">Counting down to May 30, {targetYear}</p>

				{/* Countdown display: days, hours, minutes, seconds */}
				<div className="countdown" aria-live="polite">
					<TimeBox value={time.days} label="Days" />
					<TimeBox value={pad2(time.hours)} label="Hours" />
					<TimeBox value={pad2(time.minutes)} label="Minutes" />
					<TimeBox value={pad2(time.seconds)} label="Seconds" />
				</div>

				{/* Background chooser */}
				<div className="controls">
					<label htmlFor="bg-select">Background:</label>
					<select
						id="bg-select"
						className="select"
						value={backgroundId}
						onChange={(e) => setBackgroundId(e.target.value)}
					>
						{BACKGROUNDS.map((b) => (
							<option key={b.id} value={b.id}>{b.label}</option>
						))}
					</select>
					<button className="button" onClick={() => setBackgroundId(BACKGROUNDS[0].id)}>Reset</button>
				</div>

				{/* If the date is past, show a small note. */}
				{time.isPast && (
					<p className="footer">It's concert time! 🎉</p>
				)}
			</div>
		</div>
	);
}

type TimeBoxProps = {
	value: number | string;
	label: string;
};

// Small presentational component for a single time unit.
function TimeBox({ value, label }: TimeBoxProps) {
	return (
		<div className="time-box">
			<div className="time" aria-label={`${label}: ${value}`}>{value}</div>
			<div className="label">{label}</div>
		</div>
	);
}

 
