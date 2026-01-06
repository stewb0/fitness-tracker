import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import WorkoutView from './components/WorkoutView';
import { workoutRotation, workoutLabels, workouts } from './data/workouts';

function App() {
  const [view, setView] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState(() => {
    const saved = localStorage.getItem('workoutHistory');
    return saved ? JSON.parse(saved) : {};
  });
  const [weights, setWeights] = useState(() => {
    const saved = localStorage.getItem('weights');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  useEffect(() => {
    localStorage.setItem('weights', JSON.stringify(weights));
  }, [weights]);

  // Calculate total workouts completed
  const totalWorkouts = Object.keys(workoutHistory).length;

  // Calculate total weight lifted
  const calculateTotalWeight = () => {
    let total = 0;
    Object.values(workoutHistory).forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.completed && set.weight > 0) {
            total += set.weight * set.reps;
          }
        });
      });
    });
    return total;
  };

  const totalWeight = calculateTotalWeight();

  // Calculate current streak
  const calculateStreak = () => {
    const dates = Object.keys(workoutHistory).sort().reverse();
    if (dates.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < dates.length; i++) {
      const workoutDate = new Date(dates[i]);
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  };

  // Get workout type for a given date
  const getWorkoutForDate = (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    // Check if it's a weekend (Saturday=6, Sunday=0)
    const dayOfWeek = targetDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return null; // Rest day on weekends
    }
    
    // Check if this date already has a completed workout
    const dateStr = targetDate.toISOString().split('T')[0];
    if (workoutHistory[dateStr]) {
      return workoutHistory[dateStr].type;
    }
    
    // For uncompleted weekdays, calculate based on weekday progression
    // Use January 1, 2026 as the reference start date (Wednesday)
    const referenceDate = new Date('2026-01-01');
    referenceDate.setHours(0, 0, 0, 0);
    
    // Count only weekdays between reference and target
    let weekdayCount = 0;
    const currentDate = new Date(referenceDate);
    
    while (currentDate < targetDate) {
      const dow = currentDate.getDay();
      if (dow !== 0 && dow !== 6) { // Not weekend
        weekdayCount++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const index = weekdayCount % workoutRotation.length;
    return workoutRotation[index];
  };

  // Get today's workout
  const getTodaysWorkout = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if it's a weekend
    const dayOfWeek = today.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return null; // Rest day on weekends
    }
    
    const dateStr = today.toISOString().split('T')[0];
    
    if (workoutHistory[dateStr]) {
      return null; // Already completed today
    }
    
    return getWorkoutForDate(today);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setView('workout');
  };

  const handleBackToCalendar = () => {
    setView('calendar');
    setSelectedDate(null);
  };

  const handleCompleteWorkout = (date, workoutType, exerciseData) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Calculate completion percentage
    const totalSets = exerciseData.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = exerciseData.reduce(
      (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
      0
    );
    const completionPercentage = (completedSets / totalSets) * 100;
    
    setWorkoutHistory(prev => ({
      ...prev,
      [dateStr]: {
        type: workoutType,
        exercises: exerciseData,
        completedAt: new Date().toISOString(),
        completionPercentage
      }
    }));
  };

  const handleWeightChange = (exerciseName, weight) => {
    setWeights(prev => ({
      ...prev,
      [exerciseName]: weight
    }));
  };

  const exportToMarkdown = () => {
    let markdown = '# Workout History\n\n';
    
    const sortedDates = Object.keys(workoutHistory).sort().reverse();
    
    sortedDates.forEach(dateStr => {
      const workout = workoutHistory[dateStr];
      const date = new Date(dateStr);
      markdown += `## ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - ${workout.type.toUpperCase()}\n\n`;
      
      workout.exercises.forEach(exercise => {
        markdown += `### ${exercise.name}\n`;
        exercise.sets.forEach((set, idx) => {
          if (set.completed) {
            markdown += `- Set ${idx + 1}: ${set.reps} reps @ ${set.weight} lbs\n`;
          }
        });
        markdown += '\n';
      });
      
      markdown += '---\n\n';
    });
    
    // Create and download file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-history-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      {view === 'calendar' ? (
        <Calendar
          workoutHistory={workoutHistory}
          onDateClick={handleDateClick}
          totalWorkouts={totalWorkouts}
          totalWeight={totalWeight}
          streak={calculateStreak()}
          todaysWorkout={getTodaysWorkout()}
          getWorkoutForDate={getWorkoutForDate}
          onExport={exportToMarkdown}
          workouts={workouts}
        />
      ) : (
        <WorkoutView
          date={selectedDate}
          workoutType={getWorkoutForDate(selectedDate)}
          weights={weights}
          onBack={handleBackToCalendar}
          onComplete={handleCompleteWorkout}
          onWeightChange={handleWeightChange}
          isCompleted={workoutHistory[selectedDate?.toISOString().split('T')[0]]}
        />
      )}
    </div>
  );
}

export default App;
