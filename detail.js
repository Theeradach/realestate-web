const SHEET_URL = 'https://opensheet.elk.sh/1J57wxNshuf9zENlvoPr7j_k4ggCP1Mqq1Aw-0vE1Bnk/Sheet1';
const id = new URLSearchParams(location.search).get('id');

fetch(SHEET_URL, {
  cache: "no-store"
})
  .then(r => r.json())
  .then(d => {
    const i = d.find(x => x.id === id);
    const perW = i.price / (Number(i.area_rai) * 400);
    const tags = i.tags 
      ? i.tags.split(',').map(t => `<span class='inline-block bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm mr-2 mb-2'>${t.trim()}</span>`).join('') 
      : '';

    document.getElementById('detail').innerHTML = `
      <h2 class='text-3xl font-bold text-gray-800 mb-4'>${i.title}</h2>
      <div class='mb-4'>${tags}</div>
      <div class='text-4xl font-bold text-green-600 mb-2'>${Number(i.price).toLocaleString()} <span class='text-xl text-gray-600'>บาท</span></div>
      <p class='text-gray-700 mb-4 text-lg'>📐 ${perW.toLocaleString()} บาท/ตร.ว.</p>
      <p class='text-gray-700 mb-6 leading-relaxed whitespace-pre-line'>${i.detail}</p>
      <div class='space-y-3'>
        <a class='block w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white text-center py-4 rounded-xl font-bold text-lg transition-all shadow-md' href='tel:${i.phone}'>📞 โทรคุยเจ้าของโดยตรง</a>
        <a class='block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-center py-4 rounded-xl font-bold text-lg transition-all shadow-md' href='${i.line_url}' target='_blank'>💬 แอด LINE ขอข้อมูล</a>
        ${i.pdf_plan ? `<a class='block w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-4 rounded-xl font-bold text-lg transition-all shadow-md' href='${i.pdf_plan}' target='_blank'>📄 เอกสาร PDF</a>` : ''}
      </div>
    `;

    document.getElementById('map').src = i.google_map ? i.google_map.replace('?q=', '?output=embed&q=') : '';
  });
