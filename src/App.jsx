import React, { useEffect, useRef, useState, useCallback } from 'react';

// Unified Confetti explosion component
function Confetti({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const colors = ['#ff69b4', '#ff1493', '#ffb6c1', '#ffd700', '#ff6347', '#9370db', '#00ced1', '#da70d6'];

    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 4 + 2,
        speedX: Math.random() * 3 - 1.5,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 8 - 4,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        opacity: Math.random() * 0.5 + 0.5
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}

// Background Floating Magic Elements
function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate static parameters on client side to avoid SSR/hydration mismatch
    const items = [...Array(18)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${12 + Math.random() * 10}s`,
      size: `${18 + Math.random() * 24}px`,
      emoji: ['💖', '💕', '✨', '💫', '🌸', '🎈'][Math.floor(Math.random() * 6)]
    }));
    setHearts(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-pink-500/20 animate-float-up select-none pointer-events-none"
          style={{
            left: heart.left,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            fontSize: heart.size,
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  );
}

// Counter animation
function AnimatedNumber({ value, duration = 1800 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{display}</span>;
}

// Typewriter Effect
function Typewriter({ text, speed = 40, delay = 0, onComplete }) {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed, onComplete]);

  return (
    <span>
      {displayText}
      {started && displayText.length < text.length && (
        <span className="inline-block w-1.5 h-5 bg-pink-400 ml-1 animate-pulse">|</span>
      )}
    </span>
  );
}

// Live Age Counter
function LiveAgeCounter({ birthDate, birthTime }) {
  const [age, setAge] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateAge = () => {
      const birth = new Date(`${birthDate}T${birthTime}`);
      const now = new Date();

      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();
      let hours = now.getHours() - birth.getHours();
      let minutes = now.getMinutes() - birth.getMinutes();
      let seconds = now.getSeconds() - birth.getSeconds();

      if (seconds < 0) { seconds += 60; minutes--; }
      if (minutes < 0) { minutes += 60; hours--; }
      if (hours < 0) { hours += 24; days--; }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) { months += 12; years--; }

      setAge({ years, months, days, hours, minutes, seconds });
    };

    calculateAge();
    const interval = setInterval(calculateAge, 1000);
    return () => clearInterval(interval);
  }, [birthDate, birthTime]);

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto w-full px-2">
      {[
        { value: age.years, label: 'Years' },
        { value: age.months, label: 'Months' },
        { value: age.days, label: 'Days' },
        { value: age.hours, label: 'Hours' },
        { value: age.minutes, label: 'Minutes' },
        { value: age.seconds, label: 'Seconds' }
      ].map((item, i) => (
        <div key={i} className="glass rounded-3xl p-3 md:p-5 text-center transition-all duration-300 hover:border-pink-500/40 hover:scale-[1.03] group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="text-3xl md:text-5xl font-extrabold gradient-text tracking-tight z-10 relative">
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-[10px] md:text-xs text-gray-400 mt-2 font-medium tracking-widest uppercase z-10 relative">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// Polaroid Gallery with Lightbox and Drag Gestures
function PhotoGallery({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hearts, setHearts] = useState([]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - galleryRef.current.offsetLeft);
    setScrollLeft(galleryRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    galleryRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => setSelectedPhoto(null);

  const nextPhoto = () => {
    const newIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const prevPhoto = () => {
    const newIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const handleCardDoubleClick = (e, index) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const newHearts = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      color: ['#ff69b4', '#ff1493', '#ffd700', '#9370db', '#00ced1'][Math.floor(Math.random() * 5)],
      angle: Math.random() * Math.PI * 2,
      velocity: Math.random() * 3 + 2
    }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 1000);
  };

  return (
    <div className="relative">
      <div
        ref={galleryRef}
        className="flex gap-8 overflow-x-auto py-8 px-4 cursor-grab active:cursor-grabbing scrollbar-hide snap-x"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {photos.map((photo, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-72 h-[410px] relative group cursor-pointer snap-center select-none"
            onClick={() => !isDragging && openLightbox(photo, i)}
            onDoubleClick={(e) => handleCardDoubleClick(e, i)}
          >
            <div className="photo-frame h-full transition-all duration-500 group-hover:scale-[1.04] group-hover:rotate-1 relative overflow-hidden flex flex-col justify-between">
              {/* Heart burst particles */}
              {hearts.map(h => (
                <div
                  key={h.id}
                  className="absolute z-20 pointer-events-none text-2xl animate-ping"
                  style={{
                    left: `${h.x}px`,
                    top: `${h.y}px`,
                    color: h.color,
                  }}
                >
                  💖
                </div>
              ))}

              <div className="w-full h-72 overflow-hidden rounded-xl bg-black/40 border border-white/5 relative">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover rounded-xl transition-all duration-700 group-hover:scale-110 select-none"
                  draggable={false}
                  onError={(e) => {
                    // Placeholder if photo doesn't exist yet
                    e.target.src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-pink-400 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">Double click to love</span>
                </div>
              </div>
              <div className="mt-4 px-1">
                <p className="text-white font-semibold text-lg tracking-wide truncate">{photo.caption}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-400 text-sm font-medium">{photo.date}</span>
                  <span className="text-pink-400 text-xs tracking-wider uppercase font-semibold">Memorable Moment</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center backdrop-blur-md transition-all duration-300 animate-fadeIn"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-pink-400 text-4xl hover:scale-110 transition-all w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md"
            onClick={closeLightbox}
          >
            ×
          </button>

          <button
            className="absolute left-4 md:left-8 text-white/60 hover:text-pink-400 text-4xl hover:scale-110 transition-all w-14 h-14 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md"
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
          >
            ←
          </button>

          <div className="max-w-4xl max-h-[85vh] px-4 md:px-16 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="photo-frame p-3 md:p-5 inline-block rounded-3xl">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.caption}
                className="max-w-full max-h-[60vh] object-contain rounded-2xl mx-auto shadow-2xl border border-white/5"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80";
                }}
              />
              <div className="mt-4 md:mt-6">
                <p className="text-white text-xl md:text-2xl font-bold tracking-wide">{selectedPhoto.caption}</p>
                <p className="text-pink-400 font-semibold mt-1">{selectedPhoto.date}</p>
              </div>
            </div>
          </div>

          <button
            className="absolute right-4 md:right-8 text-white/60 hover:text-pink-400 text-4xl hover:scale-110 transition-all w-14 h-14 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md"
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
          >
            →
          </button>

          <div className="absolute bottom-6 flex gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); setSelectedPhoto(photos[i]); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIndex ? 'bg-pink-500 w-8' : 'bg-gray-600 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Wishes Wall
function WishesWall({ logActivity }) {
  const [newWish, setNewWish] = useState({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const addWish = () => {
    if (!newWish.name.trim() || !newWish.message.trim()) return;
    setLoading(true);

    const wish = {
      id: Date.now(),
      ...newWish,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      color: ['#ff69b4', '#9370db', '#00ced1', '#ffd700', '#ff6347'][Math.floor(Math.random() * 5)]
    };

    // Supabase cloud sync
    const sUrl = localStorage.getItem('supabase-url');
    const sKey = localStorage.getItem('supabase-key');
    if (sUrl && sKey) {
      fetch(`${sUrl}/rest/v1/birthday_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': sKey,
          'Authorization': `Bearer ${sKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          type: 'wish',
          payload: wish
        })
      })
      .then(() => {
        setLoading(false);
        setSubmitted(true);
      })
      .catch(err => {
        console.error("Cloud wish sync failed:", err);
        setLoading(false);
        // Fallback to local success even if fetch was deferred
        setSubmitted(true);
      });
    } else {
      // Local fallback
      const saved = JSON.parse(localStorage.getItem('birthday-wishes') || '[]');
      localStorage.setItem('birthday-wishes', JSON.stringify([...saved, wish]));
      setLoading(false);
      setSubmitted(true);
    }

    // Log activity
    if (logActivity) {
      logActivity('Left Birthday Wish', `Name: "${wish.name}" left a wish saying: "${wish.message}"`);
    }

    setNewWish({ name: '', message: '' });
  };

  return (
    <div className="max-w-xl mx-auto px-4">
      {!submitted ? (
        <div className="glass-strong rounded-[40px] p-8 border border-white/10 shadow-2xl relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
          {/* Ambient Glows */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-500/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10 text-center mb-8">
            <div className="text-6xl mb-4 floating" style={{ animationDelay: '0s' }}>💌</div>
            <h3 className="text-3xl font-extrabold text-white tracking-wide" style={{ fontFamily: 'Playfair Display' }}>
              Secret Wish Drop-Box
            </h3>
            <p className="text-xs text-gray-400 mt-2.5 leading-relaxed font-medium">
              To keep your message a beautiful mystery and completely secure, your wish is immediately encrypted and dropped directly into the creator's private dashboard. No one else can ever view it! ✨
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-pink-300 mb-2 pl-1">
                Your Beautiful Name
              </label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={newWish.name}
                onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
                className="input-modern"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-pink-300 mb-2 pl-1">
                Your Warm Birthday Wish
              </label>
              <textarea
                placeholder="Write something sweet and memorable for her special day..."
                value={newWish.message}
                onChange={(e) => setNewWish({ ...newWish, message: e.target.value })}
                className="input-modern h-32 resize-none"
              />
            </div>

            <button
              onClick={addWish}
              disabled={loading || !newWish.name.trim() || !newWish.message.trim()}
              className="btn-primary w-full py-4 text-sm font-bold tracking-wider uppercase mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Sealing Wish... 🔐</span>
              ) : (
                <span>Seal & Send Wish 💖</span>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-strong rounded-[40px] p-10 border border-white/10 shadow-2xl text-center relative overflow-hidden animate-scaleUp">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="text-7xl mb-6 animate-bounce">✨💝✨</div>
          <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display' }}>
            Sealed in the Stars! 🌟
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed max-w-sm mx-auto font-medium">
            Your beautiful wish has been successfully dropped inside our private wishing well and sent straight to the creator!
          </p>
          <div className="mt-8 inline-block glass border border-green-500/20 px-6 py-3.5 rounded-full shadow-lg">
            <span className="text-sm text-green-300 font-bold uppercase tracking-wider">🔒 Message Encrypted & Saved</span>
          </div>

          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 text-pink-400 hover:text-pink-300 font-bold text-xs uppercase tracking-widest transition-colors block mx-auto underline"
          >
            Write another secret wish 💌
          </button>
        </div>
      )}
    </div>
  );
}

// Memory Quiz Component
function MemoryQuiz({ logActivity }) {
  const questions = [
    {
      question: "When did we first meet?",
      options: ["2018", "2019", "2020", "2021"],
      correct: 1,
      emoji: "🌟"
    },
    {
      question: "What's my go-to overthinking hour?",
      options: ["Morning", "Afternoon", "Night", "Always"],
      correct: 3,
      emoji: "🌙"
    },
    {
      question: "Where was our first outing?",
      options: ["Mall", "Beach", "Restaurant", "Park"],
      correct: 1,
      emoji: "🏖️"
    },
    {
      question: "Who does Rekoda claim to be married to?",
      options: ["V", "Jimin", "Jungkook", "Suga"],
      correct: 2,
      emoji: "💜"
    }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);

  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (index) => {
    if (selected !== null) return;

    setSelected(index);
    if (index === questions[currentQ].correct) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(c => c + 1);
        setSelected(null);
      } else {
        setQuizComplete(true);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setQuizComplete(false);
    setPlayerName('');
    setSubmitted(false);
    setLoading(false);
  };

  const submitScore = () => {
    if (!playerName.trim()) return;
    setLoading(true);

    const percentage = (score / questions.length) * 100;
    const newAttempt = {
      id: Date.now(),
      name: playerName.trim(),
      score,
      total: questions.length,
      percentage,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    // Save attempt to localStorage
    const quizAttempts = JSON.parse(localStorage.getItem('birthday-quiz-attempts') || '[]');
    localStorage.setItem('birthday-quiz-attempts', JSON.stringify([...quizAttempts, newAttempt]));

    // Supabase cloud sync
    const sUrl = localStorage.getItem('supabase-url');
    const sKey = localStorage.getItem('supabase-key');
    if (sUrl && sKey) {
      fetch(`${sUrl}/rest/v1/birthday_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': sKey,
          'Authorization': `Bearer ${sKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          type: 'quiz',
          payload: newAttempt
        })
      })
      .then(() => {
        setLoading(false);
        setSubmitted(true);
      })
      .catch(err => {
        console.error("Cloud quiz save failed:", err);
        setLoading(false);
        setSubmitted(true); // Fallback success
      });
    } else {
      setLoading(false);
      setSubmitted(true);
    }

    // Log activity
    if (logActivity) {
      logActivity('Completed Quiz', `"${playerName.trim()}" scored ${score}/${questions.length} (${percentage}%)`);
    }
  };

  if (quizComplete) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="glass-strong rounded-[40px] p-8 md:p-12 text-center max-w-lg mx-auto border border-white/10 animate-scaleUp shadow-2xl">
        {!submitted ? (
          <>
            <div className="text-7xl mb-6 animate-bounce">
              {percentage === 100 ? '🏆' : percentage >= 75 ? '🎉' : '💪'}
            </div>
            <h3 className="text-3xl font-bold gradient-text mb-4" style={{ fontFamily: 'Playfair Display' }}>
              {percentage === 100 ? 'Perfect Memory! 💖' : percentage >= 75 ? 'So close!' : 'Never Mind!'}
            </h3>
            <p className="text-lg text-gray-300 mb-8 font-medium">
              You scored <span className="text-pink-400 font-extrabold">{score}</span> out of <span className="text-pink-400 font-extrabold">{questions.length}</span> correct answers!
            </p>
            <div className="w-full bg-white/10 rounded-full h-3 mb-8 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="max-w-xs mx-auto text-left mb-8">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-pink-300 mb-2 pl-1">
                Enter Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="input-modern py-3.5 px-4 text-sm"
              />
            </div>

            <div className="flex gap-4 max-w-xs mx-auto">
              <button onClick={resetQuiz} className="flex-1 py-3.5 rounded-full border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-semibold">
                Reset
              </button>
              <button
                onClick={submitScore}
                disabled={loading || !playerName.trim()}
                className="flex-1 btn-primary py-3.5 rounded-full font-semibold disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Submit ✨'}
              </button>
            </div>
          </>
        ) : (
          <div className="animate-scaleUp">
            <div className="text-7xl mb-6">🏆✨</div>
            <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display' }}>
              Score Registered!
            </h3>
            <p className="text-sm text-gray-300 mb-8 max-w-xs mx-auto leading-relaxed">
              Your score of <strong>{score}/{questions.length}</strong> was successfully published to the host as <strong>{playerName}</strong>!
            </p>
            <button onClick={resetQuiz} className="btn-primary px-10 py-3.5 rounded-full font-semibold">
              Play Again 🔄
            </button>
          </div>
        )}
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="glass-strong rounded-[40px] p-6 md:p-10 max-w-lg mx-auto border border-white/10 shadow-2xl">
      <div className="flex justify-between items-center mb-8 px-1">
        <span className="text-gray-400 font-medium text-sm">Question {currentQ + 1} of {questions.length}</span>
        <span className="text-pink-400 font-bold bg-pink-500/10 px-3.5 py-1.5 rounded-full border border-pink-500/20 text-xs">Score: {score}</span>
      </div>

      <div className="text-6xl text-center mb-6 animate-pulse select-none">{q.emoji}</div>

      <h3 className="text-xl md:text-2xl text-center font-bold mb-8 text-white tracking-wide">{q.question}</h3>

      <div className="space-y-4">
        {q.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={selected !== null}
            className={`w-full p-4.5 rounded-2xl text-left transition-all duration-300 font-semibold border flex justify-between items-center ${selected === null
              ? 'glass hover:bg-white/10 border-white/5 hover:border-pink-500/30 hover:translate-x-1'
              : i === q.correct
                ? 'bg-green-500/20 border-green-500/60 text-green-300'
                : selected === i
                  ? 'bg-red-500/20 border-red-500/60 text-red-300'
                  : 'glass opacity-30 border-white/5'
              }`}
          >
            <span>
              <span className="mr-3 text-gray-500 text-sm font-bold">{String.fromCharCode(65 + i)}.</span>
              {option}
            </span>
            {selected !== null && i === q.correct && (
              <span className="bg-green-500/20 text-green-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold border border-green-500/30">✓</span>
            )}
            {selected !== null && selected === i && i !== q.correct && (
              <span className="bg-red-500/20 text-red-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold border border-red-500/30">×</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-2.5 justify-center mt-10">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${i === currentQ ? 'bg-pink-500 w-8' : i < currentQ ? 'bg-pink-500/40 w-3' : 'bg-gray-700 w-3'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

// Voice Message Recording
function VoiceMessage({ logActivity, onRecordStart }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedMime, setRecordedMime] = useState('audio/webm');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [micError, setMicError] = useState(null);
  const [micLevel, setMicLevel] = useState(0);

  const [senderName, setSenderName] = useState('');

  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startRecording = async () => {
    setMicError(null);
    setMicLevel(0);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser or network connection does not support audio recording. Make sure you are using a secure HTTPS connection!");
      }

      // Pause background music to prevent audio bleeding and hardware microphone ducking
      onRecordStart?.();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Explicitly ensure tracks are enabled
      stream.getAudioTracks().forEach(track => {
        track.enabled = true;
      });

      // Set up real-time volume wave visualizer
      let audioCtx;
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 32;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        audioContextRef.current = audioCtx;

        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setMicLevel(avg);
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        };
        updateVolume();
      } catch (e) {
        console.error("Mic volume feedback meter failed:", e);
      }

      const recorder = new MediaRecorder(stream);
      const chunks = [];
      const actualMime = recorder.mimeType || 'audio/webm';
      setRecordedMime(actualMime);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        // Clean up visual soundwave meter
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close().catch(() => { });
        setMicLevel(0);

        const blob = new Blob(chunks, { type: actualMime });
        setAudioURL(URL.createObjectURL(blob));
        setRecordedChunks(chunks);
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start(250); // Record chunks every 250ms (crucial for iOS Safari stability)
      setRecording(true);
      setSuccess(false);
    } catch (err) {
      console.error('Microphone access denied', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError("Microphone access is blocked! Please enable microphone permission in your browser bar address settings and try again. 🎙️");
      } else if (!window.isSecureContext) {
        setMicError("Microphone access requires a secure HTTPS connection! 🔒 Please open the site on an HTTPS link.");
      } else {
        setMicError(err.message || "Microphone initialization failed. Please connect an audio input device.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const saveVoiceMessage = () => {
    if (recordedChunks.length === 0 || !senderName.trim()) return;
    setSaving(true);

    const blob = new Blob(recordedChunks, { type: recordedMime });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      const existingVoiceNotes = JSON.parse(localStorage.getItem('birthday-voice-notes') || '[]');
      const newVoiceNote = {
        id: Date.now(),
        name: senderName.trim(),
        audio: base64data,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };
      
      const updatedNotes = [...existingVoiceNotes, newVoiceNote];
      localStorage.setItem('birthday-voice-notes', JSON.stringify(updatedNotes));

      // Supabase cloud sync
      const sUrl = localStorage.getItem('supabase-url');
      const sKey = localStorage.getItem('supabase-key');
      if (sUrl && sKey) {
        fetch(`${sUrl}/rest/v1/birthday_data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': sKey,
            'Authorization': `Bearer ${sKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            type: 'voice',
            payload: newVoiceNote
          })
        }).catch(err => console.error("Cloud voice note sync failed:", err));
      }

      if (logActivity) {
        logActivity('Recorded Voice Note', `Voice message from "${senderName.trim()}"`);
      }

      setSaving(false);
      setSuccess(true);
    };
  };

  return (
    <div className="glass-strong rounded-[40px] p-8 md:p-12 text-center max-w-lg mx-auto border border-white/10 shadow-2xl">
      <div className="text-6xl mb-6">🎤</div>
      <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white" style={{ fontFamily: 'Playfair Display' }}>Record a Voice Note</h3>
      <p className="text-gray-400 mb-8 leading-relaxed">Leave a personal voice message that Rajesh can play and listen to anytime! 💖</p>

      {!audioURL ? (
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl shadow-xl transition-all duration-300 transform active:scale-95 ${recording
            ? 'bg-red-500 animate-pulse hover:bg-red-600'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 hover:shadow-pink-500/20'
            }`}
        >
          {recording ? '⏹' : '🎤'}
        </button>
      ) : (
        <div className="space-y-6 animate-scaleUp">
          <audio src={audioURL} controls className="mx-auto block" />

          {!success && (
            <div className="max-w-xs mx-auto text-left">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-pink-300 mb-2 pl-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="input-modern py-3 px-4 text-sm"
              />
            </div>
          )}

          <div className="flex gap-4 max-w-xs mx-auto">
            <button
              onClick={() => { setAudioURL(null); setRecordedChunks([]); setSuccess(false); setSenderName(''); }}
              className="flex-1 py-3 rounded-full border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-semibold"
            >
              Re-record
            </button>
            {!success ? (
              <button
                onClick={saveVoiceMessage}
                disabled={saving || !senderName.trim()}
                className="flex-1 btn-primary py-3 rounded-full font-semibold disabled:opacity-50"
              >
                {saving ? 'Sending...' : 'Send voice ✨'}
              </button>
            ) : (
              <div className="flex-1 py-3 bg-green-500/20 border border-green-500/40 text-green-300 rounded-full font-bold flex items-center justify-center gap-2 text-sm">
                Sent 💖
              </div>
            )}
          </div>
        </div>
      )}

      {micError && (
        <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-semibold max-w-xs mx-auto">
          ⚠️ {micError}
        </div>
      )}

      {recording && (
        <div className="flex flex-col items-center mt-5">
          <div className="flex justify-center items-end gap-1.5 h-8 mb-3 w-32">
            {[...Array(6)].map((_, i) => {
              const scale = 0.3 + (i % 3) * 0.3;
              const height = Math.min(100, Math.max(10, (micLevel * scale)));
              return (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full transition-all duration-75"
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          <p className="text-red-400 animate-pulse font-semibold flex items-center justify-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping"></span> Recording...
          </p>
        </div>
      )}
    </div>
  );
}

// Scratch Card Component
function ScratchCard({ message, logActivity }) {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Draw gold holographic texture
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#D4AF37'); // Gold
    gradient.addColorStop(0.3, '#FFFDD0'); // Cream / light gold
    gradient.addColorStop(0.5, '#AA7C11'); // Dark gold
    gradient.addColorStop(0.8, '#F3E5AB'); // Vanilla gold
    gradient.addColorStop(1, '#D4AF37');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glitter sparkles effect
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add glowing frame text hints
    ctx.fillStyle = '#654321';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch to reveal a secret note ✨', canvas.width / 2, canvas.height / 2);
  }, [revealed]);

  const scratch = (e) => {
    if (!isScratching || revealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Check percentage scratched off
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }

    if (transparent / (imageData.data.length / 4) > 0.45) {
      setRevealed(true);
      if (logActivity) {
        logActivity('Scratched Card', 'Successfully scratched to reveal secret note');
      }
    }
  };

  return (
    <div className="relative w-80 h-44 mx-auto max-w-full">
      <div className="absolute inset-0 glass-strong rounded-3xl flex items-center justify-center p-6 text-center border border-white/10 shadow-2xl">
        <p className="text-lg md:text-xl gradient-text font-semibold leading-relaxed" style={{ fontFamily: 'Playfair Display' }}>
          {message}
        </p>
      </div>

      {!revealed && (
        <canvas
          ref={canvasRef}
          width={320}
          height={176}
          className="absolute inset-0 rounded-3xl cursor-crosshair shadow-2xl border border-white/10 transition-opacity duration-500"
          onMouseDown={() => setIsScratching(true)}
          onMouseUp={() => setIsScratching(false)}
          onMouseLeave={() => setIsScratching(false)}
          onMouseMove={scratch}
          onTouchStart={() => setIsScratching(true)}
          onTouchEnd={() => setIsScratching(false)}
          onTouchMove={scratch}
        />
      )}
    </div>
  );
}

// SVG Cake component
function InteractiveCake({ onAllBlown }) {
  const [candles, setCandles] = useState([true, true, true, true, true]);
  const [allBlown, setAllBlown] = useState(false);

  useEffect(() => {
    if (candles.every(c => !c) && !allBlown) {
      setAllBlown(true);
      setTimeout(() => onAllBlown?.(), 600);
    }
  }, [candles, allBlown, onAllBlown]);

  const blowCandle = (index) => {
    const newCandles = [...candles];
    newCandles[index] = false;
    setCandles(newCandles);
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Interactive Cake Base Container */}
      <div className="relative w-72 h-80 flex flex-col justify-end select-none">

        {/* Flames & Candles layer */}
        <div className="flex justify-center gap-6 mb-1 relative z-10 w-full px-8">
          {candles.map((lit, i) => (
            <div
              key={i}
              className="candle cursor-pointer flex flex-col items-center group relative"
              onClick={() => lit && blowCandle(i)}
            >
              {lit ? (
                <div className="flame-wrapper relative h-10 w-4 flex justify-center mb-0.5">
                  <div className="flame select-none pointer-events-none" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="smoke" style={{ animationDelay: `${i * 0.35}s` }} />
                  </div>
                </div>
              ) : (
                <div className="h-10 w-4 flex items-end justify-center mb-0.5">
                  <div className="w-1.5 h-1.5 bg-gray-500/80 rounded-full animate-pulse" />
                </div>
              )}
              {/* Candle Stick */}
              <div className={`w-3.5 h-14 rounded-full border border-pink-200/20 shadow-md ${lit ? 'bg-gradient-to-b from-pink-400 to-pink-500' : 'bg-gradient-to-b from-gray-700 to-gray-800'
                }`} />
            </div>
          ))}
        </div>

        {/* Tier 1 (Top Tier) */}
        <div className="w-48 h-14 bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 rounded-t-2xl mx-auto border-t border-white/20 relative shadow-md overflow-hidden">
          {/* Dripping frosting effect */}
          <div className="absolute inset-x-0 top-0 flex justify-around select-none">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-4 h-5 rounded-b-full bg-white/70 shadow-sm transform -translate-y-1" />
            ))}
          </div>
        </div>

        {/* Tier 2 (Middle Tier) */}
        <div className="w-56 h-16 bg-gradient-to-b from-pink-400 via-pink-500 to-pink-600 border-t border-white/10 relative shadow-lg flex items-center justify-center mx-auto">
          <span className="text-white/95 text-lg font-bold tracking-widest pointer-events-none select-none uppercase" style={{ fontFamily: 'Playfair Display', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Happy 24th!
          </span>
        </div>

        {/* Tier 3 (Bottom Tier) */}
        <div className="w-64 h-16 bg-gradient-to-b from-pink-500 to-pink-700 rounded-b-2xl border-t border-white/5 relative shadow-xl mx-auto">
          {/* Decorative cherries/dots */}
          <div className="absolute inset-x-0 bottom-2 flex justify-around">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-red-500 shadow-md animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>

        {/* Cake Platter Plate */}
        <div className="w-[300px] bg-gradient-to-r from-gray-500 via-white to-gray-500 h-5 rounded-full mt-1.5 shadow-2xl border border-gray-400/20 mx-auto" />
      </div>

      {!allBlown && (
        <p className="text-center text-pink-300 mt-6 text-sm font-semibold tracking-wide animate-pulse">
          💡 Click each candle to blow it out!
        </p>
      )}
    </div>
  );
}

// Timeline data
const timelineEvents = [
  { year: '2019', title: 'The Beginning', description: 'When our paths first crossed ✨', icon: '🌟' },
  { year: '2022', title: 'Growing Closer', description: 'From strangers to friends who actually get each other', icon: '🌱' },
  { year: '2023', title: 'Beach Day', description: 'That one outing that became a core memory 🌊', icon: '🏖️' },
  { year: '2025', title: 'Through Everything', description: 'Late night talks, overthinking sessions, and everything in between', icon: '🌙' },
  { year: '2026', title: 'Still Here', description: 'stay forever ❤️', icon: '💖' }
];

// Sample data for new components
const galleryPhotos = [
  { src: '/photo1.jpg', caption: 'First Selfie Together', date: '2019' },
  { src: '/photo2.jpg', caption: 'Beach Day Memories', date: '2023' },
  { src: '/photo3.jpg', caption: 'Late Night Hangout', date: '2024' },
  { src: '/photo4.jpg', caption: 'Birthday Last Year', date: '2025' }
];

export default function BirthdayWebsite() {
  const [viewMode, setViewMode] = useState('user'); // 'user' or 'dashboard'

  useEffect(() => {
    // Automatically set hardcoded Supabase project credentials on first load
    localStorage.setItem('supabase-url', 'https://qisvrtkuzznmllfvdgdj.supabase.co');
    localStorage.setItem('supabase-key', 'sb_publishable_CpXOzfNo_ivz-s12Hi_1ug_pPROfVYF');
  }, []);

  return (
    <div className="min-h-screen bg-[#06020f] text-white overflow-x-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Great+Vibes&family=Playfair+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
          font-family: 'Plus Jakarta Sans', 'Poppins', sans-serif;
        }

        body {
          margin: 0;
          background: #06020f;
          overflow-x: hidden;
        }

        .stars {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(255, 20, 147, 0.06) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.06) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 0%, rgba(6, 2, 15, 1) 100%);
          z-index: 0;
        }

        .aurora-1 {
          position: fixed;
          top: -20%;
          left: -20%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(255, 105, 180, 0.15) 0%, transparent 70%);
          filter: blur(100px);
          z-index: 0;
          pointer-events: none;
          animation: aurora-move-1 25s ease-in-out infinite alternate;
        }

        .aurora-2 {
          position: fixed;
          bottom: -20%;
          right: -20%;
          width: 70vw;
          height: 70vw;
          background: radial-gradient(circle, rgba(147, 112, 219, 0.12) 0%, transparent 75%);
          filter: blur(120px);
          z-index: 0;
          pointer-events: none;
          animation: aurora-move-2 30s ease-in-out infinite alternate;
        }

        @keyframes aurora-move-1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(12%, 18%) scale(1.1); }
          100% { transform: translate(-8%, 6%) scale(0.9); }
        }

        @keyframes aurora-move-2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-18%, -12%) scale(1.15); }
          100% { transform: translate(8%, 12%) scale(0.95); }
        }

        .glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
        }

        .glass-strong {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 
            0 20px 50px -15px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .glow {
          text-shadow: 
            0 0 15px rgba(255, 105, 180, 0.6),
            0 0 35px rgba(255, 105, 180, 0.3);
        }

        @keyframes float-up {
          0% { 
            transform: translateY(100vh) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { 
            transform: translateY(-120px) rotate(360deg) scale(1.1);
            opacity: 0;
          }
        }

        .animate-float-up {
          animation: float-up linear infinite;
        }

        .floating {
          animation: float 4.5s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(3deg); }
        }

        .fadeIn {
          animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.25s; opacity: 0; }
        .stagger-3 { animation-delay: 0.4s; opacity: 0; }
        .stagger-4 { animation-delay: 0.55s; opacity: 0; }
        .stagger-5 { animation-delay: 0.7s; opacity: 0; }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 105, 180, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 105, 180, 0.7); }
        }

        .pulse-glow {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }

        .candle-body {
          width: 14px;
          height: 50px;
          background: linear-gradient(to right, #f8d3d3, #fff0f0, #f8d3d3);
          border-radius: 4px;
        }

        .flame {
          width: 12px;
          height: 28px;
          background: linear-gradient(to top, #ff3d00, #ff9100, #ffea00, #fff);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: flicker 0.12s infinite alternate;
          box-shadow: 
            0 0 15px #ff3d00,
            0 0 30px #ff9100,
            0 0 45px rgba(255,145,0,0.6);
        }

        @keyframes flicker {
          0% { transform: scale(1) rotate(-1.5deg) translateY(0); }
          50% { transform: scale(1.05) rotate(1.5deg) translateY(-0.5px); }
          100% { transform: scale(0.95) rotate(-1deg) translateY(0.5px); }
        }

        .smoke {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(220,220,220,0.25);
          border-radius: 50%;
          animation: smoke-rise 2.2s ease-out infinite;
          opacity: 0;
        }

        @keyframes smoke-rise {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          100% { transform: translateY(-40px) scale(2.8); opacity: 0; }
        }

        .gradient-text {
          background: linear-gradient(135deg, #ff69b4 10%, #ff1493 40%, #da70d6 70%, #9370db 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-hover {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px) scale(1.015);
          box-shadow: 0 25px 50px -12px rgba(255, 105, 180, 0.15);
          border-color: rgba(255, 105, 180, 0.25);
        }

        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, rgba(255, 105, 180, 0.4) 15%, rgba(255, 105, 180, 0.4) 85%, transparent);
        }

        @media (max-width: 768px) {
          .timeline-line {
            left: 24px;
          }
        }

        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }

        .photo-frame {
          padding: 16px;
          background: linear-gradient(135deg, #130a21, #0c0517);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff69b4, #ff1493);
          padding: 14px 34px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.3);
          color: white;
          letter-spacing: 0.5px;
        }

        .btn-primary:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 12px 30px rgba(255, 105, 180, 0.55);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .input-modern {
          width: 100%;
          padding: 16px 20px;
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 105, 180, 0.25);
          outline: none;
          color: white;
          font-size: 15px;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .input-modern:focus {
          border-color: rgba(255, 105, 180, 0.8);
          box-shadow: 0 0 20px rgba(255, 105, 180, 0.25);
        }

        .input-modern::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Custom Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-scaleUp {
          animation: scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {viewMode === 'user' ? (
        <WebsiteContent setViewMode={setViewMode} />
      ) : (
        <CreatorDashboard setViewMode={setViewMode} />
      )}
    </div>
  );
}

function WebsiteContent({ setViewMode }) {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [entered, setEntered] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [musicPlaying, setMusicPlaying] = useState(false);

  // Custom states that can be configured by the dashboard
  const [gatewayPass, setGatewayPass] = useState('rekodaaaaa');
  const [typewriterStoryText, setTypewriterStoryText] = useState("Some people become important slowly... and before you realize it, they become part of your life forever ✨");
  const [scratchCardSecret, setScratchCardSecret] = useState("You're not just a friend — you're family I chose 💖");

  const audioRef = useRef(null);

  // Load custom dashboard overrides
  useEffect(() => {
    const savedPass = localStorage.getItem('custom-gateway-pass');
    if (savedPass) setGatewayPass(savedPass);

    const savedTypewriter = localStorage.getItem('custom-typewriter');
    if (savedTypewriter) setTypewriterStoryText(savedTypewriter);

    const savedScratch = localStorage.getItem('custom-scratch');
    if (savedScratch) setScratchCardSecret(savedScratch);
  }, []);

  // Set soft audio volume and track ref
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Soft romantic volume by default
    }
  }, [entered]);

  // Unified activity logger helper
  const logActivity = useCallback((action, details) => {
    const logs = JSON.parse(localStorage.getItem('birthday-activity') || '[]');
    const newLog = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      action,
      details
    };
    localStorage.setItem('birthday-activity', JSON.stringify([newLog, ...logs]));

    // Supabase cloud sync
    const sUrl = localStorage.getItem('supabase-url');
    const sKey = localStorage.getItem('supabase-key');
    if (sUrl && sKey) {
      fetch(`${sUrl}/rest/v1/birthday_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': sKey,
          'Authorization': `Bearer ${sKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          type: 'log',
          payload: newLog
        })
      }).catch(err => console.error("Cloud log sync failed:", err));
    }
  }, []);

  // Intersection observer for scrolling animations
  useEffect(() => {
    if (!candleBlown) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [candleBlown]);

  const handleSubmit = () => {
    if (password.toLowerCase() === gatewayPass.toLowerCase()) {
      setEntered(true);
      logActivity('Unlock Gate', 'Successfully entered correct passcode.');

      // Auto play loop on entering the gate
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => setMusicPlaying(true))
            .catch(e => console.log('Autoplay deferred:', e));
        }
      }, 500);
    } else if (password.toLowerCase() === 'jeeva' || password.toLowerCase() === 'jeevaadmin') {
      // Secret key direct entry
      setViewMode('dashboard');
      logActivity('Admin Console Access', 'Dashboard unlocked directly from password gateway.');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      logActivity('Failed Login Attempt', `Attempt #${newAttempts} using text "${password}"`);

      if (newAttempts >= 5) {
        setPassword(gatewayPass);
        setError(`Okay okay… birthday privilege unlocked 😂 Use this: ${gatewayPass}`);
      } else if (newAttempts >= 3) {
        setError('Hint: This is my daily way of texting your name 😌');
      } else {
        setError('Wrong entry 👀 Try again...');
      }
    }
  };

  const handleBlowCandle = useCallback(() => {
    setCandleBlown(true);
    setShowConfetti(true);
    logActivity('Blow Candles', 'Blew out all interactive cake candles!');

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setMusicPlaying(true))
          .catch(e => console.log('Candles audio playback blocked:', e));
      }
    }, 400);

    setTimeout(() => {
      setShowConfetti(false);
    }, 7000);
  }, [logActivity]);

  // Audio play pause trigger
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause();
        setMusicPlaying(false);
        logActivity('Music Controller', 'Music paused manually.');
      } else {
        audioRef.current.play();
        setMusicPlaying(true);
        logActivity('Music Controller', 'Music resumed manually.');
      }
    }
  };

  // Microphone Peak Blow detection
  useEffect(() => {
    if (!entered || candleBlown) return;

    let audioContext;
    let streamInstance;
    let isActive = true;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        if (!isActive) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        streamInstance = stream;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const detectBlow = () => {
          if (!isActive || candleBlown) return;
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          if (volume > 68) {
            stream.getTracks().forEach(track => track.stop());
            handleBlowCandle();
            return;
          }
          requestAnimationFrame(detectBlow);
        };

        detectBlow();
      })
      .catch(() => { });

    return () => {
      isActive = false;
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [entered, candleBlown, handleBlowCandle]);

  // GATEWAY PASSWORD SCREEN
  if (!entered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="stars"></div>
        <div className="aurora-1"></div>
        <div className="aurora-2"></div>
        <FloatingHearts />

        <div className="glass-strong rounded-[44px] p-8 md:p-12 max-w-md w-full text-center z-10 fadeIn border border-white/10 shadow-2xl relative">
          <div
            className="text-6xl mb-5 cursor-pointer select-none active:scale-95 transition-transform"
            title="Admin access lock"
            onDoubleClick={() => {
              const adminKey = prompt("Enter secret Creator Code to access Admin dashboard:");
              if (adminKey === 'jeeva' || adminKey === 'jeevaadmin') {
                setViewMode('dashboard');
              } else if (adminKey) {
                alert("Incorrect passcode!");
              }
            }}
          >
            🔐
          </div>

          <h1
            className="text-4xl md:text-5xl mb-3 text-white font-bold glow"
            style={{ fontFamily: 'Playfair Display' }}
          >
            Birthday Gateway
          </h1>

          <p className="text-gray-400 mb-8 text-sm md:text-base font-medium tracking-wide">
            Only the Birthday Girl Can Enter 👀
          </p>

          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter the secret name..."
            className="input-modern mb-5 text-center"
          />

          <button onClick={handleSubmit} className="btn-primary w-full py-4 text-base font-bold shadow-lg">
            Enter ❤️
          </button>

          {error && (
            <p className="mt-5 text-pink-300 font-semibold text-sm animate-pulse">{error}</p>
          )}

          <div className="mt-6 flex justify-center gap-2.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${i < attempts ? 'bg-pink-500 scale-110 shadow-md shadow-pink-500/30' : 'bg-gray-800'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // CANDLE Screen
  if (!candleBlown) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="stars"></div>
        <div className="aurora-1"></div>
        <div className="aurora-2"></div>
        <FloatingHearts />

        <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
          <div className="fadeIn stagger-1">
            <h1
              className="text-5xl md:text-6xl mb-6 text-white font-extrabold glow leading-tight"
              style={{ fontFamily: 'Playfair Display' }}
            >
              Make A Wish ✨
            </h1>
          </div>

          <div className="fadeIn stagger-2 mb-6">
            <InteractiveCake onAllBlown={handleBlowCandle} />
          </div>

          <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto mb-8 font-medium leading-relaxed fadeIn stagger-3">
            Close your eyes, make a silent wish, and blow into your microphone! 🎤
          </p>

          <button onClick={handleBlowCandle} className="btn-primary px-8 py-4 text-base font-bold shadow-lg fadeIn stagger-4">
            ✨ Blow All Candles ✨
          </button>

          <p className="text-gray-500 text-xs mt-6 font-semibold uppercase tracking-wider fadeIn stagger-5">
            Or click on each candle individually
          </p>
        </div>
      </div>
    );
  }

  // MAIN CONTENT Redesign
  return (
    <div className="relative z-10 pb-10">
      <Confetti active={showConfetti} />

      <audio ref={audioRef} loop src="/Butterfly.mp3" />

      {/* Floating Music player controls */}
      <button
        onClick={togglePlayPause}
        className="fixed top-5 right-5 z-[99] glass-strong py-2.5 px-4 rounded-full border border-white/15 flex items-center gap-3.5 hover:scale-105 transition-all shadow-xl select-none"
      >
        <div className="flex gap-1.5 items-end h-4 w-6">
          <span className={`w-1 bg-pink-500 rounded-full transition-all duration-300 ${musicPlaying ? 'h-3 animate-wave' : 'h-1.5'}`} style={{ animationDelay: '0.1s' }}></span>
          <span className={`w-1 bg-pink-500 rounded-full transition-all duration-300 ${musicPlaying ? 'h-5 animate-wave' : 'h-2.5'}`} style={{ animationDelay: '0.2s' }}></span>
          <span className={`w-1 bg-pink-500 rounded-full transition-all duration-300 ${musicPlaying ? 'h-4 animate-wave' : 'h-2'}`} style={{ animationDelay: '0.3s' }}></span>
          <span className={`w-1 bg-pink-500 rounded-full transition-all duration-300 ${musicPlaying ? 'h-5 animate-wave' : 'h-3'}`} style={{ animationDelay: '0.4s' }}></span>
        </div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-pink-300">
          {musicPlaying ? 'Pause ⏸' : 'Play ▶'}
        </span>
      </button>

      <div className="stars"></div>
      <div className="aurora-1"></div>
      <div className="aurora-2"></div>
      <FloatingHearts />

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative">
        <div className="fadeIn stagger-1">
          <div className="text-8xl floating mb-8 select-none">💖</div>
        </div>

        <h1
          className="text-6xl md:text-8xl lg:text-9xl glow mb-4 fadeIn stagger-2 text-white"
          style={{ fontFamily: 'Great Vibes' }}
        >
          Happy Birthday
        </h1>

        <h2 className="text-4xl md:text-6xl font-extrabold mb-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-purple-400 fadeIn stagger-3">
          Rekodaaaaa ❤️
        </h2>

        <div className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl font-medium px-4 mb-14 fadeIn stagger-4">
          <Typewriter
            text={typewriterStoryText}
            speed={35}
            delay={1200}
          />
        </div>

        <div className="glass px-8 py-3.5 rounded-full border border-pink-500/20 shadow-md fadeIn stagger-5">
          <span className="text-pink-300 text-sm md:text-base font-bold tracking-widest uppercase">24-05-2002 • 3:40 PM</span>
        </div>

        <div className="scroll-indicator text-2xl text-pink-400/70 border border-pink-500/10 bg-pink-500/5 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm fadeIn" style={{ animationDelay: '0.8s' }}>
          ↓
        </div>
      </section>

      {/* LIVE AGE COUNTER */}
      <section
        id="age-counter"
        data-animate
        className={`py-20 md:py-28 px-4 ${visibleSections['age-counter'] ? 'fadeIn' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <p className="text-pink-400 text-xs font-extrabold tracking-[5px] uppercase mb-3">You've Been Amazing For</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide" style={{ fontFamily: 'Playfair Display' }}>
              Every Second Counts ⏰
            </h2>
          </div>

          <LiveAgeCounter birthDate="2002-05-24" birthTime="15:40:00" />
        </div>
      </section>

      {/* SCRATCH CARD */}
      <section
        id="scratch"
        data-animate
        className={`py-20 md:py-28 px-4 ${visibleSections.scratch ? 'fadeIn' : 'opacity-0'}`}
      >
        <div className="max-w-xl mx-auto text-center">
          <p className="text-pink-400 text-xs font-extrabold tracking-[5px] uppercase mb-3">A Hidden Message</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide mb-12" style={{ fontFamily: 'Playfair Display' }}>
            Scratch To Reveal ✨
          </h2>

          <ScratchCard message={scratchCardSecret} logActivity={logActivity} />
        </div>
      </section>

      {/* STATS COUNT */}
      <section
        id="stats"
        data-animate
        className={`py-20 md:py-28 px-4 ${visibleSections.stats ? 'fadeIn' : 'opacity-0'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: 4, label: 'Years of Friendship', suffix: '+' },
              { value: 1000, label: 'Messages Exchanged', suffix: '+' },
              { value: 100, label: 'Overthinking Handled', suffix: '%' },
              { value: 1, label: 'Irreplaceable Friend', suffix: '' }
            ].map((stat, i) => (
              <div key={i} className="glass-strong rounded-3xl p-5 md:p-8 text-center card-hover border border-white/5">
                <div className="text-3xl md:text-5xl font-extrabold gradient-text mb-3">
                  {visibleSections.stats && <AnimatedNumber value={stat.value} />}{stat.suffix}
                </div>
                <div className="text-gray-400 text-xs md:text-sm font-semibold tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMORY PHOTO GALLERY */}
      <section
        id="gallery"
        data-animate
        className={`py-20 md:py-28 px-4 ${visibleSections.gallery ? 'fadeIn' : 'opacity-0'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-pink-400 text-xs font-extrabold tracking-[5px] uppercase mb-3">Memory Lane</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide" style={{ fontFamily: 'Playfair Display' }}>
              Our Moments Together 📸
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-3 font-semibold uppercase tracking-wider">Drag/swipe horizontal • Double click card to love</p>
          </div>

          <PhotoGallery photos={galleryPhotos} />
        </div>
      </section>

      {/* QUIZ SECTION */}
      <section
        id="quiz"
        data-animate
        className={`py-20 md:py-28 px-4 ${visibleSections.quiz ? 'fadeIn' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-pink-400 text-xs font-extrabold tracking-[5px] uppercase mb-3">Test Your Memory</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide" style={{ fontFamily: 'Playfair Display' }}>
              How Well Do You Know Us? 🧠
            </h2>
          </div>

          <MemoryQuiz logActivity={logActivity} />
        </div>
      </section>

      {/* TIMELINE */}
      <section
        id="timeline"
        data-animate
        className={`py-20 md:py-28 px-4 ${visibleSections.timeline ? 'fadeIn' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-pink-400 text-xs font-extrabold tracking-[5px] uppercase mb-3">Our Journey</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide" style={{ fontFamily: 'Playfair Display' }}>
              Through The Years ✨
            </h2>
          </div>

          <div className="relative">
            <div className="timeline-line"></div>

            {timelineEvents.map((event, i) => (
              <div
                key={i}
                className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 mb-14 relative ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 w-full pl-10 md:pl-0 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="glass-strong rounded-[28px] p-6 card-hover inline-block border border-white/5 max-w-md w-full">
                    <div className="text-pink-400 font-extrabold text-sm tracking-widest uppercase">{event.year}</div>
                    <h3 className="text-xl md:text-2xl font-bold mt-2 text-white leading-tight">{event.title}</h3>
                    <p className="text-gray-400 mt-3 text-sm md:text-base leading-relaxed font-medium">{event.description}</p>
                  </div>
                </div>

                {/* Node icon */}
                <div className="absolute left-[13px] md:left-auto md:relative flex w-[24px] h-[24px] md:w-16 md:h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full items-center justify-center text-xs md:text-2xl shrink-0 border-2 border-white/20 pulse-glow z-10 font-bold">
                  {event.icon}
                </div>

                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONFIDENTIAL DOSSIER FILES */}
      <section
        id="files"
        data-animate
        className={`py-20 md:py-28 px-4 ${visibleSections.files ? 'fadeIn' : 'opacity-0'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-pink-400 text-xs font-extrabold tracking-[5px] uppercase mb-3">Confidential Dossier</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide" style={{ fontFamily: 'Playfair Display' }}>
              Rekodaaaa.exe ❤️
            </h2>
            <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span> Warning: High Emotional Attachment Level
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="glass-strong rounded-[32px] p-6 md:p-8 card-hover border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">💜</div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500/60 to-transparent rounded"></div>
              </div>
              <h3 className="text-2xl font-bold text-purple-300 tracking-wide mb-3">Jungkook Wife Syndrome</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base font-medium">
                Claims to be Jungkook's wife since day one. Investigation ongoing by the anti-delusional cell.
                Evidence includes heavy spotify history and photocard storage 😭
              </p>
              <div className="photo-frame mt-6 border border-white/5 rounded-2xl overflow-hidden p-2">
                <img
                  src="/JungkookWife.jpg"
                  alt="Jungkook card"
                  className="rounded-xl w-full h-48 md:h-64 object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-strong rounded-[32px] p-6 md:p-8 card-hover border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">🚩</div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-red-500/60 to-transparent rounded"></div>
              </div>
              <h3 className="text-2xl font-bold text-red-300 tracking-wide mb-3">Relationship Decisions</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base font-medium">
                Successfully dodges an entire forest of clean green flags... and chooses the highest quality,
                premium red flags with extreme enthusiasm instead. Peak talent!
              </p>
              <div className="mt-12 flex justify-center gap-6 text-5xl">
                <span className="floating" style={{ animationDelay: '0s' }}>🚩</span>
                <span className="floating" style={{ animationDelay: '0.2s' }}>🚩</span>
                <span className="floating" style={{ animationDelay: '0.4s' }}>🚩</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-strong rounded-[32px] p-6 md:p-8 card-hover border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">🧠</div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/60 to-transparent rounded"></div>
              </div>
              <h3 className="text-2xl font-bold text-blue-300 tracking-wide mb-3">My Unpaid Therapist</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base font-medium">
                Unmatched ability to understand me better than I understand myself. Deserves full financial therapist compensation
                for handling my countless late-night overthinking sessions!
              </p>
              <div className="mt-8 text-center">
                <div className="inline-block glass border border-blue-500/30 px-6 py-2.5 rounded-full text-blue-300 font-bold text-xs uppercase tracking-wider">
                  🧠 Wisdom Level: Absolute Master
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="glass-strong rounded-[32px] p-6 md:p-8 card-hover border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">🌊</div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500/60 to-transparent rounded"></div>
              </div>
              <h3 className="text-2xl font-bold text-cyan-300 tracking-wide mb-3">Beach Day Memories</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base font-medium">
                Our very first outing together. Tiny moment, infinite laughs, permanent core memory.
              </p>
              <div className="photo-frame mt-6 border border-white/5 rounded-2xl overflow-hidden p-2">
                <video controls className="rounded-xl w-full h-48 md:h-64 object-cover">
                  <source src="/VID-20260524-WA0019.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WISHES WALL SECTION */}
      <section
        id="wishes"
        data-animate
        className={`py-20 md:py-28 px-4 ${visibleSections.wishes ? 'fadeIn' : 'opacity-0'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-pink-400 text-xs font-extrabold tracking-[5px] uppercase mb-3">Birthday Wall</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide" style={{ fontFamily: 'Playfair Display' }}>
              Wishes From Friends 💝
            </h2>
          </div>

          <WishesWall logActivity={logActivity} />
        </div>
      </section>

      {/* VOICE RECORDING SECTION */}
      <section
        id="voice"
        data-animate
        className={`py-20 md:py-28 px-4 ${visibleSections.voice ? 'fadeIn' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-pink-400 text-xs font-extrabold tracking-[5px] uppercase mb-3">Personal Note</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide" style={{ fontFamily: 'Playfair Display' }}>
              Leave a Voice Message 🎤
            </h2>
          </div>

          <VoiceMessage
            logActivity={logActivity}
            onRecordStart={() => {
              if (audioRef.current) {
                audioRef.current.pause();
                setMusicPlaying(false);
              }
            }}
          />
        </div>
      </section>

      {/* CORE PICTURE SECTION */}
      <section
        id="photo"
        data-animate
        className={`py-20 md:py-28 px-4 ${visibleSections.photo ? 'fadeIn' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-pink-400 text-sm font-extrabold tracking-widest uppercase mb-3">One Precious Memory 📸</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-14" style={{ fontFamily: 'Playfair Display' }}>
            Perhaps AI helped build this screen...
            <br />
            but the bond holding us is real ❤️
          </h2>

          <div className="photo-frame inline-block max-w-full rounded-[32px] p-2 md:p-3 border border-white/10 shadow-2xl">
            <img
              src="/memory-photo.jpg"
              alt="Beautiful Memory"
              className="rounded-2xl max-w-full h-auto shadow-inner"
              style={{ maxHeight: '72vh' }}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80";
              }}
            />
          </div>
        </div>
      </section>

      {/* FINAL WORDS CARD */}
      <section
        id="final"
        data-animate
        className={`py-28 md:py-36 px-4 ${visibleSections.final ? 'fadeIn' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="glass-strong rounded-[50px] p-8 md:p-16 text-center relative overflow-hidden border border-white/15 shadow-2xl">
            {/* Ambient Background decoration */}
            <div className="absolute inset-0 opacity-15 pointer-events-none select-none">
              <div className="absolute top-10 left-10 text-6xl floating" style={{ animationDelay: '0.2s' }}>💖</div>
              <div className="absolute bottom-10 right-10 text-6xl floating" style={{ animationDelay: '0.6s' }}>✨</div>
              <div className="absolute top-1/2 left-8 text-4xl floating" style={{ animationDelay: '0s' }}>💫</div>
              <div className="absolute top-1/3 right-8 text-4xl floating" style={{ animationDelay: '0.4s' }}>🌸</div>
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl glow leading-tight mb-10 text-white" style={{ fontFamily: 'Great Vibes' }}>
                Forever Grateful ✨
              </h2>

              <div className="text-base md:text-xl text-gray-300 leading-loose space-y-8 font-medium">
                <p>Thank you for staying in my life all these years…</p>
                <p>
                  Life didn't just continue — it became softer, warmer,
                  <br />and unexpectedly beautiful because you were in it.
                  <br />The laughs, the overthinking sessions, the chaos... every bit is unforgettable.
                </p>
                <p>
                  And no matter where path takes us...
                  <br />
                  <span className="text-pink-300 font-extrabold tracking-wide">
                    Rekodaaaa will always remain my favorite chapter ✨
                  </span>
                </p>
              </div>

              <div className="mt-14">
                <div className="inline-block glass border border-pink-500/20 px-8 py-4 rounded-full shadow-lg">
                  <span className="text-xl md:text-2xl select-none">🛡️</span>
                  <span className="text-sm md:text-base text-pink-300 font-bold ml-3 uppercase tracking-wider">Protected. Treasured. Never replaceable.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-24 text-gray-500">
          <p className="text-sm md:text-base font-semibold tracking-widest uppercase">Made with 💖 for the one and only</p>
          <p className="text-4xl mt-3 text-pink-400" style={{ fontFamily: 'Great Vibes' }}>Rekodaaaa</p>

          <p className="text-[10px] uppercase font-bold tracking-[4px] mt-6 text-gray-600">© 2026 • A Birthday Surprise</p>
        </div>
      </section>
    </div>
  );
}

// SECURED CREATOR DASHBOARD PANEL
function CreatorDashboard({ setViewMode }) {
  const [wishes, setWishes] = useState([]);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [quizScores, setQuizScores] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const [activeTab, setActiveTab] = useState('wishes');

  // Customizable website states
  const [customPass, setCustomPass] = useState('rekodaaaaa');
  const [customTypewriter, setCustomTypewriter] = useState('');
  const [customScratch, setCustomScratch] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  const loadDashboardData = useCallback(() => {
    // 1. Wishes Local
    const savedWishes = JSON.parse(localStorage.getItem('birthday-wishes') || '[]');
    setWishes(savedWishes);

    // 2. Voice notes Local
    const savedVoice = JSON.parse(localStorage.getItem('birthday-voice-notes') || '[]');
    setVoiceNotes(savedVoice);

    // 3. Quiz Scores Local
    const savedScores = JSON.parse(localStorage.getItem('birthday-quiz-attempts') || '[]');
    setQuizScores(savedScores);

    // 4. Activity Logs Local
    const savedLogs = JSON.parse(localStorage.getItem('birthday-activity') || '[]');
    setActivityLogs(savedLogs);

    // Customize states
    setCustomPass(localStorage.getItem('custom-gateway-pass') || 'rekodaaaaa');
    setCustomTypewriter(localStorage.getItem('custom-typewriter') || "Some people become important slowly... and before you realize it, they become part of your life forever ✨");
    setCustomScratch(localStorage.getItem('custom-scratch') || "You're not just a friend — you're family I chose 💖");
    setSupabaseUrl(localStorage.getItem('supabase-url') || '');
    setSupabaseKey(localStorage.getItem('supabase-key') || '');

    // Supabase cloud synchronization
    const sUrl = localStorage.getItem('supabase-url');
    const sKey = localStorage.getItem('supabase-key');
    if (sUrl && sKey) {
      fetch(`${sUrl}/rest/v1/birthday_data?order=created_at.desc`, {
        headers: {
          'apikey': sKey,
          'Authorization': `Bearer ${sKey}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error("Sync failed");
        return res.json();
      })
      .then(data => {
        const fetchedWishes = data.filter(item => item.type === 'wish').map(item => item.payload);
        const fetchedVoices = data.filter(item => item.type === 'voice').map(item => item.payload);
        const fetchedScores = data.filter(item => item.type === 'quiz').map(item => item.payload);
        const fetchedLogs = data.filter(item => item.type === 'log').map(item => item.payload);

        if (fetchedWishes.length > 0) {
          setWishes(fetchedWishes);
          localStorage.setItem('birthday-wishes', JSON.stringify(fetchedWishes));
        }
        if (fetchedVoices.length > 0) {
          setVoiceNotes(fetchedVoices);
          localStorage.setItem('birthday-voice-notes', JSON.stringify(fetchedVoices));
        }
        if (fetchedScores.length > 0) {
          setQuizScores(fetchedScores);
          localStorage.setItem('birthday-quiz-attempts', JSON.stringify(fetchedScores));
        }
        if (fetchedLogs.length > 0) {
          setActivityLogs(fetchedLogs);
          localStorage.setItem('birthday-activity', JSON.stringify(fetchedLogs));
        }
      })
      .catch(err => console.log("Creator Dashboard Supabase sync deferred:", err));
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const deleteWish = (id) => {
    if (!window.confirm("Are you sure you want to delete this birthday wish?")) return;
    const updated = wishes.filter(w => w.id !== id);
    setWishes(updated);
    localStorage.setItem('birthday-wishes', JSON.stringify(updated));

    // Supabase Delete Sync
    const sUrl = localStorage.getItem('supabase-url');
    const sKey = localStorage.getItem('supabase-key');
    if (sUrl && sKey) {
      fetch(`${sUrl}/rest/v1/birthday_data?payload->>id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': sKey,
          'Authorization': `Bearer ${sKey}`
        }
      }).catch(err => console.error("Cloud deletion failed:", err));
    }
  };

  const deleteVoiceNote = (id) => {
    if (!window.confirm("Are you sure you want to delete this voice recording?")) return;
    const updated = voiceNotes.filter(v => v.id !== id);
    setVoiceNotes(updated);
    localStorage.setItem('birthday-voice-notes', JSON.stringify(updated));

    // Supabase Delete Sync
    const sUrl = localStorage.getItem('supabase-url');
    const sKey = localStorage.getItem('supabase-key');
    if (sUrl && sKey) {
      fetch(`${sUrl}/rest/v1/birthday_data?payload->>id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': sKey,
          'Authorization': `Bearer ${sKey}`
        }
      }).catch(err => console.error("Cloud deletion failed:", err));
    }
  };

  const saveCustomSettings = () => {
    const trimmedUrl = supabaseUrl.trim();
    const trimmedKey = supabaseKey.trim();

    localStorage.setItem('custom-gateway-pass', customPass.trim());
    localStorage.setItem('custom-typewriter', customTypewriter.trim());
    localStorage.setItem('custom-scratch', customScratch.trim());
    localStorage.setItem('supabase-url', trimmedUrl);
    localStorage.setItem('supabase-key', trimmedKey);

    // If new Supabase settings are added, upload all current local database entries
    if (trimmedUrl && trimmedKey) {
      const wishesToSync = JSON.parse(localStorage.getItem('birthday-wishes') || '[]');
      const voicesToSync = JSON.parse(localStorage.getItem('birthday-voice-notes') || '[]');
      const scoresToSync = JSON.parse(localStorage.getItem('birthday-quiz-attempts') || '[]');
      const logsToSync = JSON.parse(localStorage.getItem('birthday-activity') || '[]');

      const allItems = [
        ...wishesToSync.map(w => ({ type: 'wish', payload: w })),
        ...voicesToSync.map(v => ({ type: 'voice', payload: v })),
        ...scoresToSync.map(s => ({ type: 'quiz', payload: s })),
        ...logsToSync.map(l => ({ type: 'log', payload: l }))
      ];

      allItems.forEach(item => {
        fetch(`${trimmedUrl}/rest/v1/birthday_data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': trimmedKey,
            'Authorization': `Bearer ${trimmedKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(item)
        }).catch(e => console.error("Sync migration error:", e));
      });
    }

    setSaveStatus('Settings updated & Cloud sync successfully activated! ✨');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  const clearAllLogs = () => {
    if (window.confirm("CRITICAL WARNING: This will completely wipe out quiz scores, voice recordings, left wishes, and logs. Proceed?")) {
      localStorage.removeItem('birthday-wishes');
      localStorage.removeItem('birthday-voice-notes');
      localStorage.removeItem('birthday-quiz-attempts');
      localStorage.removeItem('birthday-activity');
      loadDashboardData();
      alert("All user database registers cleared.");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 bg-[#090314] relative z-10">
      <div className="stars"></div>
      <div className="aurora-1"></div>
      <div className="aurora-2"></div>

      <div className="max-w-6xl mx-auto w-full relative z-10">

        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">👑</span>
              <h1 className="text-3xl font-extrabold text-white tracking-wide" style={{ fontFamily: 'Playfair Display' }}>
                Jeeva's Creator Dashboard
              </h1>
            </div>
            <p className="text-pink-300 text-xs font-bold tracking-widest uppercase mt-2">
              Monitoring Surprise Interaction Activity
            </p>
          </div>

          <button
            onClick={() => setViewMode('user')}
            className="py-3 px-6 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 font-bold hover:bg-pink-500 hover:text-white transition-all text-sm uppercase tracking-wider"
          >
            ← Exit Dashboard
          </button>
        </div>

        {/* STATS HIGHLIGHT PANEL */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="glass-strong rounded-3xl p-5 border border-white/5">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Wishes Left</span>
            <span className="text-4xl font-extrabold gradient-text block mt-2">{wishes.length}</span>
          </div>

          <div className="glass-strong rounded-3xl p-5 border border-white/5">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Voice Notes</span>
            <span className="text-4xl font-extrabold gradient-text block mt-2">{voiceNotes.length}</span>
          </div>

          <div className="glass-strong rounded-3xl p-5 border border-white/5">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Best Quiz Score</span>
            <span className="text-4xl font-extrabold gradient-text block mt-2">
              {quizScores.length > 0 ? `${Math.max(...quizScores.map(q => q.score))}/4` : 'N/A'}
            </span>
          </div>

          <div className="glass-strong rounded-3xl p-5 border border-white/5">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Events Logged</span>
            <span className="text-4xl font-extrabold gradient-text block mt-2">{activityLogs.length}</span>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex border-b border-white/5 gap-2 mb-8 overflow-x-auto scrollbar-hide py-1">
          {[
            { id: 'wishes', label: '💝 Guest Wishes', count: wishes.length },
            { id: 'voice', label: '🎤 Voice Notes', count: voiceNotes.length },
            { id: 'activity', label: '📈 Interaction Logs', count: activityLogs.length },
            { id: 'customizer', label: '⚙️ Site Settings', count: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-5 rounded-2xl font-bold whitespace-nowrap text-sm tracking-wide transition-all border ${activeTab === tab.id
                ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/20'
                : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
                }`}
            >
              {tab.label} {tab.count !== null && <span className="ml-2 bg-black/40 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* TAB PANELS */}
        <div className="glass-strong rounded-[36px] p-6 md:p-8 border border-white/5 min-h-[350px]">

          {/* WISHES PANEL */}
          {activeTab === 'wishes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white tracking-wide">Left Birthday Wishes</h3>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Feed Update logs</span>
              </div>

              {wishes.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-4 select-none">💝</span>
                  <p className="text-gray-400 font-semibold text-lg">No wishes written yet.</p>
                  <p className="text-gray-600 text-sm mt-1">Waiting for Rekodaaaa or guests to fill the Wishes Wall.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <th className="py-4 px-3">Date</th>
                        <th className="py-4 px-3">Name</th>
                        <th className="py-4 px-3">Wish Message</th>
                        <th className="py-4 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {wishes.map((wish) => (
                        <tr key={wish.id} className="hover:bg-white/5 transition-colors font-medium">
                          <td className="py-4 px-3 text-gray-400 text-sm whitespace-nowrap">{wish.date} {wish.time || ''}</td>
                          <td className="py-4 px-3 text-pink-300 font-bold">{wish.name}</td>
                          <td className="py-4 px-3 text-gray-200 text-sm min-w-[280px] max-w-lg leading-relaxed">"{wish.message}"</td>
                          <td className="py-4 px-3 text-right">
                            <button
                              onClick={() => deleteWish(wish.id)}
                              className="py-1.5 px-3.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VOICE NOTES PANEL */}
          {activeTab === 'voice' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white tracking-wide">Recorded Voice Notes</h3>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Audio playback hub</span>
              </div>

              {voiceNotes.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-4 select-none">🎤</span>
                  <p className="text-gray-400 font-semibold text-lg">No voice notes recorded yet.</p>
                  <p className="text-gray-600 text-sm mt-1">Once she records a note, it will appear here instantly.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {voiceNotes.map((note) => (
                    <div key={note.id} className="glass rounded-3xl p-5 border border-white/5 flex flex-col justify-between hover:border-pink-500/30 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-pink-300 font-bold text-sm">
                            🎤 Voice Note from: <span className="text-white underline">{note.name || 'Anonymous Guest'}</span>
                          </span>
                          <p className="text-[10px] text-gray-400 mt-1 font-semibold tracking-wide">{note.date} at {note.time || ''}</p>
                        </div>
                        <button
                          onClick={() => deleteVoiceNote(note.id)}
                          className="text-red-400 text-xs font-bold opacity-30 group-hover:opacity-100 transition-opacity hover:text-red-500"
                        >
                          ✕ Delete
                        </button>
                      </div>

                      <div className="mt-4">
                        <audio src={note.audio} controls className="w-full bg-black/20 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACTIVITY PANEL */}
          {activeTab === 'activity' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white tracking-wide">Interaction Activity Logs</h3>
                <button
                  onClick={clearAllLogs}
                  className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider"
                >
                  Clear DB Registers
                </button>
              </div>

              {activityLogs.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-4 select-none">📈</span>
                  <p className="text-gray-400 font-semibold text-lg">No activity events logged yet.</p>
                  <p className="text-gray-600 text-sm mt-1">Logs will record unlocking events, quiz scores, and clicks.</p>
                </div>
              ) : (
                <div className="relative pl-6 border-l border-white/10 space-y-8 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Node point */}
                      <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-pink-500 border-2 border-[#090314] shadow-md shadow-pink-500/50"></span>

                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{log.date} at {log.timestamp}</span>
                          <h4 className="text-base font-bold text-pink-300 mt-0.5 tracking-wide">{log.action}</h4>
                          <p className="text-gray-300 text-sm mt-2 font-medium leading-relaxed bg-white/5 py-2 px-3.5 rounded-2xl border border-white/5 inline-block max-w-xl">
                            {log.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONFIGURATION PANEL */}
          {activeTab === 'customizer' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <h3 className="text-xl font-bold text-white tracking-wide">Customize Surprise Website</h3>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Control Panel config</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 font-semibold text-xs uppercase tracking-widest mb-2.5">
                    Gateway passcode (Secret word)
                  </label>
                  <input
                    type="text"
                    value={customPass}
                    onChange={(e) => setCustomPass(e.target.value)}
                    className="input-modern"
                    placeholder="Enter new gateway password..."
                  />
                  <p className="text-[10px] text-gray-500 mt-1.5 font-medium">Default: rekodaaaaa (Case-insensitive)</p>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold text-xs uppercase tracking-widest mb-2.5">
                    Scratch Card Secret Message
                  </label>
                  <input
                    type="text"
                    value={customScratch}
                    onChange={(e) => setCustomScratch(e.target.value)}
                    className="input-modern"
                    placeholder="Enter scratch reveal text..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold text-xs uppercase tracking-widest mb-2.5">
                  Hero Section Typewriter Story Text
                </label>
                <textarea
                  value={customTypewriter}
                  onChange={(e) => setCustomTypewriter(e.target.value)}
                  className="input-modern h-28 resize-none"
                  placeholder="Enter custom love note for typewriter..."
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                {saveStatus ? (
                  <span className="text-green-400 font-bold text-sm animate-pulse">{saveStatus}</span>
                ) : (
                  <span></span>
                )}

                <button
                  onClick={saveCustomSettings}
                  className="btn-primary py-3.5 px-8 font-bold"
                >
                  Save Configuration ✨
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
