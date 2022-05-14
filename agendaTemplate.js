export default function agendaTemplate(data) {
    const { id, first_name } = data;
    return `
        <div class="agenda" data-id="${id}">
            ${first_name}
        </div>
    `;
}