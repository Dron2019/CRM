export default function some(data) {
    const { id, color, title} = data;
    return `
        <div class="part1" data-stage-id="${id}" >
            <div class="title" style="background-color: ${color}">${title}</div>
            <!-- <div class="agenda" data-id="126">Угода1</div>
            <div class="agenda" data-id="127">Угода2</div> -->
        </div>
    `;
}