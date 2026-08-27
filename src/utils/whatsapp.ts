export const openWhatsAppChat = (phoneNumber: string, message?: string) => {
  if (!phoneNumber) return;
  const cleaned = phoneNumber.replace(/[^0-9+]/g, '');
  const encodedMsg = message ? encodeURIComponent(message) : '';
  
  // Detect if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  let url = '';
  if (isMobile) {
    url = `https://wa.me/${cleaned}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
  } else {
    // Desktop: WhatsApp Web
    url = `https://web.whatsapp.com/send?phone=${cleaned}${encodedMsg ? `&text=${encodedMsg}` : ''}`;
  }
  
  window.open(url, '_blank');
};
