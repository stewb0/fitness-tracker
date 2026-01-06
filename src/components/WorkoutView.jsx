import { useState, useEffect } from 'react';
import { workouts } from '../data/workouts';

function WorkoutView({ date, workoutType, weights, onBack, onComplete, onWeightChange, isCompleted }) {
  const workout = workouts[workoutType];
  const [exerciseData, setExerciseData] = useState(() => {
    // Initialize exercise data with sets
    return workout.exercises.map(exercise => ({
      name: exercise.name,
      sets: Array.from({ length: exercise.sets }, (_, idx) => ({
        reps: exercise.reps,
        weight: weights[exercise.name] || (exercise.equipment === 'Bodyweight' ? 0 : 20),
        completed: false
      }))
    }));
  });

  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const calculateProgress = () => {
    const totalSets = exerciseData.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = exerciseData.reduce(
      (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
      0
    );
    return Math.round((completedSets / totalSets) * 100);
  };

  const toggleSet = (exerciseIdx, setIdx) => {
    setExerciseData(prev => {
      const newData = [...prev];
      newData[exerciseIdx].sets[setIdx].completed = !newData[exerciseIdx].sets[setIdx].completed;
      return newData;
    });
  };

  const adjustWeight = (exerciseIdx, setIdx, delta) => {
    setExerciseData(prev => {
      const newData = [...prev];
      const newWeight = Math.max(0, newData[exerciseIdx].sets[setIdx].weight + delta);
      newData[exerciseIdx].sets[setIdx].weight = newWeight;
      
      return newData;
    });
  };

  const handleCompleteWorkout = () => {
    // Save the workout immediately
    onComplete(date, workoutType, exerciseData);
    
    // Handle weight progression automatically
    exerciseData.forEach((exercise, idx) => {
      const originalExercise = workout.exercises[idx];
      const allSetsCompleted = exercise.sets.every(set => set.completed);
      
      if (originalExercise.equipment === 'Dumbbell' && allSetsCompleted) {
        // For dumbbells: if all sets completed, auto-increase by 2.5 lbs
        const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
        if (maxWeight > 0) {
          onWeightChange(exercise.name, maxWeight + 2.5);
        }
      } else if (originalExercise.equipment !== 'Bodyweight') {
        // For kettlebells or incomplete dumbbell sets: save highest weight used
        const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
        if (maxWeight > 0) {
          onWeightChange(exercise.name, maxWeight);
        }
      }
    });
    
    // Return to calendar
    onBack();
  };

  const progress = calculateProgress();

  return (
    <>
      <div className="workout-header">
        <button onClick={onBack}>{'<'} BACK</button>
        <h1>{workout.name.toUpperCase()}</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="sticky-bar">
        <div className="timer-progress">
          <div className="timer-inline">
            <div className="timer-display">{formatTime(timer)}</div>
            <button onClick={() => setIsPaused(!isPaused)} style={{ padding: '5px 10px', fontSize: '12px' }}>
              {isPaused ? '|>' : '||'}
            </button>
          </div>
          <div className="progress-inline">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text">{progress}%</div>
          </div>
        </div>
      </div>

      {exerciseData.map((exercise, exIdx) => {
        const originalExercise = workout.exercises[exIdx];
        return (
          <div key={exIdx} className="exercise">
            <div className="exercise-header">
              <div>
                <div className="exercise-name">{exercise.name}</div>
                <div className="exercise-info">
                  {originalExercise.equipment} • {originalExercise.sets} sets x {originalExercise.reps} reps
                </div>
              </div>
            </div>
            <div className="sets-container">
              {exercise.sets.map((set, setIdx) => (
                <div
                  key={setIdx}
                  className={`set-row ${set.completed ? 'completed' : ''}`}
                >
                  <div
                    className={`set-checkbox ${set.completed ? 'checked' : ''}`}
                    onClick={() => toggleSet(exIdx, setIdx)}
                  ></div>
                  <div className="set-label">Set {setIdx + 1}</div>
                  <div className="set-reps">
                    {set.reps} {originalExercise.isTime ? 's' : 'reps'}
                  </div>
                  {originalExercise.equipment !== 'Bodyweight' && (
                    <div className="weight-control">
                      <button
                        className="weight-btn"
                        onClick={() => adjustWeight(exIdx, setIdx, -2.5)}
                      >
                        -
                      </button>
                      <div className="weight-display">{set.weight} lbs</div>
                      <button
                        className="weight-btn"
                        onClick={() => adjustWeight(exIdx, setIdx, 2.5)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <button
        className="complete-workout-btn"
        onClick={handleCompleteWorkout}
      >
        COMPLETE WORKOUT
      </button>
    </>
  );
}

export default WorkoutView;
