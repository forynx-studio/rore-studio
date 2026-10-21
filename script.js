'use strict';
// IMPORTANT: A wa.me/qr link cannot reliably accept prefilled order text.
// Set the business WhatsApp number below in international format without +, e.g. 9665XXXXXXXX.
const WHATSAPP_NUMBER = '966550951881';
const WHATSAPP_QR_LINK = 'https://wa.me/qr/OZ2SXRI33L3PI1?s=r';
const $ = id => document.getElementById(id);
$('year').textContent = new Date().getFullYear();
$('menu').addEventListener('click',()=>{const open=$('nav').classList.toggle('open');$('menu').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>{$('nav').classList.remove('open');$('menu').setAttribute('aria-expanded','false');}));
function openOrder(message){if(WHATSAPP_NUMBER && /^\d{9,15}$/.test(WHATSAPP_NUMBER)){window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');return;}navigator.clipboard?.writeText(message).then(()=>{alert('تم نسخ تفاصيل الطلب. سيفتح واتساب الآن؛ الصقي الرسالة في المحادثة لإرسالها. لإرسال الرسالة تلقائيًا، أضيفي رقم واتساب الأعمال في ملف script.js.');window.open(WHATSAPP_QR_LINK,'_blank','noopener,noreferrer');}).catch(()=>{window.prompt('انسخي تفاصيل الطلب ثم افتحي واتساب:',message);window.open(WHATSAPP_QR_LINK,'_blank','noopener,noreferrer');});}
const money=n=>`${n.toLocaleString('ar-SA')} ر.س`;
function updateDesign(){$('designTotal').textContent=money(Number($('format').value)+($('rush').checked?5:0));}
['format','rush'].forEach(id=>$(id).addEventListener('change',updateDesign));
document.querySelectorAll('[data-design]').forEach(b=>b.addEventListener('click',()=>{$('occasion').value=b.dataset.design;$('designOrder').scrollIntoView({behavior:'smooth',block:'center'});}));
$('designSubmit').addEventListener('click',()=>{const kind=$('format').selectedOptions[0].textContent.split(' — ')[0];const price=Number($('format').value)+($('rush').checked?5:0);openOrder(`مرحبًا RORE 🌷\nأرغب بطلب تصميم إلكتروني:\nالمناسبة: ${$('occasion').value}\nنوع التصميم: ${kind}\nطلب مستعجل: ${$('rush').checked?'نعم (+5 ريال)':'لا'}\nالسعر: ${price} ريال\nملاحظات: ${$('designNotes').value.trim()||'لا يوجد'}`);});
function validCount(input){const v=Number(input.value);return Number.isInteger(v)&&v>=1&&v<=10000;}
function updateBarcode(){
  const isMessage=$('barcodeType').value==='باركود ضمن رسالة';
  if(isMessage){$('sendGuests').checked=true;}
  $('sendGuests').disabled=isMessage;
  const send=$('sendGuests').checked;
  $('sendQty').disabled=!send;
  // Keep the optional theme design available for every barcode preparation method.
  $('themeOption').hidden=false;
  $('themeDesign').disabled=false;
  const theme=$('themeDesign').checked;
  const rush=$('barcodeRush').checked;
  const q=Number($('qty').value),s=send?Number($('sendQty').value):0;
  const valid=validCount($('qty'))&&(!send||validCount($('sendQty')));
  const total=q+s*5+(theme?10:0)+(rush?5:0);
  $('barcodeTotal').textContent=valid?money(total):'—';
  $('breakdown').textContent=valid?`${q} باركود × 1 ر.س${send?` + ${s} رسالة × 5 ر.س`:''}${theme?' + تصميم ثيم × 10 ر.س':''}${rush?' + طلب مستعجل × 5 ر.س':''}`:'أدخلي عددًا صحيحًا من 1 إلى 10,000';
  $('error').textContent=valid?'':'يرجى إدخال أعداد صحيحة بين 1 و10,000.';
  return valid;
}
['qty','sendQty'].forEach(id=>$(id).addEventListener('input',updateBarcode));
['sendGuests','barcodeType','themeDesign','ownDesign','barcodeRush'].forEach(id=>$(id).addEventListener('change',updateBarcode));
$('ownDesign').addEventListener('change',()=>{if($('ownDesign').checked)$('themeDesign').checked=false;updateBarcode();});
$('themeDesign').addEventListener('change',()=>{if($('themeDesign').checked)$('ownDesign').checked=false;updateBarcode();});
$('barcodeSubmit').addEventListener('click',()=>{
  if(!updateBarcode())return;
  const q=Number($('qty').value),s=$('sendGuests').checked?Number($('sendQty').value):0;
  const theme=$('themeDesign').checked;
  const rush=$('barcodeRush').checked;
  openOrder(`مرحبًا RORE 🌷\nأرغب بطلب باركودات دخول:\nعدد الباركودات: ${q}\nطريقة التجهيز: ${$('barcodeType').value}\nتصميم الدعوة: ${$('ownDesign').checked?'لدي تصميمي الخاص':theme?'إضافة تصميم ثيم (+10 ريال)':'بدون تصميم ثيم'}\nخدمة إرسال الرسائل للمعازيم: ${s?`نعم، إلى ${s} شخص`:'لا'}\nالمناسبة: ${$('eventName').value.trim()||'غير محددة'}\nطلب مستعجل: ${rush?'نعم (+5 ريال)':'لا'}\nالإجمالي: ${q+s*5+(theme?10:0)+(rush?5:0)} ريال\nملاحظات: ${$('barcodeNotes').value.trim()||'لا يوجد'}`);
});
updateDesign();updateBarcode();
