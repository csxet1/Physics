/* إعدادات اختيارية */
window.AX_CONFIG={
  title:'مساعد الفيزياء',
  whatsapp:'',   // مثال: '9647XXXXXXXXX' → يظهر زر "بلّغ الأستاذ" عند الفشل ويفتح واتساب والسؤال جاهز
  ocrLang:'ara+eng',
  // ضع هنا رابط الـWorker وبآخره /search مثل https://NAME.workers.dev/search
  webSearch:{enabled:true,endpoint:'https://physics-web-search.csxet.workers.dev/search'},
  // نظام «خارج المنهج»: enabled=false يطفّيه · webButton=true يضيف زر «ابحث بالويب» بكرت خارج المنهج
  scope:{enabled:true,webButton:false}
};
