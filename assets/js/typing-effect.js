// Typing animation for Incident Response Lifecycle
document.addEventListener('DOMContentLoaded', function() {
  const subtitleElement = document.querySelector('.site-subtitle');
  if (!subtitleElement) return;

  const phases = ['Prepare', 'Detect', 'Analyze', 'Contain', 'Eradicate', 'Recover', 'Learn'];
  const colors = [
    '#00aaff',  // Prepare - Cyan/Blue (calm, proactive readiness)
    '#ffd700',  // Detect - Gold/Yellow (alert state, warning)
    '#ffa500',  // Analyze - Orange (increased urgency, investigation)
    '#ff4500',  // Contain - Red-Orange (critical action, preventing spread)
    '#ff0000',  // Eradicate - Red (maximum threat, active elimination)
    '#00ff00',  // Recover - Green (success, restoration, healing)
    '#a855f7'   // Learn - Purple (wisdom, knowledge, reflection)
  ];

  let currentPhaseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100; // typing speed in milliseconds
  const deleteSpeed = 50; // backspace speed in milliseconds
  const pauseBeforeDelete = 1000; // 1 second pause before deleting

  function typeEffect() {
    const currentPhase = phases[currentPhaseIndex];

    // Set color for current phase
    subtitleElement.style.color = colors[currentPhaseIndex];

    if (!isDeleting && charIndex < currentPhase.length) {
      // Typing
      subtitleElement.textContent = currentPhase.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(typeEffect, typeSpeed);
    } else if (!isDeleting && charIndex === currentPhase.length) {
      // Pause before deleting
      isDeleting = true;
      setTimeout(typeEffect, pauseBeforeDelete);
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      subtitleElement.textContent = currentPhase.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(typeEffect, deleteSpeed);
    } else if (isDeleting && charIndex === 0) {
      // Move to next phase
      isDeleting = false;
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      setTimeout(typeEffect, 500);
    }
  }

  // Start the animation after a short delay
  setTimeout(typeEffect, 300);
});
