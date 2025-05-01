class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25 minutes in seconds
        this.breakTime = 5 * 60; // 5 minutes in seconds
        this.timeLeft = this.workTime;
        this.isRunning = false;
        this.timer = null;

        // DOM Elements
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.progressCircle = document.querySelector('.progress-ring__circle-progress');
        this.themeToggle = document.getElementById('theme-toggle');
        this.presetButtons = document.querySelectorAll('.preset-button');

        // Calculate the circumference of the progress circle
        const radius = this.progressCircle.r.baseVal.value;
        this.circumference = radius * 2 * Math.PI;
        this.progressCircle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.progressCircle.style.strokeDashoffset = this.circumference;

        // Create audio elements
        this.clickSound = new Audio('data:audio/mp3;base64,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BQUFBQUFBQUFBQUFAAAAABUZFRQYIQkVeXmZ2dVYCAFQAAAIAQAg4P4fxBwLhxQARBAYUBISEhUREQmBwH/+5JkGoAkID9UazlD8DJkGo0YLLARaQNRrL0PyLwP6jRAlpGBoYEhUQEBAQEhQQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBAQAAEAAAAAAA7gAANgIAAA3AAAEggAAJAAAESCAAAAAAACYOwAATYCAAA2AgAALgAAESAAABAAABEQAAAAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JkQIP/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
        this.completionSound = new Audio('data:audio/mp3;base64,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BQUFBQUFBQUFBQUFAAAAABUZFRQYIQkVeXmZ2dVYCAFQAAAIAQAg4P4fxBwLhxQARBAYUBISEhUREQmBwH/+5JkGoAkID9UazlD8DJkGo0YLLARaQNRrL0PyLwP6jRAlpGBoYEhUQEBAQEhQQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBASEhAQEBAQEBAQAAEAAAAAAA7gAANgIAAA3AAAEggAAJAAAESCAAAAAAACYOwAATYCAAA2AgAALgAAESAAABAAABEQAAAAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JkQIP/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');

        // Event Listeners
        this.startButton.addEventListener('click', () => {
            this.playClickSound();
            this.start();
        });
        this.pauseButton.addEventListener('click', () => {
            this.playClickSound();
            this.pause();
        });
        this.resetButton.addEventListener('click', () => {
            this.playClickSound();
            this.reset();
        });
        this.themeToggle.addEventListener('click', () => {
            this.playClickSound();
            this.toggleTheme();
        });
        this.presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.playClickSound();
                this.setTimer(parseInt(button.dataset.minutes));
            });
        });

        // Initialize
        this.updateDisplay();
        this.loadThemePreference();
    }

    setTimer(minutes) {
        this.pause();
        this.timeLeft = minutes * 60;
        this.workTime = minutes * 60;
        this.updateDisplay();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startButton.classList.add('hidden');
            this.pauseButton.classList.remove('hidden');
            
            // Switch to dark mode when timer starts
            document.body.classList.add('dark-mode');
            
            // Hide preset buttons when timer starts
            document.querySelector('.timer-presets').classList.add('hidden');
            
            this.timer = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                    this.updateDisplay();
                }
                
                if (this.timeLeft <= 0) {
                    this.playCompletionSound();
                    this.pause();
                    this.timeLeft = this.workTime;
                    this.updateDisplay();
                }
            }, 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startButton.classList.remove('hidden');
            this.pauseButton.classList.add('hidden');
            
            // Switch back to light mode when timer stops
            document.body.classList.remove('dark-mode');
            
            // Show preset buttons when timer stops
            document.querySelector('.timer-presets').classList.remove('hidden');
            
            clearInterval(this.timer);
        }
    }

    reset() {
        this.pause();
        this.timeLeft = this.workTime;
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');

        // Update progress circle
        const progress = this.circumference - (this.timeLeft / this.workTime) * this.circumference;
        this.progressCircle.style.strokeDashoffset = progress;
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    playClickSound() {
        const clickSound = this.clickSound.cloneNode();
        clickSound.volume = 0.08; // Reduced volume for more subtlety
        
        // Create subtle fade out effect
        setTimeout(() => {
            const fadeInterval = setInterval(() => {
                if (clickSound.volume > 0.02) {
                    clickSound.volume -= 0.02;
                } else {
                    clearInterval(fadeInterval);
                }
            }, 20);
        }, 50);
        
        clickSound.play().catch(e => console.log('Audio playback failed:', e));
    }

    playCompletionSound() {
        const completionSound = this.completionSound.cloneNode();
        completionSound.volume = 0.3;
        completionSound.play().catch(e => console.log('Audio playback failed:', e));
    }
}

// Initialize the timer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 