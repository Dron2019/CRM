import agendaTemplate from './agendaTemplate.js';
import some from './stageTemplate.js';


async function canban() {
    let stages = await fetch('./stages.json');
    stages = await stages.json();
    stages.forEach(stage => {
        document.querySelector('.canban').insertAdjacentHTML('beforeend', some(stage))
    })
    // some();
    let agendas = await fetch('./agendas.json');
    agendas = await agendas.json();

    agendas.forEach(agenda => {
        const id = agenda.stageId;
        const stage = document.querySelector(`[data-stage-id="${id}"]`);
        if (stage === null) return;
        stage.insertAdjacentHTML('beforeend', agendaTemplate(agenda));
    })

    const dragDrop = dragula(
        Array.from(document.querySelectorAll('[class*="part"], .deal-result>*')),
        {
            // mirrorContainer: (e) => {
            //     console.log(e);
            //     return document.querySelector('.part1')
            // }
            isContainer: (el) => {
                return el.matches('[data-stage-id]');
            },
            invalid: function (el, handle) {
                // console.log(el);
                if (el.dataset.id !== undefined) return false;

                return true; // don't prevent any drags from initiating by default
            }
        }
    );


    dragDrop.on('drag', (el) => {
        // console.log(el);
        el.addEventListener('drag', ({clientY}) => {
            // console.log(clientY);
        })
    })
    dragDrop.on('drop', (dropElement, container) => {
        console.log(dropElement.dataset.id);
        // console.log(container);
        // console.log(container.dataset.agendeWin);
        const agendWhichChanged = agendas.find(agenda => agenda.id == dropElement.dataset.id);
        agendWhichChanged.stageId = container.dataset.stageId;
        updateAgendasOnServer(agendas);
        console.log(agendas);


        if (container.dataset.agendeResult !== undefined) {
            document.querySelector('.win-popup').textContent = container.dataset.agendeResult
            document.querySelector('.win-popup').classList.add('active');
            setTimeout(() => {
                document.querySelector('.win-popup').classList.remove('active');
            }, 3000);
            dropElement.remove();
        }
    });

    let isPressed = false;
    document.body.addEventListener('mousedown', ({target}) => {
        // console.log(target);
        if (target.closest('[data-id]') === null) return;
        isPressed = true;
    })
    document.body.addEventListener('mouseup', ({target}) => {
        // console.log(target);
        isPressed = false;
    })
    document.body.addEventListener('mousemove', ({target, clientY}) => {
        if (!isPressed) return;
        if (clientY > (innerHeight * 0.85)) {
            document.querySelector('.deal-result').classList.add('active');
            return;
        }
        document.querySelector('.deal-result').classList.remove('active');
    })
}

function updateAgendasOnServer(data) {
    const sendData = new FormData();
    sendData.append('data', JSON.stringify(data));
    fetch('./updateAgendas.php', {
        method: 'POST',
        body: sendData
    })
}

canban(); 

let prevScrollPosition = 0;
const scrollPortion = 50;
document.querySelector('.canban__arrow-next').addEventListener('click', ({target}) => {
    prevScrollPosition += scrollPortion;
    target.parentElement.scrollTo(prevScrollPosition, 0);
})
document.querySelector('.canban__arrow-prev').addEventListener('click', ({target}) => {
    prevScrollPosition -= scrollPortion;
    target.parentElement.scrollTo(prevScrollPosition, 0);
})