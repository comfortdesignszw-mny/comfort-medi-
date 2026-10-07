import { Medication, MedicationLog, Appointment, CareTask } from '../types';

export type ReminderType = 'medication' | 'exercise' | 'appointment' | 'task';

export type DueStatus = 'due_now' | 'upcoming' | 'overdue' | 'completed';

export interface HealthReminder {
  id: string;
  type: ReminderType;
  title: string;
  subtitle: string;
  time: string; // e.g. "08:00" or "Today 10:30"
  targetTimeFormatted: string;
  dueStatus: DueStatus;
  urgency: 'high' | 'medium' | 'low';
  metadata: {
    medicationId?: string;
    dosage?: string;
    instructions?: string;
    remainingUnits?: number;
    appointmentId?: string;
    facilityName?: string;
    doctorName?: string;
    taskId?: string;
    category?: string;
    durationMinutes?: number;
    guidance?: string;
  };
  actionLabel: string;
  isCompleted: boolean;
}

/**
 * 100% Offline Audio Chime Synthesizer using Web Audio API.
 * Emits a calming, medical-grade double chime.
 */
export function playReminderChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // First note (E5 - 659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.18, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Second harmonious note (A5 - 880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.22, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (e) {
    // Audio autoplay might be suspended until interaction
  }
}

/**
 * Browser Web Notification Requester
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

/**
 * Sends a native browser notification if permitted
 */
export function sendBrowserNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/icon.svg',
        badge: '/icon.svg',
      });
    } catch {
      // Fallback in environments where Notification constructor is restricted
    }
  }
}

/**
 * Core Reminder Computation Engine
 * Aggregates medication schedules, care tasks, exercise routines, and clinical appointments
 */
export function calculateActiveReminders(
  medications: Medication[] = [],
  medicationLogs: MedicationLog[] = [],
  appointments: Appointment[] = [],
  careTasks: CareTask[] = []
): HealthReminder[] {
  const reminders: HealthReminder[] = [];
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Helper to parse HH:MM into total minutes from midnight
  const parseTimeToMinutes = (timeStr?: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    return parseInt(parts[0] || '0', 10) * 60 + parseInt(parts[1] || '0', 10);
  };

  // 1. MEDICATION ADMINISTER REMINDERS
  medications.filter(m => m.active).forEach(med => {
    (med.scheduledTimes || []).forEach(scheduledTime => {
      const scheduledMinutes = parseTimeToMinutes(scheduledTime);
      const diffMinutes = currentMinutes - scheduledMinutes;

      // Check if already taken today for this scheduled time
      const wasTaken = medicationLogs.some(
        log => log.medicationId === med.id &&
               log.date === todayStr &&
               log.scheduledTime === scheduledTime &&
               log.status === 'taken'
      );

      let dueStatus: DueStatus = 'upcoming';
      let urgency: 'high' | 'medium' | 'low' = 'medium';

      if (wasTaken) {
        dueStatus = 'completed';
        urgency = 'low';
      } else if (diffMinutes > 30) {
        dueStatus = 'overdue';
        urgency = 'high';
      } else if (diffMinutes >= -45 && diffMinutes <= 30) {
        dueStatus = 'due_now';
        urgency = 'high';
      } else {
        dueStatus = 'upcoming';
        urgency = 'medium';
      }

      reminders.push({
        id: `med-${med.id}-${scheduledTime}`,
        type: 'medication',
        title: `Administer ${med.name} (${med.strength})`,
        subtitle: `${med.dosage} • ${med.instructions || 'Take as prescribed'}`,
        time: scheduledTime,
        targetTimeFormatted: `Today at ${scheduledTime}`,
        dueStatus,
        urgency,
        metadata: {
          medicationId: med.id,
          dosage: med.dosage,
          instructions: med.instructions,
          remainingUnits: med.remainingUnits,
        },
        actionLabel: wasTaken ? 'Administered' : 'Mark Administered',
        isCompleted: wasTaken
      });
    });
  });

  // 2. EXERCISE & MOBILITY REMINDERS
  // Filter exercise tasks from careTasks
  const exerciseTasks = careTasks.filter(
    t => t.category === 'exercise' || t.category === 'mobility'
  );

  // If the user has specific exercise tasks
  exerciseTasks.forEach(task => {
    const taskMinutes = parseTimeToMinutes(task.timeOfDay || '10:00');
    const diffMinutes = currentMinutes - taskMinutes;

    let dueStatus: DueStatus = task.completed ? 'completed' : 'upcoming';
    let urgency: 'high' | 'medium' | 'low' = 'medium';

    if (!task.completed) {
      if (diffMinutes > 45) {
        dueStatus = 'overdue';
        urgency = 'medium';
      } else if (diffMinutes >= -30 && diffMinutes <= 45) {
        dueStatus = 'due_now';
        urgency = 'high';
      }
    }

    reminders.push({
      id: `exercise-${task.id}`,
      type: 'exercise',
      title: task.title,
      subtitle: `Target: ${task.timeOfDay || 'Today'} • Recommended for cardiovascular & joint mobility`,
      time: task.timeOfDay || '10:00',
      targetTimeFormatted: `Today at ${task.timeOfDay || '10:00'}`,
      dueStatus,
      urgency,
      metadata: {
        taskId: task.id,
        category: task.category,
        durationMinutes: 15,
        guidance: 'Maintain steady breathing, drink water, and stop if you experience pain.'
      },
      actionLabel: task.completed ? 'Completed' : 'Mark Exercise Done',
      isCompleted: task.completed
    });
  });

  // Built-in daily wellness mobility reminder if none configured
  if (exerciseTasks.length === 0) {
    const defaultExerciseTime = '09:30';
    const exerciseMinutes = parseTimeToMinutes(defaultExerciseTime);
    const diff = currentMinutes - exerciseMinutes;
    const dueStatus: DueStatus = diff >= -45 && diff <= 120 ? 'due_now' : (diff > 120 ? 'overdue' : 'upcoming');

    reminders.push({
      id: 'default-daily-exercise',
      type: 'exercise',
      title: 'Daily Mobility & Physical Activity',
      subtitle: '15-minute gentle walk, stretching or prescribed rehabilitation',
      time: defaultExerciseTime,
      targetTimeFormatted: `Today at ${defaultExerciseTime}`,
      dueStatus,
      urgency: 'medium',
      metadata: {
        durationMinutes: 15,
        guidance: 'Light stretching or walking helps regulate blood pressure, insulin, and circulation.'
      },
      actionLabel: 'Mark Exercise Done',
      isCompleted: false
    });
  }

  // 3. CLINICAL APPOINTMENT REMINDERS
  appointments
    .filter(a => a.status === 'booked' || a.status === 'confirmed' || a.status === 'rescheduled')
    .forEach(apt => {
      const aptDate = apt.date; // YYYY-MM-DD
      const aptTime = apt.time || '09:00';
      const isToday = aptDate === todayStr;

      // Calculate days difference
      const aptDateTime = new Date(`${aptDate}T${aptTime}:00`);
      const nowTime = new Date();
      const diffMs = aptDateTime.getTime() - nowTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      let dueStatus: DueStatus = 'upcoming';
      let urgency: 'high' | 'medium' | 'low' = 'medium';

      if (diffHours < 0 && isToday) {
        dueStatus = 'due_now';
        urgency = 'high';
      } else if (diffHours >= 0 && diffHours <= 3) {
        dueStatus = 'due_now';
        urgency = 'high';
      } else if (diffHours > 3 && diffHours <= 48) {
        dueStatus = 'upcoming';
        urgency = 'high';
      }

      reminders.push({
        id: `apt-${apt.id}`,
        type: 'appointment',
        title: `Consultation at ${apt.facilityName}`,
        subtitle: `With ${apt.providerName || 'Healthcare Provider'} • ${apt.reason || 'Medical Consultation'}`,
        time: aptTime,
        targetTimeFormatted: isToday ? `Today at ${aptTime}` : `${aptDate} at ${aptTime}`,
        dueStatus,
        urgency,
        metadata: {
          appointmentId: apt.id,
          facilityName: apt.facilityName,
          doctorName: apt.providerName
        },
        actionLabel: 'View Appointment',
        isCompleted: false
      });
    });

  // 4. GENERAL CARE TASK REMINDERS
  const generalTasks = careTasks.filter(
    t => t.category !== 'exercise' && t.category !== 'mobility' && t.category !== 'medication'
  );

  generalTasks.forEach(task => {
    const taskMinutes = parseTimeToMinutes(task.timeOfDay || '12:00');
    const diffMinutes = currentMinutes - taskMinutes;

    let dueStatus: DueStatus = task.completed ? 'completed' : 'upcoming';
    let urgency: 'high' | 'medium' | 'low' = 'medium';

    if (!task.completed) {
      if (diffMinutes > 60) {
        dueStatus = 'overdue';
        urgency = 'high';
      } else if (diffMinutes >= -45 && diffMinutes <= 60) {
        dueStatus = 'due_now';
        urgency = 'high';
      }
    }

    reminders.push({
      id: `task-${task.id}`,
      type: 'task',
      title: task.title,
      subtitle: `Care Plan Task • Assigned to ${task.assignedTo || 'Patient/Caregiver'}`,
      time: task.timeOfDay || '12:00',
      targetTimeFormatted: `Today at ${task.timeOfDay || '12:00'}`,
      dueStatus,
      urgency,
      metadata: {
        taskId: task.id,
        category: task.category
      },
      actionLabel: task.completed ? 'Completed' : 'Mark Task Complete',
      isCompleted: task.completed
    });
  });

  // Sort reminders: due_now & overdue first, then upcoming, completed last
  const statusPriority: Record<DueStatus, number> = {
    due_now: 1,
    overdue: 2,
    upcoming: 3,
    completed: 4
  };

  return reminders.sort((a, b) => {
    if (statusPriority[a.dueStatus] !== statusPriority[b.dueStatus]) {
      return statusPriority[a.dueStatus] - statusPriority[b.dueStatus];
    }
    return a.time.localeCompare(b.time);
  });
}
