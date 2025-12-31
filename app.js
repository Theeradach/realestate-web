const SHEET_URL = 'https://opensheet.elk.sh/1J57wxNshuf9zENlvoPr7j_k4ggCP1Mqq1Aw-0vE1Bnk/Sheet1';
let allData = [];

fetch(SHEET_URL)
  .then(r => r.json())
  .then(d => {
    allData = d;
    initProvince(d);
    render(d);
  });

function initProvince(data) {
  const s = document.getElementById('province');
  [...new Set(data.map(i => i.province))].forEach(p => {
    const o = document.createElement('option');
    o.value = p;
    o.textContent = p;
    s.appendChild(o);
  });
}

function render(data) {
  const list = document.getElementById('list');
  list.innerHTML = '';
  data.forEach(i => {
    const perW = i.price / (i.rai * 400);
    const tags = i.tags 
      ? i.tags.split(',').map(t => `<span class='tag'>${t}</span>`).join('') 
      : '';
    list.innerHTML += `
      <div class='card ${i.featured === 'yes' ? 'featured' : ''}'>
        ${i.featured === 'yes' ? '<div class=badge>⭐ แนะนำ</div>' : ''}
        <h3>${i.title}</h3>
        <div class='price'>${Number(i.price).toLocaleString()} บาท</div>
        <div class='sell-copy'>เหมาะสำหรับ ${i.tags || 'ผู้ที่มองหาที่ดินคุณภาพ'}</div>
        <div>${tags}</div>
        <p>📐 ${perW.toLocaleString()} บาท/ตร.ว.</p>
        <a class='detail-btn' href='detail.html?id=${i.id}'>ดูรายละเอียด</a>
      </div>`;
  });
}

function filterData() {
  const min = Number(minPrice.value || 0);
  const max = Number(maxPrice.value || Infinity);
  const province = document.getElementById('province').value;
  const tag = document.getElementById('tagFilter').value;

  const f = allData.filter(i => {
    const tags = i.tags ? i.tags.split(',') : [];
    return Number(i.price) >= min && 
           Number(i.price) <= max &&
           (province === '' || i.province === province) &&
           (tag === '' || tags.includes(tag));
  });
  render(f);
}
