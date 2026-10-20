'use strict';
import { buildInquiryUrl } from './inquiry.js';
const shareDialog = document.querySelector('#share-dialog');
const inquiryDialog = document.querySelector('#inquiry-dialog');
let lastTrigger = null;
let toastTimer;
function toast(message) {
  const dialogStatus = document.querySelector('dialog[open] .dialog-status');
  if (dialogStatus) {
    dialogStatus.textContent = message;
    return;
  }
  const box = document.querySelector('#toast');
  box.textContent = message;
  box.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove('visible'), 4000);
}
function openDialog(dialog, trigger) {
  lastTrigger = trigger;
  dialog.showModal();
}
for (const button of document.querySelectorAll('.share-trigger')) {
  button.addEventListener('click', () => openDialog(shareDialog, button));
}
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => lastTrigger?.focus({ preventScroll: true }));
  const status = document.createElement('p');
  status.className = 'dialog-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  dialog.append(status);
}
const cardUrl = () => 'https://digital-biz-card.github.io/Alberto-Saab/';
document.querySelector('#copy-link').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(cardUrl());
    toast('Card link copied. Ready to share.');
  } catch {
    const input = document.querySelector('#share-url');
    input.hidden = false;
    input.value = cardUrl();
    input.focus();
    input.select();
    toast('Select and copy the card link below.');
  }
});
const nativeShareButton = document.querySelector('#native-share');
nativeShareButton.hidden = !navigator.share;
nativeShareButton.addEventListener('click', async () => {
  try {
    await navigator.share({ title: 'Alberto Saab | The Saab Team', text: 'Connect with Alberto Saab, Berkshire Hathaway HomeServices Nevada Properties.', url: cardUrl() });
  } catch (error) {
    if (error.name !== 'AbortError') toast('Use Copy card link to share this card.');
  }
});
for (const button of document.querySelectorAll('.inquiry-trigger')) {
  button.addEventListener('click', () => {
    document.querySelector('#interest').value = button.dataset.interest;
    openDialog(inquiryDialog, button);
  });
}
document.querySelector('#inquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const channel = event.submitter?.value || 'text';
  const isiOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  window.location.href = buildInquiryUrl(Object.fromEntries(data), channel, isiOS);
});
// Keep the dock available after visitors scroll beyond the main save button.
const primarySave = document.querySelector('.identity .save-contact');
const dock = document.querySelector('.mobile-dock');
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    dock.classList.toggle('is-hidden', entries[0].isIntersecting);
  }, { threshold: 0.2 }).observe(primarySave);
}
document.querySelector('#year').textContent = new Date().getFullYear();
