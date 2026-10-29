# QuizMaster - Interactive Online Quiz Application

**QuizMaster** is a modern, production-grade interactive online quiz platform built with **React**, **Vite**, and **Vanilla CSS3**. It features an authentic question bank, dynamic question and answer randomization (Fisher-Yates), a timestamp-based drift-free countdown timer, comprehensive scoring with accuracy metrics, a full answer review suite with explanations, and persistent progress tracking via browser Local Storage.

---

## 🌟 Key Features

### 1. 8 Comprehensive Quiz Categories (120+ Curated Questions)
- **General Knowledge**: World facts, history, landmarks, and culture.
- **Science**: Physics, chemistry, biology, and astronomy.
- **Mathematics**: Arithmetic, algebra, geometry, and probability.
- **Computer Science**: Data structures, OSI model, OS concepts, and algorithms.
- **Programming**: JavaScript, Python, OOP principles, closures, and React hooks.
- **History**: Ancient civilizations, modern milestones, and historic leaders.
- **Geography**: Continents, mountain peaks, rivers, and world capitals.
- **Sports**: Olympic records, world tournaments, and athletic achievements.
- *Each category contains at least 15 verified multiple-choice questions with 4 options, balanced across Easy, Medium, and Hard difficulty levels, complete with educational explanations.*

### 2. Flexible Quiz Configuration
- **Question Count**: Choose 5, 10, or 15 questions per session.
- **Difficulty Settings**: Filter by *Easy*, *Medium*, *Hard*, or *Mixed*.
- **Pacing / Timer Limit**: Select 15s, 30s, or 60s per question.
- **Dynamic Quiz Summary**: Automatically computes total quiz duration and summary parameters before launching.

### 3. Dynamic Question Display & Randomization
- **Fisher-Yates Shuffling**: Shuffles questions and randomizes the order of all 4 answer options on every single attempt.
- **Mapping Integrity**: Preserves correct answer associations after option shuffling.
- **State Retention**: Retains selected answers across question navigation.
- **Interactive Question Navigator**: Visual sidebar palette indicating current, answered, and unanswered questions with direct jumping capability.
- **Safe Submission Dialog**: Displays answered vs. unanswered counts and alerts users before finalizing.

### 4. Timestamp-Based Countdown Timer
- **Drift-Free Timing**: Relies on `Date.now()` timestamp differences so the timer remains accurate even if browser tabs are throttled or backgrounded.
- **Visual Warning**: Activates an urgent pulsing badge when less than 10% of time remains.
- **Automatic Submission**: Seamlessly auto-submits on timeout and calculates score based on answered questions.

### 5. Instant Scoring & Performance Analytics
- Calculates total questions, attempted, correct, incorrect, unanswered, raw score, percentage, time taken, and accuracy rate.
- Categorizes performance into 4 distinct tiers:
  - **90% - 100%**: *Excellent*
  - **75% - 89%**: *Great Job*
  - **50% - 74%**: *Good Effort*
  - **Below 50%**: *Keep Practicing*

### 6. Circular Progress Ring & Detailed Answer Review
- Animated circular SVG progress ring indicating overall score percentage.
- Question-by-question review showing:
  - User's selected answer vs. correct answer.
  - Color-coded badges and icons (Green for Correct, Red for Incorrect, Amber for Unanswered).
  - Clear explanations explaining the rationale for the correct answer.
  - Fast filter tabs (*All*, *Correct*, *Incorrect*, *Unanswered*).

### 7. Local Storage Tracking & Performance Dashboard
- Persists category best scores, overall best score, and attempt history in browser `localStorage`.
- Tie-breaking logic: Prefers higher percentage; for equal percentages, prefers higher raw score / longer quiz.
- Visual trend chart showing the last 10 quiz score percentages.
- Recent attempts history table.
- "Clear Quiz History" action with a safety confirmation modal.

---

## 🛠️ Technology Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Styling:** Modern Vanilla CSS3 (Custom design system, CSS Grid/Flexbox, responsive media queries, glassmorphism, animations)
- **Data Persistence:** Browser Local Storage (`localStorage` API with versioning and in-memory fallback)
- **Architecture:** Modular component architecture with pure utilities and custom hooks.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Clone the repository
```bash
git clone https://github.com/richardsofficial/QUIZ_APP.git
cd QUIZ_APP
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### 4. Build for production
```bash
npm run build
```

### 5. Preview the production build
```bash
npm run preview
```

### 6. Run automated logic test suite
```bash
node test_quiz_logic.js
```

---

## 📂 Project Structure

```
quiz/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AnswerReview.jsx          # Question-by-question review with explanations
│   │   ├── CategoryCard.jsx          # Category card with icon, tags & best score
│   │   ├── CategoryIcon.jsx          # Lucide icon resolver for categories
│   │   ├── ClearHistoryModal.jsx     # Confirmation modal for clearing history
│   │   ├── CountdownTimer.jsx        # Countdown timer display with low-time warning
│   │   ├── Navbar.jsx                # Top bar with branding, nav links & best score pill
│   │   ├── PerformanceChart.jsx      # Visual trend chart of recent quiz attempts
│   │   ├── ProgressBar.jsx           # Progress indicator with question counter
│   │   ├── ProgressRing.jsx          # Animated SVG circular percentage ring
│   │   ├── QuestionCard.jsx          # Accessible question text and selectable options
│   │   ├── QuestionNavigator.jsx     # Grid palette for direct question jumping
│   │   ├── ScoreCard.jsx             # Grid of score, accuracy, and attempt metrics
│   │   └── SubmissionModal.jsx       # Modal alert prior to quiz submission
│   ├── data/
│   │   ├── categories.js             # 8 category definitions with colors and icons
│   │   └── questions.js              # 120+ curated questions across all categories
│   ├── hooks/
│   │   └── useQuizTimer.js           # Robust timestamp-based timer hook
│   ├── pages/
│   │   ├── CategorySelection.jsx     # Category browse & search page
│   │   ├── HomePage.jsx              # Landing hero, stats, and category highlights
│   │   ├── PerformanceDashboard.jsx  # Score tracking, charts, and history table
│   │   ├── QuizConfiguration.jsx     # Setting question count, difficulty, and time
│   │   ├── QuizScreen.jsx            # Main interactive quiz testing screen
│   │   └── ResultsPage.jsx           # Post-quiz summary, ring, and review
│   ├── utils/
│   │   ├── scoring.js                # Score calculations, accuracy, and tiers
│   │   ├── shuffle.js                # Fisher-Yates randomization algorithm
│   │   └── storage.js                # Versioned LocalStorage persistence helper
│   ├── App.jsx                       # View controller and state management
│   ├── index.css                     # Comprehensive design system & styles
│   └── main.jsx                      # App entry point
├── test_quiz_logic.js                # 400+ unit test assertions
├── index.html
├── package.json
└── README.md
```

---

## 📄 License
MIT License. Created for interactive learning and assessment.
