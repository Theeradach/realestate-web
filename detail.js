const SHEET_URL = 'https://opensheet.elk.sh/1J57wxNshuf9zENlvoPr7j_k4ggCP1Mqq1Aw-0vE1Bnk/Sheet1';
const id = new URLSearchParams(location.search).get('id');

fetch(SHEET_URL)
  .then(r => r.json())
  .then(d => {
    const i = d.find(x => x.id === id);
    const perW = i.price / (i.rai * 400);
    const tags = i.tags 
      ? i.tags.split(',').map(t => `<span class='tag'>${t}</span>`).join('') 
      : '';

    document.getElementById('detail').innerHTML = `
      <h2>${i.title}</h2>
      <div>${tags}</div>
      <p class='price'>${Number(i.price).toLocaleString()} บาท</p>
      <p>📐 ${perW.toLocaleString()} บาท/ตร.ว.</p>
      <p>${i.detail}</p>
      <a class='call-btn' href='tel:${i.phone}'>📞 โทรคุยเจ้าของโดยตรง</a>
      <a class='line-btn' href='${i.line}' target='_blank'>💬 แอด LINE ขอข้อมูล</a>
      ${i.pdf ? `<a class='pdf-btn' href='${i.pdf}' target='_blank'>📄 เอกสาร PDF</a>` : ''}
    `;

    document.getElementById('map').src = `https://www.google.com/maps?q=${i.lat},${i.lng}&output=embed`;
  });
