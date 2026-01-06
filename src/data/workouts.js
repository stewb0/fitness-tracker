export const workouts = {
  push: {
    name: 'Push Day',
    exercises: [
      { name: 'Kneeling DB Shoulder Press', sets: 3, reps: 10, equipment: 'Dumbbell' },
      { name: 'DB Incline Press', sets: 3, reps: 10, equipment: 'Dumbbell' },
      { name: 'DB Lateral Raise', sets: 2, reps: 15, equipment: 'Dumbbell' },
      { name: 'Bench Dips', sets: 3, reps: 15, equipment: 'Bodyweight' },
      { name: 'DB Skull Crusher', sets: 2, reps: 12, equipment: 'Dumbbell' },
      { name: 'Weighted Sit-Up', sets: 3, reps: 15, equipment: 'Dumbbell' },
    ]
  },
  pull: {
    name: 'Pull Day',
    exercises: [
      { name: '1-Arm DB Row', sets: 3, reps: 10, equipment: 'Dumbbell' },
      { name: 'DB Pullover', sets: 3, reps: 12, equipment: 'Dumbbell' },
      { name: 'KB Gorilla Row', sets: 2, reps: 15, equipment: 'Kettlebell' },
      { name: 'DB Shrug', sets: 2, reps: 20, equipment: 'Dumbbell' },
      { name: 'DB Hammer Curl', sets: 2, reps: 12, equipment: 'Dumbbell' },
      { name: 'Rear Delt Raise', sets: 2, reps: 15, equipment: 'Dumbbell' },
      { name: 'Dragon Flag or Toes-to-Sky', sets: 3, reps: 8, equipment: 'Bodyweight' },
    ]
  },
  lower: {
    name: 'Lower B',
    exercises: [
      { name: 'KB Goblet Squat', sets: 3, reps: 12, equipment: 'Kettlebell' },
      { name: 'DB Romanian Deadlift', sets: 3, reps: 12, equipment: 'Dumbbell' },
      { name: 'KB Single Leg Deadlift', sets: 2, reps: 10, equipment: 'Kettlebell' },
      { name: 'DB Reverse Lunge', sets: 2, reps: 12, equipment: 'Dumbbell' },
      { name: 'Pallof Press', sets: 3, reps: 12, equipment: 'Kettlebell' },
    ]
  },
  upper: {
    name: 'Upper',
    exercises: [
      { name: 'KB Gorilla Row', sets: 3, reps: 15, equipment: 'Kettlebell' },
      { name: 'DB Bench Press', sets: 3, reps: 10, equipment: 'Dumbbell' },
      { name: 'DB Bent-Over Row', sets: 2, reps: 12, equipment: 'Dumbbell' },
      { name: 'Bench Dips', sets: 2, reps: 15, equipment: 'Bodyweight' },
      { name: 'DB Incline Curl', sets: 2, reps: 12, equipment: 'Dumbbell' },
      { name: 'Plank', sets: 3, reps: 60, equipment: 'Bodyweight', isTime: true },
    ]
  },
  lowerB: {
    name: 'Lower A',
    exercises: [
      { name: 'KB Swing', sets: 3, reps: 20, equipment: 'Kettlebell' },
      { name: 'DB Bulgarian Split Squat', sets: 3, reps: 10, equipment: 'Dumbbell' },
      { name: 'DB Lateral Lunge', sets: 2, reps: 10, equipment: 'Dumbbell' },
      { name: 'Nordic Hamstring Curl', sets: 2, reps: 15, equipment: 'Bodyweight' },
      { name: "Farmer's Walk", sets: 2, reps: 40, equipment: 'Kettlebell', isTime: true },
      { name: 'V-Up or Bicycle Crunch', sets: 3, reps: 15, equipment: 'Bodyweight' },
    ]
  }
};

// Workout rotation: Push -> Pull -> Lower -> Upper -> LowerB
export const workoutRotation = ['push', 'pull', 'lower', 'upper', 'lowerB'];

export const workoutLabels = {
  push: 'PUSH',
  pull: 'PULL',
  lower: 'LOWER B',
  upper: 'UPPER',
  lowerB: 'LOWER A'
};
