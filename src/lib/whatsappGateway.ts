export interface WhatsAppNotificationRecord {
  id: string;
  recipient: string;
  type: 'MEDICATION' | 'APPOINTMENT' | 'CARE_TASK' | 'REFILL_ALERT' | 'EMERGENCY';
  message: string;
  sentAt: string;
  status: 'DISPATCHED_VIA_WHATSAPP' | 'PENDING';
  deepLinkUrl: string;
}

export function formatZimbabweWhatsAppNumber(phone: string): string {
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

  return cleaned;
}

export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const formattedPhone = formatZimbabweWhatsAppNumber(phoneNumber);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}

export function triggerWhatsAppNotification(
  phoneNumber: string,
  message: string,
  type: WhatsAppNotificationRecord['type'] = 'MEDICATION',
  openInBrowser: boolean = false
): WhatsAppNotificationRecord {
  const deepLinkUrl = generateWhatsAppLink(phoneNumber, message);

  if (openInBrowser && typeof document !== 'undefined') {
    try {
      const link = document.createElement('a');
      link.href = deepLinkUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.warn('WhatsApp link click prevented:', e);
    }
  }

  return {
    id: 'wa-' + Date.now() + '-' + Math.floor(Math.random() * 100),
    recipient: phoneNumber,
    type,
    message,
    sentAt: new Date().toISOString(),
    status: 'DISPATCHED_VIA_WHATSAPP',
    deepLinkUrl,
  };
}
