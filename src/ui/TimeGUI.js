
/**
 * GUI de "hora del día": barra inferior centrada, panel translúcido con
 * blur, bordes redondeados y slider con gradiente. Sin librerías externas,
 * sin PNGs — todo resuelto con DOM + CSS.
 *
 * Uso:
 *   import { createTimeGUI } from './ui/TimeGUI.js';
 *
 *   const gui = createTimeGUI({
 *     min: 5,
 *     max: 20,
 *     initial: 7,
 *     onChange: (hour) => {
 *       lights.setTime(hour);
 *       refreshSunBeams();
 *     },
 *   });
 *   document.body.appendChild(gui.element);
 *
 * Si en algún momento necesitás mover el slider desde código (por ejemplo,
 * un botón de "amanecer" que lo lleve a las 6am), usá gui.setHour(6).
 */

function formatHour(hourDecimal) {
    const totalMinutes = Math.round(hourDecimal * 60);
    let h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return { h: h12, m: String(m).padStart(2, '0'), period };
}

export function createTimeGUI({ min = 5, max = 20, initial = 7, onChange } = {}) {
    const root = document.createElement('div');
    root.className = 'time-gui';

    root.innerHTML = `
        <div class="time-gui__clock">
            <span class="time-gui__hour">--</span><span class="time-gui__colon">:</span><span class="time-gui__minute">--</span>
            <span class="time-gui__period">AM</span>
        </div>
        <div class="time-gui__divider"></div>
        <div class="time-gui__slider-block">
            <input type="range" class="time-gui__range" min="${min}" max="${max}" step="0.1" value="${initial}" />
            <div class="time-gui__labels">
                <span>5 AM</span><span>9 AM</span><span>1 PM</span><span>5 PM</span><span>8 PM</span>
            </div>
        </div>
    `;

    const hourEl = root.querySelector('.time-gui__hour');
    const minuteEl = root.querySelector('.time-gui__minute');
    const periodEl = root.querySelector('.time-gui__period');
    const range = root.querySelector('.time-gui__range');

    function updateClock(hour) {
        const { h, m, period } = formatHour(hour);
        hourEl.textContent = h;
        minuteEl.textContent = m;
        periodEl.textContent = period;
    }

    range.addEventListener('input', () => {
        const hour = parseFloat(range.value);
        updateClock(hour);
        onChange?.(hour);
    });

    updateClock(initial);

    return {
        element: root,
        setHour(hour) {
            range.value = hour;
            updateClock(hour);
        },
    };
}