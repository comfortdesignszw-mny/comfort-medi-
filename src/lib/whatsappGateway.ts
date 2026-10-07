import type { HealthReminder } from './remindersEngine';

export interface WhatsAppNotificationRecord {
  id: string;
  recipient: string;
  type: 'MEDICATION' | 'EXERCISE' | 'APPOINTMENT' | 'CARE_TASK' | 'REFILL_ALERT' | 'EMERGENCY';
  message: string;
  sentAt: string;
  status: 'DISPATCHED_VIA_WHATSAPP' | 'PENDING';
  deepLinkUrl: string;
  isAutoTriggered?: boolean;
  reminderTitle?: string;
}

export function formatZimbabweWhatsAppNumber(phone: string): string {
  if (!phone) return '263772824132';
  // Remove non-digit characters except '+'
  let cleaned = phone.replace(/[^0-9]/g, '');
  
  // If starts with '07', replace with '2637' (Zimbabwe local prefix)
  if (cleaned.startsWith('07') && cleaned.length === 10) {
    cleaned = '263' + cleaned.substring(1);
  }
  // If starts with '263', keep it
  else if (cleaned.startsWith('263')) {
    // already international
  }
  // If starts with '7' and 9 digits (e.g. 772824132), prepend 263
  else if (cleaned.length === 9 && cleaned.startsWith('7')) {
    cleaned = '263' + cleaned;
  }
  // Fallback if 0 is leading e.g. 024... or other international
  else if (cleaned.startsWith('0') && cleaned.length >= 9) {
    cleaned = '263' + cleaned.substring(1);
  }

  return cleaned || '263772824132';
}

export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const formattedPhone = formatZimbabweWhatsAppNumber(phoneNumber);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}

/**
 * Builds standard, professional medical WhatsApp notification text for each category
 */
export function buildReminderWhatsAppMessage(
  reminder: HealthReminder,
  patientName: string = 'Patient'
): string {
  const timeFormatted = reminder.targetTimeFormatted || `Today at ${reminder.time}`;

  switch (reminder.type) {
    case 'medication':
      return [
        `💊 *COMFORT MEDI+ | AUTO MEDICATION REMINDER*`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `Hello *${patientName}*,`,
        `This is your automated Comfort Medi+ dose alert:`,
        ``,
        `💊 *Medication:* ${reminder.title}`,
        `⏰ *Scheduled Time:* ${timeFormatted}`,
        `📋 *Dosage:* ${reminder.metadata.dosage || 'Prescribed dose'}`,
        `💡 *Clinical Directions:* ${reminder.metadata.instructions || 'Take as prescribed with clean drinking water'}`,
        reminder.metadata.remainingUnits !== undefined
          ? `📦 *Stock Remaining:* ${reminder.metadata.remainingUnits} units`
          : '',
        ``,
        `⚠️ *Action Required:* Please administer your dose now and confirm in your Comfort Medi+ tracker.`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `_Comfort Medi+ Automated Health Monitoring Engine_`
      ].filter(Boolean).join('\n');

    case 'exercise':
      return [
        `🏃 *COMFORT MEDI+ | AUTO EXERCISE & MOBILITY REMINDER*`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `Hello *${patientName}*,`,
        `It is time for your scheduled physical wellness and mobility routine:`,
        ``,
        `🏃 *Activity:* ${reminder.title}`,
        `⏰ *Scheduled Time:* ${timeFormatted}`,
        `⏱️ *Target Duration:* ${reminder.metadata.durationMinutes || 15} Minutes`,
        `💡 *Guidance:* ${reminder.metadata.guidance || 'Gentle mobility, steady breathing and light stretching'}`,
        `💧 *Hydration:* Drink water before and after your session. Stop if you feel dizzy or chest discomfort.`,
        ``,
        `✅ *Action:* Complete session and record in Comfort Medi+.`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `_Comfort Medi+ Automated Health Monitoring Engine_`
      ].join('\n');

    case 'appointment':
      return [
        `🏥 *COMFORT MEDI+ | AUTO HOSPITAL APPOINTMENT REMINDER*`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `Hello *${patientName}*,`,
        `Automated alert for your upcoming clinical consultation:`,
        ``,
        `🏥 *Healthcare Facility:* ${reminder.metadata.facilityName || 'Medical Facility'}`,
        `👨‍⚕️ *Provider / Clinician:* ${reminder.metadata.doctorName || 'Attending Physician'}`,
        `⏰ *Appointment Time:* ${timeFormatted}`,
        `📋 *Purpose:* ${reminder.subtitle || 'Consultation & Clinical Evaluation'}`,
        ``,
        `📁 *Checklist:* Please carry your National ID, medical aid card, and your Comfort Medi+ vitals history log.`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `_Comfort Medi+ Automated Health Monitoring Engine_`
      ].join('\n');

    case 'task':
    default:
      return [
        `📋 *COMFORT MEDI+ | AUTO CARE PLAN TASK REMINDER*`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `Hello *${patientName}*,`,
        `Automated notification for a scheduled care duty:`,
        ``,
        `📋 *Task:* ${reminder.title}`,
        `⏰ *Scheduled Time:* ${timeFormatted}`,
        `🏷️ *Category:* ${reminder.metadata.category || 'General Care'}`,
        `💡 *Details:* ${reminder.subtitle || 'Care task scheduled for patient wellness'}`,
        ``,
        `✅ *Action:* Please complete this care task and mark it in your Comfort Medi+ care plan.`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `_Comfort Medi+ Automated Health Monitoring Engine_`
      ].join('\n');
  }
}

/**
 * Triggers WhatsApp notification, with support for automatic background dispatch
 */
export function triggerWhatsAppNotification(
  phoneNumber: string,
  message: string,
  type: WhatsAppNotificationRecord['type'] = 'MEDICATION',
  openInBrowser: boolean = false,
  isAutoTriggered: boolean = false,
  reminderTitle?: string
): WhatsAppNotificationRecord {
  const deepLinkUrl = generateWhatsAppLink(phoneNumber, message);

  if (openInBrowser && typeof window !== 'undefined') {
    try {
      // Direct window open attempt
      const opened = window.open(deepLinkUrl, '_blank', 'noopener,noreferrer');
      if (!opened) {
        // Fallback hidden anchor click
        const link = document.createElement('a');
        link.href = deepLinkUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.warn('WhatsApp link auto-dispatch intercepted:', e);
    }
  }

  return {
    id: 'wa-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    recipient: phoneNumber,
    type,
    message,
    sentAt: new Date().toISOString(),
    status: 'DISPATCHED_VIA_WHATSAPP',
    deepLinkUrl,
    isAutoTriggered,
    reminderTitle
  };
}
