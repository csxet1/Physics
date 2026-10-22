/*
  مساعد الفيزياء — You.com Web Search proxy
  انشر هذا الملف كـ Cloudflare Worker.

  Secret مطلوب:
    YDC_API_KEY = مفتاح You.com

  Endpoint:
    GET /search?q=سؤال
*/
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return new Response('', {status:204, headers:corsHeaders()});
    }
    if (url.pathname !== '/search') return json({error:'Not found'},404);
    const q = (url.searchParams.get('q') || '').trim().slice(0,500);
    if (!q) return json({error:'Missing q'},400);
    if (!env.YDC_API_KEY) return json({error:'YDC_API_KEY is not configured'},500);

    let r;
    try {
      r = await fetch('https://ydc-index.io/v1/search', {
        method:'POST',
        headers:{'X-API-Key':env.YDC_API_KEY,'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({query:q, count:8})
      });
    } catch (e) {
      return json({error:'تعذر الاتصال بخدمة البحث'},502);
    }
    const raw = await r.json().catch(()=>({}));
    if (!r.ok) return json({error:'You.com API error '+r.status},502);

    const web = Array.isArray(raw?.results?.web) ? raw.results.web : [];
    const items = web.slice(0,8).map(x => {
      let host = '';
      try { host = new URL(x.url).hostname.replace(/^www\./,''); } catch (e) {}
      const snip = x.description || (Array.isArray(x.snippets) ? x.snippets[0] : '') || '';
      return {title:x.title || '', link:x.url || '', snippet:snip, displayLink:host};
    }).filter(x => x.title && x.link);
    return json({query:q, total:items.length, items},200);
  }
};
function corsHeaders(){
  return {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
}
function json(data,status){
  return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8',...corsHeaders()}});
}
