/* ==========================================================================
   GCC AI Credit Platform — Component Behaviors & Micro-interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. THEME TOGGLE
    const themeBtn = document.getElementById('toggleThemeBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
        });
    }

    // 2. RTL/LTR DIRECTION TOGGLE
    const dirBtn = document.getElementById('toggleDirBtn');
    if (dirBtn) {
        dirBtn.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            document.documentElement.setAttribute('lang', newDir === 'rtl' ? 'ar' : 'en');
        });
    }

    // 3. TABS INTERACTION
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const group = e.target.closest('.tabs');
            group.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // 4. MODAL INTERACTION
    const modalTrigger = document.getElementById('openModalBtn');
    const modalOverlay = document.getElementById('demoModal');
    const modalClose = document.getElementById('closeModalBtn');
    const modalConfirm = document.getElementById('confirmModalBtn');

    if (modalTrigger && modalOverlay) {
        modalTrigger.addEventListener('click', () => {
            modalOverlay.classList.add('active');
        });
    }
    
    const closeModal = () => modalOverlay?.classList.remove('active');
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalConfirm) modalConfirm.addEventListener('click', () => {
        showToast('Action confirmed successfully!', 'success');
        closeModal();
    });
    
    // Close modal on outside click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // 5. TOAST NOTIFICATIONS
    window.showToast = (message, type = 'info') => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        
        // Define border color based on type
        let color = 'var(--primary-500)';
        if (type === 'success') color = 'var(--accent-emerald)';
        if (type === 'warning') color = 'var(--accent-amber)';
        if (type === 'error') color = 'var(--accent-rose)';
        
        toast.style.borderColor = color;
        toast.innerHTML = `<span>${message}</span>`;
        
        container.appendChild(toast);
        
        // Trigger reflow for animation
        void toast.offsetWidth;
        toast.classList.add('show');

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); // Wait for exit animation
        }, 3000);
    };

    const toastBtn = document.getElementById('showToastBtn');
    if (toastBtn) {
        toastBtn.addEventListener('click', () => showToast('Application status updated to Pending Review.'));
    }

    // 6. ANIMATED SCORE METER
    const animateScores = () => {
        const meters = document.querySelectorAll('.score-meter');
        meters.forEach(meter => {
            const fill = meter.querySelector('.score-fill');
            const scoreValue = parseInt(meter.getAttribute('data-score') || '0', 10);
            const r = 58; // radius from SVG
            const circumference = 2 * Math.PI * r;
            
            // Set dash array
            fill.style.strokeDasharray = circumference;
            
            // Start at 0 (full offset)
            fill.style.strokeDashoffset = circumference;
            
            // Calculate final offset (850 is max score for this example)
            const percent = scoreValue / 850;
            const finalOffset = circumference - (percent * circumference);
            
            // Determine color based on risk
            let color = 'var(--accent-rose)'; // Default poor
            if (scoreValue >= 750) color = 'var(--accent-emerald)';
            else if (scoreValue >= 650) color = 'var(--accent-cyan)';
            else if (scoreValue >= 550) color = 'var(--accent-amber)';
            
            fill.style.stroke = color;
            meter.querySelector('.score-value').style.color = color;

            // Trigger animation
            setTimeout(() => {
                fill.style.strokeDashoffset = finalOffset;
            }, 100);
        });
    };

    // Run animation initially
    animateScores();

    // 7. REAL-TIME SCENARIO SLIDER BINDING
    const salaryInput = document.getElementById('simSalary');
    const pmtSlider = document.getElementById('simPmt');
    const pmtValue = document.getElementById('simPmtVal');
    const dsrBadge = document.getElementById('dsrBadge');

    const updateDSR = () => {
        if (!salaryInput || !pmtSlider || !dsrBadge) return;
        const salary = parseFloat(salaryInput.value) || 1;
        const pmt = parseFloat(pmtSlider.value) || 0;
        
        pmtValue.textContent = pmt.toLocaleString();
        
        const dsr = (pmt / salary) * 100;
        dsrBadge.textContent = \`DSR: \${dsr.toFixed(1)}%\`;
        
        // Update badge color based on risk (e.g., limit 50%)
        dsrBadge.className = 'badge';
        if (dsr > 50) dsrBadge.classList.add('badge-danger');
        else if (dsr > 40) dsrBadge.classList.add('badge-warning');
        else dsrBadge.classList.add('badge-success');
    };

    if (salaryInput) salaryInput.addEventListener('input', updateDSR);
    if (pmtSlider) pmtSlider.addEventListener('input', updateDSR);
});
