export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    
    // HTML 응답에서 Cloudflare 이메일 난독화 제거
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      let html = await response.text();
      
      // Cloudflare가 변조한 링크 패턴 복원
      // [res.data](http://res.data) → res.data
      html = html.replace(/\[([^\]]+)\]\(http:\/\/\1\)/g, '$1');
      html = html.replace(/\[([^\]]+)\]\(https:\/\/\1\)/g, '$1');
      
      return new Response(html, {
        status: response.status,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        }
      });
    }
    
    return response;
  }
}
 
