"use client";

import { DayOfWeek, DAYS_OF_WEEK } from '@/lib/types';
import { useTodos } from '@/hooks/use-todos';
import TodoList from './TodoList';

export default function WeekPlanner() {
  const todos = useTodos();

  if (todos.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Week Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">This Week</h2>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })} - {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Compartmentalized Week Days */}
      <div className="grid gap-8">
        {DAYS_OF_WEEK.map((day, index) => {
          const totalTodos = todos.getTotalTodosForDay(day.key);
          const completedTodos = todos.getCompletedTodosForDay(day.key);
          const isToday = day.key === getCurrentDay();
          const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;
          
          // Color scheme for each day
          const dayColors = {
            monday: { bg: 'bg-blue-50', border: 'border-blue-100', accent: 'bg-blue-500', text: 'text-blue-700' },
            tuesday: { bg: 'bg-emerald-50', border: 'border-emerald-100', accent: 'bg-emerald-500', text: 'text-emerald-700' },
            wednesday: { bg: 'bg-purple-50', border: 'border-purple-100', accent: 'bg-purple-500', text: 'text-purple-700' },
            thursday: { bg: 'bg-orange-50', border: 'border-orange-100', accent: 'bg-orange-500', text: 'text-orange-700' },
            friday: { bg: 'bg-pink-50', border: 'border-pink-100', accent: 'bg-pink-500', text: 'text-pink-700' },
            saturday: { bg: 'bg-indigo-50', border: 'border-indigo-100', accent: 'bg-indigo-500', text: 'text-indigo-700' },
            sunday: { bg: 'bg-red-50', border: 'border-red-100', accent: 'bg-red-500', text: 'text-red-700' }
          };

          const colors = dayColors[day.key];

          return (
            <div key={day.key} className="relative">
              {/* Day Compartment */}
              <div className={`
                ${colors.bg} ${colors.border} border-2 rounded-xl overflow-hidden
                shadow-sm transition-all duration-300 hover:shadow-md
                ${isToday ? 'ring-2 ring-black ring-offset-2 scale-[1.02]' : ''}
              `}>
                
                {/* Day Header with Color Strip */}
                <div className="relative">
                  {/* Color accent strip */}
                  <div className={`${colors.accent} h-1 w-full`}></div>
                  
                  {/* Header content */}
                  <div className="bg-white px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Day icon */}
                        <div className={`w-12 h-12 ${colors.bg} ${colors.border} border-2 rounded-lg flex items-center justify-center`}>
                          <span className={`text-lg font-bold ${colors.text}`}>
                            {day.short.charAt(0)}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {day.label}
                            </h3>
                            {isToday && (
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                Today
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {getDateForDay(day.key).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Progress section */}
                      <div className="text-right">
                        {totalTodos > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-600">
                                {completedTodos}/{totalTodos} tasks
                              </span>
                              <div className={`
                                w-3 h-3 rounded-full
                                ${completedTodos === totalTodos ? 'bg-green-500' : colors.accent}
                              `}></div>
                            </div>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${colors.accent} transition-all duration-500`}
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">No tasks</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day Content Area */}
                <div className="bg-white px-6 py-5">
                  <TodoList day={day.key} todos={todos} dayColor={colors.accent} />
                </div>

                {/* Day Footer Stats */}
                {totalTodos > 0 && (
                  <div className={`${colors.bg} px-6 py-3 border-t border-gray-100`}>
                    <div className="flex justify-between items-center text-sm">
                      <div className={`${colors.text} font-medium`}>
                        {completedTodos === totalTodos ? '✓ All tasks completed!' : 
                         `${totalTodos - completedTodos} remaining`}
                      </div>
                      <div className="text-gray-500">
                        {Math.round(progressPercentage)}% complete
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Day separator line for visual compartmentalization */}
              {index < DAYS_OF_WEEK.length - 1 && (
                <div className="flex items-center justify-center my-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent w-full"></div>
                  <div className="mx-4 text-xs text-gray-400 bg-white px-3 whitespace-nowrap">
                    {DAYS_OF_WEEK[index + 1]?.label}
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent w-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getCurrentDay(): DayOfWeek {
  const dayIndex = new Date().getDay();
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return daysMap[dayIndex] as DayOfWeek;
}

function getDateForDay(day: DayOfWeek): Date {
  const today = new Date();
  const todayIndex = today.getDay();
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetIndex = daysMap.indexOf(day);
  const diffDays = targetIndex - todayIndex;
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diffDays);
  return targetDate;
}