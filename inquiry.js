export function buildInquiryUrl(data, channel = 'text', isiOS = false) {
  const name = String(data.name || '').trim();
  const interest = String(data.interest || 'real estate');
  const note = String(data.message || '').trim();
  const greeting = name ? `Hi Alberto, I'm ${name}.` : 'Hi Alberto,';
  const body = `${greeting} I'm interested in ${interest.toLowerCase()}.${note ? `\n\n${note}` : ''}\n\nI found your digital business card. Let's connect.`;
  return channel === 'email'
    ? `mailto:Alberto.SaabSquad@gmail.com?subject=${encodeURIComponent(interest + ' | Digital business card')}&body=${encodeURIComponent(body)}`
    : `sms:+17022329001${isiOS ? '&' : '?'}body=${encodeURIComponent(body)}`;
}
