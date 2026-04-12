// State of propositions
let state = {
    p: false,
    q: false,
    r: false
};

// Toggle function for the cards
function toggleProp(prop) {
    state[prop] = !state[prop];
    
    const card = document.getElementById(`card-${prop}`);
    if (state[prop]) {
        card.classList.add('active');
    } else {
        card.classList.remove('active');
    }

    evaluateCondition();
}

function evaluateCondition() {
    const alertTriggered = state.p && (state.q || state.r);

    updateLogicDisplay();
    updateResultsPanel(alertTriggered);
    
    if (alertTriggered) {
        showAlertOverlay();
    }
}

function updateLogicDisplay() {
    const props = ['p', 'q', 'r'];
    
    props.forEach(prop => {
        const el = document.getElementById(`log-${prop}`);
        const isTrue = state[prop];
        
        el.innerHTML = `<strong>${prop}</strong>: ${isTrue ? 'Verdadero' : 'Falso'}`;
        
        if (isTrue) {
            el.classList.add('true');
            el.classList.remove('false');
        } else {
            el.classList.add('false');
            el.classList.remove('true');
        }
    });
}

function updateResultsPanel(alertTriggered) {
    const panel = document.getElementById('results-panel');
    const title = document.getElementById('alert-title');
    const reason = document.getElementById('alert-reason');
    const siren = document.getElementById('siren');

    panel.classList.remove('safe', 'danger');

    if (alertTriggered) {
        panel.classList.add('danger');
        title.innerText = "ALERTA EMITIDA";
        // SVG Alert Triangle
        siren.innerHTML = '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>';
        
        let backupReason = "";
        if (state.q && state.r) {
            backupReason = "ambas condiciones de respaldo se cumplen (red de sensores y magnitud > 5.0)";
        } else if (state.q) {
            backupReason = "la red de sensores secundarios confirmó el evento";
        } else {
            backupReason = "la magnitud preliminar superó los 5.0 grados";
        }

        reason.innerHTML = `Se detectó actividad crítica. El sismógrafo registró ondas P (<strong>p es verdadero</strong>) y ${backupReason}.`;
    
    } else {
        if (!state.p && !state.q && !state.r) {
            title.innerText = "SISTEMA EN ESPERA";
            // SVG Shield
            siren.innerHTML = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>';
            reason.innerText = "Interactúa con las proposiciones del sistema para evaluar las condiciones geológicas.";
        } else {
            panel.classList.add('safe');
            title.innerText = "ALERTA PREVENTIVA DESCARTADA";
            // SVG Check
            siren.innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
            
            if (!state.p) {
                reason.innerHTML = `Condición de origen <strong>no cumplida</strong>. El sismógrafo primario NO detectó ondas P (<strong>p es falso</strong>). Al ser una condición necesaria, se descarta el aviso.`;
            } else {
                reason.innerHTML = `Condición secundaria <strong>insuficiente</strong>. El sismógrafo detectó ondas P, pero no existen conformaciones adicionales (<strong>q es falso y r es falso</strong>). Posible ruido estructural o sismo focal leve.`;
            }
        }
    }
}

function showAlertOverlay() {
    const overlay = document.getElementById('alert-overlay');
    overlay.classList.add('show');
}

function dismissAlert() {
    const overlay = document.getElementById('alert-overlay');
    overlay.classList.remove('show');
}
