const SHEET_URL = 'https://opensheet.elk.sh/1J57wxNshuf9zENlvoPr7j_k4ggCP1Mqq1Aw-0vE1Bnk/Sheet1';
let allData = [];

fetch(SHEET_URL, {
  cache: "no-store"
})
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

function convertGoogleDriveUrl(url) {
  if (!url) return '';
  
  // If it's not a Google Drive URL, return as is
  if (!url.includes('drive.google.com')) return url;
  
  // Extract file ID from various Google Drive URL formats
  let fileId = '';
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const match1 = url.match(/\/file\/d\/([^\/]+)/);
  if (match1) fileId = match1[1];
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const match2 = url.match(/[?&]id=([^&]+)/);
  if (match2) fileId = match2[1];
  
  // Use direct drive.google.com/uc format which works better for public images
  return fileId ? `https://drive.google.com/uc?id=${fileId}` : url;
}

function render(data) {
  const list = document.getElementById('list');
  list.innerHTML = '';
  
  if (data.length === 0) {
    list.innerHTML = '<div class="col-span-full text-center text-gray-500 text-xl py-12">ไม่พบทรัพย์ที่ตรงกับเงื่อนไข</div>';
    return;
  }
  
  data.forEach(i => {
    const perW = i.price / (Number(i.area_rai) * 400);
    const tags = i.tags 
      ? i.tags.split(',').map(t => `<span class='inline-block bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm mr-2 mb-2'>${t.trim()}</span>`).join('') 
      : '';
    const featuredClass = i.highlight === 'YES' ? 'ring-4 ring-yellow-400' : '';
    const badge = i.highlight === 'YES' ? `<div class='absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-bl-2xl rounded-tr-2xl font-bold shadow-md z-10'>⭐ แนะนำ</div>` : '';
    
    // Convert area display
    const rai = Math.floor(Number(i.area_rai));
    const ngan = Number(i.area_ngan) || 0;
    const areaText = ngan > 0 ? `${rai} ไร่ ${ngan} งาน` : `${rai} ไร่`;
    const wah = Number(i.area_wah).toLocaleString();
    
    // Convert and show cover image - use as background to avoid CORS issues
    const imageUrl = convertGoogleDriveUrl(i.cover_image);
    
    const coverImage = imageUrl 
      ? `<div class='w-full h-48 rounded-xl mb-4 bg-center bg-cover bg-no-repeat' style='background-image: url("${imageUrl}"); background-color: #f3f4f6;'></div>` 
      : `<div class='w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4 flex items-center justify-center text-gray-500'>📷 ไม่มีรูปภาพ</div>`;
    
    list.innerHTML += `
      <div class='bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-6 relative ${featuredClass}'>
        ${badge}
        ${coverImage}
        <h3 class='text-xl font-bold text-gray-800 mb-3 mt-2'>${i.title}</h3>
        <p class='text-gray-600 text-sm mb-2'>📍 ${i.district}, ${i.province}</p>
        <p class='text-gray-700 text-sm mb-2'>📏 ${areaText} (${wah} ตร.ว.)</p>
        <div class='text-3xl font-bold text-green-600 mb-2'>${Number(i.price).toLocaleString()} <span class='text-lg text-gray-600'>บาท</span></div>
        <div class='text-gray-600 mb-3 text-sm'>เหมาะสำหรับ ${i.tags || 'ผู้ที่มองหาที่ดินคุณภาพ'}</div>
        <div class='mb-3'>${tags}</div>
        <p class='text-gray-700 mb-4'>📐 ${perW.toLocaleString()} บาท/ตร.ว.</p>
        <a class='block w-full bg-gray-800 hover:bg-gray-900 text-white text-center py-3 rounded-xl font-semibold transition-colors' href='detail.html?id=${i.id}'>ดูรายละเอียด</a>
      </div>`;
  });
}

function filterData() {
  if (allData.length === 0) {
    alert('กรุณารอสักครู่ ข้อมูลกำลังโหลด...');
    return;
  }
  
  const minVal = document.getElementById('minPrice').value;
  const maxVal = document.getElementById('maxPrice').value;
  const min = minVal ? Number(minVal) : 0;
  const max = maxVal ? Number(maxVal) : Infinity;
  const province = document.getElementById('province').value;
  const tag = document.getElementById('tagFilter').value;

  const filtered = allData.filter(item => {
    // Check price
    const itemPrice = Number(item.price);
    if (itemPrice < min || itemPrice > max) return false;
    
    // Check province
    if (province && item.province !== province) return false;
    
    // Check tag
    if (tag) {
      const itemTags = item.tags ? item.tags.split(',').map(t => t.trim()) : [];
      if (!itemTags.includes(tag)) return false;
    }
    
    return true;
  });
  
  render(filtered);
}
