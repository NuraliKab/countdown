import { useState, useEffect } from 'react';
import './App.css'

interface AppProps {
  targetDate: Date;
}

function App({ targetDate }: AppProps) {
  calculateTimeLeft = () => {
    const difference = +targetDate - +new Date(); //Left time in miliseconds
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

  return timeLeft;
  };

  return (
    <div>
      <h1>My Countdown</h1>
      {/* We'll display the timeLeft data here soon */}
    </div>
  )
}

export default App
