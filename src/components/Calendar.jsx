import { useState } from 'react';
import { workoutLabels } from '../data/workouts';

function Calendar({ workoutHistory, onDateClick, totalWorkouts, totalWeight, streak, todaysWorkout, getWorkoutForDate, onExport, workouts }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Previous month days
    const prevMonthDays = daysInMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        prevMonthDays - i
      );
      days.push({ date, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        i
      );
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCompleted = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return workoutHistory[dateStr];
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const calendarDays = generateCalendar();

  return (
    <>
      <div className="header">
        <h1>[ WORKOUT TRACKER ]</h1>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-label">Total Days</div>
          <div className="stat-value">{totalWorkouts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Weight</div>
          <div className="stat-value">{totalWeight.toLocaleString()}</div>
          <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>lbs</div>
        </div>
      </div>

      <div className="todays-workout">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <h2>TODAY</h2>
            {todaysWorkout ? (
              <>
                <div style={{ fontSize: '20px', margin: '10px 0', fontWeight: 'bold' }}>
                  {workoutLabels[todaysWorkout]}
                </div>
                <div style={{ 
                  fontSize: '9px', 
                  opacity: 0.7, 
                  marginTop: '8px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2px 8px',
                  lineHeight: '1.4'
                }}>
                  {workouts[todaysWorkout].exercises.map((ex, i) => (
                    <div key={i}>• {ex.name}</div>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <div style={{ fontSize: '24px', margin: '10px 0' }}>✓</div>
                <div style={{ fontSize: '12px' }}>COMPLETE</div>
              </div>
            )}
          </div>
          <div style={{ flexShrink: 0 }}>
            {todaysWorkout && (
              <button onClick={() => onDateClick(new Date())} style={{ minWidth: '70px' }}>
                START
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="calendar">
        <div className="calendar-header">
          <button onClick={previousMonth}>{'<'}</button>
          <h2>
            {currentMonth.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          <button onClick={nextMonth}>{'>'}</button>
        </div>

        <div className="calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
          {calendarDays.map((day, idx) => {
            const workoutType = getWorkoutForDate(day.date);
            const completionData = isCompleted(day.date);
            const isFullComplete = completionData && completionData.completionPercentage === 100;
            const isPartialComplete = completionData && completionData.completionPercentage < 100;
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
            
            return (
              <div
                key={idx}
                className={`calendar-day ${
                  !day.isCurrentMonth ? 'other-month' : ''
                } ${isToday(day.date) ? 'today' : ''} ${
                  isFullComplete ? 'completed' : ''
                } ${isPartialComplete ? 'partial' : ''}`}
                onClick={() => day.isCurrentMonth && !isWeekend && onDateClick(day.date)}
                style={{ cursor: isWeekend ? 'default' : 'pointer' }}
              >
                <div className="day-number">{day.date.getDate()}</div>
                {day.isCurrentMonth && (
                  <div className="day-workout">
                    {isWeekend ? 'REST' : (workoutType ? workoutLabels[workoutType] : '')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={onExport} className="export-btn" style={{ width: '100%', marginTop: '20px' }}>
        EXPORT HISTORY
      </button>
    </>
  );
}

export default Calendar;
