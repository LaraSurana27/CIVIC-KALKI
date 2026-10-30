(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))r(d);new MutationObserver(d=>{for(const u of d)if(u.type==="childList")for(const p of u.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&r(p)}).observe(document,{childList:!0,subtree:!0});function s(d){const u={};return d.integrity&&(u.integrity=d.integrity),d.referrerPolicy&&(u.referrerPolicy=d.referrerPolicy),d.crossOrigin==="use-credentials"?u.credentials="include":d.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function r(d){if(d.ep)return;d.ep=!0;const u=s(d);fetch(d.href,u)}})();const Fr="modulepreload",Zr=function(a){return"/"+a},Mo={},Jn=function(o,s,r){let d=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const p=document.querySelector("meta[property=csp-nonce]"),h=(p==null?void 0:p.nonce)||(p==null?void 0:p.getAttribute("nonce"));d=Promise.allSettled(s.map(m=>{if(m=Zr(m),m in Mo)return;Mo[m]=!0;const v=m.endsWith(".css"),y=v?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${y}`))return;const g=document.createElement("link");if(g.rel=v?"stylesheet":Fr,v||(g.as="script"),g.crossOrigin="",g.href=m,h&&g.setAttribute("nonce",h),document.head.appendChild(g),v)return new Promise((w,_)=>{g.addEventListener("load",w),g.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${m}`)))})}))}function u(p){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=p,window.dispatchEvent(h),!h.defaultPrevented)throw p}return d.then(p=>{for(const h of p||[])h.status==="rejected"&&u(h.reason);return o().catch(u)})},qo=[];let Vo=()=>{};function pe(a,o){qo.push({path:a,handler:o})}function Wo(a){Vo=a}function Ur(a){const o=[...qo].sort((s,r)=>{const d=s.path.includes(":"),u=r.path.includes(":");return!d&&u?-1:d&&!u?1:0});for(const s of o){const r=[],d=s.path.replace(/:([^/]+)/g,(h,m)=>(r.push(m),"([^/]+)")).replace(/\//g,"\\/"),u=new RegExp(`^${d}$`),p=a.match(u);if(p){const h={};return r.forEach((m,v)=>{h[m]=decodeURIComponent(p[v+1])}),{handler:s.handler,params:h,path:s.path}}}return null}function ie(a){window.history.pushState({},"",a),Yn(window.location.href)}function Yn(a=window.location.href){const o=new URL(a,window.location.origin);let s=o.pathname;s.length>1&&s.endsWith("/")&&(s=s.slice(0,-1));const r=Ur(s);if(r){const d=r.handler(r.params,o.searchParams);d&&typeof d.then=="function"&&d.then(()=>{window.dispatchEvent(new CustomEvent("civic:route-rendered",{detail:{pathname:s,async:!0}}))}).catch(u=>{console.error("[Router Error]:",u)})}else Vo();window.dispatchEvent(new CustomEvent("civic:route-rendered",{detail:{pathname:s}}))}function Go(){window.navigate=ie,window.addEventListener("popstate",()=>Yn(window.location.href));const a=document.getElementById("app");a&&a.addEventListener("click",o=>{const s=o.target.closest("a[href]");if(!s)return;const r=s.getAttribute("href");!r||r.startsWith("http")||r.startsWith("mailto:")||r.startsWith("#")||(o.preventDefault(),ie(r))}),Yn(window.location.href)}const qr=Object.freeze(Object.defineProperty({__proto__:null,addRoute:pe,initRouter:Go,navigate:ie,onNotFound:Wo},Symbol.toStringTag,{value:"Module"}));let Ze=null,Xe=null,Lt=null,ci=null;async function Ko(){try{const a=await fetch("/api/auth/me",{credentials:"include",headers:{"X-Requested-With":"ck-web"}});if(!a.ok)return Ze=null,Xe=null,null;const o=await a.json();return o.success&&o.data?(Ze=o.data.user||null,Xe=o.data.expires_at||null,Jo(),Ze):(Ze=null,Xe=null,null)}catch{return Ze=null,Xe=null,null}}function Jo(){if(Lt&&clearTimeout(Lt),!Xe)return;const a=new Date(Xe).getTime()-Date.now();a>0&&(Lt=setTimeout(()=>{Ze=null,Xe=null,Lt=null},a))}async function Vr(){return ci||(ci=Ko().finally(()=>{ci=null}),ci)}function Mt(){return Ze}function Ji(){return(Ze==null?void 0:Ze.role)||null}function Yi(){return Ze?Xe?new Date(Xe).getTime()>Date.now():!0:!1}function Yo(a){a&&(Ze=a.user||(a.user_id?a:null),Xe=a.expires_at||null,Jo())}function la(){Ze=null,Xe=null,Lt&&(clearTimeout(Lt),Lt=null)}async function Wr(){return Ko()}function ot(a){return Yi()?!0:(a("/login"),!1)}function da(a,o){if(!ot(o))return!1;const s=Ji();return a.includes(s)?!0:(o("/dashboard"),!1)}const Gr={citizen:"Citizen",coordinator_area:"Area Coordinator",coordinator_general:"General Coordinator",director:"Director",admin:"Administrator"};function hi(a){return Gr[a]||a}const Xn=[{code:"en",name:"English",nativeName:"English",region:"Pan-India / Official",popular:!0},{code:"hi",name:"Hindi",nativeName:"हिन्दी",region:"North & Central India",popular:!0},{code:"mr",name:"Marathi",nativeName:"मराठी",region:"Maharashtra",popular:!0},{code:"ta",name:"Tamil",nativeName:"தமிழ்",region:"Tamil Nadu & Puducherry",popular:!0},{code:"te",name:"Telugu",nativeName:"తెలుగు",region:"Andhra Pradesh & Telangana",popular:!0},{code:"bn",name:"Bengali",nativeName:"বাংলা",region:"West Bengal & Tripura",popular:!0},{code:"gu",name:"Gujarati",nativeName:"ગુજરાતી",region:"Gujarat",popular:!0},{code:"kn",name:"Kannada",nativeName:"ಕನ್ನಡ",region:"Karnataka",popular:!0},{code:"ml",name:"Malayalam",nativeName:"മലയാളം",region:"Kerala & Lakshadweep",popular:!0},{code:"pa",name:"Punjabi",nativeName:"ਪੰਜਾਬੀ",region:"Punjab",popular:!0},{code:"ur",name:"Urdu",nativeName:"اردو",region:"Pan-India",popular:!0},{code:"as",name:"Assamese",nativeName:"অসমীয়া",region:"Assam"},{code:"bho",name:"Bhojpuri",nativeName:"भोजपुरी",region:"Bihar & Uttar Pradesh"},{code:"doi",name:"Dogri",nativeName:"डोगरी",region:"Jammu & Kashmir"},{code:"gom",name:"Konkani",nativeName:"कोंकणी",region:"Goa & Konkan"},{code:"mai",name:"Maithili",nativeName:"मैथिली",region:"Bihar & Jharkhand"},{code:"mni-Mtei",name:"Meiteilon (Manipuri)",nativeName:"ꯃꯤꯇꯩꯂꯣꯟ",region:"Manipur"},{code:"lus",name:"Mizo",nativeName:"Mizo ṭawng",region:"Mizoram"},{code:"ne",name:"Nepali",nativeName:"नेपाली",region:"Sikkim & West Bengal"},{code:"or",name:"Odia",nativeName:"ଓଡ଼ିଆ",region:"Odisha"},{code:"sa",name:"Sanskrit",nativeName:"संस्कृतम्",region:"Classical Language"},{code:"sd",name:"Sindhi",nativeName:"سنڌي",region:"Sindhi"}],Xo="civic_kalki_lang";function Vt(){return localStorage.getItem(Xo)||"en"}function Qo(a){return Xn.find(o=>o.code.toLowerCase()===(a||"").toLowerCase())||{code:a||"en",name:"English",nativeName:"English",region:"Official"}}function es(a){try{const o=localStorage.getItem(`civic_trans_${a}`);return o?JSON.parse(o):{}}catch{return{}}}function Kr(a,o){try{const r={...es(a),...o};localStorage.setItem(`civic_trans_${a}`,JSON.stringify(r))}catch{}}function ts(){["googtrans","googtrans_opt","__googtrans"].forEach(o=>{document.cookie=`${o}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`,window.location.hostname&&(document.cookie=`${o}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`,document.cookie=`${o}=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`)}),document.querySelectorAll(".goog-te-banner-frame, iframe.goog-te-banner-frame, #google_translate_element, #goog-gt-tt, .goog-te-balloon-frame").forEach(o=>{try{o.remove()}catch{}}),document.body&&(document.body.style.top="0px",document.body.style.position="static")}function Jr(a){const o=[],s=[],r=[],d=new Set,u=document.createTreeWalker(a,NodeFilter.SHOW_TEXT,{acceptNode(p){if(!p.nodeValue)return NodeFilter.FILTER_REJECT;const h=p.parentElement;if(!h)return NodeFilter.FILTER_REJECT;const m=h.tagName.toLowerCase();if(["script","style","code","pre","textarea"].includes(m)||h.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return NodeFilter.FILTER_REJECT;const v=(p._civicOriginal!==void 0?p._civicOriginal:p.nodeValue).trim();return!v||/^[\d\s\-_.,/\\:;!@#$%^&*()=+~`|<>?"'’]+$/.test(v)||/^#?[A-Za-z]{1,5}-\d+$/.test(v)||/^#\d+$/.test(v)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});for(;u.nextNode();){const p=u.currentNode;p._civicOriginal===void 0&&(p._civicOriginal=p.nodeValue);const h=p._civicOriginal.trim();h&&(o.push({node:p,original:h}),d.add(h))}return a.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(p=>{if(p.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return;p._civicOriginalPlaceholder===void 0&&(p._civicOriginalPlaceholder=p.placeholder);const h=(p._civicOriginalPlaceholder||"").trim();h&&!/^[\d\s]+$/.test(h)&&(s.push({element:p,original:h}),d.add(h))}),a.querySelectorAll("[title]").forEach(p=>{if(p.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return;p._civicOriginalTitle===void 0&&(p._civicOriginalTitle=p.title);const h=(p._civicOriginalTitle||"").trim();h&&!/^[\d\s]+$/.test(h)&&(r.push({element:p,original:h}),d.add(h))}),{textItems:o,placeholderItems:s,titleItems:r,uniqueStrings:Array.from(d)}}function Yr(a=document.getElementById("app")){if(!a)return;const o=document.createTreeWalker(a,NodeFilter.SHOW_TEXT,null);for(;o.nextNode();){const s=o.currentNode;s._civicOriginal!==void 0&&(s.nodeValue=s._civicOriginal)}a.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(s=>{s._civicOriginalPlaceholder!==void 0&&(s.placeholder=s._civicOriginalPlaceholder)}),a.querySelectorAll("[title]").forEach(s=>{s._civicOriginalTitle!==void 0&&(s.title=s._civicOriginalTitle)})}let jn=!1,Hn=!1,Qn=!1;async function Wt(a){const o=a||Vt(),s=document.getElementById("app")||document.body;if(!s)return;if(o==="en"){Yr(s);return}const{textItems:r,placeholderItems:d,titleItems:u,uniqueStrings:p}=Jr(s);if(p.length===0)return;const h=es(o),m=[],v=()=>{Qn=!0;try{r.forEach(({node:y,original:g})=>{if(h[g])if(y._civicOriginal&&y._civicOriginal.trim()===g){const w=y._civicOriginal.match(/^\s*/)[0],_=y._civicOriginal.match(/\s*$/)[0];y.nodeValue=w+h[g]+_}else y._civicOriginal&&(y.nodeValue=y._civicOriginal.replace(g,h[g]))}),d.forEach(({element:y,original:g})=>{h[g]&&(y.placeholder=h[g])}),u.forEach(({element:y,original:g})=>{h[g]&&(y.title=h[g])})}finally{setTimeout(()=>{Qn=!1},40)}};if(v(),p.forEach(y=>{h[y]||m.push(y)}),m.length!==0){if(jn){Hn=!0;return}jn=!0;try{const y=await fetch("/api/translate",{method:"POST",headers:{"Content-Type":"application/json","X-Requested-With":"ck-web"},body:JSON.stringify({texts:m,targetLang:o})});if(y.ok){const g=await y.json();g&&g.translations&&(Kr(o,g.translations),Object.assign(h,g.translations),v())}}catch(y){console.error("[Translation Service Error]:",y)}finally{jn=!1,Hn&&(Hn=!1,setTimeout(()=>{Wt(o)},50))}}}function So(a){const o=(a||"en").trim();localStorage.setItem(Xo,o),ts(),Xr(o),Wt(o)}function Xi(a={}){const o=a.idPrefix||"topbar",s=Vt(),r=Qo(s),d=Xn.filter(u=>u.popular);return`
    <div class="lang-dropdown-container notranslate" id="${o}-lang-container">
      <button 
        type="button" 
        class="lang-trigger-btn" 
        id="${o}-lang-btn" 
        aria-haspopup="true" 
        aria-expanded="false" 
        title="Choose language (Indian Regional & Official Languages)"
      >
        <span class="lang-globe-icon" aria-hidden="true">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="1.8"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
        </span>
        <span class="lang-btn-label truncate" id="${o}-lang-label">
          ${We(r.nativeName||r.name)}
        </span>
        <span class="lang-badge">${We(s.toUpperCase().slice(0,5))}</span>
        <svg class="lang-chevron" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Dropdown Card -->
      <div class="lang-dropdown-menu" id="${o}-lang-dropdown">
        <div class="lang-dropdown-header">
          <div class="lang-header-title">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>Choose Language (भारतीय भाषाएं)</span>
          </div>
          <span class="lang-count-badge">🇮🇳 Indian Languages</span>
        </div>

        <!-- Search Bar with region search -->
        <div class="lang-search-box">
          <svg class="lang-search-icon" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            type="text" 
            class="lang-search-input" 
            id="${o}-lang-search" 
            placeholder="Search language or state (e.g. Hindi, Marathi, Tamil)..." 
            autocomplete="off"
            spellcheck="false"
          />
          <button type="button" class="lang-search-clear hidden" id="${o}-lang-clear" aria-label="Clear search">✕</button>
        </div>

        <!-- Quick Select Chips for Major Indian Languages -->
        <div class="lang-quick-section" id="${o}-lang-popular-section">
          <div class="lang-section-label">Most Common</div>
          <div class="lang-chips-grid">
            ${d.map(u=>`
              <button 
                type="button" 
                class="lang-chip ${u.code===s?"active":""}" 
                data-lang="${u.code}"
                title="${We(u.name)} (${We(u.region)})"
              >
                ${We(u.nativeName)}
              </button>
            `).join("")}
          </div>
        </div>

        <div class="lang-section-label" style="padding: 6px 14px 2px;">Official & Regional Languages</div>

        <!-- Full Scrollable List -->
        <div class="lang-options-scroll" id="${o}-lang-list">
          ${Xn.map(u=>{const p=u.code===s;return`
              <div 
                class="lang-option-row ${p?"selected":""}" 
                data-lang="${u.code}" 
                data-name="${We(u.name.toLowerCase())}" 
                data-native="${We(u.nativeName.toLowerCase())}"
                data-region="${We((u.region||"").toLowerCase())}"
                role="button"
                tabindex="0"
              >
                <div class="lang-names-wrap">
                  <span class="lang-native-name">${We(u.nativeName)}</span>
                  <span class="lang-english-name">${We(u.name)} • <span style="opacity:0.75;">${We(u.region)}</span></span>
                </div>
                <div class="lang-code-pill">${We(u.code)}</div>
                ${p?`
                  <svg class="lang-check-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                `:""}
              </div>
            `}).join("")}
        </div>

        <!-- Footer / Reset -->
        <div class="lang-dropdown-footer">
          <button type="button" class="lang-reset-btn" id="${o}-lang-reset">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset to English (Default)
          </button>
        </div>
      </div>
    </div>
  `}function Qi(a="topbar"){const o=document.getElementById(`${a}-lang-container`),s=document.getElementById(`${a}-lang-btn`),r=document.getElementById(`${a}-lang-dropdown`),d=document.getElementById(`${a}-lang-search`),u=document.getElementById(`${a}-lang-clear`),p=document.getElementById(`${a}-lang-list`),h=document.getElementById(`${a}-lang-reset`),m=document.getElementById(`${a}-lang-popular-section`);if(!(!o||!s||!r)){if(s.addEventListener("click",v=>{v.stopPropagation();const y=r.classList.contains("show");document.querySelectorAll(".lang-dropdown-menu.show").forEach(g=>{g!==r&&g.classList.remove("show")}),r.classList.toggle("show",!y),s.setAttribute("aria-expanded",String(!y)),!y&&d&&setTimeout(()=>d.focus(),50)}),r.addEventListener("click",v=>{v.stopPropagation();const y=v.target.closest("[data-lang]");if(y){const g=y.getAttribute("data-lang");g&&(r.classList.remove("show"),s.setAttribute("aria-expanded","false"),So(g))}}),d&&p){const v=Array.from(p.querySelectorAll(".lang-option-row")),y=()=>{const g=(d.value||"").trim().toLowerCase();u==null||u.classList.toggle("hidden",g.length===0),m&&(m.style.display=g.length>0?"none":"block");let w=0;v.forEach(z=>{const C=z.getAttribute("data-name")||"",M=z.getAttribute("data-native")||"",R=z.getAttribute("data-region")||"",B=(z.getAttribute("data-lang")||"").toLowerCase(),ne=!g||C.includes(g)||M.includes(g)||R.includes(g)||B.includes(g);z.style.display=ne?"flex":"none",ne&&w++});let _=p.querySelector(".lang-no-match");w===0?(_||(_=document.createElement("div"),_.className="lang-no-match",_.textContent="No Indian language found matching your search",p.appendChild(_)),_.style.display="block"):_&&(_.style.display="none")};d.addEventListener("input",y),u&&u.addEventListener("click",g=>{g.stopPropagation(),d.value="",y(),d.focus()})}h&&h.addEventListener("click",v=>{v.stopPropagation(),r.classList.remove("show"),s.setAttribute("aria-expanded","false"),So("en")}),document.addEventListener("click",v=>{o.contains(v.target)||(r.classList.remove("show"),s.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",v=>{v.key==="Escape"&&r.classList.contains("show")&&(r.classList.remove("show"),s.setAttribute("aria-expanded","false"),s.focus())})}}function Xr(a){const o=Qo(a);document.querySelectorAll(".lang-btn-label").forEach(s=>{s.textContent=o.nativeName||o.name}),document.querySelectorAll(".lang-badge").forEach(s=>{s.textContent=(a||"EN").toUpperCase().slice(0,5)}),document.querySelectorAll(".lang-chip").forEach(s=>{const r=s.getAttribute("data-lang")===a;s.classList.toggle("active",r)}),document.querySelectorAll(".lang-option-row").forEach(s=>{const r=s.getAttribute("data-lang")===a;s.classList.toggle("selected",r);let d=s.querySelector(".lang-check-icon");if(r&&!d){const u=document.createElementNS("http://www.w3.org/2000/svg","svg");u.setAttribute("class","lang-check-icon"),u.setAttribute("width","16"),u.setAttribute("height","16"),u.setAttribute("fill","none"),u.setAttribute("stroke","currentColor"),u.setAttribute("viewBox","0 0 24 24"),u.innerHTML='<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>',s.appendChild(u)}else!r&&d&&d.remove()})}let Dn=null,Fn=null;function Qr(){if(Dn)return;const a=document.getElementById("app")||document.body;a&&(Dn=new MutationObserver(o=>{if(Qn)return;const s=Vt();if(s==="en")return;let r=!1;for(const d of o){if(d.type==="childList"&&d.addedNodes.length>0){for(const u of d.addedNodes)if(u.nodeType===Node.ELEMENT_NODE){if(u.closest&&u.closest(".notranslate, .lang-dropdown-menu, .lang-dropdown-container"))continue;r=!0;break}}if(r)break}r&&(Fn&&clearTimeout(Fn),Fn=setTimeout(()=>{Wt(s)},70))}),Dn.observe(a,{childList:!0,subtree:!0}))}function el(){ts(),window.civicTranslatePage=o=>Wt(o||Vt()),Qr();const a=Vt();a!=="en"&&setTimeout(()=>{Wt(a)},100),window.addEventListener("civic:route-rendered",()=>{const o=Vt();o!=="en"&&setTimeout(()=>{Wt(o)},60)})}function We(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}const te={tool:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',sprout:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>',users:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',activity:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',message:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',zap:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',grid:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',workflow:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>',chart:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',shield:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',bot:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><path d="M12 2v4"/><path d="M8 2h8"/></svg>',tree:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"/><path d="M8 15h8l-2-4h3l-2-4h2L12 2 7 7h2l-2 4h3z"/></svg>',school:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v6a6 3 0 0 0 12 0v-6"/><path d="M22 13v6"/></svg>',water:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',clock:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',chatLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',botLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><path d="M12 2v4"/><path d="M8 2h8"/><path d="M2 13h1"/><path d="M21 13h1"/></svg>',gearLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',checkLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',flame:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',target:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',layers:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',heartHand:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',lock:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',database:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>',sparkles:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',toolBox:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',heartFill:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="#ff5a36" stroke="#ff5a36" stroke-width="1"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'};function tl(){const a=Yi(),o=document.getElementById("app");o&&(o.innerHTML=`
    <div class="ck-home">

      <!-- ═══════════ HEADER ═══════════ -->
      <header class="ck-home-header" id="ck-home-header">
        <div class="ck-home-header-inner">
          <a href="/" class="ck-home-brand">
            <img src="/logo.png" alt="CivicKalki" class="ck-home-brand-img" />
          </a>

          <nav class="ck-home-nav" id="ck-home-nav">
            <a href="#features" class="ck-home-nav-link">Features</a>
            <a href="#how-it-works" class="ck-home-nav-link">How It Works</a>
            <a href="#buzz" class="ck-home-nav-link">Civic Buzz</a>
            <a href="#about" class="ck-home-nav-link">About</a>
            <a href="#faq" class="ck-home-nav-link">FAQ</a>
          </nav>

          <div class="ck-home-header-actions">
            ${Xi({idPrefix:"home"})}
            ${a?`
              <a href="/dashboard" class="ck-home-cta-btn">
                Open Civic OS →
              </a>
            `:`
              <a href="/login" class="ck-home-signin-link">Sign In</a>
              <a href="/signup" class="ck-home-cta-btn">Get Started — Free</a>
            `}
            <button class="ck-home-burger" id="ck-home-burger" aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <!-- ═══════════ HERO ═══════════ -->
      <section class="ck-home-hero">

        <!-- Floating playful badges with professional SVGs -->
        <div class="ck-hero-float ck-float-1" aria-hidden="true">
          <span class="ck-float-badge ck-fb-orange">${te.tool} REPORT</span>
        </div>
        <div class="ck-hero-float ck-float-2" aria-hidden="true">
          <span class="ck-float-badge ck-fb-green">${te.sprout} INITIATIVE</span>
        </div>
        <div class="ck-hero-float ck-float-3" aria-hidden="true">
          <span class="ck-float-badge ck-fb-blue">${te.users} VOLUNTEER</span>
        </div>
        <div class="ck-hero-float ck-float-4" aria-hidden="true">
          <span class="ck-float-badge ck-fb-purple">${te.activity} TRACK</span>
        </div>
        <div class="ck-hero-float ck-float-5" aria-hidden="true">
          <span class="ck-float-badge ck-fb-pink">${te.message} SPEAK UP</span>
        </div>

        <!-- Big personality text -->
        <div class="ck-hero-content">
          <div class="ck-hero-pill">
            <span class="ck-hero-pill-dot"></span>
            The Civic OS That Actually Listens
          </div>

          <h1 class="ck-hero-headline">
            Don't<br>
            Hesitate<br>
            to <span class="ck-hero-accent">Speak Up.</span>
          </h1>

          <p class="ck-hero-sub">
            Your city has problems. You have ideas.<br class="ck-hide-mobile">
            CIVIC-KALKI turns both into structured civic action<br class="ck-hide-mobile">
            — with AI that actually understands what you need.
          </p>

          <!-- Mascot eyes peeking up -->
          <div class="ck-hero-mascot" aria-hidden="true">
            <div class="ck-mascot-body">
              <div class="ck-mascot-eye ck-eye-left">
                <div class="ck-mascot-pupil" id="ck-pupil-l"></div>
              </div>
              <div class="ck-mascot-eye ck-eye-right">
                <div class="ck-mascot-pupil" id="ck-pupil-r"></div>
              </div>
            </div>
          </div>

          <div class="ck-hero-actions">
            ${a?`
              <a href="/dashboard" class="ck-btn-hero">Enter My Workspace →</a>
            `:`
              <a href="/signup" class="ck-btn-hero">Start Your Civic Journey</a>
              <a href="/login" class="ck-btn-hero-ghost">I have an account →</a>
            `}
          </div>

          <!-- Trust badges row -->
          <div class="ck-hero-trust">
            <div class="ck-trust-item">
              <span class="ck-trust-num">7+</span>
              <span class="ck-trust-label">Civic Modules</span>
            </div>
            <div class="ck-trust-sep"></div>
            <div class="ck-trust-item">
              <span class="ck-trust-num">AI</span>
              <span class="ck-trust-label">Powered Agent</span>
            </div>
            <div class="ck-trust-sep"></div>
            <div class="ck-trust-item">
              <span class="ck-trust-num">0</span>
              <span class="ck-trust-label">Code Needed</span>
            </div>
            <div class="ck-trust-sep"></div>
            <div class="ck-trust-item">
              <span class="ck-trust-num">∞</span>
              <span class="ck-trust-label">Civic Impact</span>
            </div>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="ck-hero-scroll" aria-hidden="true">
          <div class="ck-scroll-line"></div>
          <span>scroll</span>
        </div>
      </section>

      <!-- ═══════════ FEATURES — TABBED ═══════════ -->
      <section class="ck-home-section ck-section-features" id="features">
        <div class="ck-section-inner">
          <div class="ck-section-label">PLATFORM CAPABILITIES</div>
          <h2 class="ck-section-heading">Everything civic.<br>One intelligent platform.</h2>
          <p class="ck-section-sub">From reporting a broken streetlight to tracking city-wide governance — CIVIC-KALKI is the operating system your city didn't know it needed.</p>

          <div class="ck-tabs" id="ck-feature-tabs">
            <div class="ck-tabs-nav">
              <button class="ck-tab-btn active" data-tab="tab-report">${te.zap} Report</button>
              <button class="ck-tab-btn" data-tab="tab-organize">${te.grid} Organize</button>
              <button class="ck-tab-btn" data-tab="tab-execute">${te.workflow} Execute</button>
              <button class="ck-tab-btn" data-tab="tab-understand">${te.chart} Understand</button>
              <button class="ck-tab-btn" data-tab="tab-accountable">${te.shield} Accountable</button>
            </div>

            <div class="ck-tabs-body">
              <div class="ck-tab-panel active" id="tab-report">
                <div class="ck-tab-visual">
                  <div class="ck-tab-mockup">
                    <div class="ck-mockup-topbar">
                      <span class="ck-dot red"></span><span class="ck-dot yellow"></span><span class="ck-dot green"></span>
                      <span class="ck-mockup-url">civickalki.app/report</span>
                    </div>
                    <div class="ck-mockup-body">
                      <div class="ck-mock-chat">
                        <div class="ck-mock-msg ck-msg-user">The streetlight near Sector 5 park has been broken for 3 weeks</div>
                        <div class="ck-mock-msg ck-msg-ai">
                          <span class="ck-ai-badge">${te.bot} KALKI AI</span>
                          Got it! I've classified this as a <strong>Public Infrastructure — Streetlight</strong> issue. Priority: <strong style="color:#e0431f;">High</strong>. Filing now...
                        </div>
                        <div class="ck-mock-typing">
                          <span></span><span></span><span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ck-tab-info">
                  <h3>Report problems in plain language.</h3>
                  <ul class="ck-feature-list">
                    <li>Just tell the AI what's wrong — no forms, no jargon</li>
                    <li>Automatic classification, priority, and routing</li>
                    <li>Attach photos, location, and evidence</li>
                    <li>Track resolution in real time</li>
                  </ul>
                  <a href="/signup" class="ck-btn-feature">Try Reporting →</a>
                </div>
              </div>

              <div class="ck-tab-panel" id="tab-organize">
                <div class="ck-tab-visual">
                  <div class="ck-tab-mockup">
                    <div class="ck-mockup-topbar">
                      <span class="ck-dot red"></span><span class="ck-dot yellow"></span><span class="ck-dot green"></span>
                      <span class="ck-mockup-url">civickalki.app/initiative</span>
                    </div>
                    <div class="ck-mockup-body">
                      <div class="ck-mock-organize">
                        <div class="ck-org-card">
                          <div class="ck-org-icon-pill">${te.tree}</div>
                          <div>
                            Tree Plantation Drive
                            <div class="ck-org-meta">42 volunteers • Sector 7</div>
                          </div>
                        </div>
                        <div class="ck-org-card">
                          <div class="ck-org-icon-pill">${te.school}</div>
                          <div>
                            School Renovation Fund
                            <div class="ck-org-meta">₹2.4L raised • Ward 12</div>
                          </div>
                        </div>
                        <div class="ck-org-card">
                          <div class="ck-org-icon-pill">${te.water}</div>
                          <div>
                            Clean Water Initiative
                            <div class="ck-org-meta">18 contributors • City-wide</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ck-tab-info">
                  <h3>Organize people and resources.</h3>
                  <ul class="ck-feature-list">
                    <li>Build civic initiatives around any cause</li>
                    <li>Recruit volunteers and track contributions</li>
                    <li>Link citizens, documents, and related cases</li>
                    <li>One engine powers every civic module</li>
                  </ul>
                  <a href="/signup" class="ck-btn-feature">Start Organizing →</a>
                </div>
              </div>

              <div class="ck-tab-panel" id="tab-execute">
                <div class="ck-tab-visual">
                  <div class="ck-tab-mockup">
                    <div class="ck-mockup-topbar">
                      <span class="ck-dot red"></span><span class="ck-dot yellow"></span><span class="ck-dot green"></span>
                      <span class="ck-mockup-url">civickalki.app/workflow</span>
                    </div>
                    <div class="ck-mockup-body">
                      <div class="ck-mock-workflow">
                        <div class="ck-wf-step done"><span>✓</span> Submitted</div>
                        <div class="ck-wf-line done"></div>
                        <div class="ck-wf-step done"><span>✓</span> Area Review</div>
                        <div class="ck-wf-line active"></div>
                        <div class="ck-wf-step active"><span>${te.clock}</span> Director Approval</div>
                        <div class="ck-wf-line"></div>
                        <div class="ck-wf-step"><span>○</span> Resolved</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ck-tab-info">
                  <h3>Transparent multi-stage workflows.</h3>
                  <ul class="ck-feature-list">
                    <li>Role-based approval chains (citizen → coordinator → director)</li>
                    <li>Automated verification and SLA tracking</li>
                    <li>Real-time status visible to all stakeholders</li>
                    <li>Zero manual process — rules drive everything</li>
                  </ul>
                  <a href="/signup" class="ck-btn-feature">See Workflows →</a>
                </div>
              </div>

              <div class="ck-tab-panel" id="tab-understand">
                <div class="ck-tab-visual">
                  <div class="ck-tab-mockup">
                    <div class="ck-mockup-topbar">
                      <span class="ck-dot red"></span><span class="ck-dot yellow"></span><span class="ck-dot green"></span>
                      <span class="ck-mockup-url">civickalki.app/intelligence</span>
                    </div>
                    <div class="ck-mockup-body">
                      <div class="ck-mock-chart">
                        <div class="ck-chart-bars">
                          <div class="ck-bar" style="height:45%"><span>Roads</span></div>
                          <div class="ck-bar ck-bar-accent" style="height:80%"><span>Sanitation</span></div>
                          <div class="ck-bar" style="height:35%"><span>Water</span></div>
                          <div class="ck-bar" style="height:60%"><span>Lights</span></div>
                          <div class="ck-bar" style="height:25%"><span>Parks</span></div>
                        </div>
                        <div class="ck-chart-label">Issue Distribution by Category — Ward 5</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ck-tab-info">
                  <h3>Civic intelligence, not just data.</h3>
                  <ul class="ck-feature-list">
                    <li>AI-generated insights on ward-level patterns</li>
                    <li>Real-time aggregated reports and dashboards</li>
                    <li>Identify hotspots, trends, and priority areas</li>
                    <li>Decision support for governance teams</li>
                  </ul>
                  <a href="/signup" class="ck-btn-feature">Explore Intelligence →</a>
                </div>
              </div>

              <div class="ck-tab-panel" id="tab-accountable">
                <div class="ck-tab-visual">
                  <div class="ck-tab-mockup">
                    <div class="ck-mockup-topbar">
                      <span class="ck-dot red"></span><span class="ck-dot yellow"></span><span class="ck-dot green"></span>
                      <span class="ck-mockup-url">civickalki.app/audit</span>
                    </div>
                    <div class="ck-mockup-body">
                      <div class="ck-mock-audit">
                        <div class="ck-audit-row"><span class="ck-audit-time">10:42 AM</span><span class="ck-audit-who">Coordinator Sharma</span><span class="ck-audit-act">Approved grievance #GRV-0042</span></div>
                        <div class="ck-audit-row"><span class="ck-audit-time">10:15 AM</span><span class="ck-audit-who">Rule Engine</span><span class="ck-audit-act">Auto-created inspection task</span></div>
                        <div class="ck-audit-row"><span class="ck-audit-time">09:30 AM</span><span class="ck-audit-who">Citizen Priya</span><span class="ck-audit-act">Submitted grievance with photo evidence</span></div>
                        <div class="ck-audit-row"><span class="ck-audit-time">Yesterday</span><span class="ck-audit-who">Director Mehta</span><span class="ck-audit-act">Escalated priority to High</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ck-tab-info">
                  <h3>Full accountability. Zero cover-ups.</h3>
                  <ul class="ck-feature-list">
                    <li>Immutable audit trail on every civic action</li>
                    <li>Parent-child entity lineage tracking</li>
                    <li>Role-based access with full transparency</li>
                    <li>Institutional memory that never forgets</li>
                  </ul>
                  <a href="/signup" class="ck-btn-feature">See Audit Trail →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ HOW IT WORKS ═══════════ -->
      <section class="ck-home-section ck-section-how" id="how-it-works">
        <div class="ck-section-inner">
          <div class="ck-section-label">HOW IT WORKS</div>
          <h2 class="ck-section-heading">From problem to progress.<br><span class="ck-text-accent">In 4 steps.</span></h2>

          <div class="ck-how-grid">
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">01</div>
                <div class="ck-how-icon-box">${te.chatLarge}</div>
              </div>
              <h3>Tell us what's wrong</h3>
              <p>Type or speak in plain language. Our AI understands civic issues — no bureaucratic forms.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">02</div>
                <div class="ck-how-icon-box">${te.botLarge}</div>
              </div>
              <h3>AI classifies & routes</h3>
              <p>KALKI AI auto-categorizes, sets priority, and routes to the right department instantly.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">03</div>
                <div class="ck-how-icon-box">${te.gearLarge}</div>
              </div>
              <h3>Workflows kick in</h3>
              <p>Multi-stage approvals, inspections, and assignments — automated, transparent, and tracked.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">04</div>
                <div class="ck-how-icon-box">${te.checkLarge}</div>
              </div>
              <h3>Resolution & impact</h3>
              <p>Issues get resolved. You get notified. The city gets better. Data makes everyone smarter.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ CIVIC BUZZ ═══════════ -->
      <section class="ck-home-section ck-section-buzz" id="buzz">
        <div class="ck-section-inner">
          <div class="ck-section-label">${te.flame} CIVIC BUZZ</div>
          <h2 class="ck-section-heading">Civic issues,<br>but make it <span class="ck-text-accent">relatable.</span></h2>
          <p class="ck-section-sub">Citizens can share respectful, AI-assisted civic awareness content after moderator review.</p>

          <div class="ck-buzz-grid">
            <p class="ck-section-sub">No Buzz yet. Be the first to highlight an issue.</p>
          </div>

          <div class="ck-buzz-cta" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
            <p>These aren't just memes. These are real issues waiting to be fixed.</p>
            <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
              <a href="/meme/studio" class="ck-btn-hero" style="background:linear-gradient(135deg, #f59e0b, #ef4444); border:none; color:#fff;">
                Open Civic Buzz Studio
              </a>
              <a href="/signup" class="ck-btn-hero">Report Yours. We'll Actually Fix It. →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ ABOUT ═══════════ -->
      <section class="ck-home-section ck-section-about" id="about">
        <div class="ck-section-inner">
          <div class="ck-about-layout">
            <div class="ck-about-text">
              <div class="ck-section-label ck-label-left">ABOUT CIVIC-KALKI</div>
              <h2 class="ck-section-heading" style="text-align:left;">Built by citizens.<br>For citizens.</h2>
              <p class="ck-about-body">
                CIVIC-KALKI isn't just another government portal that nobody uses. It's a <strong>metadata-driven civic operating system</strong> that transforms how cities work — from the ground up.
              </p>
              <p class="ck-about-body">
                We believe civic governance shouldn't require a PhD in bureaucracy. Our AI-powered platform lets any citizen report, track, and contribute to their city's improvement — while giving municipal teams the tools to actually respond efficiently.
              </p>
              <div class="ck-about-values">
                <div class="ck-value-chip">${te.target} Transparent</div>
                <div class="ck-value-chip">${te.zap} AI-First</div>
                <div class="ck-value-chip">${te.layers} No-Code</div>
                <div class="ck-value-chip">${te.heartHand} Citizen-Centric</div>
                <div class="ck-value-chip">${te.chart} Data-Driven</div>
                <div class="ck-value-chip">${te.lock} Accountable</div>
              </div>
            </div>
            <div class="ck-about-visual">
              <div class="ck-about-card-stack">
                <div class="ck-acard ck-acard-1">
                  <div class="ck-acard-icon-box">${te.database}</div>
                  <div>
                    <div class="ck-acard-text">20+ Database Tables</div>
                    <div class="ck-acard-sub">Powering civic intelligence</div>
                  </div>
                </div>
                <div class="ck-acard ck-acard-2">
                  <div class="ck-acard-icon-box">${te.sparkles}</div>
                  <div>
                    <div class="ck-acard-text">Gemini AI Agent</div>
                    <div class="ck-acard-sub">Understands civic context</div>
                  </div>
                </div>
                <div class="ck-acard ck-acard-3">
                  <div class="ck-acard-icon-box">${te.toolBox}</div>
                  <div>
                    <div class="ck-acard-text">No-Code Module Builder</div>
                    <div class="ck-acard-sub">Deploy new civic modules in minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ FAQ ═══════════ -->
      <section class="ck-home-section ck-section-faq" id="faq">
        <div class="ck-section-inner" style="max-width:760px;">
          <div class="ck-section-label">FAQ</div>
          <h2 class="ck-section-heading">Got questions?<br><span class="ck-text-accent">We've got answers.</span></h2>

          <div class="ck-faq-list" id="ck-faq-list">
            <div class="ck-faq-item">
              <button class="ck-faq-q">What can CIVIC-KALKI help with?<span class="ck-faq-toggle">+</span></button>
              <div class="ck-faq-a">
                <p>CIVIC-KALKI helps citizens report civic issues (potholes, broken streetlights, sanitation), start community initiatives, volunteer for causes, and track the entire resolution process transparently. For municipal teams, it provides workflow automation, governance intelligence, and no-code module deployment.</p>
              </div>
            </div>
            <div class="ck-faq-item">
              <button class="ck-faq-q">Is it free to use?<span class="ck-faq-toggle">+</span></button>
              <div class="ck-faq-a">
                <p>Yes! CIVIC-KALKI is free for citizens. Sign up, report issues, track progress, and participate in civic initiatives at no cost.</p>
              </div>
            </div>
            <div class="ck-faq-item">
              <button class="ck-faq-q">How does the AI agent work?<span class="ck-faq-toggle">+</span></button>
              <div class="ck-faq-a">
                <p>Our AI agent (powered by Google Gemini) understands natural language descriptions of civic issues. Just type or speak what's wrong — the AI classifies the issue, sets priority, selects the right form, and routes it to the appropriate department. No bureaucratic knowledge required.</p>
              </div>
            </div>
            <div class="ck-faq-item">
              <button class="ck-faq-q">What is the "No-Code Module Builder"?<span class="ck-faq-toggle">+</span></button>
              <div class="ck-faq-a">
                <p>It's a tool for administrators to create entirely new civic modules (like a Donation Tracker or Public Survey system) without writing any code. Define fields, workflows, and approval chains through a visual interface, and deploy instantly.</p>
              </div>
            </div>
            <div class="ck-faq-item">
              <button class="ck-faq-q">Is my data secure?<span class="ck-faq-toggle">+</span></button>
              <div class="ck-faq-a">
                <p>Absolutely. We use industry-standard JWT authentication, bcrypt password hashing, role-based access control, and a Supabase PostgreSQL database with full audit logging. Every action is tracked, every access is controlled.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ FINAL CTA ═══════════ -->
      <section class="ck-home-section ck-section-cta">
        <div class="ck-cta-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(255,90,54,0.06)" d="M0,64L48,80C96,96,192,128,288,138.7C384,149,480,139,576,117.3C672,96,768,64,864,74.7C960,85,1056,139,1152,154.7C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div class="ck-cta-inner">
          <h2 class="ck-cta-title">Your city is waiting.</h2>
          <p class="ck-cta-sub">Join the civic movement. Report. Contribute. Transform.</p>
          <a href="/signup" class="ck-btn-cta-big">Get Started — It's Free →</a>
        </div>
      </section>

      <!-- ═══════════ FOOTER ═══════════ -->
      <footer class="ck-home-footer">
        <div class="ck-footer-inner">
          <div class="ck-footer-brand">
            <img src="/logo.png" alt="CivicKalki" style="height:32px;" />
            <p>The AI-powered Civic Operating System for transparent, accountable, and intelligent municipal governance.</p>
          </div>

          <div class="ck-footer-col">
            <h4>Platform</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="/login">Sign In</a>
            <a href="/signup">Get Started</a>
          </div>

          <div class="ck-footer-col">
            <h4>Civic Modules</h4>
            <a href="/signup">Report a Problem</a>
            <a href="/signup">Start Initiative</a>
            <a href="/signup">Volunteer</a>
            <a href="/signup">Governance Intelligence</a>
          </div>

          <div class="ck-footer-col">
            <h4>Connect</h4>
            <a href="#about">About Us</a>
            <a href="#faq">FAQ</a>
            <a href="mailto:team@civickalki.in">team@civickalki.in</a>
            <a href="#">GitHub</a>
          </div>
        </div>

        <div class="ck-footer-bottom">
          <span>© ${new Date().getFullYear()} CIVIC-KALKI. Built for transparent civic governance.</span>
          <span style="display:inline-flex; align-items:center; gap:6px;">Made with ${te.heartFill} in India</span>
        </div>
      </footer>
    </div>
  `,Qi("home"),il())}function il(){const a=document.getElementById("ck-home-header");a&&window.addEventListener("scroll",()=>{a.classList.toggle("scrolled",window.scrollY>40)},{passive:!0});const o=document.getElementById("ck-home-burger"),s=document.getElementById("ck-home-nav");o&&s&&o.addEventListener("click",()=>{s.classList.toggle("open"),o.classList.toggle("open")});const r=document.getElementById("ck-feature-tabs");r&&r.addEventListener("click",v=>{const y=v.target.closest(".ck-tab-btn");if(!y)return;const g=y.dataset.tab;r.querySelectorAll(".ck-tab-btn").forEach(_=>_.classList.remove("active")),r.querySelectorAll(".ck-tab-panel").forEach(_=>_.classList.remove("active")),y.classList.add("active");const w=document.getElementById(g);w&&w.classList.add("active")});const d=document.getElementById("ck-faq-list");d&&d.addEventListener("click",v=>{const y=v.target.closest(".ck-faq-q");if(!y)return;const g=y.closest(".ck-faq-item"),w=g.classList.contains("open");d.querySelectorAll(".ck-faq-item").forEach(_=>_.classList.remove("open")),w||g.classList.add("open")});const u=document.getElementById("ck-pupil-l"),p=document.getElementById("ck-pupil-r");u&&p&&document.addEventListener("mousemove",v=>{const y=g=>{const _=g.parentElement.getBoundingClientRect(),z=_.left+_.width/2,C=_.top+_.height/2,M=v.clientX-z,R=v.clientY-C,B=Math.atan2(R,M),ne=_.width*.22,we=Math.min(Math.sqrt(M*M+R*R)*.15,ne);g.style.transform=`translate(${Math.cos(B)*we}px, ${Math.sin(B)*we}px)`};y(u),y(p)},{passive:!0}),document.querySelectorAll('.ck-home a[href^="#"]').forEach(v=>{v.addEventListener("click",y=>{y.preventDefault();const g=document.querySelector(v.getAttribute("href"));if(g){g.scrollIntoView({behavior:"smooth",block:"start"});const w=document.getElementById("ck-home-nav"),_=document.getElementById("ck-home-burger");w&&w.classList.remove("open"),_&&_.classList.remove("open")}})});const h=v=>{v.forEach(y=>{y.isIntersecting&&y.target.classList.add("ck-visible")})},m=new IntersectionObserver(h,{threshold:.1,rootMargin:"0px 0px -60px 0px"});document.querySelectorAll(".ck-how-card, .ck-buzz-meme, .ck-about-text, .ck-about-visual, .ck-faq-item").forEach(v=>{m.observe(v)})}const is="/api";async function P(a,o,s=null,r={}){const u={method:a,headers:{"Content-Type":"application/json","X-Requested-With":"ck-web"},credentials:"include",...r};s!==null&&(u.body=JSON.stringify(s));const p=await fetch(`${is}${o}`,u);p.status===401&&(la(),window.dispatchEvent(new CustomEvent("auth:expired")));const h=await p.json().catch(()=>({success:!1,error:"Invalid server response"}));if(!p.ok){const m=new Error(h.error||`HTTP ${p.status}`);throw m.status=p.status,m.data=h,m}return h}const en={login:(a,o)=>P("POST","/auth/login",{email:a,password:o}),signup:(a,o,s)=>P("POST","/auth/signup",{name:a,email:o,password:s}),changePassword:(a,o)=>P("POST","/auth/change-password",{current_password:a,new_password:o}),me:()=>P("GET","/auth/me"),logout:()=>P("POST","/auth/logout")},ns={listUsers:(a={})=>{const o=new URLSearchParams(a).toString();return P("GET",`/admin/users${o?"?"+o:""}`)},getUser:a=>P("GET",`/admin/users/${a}`),setRole:(a,o,s)=>P("POST",`/admin/users/${a}/role`,{role:o,assignedArea:s})},le={list:(a={})=>{const o=new URLSearchParams(a).toString();return P("GET",`/entities${o?"?"+o:""}`)},listTypes:()=>P("GET","/entities/entity-types"),createType:a=>P("POST","/entities/entity-types",a),createRule:a=>P("POST","/entities/rules",a),get:a=>P("GET",`/entities/${a}`),create:a=>P("POST","/entities",a),update:(a,o)=>P("PUT",`/entities/${a}`,o),softDelete:a=>P("DELETE",`/entities/${a}`),transition:(a,o,s)=>P("POST",`/entities/${a}/transition`,{to_status:o,reason:s}),fireRules:(a,o)=>P("POST",`/entities/${a}/fire-rules`,{eventType:o}),aiAnalysis:a=>P("POST",`/entities/${a}/ai-analysis`),audit:a=>P("GET",`/entities/${a}/audit`),getLineage:a=>P("GET",`/entities/${a}/lineage`),workflow:a=>P("GET",`/entities/${a}/workflow`),nearby:(a,o,s=10)=>P("GET",`/entities/nearby?lat=${encodeURIComponent(a)}&lng=${encodeURIComponent(o)}&radius_km=${encodeURIComponent(s)}`)},as={list:a=>P("GET",`/entities/${a}/values`),create:(a,o)=>P("POST",`/entities/${a}/values`,{values:o}),upsert:(a,o)=>P("PUT",`/entities/${a}/values`,{values:o})},ca={getMetadata:()=>P("GET","/forms/metadata"),schema:a=>P("GET",`/forms/${a}/schema`),create:a=>P("POST","/forms",a),addSection:(a,o)=>P("POST",`/forms/${a}/sections`,o),addSubsection:(a,o)=>P("POST",`/sections/${a}/subsections`,o),addParameter:(a,o)=>P("POST",`/subsections/${a}/parameters`,o)},tn={list:(a={})=>{const o=new URLSearchParams(a).toString();return P("GET",`/reports${o?"?"+o:""}`)},get:a=>P("GET",`/reports/${a}`),create:a=>P("POST","/reports",a),execute:(a,o={})=>{const s=new URLSearchParams(o).toString();return P("GET",`/reports/${a}/execute${s?"?"+s:""}`)}},nl={validate:a=>P("POST","/module-builder/validate",a),deploy:a=>P("POST","/module-builder/deploy",a)},Ui={list:(a={})=>{const o=new URLSearchParams(a).toString();return P("GET",`/jurisdictions${o?"?"+o:""}`)},tree:()=>P("GET","/jurisdictions?tree=true"),get:a=>P("GET",`/jurisdictions/${a}`),create:a=>P("POST","/jurisdictions",a),update:(a,o)=>P("PUT",`/jurisdictions/${a}`,o),deactivate:a=>P("DELETE",`/jurisdictions/${a}`)},al={getConfig:()=>P("GET","/governance/config"),analyze:a=>P("POST","/governance/analyze",a?{entity_type_id:a}:{})},qi={chat:async(a,o,s=null)=>{if(!s)return P("POST","/agent/chat",{sessionId:a,message:o});const r=new FormData;r.append("sessionId",a),r.append("message",o||""),r.append("attachment",s);const d={"X-Requested-With":"ck-web"},u=await fetch(`${is}/agent/chat`,{method:"POST",headers:d,credentials:"include",body:r});u.status===401&&(la(),window.dispatchEvent(new CustomEvent("auth:expired")));const p=await u.json().catch(()=>({success:!1,error:"Invalid server response"}));if(!u.ok){const h=new Error(p.error||`HTTP ${u.status}`);throw h.status=u.status,h.data=p,h}return p},clearSession:a=>P("DELETE",`/agent/chat/${a}`).catch(()=>{})};let ol=0;function bi(a,o="default",s=3500){const r=document.getElementById("toast-container"),d=++ol,u=document.createElement("div");return u.className=`toast toast-${o}`,u.id=`toast-${d}`,u.innerHTML=`
    <span>${rl(a)}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:8px;font-size:1rem;line-height:1;opacity:.7">×</button>
  `,r.appendChild(u),setTimeout(()=>{u.remove()},s),d}function ua(a){return bi(a,"default")}function Ae(a){return bi(a,"success")}function V(a){return bi(a,"error")}function sl(a){return bi(a,"warning")}function rl(a){return String(a).replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}const ll=Object.freeze(Object.defineProperty({__proto__:null,showToast:bi,toast:ua,toastError:V,toastSuccess:Ae,toastWarning:sl},Symbol.toStringTag,{value:"Module"}));function Po(a,o="/dashboard"){const s=a&&a.get("redirect");return typeof s=="string"&&s.startsWith("/")&&!s.startsWith("//")&&!s.startsWith("/\\")&&!s.includes("://")&&!s.toLowerCase().includes("javascript:")&&!/[\x00-\x1F\x7F]/.test(s)?s:o}function dl(a,o){if(Yi()){ie(Po(o));return}const s=document.getElementById("app");s.innerHTML=`
    <div class="auth-layout">
      <div class="auth-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
          <a href="/" style="font-size:0.8125rem; color:var(--text-muted); display:inline-flex; align-items:center; gap:4px; text-decoration:none;">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Home
          </a>
          ${Xi({idPrefix:"login"})}
        </div>

        <div class="auth-card-brand">
          <img src="/logo.png" alt="CivicKalki" style="height:44px; width:auto; object-fit:contain;" />
        </div>

        <h2>Sign in to Civic OS</h2>
        <p class="subtitle">Enter your credentials to access your operational dashboard</p>
        
        <div id="login-error-alert" class="alert alert-danger hidden mt-3 mb-3" role="alert" aria-live="assertive"></div>

        <form id="login-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              class="form-control" 
              placeholder="name@city.gov" 
              required 
              autofocus
              aria-required="true"
              autocomplete="email"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div style="position:relative;">
              <input 
                type="password" 
                id="password" 
                class="form-control" 
                placeholder="Enter password" 
                required
                aria-required="true"
                autocomplete="current-password"
                style="padding-right:40px;"
              >
              <button 
                type="button" 
                id="toggle-password-btn"
                aria-label="Show password"
                style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-muted); padding:4px; display:flex; align-items:center;"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary btn-full mt-4" id="login-btn">
            Sign In
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-secondary">
          Don't have an account? <a href="/signup" class="text-link">Sign up</a>
        </div>

        <div class="mt-4 text-center">
          <a href="/" style="font-size:0.8rem; color:var(--text-muted); text-decoration:none;">← Back to Public Home</a>
        </div>
      </div>
    </div>
  `;const r=document.getElementById("password"),d=document.getElementById("toggle-password-btn"),u='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',p='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>';d&&r&&d.addEventListener("click",()=>{const m=r.getAttribute("type")==="password"?"text":"password";r.setAttribute("type",m),d.setAttribute("aria-label",m==="password"?"Show password":"Hide password"),d.innerHTML=m==="password"?u:p});const h=document.getElementById("login-error-alert");document.getElementById("login-form").addEventListener("submit",async m=>{m.preventDefault(),h&&(h.classList.add("hidden"),h.textContent="");const v=document.getElementById("login-btn"),y=document.getElementById("email").value.trim(),g=r.value;if(!y||!g){h&&(h.textContent="Please enter both email address and password.",h.classList.remove("hidden"));return}v.disabled=!0,v.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Signing in...';try{const w=await en.login(y,g);Yo(w.data),ie(Po(o))}catch(w){const _=w.message||"Invalid email or password. Please check your credentials.";h&&(h.textContent=_,h.classList.remove("hidden")),V(_),v.disabled=!1,v.innerHTML="Sign In"}}),Qi("login")}function Ao(a,o="/dashboard"){const s=a&&a.get("redirect");return typeof s=="string"&&s.startsWith("/")&&!s.startsWith("//")&&!s.startsWith("/\\")&&!s.includes("://")&&!s.toLowerCase().includes("javascript:")&&!/[\x00-\x1F\x7F]/.test(s)?s:o}function cl(a,o){if(Yi()){ie(Ao(o));return}const s=document.getElementById("app");s.innerHTML=`
    <div class="auth-layout">
      <div class="auth-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
          <a href="/" style="font-size:0.8125rem; color:var(--text-muted); display:inline-flex; align-items:center; gap:4px; text-decoration:none;">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Home
          </a>
          ${Xi({idPrefix:"signup"})}
        </div>

        <div class="auth-card-brand">
          <img src="/logo.png" alt="CivicKalki" style="height:44px; width:auto; object-fit:contain;" />
        </div>

        <h2>Create an account</h2>
        <p class="subtitle">Join as a citizen to get started</p>
        
        <form id="signup-form">
          <div class="form-group">
            <label class="form-label" for="name">Full Name</label>
            <input type="text" id="name" class="form-control" placeholder="Enter your full name" required autofocus>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="email">Email address</label>
            <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input type="password" id="password" class="form-control" placeholder="Create a password (min 8 chars)" minlength="8" required>
          </div>
          
          <button type="submit" class="btn btn-primary btn-full mt-4" id="signup-btn">
            Create Account
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-secondary">
          Already have an account? <a href="/login" class="text-link">Sign in</a>
        </div>

        <div class="mt-4 text-center">
          <a href="/" style="font-size:0.8rem; color:var(--text-muted); text-decoration:none;">← Back to Public Home</a>
        </div>
      </div>
    </div>
  `,document.getElementById("signup-form").addEventListener("submit",async r=>{r.preventDefault();const d=document.getElementById("signup-btn"),u=document.getElementById("name").value.trim(),p=document.getElementById("email").value.trim(),h=document.getElementById("password").value;if(!(!u||!p||!h)){d.disabled=!0,d.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Creating account...';try{const m=await en.signup(u,p,h);Yo(m.data),ie(Ao(o))}catch(m){V(m.message||"Signup failed"),d.disabled=!1,d.innerHTML="Create Account"}}}),Qi("signup")}const ea={initiative:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",grievance:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",park:"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",passport:"M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2",charter:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",employment:"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",volunteer:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",legacy:"M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",feedback:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",survey:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",default:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},os={"🌱":"initiative","🚨":"grievance","⚠️":"grievance","🪪":"passport","📜":"charter","💼":"employment","🤝":"volunteer","🏛️":"legacy","🏛":"legacy","💬":"feedback","📢":"feedback","📊":"survey","📋":"survey","🌳":"park","🏞️":"park","🏞":"park","🏗️":"legacy","🏗":"legacy","🛡️":"charter","🛡":"charter","⚡":"default","⚡️":"default"};function vt(a,o=20,s=""){const r=os[a]||a,d=ea[r]||ea.default;return`<svg width="${o}" height="${o}" class="${s}" style="flex-shrink:0; display:inline-block; vertical-align:middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${d}"/></svg>`}const ul={Movement:{title:"Start a Civic Initiative",shortTitle:"Civic Initiative",description:"Organize citizens around community goals, public spaces, and urban projects.",category:"Community Action",iconKey:"initiative",actionLabel:"Start Initiative"},Grievance:{title:"Report a Civic Problem",shortTitle:"Civic Problem",description:"Report infrastructure defects, sanitation issues, or public safety concerns.",category:"Public Services",iconKey:"grievance",actionLabel:"Report Issue"},"Park Renovation Request":{title:"Park Renovation Request",shortTitle:"Park Renovation",description:"Propose public park upgrades, playground repairs, or green space restoration.",category:"Urban Infrastructure",iconKey:"park",actionLabel:"Request Renovation"},"Citizen Passport":{title:"Citizen Passport & Contribution",shortTitle:"Citizen Passport",description:"Track community contributions, volunteer hours, and civic engagement history.",category:"Civic Identity",iconKey:"passport",actionLabel:"Update Passport"},"Digital Civic Constitution":{title:"Civic Charter & Guidelines",shortTitle:"Civic Charter",description:"Establish community guidelines, governance rules, and transparency terms.",category:"Governance",iconKey:"charter",actionLabel:"Draft Charter"},"Employment Exchange":{title:"Civic Skills & Employment",shortTitle:"Employment Exchange",description:"Post and discover civic project roles, community jobs, and skill opportunities.",category:"Opportunity",iconKey:"employment",actionLabel:"Post Role"},"Volunteer Management":{title:"Volunteer Operations",shortTitle:"Volunteer Drive",description:"Coordinate volunteer tasks, register community helpers, and track activities.",category:"Community Action",iconKey:"volunteer",actionLabel:"Register Volunteer"},"Legacy & Continuity":{title:"Project Continuity & Legacy",shortTitle:"Project Continuity",description:"Transition completed initiatives into permanent NGOs, startups, or civic centers.",category:"Governance",iconKey:"legacy",actionLabel:"Plan Continuity"},"Public Feedback":{title:"Public Feedback",shortTitle:"Public Feedback",description:"Collect structured community feedback on civic initiatives and public services.",category:"Civic Operations",iconKey:"feedback",actionLabel:"Submit Feedback"},"Public Survey":{title:"Public Survey",shortTitle:"Public Survey",description:"Run community surveys and opinion polls for civic decision-making.",category:"Civic Operations",iconKey:"survey",actionLabel:"Start Survey"}};function at(a){var d;if(!a)return{title:"Civic Capability",shortTitle:"Capability",description:"Metadata-driven civic module.",category:"Civic Operations",iconKey:"default",icon:vt("default",16),iconLarge:vt("default",24),actionLabel:"Start Action"};const o=a.name||"",s=ul[o];if(s)return{title:s.title,shortTitle:s.shortTitle,description:a.description||s.description,category:s.category,iconKey:s.iconKey,icon:vt(s.iconKey,16),iconLarge:vt(s.iconKey,24),actionLabel:s.actionLabel,rawName:o};const r=a.icon&&os[a.icon]||(a.icon&&ea[a.icon]?a.icon:null)||"default";return{title:o,shortTitle:o,description:a.description||"Metadata-configured civic capability module.",category:((d=a.domain)==null?void 0:d.domain_name)||"Civic Operations",iconKey:r,icon:vt(r,16),iconLarge:vt(r,24),actionLabel:`Start ${o}`,rawName:o}}function Ct(a){if(!a)return"Unknown";switch(a.toLowerCase()){case"draft":return"Draft (Unsubmitted)";case"submitted":return"Submitted (Awaiting Review)";case"coordinator_approved":return"Verified (Pending Approval)";case"verified":return"Verified";case"approved":return"Approved & Active";case"rejected":return"Rejected";case"closed":return"Closed";default:return a.replace(/_/g," ").replace(/\b\w/g,o=>o.toUpperCase())}}function _e(a,o="",s=[]){const r=Mt(),d=Ji();if(!r)return a;const u=window.location.pathname,p=window.location.search;let h=[],m="CIVIC CAPABILITIES";d==="citizen"?h=[{path:"/dashboard",label:"Home",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/nearby",label:"Nearby Activities & Map",icon:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"},{path:"/agent/chat?message=I+want+to+report+a+problem",label:"Report a Problem",icon:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"},{path:"/agent/chat?message=I+want+to+start+an+initiative",label:"Start an Initiative",icon:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"},{path:"/agent/chat?message=I+want+to+contribute+or+volunteer",label:"Contribute / Volunteer",icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"},{path:"/agent/chat?message=I+want+to+understand+a+civic+issue",label:"Understand an Issue",icon:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"},{path:"/entities",label:"My Civic Activity",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"}]:d==="coordinator_area"||d==="coordinator_general"?(h=[{path:"/dashboard",label:"Operations Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/entities",label:"Cases Queue",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],m="ACTIVE CAPABILITIES"):d==="director"?(h=[{path:"/dashboard",label:"Governance Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/governance",label:"Governance Intelligence",icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"},{path:"/entities",label:"All Operations",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/module-builder",label:"Capability Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],m="ACTIVE CAPABILITIES"):(h=[{path:"/dashboard",label:"Civic OS Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/governance",label:"Governance Intelligence",icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"},{path:"/modules",label:"Modules & Capabilities",icon:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},{path:"/module-builder",label:"No-Code Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/entities",label:"All Cases & Records",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"},{path:"/admin",label:"User & Role Admin",icon:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"}],m="CAPABILITY METADATA");const v=w=>w.map(_=>`
    <li class="sidebar-nav-item">
      <a href="${_.path}" class="sidebar-nav-link ${u===_.path&&!p?"active":""}">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${_.icon}"></path></svg>
        ${Ge(_.label)}
      </a>
    </li>
  `).join("");let y="";d!=="citizen"&&Array.isArray(s)&&s.length>0&&(y=s.map(w=>{var M;const _=at(w),z=`/entities?entity_type_id=${w.entity_type_id}`,C=p.includes(`entity_type_id=${w.entity_type_id}`);return`
        <li class="sidebar-nav-item">
          <a href="${z}" class="sidebar-nav-link ${C?"active":""}" style="font-size:13px; padding:6px 12px; display:flex; align-items:center;">
            <span class="sidebar-cap-icon" style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; margin-right:8px; flex-shrink:0; opacity:0.85;">
              ${vt(_.iconKey,16)}
            </span>
            <span class="truncate" style="flex:1;">${Ge(_.shortTitle)}</span>
            ${((M=w._count)==null?void 0:M.entities)!==void 0?`<span style="font-size:10px; background:rgba(255,255,255,0.18); padding:1px 6px; border-radius:10px;">${w._count.entities}</span>`:""}
          </a>
        </li>
      `}).join(""));const g=d==="coordinator_area"&&r.assignedArea?`${hi(d)} • ${r.assignedArea}`:hi(d);return`
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <a href="/dashboard" class="sidebar-brand">
          <img src="/logo.png" alt="CivicKalki" class="sidebar-brand-img" />
        </a>
        
        <div class="sidebar-section">
          <div class="sidebar-group-title">NAVIGATION</div>
          <ul class="sidebar-nav">
            ${v(h)}
          </ul>
        </div>

        ${y?`
          <div class="sidebar-section mt-4">
            <div class="sidebar-group-title">${m}</div>
            <ul class="sidebar-nav">
              ${y}
            </ul>
          </div>
        `:""}
        
        <div class="sidebar-footer">
          <div class="sidebar-user" id="sidebar-user-card" style="cursor:pointer;">
            <div class="user-avatar">${Ge(r.name.charAt(0).toUpperCase())}</div>
            <div style="flex:1; overflow:hidden;">
              <div class="user-name truncate">${Ge(r.name)}</div>
              <div class="user-role truncate" title="${Ge(g)}">${Ge(g)}</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="topbar">
          <div style="display:flex; align-items:center; gap:var(--space-3);">
            <button id="mobile-menu-btn" class="btn btn-ghost" style="padding:6px; display:none;" aria-label="Toggle sidebar menu">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div style="display:flex; align-items:center; gap:var(--space-2); font-size:0.875rem;">
              <a href="/dashboard" style="color:var(--text-muted); text-decoration:none;">Civic OS</a>
              <span style="color:var(--gray-300);">/</span>
              <span style="font-weight:600; color:var(--text-primary);">${Ge(o)}</span>
            </div>
          </div>

          <div class="topbar-actions">
            <!-- Language Selector -->
            ${Xi({idPrefix:"topbar"})}

            <!-- User Dropdown Menu -->
            <div class="user-dropdown-container">
              <button class="user-trigger-btn" id="topbar-user-btn" type="button" aria-haspopup="true" aria-expanded="false">
                <div class="user-avatar" style="width:32px; height:32px; font-size:13px; font-weight:700;">${Ge(r.name.charAt(0).toUpperCase())}</div>
                <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
                  <span style="font-size:0.8125rem; font-weight:600; color:var(--text-primary);">${Ge(r.name.split(" ")[0])}</span>
                  <span style="font-size:0.6875rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.03em;">${Ge(hi(d))}</span>
                </div>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--text-muted); flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <div class="user-dropdown-menu" id="user-dropdown-menu">
                <div class="user-dropdown-header">
                  <div class="user-dropdown-name">${Ge(r.name)}</div>
                  <div class="user-dropdown-role">${Ge(hi(d))}</div>
                </div>
                <a href="/profile" class="user-dropdown-item">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Profile & Security
                </a>
                <a href="/reports" class="user-dropdown-item">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Reports
                </a>
                <button type="button" class="user-dropdown-item danger" id="dropdown-logout-btn">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div class="page-content" id="page-content">
          ${a}
        </div>
      </main>
    </div>
  `}function xe(){Wr().catch(()=>{}),Qi("topbar");const a=document.getElementById("topbar-user-btn"),o=document.getElementById("user-dropdown-menu");a&&o&&(a.addEventListener("click",p=>{p.stopPropagation(),o.classList.toggle("show")}),document.addEventListener("click",p=>{!o.contains(p.target)&&!a.contains(p.target)&&o.classList.remove("show")}));const s=document.getElementById("dropdown-logout-btn");s&&s.addEventListener("click",async p=>{p.preventDefault();try{await en.logout()}catch(h){console.warn("Logout warning:",h)}la(),ie("/login")});const r=document.getElementById("sidebar-user-card");r&&r.addEventListener("click",()=>{ie("/profile")});const d=document.getElementById("mobile-menu-btn"),u=document.getElementById("sidebar");d&&u&&d.addEventListener("click",()=>{u.classList.toggle("open")})}function Ge(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function se(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}const oe={mic:'<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>',arrowRight:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',chevronRight:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',alertTriangle:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',lightbulb:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',users:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',bookOpen:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',clipboard:'<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',heart:'<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',checkCircle:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',road:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19L8 5"/><path d="M20 19L16 5"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="14"/><line x1="12" y1="18" x2="12" y2="20"/></svg>',trash:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',zap:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',leaf:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8.5-2 2-5.5 3.5-9 3.5"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>',mapPin:'<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',usersSm:'<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',flame:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'};async function nn(){if(!ot(ie))return;const a=Mt(),o=document.getElementById("app");o.innerHTML=_e(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>Loading Workspace...</h1>
      </div>
    </div>
    <div id="dash-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Workspace"),xe();try{const r=(await ca.getMetadata().catch(()=>({success:!1,data:{entityTypes:[],rules:[],domains:[]}}))).data||{entityTypes:[],rules:[],domains:[]};let d="Home",u=`Good day, <strong>${se(a.name)}</strong>. Here is what is happening in your civic workspace.`;a.role==="coordinator_area"||a.role==="coordinator_general"?(d="Civic Operations Workspace",u=`Operations view for <strong>${se(a.name)}</strong>`):a.role==="director"?(d="Executive Governance Workspace",u=`Executive view for <strong>${se(a.name)}</strong>`):a.role==="admin"&&(d="Civic OS Administration",u=`Platform admin for <strong>${se(a.name)}</strong>`);const p=a.role==="citizen";o.innerHTML=_e(`
      ${p?'<div id="dash-actions" style="display:none;"></div>':`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">${se(d)}</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">${u}</p>
        </div>
        <div class="page-header-actions" id="dash-actions"></div>
      </div>
      `}
      
      <div id="dash-content">
        <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
      </div>
    `,d,r.entityTypes),xe();const h=document.getElementById("dash-content"),m=document.getElementById("dash-actions");if(a.role==="citizen"){m.innerHTML="";const v=document.getElementById("page-content");v&&v.classList.add("ck-citizen-page-content"),await pl(h,a,r)}else a.role==="coordinator_area"?(m.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>',await vl(h,a,r)):a.role==="coordinator_general"?(m.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>',await gl(h,a,r)):a.role==="director"?(m.innerHTML='<a href="/entities?status=coordinator_approved" class="btn btn-primary">Executive Approvals Queue</a>',await yl(h,a,r)):a.role==="admin"&&(m.innerHTML=`
        <a href="/module-builder" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
          No-Code Builder
        </a>
        <a href="/admin" class="btn btn-primary">User Admin</a>
      `,await bl(h,a,r));typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}catch{V("Failed to load workspace data"),document.getElementById("dash-content").innerHTML='<div class="alert alert-error">Failed to load workspace data. Please try again.</div>',typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}}async function pl(a,o,s){const d=(await le.list({owner_user_id:o.user_id,limit:50}).catch(()=>({data:[]}))).data||[],u=d.filter(M=>M.status==="draft").length,p=d.filter(M=>["submitted","coordinator_approved","in_review"].includes(M.status)).length,h=d.filter(M=>["approved","closed","rejected"].includes(M.status)).length,m=d.filter(M=>M.isFollowing).length||5;let y=(await le.list({limit:6}).catch(()=>({data:[]}))).data||[],g=y.length>=3?y:ml(y);const w=M=>{const R={submitted:{label:"Submitted",bg:"#fef3c7",color:"#92400e"},coordinator_approved:{label:"In Progress",bg:"#dbeafe",color:"#1e40af"},approved:{label:"Open",bg:"#dcfce7",color:"#166534"},draft:{label:"Draft",bg:"#f1f5f9",color:"#475569"},rejected:{label:"Closed",bg:"#fee2e2",color:"#991b1b"},default:{label:"Active",bg:"#ffedd5",color:"#9a3412"}},B=R[M]||R.default;return`<span class="ck-rx-status-pill" style="background:${B.bg}; color:${B.color};">${B.label}</span>`},_=(M="")=>{const R=M.toLowerCase();return R.includes("tree")||R.includes("park")||R.includes("green")||R.includes("garden")?oe.leaf:R.includes("light")||R.includes("wire")||R.includes("power")||R.includes("pole")?oe.zap:R.includes("garbage")||R.includes("waste")||R.includes("sanitation")||R.includes("clean")?oe.trash:oe.road},z=g.map((M,R)=>`
      <div class="ck-rx-issue-card">
        <div class="ck-rx-issue-top">
          <div class="ck-rx-issue-icon">
            ${_(M.name)}
          </div>
          ${w(M.status)}
        </div>
        <div class="ck-rx-issue-name" title="${se(M.name)}">${se(M.name)}</div>
        <div class="ck-rx-issue-area">
          ${oe.mapPin}
          <span>${se(M.area||"Ward 14 · Pune")}</span>
        </div>
        <div class="ck-rx-issue-footer">
          <span class="ck-rx-issue-meta">
            ${oe.usersSm}
            ${R*14+18} citizens backing
          </span>
          <a href="/entities/${M.entity_id||""}" class="ck-rx-issue-link">
            View ${oe.chevronRight}
          </a>
        </div>
      </div>
    `).join("");d.length>0&&d.slice(0,5).map(M=>`
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:8px;">
      <div>
        <div style="font-weight:600; font-size:0.86rem; color:#0f172a;">${se(M.name)}</div>
        <div style="font-size:0.75rem; color:#64748b;">Area: ${se(M.area||"Ward 14")} · #${M.entity_id}</div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        ${w(M.status)}
        <a href="/entities/${M.entity_id}" class="btn btn-secondary btn-sm" style="padding:4px 8px; font-size:0.75rem;">Inspect</a>
      </div>
    </div>
  `).join("");const C=fl();a.innerHTML=`
    <!-- ░░ REVENUEX-STYLE DASHBOARD WITH UNIFIED AGENTIC AI HERO ░░ -->
    <div class="ck-rx-layout">
      <!-- ░░ MAIN CONTENT ░░ -->
      <main class="ck-rx-main">

        <!-- ══════════════════════════════════════════════════════════════
             1. HIGHLIGHTED AGENTIC AI HERO (DARKSHADE + MINIMAL PILL BAR)
             Unified Chat Bar + Live Conversation in ONE seamless dark card
             ══════════════════════════════════════════════════════════════ -->
        <section class="ck-agent-dark-card" id="ck-dark-cockpit" aria-label="Civic Assistant AI Chat">
          <div class="ck-dark-ambient"></div>
          
          <!-- Header with Avatar, Title, Live Status, Voice Wave Animation, and Reset -->
          <div class="ck-dark-header">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="ck-dark-avatar">
                <svg width="17" height="17" fill="none" stroke="white" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <div class="ck-dark-title">
                  <span>Civic Assistant</span>
                  <span class="ck-dark-live-badge">
                    <span class="ck-dark-live-dot"></span>
                    <span>AI Copilot</span>
                  </span>
                </div>
                <div class="ck-dark-sub">
                  Report issues · Start initiatives · Check request status
                </div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:10px;">
              <!-- Signature Voice Wave Animation -->
              <div class="ck-voice-wave" title="Voice audio frequency monitor">
                <span class="ck-vbar vbar-1"></span>
                <span class="ck-vbar vbar-2"></span>
                <span class="ck-vbar vbar-3"></span>
                <span class="ck-vbar vbar-4"></span>
              </div>

              <!-- Reset / New Request Button -->
              <button type="button" class="ck-dark-reset-btn" id="ck-dark-reset-btn" title="Start fresh conversation">
                + New Request
              </button>
            </div>
          </div>

          <!-- Motion Text Strip (High-End Dark Ticker) -->
          <div class="ck-dark-motion-strip">
            <span class="ck-dark-motion-tag">⚡ Live Civic Dispatch:</span>
            <div class="ck-dark-motion-box">
              <span>“</span><span id="ck-dark-motion-target">2-foot rim-destroying pothole near FC College main gate</span><span class="ck-dark-cursor"></span><span>”</span>
            </div>
          </div>

          <!-- Embedded Conversation Thread (Inside same dark card; visible when messages exist) -->
          <div id="ck-dark-thread" class="ck-dark-thread" style="display:none;" role="log" aria-live="polite"></div>

          <!-- High-End Minimal Pill Input Bar -->
          <div class="ck-dark-input-wrap">
            <!-- File attachment preview chip -->
            <div id="ck-dark-file-preview" class="ck-dark-file-preview"></div>

            <div class="ck-dark-input-bar">
              <input type="file" id="ck-dark-file-input" style="display:none;" accept="image/*,.pdf,.doc,.docx,.txt,.csv" />
              
              <button type="button" id="ck-dark-attach-btn" class="ck-dark-attach-btn" title="Attach photo proof or document evidence" aria-label="Attach photo">
                <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
              </button>

              <input
                id="ck-dark-input"
                class="ck-dark-input"
                type="text"
                autocomplete="off"
                placeholder="Type your request here — e.g. 'garbage not collected near FC road'..."
                aria-label="Civic assistant message input"
              />

              <button type="button" id="ck-dark-mic-btn" class="ck-dark-mic-btn" title="Voice dictation" aria-label="Voice dictation">
                ${oe.mic}
              </button>

              <button type="button" id="ck-dark-send-btn" class="ck-dark-send-btn" title="Send message to AI assistant" aria-label="Send message">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
                <span>Send</span>
              </button>
            </div>
          </div>

          <!-- Small Cards / Chips (Minimal pills matching original update) -->
          <div class="ck-dark-suggestions" id="ck-dark-suggestions">
            <span class="ck-dark-chip" data-text="garbage not collected near FC road for 4 days">
              🗑️ Garbage complaint
            </span>
            <span class="ck-dark-chip" data-text="streetlights are completely broken and dark on our lane">
              💡 Broken streetlights
            </span>
            <span class="ck-dark-chip" data-text="deep dangerous pothole damaged vehicles on the main road">
              💥 Road pothole
            </span>
            <span class="ck-dark-chip" data-text="clean water pipeline leaking heavily onto the street">
              🚰 Water pipe leak
            </span>
            <span class="ck-dark-chip" data-text="I want to start a community cleanliness and greening drive">
              🌿 Start an initiative
            </span>
            <span class="ck-dark-chip" data-text="what is happening with my requests">
              📋 Check my status
            </span>
          </div>

        </section><!-- /.ck-agent-dark-card -->

        <!-- 2. Performance / Civic Overview Heading -->
        <div class="ck-rx-overview-head" style="margin-top:8px;">
          <h2 class="ck-rx-overview-title" style="font-size:1.4rem;">Neighborhood Gateways</h2>
          <p class="ck-rx-overview-sub">Direct access points to track, propose initiatives, and inspect governance records</p>
        </div>

        <!-- 3. Core Gateways (Connect seamlessly to the unified AI cockpit) -->
        <div class="ck-rx-actions-grid">
          <div class="ck-rx-action-card ck-gateway-trigger" data-gateway-prompt="I want to report a problem: " style="cursor:pointer;">
            <div class="ck-rx-action-icon-box">
              ${oe.alertTriangle}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Report a Problem</div>
              <div class="ck-rx-action-desc">Potholes, waste dumping, dark roads, or water leaks.</div>
            </div>
            <span class="ck-rx-action-arrow">${oe.arrowRight}</span>
          </div>

          <div class="ck-rx-action-card ck-gateway-trigger" data-gateway-prompt="I want to start a community initiative: " style="cursor:pointer;">
            <div class="ck-rx-action-icon-box">
              ${oe.lightbulb}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Start an Initiative</div>
              <div class="ck-rx-action-desc">Rally your neighbors for cleanups, greening & safety.</div>
            </div>
            <span class="ck-rx-action-arrow">${oe.arrowRight}</span>
          </div>

          <div class="ck-rx-action-card ck-gateway-trigger" data-gateway-prompt="I want to contribute skills or volunteer for: " style="cursor:pointer;">
            <div class="ck-rx-action-icon-box">
              ${oe.users}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">I want to Contribute</div>
              <div class="ck-rx-action-desc">Share professional skills, sponsor tools, or volunteer.</div>
            </div>
            <span class="ck-rx-action-arrow">${oe.arrowRight}</span>
          </div>

          <div class="ck-rx-action-card ck-gateway-trigger" data-gateway-prompt="I want to understand municipal bylaws, rights, and budget allocations for my ward: " style="cursor:pointer;">
            <div class="ck-rx-action-icon-box">
              ${oe.bookOpen}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Understand an Issue</div>
              <div class="ck-rx-action-desc">Look up municipal bylaws, ward budget allocations & rights.</div>
            </div>
            <span class="ck-rx-action-arrow">${oe.arrowRight}</span>
          </div>
        </div>

        <!-- 4. What's Happening Around You (Community Activity Grid) -->
        <div class="ck-rx-section-header">
          <div>
            <h3 class="ck-rx-section-title">Community Activity</h3>
            <p class="ck-rx-section-sub">Active civic operations and reported cases in your ward</p>
          </div>
          <a href="/entities" class="ck-rx-section-link">View all ${oe.chevronRight}</a>
        </div>

        <div class="ck-rx-issues-grid">
          ${z}
        </div>

        <!-- 5. Trending in your city -->
        <div class="ck-rx-section-header" style="margin-top:36px;">
          <div>
            <h3 class="ck-rx-section-title">Trending in Your City</h3>
            <p class="ck-rx-section-sub">Top initiatives gaining citizen backing this week</p>
          </div>
          <a href="/entities" class="ck-rx-section-link">See all ${oe.chevronRight}</a>
        </div>

        <div class="ck-rx-trending-list">
          ${C}
        </div>

      </main><!-- /.ck-rx-main -->

      <!-- ░░ RIGHT SIDEBAR (MINIMALIST REVENUEX STYLE) ░░ -->
      <aside class="ck-rx-aside">

        <!-- Inboxes / Quick Actions -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">My Inboxes</div>
          
          <a href="/entities" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${oe.clipboard}
            </div>
            <span class="ck-rx-inbox-label">My Requests</span>
            <span class="ck-rx-inbox-badge">${p+u}</span>
            <span class="ck-rx-inbox-chevron">${oe.chevronRight}</span>
          </a>

          <a href="/entities?following=1" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${oe.heart}
            </div>
            <span class="ck-rx-inbox-label">Following</span>
            <span class="ck-rx-inbox-badge">${m}</span>
            <span class="ck-rx-inbox-chevron">${oe.chevronRight}</span>
          </a>

          <a href="/entities?status=approved" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${oe.checkCircle}
            </div>
            <span class="ck-rx-inbox-label">Contributions</span>
            <span class="ck-rx-inbox-badge">${h}</span>
            <span class="ck-rx-inbox-chevron">${oe.chevronRight}</span>
          </a>
        </div>

        <!-- Civic Spotlight -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">Civic Spotlight</div>
          <div class="ck-rx-spotlight-card">
            <div class="ck-rx-spotlight-tag">Featured Movement</div>
            <div class="ck-rx-spotlight-title">FC Road Pedestrian Safety & Crossing</div>
            <div class="ck-rx-spotlight-desc">Citizens organized 120 verified signatures to install a raised crosswalk near Fergusson College.</div>
            <div class="ck-rx-spotlight-stats">
              <span>${oe.usersSm} 42 supporters</span>
              <span>·</span>
              <span>Ward 14</span>
            </div>
            <a href="/entities" class="btn btn-primary btn-sm" style="width:100%; text-align:center; margin-top:8px;">
              Support Initiative
            </a>
          </div>
        </div>

        <!-- Civic Buzz -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">Civic Buzz</div>
          <div class="ck-rx-spotlight-card" style="background:linear-gradient(135deg, rgba(251,146,60,0.12), rgba(239,68,68,0.10)); border-color: rgba(251,146,60,0.35);">
            <div class="ck-rx-spotlight-tag" style="background:rgba(251,146,60,0.12); color:#f59e0b; border-color:rgba(251,146,60,0.25);">Community Campaign</div>
            <div class="ck-rx-spotlight-title">Turn civic issues into relatable awareness.</div>
            <div class="ck-rx-spotlight-desc">Share verified community stories, memes, and awareness posts that keep real issues visible and accountable.</div>
            <div class="ck-rx-spotlight-stats">
              <span>${oe.flame} 12 live posts</span>
              <span>·</span>
              <span>Moderator reviewed</span>
            </div>
            <a href="/buzz" class="btn btn-primary btn-sm" style="width:100%; text-align:center; margin-top:8px;">
              Open Civic Buzz
            </a>
          </div>
        </div>

        <!-- Activity Overview -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">Activity Snapshot</div>
          <div class="ck-rx-stat-row">
            <div class="ck-rx-stat-col">
              <span class="ck-rx-stat-num">${p}</span>
              <span class="ck-rx-stat-label">Active</span>
            </div>
            <div class="ck-rx-stat-divider"></div>
            <div class="ck-rx-stat-col">
              <span class="ck-rx-stat-num" style="color:#10b981;">${h}</span>
              <span class="ck-rx-stat-label">Resolved</span>
            </div>
            <div class="ck-rx-stat-divider"></div>
            <div class="ck-rx-stat-col">
              <span class="ck-rx-stat-num" style="color:#64748b;">${u}</span>
              <span class="ck-rx-stat-label">Drafts</span>
            </div>
          </div>
          <a href="/entities" class="btn btn-secondary btn-sm" style="width:100%; text-align:center; margin-top:12px;">
            View Full Records ${oe.chevronRight}
          </a>
        </div>

      </aside><!-- /.ck-rx-aside -->
    </div><!-- /.ck-rx-layout -->
  `,hl()}const Io=["2-foot rim-destroying pothole near FC College main gate","6 dead streetlights plunging Model Colony into pitch darkness","Mount Everest of garbage decomposing outside city school","High-pressure municipal water pipe bursting on Baner road","Illegal construction trucks dumping concrete into the riverbed","Fallen banyan tree branch blocking emergency ambulance route","Open sewer chamber without any warning cones or safety cover","Ear-splitting illegal DJ loudspeakers blasting at 2:00 AM"];let jt=null,$o=0,Ht=0,Zn=!1;function hl(a,o){let s="ck-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9),r=!1,d=null;const u=document.getElementById("ck-dark-input"),p=document.getElementById("ck-dark-send-btn"),h=document.getElementById("ck-dark-attach-btn"),m=document.getElementById("ck-dark-file-input"),v=document.getElementById("ck-dark-mic-btn"),y=document.getElementById("ck-dark-file-preview"),g=document.getElementById("ck-dark-thread"),w=document.getElementById("ck-dark-reset-btn");function _(){jt&&clearTimeout(jt);const D=document.getElementById("ck-dark-motion-target");if(!D)return;const A=Io[$o%Io.length];if(Zn){if(Ht--,D.textContent=A.substring(0,Ht),Ht<=0){Zn=!1,$o++,jt=setTimeout(_,380);return}jt=setTimeout(_,22)}else{if(Ht++,D.textContent=A.substring(0,Ht),Ht>=A.length){Zn=!0,jt=setTimeout(_,3200);return}jt=setTimeout(_,42)}}_();function z(){var K;if(!y)return;if(!d){y.innerHTML="",y.style.display="none";return}const D=d.type.startsWith("image/"),A=D?URL.createObjectURL(d):null,$=d.size<1024*1024?(d.size/1024).toFixed(1)+" KB":(d.size/(1024*1024)).toFixed(1)+" MB";y.style.display="flex",y.innerHTML=`
      <div class="ck-dark-file-chip">
        ${D?`<img src="${A}" class="ck-dark-file-thumb" alt="Preview"/>`:"<span>📄</span>"}
        <span><strong>${se(d.name)}</strong> (${$})</span>
        <button type="button" id="ck-dark-remove-file" class="ck-dark-file-remove" title="Remove attachment">&times;</button>
      </div>
    `,(K=document.getElementById("ck-dark-remove-file"))==null||K.addEventListener("click",()=>{d=null,m&&(m.value=""),z()})}h==null||h.addEventListener("click",()=>m==null?void 0:m.click()),m==null||m.addEventListener("change",D=>{var $;const A=($=D.target.files)==null?void 0:$[0];A&&(d=A,z(),u==null||u.focus())}),v==null||v.addEventListener("click",()=>{v.classList.toggle("active"),v.classList.contains("active")?(u.placeholder="Listening live... say your complaint...",setTimeout(()=>{v.classList.contains("active")&&(u.value="Massive open pothole right outside Ferguson College gate causing traffic jam",v.classList.remove("active"),u.placeholder="Type your request here — e.g. 'garbage not collected near FC road'...",u.focus())},1800)):u.placeholder="Type your request here — e.g. 'garbage not collected near FC road'..."});function C(D){if(!g)return;g.style.display="flex";const A=document.createElement("div");for(A.innerHTML=D;A.firstChild;)g.appendChild(A.firstChild);g.scrollTop=g.scrollHeight}function M(D,A=null){let $="";return A&&(A.isImage&&A.previewUrl?$=`
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <img src="${se(A.previewUrl)}" class="ck-dark-user-img" alt="Proof" />
            <div style="font-size:0.75rem;">
              <div>📷 <strong>${se(A.name)}</strong></div>
              <div style="opacity:0.8;">${se(A.sizeStr)}</div>
            </div>
          </div>
        `:$=`
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:0.75rem;">
            <span>📄</span>
            <div><strong>${se(A.name)}</strong> (${se(A.sizeStr)})</div>
          </div>
        `),`
      <div class="ck-dark-msg-row ck-dark-msg-user">
        <div class="ck-dark-bubble-user">
          ${$}
          <div>${se(D)}</div>
        </div>
      </div>
    `}function R(D){return`
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </div>
        <div class="ck-dark-bubble-agent">
          ${se(D||"").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}
        </div>
      </div>
    `}function B(){return`
      <div class="ck-dark-msg-row ck-dark-msg-agent" id="ck-dark-thinking">
        <div class="ck-dark-avatar" style="width:28px; height:28px; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </div>
        <div class="ck-dark-bubble-agent" style="display:flex; align-items:center; gap:8px; padding:10px 16px;">
          <span style="font-size:0.8rem; font-weight:600; color:#ff7d5c;">Civic Assistant analyzing</span>
          <div class="agent-thinking-dots" style="padding:0;"><span></span><span></span><span></span></div>
        </div>
      </div>
    `}function ne(D,A){const $=Array.isArray(D)?D.map(K=>`
      <div class="ck-dark-confirm-row">
        <span class="ck-dark-confirm-label">${se(K.label)}</span>
        <span class="ck-dark-confirm-val">${se(K.value)}</span>
      </div>
    `).join(""):"";return`
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; background:#10b981; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="ck-dark-confirm-card">
          <div class="ck-dark-confirm-title">
            <span>📝</span> Official Case Review — Ready to File
          </div>
          <p style="font-size:0.82rem; color:rgba(255,255,255,0.7); margin-bottom:12px;">
            ${se((A||"").split(`

`)[0]||"Please review your complaint summary before official filing.")}
          </p>
          <div class="ck-dark-confirm-table">${$}</div>
          <div class="ck-dark-confirm-actions" id="ck-dark-confirm-actions">
            <button type="button" id="ck-dark-confirm-submit-btn" class="ck-dark-btn-primary">
              ✓ File Official Case
            </button>
            <button type="button" id="ck-dark-confirm-cancel-btn" class="ck-dark-btn-secondary">
              ✗ Modify / Cancel
            </button>
          </div>
        </div>
      </div>
    `}function we(D,A,$){return`
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; background:#16a34a; box-shadow:none;">
          <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div class="ck-dark-success-card">
          <div class="ck-dark-success-badge">
            <span>🎉</span> Official Case #${D} Registered!
          </div>
          <p style="font-size:0.85rem; color:#f1f5f9; margin-bottom:12px;">
            <strong>${se(A||$)}</strong> has been officially logged and routed to Ward 14 Pune dispatch.
          </p>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <a href="/entities/${D}" class="ck-dark-btn-primary">
              Inspect My Case →
            </a>
            <button type="button" id="ck-dark-new-case-btn" class="ck-dark-btn-secondary">
              + File Another Issue
            </button>
          </div>
        </div>
      </div>
    `}async function fe(D,A=null){var he,$e;const $=A||d,K=(D||"").trim();if(r||!K&&!$)return;r=!0;let Q=null;if($){const de=$.type.startsWith("image/");Q={name:$.name,sizeStr:$.size<1024*1024?($.size/1024).toFixed(1)+" KB":($.size/(1024*1024)).toFixed(1)+" MB",isImage:de,previewUrl:de?URL.createObjectURL($):null}}u&&(u.value=""),d=null,m&&(m.value=""),z(),C(M(K||($?`Attached file: ${$.name}`:""),Q)),C(B()),p&&(p.disabled=!0);try{const de=await qi.chat(s,K,$);(he=document.getElementById("ck-dark-thinking"))==null||he.remove();const j=de.data;j.type==="confirm"?(C(ne(j.summary||[],j.text)),setTimeout(()=>{var J,Te;(J=document.getElementById("ck-dark-confirm-submit-btn"))==null||J.addEventListener("click",()=>{var O;(O=document.getElementById("ck-dark-confirm-actions"))==null||O.remove(),fe("yes")}),(Te=document.getElementById("ck-dark-confirm-cancel-btn"))==null||Te.addEventListener("click",()=>{var O;(O=document.getElementById("ck-dark-confirm-actions"))==null||O.remove(),fe("cancel")})},50)):j.type==="submitted"?(C(we(j.entity_id,j.entity_name,j.capability)),setTimeout(()=>{var J;(J=document.getElementById("ck-dark-new-case-btn"))==null||J.addEventListener("click",()=>{Me()})},50)):C(R(j.text||"Understood. Please provide additional details or landmarks."))}catch(de){($e=document.getElementById("ck-dark-thinking"))==null||$e.remove(),C(R("I encountered a connection hiccup with the AI dispatcher. Please try describing your issue again.")),console.error("[Cockpit Agent Error]:",de)}finally{r=!1,p&&(p.disabled=!1),u==null||u.focus()}}p==null||p.addEventListener("click",()=>{fe(u==null?void 0:u.value)}),u==null||u.addEventListener("keydown",D=>{D.key==="Enter"&&!D.shiftKey&&(D.preventDefault(),fe(u.value))}),document.querySelectorAll(".ck-dark-chip").forEach(D=>{D.addEventListener("click",()=>{const A=D.getAttribute("data-text");A&&fe(A)})}),document.querySelectorAll(".ck-gateway-trigger").forEach(D=>{D.addEventListener("click",()=>{const A=D.getAttribute("data-gateway-prompt"),$=document.getElementById("ck-dark-cockpit");$&&$.scrollIntoView({behavior:"smooth",block:"center"}),u&&(u.value=A||"",u.focus())})});function Me(){s&&qi.clearSession(s),s="ck-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9),r=!1,d=null,m&&(m.value=""),z(),g&&(g.innerHTML="",g.style.display="none"),u==null||u.focus()}w==null||w.addEventListener("click",Me)}function ml(a){const o=[{name:"FC Road Pedestrian Crosswalk & Safety Lights",area:"Ward 14 · Shivajinagar",status:"coordinator_approved"},{name:"Kothrud Green Corridor Tree Plantation",area:"Ward 9 · Kothrud",status:"approved"},{name:"Baner Sector 4 Waste Segregation Drive",area:"Ward 2 · Baner",status:"submitted"},{name:"Model Colony Park Solar Lighting Audit",area:"Ward 11 · Model Colony",status:"coordinator_approved"}],s=[...a];for(const r of o){if(s.length>=4)break;s.some(d=>d.name===r.name)||s.push(r)}return s}function fl(){return[{rank:"01",name:"Kothrud Green Corridor Tree Plantation",area:"Ward 9 · Kothrud",count:64},{rank:"02",name:"FC Road Pedestrian Safety & Zebra Crossings",area:"Ward 14 · Shivajinagar",count:52},{rank:"03",name:"Baner Wet-Waste Decentralized Composting",area:"Ward 2 · Baner",count:41}].map(o=>`
    <div class="ck-rx-trending-row">
      <span class="ck-rx-trending-num">${o.rank}</span>
      <div class="ck-rx-trending-info">
        <div class="ck-rx-trending-name">${o.name}</div>
        <div class="ck-rx-trending-sub">${o.area} · ${o.count} citizens backing</div>
      </div>
      <a href="/entities" class="ck-rx-trending-arrow">
        ${oe.chevronRight}
      </a>
    </div>
  `).join("")}async function vl(a,o,s){var p;const r=o.assignedArea,d=await le.list({status:"submitted",area:r,limit:10}),u=d.data||[];a.innerHTML=`
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Jurisdiction Area:</strong> ${se(r||"Sector 5")}</div>
      <span class="badge badge-primary">Area Coordinator</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((p=d.pagination)==null?void 0:p.total)||u.length}</div>
        <div class="kpi-label">Pending Area Verification</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Cases Requiring Action</div>
          <div class="card-subtitle">Submitted cases in ${se(r||"Sector 5")} awaiting verification</div>
        </div>
        <div style="display:flex;gap:12px;">
          <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
          <a href="/buzz?tab=review" class="btn btn-link btn-sm">Civic Buzz review</a>
        </div>
      </div>
      ${pa(u,!0)}
    </div>
  `}async function gl(a,o,s){var u;const r=await le.list({status:"submitted",area:"Unassigned",limit:10}),d=r.data||[];a.innerHTML=`
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Operational Scope:</strong> General Coordinator (Handling Unassigned Areas & Escalations)</div>
      <span class="badge badge-primary">General Operations</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((u=r.pagination)==null?void 0:u.total)||d.length}</div>
        <div class="kpi-label">Unassigned Cases Awaiting Review</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Cases Requiring Action</div>
          <div class="card-subtitle">Unassigned cases awaiting coordinator review</div>
        </div>
        <div style="display:flex;gap:12px;">
          <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
          <a href="/buzz?tab=review" class="btn btn-link btn-sm">Civic Buzz review</a>
        </div>
      </div>
      ${pa(d,!0)}
    </div>
  `}async function yl(a,o,s){var u;const r=await le.list({status:"coordinator_approved",limit:10}),d=r.data||[];a.innerHTML=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((u=r.pagination)==null?void 0:u.total)||d.length}</div>
        <div class="kpi-label">Pending Executive Approval</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Executive Approval Queue</div>
          <div class="card-subtitle">Coordinator-approved cases awaiting final executive sign-off</div>
        </div>
        <a href="/entities?status=coordinator_approved" class="btn btn-link btn-sm">View Full Queue</a>
      </div>
      ${pa(d,!0)}
    </div>
  `}async function bl(a,o,s){var p,h,m;const[r,d,u]=await Promise.all([le.list({limit:1}),le.list({status:"submitted",limit:1}),le.list({status:"approved",limit:1})]);a.innerHTML=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-blue">
        <div class="kpi-num">${((p=r.pagination)==null?void 0:p.total)||0}</div>
        <div class="kpi-label">Total System Cases</div>
      </div>
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((h=d.pagination)==null?void 0:h.total)||0}</div>
        <div class="kpi-label">In Workflow</div>
      </div>
      <div class="kpi-item accent-green">
        <div class="kpi-num">${((m=u.pagination)==null?void 0:m.total)||0}</div>
        <div class="kpi-label">Approved & Active</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header">
        <div class="card-title">Civic OS Administration & Module Deployment</div>
      </div>
      <div class="card-body p-6">
        <p class="mb-4 text-secondary">
          As a Platform Administrator, you can deploy new civic capability modules via No-Code metadata generation, manage users, and review platform accountability logs.
        </p>
        <div class="flex gap-3">
          <a href="/module-builder" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
            No-Code Module Builder
          </a>
          <a href="/admin" class="btn btn-secondary">User & Role Admin</a>
          <a href="/reports" class="btn btn-secondary">Governance Reports</a>
        </div>
      </div>
    </div>
  `}function pa(a,o=!1){if(!a||a.length===0)return`
      <div class="table-empty" style="padding:32px; text-align:center; color:var(--text-muted);">
        <p style="font-size:0.9rem; font-weight:500;">No active cases in this view.</p>
      </div>
    `;const s=a.map(r=>{var d,u;return`
    <tr>
      <td><a href="/entities/${r.entity_id}" class="text-link font-medium">#${r.entity_id}</a></td>
      <td>
        <a href="/entities/${r.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
          ${se(r.name)}
        </a>
      </td>
      <td><span class="badge badge-secondary">${se(((d=r.entityType)==null?void 0:d.name)||"Capability")}</span></td>
      ${o?`<td>${se(((u=r.owner)==null?void 0:u.name)||"System")}</td>`:""}
      <td>${se(r.area||"—")}</td>
      <td><span class="badge badge-${r.status}">${Ct(r.status)}</span></td>
      <td><a href="/entities/${r.entity_id}" class="btn btn-secondary btn-sm">Review →</a></td>
    </tr>
  `}).join("");return`
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Case / Request Title</th>
            <th>Capability Type</th>
            ${o?"<th>Submitted By</th>":""}
            <th>Area</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${s}
        </tbody>
      </table>
    </div>
  `}function gt(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}let X={page:1,limit:20},ui=[];async function _l(a={},o=null){if(!ot(ie))return;const s=o||new URLSearchParams(window.location.search);s.has("status")?X.status=s.get("status"):delete X.status,s.has("entity_type_id")?X.entity_type_id=s.get("entity_type_id"):delete X.entity_type_id,s.has("name")?X.name=s.get("name"):delete X.name,s.has("page")?X.page=Number(s.get("page")):X.page=1;const r=Mt(),u=Ji()==="citizen";u&&(r!=null&&r.user_id)?X.owner_user_id=r.user_id:delete X.owner_user_id;try{ui=(await le.listTypes().catch(()=>({data:[]}))).data||[]}catch{ui=[]}const p=ui.find(_=>String(_.entity_type_id)===String(X.entity_type_id)),h=at(p);let m="All Cases & Requests",v="Browse, search, and track all civic cases and requests across your workspace.";u?(m=p?`My ${h.title} Requests`:"My Civic Activity",v=p?`Tracking cases initiated by you for capability "${h.title}".`:"Track, review, and manage civic cases and initiatives initiated by you."):p&&(m=`${h.title} Cases`,v=`Browsing cases for capability "${h.title}".`);const y=document.getElementById("app");y.innerHTML=_e(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="entities-header-title">${gt(m)}</h1>
        <p id="entities-header-subtitle">${gt(v)}</p>
      </div>
      <div class="page-header-actions">
        <a href="/entities/new${X.entity_type_id?`?entity_type_id=${X.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Start Civic Action
        </a>
      </div>
    </div>
    
    <div class="card mb-6" style="padding: 16px 20px;">
      <div class="filters-bar" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; width:100%;">
        <!-- Search Box -->
        <div style="flex: 2; min-width: 240px; position: relative;">
          <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; color: var(--text-muted); pointer-events: none;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </span>
          <input type="text" id="filter-search" class="form-control" style="padding-left: 38px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search cases by title or location..." value="${gt(X.name||"")}">
        </div>

        <!-- Dynamic Module Filter -->
        <div style="flex: 1.3; min-width: 210px;">
          <select id="filter-type" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Capabilities</option>
            ${ui.map(_=>{const z=at(_);return`<option value="${_.entity_type_id}" ${String(X.entity_type_id)===String(_.entity_type_id)?"selected":""}>${gt(z.title)}</option>`}).join("")}
          </select>
        </div>

        <!-- Status Filter -->
        <div style="flex: 1.2; min-width: 200px;">
          <select id="filter-status" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Statuses</option>
            <option value="draft" ${X.status==="draft"?"selected":""}>Draft</option>
            <option value="submitted" ${X.status==="submitted"?"selected":""}>Submitted</option>
            <option value="coordinator_approved" ${X.status==="coordinator_approved"?"selected":""}>Verified (Pending Approval)</option>
            <option value="approved" ${X.status==="approved"?"selected":""}>Approved & Active</option>
            <option value="rejected" ${X.status==="rejected"?"selected":""}>Rejected</option>
            <option value="closed" ${X.status==="closed"?"selected":""}>Closed</option>
          </select>
        </div>

        <!-- Filter Action Buttons -->
        <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
          <button id="btn-filter" class="btn btn-primary" style="height: 42px; padding: 0 18px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Apply Filters
          </button>
          ${X.status||X.entity_type_id||X.name?`
            <button id="btn-clear-filter" class="btn btn-secondary" style="height: 42px; padding: 0 14px; display: inline-flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              Reset
            </button>
          `:""}
        </div>
      </div>
    </div>
    
    <div id="entities-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,m,ui),xe();const g=()=>{const _=document.getElementById("filter-status").value,z=document.getElementById("filter-type").value,C=document.getElementById("filter-search").value.trim(),M=new URLSearchParams;_&&M.set("status",_),z&&M.set("entity_type_id",z),C&&M.set("name",C),ie(`/entities${M.toString()?"?"+M.toString():""}`)};document.getElementById("btn-filter").addEventListener("click",g),document.getElementById("filter-search").addEventListener("keypress",_=>{_.key==="Enter"&&g()});const w=document.getElementById("btn-clear-filter");w&&w.addEventListener("click",()=>{ie("/entities")}),await xl()}async function xl(){const a=document.getElementById("entities-content");if(!a)return;const s=Ji()==="citizen";try{const r=await le.list(X),{data:d,pagination:u}=r;if(!d||d.length===0){a.innerHTML=`
        <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
          <div style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">
            ${s?"No civic activity yet":"No cases found"}
          </h3>
          <p style="font-size:0.875rem; color:var(--text-muted); max-width:420px; margin:0 auto 20px;">
            ${s?"You have not initiated any civic cases, reports, or applications yet. Start a new civic action to get started.":"No civic cases match your filter. Try adjusting your query or starting a new civic action."}
          </p>
          <div style="display:flex; gap:12px; justify-content:center;">
            ${X.status||X.entity_type_id||X.name?`
              <a href="/entities" class="btn btn-secondary">Clear Filters</a>
            `:""}
            <a href="/entities/new${X.entity_type_id?`?entity_type_id=${X.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Start Civic Action
            </a>
          </div>
        </div>
      `;return}const p=d.map(g=>{var _;const w=at(g.entityType);return`
        <tr>
          <td><a href="/entities/${g.entity_id}" class="text-link font-medium">#PR-${String(g.entity_id).padStart(5,"0")}</a></td>
          <td>
            <a href="/entities/${g.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
              ${gt(g.name)}
            </a>
          </td>
          <td><span class="badge badge-secondary">${gt(w.shortTitle)}</span></td>
          ${s?"":`<td>${gt(((_=g.owner)==null?void 0:_.name)||"System")}</td>`}
          <td>${gt(g.area||"—")}</td>
          <td><span class="badge badge-${g.status}">${Ct(g.status)}</span></td>
          <td>
            <a href="/entities/${g.entity_id}" class="btn btn-secondary btn-sm">${s?"View Details →":"Review Case →"}</a>
          </td>
        </tr>
      `}).join(""),h=Math.ceil(u.total/u.limit);let m="";h>1&&(m=`
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding:0 8px;">
          <div style="font-size:0.85rem; color:var(--text-muted);">
            Showing page ${u.page} of ${h} (${u.total} total cases)
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btn-prev" ${u.page<=1?"disabled":""}>← Previous</button>
            <button class="btn btn-secondary btn-sm" id="btn-next" ${u.page>=h?"disabled":""}>Next →</button>
          </div>
        </div>
      `),a.innerHTML=`
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Capability Type</th>
                ${s?"":"<th>Submitted By</th>"}
                <th>Area / Jurisdiction</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${p}
            </tbody>
          </table>
        </div>
      </div>
      ${m}
    `;const v=document.getElementById("btn-prev"),y=document.getElementById("btn-next");v&&v.addEventListener("click",()=>{const g=new URLSearchParams(window.location.search);g.set("page",String(X.page-1)),ie(`/entities?${g.toString()}`)}),y&&y.addEventListener("click",()=>{const g=new URLSearchParams(window.location.search);g.set("page",String(X.page+1)),ie(`/entities?${g.toString()}`)}),typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}catch{V("Failed to load cases"),a.innerHTML='<div class="alert alert-error">Error loading cases. Please try again.</div>',typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}}let Vi=null;function ta({title:a,content:o,footer:s="",onClose:r=()=>{}}){qt();const d=document.getElementById("modal-container"),u=`
    <div class="modal-backdrop" id="modal-backdrop"></div>
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>${wl(a)}</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        ${o}
      </div>
      ${s?`<div class="modal-footer">${s}</div>`:""}
    </div>
  `;d.innerHTML=u,d.style.pointerEvents="auto";const p=()=>{d.innerHTML="",d.style.pointerEvents="none",Vi=null,r()};Vi=p,document.getElementById("modal-close-btn").addEventListener("click",p),document.getElementById("modal-backdrop").addEventListener("click",p);const h=m=>{m.key==="Escape"&&(p(),document.removeEventListener("keydown",h))};document.addEventListener("keydown",h)}function qt(){Vi&&Vi()}function wl(a){return String(a).replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}var kl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Ll(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a}var ia={exports:{}};/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */(function(a,o){(function(s,r){r(o)})(kl,function(s){var r="1.9.4";function d(e){var t,i,n,l;for(i=1,n=arguments.length;i<n;i++){l=arguments[i];for(t in l)e[t]=l[t]}return e}var u=Object.create||function(){function e(){}return function(t){return e.prototype=t,new e}}();function p(e,t){var i=Array.prototype.slice;if(e.bind)return e.bind.apply(e,i.call(arguments,1));var n=i.call(arguments,2);return function(){return e.apply(t,n.length?n.concat(i.call(arguments)):arguments)}}var h=0;function m(e){return"_leaflet_id"in e||(e._leaflet_id=++h),e._leaflet_id}function v(e,t,i){var n,l,c,f;return f=function(){n=!1,l&&(c.apply(i,l),l=!1)},c=function(){n?l=arguments:(e.apply(i,arguments),setTimeout(f,t),n=!0)},c}function y(e,t,i){var n=t[1],l=t[0],c=n-l;return e===n&&i?e:((e-l)%c+c)%c+l}function g(){return!1}function w(e,t){if(t===!1)return e;var i=Math.pow(10,t===void 0?6:t);return Math.round(e*i)/i}function _(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}function z(e){return _(e).split(/\s+/)}function C(e,t){Object.prototype.hasOwnProperty.call(e,"options")||(e.options=e.options?u(e.options):{});for(var i in t)e.options[i]=t[i];return e.options}function M(e,t,i){var n=[];for(var l in e)n.push(encodeURIComponent(i?l.toUpperCase():l)+"="+encodeURIComponent(e[l]));return(!t||t.indexOf("?")===-1?"?":"&")+n.join("&")}var R=/\{ *([\w_ -]+) *\}/g;function B(e,t){return e.replace(R,function(i,n){var l=t[n];if(l===void 0)throw new Error("No value provided for variable "+i);return typeof l=="function"&&(l=l(t)),l})}var ne=Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"};function we(e,t){for(var i=0;i<e.length;i++)if(e[i]===t)return i;return-1}var fe="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";function Me(e){return window["webkit"+e]||window["moz"+e]||window["ms"+e]}var D=0;function A(e){var t=+new Date,i=Math.max(0,16-(t-D));return D=t+i,window.setTimeout(e,i)}var $=window.requestAnimationFrame||Me("RequestAnimationFrame")||A,K=window.cancelAnimationFrame||Me("CancelAnimationFrame")||Me("CancelRequestAnimationFrame")||function(e){window.clearTimeout(e)};function Q(e,t,i){if(i&&$===A)e.call(t);else return $.call(window,p(e,t))}function he(e){e&&K.call(window,e)}var $e={__proto__:null,extend:d,create:u,bind:p,get lastId(){return h},stamp:m,throttle:v,wrapNum:y,falseFn:g,formatNum:w,trim:_,splitWords:z,setOptions:C,getParamString:M,template:B,isArray:ne,indexOf:we,emptyImageUrl:fe,requestFn:$,cancelFn:K,requestAnimFrame:Q,cancelAnimFrame:he};function de(){}de.extend=function(e){var t=function(){C(this),this.initialize&&this.initialize.apply(this,arguments),this.callInitHooks()},i=t.__super__=this.prototype,n=u(i);n.constructor=t,t.prototype=n;for(var l in this)Object.prototype.hasOwnProperty.call(this,l)&&l!=="prototype"&&l!=="__super__"&&(t[l]=this[l]);return e.statics&&d(t,e.statics),e.includes&&(j(e.includes),d.apply(null,[n].concat(e.includes))),d(n,e),delete n.statics,delete n.includes,n.options&&(n.options=i.options?u(i.options):{},d(n.options,e.options)),n._initHooks=[],n.callInitHooks=function(){if(!this._initHooksCalled){i.callInitHooks&&i.callInitHooks.call(this),this._initHooksCalled=!0;for(var c=0,f=n._initHooks.length;c<f;c++)n._initHooks[c].call(this)}},t},de.include=function(e){var t=this.prototype.options;return d(this.prototype,e),e.options&&(this.prototype.options=t,this.mergeOptions(e.options)),this},de.mergeOptions=function(e){return d(this.prototype.options,e),this},de.addInitHook=function(e){var t=Array.prototype.slice.call(arguments,1),i=typeof e=="function"?e:function(){this[e].apply(this,t)};return this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(i),this};function j(e){if(!(typeof L>"u"||!L||!L.Mixin)){e=ne(e)?e:[e];for(var t=0;t<e.length;t++)e[t]===L.Mixin.Events&&console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.",new Error().stack)}}var J={on:function(e,t,i){if(typeof e=="object")for(var n in e)this._on(n,e[n],t);else{e=z(e);for(var l=0,c=e.length;l<c;l++)this._on(e[l],t,i)}return this},off:function(e,t,i){if(!arguments.length)delete this._events;else if(typeof e=="object")for(var n in e)this._off(n,e[n],t);else{e=z(e);for(var l=arguments.length===1,c=0,f=e.length;c<f;c++)l?this._off(e[c]):this._off(e[c],t,i)}return this},_on:function(e,t,i,n){if(typeof t!="function"){console.warn("wrong listener type: "+typeof t);return}if(this._listens(e,t,i)===!1){i===this&&(i=void 0);var l={fn:t,ctx:i};n&&(l.once=!0),this._events=this._events||{},this._events[e]=this._events[e]||[],this._events[e].push(l)}},_off:function(e,t,i){var n,l,c;if(this._events&&(n=this._events[e],!!n)){if(arguments.length===1){if(this._firingCount)for(l=0,c=n.length;l<c;l++)n[l].fn=g;delete this._events[e];return}if(typeof t!="function"){console.warn("wrong listener type: "+typeof t);return}var f=this._listens(e,t,i);if(f!==!1){var b=n[f];this._firingCount&&(b.fn=g,this._events[e]=n=n.slice()),n.splice(f,1)}}},fire:function(e,t,i){if(!this.listens(e,i))return this;var n=d({},t,{type:e,target:this,sourceTarget:t&&t.sourceTarget||this});if(this._events){var l=this._events[e];if(l){this._firingCount=this._firingCount+1||1;for(var c=0,f=l.length;c<f;c++){var b=l[c],x=b.fn;b.once&&this.off(e,x,b.ctx),x.call(b.ctx||this,n)}this._firingCount--}}return i&&this._propagateEvent(n),this},listens:function(e,t,i,n){typeof e!="string"&&console.warn('"string" type argument expected');var l=t;typeof t!="function"&&(n=!!t,l=void 0,i=void 0);var c=this._events&&this._events[e];if(c&&c.length&&this._listens(e,l,i)!==!1)return!0;if(n){for(var f in this._eventParents)if(this._eventParents[f].listens(e,t,i,n))return!0}return!1},_listens:function(e,t,i){if(!this._events)return!1;var n=this._events[e]||[];if(!t)return!!n.length;i===this&&(i=void 0);for(var l=0,c=n.length;l<c;l++)if(n[l].fn===t&&n[l].ctx===i)return l;return!1},once:function(e,t,i){if(typeof e=="object")for(var n in e)this._on(n,e[n],t,!0);else{e=z(e);for(var l=0,c=e.length;l<c;l++)this._on(e[l],t,i,!0)}return this},addEventParent:function(e){return this._eventParents=this._eventParents||{},this._eventParents[m(e)]=e,this},removeEventParent:function(e){return this._eventParents&&delete this._eventParents[m(e)],this},_propagateEvent:function(e){for(var t in this._eventParents)this._eventParents[t].fire(e.type,d({layer:e.target,propagatedFrom:e.target},e),!0)}};J.addEventListener=J.on,J.removeEventListener=J.clearAllEventListeners=J.off,J.addOneTimeEventListener=J.once,J.fireEvent=J.fire,J.hasEventListeners=J.listens;var Te=de.extend(J);function O(e,t,i){this.x=i?Math.round(e):e,this.y=i?Math.round(t):t}var an=Math.trunc||function(e){return e>0?Math.floor(e):Math.ceil(e)};O.prototype={clone:function(){return new O(this.x,this.y)},add:function(e){return this.clone()._add(H(e))},_add:function(e){return this.x+=e.x,this.y+=e.y,this},subtract:function(e){return this.clone()._subtract(H(e))},_subtract:function(e){return this.x-=e.x,this.y-=e.y,this},divideBy:function(e){return this.clone()._divideBy(e)},_divideBy:function(e){return this.x/=e,this.y/=e,this},multiplyBy:function(e){return this.clone()._multiplyBy(e)},_multiplyBy:function(e){return this.x*=e,this.y*=e,this},scaleBy:function(e){return new O(this.x*e.x,this.y*e.y)},unscaleBy:function(e){return new O(this.x/e.x,this.y/e.y)},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},ceil:function(){return this.clone()._ceil()},_ceil:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this},trunc:function(){return this.clone()._trunc()},_trunc:function(){return this.x=an(this.x),this.y=an(this.y),this},distanceTo:function(e){e=H(e);var t=e.x-this.x,i=e.y-this.y;return Math.sqrt(t*t+i*i)},equals:function(e){return e=H(e),e.x===this.x&&e.y===this.y},contains:function(e){return e=H(e),Math.abs(e.x)<=Math.abs(this.x)&&Math.abs(e.y)<=Math.abs(this.y)},toString:function(){return"Point("+w(this.x)+", "+w(this.y)+")"}};function H(e,t,i){return e instanceof O?e:ne(e)?new O(e[0],e[1]):e==null?e:typeof e=="object"&&"x"in e&&"y"in e?new O(e.x,e.y):new O(e,t,i)}function ce(e,t){if(e)for(var i=t?[e,t]:e,n=0,l=i.length;n<l;n++)this.extend(i[n])}ce.prototype={extend:function(e){var t,i;if(!e)return this;if(e instanceof O||typeof e[0]=="number"||"x"in e)t=i=H(e);else if(e=Be(e),t=e.min,i=e.max,!t||!i)return this;return!this.min&&!this.max?(this.min=t.clone(),this.max=i.clone()):(this.min.x=Math.min(t.x,this.min.x),this.max.x=Math.max(i.x,this.max.x),this.min.y=Math.min(t.y,this.min.y),this.max.y=Math.max(i.y,this.max.y)),this},getCenter:function(e){return H((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,e)},getBottomLeft:function(){return H(this.min.x,this.max.y)},getTopRight:function(){return H(this.max.x,this.min.y)},getTopLeft:function(){return this.min},getBottomRight:function(){return this.max},getSize:function(){return this.max.subtract(this.min)},contains:function(e){var t,i;return typeof e[0]=="number"||e instanceof O?e=H(e):e=Be(e),e instanceof ce?(t=e.min,i=e.max):t=i=e,t.x>=this.min.x&&i.x<=this.max.x&&t.y>=this.min.y&&i.y<=this.max.y},intersects:function(e){e=Be(e);var t=this.min,i=this.max,n=e.min,l=e.max,c=l.x>=t.x&&n.x<=i.x,f=l.y>=t.y&&n.y<=i.y;return c&&f},overlaps:function(e){e=Be(e);var t=this.min,i=this.max,n=e.min,l=e.max,c=l.x>t.x&&n.x<i.x,f=l.y>t.y&&n.y<i.y;return c&&f},isValid:function(){return!!(this.min&&this.max)},pad:function(e){var t=this.min,i=this.max,n=Math.abs(t.x-i.x)*e,l=Math.abs(t.y-i.y)*e;return Be(H(t.x-n,t.y-l),H(i.x+n,i.y+l))},equals:function(e){return e?(e=Be(e),this.min.equals(e.getTopLeft())&&this.max.equals(e.getBottomRight())):!1}};function Be(e,t){return!e||e instanceof ce?e:new ce(e,t)}function Re(e,t){if(e)for(var i=t?[e,t]:e,n=0,l=i.length;n<l;n++)this.extend(i[n])}Re.prototype={extend:function(e){var t=this._southWest,i=this._northEast,n,l;if(e instanceof ae)n=e,l=e;else if(e instanceof Re){if(n=e._southWest,l=e._northEast,!n||!l)return this}else return e?this.extend(W(e)||ve(e)):this;return!t&&!i?(this._southWest=new ae(n.lat,n.lng),this._northEast=new ae(l.lat,l.lng)):(t.lat=Math.min(n.lat,t.lat),t.lng=Math.min(n.lng,t.lng),i.lat=Math.max(l.lat,i.lat),i.lng=Math.max(l.lng,i.lng)),this},pad:function(e){var t=this._southWest,i=this._northEast,n=Math.abs(t.lat-i.lat)*e,l=Math.abs(t.lng-i.lng)*e;return new Re(new ae(t.lat-n,t.lng-l),new ae(i.lat+n,i.lng+l))},getCenter:function(){return new ae((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new ae(this.getNorth(),this.getWest())},getSouthEast:function(){return new ae(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(e){typeof e[0]=="number"||e instanceof ae||"lat"in e?e=W(e):e=ve(e);var t=this._southWest,i=this._northEast,n,l;return e instanceof Re?(n=e.getSouthWest(),l=e.getNorthEast()):n=l=e,n.lat>=t.lat&&l.lat<=i.lat&&n.lng>=t.lng&&l.lng<=i.lng},intersects:function(e){e=ve(e);var t=this._southWest,i=this._northEast,n=e.getSouthWest(),l=e.getNorthEast(),c=l.lat>=t.lat&&n.lat<=i.lat,f=l.lng>=t.lng&&n.lng<=i.lng;return c&&f},overlaps:function(e){e=ve(e);var t=this._southWest,i=this._northEast,n=e.getSouthWest(),l=e.getNorthEast(),c=l.lat>t.lat&&n.lat<i.lat,f=l.lng>t.lng&&n.lng<i.lng;return c&&f},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(e,t){return e?(e=ve(e),this._southWest.equals(e.getSouthWest(),t)&&this._northEast.equals(e.getNorthEast(),t)):!1},isValid:function(){return!!(this._southWest&&this._northEast)}};function ve(e,t){return e instanceof Re?e:new Re(e,t)}function ae(e,t,i){if(isNaN(e)||isNaN(t))throw new Error("Invalid LatLng object: ("+e+", "+t+")");this.lat=+e,this.lng=+t,i!==void 0&&(this.alt=+i)}ae.prototype={equals:function(e,t){if(!e)return!1;e=W(e);var i=Math.max(Math.abs(this.lat-e.lat),Math.abs(this.lng-e.lng));return i<=(t===void 0?1e-9:t)},toString:function(e){return"LatLng("+w(this.lat,e)+", "+w(this.lng,e)+")"},distanceTo:function(e){return ut.distance(this,W(e))},wrap:function(){return ut.wrapLatLng(this)},toBounds:function(e){var t=180*e/40075017,i=t/Math.cos(Math.PI/180*this.lat);return ve([this.lat-t,this.lng-i],[this.lat+t,this.lng+i])},clone:function(){return new ae(this.lat,this.lng,this.alt)}};function W(e,t,i){return e instanceof ae?e:ne(e)&&typeof e[0]!="object"?e.length===3?new ae(e[0],e[1],e[2]):e.length===2?new ae(e[0],e[1]):null:e==null?e:typeof e=="object"&&"lat"in e?new ae(e.lat,"lng"in e?e.lng:e.lon,e.alt):t===void 0?null:new ae(e,t,i)}var st={latLngToPoint:function(e,t){var i=this.projection.project(e),n=this.scale(t);return this.transformation._transform(i,n)},pointToLatLng:function(e,t){var i=this.scale(t),n=this.transformation.untransform(e,i);return this.projection.unproject(n)},project:function(e){return this.projection.project(e)},unproject:function(e){return this.projection.unproject(e)},scale:function(e){return 256*Math.pow(2,e)},zoom:function(e){return Math.log(e/256)/Math.LN2},getProjectedBounds:function(e){if(this.infinite)return null;var t=this.projection.bounds,i=this.scale(e),n=this.transformation.transform(t.min,i),l=this.transformation.transform(t.max,i);return new ce(n,l)},infinite:!1,wrapLatLng:function(e){var t=this.wrapLng?y(e.lng,this.wrapLng,!0):e.lng,i=this.wrapLat?y(e.lat,this.wrapLat,!0):e.lat,n=e.alt;return new ae(i,t,n)},wrapLatLngBounds:function(e){var t=e.getCenter(),i=this.wrapLatLng(t),n=t.lat-i.lat,l=t.lng-i.lng;if(n===0&&l===0)return e;var c=e.getSouthWest(),f=e.getNorthEast(),b=new ae(c.lat-n,c.lng-l),x=new ae(f.lat-n,f.lng-l);return new Re(b,x)}},ut=d({},st,{wrapLng:[-180,180],R:6371e3,distance:function(e,t){var i=Math.PI/180,n=e.lat*i,l=t.lat*i,c=Math.sin((t.lat-e.lat)*i/2),f=Math.sin((t.lng-e.lng)*i/2),b=c*c+Math.cos(n)*Math.cos(l)*f*f,x=2*Math.atan2(Math.sqrt(b),Math.sqrt(1-b));return this.R*x}}),ya=6378137,on={R:ya,MAX_LATITUDE:85.0511287798,project:function(e){var t=Math.PI/180,i=this.MAX_LATITUDE,n=Math.max(Math.min(i,e.lat),-i),l=Math.sin(n*t);return new O(this.R*e.lng*t,this.R*Math.log((1+l)/(1-l))/2)},unproject:function(e){var t=180/Math.PI;return new ae((2*Math.atan(Math.exp(e.y/this.R))-Math.PI/2)*t,e.x*t/this.R)},bounds:function(){var e=ya*Math.PI;return new ce([-e,-e],[e,e])}()};function sn(e,t,i,n){if(ne(e)){this._a=e[0],this._b=e[1],this._c=e[2],this._d=e[3];return}this._a=e,this._b=t,this._c=i,this._d=n}sn.prototype={transform:function(e,t){return this._transform(e.clone(),t)},_transform:function(e,t){return t=t||1,e.x=t*(this._a*e.x+this._b),e.y=t*(this._c*e.y+this._d),e},untransform:function(e,t){return t=t||1,new O((e.x/t-this._b)/this._a,(e.y/t-this._d)/this._c)}};function Jt(e,t,i,n){return new sn(e,t,i,n)}var rn=d({},ut,{code:"EPSG:3857",projection:on,transformation:function(){var e=.5/(Math.PI*on.R);return Jt(e,.5,-e,.5)}()}),ys=d({},rn,{code:"EPSG:900913"});function ba(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function _a(e,t){var i="",n,l,c,f,b,x;for(n=0,c=e.length;n<c;n++){for(b=e[n],l=0,f=b.length;l<f;l++)x=b[l],i+=(l?"L":"M")+x.x+" "+x.y;i+=t?I.svg?"z":"x":""}return i||"M0 0"}var ln=document.documentElement.style,_i="ActiveXObject"in window,bs=_i&&!document.addEventListener,xa="msLaunchUri"in navigator&&!("documentMode"in document),dn=Qe("webkit"),wa=Qe("android"),ka=Qe("android 2")||Qe("android 3"),_s=parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1],10),xs=wa&&Qe("Google")&&_s<537&&!("AudioNode"in window),cn=!!window.opera,La=!xa&&Qe("chrome"),Ca=Qe("gecko")&&!dn&&!cn&&!_i,ws=!La&&Qe("safari"),Ea=Qe("phantom"),Ta="OTransition"in ln,ks=navigator.platform.indexOf("Win")===0,za=_i&&"transition"in ln,un="WebKitCSSMatrix"in window&&"m11"in new window.WebKitCSSMatrix&&!ka,Ma="MozPerspective"in ln,Ls=!window.L_DISABLE_3D&&(za||un||Ma)&&!Ta&&!Ea,Yt=typeof orientation<"u"||Qe("mobile"),Cs=Yt&&dn,Es=Yt&&un,Sa=!window.PointerEvent&&window.MSPointerEvent,Pa=!!(window.PointerEvent||Sa),Aa="ontouchstart"in window||!!window.TouchEvent,Ts=!window.L_NO_TOUCH&&(Aa||Pa),zs=Yt&&cn,Ms=Yt&&Ca,Ss=(window.devicePixelRatio||window.screen.deviceXDPI/window.screen.logicalXDPI)>1,Ps=function(){var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("testPassiveEventSupport",g,t),window.removeEventListener("testPassiveEventSupport",g,t)}catch{}return e}(),As=function(){return!!document.createElement("canvas").getContext}(),pn=!!(document.createElementNS&&ba("svg").createSVGRect),Is=!!pn&&function(){var e=document.createElement("div");return e.innerHTML="<svg/>",(e.firstChild&&e.firstChild.namespaceURI)==="http://www.w3.org/2000/svg"}(),$s=!pn&&function(){try{var e=document.createElement("div");e.innerHTML='<v:shape adj="1"/>';var t=e.firstChild;return t.style.behavior="url(#default#VML)",t&&typeof t.adj=="object"}catch{return!1}}(),Bs=navigator.platform.indexOf("Mac")===0,Rs=navigator.platform.indexOf("Linux")===0;function Qe(e){return navigator.userAgent.toLowerCase().indexOf(e)>=0}var I={ie:_i,ielt9:bs,edge:xa,webkit:dn,android:wa,android23:ka,androidStock:xs,opera:cn,chrome:La,gecko:Ca,safari:ws,phantom:Ea,opera12:Ta,win:ks,ie3d:za,webkit3d:un,gecko3d:Ma,any3d:Ls,mobile:Yt,mobileWebkit:Cs,mobileWebkit3d:Es,msPointer:Sa,pointer:Pa,touch:Ts,touchNative:Aa,mobileOpera:zs,mobileGecko:Ms,retina:Ss,passiveEvents:Ps,canvas:As,svg:pn,vml:$s,inlineSvg:Is,mac:Bs,linux:Rs},Ia=I.msPointer?"MSPointerDown":"pointerdown",$a=I.msPointer?"MSPointerMove":"pointermove",Ba=I.msPointer?"MSPointerUp":"pointerup",Ra=I.msPointer?"MSPointerCancel":"pointercancel",hn={touchstart:Ia,touchmove:$a,touchend:Ba,touchcancel:Ra},Oa={touchstart:Fs,touchmove:xi,touchend:xi,touchcancel:xi},St={},Na=!1;function Os(e,t,i){return t==="touchstart"&&Ds(),Oa[t]?(i=Oa[t].bind(this,i),e.addEventListener(hn[t],i,!1),i):(console.warn("wrong event specified:",t),g)}function Ns(e,t,i){if(!hn[t]){console.warn("wrong event specified:",t);return}e.removeEventListener(hn[t],i,!1)}function js(e){St[e.pointerId]=e}function Hs(e){St[e.pointerId]&&(St[e.pointerId]=e)}function ja(e){delete St[e.pointerId]}function Ds(){Na||(document.addEventListener(Ia,js,!0),document.addEventListener($a,Hs,!0),document.addEventListener(Ba,ja,!0),document.addEventListener(Ra,ja,!0),Na=!0)}function xi(e,t){if(t.pointerType!==(t.MSPOINTER_TYPE_MOUSE||"mouse")){t.touches=[];for(var i in St)t.touches.push(St[i]);t.changedTouches=[t],e(t)}}function Fs(e,t){t.MSPOINTER_TYPE_TOUCH&&t.pointerType===t.MSPOINTER_TYPE_TOUCH&&ze(t),xi(e,t)}function Zs(e){var t={},i,n;for(n in e)i=e[n],t[n]=i&&i.bind?i.bind(e):i;return e=t,t.type="dblclick",t.detail=2,t.isTrusted=!1,t._simulated=!0,t}var Us=200;function qs(e,t){e.addEventListener("dblclick",t);var i=0,n;function l(c){if(c.detail!==1){n=c.detail;return}if(!(c.pointerType==="mouse"||c.sourceCapabilities&&!c.sourceCapabilities.firesTouchEvents)){var f=Ua(c);if(!(f.some(function(x){return x instanceof HTMLLabelElement&&x.attributes.for})&&!f.some(function(x){return x instanceof HTMLInputElement||x instanceof HTMLSelectElement}))){var b=Date.now();b-i<=Us?(n++,n===2&&t(Zs(c))):n=1,i=b}}}return e.addEventListener("click",l),{dblclick:t,simDblclick:l}}function Vs(e,t){e.removeEventListener("dblclick",t.dblclick),e.removeEventListener("click",t.simDblclick)}var mn=Li(["transform","webkitTransform","OTransform","MozTransform","msTransform"]),Xt=Li(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),Ha=Xt==="webkitTransition"||Xt==="OTransition"?Xt+"End":"transitionend";function Da(e){return typeof e=="string"?document.getElementById(e):e}function Qt(e,t){var i=e.style[t]||e.currentStyle&&e.currentStyle[t];if((!i||i==="auto")&&document.defaultView){var n=document.defaultView.getComputedStyle(e,null);i=n?n[t]:null}return i==="auto"?null:i}function Y(e,t,i){var n=document.createElement(e);return n.className=t||"",i&&i.appendChild(n),n}function ue(e){var t=e.parentNode;t&&t.removeChild(e)}function wi(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function Pt(e){var t=e.parentNode;t&&t.lastChild!==e&&t.appendChild(e)}function At(e){var t=e.parentNode;t&&t.firstChild!==e&&t.insertBefore(e,t.firstChild)}function fn(e,t){if(e.classList!==void 0)return e.classList.contains(t);var i=ki(e);return i.length>0&&new RegExp("(^|\\s)"+t+"(\\s|$)").test(i)}function Z(e,t){if(e.classList!==void 0)for(var i=z(t),n=0,l=i.length;n<l;n++)e.classList.add(i[n]);else if(!fn(e,t)){var c=ki(e);vn(e,(c?c+" ":"")+t)}}function me(e,t){e.classList!==void 0?e.classList.remove(t):vn(e,_((" "+ki(e)+" ").replace(" "+t+" "," ")))}function vn(e,t){e.className.baseVal===void 0?e.className=t:e.className.baseVal=t}function ki(e){return e.correspondingElement&&(e=e.correspondingElement),e.className.baseVal===void 0?e.className:e.className.baseVal}function Ue(e,t){"opacity"in e.style?e.style.opacity=t:"filter"in e.style&&Ws(e,t)}function Ws(e,t){var i=!1,n="DXImageTransform.Microsoft.Alpha";try{i=e.filters.item(n)}catch{if(t===1)return}t=Math.round(t*100),i?(i.Enabled=t!==100,i.Opacity=t):e.style.filter+=" progid:"+n+"(opacity="+t+")"}function Li(e){for(var t=document.documentElement.style,i=0;i<e.length;i++)if(e[i]in t)return e[i];return!1}function yt(e,t,i){var n=t||new O(0,0);e.style[mn]=(I.ie3d?"translate("+n.x+"px,"+n.y+"px)":"translate3d("+n.x+"px,"+n.y+"px,0)")+(i?" scale("+i+")":"")}function ge(e,t){e._leaflet_pos=t,I.any3d?yt(e,t):(e.style.left=t.x+"px",e.style.top=t.y+"px")}function bt(e){return e._leaflet_pos||new O(0,0)}var ei,ti,gn;if("onselectstart"in document)ei=function(){F(window,"selectstart",ze)},ti=function(){re(window,"selectstart",ze)};else{var ii=Li(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);ei=function(){if(ii){var e=document.documentElement.style;gn=e[ii],e[ii]="none"}},ti=function(){ii&&(document.documentElement.style[ii]=gn,gn=void 0)}}function yn(){F(window,"dragstart",ze)}function bn(){re(window,"dragstart",ze)}var Ci,_n;function xn(e){for(;e.tabIndex===-1;)e=e.parentNode;e.style&&(Ei(),Ci=e,_n=e.style.outlineStyle,e.style.outlineStyle="none",F(window,"keydown",Ei))}function Ei(){Ci&&(Ci.style.outlineStyle=_n,Ci=void 0,_n=void 0,re(window,"keydown",Ei))}function Fa(e){do e=e.parentNode;while((!e.offsetWidth||!e.offsetHeight)&&e!==document.body);return e}function wn(e){var t=e.getBoundingClientRect();return{x:t.width/e.offsetWidth||1,y:t.height/e.offsetHeight||1,boundingClientRect:t}}var Gs={__proto__:null,TRANSFORM:mn,TRANSITION:Xt,TRANSITION_END:Ha,get:Da,getStyle:Qt,create:Y,remove:ue,empty:wi,toFront:Pt,toBack:At,hasClass:fn,addClass:Z,removeClass:me,setClass:vn,getClass:ki,setOpacity:Ue,testProp:Li,setTransform:yt,setPosition:ge,getPosition:bt,get disableTextSelection(){return ei},get enableTextSelection(){return ti},disableImageDrag:yn,enableImageDrag:bn,preventOutline:xn,restoreOutline:Ei,getSizedParentNode:Fa,getScale:wn};function F(e,t,i,n){if(t&&typeof t=="object")for(var l in t)Ln(e,l,t[l],i);else{t=z(t);for(var c=0,f=t.length;c<f;c++)Ln(e,t[c],i,n)}return this}var et="_leaflet_events";function re(e,t,i,n){if(arguments.length===1)Za(e),delete e[et];else if(t&&typeof t=="object")for(var l in t)Cn(e,l,t[l],i);else if(t=z(t),arguments.length===2)Za(e,function(b){return we(t,b)!==-1});else for(var c=0,f=t.length;c<f;c++)Cn(e,t[c],i,n);return this}function Za(e,t){for(var i in e[et]){var n=i.split(/\d/)[0];(!t||t(n))&&Cn(e,n,null,null,i)}}var kn={mouseenter:"mouseover",mouseleave:"mouseout",wheel:!("onwheel"in window)&&"mousewheel"};function Ln(e,t,i,n){var l=t+m(i)+(n?"_"+m(n):"");if(e[et]&&e[et][l])return this;var c=function(b){return i.call(n||e,b||window.event)},f=c;!I.touchNative&&I.pointer&&t.indexOf("touch")===0?c=Os(e,t,c):I.touch&&t==="dblclick"?c=qs(e,c):"addEventListener"in e?t==="touchstart"||t==="touchmove"||t==="wheel"||t==="mousewheel"?e.addEventListener(kn[t]||t,c,I.passiveEvents?{passive:!1}:!1):t==="mouseenter"||t==="mouseleave"?(c=function(b){b=b||window.event,Tn(e,b)&&f(b)},e.addEventListener(kn[t],c,!1)):e.addEventListener(t,f,!1):e.attachEvent("on"+t,c),e[et]=e[et]||{},e[et][l]=c}function Cn(e,t,i,n,l){l=l||t+m(i)+(n?"_"+m(n):"");var c=e[et]&&e[et][l];if(!c)return this;!I.touchNative&&I.pointer&&t.indexOf("touch")===0?Ns(e,t,c):I.touch&&t==="dblclick"?Vs(e,c):"removeEventListener"in e?e.removeEventListener(kn[t]||t,c,!1):e.detachEvent("on"+t,c),e[et][l]=null}function _t(e){return e.stopPropagation?e.stopPropagation():e.originalEvent?e.originalEvent._stopped=!0:e.cancelBubble=!0,this}function En(e){return Ln(e,"wheel",_t),this}function ni(e){return F(e,"mousedown touchstart dblclick contextmenu",_t),e._leaflet_disable_click=!0,this}function ze(e){return e.preventDefault?e.preventDefault():e.returnValue=!1,this}function xt(e){return ze(e),_t(e),this}function Ua(e){if(e.composedPath)return e.composedPath();for(var t=[],i=e.target;i;)t.push(i),i=i.parentNode;return t}function qa(e,t){if(!t)return new O(e.clientX,e.clientY);var i=wn(t),n=i.boundingClientRect;return new O((e.clientX-n.left)/i.x-t.clientLeft,(e.clientY-n.top)/i.y-t.clientTop)}var Ks=I.linux&&I.chrome?window.devicePixelRatio:I.mac?window.devicePixelRatio*3:window.devicePixelRatio>0?2*window.devicePixelRatio:1;function Va(e){return I.edge?e.wheelDeltaY/2:e.deltaY&&e.deltaMode===0?-e.deltaY/Ks:e.deltaY&&e.deltaMode===1?-e.deltaY*20:e.deltaY&&e.deltaMode===2?-e.deltaY*60:e.deltaX||e.deltaZ?0:e.wheelDelta?(e.wheelDeltaY||e.wheelDelta)/2:e.detail&&Math.abs(e.detail)<32765?-e.detail*20:e.detail?e.detail/-32765*60:0}function Tn(e,t){var i=t.relatedTarget;if(!i)return!0;try{for(;i&&i!==e;)i=i.parentNode}catch{return!1}return i!==e}var Js={__proto__:null,on:F,off:re,stopPropagation:_t,disableScrollPropagation:En,disableClickPropagation:ni,preventDefault:ze,stop:xt,getPropagationPath:Ua,getMousePosition:qa,getWheelDelta:Va,isExternalTarget:Tn,addListener:F,removeListener:re},Wa=Te.extend({run:function(e,t,i,n){this.stop(),this._el=e,this._inProgress=!0,this._duration=i||.25,this._easeOutPower=1/Math.max(n||.5,.2),this._startPos=bt(e),this._offset=t.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(!0),this._complete())},_animate:function(){this._animId=Q(this._animate,this),this._step()},_step:function(e){var t=+new Date-this._startTime,i=this._duration*1e3;t<i?this._runFrame(this._easeOut(t/i),e):(this._runFrame(1),this._complete())},_runFrame:function(e,t){var i=this._startPos.add(this._offset.multiplyBy(e));t&&i._round(),ge(this._el,i),this.fire("step")},_complete:function(){he(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(e){return 1-Math.pow(1-e,this._easeOutPower)}}),G=Te.extend({options:{crs:rn,center:void 0,zoom:void 0,minZoom:void 0,maxZoom:void 0,layers:[],maxBounds:void 0,renderer:void 0,zoomAnimation:!0,zoomAnimationThreshold:4,fadeAnimation:!0,markerZoomAnimation:!0,transform3DLimit:8388608,zoomSnap:1,zoomDelta:1,trackResize:!0},initialize:function(e,t){t=C(this,t),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._sizeChanged=!0,this._initContainer(e),this._initLayout(),this._onResize=p(this._onResize,this),this._initEvents(),t.maxBounds&&this.setMaxBounds(t.maxBounds),t.zoom!==void 0&&(this._zoom=this._limitZoom(t.zoom)),t.center&&t.zoom!==void 0&&this.setView(W(t.center),t.zoom,{reset:!0}),this.callInitHooks(),this._zoomAnimated=Xt&&I.any3d&&!I.mobileOpera&&this.options.zoomAnimation,this._zoomAnimated&&(this._createAnimProxy(),F(this._proxy,Ha,this._catchTransitionEnd,this)),this._addLayers(this.options.layers)},setView:function(e,t,i){if(t=t===void 0?this._zoom:this._limitZoom(t),e=this._limitCenter(W(e),t,this.options.maxBounds),i=i||{},this._stop(),this._loaded&&!i.reset&&i!==!0){i.animate!==void 0&&(i.zoom=d({animate:i.animate},i.zoom),i.pan=d({animate:i.animate,duration:i.duration},i.pan));var n=this._zoom!==t?this._tryAnimatedZoom&&this._tryAnimatedZoom(e,t,i.zoom):this._tryAnimatedPan(e,i.pan);if(n)return clearTimeout(this._sizeTimer),this}return this._resetView(e,t,i.pan&&i.pan.noMoveStart),this},setZoom:function(e,t){return this._loaded?this.setView(this.getCenter(),e,{zoom:t}):(this._zoom=e,this)},zoomIn:function(e,t){return e=e||(I.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom+e,t)},zoomOut:function(e,t){return e=e||(I.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom-e,t)},setZoomAround:function(e,t,i){var n=this.getZoomScale(t),l=this.getSize().divideBy(2),c=e instanceof O?e:this.latLngToContainerPoint(e),f=c.subtract(l).multiplyBy(1-1/n),b=this.containerPointToLatLng(l.add(f));return this.setView(b,t,{zoom:i})},_getBoundsCenterZoom:function(e,t){t=t||{},e=e.getBounds?e.getBounds():ve(e);var i=H(t.paddingTopLeft||t.padding||[0,0]),n=H(t.paddingBottomRight||t.padding||[0,0]),l=this.getBoundsZoom(e,!1,i.add(n));if(l=typeof t.maxZoom=="number"?Math.min(t.maxZoom,l):l,l===1/0)return{center:e.getCenter(),zoom:l};var c=n.subtract(i).divideBy(2),f=this.project(e.getSouthWest(),l),b=this.project(e.getNorthEast(),l),x=this.unproject(f.add(b).divideBy(2).add(c),l);return{center:x,zoom:l}},fitBounds:function(e,t){if(e=ve(e),!e.isValid())throw new Error("Bounds are not valid.");var i=this._getBoundsCenterZoom(e,t);return this.setView(i.center,i.zoom,t)},fitWorld:function(e){return this.fitBounds([[-90,-180],[90,180]],e)},panTo:function(e,t){return this.setView(e,this._zoom,{pan:t})},panBy:function(e,t){if(e=H(e).round(),t=t||{},!e.x&&!e.y)return this.fire("moveend");if(t.animate!==!0&&!this.getSize().contains(e))return this._resetView(this.unproject(this.project(this.getCenter()).add(e)),this.getZoom()),this;if(this._panAnim||(this._panAnim=new Wa,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),t.noMoveStart||this.fire("movestart"),t.animate!==!1){Z(this._mapPane,"leaflet-pan-anim");var i=this._getMapPanePos().subtract(e).round();this._panAnim.run(this._mapPane,i,t.duration||.25,t.easeLinearity)}else this._rawPanBy(e),this.fire("move").fire("moveend");return this},flyTo:function(e,t,i){if(i=i||{},i.animate===!1||!I.any3d)return this.setView(e,t,i);this._stop();var n=this.project(this.getCenter()),l=this.project(e),c=this.getSize(),f=this._zoom;e=W(e),t=t===void 0?f:t;var b=Math.max(c.x,c.y),x=b*this.getZoomScale(f,t),E=l.distanceTo(n)||1,S=1.42,N=S*S;function q(ye){var Ni=ye?-1:1,Nr=ye?x:b,jr=x*x-b*b+Ni*N*N*E*E,Hr=2*Nr*N*E,Nn=jr/Hr,zo=Math.sqrt(Nn*Nn+1)-Nn,Dr=zo<1e-9?-18:Math.log(zo);return Dr}function Se(ye){return(Math.exp(ye)-Math.exp(-ye))/2}function Ee(ye){return(Math.exp(ye)+Math.exp(-ye))/2}function Ve(ye){return Se(ye)/Ee(ye)}var Oe=q(0);function Nt(ye){return b*(Ee(Oe)/Ee(Oe+S*ye))}function $r(ye){return b*(Ee(Oe)*Ve(Oe+S*ye)-Se(Oe))/N}function Br(ye){return 1-Math.pow(1-ye,1.5)}var Rr=Date.now(),Eo=(q(1)-Oe)/S,Or=i.duration?1e3*i.duration:1e3*Eo*.8;function To(){var ye=(Date.now()-Rr)/Or,Ni=Br(ye)*Eo;ye<=1?(this._flyToFrame=Q(To,this),this._move(this.unproject(n.add(l.subtract(n).multiplyBy($r(Ni)/E)),f),this.getScaleZoom(b/Nt(Ni),f),{flyTo:!0})):this._move(e,t)._moveEnd(!0)}return this._moveStart(!0,i.noMoveStart),To.call(this),this},flyToBounds:function(e,t){var i=this._getBoundsCenterZoom(e,t);return this.flyTo(i.center,i.zoom,t)},setMaxBounds:function(e){return e=ve(e),this.listens("moveend",this._panInsideMaxBounds)&&this.off("moveend",this._panInsideMaxBounds),e.isValid()?(this.options.maxBounds=e,this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds)):(this.options.maxBounds=null,this)},setMinZoom:function(e){var t=this.options.minZoom;return this.options.minZoom=e,this._loaded&&t!==e&&(this.fire("zoomlevelschange"),this.getZoom()<this.options.minZoom)?this.setZoom(e):this},setMaxZoom:function(e){var t=this.options.maxZoom;return this.options.maxZoom=e,this._loaded&&t!==e&&(this.fire("zoomlevelschange"),this.getZoom()>this.options.maxZoom)?this.setZoom(e):this},panInsideBounds:function(e,t){this._enforcingBounds=!0;var i=this.getCenter(),n=this._limitCenter(i,this._zoom,ve(e));return i.equals(n)||this.panTo(n,t),this._enforcingBounds=!1,this},panInside:function(e,t){t=t||{};var i=H(t.paddingTopLeft||t.padding||[0,0]),n=H(t.paddingBottomRight||t.padding||[0,0]),l=this.project(this.getCenter()),c=this.project(e),f=this.getPixelBounds(),b=Be([f.min.add(i),f.max.subtract(n)]),x=b.getSize();if(!b.contains(c)){this._enforcingBounds=!0;var E=c.subtract(b.getCenter()),S=b.extend(c).getSize().subtract(x);l.x+=E.x<0?-S.x:S.x,l.y+=E.y<0?-S.y:S.y,this.panTo(this.unproject(l),t),this._enforcingBounds=!1}return this},invalidateSize:function(e){if(!this._loaded)return this;e=d({animate:!1,pan:!0},e===!0?{animate:!0}:e);var t=this.getSize();this._sizeChanged=!0,this._lastCenter=null;var i=this.getSize(),n=t.divideBy(2).round(),l=i.divideBy(2).round(),c=n.subtract(l);return!c.x&&!c.y?this:(e.animate&&e.pan?this.panBy(c):(e.pan&&this._rawPanBy(c),this.fire("move"),e.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(p(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:t,newSize:i}))},stop:function(){return this.setZoom(this._limitZoom(this._zoom)),this.options.zoomSnap||this.fire("viewreset"),this._stop()},locate:function(e){if(e=this._locateOptions=d({timeout:1e4,watch:!1},e),!("geolocation"in navigator))return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var t=p(this._handleGeolocationResponse,this),i=p(this._handleGeolocationError,this);return e.watch?this._locationWatchId=navigator.geolocation.watchPosition(t,i,e):navigator.geolocation.getCurrentPosition(t,i,e),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(e){if(this._container._leaflet_id){var t=e.code,i=e.message||(t===1?"permission denied":t===2?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:t,message:"Geolocation error: "+i+"."})}},_handleGeolocationResponse:function(e){if(this._container._leaflet_id){var t=e.coords.latitude,i=e.coords.longitude,n=new ae(t,i),l=n.toBounds(e.coords.accuracy*2),c=this._locateOptions;if(c.setView){var f=this.getBoundsZoom(l);this.setView(n,c.maxZoom?Math.min(f,c.maxZoom):f)}var b={latlng:n,bounds:l,timestamp:e.timestamp};for(var x in e.coords)typeof e.coords[x]=="number"&&(b[x]=e.coords[x]);this.fire("locationfound",b)}},addHandler:function(e,t){if(!t)return this;var i=this[e]=new t(this);return this._handlers.push(i),this.options[e]&&i.enable(),this},remove:function(){if(this._initEvents(!0),this.options.maxBounds&&this.off("moveend",this._panInsideMaxBounds),this._containerId!==this._container._leaflet_id)throw new Error("Map container is being reused by another instance");try{delete this._container._leaflet_id,delete this._containerId}catch{this._container._leaflet_id=void 0,this._containerId=void 0}this._locationWatchId!==void 0&&this.stopLocate(),this._stop(),ue(this._mapPane),this._clearControlPos&&this._clearControlPos(),this._resizeRequest&&(he(this._resizeRequest),this._resizeRequest=null),this._clearHandlers(),this._loaded&&this.fire("unload");var e;for(e in this._layers)this._layers[e].remove();for(e in this._panes)ue(this._panes[e]);return this._layers=[],this._panes=[],delete this._mapPane,delete this._renderer,this},createPane:function(e,t){var i="leaflet-pane"+(e?" leaflet-"+e.replace("Pane","")+"-pane":""),n=Y("div",i,t||this._mapPane);return e&&(this._panes[e]=n),n},getCenter:function(){return this._checkIfLoaded(),this._lastCenter&&!this._moved()?this._lastCenter.clone():this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var e=this.getPixelBounds(),t=this.unproject(e.getBottomLeft()),i=this.unproject(e.getTopRight());return new Re(t,i)},getMinZoom:function(){return this.options.minZoom===void 0?this._layersMinZoom||0:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===void 0?this._layersMaxZoom===void 0?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(e,t,i){e=ve(e),i=H(i||[0,0]);var n=this.getZoom()||0,l=this.getMinZoom(),c=this.getMaxZoom(),f=e.getNorthWest(),b=e.getSouthEast(),x=this.getSize().subtract(i),E=Be(this.project(b,n),this.project(f,n)).getSize(),S=I.any3d?this.options.zoomSnap:1,N=x.x/E.x,q=x.y/E.y,Se=t?Math.max(N,q):Math.min(N,q);return n=this.getScaleZoom(Se,n),S&&(n=Math.round(n/(S/100))*(S/100),n=t?Math.ceil(n/S)*S:Math.floor(n/S)*S),Math.max(l,Math.min(c,n))},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new O(this._container.clientWidth||0,this._container.clientHeight||0),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(e,t){var i=this._getTopLeftPoint(e,t);return new ce(i,i.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._pixelOrigin},getPixelWorldBounds:function(e){return this.options.crs.getProjectedBounds(e===void 0?this.getZoom():e)},getPane:function(e){return typeof e=="string"?this._panes[e]:e},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(e,t){var i=this.options.crs;return t=t===void 0?this._zoom:t,i.scale(e)/i.scale(t)},getScaleZoom:function(e,t){var i=this.options.crs;t=t===void 0?this._zoom:t;var n=i.zoom(e*i.scale(t));return isNaN(n)?1/0:n},project:function(e,t){return t=t===void 0?this._zoom:t,this.options.crs.latLngToPoint(W(e),t)},unproject:function(e,t){return t=t===void 0?this._zoom:t,this.options.crs.pointToLatLng(H(e),t)},layerPointToLatLng:function(e){var t=H(e).add(this.getPixelOrigin());return this.unproject(t)},latLngToLayerPoint:function(e){var t=this.project(W(e))._round();return t._subtract(this.getPixelOrigin())},wrapLatLng:function(e){return this.options.crs.wrapLatLng(W(e))},wrapLatLngBounds:function(e){return this.options.crs.wrapLatLngBounds(ve(e))},distance:function(e,t){return this.options.crs.distance(W(e),W(t))},containerPointToLayerPoint:function(e){return H(e).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(e){return H(e).add(this._getMapPanePos())},containerPointToLatLng:function(e){var t=this.containerPointToLayerPoint(H(e));return this.layerPointToLatLng(t)},latLngToContainerPoint:function(e){return this.layerPointToContainerPoint(this.latLngToLayerPoint(W(e)))},mouseEventToContainerPoint:function(e){return qa(e,this._container)},mouseEventToLayerPoint:function(e){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e))},mouseEventToLatLng:function(e){return this.layerPointToLatLng(this.mouseEventToLayerPoint(e))},_initContainer:function(e){var t=this._container=Da(e);if(t){if(t._leaflet_id)throw new Error("Map container is already initialized.")}else throw new Error("Map container not found.");F(t,"scroll",this._onScroll,this),this._containerId=m(t)},_initLayout:function(){var e=this._container;this._fadeAnimated=this.options.fadeAnimation&&I.any3d,Z(e,"leaflet-container"+(I.touch?" leaflet-touch":"")+(I.retina?" leaflet-retina":"")+(I.ielt9?" leaflet-oldie":"")+(I.safari?" leaflet-safari":"")+(this._fadeAnimated?" leaflet-fade-anim":""));var t=Qt(e,"position");t!=="absolute"&&t!=="relative"&&t!=="fixed"&&t!=="sticky"&&(e.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var e=this._panes={};this._paneRenderers={},this._mapPane=this.createPane("mapPane",this._container),ge(this._mapPane,new O(0,0)),this.createPane("tilePane"),this.createPane("overlayPane"),this.createPane("shadowPane"),this.createPane("markerPane"),this.createPane("tooltipPane"),this.createPane("popupPane"),this.options.markerZoomAnimation||(Z(e.markerPane,"leaflet-zoom-hide"),Z(e.shadowPane,"leaflet-zoom-hide"))},_resetView:function(e,t,i){ge(this._mapPane,new O(0,0));var n=!this._loaded;this._loaded=!0,t=this._limitZoom(t),this.fire("viewprereset");var l=this._zoom!==t;this._moveStart(l,i)._move(e,t)._moveEnd(l),this.fire("viewreset"),n&&this.fire("load")},_moveStart:function(e,t){return e&&this.fire("zoomstart"),t||this.fire("movestart"),this},_move:function(e,t,i,n){t===void 0&&(t=this._zoom);var l=this._zoom!==t;return this._zoom=t,this._lastCenter=e,this._pixelOrigin=this._getNewPixelOrigin(e),n?i&&i.pinch&&this.fire("zoom",i):((l||i&&i.pinch)&&this.fire("zoom",i),this.fire("move",i)),this},_moveEnd:function(e){return e&&this.fire("zoomend"),this.fire("moveend")},_stop:function(){return he(this._flyToFrame),this._panAnim&&this._panAnim.stop(),this},_rawPanBy:function(e){ge(this._mapPane,this._getMapPanePos().subtract(e))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_panInsideMaxBounds:function(){this._enforcingBounds||this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(e){this._targets={},this._targets[m(this._container)]=this;var t=e?re:F;t(this._container,"click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup",this._handleDOMEvent,this),this.options.trackResize&&t(window,"resize",this._onResize,this),I.any3d&&this.options.transform3DLimit&&(e?this.off:this.on).call(this,"moveend",this._onMoveEnd)},_onResize:function(){he(this._resizeRequest),this._resizeRequest=Q(function(){this.invalidateSize({debounceMoveend:!0})},this)},_onScroll:function(){this._container.scrollTop=0,this._container.scrollLeft=0},_onMoveEnd:function(){var e=this._getMapPanePos();Math.max(Math.abs(e.x),Math.abs(e.y))>=this.options.transform3DLimit&&this._resetView(this.getCenter(),this.getZoom())},_findEventTargets:function(e,t){for(var i=[],n,l=t==="mouseout"||t==="mouseover",c=e.target||e.srcElement,f=!1;c;){if(n=this._targets[m(c)],n&&(t==="click"||t==="preclick")&&this._draggableMoved(n)){f=!0;break}if(n&&n.listens(t,!0)&&(l&&!Tn(c,e)||(i.push(n),l))||c===this._container)break;c=c.parentNode}return!i.length&&!f&&!l&&this.listens(t,!0)&&(i=[this]),i},_isClickDisabled:function(e){for(;e&&e!==this._container;){if(e._leaflet_disable_click)return!0;e=e.parentNode}},_handleDOMEvent:function(e){var t=e.target||e.srcElement;if(!(!this._loaded||t._leaflet_disable_events||e.type==="click"&&this._isClickDisabled(t))){var i=e.type;i==="mousedown"&&xn(t),this._fireDOMEvent(e,i)}},_mouseEvents:["click","dblclick","mouseover","mouseout","contextmenu"],_fireDOMEvent:function(e,t,i){if(e.type==="click"){var n=d({},e);n.type="preclick",this._fireDOMEvent(n,n.type,i)}var l=this._findEventTargets(e,t);if(i){for(var c=[],f=0;f<i.length;f++)i[f].listens(t,!0)&&c.push(i[f]);l=c.concat(l)}if(l.length){t==="contextmenu"&&ze(e);var b=l[0],x={originalEvent:e};if(e.type!=="keypress"&&e.type!=="keydown"&&e.type!=="keyup"){var E=b.getLatLng&&(!b._radius||b._radius<=10);x.containerPoint=E?this.latLngToContainerPoint(b.getLatLng()):this.mouseEventToContainerPoint(e),x.layerPoint=this.containerPointToLayerPoint(x.containerPoint),x.latlng=E?b.getLatLng():this.layerPointToLatLng(x.layerPoint)}for(f=0;f<l.length;f++)if(l[f].fire(t,x,!0),x.originalEvent._stopped||l[f].options.bubblingMouseEvents===!1&&we(this._mouseEvents,t)!==-1)return}},_draggableMoved:function(e){return e=e.dragging&&e.dragging.enabled()?e:this,e.dragging&&e.dragging.moved()||this.boxZoom&&this.boxZoom.moved()},_clearHandlers:function(){for(var e=0,t=this._handlers.length;e<t;e++)this._handlers[e].disable()},whenReady:function(e,t){return this._loaded?e.call(t||this,{target:this}):this.on("load",e,t),this},_getMapPanePos:function(){return bt(this._mapPane)||new O(0,0)},_moved:function(){var e=this._getMapPanePos();return e&&!e.equals([0,0])},_getTopLeftPoint:function(e,t){var i=e&&t!==void 0?this._getNewPixelOrigin(e,t):this.getPixelOrigin();return i.subtract(this._getMapPanePos())},_getNewPixelOrigin:function(e,t){var i=this.getSize()._divideBy(2);return this.project(e,t)._subtract(i)._add(this._getMapPanePos())._round()},_latLngToNewLayerPoint:function(e,t,i){var n=this._getNewPixelOrigin(i,t);return this.project(e,t)._subtract(n)},_latLngBoundsToNewLayerBounds:function(e,t,i){var n=this._getNewPixelOrigin(i,t);return Be([this.project(e.getSouthWest(),t)._subtract(n),this.project(e.getNorthWest(),t)._subtract(n),this.project(e.getSouthEast(),t)._subtract(n),this.project(e.getNorthEast(),t)._subtract(n)])},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(e){return this.latLngToLayerPoint(e).subtract(this._getCenterLayerPoint())},_limitCenter:function(e,t,i){if(!i)return e;var n=this.project(e,t),l=this.getSize().divideBy(2),c=new ce(n.subtract(l),n.add(l)),f=this._getBoundsOffset(c,i,t);return Math.abs(f.x)<=1&&Math.abs(f.y)<=1?e:this.unproject(n.add(f),t)},_limitOffset:function(e,t){if(!t)return e;var i=this.getPixelBounds(),n=new ce(i.min.add(e),i.max.add(e));return e.add(this._getBoundsOffset(n,t))},_getBoundsOffset:function(e,t,i){var n=Be(this.project(t.getNorthEast(),i),this.project(t.getSouthWest(),i)),l=n.min.subtract(e.min),c=n.max.subtract(e.max),f=this._rebound(l.x,-c.x),b=this._rebound(l.y,-c.y);return new O(f,b)},_rebound:function(e,t){return e+t>0?Math.round(e-t)/2:Math.max(0,Math.ceil(e))-Math.max(0,Math.floor(t))},_limitZoom:function(e){var t=this.getMinZoom(),i=this.getMaxZoom(),n=I.any3d?this.options.zoomSnap:1;return n&&(e=Math.round(e/n)*n),Math.max(t,Math.min(i,e))},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){me(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(e,t){var i=this._getCenterOffset(e)._trunc();return(t&&t.animate)!==!0&&!this.getSize().contains(i)?!1:(this.panBy(i,t),!0)},_createAnimProxy:function(){var e=this._proxy=Y("div","leaflet-proxy leaflet-zoom-animated");this._panes.mapPane.appendChild(e),this.on("zoomanim",function(t){var i=mn,n=this._proxy.style[i];yt(this._proxy,this.project(t.center,t.zoom),this.getZoomScale(t.zoom,1)),n===this._proxy.style[i]&&this._animatingZoom&&this._onZoomTransitionEnd()},this),this.on("load moveend",this._animMoveEnd,this),this._on("unload",this._destroyAnimProxy,this)},_destroyAnimProxy:function(){ue(this._proxy),this.off("load moveend",this._animMoveEnd,this),delete this._proxy},_animMoveEnd:function(){var e=this.getCenter(),t=this.getZoom();yt(this._proxy,this.project(e,t),this.getZoomScale(t,1))},_catchTransitionEnd:function(e){this._animatingZoom&&e.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(e,t,i){if(this._animatingZoom)return!0;if(i=i||{},!this._zoomAnimated||i.animate===!1||this._nothingToAnimate()||Math.abs(t-this._zoom)>this.options.zoomAnimationThreshold)return!1;var n=this.getZoomScale(t),l=this._getCenterOffset(e)._divideBy(1-1/n);return i.animate!==!0&&!this.getSize().contains(l)?!1:(Q(function(){this._moveStart(!0,i.noMoveStart||!1)._animateZoom(e,t,!0)},this),!0)},_animateZoom:function(e,t,i,n){this._mapPane&&(i&&(this._animatingZoom=!0,this._animateToCenter=e,this._animateToZoom=t,Z(this._mapPane,"leaflet-zoom-anim")),this.fire("zoomanim",{center:e,zoom:t,noUpdate:n}),this._tempFireZoomEvent||(this._tempFireZoomEvent=this._zoom!==this._animateToZoom),this._move(this._animateToCenter,this._animateToZoom,void 0,!0),setTimeout(p(this._onZoomTransitionEnd,this),250))},_onZoomTransitionEnd:function(){this._animatingZoom&&(this._mapPane&&me(this._mapPane,"leaflet-zoom-anim"),this._animatingZoom=!1,this._move(this._animateToCenter,this._animateToZoom,void 0,!0),this._tempFireZoomEvent&&this.fire("zoom"),delete this._tempFireZoomEvent,this.fire("move"),this._moveEnd(!0))}});function Ys(e,t){return new G(e,t)}var Ke=de.extend({options:{position:"topright"},initialize:function(e){C(this,e)},getPosition:function(){return this.options.position},setPosition:function(e){var t=this._map;return t&&t.removeControl(this),this.options.position=e,t&&t.addControl(this),this},getContainer:function(){return this._container},addTo:function(e){this.remove(),this._map=e;var t=this._container=this.onAdd(e),i=this.getPosition(),n=e._controlCorners[i];return Z(t,"leaflet-control"),i.indexOf("bottom")!==-1?n.insertBefore(t,n.firstChild):n.appendChild(t),this._map.on("unload",this.remove,this),this},remove:function(){return this._map?(ue(this._container),this.onRemove&&this.onRemove(this._map),this._map.off("unload",this.remove,this),this._map=null,this):this},_refocusOnMap:function(e){this._map&&e&&e.screenX>0&&e.screenY>0&&this._map.getContainer().focus()}}),ai=function(e){return new Ke(e)};G.include({addControl:function(e){return e.addTo(this),this},removeControl:function(e){return e.remove(),this},_initControlPos:function(){var e=this._controlCorners={},t="leaflet-",i=this._controlContainer=Y("div",t+"control-container",this._container);function n(l,c){var f=t+l+" "+t+c;e[l+c]=Y("div",f,i)}n("top","left"),n("top","right"),n("bottom","left"),n("bottom","right")},_clearControlPos:function(){for(var e in this._controlCorners)ue(this._controlCorners[e]);ue(this._controlContainer),delete this._controlCorners,delete this._controlContainer}});var Ga=Ke.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0,hideSingleBase:!1,sortLayers:!1,sortFunction:function(e,t,i,n){return i<n?-1:n<i?1:0}},initialize:function(e,t,i){C(this,i),this._layerControlInputs=[],this._layers=[],this._lastZIndex=0,this._handlingClick=!1,this._preventClick=!1;for(var n in e)this._addLayer(e[n],n);for(n in t)this._addLayer(t[n],n,!0)},onAdd:function(e){this._initLayout(),this._update(),this._map=e,e.on("zoomend",this._checkDisabledLayers,this);for(var t=0;t<this._layers.length;t++)this._layers[t].layer.on("add remove",this._onLayerChange,this);return this._container},addTo:function(e){return Ke.prototype.addTo.call(this,e),this._expandIfNotCollapsed()},onRemove:function(){this._map.off("zoomend",this._checkDisabledLayers,this);for(var e=0;e<this._layers.length;e++)this._layers[e].layer.off("add remove",this._onLayerChange,this)},addBaseLayer:function(e,t){return this._addLayer(e,t),this._map?this._update():this},addOverlay:function(e,t){return this._addLayer(e,t,!0),this._map?this._update():this},removeLayer:function(e){e.off("add remove",this._onLayerChange,this);var t=this._getLayer(m(e));return t&&this._layers.splice(this._layers.indexOf(t),1),this._map?this._update():this},expand:function(){Z(this._container,"leaflet-control-layers-expanded"),this._section.style.height=null;var e=this._map.getSize().y-(this._container.offsetTop+50);return e<this._section.clientHeight?(Z(this._section,"leaflet-control-layers-scrollbar"),this._section.style.height=e+"px"):me(this._section,"leaflet-control-layers-scrollbar"),this._checkDisabledLayers(),this},collapse:function(){return me(this._container,"leaflet-control-layers-expanded"),this},_initLayout:function(){var e="leaflet-control-layers",t=this._container=Y("div",e),i=this.options.collapsed;t.setAttribute("aria-haspopup",!0),ni(t),En(t);var n=this._section=Y("section",e+"-list");i&&(this._map.on("click",this.collapse,this),F(t,{mouseenter:this._expandSafely,mouseleave:this.collapse},this));var l=this._layersLink=Y("a",e+"-toggle",t);l.href="#",l.title="Layers",l.setAttribute("role","button"),F(l,{keydown:function(c){c.keyCode===13&&this._expandSafely()},click:function(c){ze(c),this._expandSafely()}},this),i||this.expand(),this._baseLayersList=Y("div",e+"-base",n),this._separator=Y("div",e+"-separator",n),this._overlaysList=Y("div",e+"-overlays",n),t.appendChild(n)},_getLayer:function(e){for(var t=0;t<this._layers.length;t++)if(this._layers[t]&&m(this._layers[t].layer)===e)return this._layers[t]},_addLayer:function(e,t,i){this._map&&e.on("add remove",this._onLayerChange,this),this._layers.push({layer:e,name:t,overlay:i}),this.options.sortLayers&&this._layers.sort(p(function(n,l){return this.options.sortFunction(n.layer,l.layer,n.name,l.name)},this)),this.options.autoZIndex&&e.setZIndex&&(this._lastZIndex++,e.setZIndex(this._lastZIndex)),this._expandIfNotCollapsed()},_update:function(){if(!this._container)return this;wi(this._baseLayersList),wi(this._overlaysList),this._layerControlInputs=[];var e,t,i,n,l=0;for(i=0;i<this._layers.length;i++)n=this._layers[i],this._addItem(n),t=t||n.overlay,e=e||!n.overlay,l+=n.overlay?0:1;return this.options.hideSingleBase&&(e=e&&l>1,this._baseLayersList.style.display=e?"":"none"),this._separator.style.display=t&&e?"":"none",this},_onLayerChange:function(e){this._handlingClick||this._update();var t=this._getLayer(m(e.target)),i=t.overlay?e.type==="add"?"overlayadd":"overlayremove":e.type==="add"?"baselayerchange":null;i&&this._map.fire(i,t)},_createRadioElement:function(e,t){var i='<input type="radio" class="leaflet-control-layers-selector" name="'+e+'"'+(t?' checked="checked"':"")+"/>",n=document.createElement("div");return n.innerHTML=i,n.firstChild},_addItem:function(e){var t=document.createElement("label"),i=this._map.hasLayer(e.layer),n;e.overlay?(n=document.createElement("input"),n.type="checkbox",n.className="leaflet-control-layers-selector",n.defaultChecked=i):n=this._createRadioElement("leaflet-base-layers_"+m(this),i),this._layerControlInputs.push(n),n.layerId=m(e.layer),F(n,"click",this._onInputClick,this);var l=document.createElement("span");l.innerHTML=" "+e.name;var c=document.createElement("span");t.appendChild(c),c.appendChild(n),c.appendChild(l);var f=e.overlay?this._overlaysList:this._baseLayersList;return f.appendChild(t),this._checkDisabledLayers(),t},_onInputClick:function(){if(!this._preventClick){var e=this._layerControlInputs,t,i,n=[],l=[];this._handlingClick=!0;for(var c=e.length-1;c>=0;c--)t=e[c],i=this._getLayer(t.layerId).layer,t.checked?n.push(i):t.checked||l.push(i);for(c=0;c<l.length;c++)this._map.hasLayer(l[c])&&this._map.removeLayer(l[c]);for(c=0;c<n.length;c++)this._map.hasLayer(n[c])||this._map.addLayer(n[c]);this._handlingClick=!1,this._refocusOnMap()}},_checkDisabledLayers:function(){for(var e=this._layerControlInputs,t,i,n=this._map.getZoom(),l=e.length-1;l>=0;l--)t=e[l],i=this._getLayer(t.layerId).layer,t.disabled=i.options.minZoom!==void 0&&n<i.options.minZoom||i.options.maxZoom!==void 0&&n>i.options.maxZoom},_expandIfNotCollapsed:function(){return this._map&&!this.options.collapsed&&this.expand(),this},_expandSafely:function(){var e=this._section;this._preventClick=!0,F(e,"click",ze),this.expand();var t=this;setTimeout(function(){re(e,"click",ze),t._preventClick=!1})}}),Xs=function(e,t,i){return new Ga(e,t,i)},zn=Ke.extend({options:{position:"topleft",zoomInText:'<span aria-hidden="true">+</span>',zoomInTitle:"Zoom in",zoomOutText:'<span aria-hidden="true">&#x2212;</span>',zoomOutTitle:"Zoom out"},onAdd:function(e){var t="leaflet-control-zoom",i=Y("div",t+" leaflet-bar"),n=this.options;return this._zoomInButton=this._createButton(n.zoomInText,n.zoomInTitle,t+"-in",i,this._zoomIn),this._zoomOutButton=this._createButton(n.zoomOutText,n.zoomOutTitle,t+"-out",i,this._zoomOut),this._updateDisabled(),e.on("zoomend zoomlevelschange",this._updateDisabled,this),i},onRemove:function(e){e.off("zoomend zoomlevelschange",this._updateDisabled,this)},disable:function(){return this._disabled=!0,this._updateDisabled(),this},enable:function(){return this._disabled=!1,this._updateDisabled(),this},_zoomIn:function(e){!this._disabled&&this._map._zoom<this._map.getMaxZoom()&&this._map.zoomIn(this._map.options.zoomDelta*(e.shiftKey?3:1))},_zoomOut:function(e){!this._disabled&&this._map._zoom>this._map.getMinZoom()&&this._map.zoomOut(this._map.options.zoomDelta*(e.shiftKey?3:1))},_createButton:function(e,t,i,n,l){var c=Y("a",i,n);return c.innerHTML=e,c.href="#",c.title=t,c.setAttribute("role","button"),c.setAttribute("aria-label",t),ni(c),F(c,"click",xt),F(c,"click",l,this),F(c,"click",this._refocusOnMap,this),c},_updateDisabled:function(){var e=this._map,t="leaflet-disabled";me(this._zoomInButton,t),me(this._zoomOutButton,t),this._zoomInButton.setAttribute("aria-disabled","false"),this._zoomOutButton.setAttribute("aria-disabled","false"),(this._disabled||e._zoom===e.getMinZoom())&&(Z(this._zoomOutButton,t),this._zoomOutButton.setAttribute("aria-disabled","true")),(this._disabled||e._zoom===e.getMaxZoom())&&(Z(this._zoomInButton,t),this._zoomInButton.setAttribute("aria-disabled","true"))}});G.mergeOptions({zoomControl:!0}),G.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new zn,this.addControl(this.zoomControl))});var Qs=function(e){return new zn(e)},Ka=Ke.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0},onAdd:function(e){var t="leaflet-control-scale",i=Y("div",t),n=this.options;return this._addScales(n,t+"-line",i),e.on(n.updateWhenIdle?"moveend":"move",this._update,this),e.whenReady(this._update,this),i},onRemove:function(e){e.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(e,t,i){e.metric&&(this._mScale=Y("div",t,i)),e.imperial&&(this._iScale=Y("div",t,i))},_update:function(){var e=this._map,t=e.getSize().y/2,i=e.distance(e.containerPointToLatLng([0,t]),e.containerPointToLatLng([this.options.maxWidth,t]));this._updateScales(i)},_updateScales:function(e){this.options.metric&&e&&this._updateMetric(e),this.options.imperial&&e&&this._updateImperial(e)},_updateMetric:function(e){var t=this._getRoundNum(e),i=t<1e3?t+" m":t/1e3+" km";this._updateScale(this._mScale,i,t/e)},_updateImperial:function(e){var t=e*3.2808399,i,n,l;t>5280?(i=t/5280,n=this._getRoundNum(i),this._updateScale(this._iScale,n+" mi",n/i)):(l=this._getRoundNum(t),this._updateScale(this._iScale,l+" ft",l/t))},_updateScale:function(e,t,i){e.style.width=Math.round(this.options.maxWidth*i)+"px",e.innerHTML=t},_getRoundNum:function(e){var t=Math.pow(10,(Math.floor(e)+"").length-1),i=e/t;return i=i>=10?10:i>=5?5:i>=3?3:i>=2?2:1,t*i}}),er=function(e){return new Ka(e)},tr='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>',Mn=Ke.extend({options:{position:"bottomright",prefix:'<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">'+(I.inlineSvg?tr+" ":"")+"Leaflet</a>"},initialize:function(e){C(this,e),this._attributions={}},onAdd:function(e){e.attributionControl=this,this._container=Y("div","leaflet-control-attribution"),ni(this._container);for(var t in e._layers)e._layers[t].getAttribution&&this.addAttribution(e._layers[t].getAttribution());return this._update(),e.on("layeradd",this._addAttribution,this),this._container},onRemove:function(e){e.off("layeradd",this._addAttribution,this)},_addAttribution:function(e){e.layer.getAttribution&&(this.addAttribution(e.layer.getAttribution()),e.layer.once("remove",function(){this.removeAttribution(e.layer.getAttribution())},this))},setPrefix:function(e){return this.options.prefix=e,this._update(),this},addAttribution:function(e){return e?(this._attributions[e]||(this._attributions[e]=0),this._attributions[e]++,this._update(),this):this},removeAttribution:function(e){return e?(this._attributions[e]&&(this._attributions[e]--,this._update()),this):this},_update:function(){if(this._map){var e=[];for(var t in this._attributions)this._attributions[t]&&e.push(t);var i=[];this.options.prefix&&i.push(this.options.prefix),e.length&&i.push(e.join(", ")),this._container.innerHTML=i.join(' <span aria-hidden="true">|</span> ')}}});G.mergeOptions({attributionControl:!0}),G.addInitHook(function(){this.options.attributionControl&&new Mn().addTo(this)});var ir=function(e){return new Mn(e)};Ke.Layers=Ga,Ke.Zoom=zn,Ke.Scale=Ka,Ke.Attribution=Mn,ai.layers=Xs,ai.zoom=Qs,ai.scale=er,ai.attribution=ir;var tt=de.extend({initialize:function(e){this._map=e},enable:function(){return this._enabled?this:(this._enabled=!0,this.addHooks(),this)},disable:function(){return this._enabled?(this._enabled=!1,this.removeHooks(),this):this},enabled:function(){return!!this._enabled}});tt.addTo=function(e,t){return e.addHandler(t,this),this};var nr={Events:J},Ja=I.touch?"touchstart mousedown":"mousedown",pt=Te.extend({options:{clickTolerance:3},initialize:function(e,t,i,n){C(this,n),this._element=e,this._dragStartTarget=t||e,this._preventOutline=i},enable:function(){this._enabled||(F(this._dragStartTarget,Ja,this._onDown,this),this._enabled=!0)},disable:function(){this._enabled&&(pt._dragging===this&&this.finishDrag(!0),re(this._dragStartTarget,Ja,this._onDown,this),this._enabled=!1,this._moved=!1)},_onDown:function(e){if(this._enabled&&(this._moved=!1,!fn(this._element,"leaflet-zoom-anim"))){if(e.touches&&e.touches.length!==1){pt._dragging===this&&this.finishDrag();return}if(!(pt._dragging||e.shiftKey||e.which!==1&&e.button!==1&&!e.touches)&&(pt._dragging=this,this._preventOutline&&xn(this._element),yn(),ei(),!this._moving)){this.fire("down");var t=e.touches?e.touches[0]:e,i=Fa(this._element);this._startPoint=new O(t.clientX,t.clientY),this._startPos=bt(this._element),this._parentScale=wn(i);var n=e.type==="mousedown";F(document,n?"mousemove":"touchmove",this._onMove,this),F(document,n?"mouseup":"touchend touchcancel",this._onUp,this)}}},_onMove:function(e){if(this._enabled){if(e.touches&&e.touches.length>1){this._moved=!0;return}var t=e.touches&&e.touches.length===1?e.touches[0]:e,i=new O(t.clientX,t.clientY)._subtract(this._startPoint);!i.x&&!i.y||Math.abs(i.x)+Math.abs(i.y)<this.options.clickTolerance||(i.x/=this._parentScale.x,i.y/=this._parentScale.y,ze(e),this._moved||(this.fire("dragstart"),this._moved=!0,Z(document.body,"leaflet-dragging"),this._lastTarget=e.target||e.srcElement,window.SVGElementInstance&&this._lastTarget instanceof window.SVGElementInstance&&(this._lastTarget=this._lastTarget.correspondingUseElement),Z(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(i),this._moving=!0,this._lastEvent=e,this._updatePosition())}},_updatePosition:function(){var e={originalEvent:this._lastEvent};this.fire("predrag",e),ge(this._element,this._newPos),this.fire("drag",e)},_onUp:function(){this._enabled&&this.finishDrag()},finishDrag:function(e){me(document.body,"leaflet-dragging"),this._lastTarget&&(me(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null),re(document,"mousemove touchmove",this._onMove,this),re(document,"mouseup touchend touchcancel",this._onUp,this),bn(),ti();var t=this._moved&&this._moving;this._moving=!1,pt._dragging=!1,t&&this.fire("dragend",{noInertia:e,distance:this._newPos.distanceTo(this._startPos)})}});function Ya(e,t,i){var n,l=[1,4,2,8],c,f,b,x,E,S,N,q;for(c=0,S=e.length;c<S;c++)e[c]._code=wt(e[c],t);for(b=0;b<4;b++){for(N=l[b],n=[],c=0,S=e.length,f=S-1;c<S;f=c++)x=e[c],E=e[f],x._code&N?E._code&N||(q=Ti(E,x,N,t,i),q._code=wt(q,t),n.push(q)):(E._code&N&&(q=Ti(E,x,N,t,i),q._code=wt(q,t),n.push(q)),n.push(x));e=n}return e}function Xa(e,t){var i,n,l,c,f,b,x,E,S;if(!e||e.length===0)throw new Error("latlngs not passed");qe(e)||(console.warn("latlngs are not flat! Only the first ring will be used"),e=e[0]);var N=W([0,0]),q=ve(e),Se=q.getNorthWest().distanceTo(q.getSouthWest())*q.getNorthEast().distanceTo(q.getNorthWest());Se<1700&&(N=Sn(e));var Ee=e.length,Ve=[];for(i=0;i<Ee;i++){var Oe=W(e[i]);Ve.push(t.project(W([Oe.lat-N.lat,Oe.lng-N.lng])))}for(b=x=E=0,i=0,n=Ee-1;i<Ee;n=i++)l=Ve[i],c=Ve[n],f=l.y*c.x-c.y*l.x,x+=(l.x+c.x)*f,E+=(l.y+c.y)*f,b+=f*3;b===0?S=Ve[0]:S=[x/b,E/b];var Nt=t.unproject(H(S));return W([Nt.lat+N.lat,Nt.lng+N.lng])}function Sn(e){for(var t=0,i=0,n=0,l=0;l<e.length;l++){var c=W(e[l]);t+=c.lat,i+=c.lng,n++}return W([t/n,i/n])}var ar={__proto__:null,clipPolygon:Ya,polygonCenter:Xa,centroid:Sn};function Qa(e,t){if(!t||!e.length)return e.slice();var i=t*t;return e=rr(e,i),e=sr(e,i),e}function eo(e,t,i){return Math.sqrt(oi(e,t,i,!0))}function or(e,t,i){return oi(e,t,i)}function sr(e,t){var i=e.length,n=typeof Uint8Array<"u"?Uint8Array:Array,l=new n(i);l[0]=l[i-1]=1,Pn(e,l,t,0,i-1);var c,f=[];for(c=0;c<i;c++)l[c]&&f.push(e[c]);return f}function Pn(e,t,i,n,l){var c=0,f,b,x;for(b=n+1;b<=l-1;b++)x=oi(e[b],e[n],e[l],!0),x>c&&(f=b,c=x);c>i&&(t[f]=1,Pn(e,t,i,n,f),Pn(e,t,i,f,l))}function rr(e,t){for(var i=[e[0]],n=1,l=0,c=e.length;n<c;n++)lr(e[n],e[l])>t&&(i.push(e[n]),l=n);return l<c-1&&i.push(e[c-1]),i}var to;function io(e,t,i,n,l){var c=n?to:wt(e,i),f=wt(t,i),b,x,E;for(to=f;;){if(!(c|f))return[e,t];if(c&f)return!1;b=c||f,x=Ti(e,t,b,i,l),E=wt(x,i),b===c?(e=x,c=E):(t=x,f=E)}}function Ti(e,t,i,n,l){var c=t.x-e.x,f=t.y-e.y,b=n.min,x=n.max,E,S;return i&8?(E=e.x+c*(x.y-e.y)/f,S=x.y):i&4?(E=e.x+c*(b.y-e.y)/f,S=b.y):i&2?(E=x.x,S=e.y+f*(x.x-e.x)/c):i&1&&(E=b.x,S=e.y+f*(b.x-e.x)/c),new O(E,S,l)}function wt(e,t){var i=0;return e.x<t.min.x?i|=1:e.x>t.max.x&&(i|=2),e.y<t.min.y?i|=4:e.y>t.max.y&&(i|=8),i}function lr(e,t){var i=t.x-e.x,n=t.y-e.y;return i*i+n*n}function oi(e,t,i,n){var l=t.x,c=t.y,f=i.x-l,b=i.y-c,x=f*f+b*b,E;return x>0&&(E=((e.x-l)*f+(e.y-c)*b)/x,E>1?(l=i.x,c=i.y):E>0&&(l+=f*E,c+=b*E)),f=e.x-l,b=e.y-c,n?f*f+b*b:new O(l,c)}function qe(e){return!ne(e[0])||typeof e[0][0]!="object"&&typeof e[0][0]<"u"}function no(e){return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."),qe(e)}function ao(e,t){var i,n,l,c,f,b,x,E;if(!e||e.length===0)throw new Error("latlngs not passed");qe(e)||(console.warn("latlngs are not flat! Only the first ring will be used"),e=e[0]);var S=W([0,0]),N=ve(e),q=N.getNorthWest().distanceTo(N.getSouthWest())*N.getNorthEast().distanceTo(N.getNorthWest());q<1700&&(S=Sn(e));var Se=e.length,Ee=[];for(i=0;i<Se;i++){var Ve=W(e[i]);Ee.push(t.project(W([Ve.lat-S.lat,Ve.lng-S.lng])))}for(i=0,n=0;i<Se-1;i++)n+=Ee[i].distanceTo(Ee[i+1])/2;if(n===0)E=Ee[0];else for(i=0,c=0;i<Se-1;i++)if(f=Ee[i],b=Ee[i+1],l=f.distanceTo(b),c+=l,c>n){x=(c-n)/l,E=[b.x-x*(b.x-f.x),b.y-x*(b.y-f.y)];break}var Oe=t.unproject(H(E));return W([Oe.lat+S.lat,Oe.lng+S.lng])}var dr={__proto__:null,simplify:Qa,pointToSegmentDistance:eo,closestPointOnSegment:or,clipSegment:io,_getEdgeIntersection:Ti,_getBitCode:wt,_sqClosestPointOnSegment:oi,isFlat:qe,_flat:no,polylineCenter:ao},An={project:function(e){return new O(e.lng,e.lat)},unproject:function(e){return new ae(e.y,e.x)},bounds:new ce([-180,-90],[180,90])},In={R:6378137,R_MINOR:6356752314245179e-9,bounds:new ce([-2003750834279e-5,-1549657073972e-5],[2003750834279e-5,1876465623138e-5]),project:function(e){var t=Math.PI/180,i=this.R,n=e.lat*t,l=this.R_MINOR/i,c=Math.sqrt(1-l*l),f=c*Math.sin(n),b=Math.tan(Math.PI/4-n/2)/Math.pow((1-f)/(1+f),c/2);return n=-i*Math.log(Math.max(b,1e-10)),new O(e.lng*t*i,n)},unproject:function(e){for(var t=180/Math.PI,i=this.R,n=this.R_MINOR/i,l=Math.sqrt(1-n*n),c=Math.exp(-e.y/i),f=Math.PI/2-2*Math.atan(c),b=0,x=.1,E;b<15&&Math.abs(x)>1e-7;b++)E=l*Math.sin(f),E=Math.pow((1-E)/(1+E),l/2),x=Math.PI/2-2*Math.atan(c*E)-f,f+=x;return new ae(f*t,e.x*t/i)}},cr={__proto__:null,LonLat:An,Mercator:In,SphericalMercator:on},ur=d({},ut,{code:"EPSG:3395",projection:In,transformation:function(){var e=.5/(Math.PI*In.R);return Jt(e,.5,-e,.5)}()}),oo=d({},ut,{code:"EPSG:4326",projection:An,transformation:Jt(1/180,1,-1/180,.5)}),pr=d({},st,{projection:An,transformation:Jt(1,0,-1,0),scale:function(e){return Math.pow(2,e)},zoom:function(e){return Math.log(e)/Math.LN2},distance:function(e,t){var i=t.lng-e.lng,n=t.lat-e.lat;return Math.sqrt(i*i+n*n)},infinite:!0});st.Earth=ut,st.EPSG3395=ur,st.EPSG3857=rn,st.EPSG900913=ys,st.EPSG4326=oo,st.Simple=pr;var Je=Te.extend({options:{pane:"overlayPane",attribution:null,bubblingMouseEvents:!0},addTo:function(e){return e.addLayer(this),this},remove:function(){return this.removeFrom(this._map||this._mapToAdd)},removeFrom:function(e){return e&&e.removeLayer(this),this},getPane:function(e){return this._map.getPane(e?this.options[e]||e:this.options.pane)},addInteractiveTarget:function(e){return this._map._targets[m(e)]=this,this},removeInteractiveTarget:function(e){return delete this._map._targets[m(e)],this},getAttribution:function(){return this.options.attribution},_layerAdd:function(e){var t=e.target;if(t.hasLayer(this)){if(this._map=t,this._zoomAnimated=t._zoomAnimated,this.getEvents){var i=this.getEvents();t.on(i,this),this.once("remove",function(){t.off(i,this)},this)}this.onAdd(t),this.fire("add"),t.fire("layeradd",{layer:this})}}});G.include({addLayer:function(e){if(!e._layerAdd)throw new Error("The provided object is not a Layer.");var t=m(e);return this._layers[t]?this:(this._layers[t]=e,e._mapToAdd=this,e.beforeAdd&&e.beforeAdd(this),this.whenReady(e._layerAdd,e),this)},removeLayer:function(e){var t=m(e);return this._layers[t]?(this._loaded&&e.onRemove(this),delete this._layers[t],this._loaded&&(this.fire("layerremove",{layer:e}),e.fire("remove")),e._map=e._mapToAdd=null,this):this},hasLayer:function(e){return m(e)in this._layers},eachLayer:function(e,t){for(var i in this._layers)e.call(t,this._layers[i]);return this},_addLayers:function(e){e=e?ne(e)?e:[e]:[];for(var t=0,i=e.length;t<i;t++)this.addLayer(e[t])},_addZoomLimit:function(e){(!isNaN(e.options.maxZoom)||!isNaN(e.options.minZoom))&&(this._zoomBoundLayers[m(e)]=e,this._updateZoomLevels())},_removeZoomLimit:function(e){var t=m(e);this._zoomBoundLayers[t]&&(delete this._zoomBoundLayers[t],this._updateZoomLevels())},_updateZoomLevels:function(){var e=1/0,t=-1/0,i=this._getZoomSpan();for(var n in this._zoomBoundLayers){var l=this._zoomBoundLayers[n].options;e=l.minZoom===void 0?e:Math.min(e,l.minZoom),t=l.maxZoom===void 0?t:Math.max(t,l.maxZoom)}this._layersMaxZoom=t===-1/0?void 0:t,this._layersMinZoom=e===1/0?void 0:e,i!==this._getZoomSpan()&&this.fire("zoomlevelschange"),this.options.maxZoom===void 0&&this._layersMaxZoom&&this.getZoom()>this._layersMaxZoom&&this.setZoom(this._layersMaxZoom),this.options.minZoom===void 0&&this._layersMinZoom&&this.getZoom()<this._layersMinZoom&&this.setZoom(this._layersMinZoom)}});var It=Je.extend({initialize:function(e,t){C(this,t),this._layers={};var i,n;if(e)for(i=0,n=e.length;i<n;i++)this.addLayer(e[i])},addLayer:function(e){var t=this.getLayerId(e);return this._layers[t]=e,this._map&&this._map.addLayer(e),this},removeLayer:function(e){var t=e in this._layers?e:this.getLayerId(e);return this._map&&this._layers[t]&&this._map.removeLayer(this._layers[t]),delete this._layers[t],this},hasLayer:function(e){var t=typeof e=="number"?e:this.getLayerId(e);return t in this._layers},clearLayers:function(){return this.eachLayer(this.removeLayer,this)},invoke:function(e){var t=Array.prototype.slice.call(arguments,1),i,n;for(i in this._layers)n=this._layers[i],n[e]&&n[e].apply(n,t);return this},onAdd:function(e){this.eachLayer(e.addLayer,e)},onRemove:function(e){this.eachLayer(e.removeLayer,e)},eachLayer:function(e,t){for(var i in this._layers)e.call(t,this._layers[i]);return this},getLayer:function(e){return this._layers[e]},getLayers:function(){var e=[];return this.eachLayer(e.push,e),e},setZIndex:function(e){return this.invoke("setZIndex",e)},getLayerId:function(e){return m(e)}}),hr=function(e,t){return new It(e,t)},rt=It.extend({addLayer:function(e){return this.hasLayer(e)?this:(e.addEventParent(this),It.prototype.addLayer.call(this,e),this.fire("layeradd",{layer:e}))},removeLayer:function(e){return this.hasLayer(e)?(e in this._layers&&(e=this._layers[e]),e.removeEventParent(this),It.prototype.removeLayer.call(this,e),this.fire("layerremove",{layer:e})):this},setStyle:function(e){return this.invoke("setStyle",e)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var e=new Re;for(var t in this._layers){var i=this._layers[t];e.extend(i.getBounds?i.getBounds():i.getLatLng())}return e}}),mr=function(e,t){return new rt(e,t)},$t=de.extend({options:{popupAnchor:[0,0],tooltipAnchor:[0,0],crossOrigin:!1},initialize:function(e){C(this,e)},createIcon:function(e){return this._createIcon("icon",e)},createShadow:function(e){return this._createIcon("shadow",e)},_createIcon:function(e,t){var i=this._getIconUrl(e);if(!i){if(e==="icon")throw new Error("iconUrl not set in Icon options (see the docs).");return null}var n=this._createImg(i,t&&t.tagName==="IMG"?t:null);return this._setIconStyles(n,e),(this.options.crossOrigin||this.options.crossOrigin==="")&&(n.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),n},_setIconStyles:function(e,t){var i=this.options,n=i[t+"Size"];typeof n=="number"&&(n=[n,n]);var l=H(n),c=H(t==="shadow"&&i.shadowAnchor||i.iconAnchor||l&&l.divideBy(2,!0));e.className="leaflet-marker-"+t+" "+(i.className||""),c&&(e.style.marginLeft=-c.x+"px",e.style.marginTop=-c.y+"px"),l&&(e.style.width=l.x+"px",e.style.height=l.y+"px")},_createImg:function(e,t){return t=t||document.createElement("img"),t.src=e,t},_getIconUrl:function(e){return I.retina&&this.options[e+"RetinaUrl"]||this.options[e+"Url"]}});function fr(e){return new $t(e)}var si=$t.extend({options:{iconUrl:"marker-icon.png",iconRetinaUrl:"marker-icon-2x.png",shadowUrl:"marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],tooltipAnchor:[16,-28],shadowSize:[41,41]},_getIconUrl:function(e){return typeof si.imagePath!="string"&&(si.imagePath=this._detectIconPath()),(this.options.imagePath||si.imagePath)+$t.prototype._getIconUrl.call(this,e)},_stripUrl:function(e){var t=function(i,n,l){var c=n.exec(i);return c&&c[l]};return e=t(e,/^url\((['"])?(.+)\1\)$/,2),e&&t(e,/^(.*)marker-icon\.png$/,1)},_detectIconPath:function(){var e=Y("div","leaflet-default-icon-path",document.body),t=Qt(e,"background-image")||Qt(e,"backgroundImage");if(document.body.removeChild(e),t=this._stripUrl(t),t)return t;var i=document.querySelector('link[href$="leaflet.css"]');return i?i.href.substring(0,i.href.length-11-1):""}}),so=tt.extend({initialize:function(e){this._marker=e},addHooks:function(){var e=this._marker._icon;this._draggable||(this._draggable=new pt(e,e,!0)),this._draggable.on({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).enable(),Z(e,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).disable(),this._marker._icon&&me(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_adjustPan:function(e){var t=this._marker,i=t._map,n=this._marker.options.autoPanSpeed,l=this._marker.options.autoPanPadding,c=bt(t._icon),f=i.getPixelBounds(),b=i.getPixelOrigin(),x=Be(f.min._subtract(b).add(l),f.max._subtract(b).subtract(l));if(!x.contains(c)){var E=H((Math.max(x.max.x,c.x)-x.max.x)/(f.max.x-x.max.x)-(Math.min(x.min.x,c.x)-x.min.x)/(f.min.x-x.min.x),(Math.max(x.max.y,c.y)-x.max.y)/(f.max.y-x.max.y)-(Math.min(x.min.y,c.y)-x.min.y)/(f.min.y-x.min.y)).multiplyBy(n);i.panBy(E,{animate:!1}),this._draggable._newPos._add(E),this._draggable._startPos._add(E),ge(t._icon,this._draggable._newPos),this._onDrag(e),this._panRequest=Q(this._adjustPan.bind(this,e))}},_onDragStart:function(){this._oldLatLng=this._marker.getLatLng(),this._marker.closePopup&&this._marker.closePopup(),this._marker.fire("movestart").fire("dragstart")},_onPreDrag:function(e){this._marker.options.autoPan&&(he(this._panRequest),this._panRequest=Q(this._adjustPan.bind(this,e)))},_onDrag:function(e){var t=this._marker,i=t._shadow,n=bt(t._icon),l=t._map.layerPointToLatLng(n);i&&ge(i,n),t._latlng=l,e.latlng=l,e.oldLatLng=this._oldLatLng,t.fire("move",e).fire("drag",e)},_onDragEnd:function(e){he(this._panRequest),delete this._oldLatLng,this._marker.fire("moveend").fire("dragend",e)}}),zi=Je.extend({options:{icon:new si,interactive:!0,keyboard:!0,title:"",alt:"Marker",zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250,pane:"markerPane",shadowPane:"shadowPane",bubblingMouseEvents:!1,autoPanOnFocus:!0,draggable:!1,autoPan:!1,autoPanPadding:[50,50],autoPanSpeed:10},initialize:function(e,t){C(this,t),this._latlng=W(e)},onAdd:function(e){this._zoomAnimated=this._zoomAnimated&&e.options.markerZoomAnimation,this._zoomAnimated&&e.on("zoomanim",this._animateZoom,this),this._initIcon(),this.update()},onRemove:function(e){this.dragging&&this.dragging.enabled()&&(this.options.draggable=!0,this.dragging.removeHooks()),delete this.dragging,this._zoomAnimated&&e.off("zoomanim",this._animateZoom,this),this._removeIcon(),this._removeShadow()},getEvents:function(){return{zoom:this.update,viewreset:this.update}},getLatLng:function(){return this._latlng},setLatLng:function(e){var t=this._latlng;return this._latlng=W(e),this.update(),this.fire("move",{oldLatLng:t,latlng:this._latlng})},setZIndexOffset:function(e){return this.options.zIndexOffset=e,this.update()},getIcon:function(){return this.options.icon},setIcon:function(e){return this.options.icon=e,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup,this._popup.options),this},getElement:function(){return this._icon},update:function(){if(this._icon&&this._map){var e=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(e)}return this},_initIcon:function(){var e=this.options,t="leaflet-zoom-"+(this._zoomAnimated?"animated":"hide"),i=e.icon.createIcon(this._icon),n=!1;i!==this._icon&&(this._icon&&this._removeIcon(),n=!0,e.title&&(i.title=e.title),i.tagName==="IMG"&&(i.alt=e.alt||"")),Z(i,t),e.keyboard&&(i.tabIndex="0",i.setAttribute("role","button")),this._icon=i,e.riseOnHover&&this.on({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&F(i,"focus",this._panOnFocus,this);var l=e.icon.createShadow(this._shadow),c=!1;l!==this._shadow&&(this._removeShadow(),c=!0),l&&(Z(l,t),l.alt=""),this._shadow=l,e.opacity<1&&this._updateOpacity(),n&&this.getPane().appendChild(this._icon),this._initInteraction(),l&&c&&this.getPane(e.shadowPane).appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&this.off({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&re(this._icon,"focus",this._panOnFocus,this),ue(this._icon),this.removeInteractiveTarget(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&ue(this._shadow),this._shadow=null},_setPos:function(e){this._icon&&ge(this._icon,e),this._shadow&&ge(this._shadow,e),this._zIndex=e.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(e){this._icon&&(this._icon.style.zIndex=this._zIndex+e)},_animateZoom:function(e){var t=this._map._latLngToNewLayerPoint(this._latlng,e.zoom,e.center).round();this._setPos(t)},_initInteraction:function(){if(this.options.interactive&&(Z(this._icon,"leaflet-interactive"),this.addInteractiveTarget(this._icon),so)){var e=this.options.draggable;this.dragging&&(e=this.dragging.enabled(),this.dragging.disable()),this.dragging=new so(this),e&&this.dragging.enable()}},setOpacity:function(e){return this.options.opacity=e,this._map&&this._updateOpacity(),this},_updateOpacity:function(){var e=this.options.opacity;this._icon&&Ue(this._icon,e),this._shadow&&Ue(this._shadow,e)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)},_panOnFocus:function(){var e=this._map;if(e){var t=this.options.icon.options,i=t.iconSize?H(t.iconSize):H(0,0),n=t.iconAnchor?H(t.iconAnchor):H(0,0);e.panInside(this._latlng,{paddingTopLeft:n,paddingBottomRight:i.subtract(n)})}},_getPopupAnchor:function(){return this.options.icon.options.popupAnchor},_getTooltipAnchor:function(){return this.options.icon.options.tooltipAnchor}});function vr(e,t){return new zi(e,t)}var ht=Je.extend({options:{stroke:!0,color:"#3388ff",weight:3,opacity:1,lineCap:"round",lineJoin:"round",dashArray:null,dashOffset:null,fill:!1,fillColor:null,fillOpacity:.2,fillRule:"evenodd",interactive:!0,bubblingMouseEvents:!0},beforeAdd:function(e){this._renderer=e.getRenderer(this)},onAdd:function(){this._renderer._initPath(this),this._reset(),this._renderer._addPath(this)},onRemove:function(){this._renderer._removePath(this)},redraw:function(){return this._map&&this._renderer._updatePath(this),this},setStyle:function(e){return C(this,e),this._renderer&&(this._renderer._updateStyle(this),this.options.stroke&&e&&Object.prototype.hasOwnProperty.call(e,"weight")&&this._updateBounds()),this},bringToFront:function(){return this._renderer&&this._renderer._bringToFront(this),this},bringToBack:function(){return this._renderer&&this._renderer._bringToBack(this),this},getElement:function(){return this._path},_reset:function(){this._project(),this._update()},_clickTolerance:function(){return(this.options.stroke?this.options.weight/2:0)+(this._renderer.options.tolerance||0)}}),Mi=ht.extend({options:{fill:!0,radius:10},initialize:function(e,t){C(this,t),this._latlng=W(e),this._radius=this.options.radius},setLatLng:function(e){var t=this._latlng;return this._latlng=W(e),this.redraw(),this.fire("move",{oldLatLng:t,latlng:this._latlng})},getLatLng:function(){return this._latlng},setRadius:function(e){return this.options.radius=this._radius=e,this.redraw()},getRadius:function(){return this._radius},setStyle:function(e){var t=e&&e.radius||this._radius;return ht.prototype.setStyle.call(this,e),this.setRadius(t),this},_project:function(){this._point=this._map.latLngToLayerPoint(this._latlng),this._updateBounds()},_updateBounds:function(){var e=this._radius,t=this._radiusY||e,i=this._clickTolerance(),n=[e+i,t+i];this._pxBounds=new ce(this._point.subtract(n),this._point.add(n))},_update:function(){this._map&&this._updatePath()},_updatePath:function(){this._renderer._updateCircle(this)},_empty:function(){return this._radius&&!this._renderer._bounds.intersects(this._pxBounds)},_containsPoint:function(e){return e.distanceTo(this._point)<=this._radius+this._clickTolerance()}});function gr(e,t){return new Mi(e,t)}var $n=Mi.extend({initialize:function(e,t,i){if(typeof t=="number"&&(t=d({},i,{radius:t})),C(this,t),this._latlng=W(e),isNaN(this.options.radius))throw new Error("Circle radius cannot be NaN");this._mRadius=this.options.radius},setRadius:function(e){return this._mRadius=e,this.redraw()},getRadius:function(){return this._mRadius},getBounds:function(){var e=[this._radius,this._radiusY||this._radius];return new Re(this._map.layerPointToLatLng(this._point.subtract(e)),this._map.layerPointToLatLng(this._point.add(e)))},setStyle:ht.prototype.setStyle,_project:function(){var e=this._latlng.lng,t=this._latlng.lat,i=this._map,n=i.options.crs;if(n.distance===ut.distance){var l=Math.PI/180,c=this._mRadius/ut.R/l,f=i.project([t+c,e]),b=i.project([t-c,e]),x=f.add(b).divideBy(2),E=i.unproject(x).lat,S=Math.acos((Math.cos(c*l)-Math.sin(t*l)*Math.sin(E*l))/(Math.cos(t*l)*Math.cos(E*l)))/l;(isNaN(S)||S===0)&&(S=c/Math.cos(Math.PI/180*t)),this._point=x.subtract(i.getPixelOrigin()),this._radius=isNaN(S)?0:x.x-i.project([E,e-S]).x,this._radiusY=x.y-f.y}else{var N=n.unproject(n.project(this._latlng).subtract([this._mRadius,0]));this._point=i.latLngToLayerPoint(this._latlng),this._radius=this._point.x-i.latLngToLayerPoint(N).x}this._updateBounds()}});function yr(e,t,i){return new $n(e,t,i)}var lt=ht.extend({options:{smoothFactor:1,noClip:!1},initialize:function(e,t){C(this,t),this._setLatLngs(e)},getLatLngs:function(){return this._latlngs},setLatLngs:function(e){return this._setLatLngs(e),this.redraw()},isEmpty:function(){return!this._latlngs.length},closestLayerPoint:function(e){for(var t=1/0,i=null,n=oi,l,c,f=0,b=this._parts.length;f<b;f++)for(var x=this._parts[f],E=1,S=x.length;E<S;E++){l=x[E-1],c=x[E];var N=n(e,l,c,!0);N<t&&(t=N,i=n(e,l,c))}return i&&(i.distance=Math.sqrt(t)),i},getCenter:function(){if(!this._map)throw new Error("Must add layer to map before using getCenter()");return ao(this._defaultShape(),this._map.options.crs)},getBounds:function(){return this._bounds},addLatLng:function(e,t){return t=t||this._defaultShape(),e=W(e),t.push(e),this._bounds.extend(e),this.redraw()},_setLatLngs:function(e){this._bounds=new Re,this._latlngs=this._convertLatLngs(e)},_defaultShape:function(){return qe(this._latlngs)?this._latlngs:this._latlngs[0]},_convertLatLngs:function(e){for(var t=[],i=qe(e),n=0,l=e.length;n<l;n++)i?(t[n]=W(e[n]),this._bounds.extend(t[n])):t[n]=this._convertLatLngs(e[n]);return t},_project:function(){var e=new ce;this._rings=[],this._projectLatlngs(this._latlngs,this._rings,e),this._bounds.isValid()&&e.isValid()&&(this._rawPxBounds=e,this._updateBounds())},_updateBounds:function(){var e=this._clickTolerance(),t=new O(e,e);this._rawPxBounds&&(this._pxBounds=new ce([this._rawPxBounds.min.subtract(t),this._rawPxBounds.max.add(t)]))},_projectLatlngs:function(e,t,i){var n=e[0]instanceof ae,l=e.length,c,f;if(n){for(f=[],c=0;c<l;c++)f[c]=this._map.latLngToLayerPoint(e[c]),i.extend(f[c]);t.push(f)}else for(c=0;c<l;c++)this._projectLatlngs(e[c],t,i)},_clipPoints:function(){var e=this._renderer._bounds;if(this._parts=[],!(!this._pxBounds||!this._pxBounds.intersects(e))){if(this.options.noClip){this._parts=this._rings;return}var t=this._parts,i,n,l,c,f,b,x;for(i=0,l=0,c=this._rings.length;i<c;i++)for(x=this._rings[i],n=0,f=x.length;n<f-1;n++)b=io(x[n],x[n+1],e,n,!0),b&&(t[l]=t[l]||[],t[l].push(b[0]),(b[1]!==x[n+1]||n===f-2)&&(t[l].push(b[1]),l++))}},_simplifyPoints:function(){for(var e=this._parts,t=this.options.smoothFactor,i=0,n=e.length;i<n;i++)e[i]=Qa(e[i],t)},_update:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),this._updatePath())},_updatePath:function(){this._renderer._updatePoly(this)},_containsPoint:function(e,t){var i,n,l,c,f,b,x=this._clickTolerance();if(!this._pxBounds||!this._pxBounds.contains(e))return!1;for(i=0,c=this._parts.length;i<c;i++)for(b=this._parts[i],n=0,f=b.length,l=f-1;n<f;l=n++)if(!(!t&&n===0)&&eo(e,b[l],b[n])<=x)return!0;return!1}});function br(e,t){return new lt(e,t)}lt._flat=no;var Bt=lt.extend({options:{fill:!0},isEmpty:function(){return!this._latlngs.length||!this._latlngs[0].length},getCenter:function(){if(!this._map)throw new Error("Must add layer to map before using getCenter()");return Xa(this._defaultShape(),this._map.options.crs)},_convertLatLngs:function(e){var t=lt.prototype._convertLatLngs.call(this,e),i=t.length;return i>=2&&t[0]instanceof ae&&t[0].equals(t[i-1])&&t.pop(),t},_setLatLngs:function(e){lt.prototype._setLatLngs.call(this,e),qe(this._latlngs)&&(this._latlngs=[this._latlngs])},_defaultShape:function(){return qe(this._latlngs[0])?this._latlngs[0]:this._latlngs[0][0]},_clipPoints:function(){var e=this._renderer._bounds,t=this.options.weight,i=new O(t,t);if(e=new ce(e.min.subtract(i),e.max.add(i)),this._parts=[],!(!this._pxBounds||!this._pxBounds.intersects(e))){if(this.options.noClip){this._parts=this._rings;return}for(var n=0,l=this._rings.length,c;n<l;n++)c=Ya(this._rings[n],e,!0),c.length&&this._parts.push(c)}},_updatePath:function(){this._renderer._updatePoly(this,!0)},_containsPoint:function(e){var t=!1,i,n,l,c,f,b,x,E;if(!this._pxBounds||!this._pxBounds.contains(e))return!1;for(c=0,x=this._parts.length;c<x;c++)for(i=this._parts[c],f=0,E=i.length,b=E-1;f<E;b=f++)n=i[f],l=i[b],n.y>e.y!=l.y>e.y&&e.x<(l.x-n.x)*(e.y-n.y)/(l.y-n.y)+n.x&&(t=!t);return t||lt.prototype._containsPoint.call(this,e,!0)}});function _r(e,t){return new Bt(e,t)}var dt=rt.extend({initialize:function(e,t){C(this,t),this._layers={},e&&this.addData(e)},addData:function(e){var t=ne(e)?e:e.features,i,n,l;if(t){for(i=0,n=t.length;i<n;i++)l=t[i],(l.geometries||l.geometry||l.features||l.coordinates)&&this.addData(l);return this}var c=this.options;if(c.filter&&!c.filter(e))return this;var f=Si(e,c);return f?(f.feature=Ii(e),f.defaultOptions=f.options,this.resetStyle(f),c.onEachFeature&&c.onEachFeature(e,f),this.addLayer(f)):this},resetStyle:function(e){return e===void 0?this.eachLayer(this.resetStyle,this):(e.options=d({},e.defaultOptions),this._setLayerStyle(e,this.options.style),this)},setStyle:function(e){return this.eachLayer(function(t){this._setLayerStyle(t,e)},this)},_setLayerStyle:function(e,t){e.setStyle&&(typeof t=="function"&&(t=t(e.feature)),e.setStyle(t))}});function Si(e,t){var i=e.type==="Feature"?e.geometry:e,n=i?i.coordinates:null,l=[],c=t&&t.pointToLayer,f=t&&t.coordsToLatLng||Bn,b,x,E,S;if(!n&&!i)return null;switch(i.type){case"Point":return b=f(n),ro(c,e,b,t);case"MultiPoint":for(E=0,S=n.length;E<S;E++)b=f(n[E]),l.push(ro(c,e,b,t));return new rt(l);case"LineString":case"MultiLineString":return x=Pi(n,i.type==="LineString"?0:1,f),new lt(x,t);case"Polygon":case"MultiPolygon":return x=Pi(n,i.type==="Polygon"?1:2,f),new Bt(x,t);case"GeometryCollection":for(E=0,S=i.geometries.length;E<S;E++){var N=Si({geometry:i.geometries[E],type:"Feature",properties:e.properties},t);N&&l.push(N)}return new rt(l);case"FeatureCollection":for(E=0,S=i.features.length;E<S;E++){var q=Si(i.features[E],t);q&&l.push(q)}return new rt(l);default:throw new Error("Invalid GeoJSON object.")}}function ro(e,t,i,n){return e?e(t,i):new zi(i,n&&n.markersInheritOptions&&n)}function Bn(e){return new ae(e[1],e[0],e[2])}function Pi(e,t,i){for(var n=[],l=0,c=e.length,f;l<c;l++)f=t?Pi(e[l],t-1,i):(i||Bn)(e[l]),n.push(f);return n}function Rn(e,t){return e=W(e),e.alt!==void 0?[w(e.lng,t),w(e.lat,t),w(e.alt,t)]:[w(e.lng,t),w(e.lat,t)]}function Ai(e,t,i,n){for(var l=[],c=0,f=e.length;c<f;c++)l.push(t?Ai(e[c],qe(e[c])?0:t-1,i,n):Rn(e[c],n));return!t&&i&&l.length>0&&l.push(l[0].slice()),l}function Rt(e,t){return e.feature?d({},e.feature,{geometry:t}):Ii(t)}function Ii(e){return e.type==="Feature"||e.type==="FeatureCollection"?e:{type:"Feature",properties:{},geometry:e}}var On={toGeoJSON:function(e){return Rt(this,{type:"Point",coordinates:Rn(this.getLatLng(),e)})}};zi.include(On),$n.include(On),Mi.include(On),lt.include({toGeoJSON:function(e){var t=!qe(this._latlngs),i=Ai(this._latlngs,t?1:0,!1,e);return Rt(this,{type:(t?"Multi":"")+"LineString",coordinates:i})}}),Bt.include({toGeoJSON:function(e){var t=!qe(this._latlngs),i=t&&!qe(this._latlngs[0]),n=Ai(this._latlngs,i?2:t?1:0,!0,e);return t||(n=[n]),Rt(this,{type:(i?"Multi":"")+"Polygon",coordinates:n})}}),It.include({toMultiPoint:function(e){var t=[];return this.eachLayer(function(i){t.push(i.toGeoJSON(e).geometry.coordinates)}),Rt(this,{type:"MultiPoint",coordinates:t})},toGeoJSON:function(e){var t=this.feature&&this.feature.geometry&&this.feature.geometry.type;if(t==="MultiPoint")return this.toMultiPoint(e);var i=t==="GeometryCollection",n=[];return this.eachLayer(function(l){if(l.toGeoJSON){var c=l.toGeoJSON(e);if(i)n.push(c.geometry);else{var f=Ii(c);f.type==="FeatureCollection"?n.push.apply(n,f.features):n.push(f)}}}),i?Rt(this,{geometries:n,type:"GeometryCollection"}):{type:"FeatureCollection",features:n}}});function lo(e,t){return new dt(e,t)}var xr=lo,$i=Je.extend({options:{opacity:1,alt:"",interactive:!1,crossOrigin:!1,errorOverlayUrl:"",zIndex:1,className:""},initialize:function(e,t,i){this._url=e,this._bounds=ve(t),C(this,i)},onAdd:function(){this._image||(this._initImage(),this.options.opacity<1&&this._updateOpacity()),this.options.interactive&&(Z(this._image,"leaflet-interactive"),this.addInteractiveTarget(this._image)),this.getPane().appendChild(this._image),this._reset()},onRemove:function(){ue(this._image),this.options.interactive&&this.removeInteractiveTarget(this._image)},setOpacity:function(e){return this.options.opacity=e,this._image&&this._updateOpacity(),this},setStyle:function(e){return e.opacity&&this.setOpacity(e.opacity),this},bringToFront:function(){return this._map&&Pt(this._image),this},bringToBack:function(){return this._map&&At(this._image),this},setUrl:function(e){return this._url=e,this._image&&(this._image.src=e),this},setBounds:function(e){return this._bounds=ve(e),this._map&&this._reset(),this},getEvents:function(){var e={zoom:this._reset,viewreset:this._reset};return this._zoomAnimated&&(e.zoomanim=this._animateZoom),e},setZIndex:function(e){return this.options.zIndex=e,this._updateZIndex(),this},getBounds:function(){return this._bounds},getElement:function(){return this._image},_initImage:function(){var e=this._url.tagName==="IMG",t=this._image=e?this._url:Y("img");if(Z(t,"leaflet-image-layer"),this._zoomAnimated&&Z(t,"leaflet-zoom-animated"),this.options.className&&Z(t,this.options.className),t.onselectstart=g,t.onmousemove=g,t.onload=p(this.fire,this,"load"),t.onerror=p(this._overlayOnError,this,"error"),(this.options.crossOrigin||this.options.crossOrigin==="")&&(t.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),this.options.zIndex&&this._updateZIndex(),e){this._url=t.src;return}t.src=this._url,t.alt=this.options.alt},_animateZoom:function(e){var t=this._map.getZoomScale(e.zoom),i=this._map._latLngBoundsToNewLayerBounds(this._bounds,e.zoom,e.center).min;yt(this._image,i,t)},_reset:function(){var e=this._image,t=new ce(this._map.latLngToLayerPoint(this._bounds.getNorthWest()),this._map.latLngToLayerPoint(this._bounds.getSouthEast())),i=t.getSize();ge(e,t.min),e.style.width=i.x+"px",e.style.height=i.y+"px"},_updateOpacity:function(){Ue(this._image,this.options.opacity)},_updateZIndex:function(){this._image&&this.options.zIndex!==void 0&&this.options.zIndex!==null&&(this._image.style.zIndex=this.options.zIndex)},_overlayOnError:function(){this.fire("error");var e=this.options.errorOverlayUrl;e&&this._url!==e&&(this._url=e,this._image.src=e)},getCenter:function(){return this._bounds.getCenter()}}),wr=function(e,t,i){return new $i(e,t,i)},co=$i.extend({options:{autoplay:!0,loop:!0,keepAspectRatio:!0,muted:!1,playsInline:!0},_initImage:function(){var e=this._url.tagName==="VIDEO",t=this._image=e?this._url:Y("video");if(Z(t,"leaflet-image-layer"),this._zoomAnimated&&Z(t,"leaflet-zoom-animated"),this.options.className&&Z(t,this.options.className),t.onselectstart=g,t.onmousemove=g,t.onloadeddata=p(this.fire,this,"load"),e){for(var i=t.getElementsByTagName("source"),n=[],l=0;l<i.length;l++)n.push(i[l].src);this._url=i.length>0?n:[t.src];return}ne(this._url)||(this._url=[this._url]),!this.options.keepAspectRatio&&Object.prototype.hasOwnProperty.call(t.style,"objectFit")&&(t.style.objectFit="fill"),t.autoplay=!!this.options.autoplay,t.loop=!!this.options.loop,t.muted=!!this.options.muted,t.playsInline=!!this.options.playsInline;for(var c=0;c<this._url.length;c++){var f=Y("source");f.src=this._url[c],t.appendChild(f)}}});function kr(e,t,i){return new co(e,t,i)}var uo=$i.extend({_initImage:function(){var e=this._image=this._url;Z(e,"leaflet-image-layer"),this._zoomAnimated&&Z(e,"leaflet-zoom-animated"),this.options.className&&Z(e,this.options.className),e.onselectstart=g,e.onmousemove=g}});function Lr(e,t,i){return new uo(e,t,i)}var it=Je.extend({options:{interactive:!1,offset:[0,0],className:"",pane:void 0,content:""},initialize:function(e,t){e&&(e instanceof ae||ne(e))?(this._latlng=W(e),C(this,t)):(C(this,e),this._source=t),this.options.content&&(this._content=this.options.content)},openOn:function(e){return e=arguments.length?e:this._source._map,e.hasLayer(this)||e.addLayer(this),this},close:function(){return this._map&&this._map.removeLayer(this),this},toggle:function(e){return this._map?this.close():(arguments.length?this._source=e:e=this._source,this._prepareOpen(),this.openOn(e._map)),this},onAdd:function(e){this._zoomAnimated=e._zoomAnimated,this._container||this._initLayout(),e._fadeAnimated&&Ue(this._container,0),clearTimeout(this._removeTimeout),this.getPane().appendChild(this._container),this.update(),e._fadeAnimated&&Ue(this._container,1),this.bringToFront(),this.options.interactive&&(Z(this._container,"leaflet-interactive"),this.addInteractiveTarget(this._container))},onRemove:function(e){e._fadeAnimated?(Ue(this._container,0),this._removeTimeout=setTimeout(p(ue,void 0,this._container),200)):ue(this._container),this.options.interactive&&(me(this._container,"leaflet-interactive"),this.removeInteractiveTarget(this._container))},getLatLng:function(){return this._latlng},setLatLng:function(e){return this._latlng=W(e),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(e){return this._content=e,this.update(),this},getElement:function(){return this._container},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},getEvents:function(){var e={zoom:this._updatePosition,viewreset:this._updatePosition};return this._zoomAnimated&&(e.zoomanim=this._animateZoom),e},isOpen:function(){return!!this._map&&this._map.hasLayer(this)},bringToFront:function(){return this._map&&Pt(this._container),this},bringToBack:function(){return this._map&&At(this._container),this},_prepareOpen:function(e){var t=this._source;if(!t._map)return!1;if(t instanceof rt){t=null;var i=this._source._layers;for(var n in i)if(i[n]._map){t=i[n];break}if(!t)return!1;this._source=t}if(!e)if(t.getCenter)e=t.getCenter();else if(t.getLatLng)e=t.getLatLng();else if(t.getBounds)e=t.getBounds().getCenter();else throw new Error("Unable to get source layer LatLng.");return this.setLatLng(e),this._map&&this.update(),!0},_updateContent:function(){if(this._content){var e=this._contentNode,t=typeof this._content=="function"?this._content(this._source||this):this._content;if(typeof t=="string")e.innerHTML=t;else{for(;e.hasChildNodes();)e.removeChild(e.firstChild);e.appendChild(t)}this.fire("contentupdate")}},_updatePosition:function(){if(this._map){var e=this._map.latLngToLayerPoint(this._latlng),t=H(this.options.offset),i=this._getAnchor();this._zoomAnimated?ge(this._container,e.add(i)):t=t.add(e).add(i);var n=this._containerBottom=-t.y,l=this._containerLeft=-Math.round(this._containerWidth/2)+t.x;this._container.style.bottom=n+"px",this._container.style.left=l+"px"}},_getAnchor:function(){return[0,0]}});G.include({_initOverlay:function(e,t,i,n){var l=t;return l instanceof e||(l=new e(n).setContent(t)),i&&l.setLatLng(i),l}}),Je.include({_initOverlay:function(e,t,i,n){var l=i;return l instanceof e?(C(l,n),l._source=this):(l=t&&!n?t:new e(n,this),l.setContent(i)),l}});var Bi=it.extend({options:{pane:"popupPane",offset:[0,7],maxWidth:300,minWidth:50,maxHeight:null,autoPan:!0,autoPanPaddingTopLeft:null,autoPanPaddingBottomRight:null,autoPanPadding:[5,5],keepInView:!1,closeButton:!0,autoClose:!0,closeOnEscapeKey:!0,className:""},openOn:function(e){return e=arguments.length?e:this._source._map,!e.hasLayer(this)&&e._popup&&e._popup.options.autoClose&&e.removeLayer(e._popup),e._popup=this,it.prototype.openOn.call(this,e)},onAdd:function(e){it.prototype.onAdd.call(this,e),e.fire("popupopen",{popup:this}),this._source&&(this._source.fire("popupopen",{popup:this},!0),this._source instanceof ht||this._source.on("preclick",_t))},onRemove:function(e){it.prototype.onRemove.call(this,e),e.fire("popupclose",{popup:this}),this._source&&(this._source.fire("popupclose",{popup:this},!0),this._source instanceof ht||this._source.off("preclick",_t))},getEvents:function(){var e=it.prototype.getEvents.call(this);return(this.options.closeOnClick!==void 0?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(e.preclick=this.close),this.options.keepInView&&(e.moveend=this._adjustPan),e},_initLayout:function(){var e="leaflet-popup",t=this._container=Y("div",e+" "+(this.options.className||"")+" leaflet-zoom-animated"),i=this._wrapper=Y("div",e+"-content-wrapper",t);if(this._contentNode=Y("div",e+"-content",i),ni(t),En(this._contentNode),F(t,"contextmenu",_t),this._tipContainer=Y("div",e+"-tip-container",t),this._tip=Y("div",e+"-tip",this._tipContainer),this.options.closeButton){var n=this._closeButton=Y("a",e+"-close-button",t);n.setAttribute("role","button"),n.setAttribute("aria-label","Close popup"),n.href="#close",n.innerHTML='<span aria-hidden="true">&#215;</span>',F(n,"click",function(l){ze(l),this.close()},this)}},_updateLayout:function(){var e=this._contentNode,t=e.style;t.width="",t.whiteSpace="nowrap";var i=e.offsetWidth;i=Math.min(i,this.options.maxWidth),i=Math.max(i,this.options.minWidth),t.width=i+1+"px",t.whiteSpace="",t.height="";var n=e.offsetHeight,l=this.options.maxHeight,c="leaflet-popup-scrolled";l&&n>l?(t.height=l+"px",Z(e,c)):me(e,c),this._containerWidth=this._container.offsetWidth},_animateZoom:function(e){var t=this._map._latLngToNewLayerPoint(this._latlng,e.zoom,e.center),i=this._getAnchor();ge(this._container,t.add(i))},_adjustPan:function(){if(this.options.autoPan){if(this._map._panAnim&&this._map._panAnim.stop(),this._autopanning){this._autopanning=!1;return}var e=this._map,t=parseInt(Qt(this._container,"marginBottom"),10)||0,i=this._container.offsetHeight+t,n=this._containerWidth,l=new O(this._containerLeft,-i-this._containerBottom);l._add(bt(this._container));var c=e.layerPointToContainerPoint(l),f=H(this.options.autoPanPadding),b=H(this.options.autoPanPaddingTopLeft||f),x=H(this.options.autoPanPaddingBottomRight||f),E=e.getSize(),S=0,N=0;c.x+n+x.x>E.x&&(S=c.x+n-E.x+x.x),c.x-S-b.x<0&&(S=c.x-b.x),c.y+i+x.y>E.y&&(N=c.y+i-E.y+x.y),c.y-N-b.y<0&&(N=c.y-b.y),(S||N)&&(this.options.keepInView&&(this._autopanning=!0),e.fire("autopanstart").panBy([S,N]))}},_getAnchor:function(){return H(this._source&&this._source._getPopupAnchor?this._source._getPopupAnchor():[0,0])}}),Cr=function(e,t){return new Bi(e,t)};G.mergeOptions({closePopupOnClick:!0}),G.include({openPopup:function(e,t,i){return this._initOverlay(Bi,e,t,i).openOn(this),this},closePopup:function(e){return e=arguments.length?e:this._popup,e&&e.close(),this}}),Je.include({bindPopup:function(e,t){return this._popup=this._initOverlay(Bi,this._popup,e,t),this._popupHandlersAdded||(this.on({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this.off({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!1,this._popup=null),this},openPopup:function(e){return this._popup&&(this instanceof rt||(this._popup._source=this),this._popup._prepareOpen(e||this._latlng)&&this._popup.openOn(this._map)),this},closePopup:function(){return this._popup&&this._popup.close(),this},togglePopup:function(){return this._popup&&this._popup.toggle(this),this},isPopupOpen:function(){return this._popup?this._popup.isOpen():!1},setPopupContent:function(e){return this._popup&&this._popup.setContent(e),this},getPopup:function(){return this._popup},_openPopup:function(e){if(!(!this._popup||!this._map)){xt(e);var t=e.layer||e.target;if(this._popup._source===t&&!(t instanceof ht)){this._map.hasLayer(this._popup)?this.closePopup():this.openPopup(e.latlng);return}this._popup._source=t,this.openPopup(e.latlng)}},_movePopup:function(e){this._popup.setLatLng(e.latlng)},_onKeyPress:function(e){e.originalEvent.keyCode===13&&this._openPopup(e)}});var Ri=it.extend({options:{pane:"tooltipPane",offset:[0,0],direction:"auto",permanent:!1,sticky:!1,opacity:.9},onAdd:function(e){it.prototype.onAdd.call(this,e),this.setOpacity(this.options.opacity),e.fire("tooltipopen",{tooltip:this}),this._source&&(this.addEventParent(this._source),this._source.fire("tooltipopen",{tooltip:this},!0))},onRemove:function(e){it.prototype.onRemove.call(this,e),e.fire("tooltipclose",{tooltip:this}),this._source&&(this.removeEventParent(this._source),this._source.fire("tooltipclose",{tooltip:this},!0))},getEvents:function(){var e=it.prototype.getEvents.call(this);return this.options.permanent||(e.preclick=this.close),e},_initLayout:function(){var e="leaflet-tooltip",t=e+" "+(this.options.className||"")+" leaflet-zoom-"+(this._zoomAnimated?"animated":"hide");this._contentNode=this._container=Y("div",t),this._container.setAttribute("role","tooltip"),this._container.setAttribute("id","leaflet-tooltip-"+m(this))},_updateLayout:function(){},_adjustPan:function(){},_setPosition:function(e){var t,i,n=this._map,l=this._container,c=n.latLngToContainerPoint(n.getCenter()),f=n.layerPointToContainerPoint(e),b=this.options.direction,x=l.offsetWidth,E=l.offsetHeight,S=H(this.options.offset),N=this._getAnchor();b==="top"?(t=x/2,i=E):b==="bottom"?(t=x/2,i=0):b==="center"?(t=x/2,i=E/2):b==="right"?(t=0,i=E/2):b==="left"?(t=x,i=E/2):f.x<c.x?(b="right",t=0,i=E/2):(b="left",t=x+(S.x+N.x)*2,i=E/2),e=e.subtract(H(t,i,!0)).add(S).add(N),me(l,"leaflet-tooltip-right"),me(l,"leaflet-tooltip-left"),me(l,"leaflet-tooltip-top"),me(l,"leaflet-tooltip-bottom"),Z(l,"leaflet-tooltip-"+b),ge(l,e)},_updatePosition:function(){var e=this._map.latLngToLayerPoint(this._latlng);this._setPosition(e)},setOpacity:function(e){this.options.opacity=e,this._container&&Ue(this._container,e)},_animateZoom:function(e){var t=this._map._latLngToNewLayerPoint(this._latlng,e.zoom,e.center);this._setPosition(t)},_getAnchor:function(){return H(this._source&&this._source._getTooltipAnchor&&!this.options.sticky?this._source._getTooltipAnchor():[0,0])}}),Er=function(e,t){return new Ri(e,t)};G.include({openTooltip:function(e,t,i){return this._initOverlay(Ri,e,t,i).openOn(this),this},closeTooltip:function(e){return e.close(),this}}),Je.include({bindTooltip:function(e,t){return this._tooltip&&this.isTooltipOpen()&&this.unbindTooltip(),this._tooltip=this._initOverlay(Ri,this._tooltip,e,t),this._initTooltipInteractions(),this._tooltip.options.permanent&&this._map&&this._map.hasLayer(this)&&this.openTooltip(),this},unbindTooltip:function(){return this._tooltip&&(this._initTooltipInteractions(!0),this.closeTooltip(),this._tooltip=null),this},_initTooltipInteractions:function(e){if(!(!e&&this._tooltipHandlersAdded)){var t=e?"off":"on",i={remove:this.closeTooltip,move:this._moveTooltip};this._tooltip.options.permanent?i.add=this._openTooltip:(i.mouseover=this._openTooltip,i.mouseout=this.closeTooltip,i.click=this._openTooltip,this._map?this._addFocusListeners():i.add=this._addFocusListeners),this._tooltip.options.sticky&&(i.mousemove=this._moveTooltip),this[t](i),this._tooltipHandlersAdded=!e}},openTooltip:function(e){return this._tooltip&&(this instanceof rt||(this._tooltip._source=this),this._tooltip._prepareOpen(e)&&(this._tooltip.openOn(this._map),this.getElement?this._setAriaDescribedByOnLayer(this):this.eachLayer&&this.eachLayer(this._setAriaDescribedByOnLayer,this))),this},closeTooltip:function(){if(this._tooltip)return this._tooltip.close()},toggleTooltip:function(){return this._tooltip&&this._tooltip.toggle(this),this},isTooltipOpen:function(){return this._tooltip.isOpen()},setTooltipContent:function(e){return this._tooltip&&this._tooltip.setContent(e),this},getTooltip:function(){return this._tooltip},_addFocusListeners:function(){this.getElement?this._addFocusListenersOnLayer(this):this.eachLayer&&this.eachLayer(this._addFocusListenersOnLayer,this)},_addFocusListenersOnLayer:function(e){var t=typeof e.getElement=="function"&&e.getElement();t&&(F(t,"focus",function(){this._tooltip._source=e,this.openTooltip()},this),F(t,"blur",this.closeTooltip,this))},_setAriaDescribedByOnLayer:function(e){var t=typeof e.getElement=="function"&&e.getElement();t&&t.setAttribute("aria-describedby",this._tooltip._container.id)},_openTooltip:function(e){if(!(!this._tooltip||!this._map)){if(this._map.dragging&&this._map.dragging.moving()&&!this._openOnceFlag){this._openOnceFlag=!0;var t=this;this._map.once("moveend",function(){t._openOnceFlag=!1,t._openTooltip(e)});return}this._tooltip._source=e.layer||e.target,this.openTooltip(this._tooltip.options.sticky?e.latlng:void 0)}},_moveTooltip:function(e){var t=e.latlng,i,n;this._tooltip.options.sticky&&e.originalEvent&&(i=this._map.mouseEventToContainerPoint(e.originalEvent),n=this._map.containerPointToLayerPoint(i),t=this._map.layerPointToLatLng(n)),this._tooltip.setLatLng(t)}});var po=$t.extend({options:{iconSize:[12,12],html:!1,bgPos:null,className:"leaflet-div-icon"},createIcon:function(e){var t=e&&e.tagName==="DIV"?e:document.createElement("div"),i=this.options;if(i.html instanceof Element?(wi(t),t.appendChild(i.html)):t.innerHTML=i.html!==!1?i.html:"",i.bgPos){var n=H(i.bgPos);t.style.backgroundPosition=-n.x+"px "+-n.y+"px"}return this._setIconStyles(t,"icon"),t},createShadow:function(){return null}});function Tr(e){return new po(e)}$t.Default=si;var ri=Je.extend({options:{tileSize:256,opacity:1,updateWhenIdle:I.mobile,updateWhenZooming:!0,updateInterval:200,zIndex:1,bounds:null,minZoom:0,maxZoom:void 0,maxNativeZoom:void 0,minNativeZoom:void 0,noWrap:!1,pane:"tilePane",className:"",keepBuffer:2},initialize:function(e){C(this,e)},onAdd:function(){this._initContainer(),this._levels={},this._tiles={},this._resetView()},beforeAdd:function(e){e._addZoomLimit(this)},onRemove:function(e){this._removeAllTiles(),ue(this._container),e._removeZoomLimit(this),this._container=null,this._tileZoom=void 0},bringToFront:function(){return this._map&&(Pt(this._container),this._setAutoZIndex(Math.max)),this},bringToBack:function(){return this._map&&(At(this._container),this._setAutoZIndex(Math.min)),this},getContainer:function(){return this._container},setOpacity:function(e){return this.options.opacity=e,this._updateOpacity(),this},setZIndex:function(e){return this.options.zIndex=e,this._updateZIndex(),this},isLoading:function(){return this._loading},redraw:function(){if(this._map){this._removeAllTiles();var e=this._clampZoom(this._map.getZoom());e!==this._tileZoom&&(this._tileZoom=e,this._updateLevels()),this._update()}return this},getEvents:function(){var e={viewprereset:this._invalidateAll,viewreset:this._resetView,zoom:this._resetView,moveend:this._onMoveEnd};return this.options.updateWhenIdle||(this._onMove||(this._onMove=v(this._onMoveEnd,this.options.updateInterval,this)),e.move=this._onMove),this._zoomAnimated&&(e.zoomanim=this._animateZoom),e},createTile:function(){return document.createElement("div")},getTileSize:function(){var e=this.options.tileSize;return e instanceof O?e:new O(e,e)},_updateZIndex:function(){this._container&&this.options.zIndex!==void 0&&this.options.zIndex!==null&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(e){for(var t=this.getPane().children,i=-e(-1/0,1/0),n=0,l=t.length,c;n<l;n++)c=t[n].style.zIndex,t[n]!==this._container&&c&&(i=e(i,+c));isFinite(i)&&(this.options.zIndex=i+e(-1,1),this._updateZIndex())},_updateOpacity:function(){if(this._map&&!I.ielt9){Ue(this._container,this.options.opacity);var e=+new Date,t=!1,i=!1;for(var n in this._tiles){var l=this._tiles[n];if(!(!l.current||!l.loaded)){var c=Math.min(1,(e-l.loaded)/200);Ue(l.el,c),c<1?t=!0:(l.active?i=!0:this._onOpaqueTile(l),l.active=!0)}}i&&!this._noPrune&&this._pruneTiles(),t&&(he(this._fadeFrame),this._fadeFrame=Q(this._updateOpacity,this))}},_onOpaqueTile:g,_initContainer:function(){this._container||(this._container=Y("div","leaflet-layer "+(this.options.className||"")),this._updateZIndex(),this.options.opacity<1&&this._updateOpacity(),this.getPane().appendChild(this._container))},_updateLevels:function(){var e=this._tileZoom,t=this.options.maxZoom;if(e!==void 0){for(var i in this._levels)i=Number(i),this._levels[i].el.children.length||i===e?(this._levels[i].el.style.zIndex=t-Math.abs(e-i),this._onUpdateLevel(i)):(ue(this._levels[i].el),this._removeTilesAtZoom(i),this._onRemoveLevel(i),delete this._levels[i]);var n=this._levels[e],l=this._map;return n||(n=this._levels[e]={},n.el=Y("div","leaflet-tile-container leaflet-zoom-animated",this._container),n.el.style.zIndex=t,n.origin=l.project(l.unproject(l.getPixelOrigin()),e).round(),n.zoom=e,this._setZoomTransform(n,l.getCenter(),l.getZoom()),g(n.el.offsetWidth),this._onCreateLevel(n)),this._level=n,n}},_onUpdateLevel:g,_onRemoveLevel:g,_onCreateLevel:g,_pruneTiles:function(){if(this._map){var e,t,i=this._map.getZoom();if(i>this.options.maxZoom||i<this.options.minZoom){this._removeAllTiles();return}for(e in this._tiles)t=this._tiles[e],t.retain=t.current;for(e in this._tiles)if(t=this._tiles[e],t.current&&!t.active){var n=t.coords;this._retainParent(n.x,n.y,n.z,n.z-5)||this._retainChildren(n.x,n.y,n.z,n.z+2)}for(e in this._tiles)this._tiles[e].retain||this._removeTile(e)}},_removeTilesAtZoom:function(e){for(var t in this._tiles)this._tiles[t].coords.z===e&&this._removeTile(t)},_removeAllTiles:function(){for(var e in this._tiles)this._removeTile(e)},_invalidateAll:function(){for(var e in this._levels)ue(this._levels[e].el),this._onRemoveLevel(Number(e)),delete this._levels[e];this._removeAllTiles(),this._tileZoom=void 0},_retainParent:function(e,t,i,n){var l=Math.floor(e/2),c=Math.floor(t/2),f=i-1,b=new O(+l,+c);b.z=+f;var x=this._tileCoordsToKey(b),E=this._tiles[x];return E&&E.active?(E.retain=!0,!0):(E&&E.loaded&&(E.retain=!0),f>n?this._retainParent(l,c,f,n):!1)},_retainChildren:function(e,t,i,n){for(var l=2*e;l<2*e+2;l++)for(var c=2*t;c<2*t+2;c++){var f=new O(l,c);f.z=i+1;var b=this._tileCoordsToKey(f),x=this._tiles[b];if(x&&x.active){x.retain=!0;continue}else x&&x.loaded&&(x.retain=!0);i+1<n&&this._retainChildren(l,c,i+1,n)}},_resetView:function(e){var t=e&&(e.pinch||e.flyTo);this._setView(this._map.getCenter(),this._map.getZoom(),t,t)},_animateZoom:function(e){this._setView(e.center,e.zoom,!0,e.noUpdate)},_clampZoom:function(e){var t=this.options;return t.minNativeZoom!==void 0&&e<t.minNativeZoom?t.minNativeZoom:t.maxNativeZoom!==void 0&&t.maxNativeZoom<e?t.maxNativeZoom:e},_setView:function(e,t,i,n){var l=Math.round(t);this.options.maxZoom!==void 0&&l>this.options.maxZoom||this.options.minZoom!==void 0&&l<this.options.minZoom?l=void 0:l=this._clampZoom(l);var c=this.options.updateWhenZooming&&l!==this._tileZoom;(!n||c)&&(this._tileZoom=l,this._abortLoading&&this._abortLoading(),this._updateLevels(),this._resetGrid(),l!==void 0&&this._update(e),i||this._pruneTiles(),this._noPrune=!!i),this._setZoomTransforms(e,t)},_setZoomTransforms:function(e,t){for(var i in this._levels)this._setZoomTransform(this._levels[i],e,t)},_setZoomTransform:function(e,t,i){var n=this._map.getZoomScale(i,e.zoom),l=e.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(t,i)).round();I.any3d?yt(e.el,l,n):ge(e.el,l)},_resetGrid:function(){var e=this._map,t=e.options.crs,i=this._tileSize=this.getTileSize(),n=this._tileZoom,l=this._map.getPixelWorldBounds(this._tileZoom);l&&(this._globalTileRange=this._pxBoundsToTileRange(l)),this._wrapX=t.wrapLng&&!this.options.noWrap&&[Math.floor(e.project([0,t.wrapLng[0]],n).x/i.x),Math.ceil(e.project([0,t.wrapLng[1]],n).x/i.y)],this._wrapY=t.wrapLat&&!this.options.noWrap&&[Math.floor(e.project([t.wrapLat[0],0],n).y/i.x),Math.ceil(e.project([t.wrapLat[1],0],n).y/i.y)]},_onMoveEnd:function(){!this._map||this._map._animatingZoom||this._update()},_getTiledPixelBounds:function(e){var t=this._map,i=t._animatingZoom?Math.max(t._animateToZoom,t.getZoom()):t.getZoom(),n=t.getZoomScale(i,this._tileZoom),l=t.project(e,this._tileZoom).floor(),c=t.getSize().divideBy(n*2);return new ce(l.subtract(c),l.add(c))},_update:function(e){var t=this._map;if(t){var i=this._clampZoom(t.getZoom());if(e===void 0&&(e=t.getCenter()),this._tileZoom!==void 0){var n=this._getTiledPixelBounds(e),l=this._pxBoundsToTileRange(n),c=l.getCenter(),f=[],b=this.options.keepBuffer,x=new ce(l.getBottomLeft().subtract([b,-b]),l.getTopRight().add([b,-b]));if(!(isFinite(l.min.x)&&isFinite(l.min.y)&&isFinite(l.max.x)&&isFinite(l.max.y)))throw new Error("Attempted to load an infinite number of tiles");for(var E in this._tiles){var S=this._tiles[E].coords;(S.z!==this._tileZoom||!x.contains(new O(S.x,S.y)))&&(this._tiles[E].current=!1)}if(Math.abs(i-this._tileZoom)>1){this._setView(e,i);return}for(var N=l.min.y;N<=l.max.y;N++)for(var q=l.min.x;q<=l.max.x;q++){var Se=new O(q,N);if(Se.z=this._tileZoom,!!this._isValidTile(Se)){var Ee=this._tiles[this._tileCoordsToKey(Se)];Ee?Ee.current=!0:f.push(Se)}}if(f.sort(function(Oe,Nt){return Oe.distanceTo(c)-Nt.distanceTo(c)}),f.length!==0){this._loading||(this._loading=!0,this.fire("loading"));var Ve=document.createDocumentFragment();for(q=0;q<f.length;q++)this._addTile(f[q],Ve);this._level.el.appendChild(Ve)}}}},_isValidTile:function(e){var t=this._map.options.crs;if(!t.infinite){var i=this._globalTileRange;if(!t.wrapLng&&(e.x<i.min.x||e.x>i.max.x)||!t.wrapLat&&(e.y<i.min.y||e.y>i.max.y))return!1}if(!this.options.bounds)return!0;var n=this._tileCoordsToBounds(e);return ve(this.options.bounds).overlaps(n)},_keyToBounds:function(e){return this._tileCoordsToBounds(this._keyToTileCoords(e))},_tileCoordsToNwSe:function(e){var t=this._map,i=this.getTileSize(),n=e.scaleBy(i),l=n.add(i),c=t.unproject(n,e.z),f=t.unproject(l,e.z);return[c,f]},_tileCoordsToBounds:function(e){var t=this._tileCoordsToNwSe(e),i=new Re(t[0],t[1]);return this.options.noWrap||(i=this._map.wrapLatLngBounds(i)),i},_tileCoordsToKey:function(e){return e.x+":"+e.y+":"+e.z},_keyToTileCoords:function(e){var t=e.split(":"),i=new O(+t[0],+t[1]);return i.z=+t[2],i},_removeTile:function(e){var t=this._tiles[e];t&&(ue(t.el),delete this._tiles[e],this.fire("tileunload",{tile:t.el,coords:this._keyToTileCoords(e)}))},_initTile:function(e){Z(e,"leaflet-tile");var t=this.getTileSize();e.style.width=t.x+"px",e.style.height=t.y+"px",e.onselectstart=g,e.onmousemove=g,I.ielt9&&this.options.opacity<1&&Ue(e,this.options.opacity)},_addTile:function(e,t){var i=this._getTilePos(e),n=this._tileCoordsToKey(e),l=this.createTile(this._wrapCoords(e),p(this._tileReady,this,e));this._initTile(l),this.createTile.length<2&&Q(p(this._tileReady,this,e,null,l)),ge(l,i),this._tiles[n]={el:l,coords:e,current:!0},t.appendChild(l),this.fire("tileloadstart",{tile:l,coords:e})},_tileReady:function(e,t,i){t&&this.fire("tileerror",{error:t,tile:i,coords:e});var n=this._tileCoordsToKey(e);i=this._tiles[n],i&&(i.loaded=+new Date,this._map._fadeAnimated?(Ue(i.el,0),he(this._fadeFrame),this._fadeFrame=Q(this._updateOpacity,this)):(i.active=!0,this._pruneTiles()),t||(Z(i.el,"leaflet-tile-loaded"),this.fire("tileload",{tile:i.el,coords:e})),this._noTilesToLoad()&&(this._loading=!1,this.fire("load"),I.ielt9||!this._map._fadeAnimated?Q(this._pruneTiles,this):setTimeout(p(this._pruneTiles,this),250)))},_getTilePos:function(e){return e.scaleBy(this.getTileSize()).subtract(this._level.origin)},_wrapCoords:function(e){var t=new O(this._wrapX?y(e.x,this._wrapX):e.x,this._wrapY?y(e.y,this._wrapY):e.y);return t.z=e.z,t},_pxBoundsToTileRange:function(e){var t=this.getTileSize();return new ce(e.min.unscaleBy(t).floor(),e.max.unscaleBy(t).ceil().subtract([1,1]))},_noTilesToLoad:function(){for(var e in this._tiles)if(!this._tiles[e].loaded)return!1;return!0}});function zr(e){return new ri(e)}var Ot=ri.extend({options:{minZoom:0,maxZoom:18,subdomains:"abc",errorTileUrl:"",zoomOffset:0,tms:!1,zoomReverse:!1,detectRetina:!1,crossOrigin:!1,referrerPolicy:!1},initialize:function(e,t){this._url=e,t=C(this,t),t.detectRetina&&I.retina&&t.maxZoom>0?(t.tileSize=Math.floor(t.tileSize/2),t.zoomReverse?(t.zoomOffset--,t.minZoom=Math.min(t.maxZoom,t.minZoom+1)):(t.zoomOffset++,t.maxZoom=Math.max(t.minZoom,t.maxZoom-1)),t.minZoom=Math.max(0,t.minZoom)):t.zoomReverse?t.minZoom=Math.min(t.maxZoom,t.minZoom):t.maxZoom=Math.max(t.minZoom,t.maxZoom),typeof t.subdomains=="string"&&(t.subdomains=t.subdomains.split("")),this.on("tileunload",this._onTileRemove)},setUrl:function(e,t){return this._url===e&&t===void 0&&(t=!0),this._url=e,t||this.redraw(),this},createTile:function(e,t){var i=document.createElement("img");return F(i,"load",p(this._tileOnLoad,this,t,i)),F(i,"error",p(this._tileOnError,this,t,i)),(this.options.crossOrigin||this.options.crossOrigin==="")&&(i.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),typeof this.options.referrerPolicy=="string"&&(i.referrerPolicy=this.options.referrerPolicy),i.alt="",i.src=this.getTileUrl(e),i},getTileUrl:function(e){var t={r:I.retina?"@2x":"",s:this._getSubdomain(e),x:e.x,y:e.y,z:this._getZoomForUrl()};if(this._map&&!this._map.options.crs.infinite){var i=this._globalTileRange.max.y-e.y;this.options.tms&&(t.y=i),t["-y"]=i}return B(this._url,d(t,this.options))},_tileOnLoad:function(e,t){I.ielt9?setTimeout(p(e,this,null,t),0):e(null,t)},_tileOnError:function(e,t,i){var n=this.options.errorTileUrl;n&&t.getAttribute("src")!==n&&(t.src=n),e(i,t)},_onTileRemove:function(e){e.tile.onload=null},_getZoomForUrl:function(){var e=this._tileZoom,t=this.options.maxZoom,i=this.options.zoomReverse,n=this.options.zoomOffset;return i&&(e=t-e),e+n},_getSubdomain:function(e){var t=Math.abs(e.x+e.y)%this.options.subdomains.length;return this.options.subdomains[t]},_abortLoading:function(){var e,t;for(e in this._tiles)if(this._tiles[e].coords.z!==this._tileZoom&&(t=this._tiles[e].el,t.onload=g,t.onerror=g,!t.complete)){t.src=fe;var i=this._tiles[e].coords;ue(t),delete this._tiles[e],this.fire("tileabort",{tile:t,coords:i})}},_removeTile:function(e){var t=this._tiles[e];if(t)return t.el.setAttribute("src",fe),ri.prototype._removeTile.call(this,e)},_tileReady:function(e,t,i){if(!(!this._map||i&&i.getAttribute("src")===fe))return ri.prototype._tileReady.call(this,e,t,i)}});function ho(e,t){return new Ot(e,t)}var mo=Ot.extend({defaultWmsParams:{service:"WMS",request:"GetMap",layers:"",styles:"",format:"image/jpeg",transparent:!1,version:"1.1.1"},options:{crs:null,uppercase:!1},initialize:function(e,t){this._url=e;var i=d({},this.defaultWmsParams);for(var n in t)n in this.options||(i[n]=t[n]);t=C(this,t);var l=t.detectRetina&&I.retina?2:1,c=this.getTileSize();i.width=c.x*l,i.height=c.y*l,this.wmsParams=i},onAdd:function(e){this._crs=this.options.crs||e.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var t=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[t]=this._crs.code,Ot.prototype.onAdd.call(this,e)},getTileUrl:function(e){var t=this._tileCoordsToNwSe(e),i=this._crs,n=Be(i.project(t[0]),i.project(t[1])),l=n.min,c=n.max,f=(this._wmsVersion>=1.3&&this._crs===oo?[l.y,l.x,c.y,c.x]:[l.x,l.y,c.x,c.y]).join(","),b=Ot.prototype.getTileUrl.call(this,e);return b+M(this.wmsParams,b,this.options.uppercase)+(this.options.uppercase?"&BBOX=":"&bbox=")+f},setParams:function(e,t){return d(this.wmsParams,e),t||this.redraw(),this}});function Mr(e,t){return new mo(e,t)}Ot.WMS=mo,ho.wms=Mr;var ct=Je.extend({options:{padding:.1},initialize:function(e){C(this,e),m(this),this._layers=this._layers||{}},onAdd:function(){this._container||(this._initContainer(),Z(this._container,"leaflet-zoom-animated")),this.getPane().appendChild(this._container),this._update(),this.on("update",this._updatePaths,this)},onRemove:function(){this.off("update",this._updatePaths,this),this._destroyContainer()},getEvents:function(){var e={viewreset:this._reset,zoom:this._onZoom,moveend:this._update,zoomend:this._onZoomEnd};return this._zoomAnimated&&(e.zoomanim=this._onAnimZoom),e},_onAnimZoom:function(e){this._updateTransform(e.center,e.zoom)},_onZoom:function(){this._updateTransform(this._map.getCenter(),this._map.getZoom())},_updateTransform:function(e,t){var i=this._map.getZoomScale(t,this._zoom),n=this._map.getSize().multiplyBy(.5+this.options.padding),l=this._map.project(this._center,t),c=n.multiplyBy(-i).add(l).subtract(this._map._getNewPixelOrigin(e,t));I.any3d?yt(this._container,c,i):ge(this._container,c)},_reset:function(){this._update(),this._updateTransform(this._center,this._zoom);for(var e in this._layers)this._layers[e]._reset()},_onZoomEnd:function(){for(var e in this._layers)this._layers[e]._project()},_updatePaths:function(){for(var e in this._layers)this._layers[e]._update()},_update:function(){var e=this.options.padding,t=this._map.getSize(),i=this._map.containerPointToLayerPoint(t.multiplyBy(-e)).round();this._bounds=new ce(i,i.add(t.multiplyBy(1+e*2)).round()),this._center=this._map.getCenter(),this._zoom=this._map.getZoom()}}),fo=ct.extend({options:{tolerance:0},getEvents:function(){var e=ct.prototype.getEvents.call(this);return e.viewprereset=this._onViewPreReset,e},_onViewPreReset:function(){this._postponeUpdatePaths=!0},onAdd:function(){ct.prototype.onAdd.call(this),this._draw()},_initContainer:function(){var e=this._container=document.createElement("canvas");F(e,"mousemove",this._onMouseMove,this),F(e,"click dblclick mousedown mouseup contextmenu",this._onClick,this),F(e,"mouseout",this._handleMouseOut,this),e._leaflet_disable_events=!0,this._ctx=e.getContext("2d")},_destroyContainer:function(){he(this._redrawRequest),delete this._ctx,ue(this._container),re(this._container),delete this._container},_updatePaths:function(){if(!this._postponeUpdatePaths){var e;this._redrawBounds=null;for(var t in this._layers)e=this._layers[t],e._update();this._redraw()}},_update:function(){if(!(this._map._animatingZoom&&this._bounds)){ct.prototype._update.call(this);var e=this._bounds,t=this._container,i=e.getSize(),n=I.retina?2:1;ge(t,e.min),t.width=n*i.x,t.height=n*i.y,t.style.width=i.x+"px",t.style.height=i.y+"px",I.retina&&this._ctx.scale(2,2),this._ctx.translate(-e.min.x,-e.min.y),this.fire("update")}},_reset:function(){ct.prototype._reset.call(this),this._postponeUpdatePaths&&(this._postponeUpdatePaths=!1,this._updatePaths())},_initPath:function(e){this._updateDashArray(e),this._layers[m(e)]=e;var t=e._order={layer:e,prev:this._drawLast,next:null};this._drawLast&&(this._drawLast.next=t),this._drawLast=t,this._drawFirst=this._drawFirst||this._drawLast},_addPath:function(e){this._requestRedraw(e)},_removePath:function(e){var t=e._order,i=t.next,n=t.prev;i?i.prev=n:this._drawLast=n,n?n.next=i:this._drawFirst=i,delete e._order,delete this._layers[m(e)],this._requestRedraw(e)},_updatePath:function(e){this._extendRedrawBounds(e),e._project(),e._update(),this._requestRedraw(e)},_updateStyle:function(e){this._updateDashArray(e),this._requestRedraw(e)},_updateDashArray:function(e){if(typeof e.options.dashArray=="string"){var t=e.options.dashArray.split(/[, ]+/),i=[],n,l;for(l=0;l<t.length;l++){if(n=Number(t[l]),isNaN(n))return;i.push(n)}e.options._dashArray=i}else e.options._dashArray=e.options.dashArray},_requestRedraw:function(e){this._map&&(this._extendRedrawBounds(e),this._redrawRequest=this._redrawRequest||Q(this._redraw,this))},_extendRedrawBounds:function(e){if(e._pxBounds){var t=(e.options.weight||0)+1;this._redrawBounds=this._redrawBounds||new ce,this._redrawBounds.extend(e._pxBounds.min.subtract([t,t])),this._redrawBounds.extend(e._pxBounds.max.add([t,t]))}},_redraw:function(){this._redrawRequest=null,this._redrawBounds&&(this._redrawBounds.min._floor(),this._redrawBounds.max._ceil()),this._clear(),this._draw(),this._redrawBounds=null},_clear:function(){var e=this._redrawBounds;if(e){var t=e.getSize();this._ctx.clearRect(e.min.x,e.min.y,t.x,t.y)}else this._ctx.save(),this._ctx.setTransform(1,0,0,1,0,0),this._ctx.clearRect(0,0,this._container.width,this._container.height),this._ctx.restore()},_draw:function(){var e,t=this._redrawBounds;if(this._ctx.save(),t){var i=t.getSize();this._ctx.beginPath(),this._ctx.rect(t.min.x,t.min.y,i.x,i.y),this._ctx.clip()}this._drawing=!0;for(var n=this._drawFirst;n;n=n.next)e=n.layer,(!t||e._pxBounds&&e._pxBounds.intersects(t))&&e._updatePath();this._drawing=!1,this._ctx.restore()},_updatePoly:function(e,t){if(this._drawing){var i,n,l,c,f=e._parts,b=f.length,x=this._ctx;if(b){for(x.beginPath(),i=0;i<b;i++){for(n=0,l=f[i].length;n<l;n++)c=f[i][n],x[n?"lineTo":"moveTo"](c.x,c.y);t&&x.closePath()}this._fillStroke(x,e)}}},_updateCircle:function(e){if(!(!this._drawing||e._empty())){var t=e._point,i=this._ctx,n=Math.max(Math.round(e._radius),1),l=(Math.max(Math.round(e._radiusY),1)||n)/n;l!==1&&(i.save(),i.scale(1,l)),i.beginPath(),i.arc(t.x,t.y/l,n,0,Math.PI*2,!1),l!==1&&i.restore(),this._fillStroke(i,e)}},_fillStroke:function(e,t){var i=t.options;i.fill&&(e.globalAlpha=i.fillOpacity,e.fillStyle=i.fillColor||i.color,e.fill(i.fillRule||"evenodd")),i.stroke&&i.weight!==0&&(e.setLineDash&&e.setLineDash(t.options&&t.options._dashArray||[]),e.globalAlpha=i.opacity,e.lineWidth=i.weight,e.strokeStyle=i.color,e.lineCap=i.lineCap,e.lineJoin=i.lineJoin,e.stroke())},_onClick:function(e){for(var t=this._map.mouseEventToLayerPoint(e),i,n,l=this._drawFirst;l;l=l.next)i=l.layer,i.options.interactive&&i._containsPoint(t)&&(!(e.type==="click"||e.type==="preclick")||!this._map._draggableMoved(i))&&(n=i);this._fireEvent(n?[n]:!1,e)},_onMouseMove:function(e){if(!(!this._map||this._map.dragging.moving()||this._map._animatingZoom)){var t=this._map.mouseEventToLayerPoint(e);this._handleMouseHover(e,t)}},_handleMouseOut:function(e){var t=this._hoveredLayer;t&&(me(this._container,"leaflet-interactive"),this._fireEvent([t],e,"mouseout"),this._hoveredLayer=null,this._mouseHoverThrottled=!1)},_handleMouseHover:function(e,t){if(!this._mouseHoverThrottled){for(var i,n,l=this._drawFirst;l;l=l.next)i=l.layer,i.options.interactive&&i._containsPoint(t)&&(n=i);n!==this._hoveredLayer&&(this._handleMouseOut(e),n&&(Z(this._container,"leaflet-interactive"),this._fireEvent([n],e,"mouseover"),this._hoveredLayer=n)),this._fireEvent(this._hoveredLayer?[this._hoveredLayer]:!1,e),this._mouseHoverThrottled=!0,setTimeout(p(function(){this._mouseHoverThrottled=!1},this),32)}},_fireEvent:function(e,t,i){this._map._fireDOMEvent(t,i||t.type,e)},_bringToFront:function(e){var t=e._order;if(t){var i=t.next,n=t.prev;if(i)i.prev=n;else return;n?n.next=i:i&&(this._drawFirst=i),t.prev=this._drawLast,this._drawLast.next=t,t.next=null,this._drawLast=t,this._requestRedraw(e)}},_bringToBack:function(e){var t=e._order;if(t){var i=t.next,n=t.prev;if(n)n.next=i;else return;i?i.prev=n:n&&(this._drawLast=n),t.prev=null,t.next=this._drawFirst,this._drawFirst.prev=t,this._drawFirst=t,this._requestRedraw(e)}}});function vo(e){return I.canvas?new fo(e):null}var li=function(){try{return document.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(e){return document.createElement("<lvml:"+e+' class="lvml">')}}catch{}return function(e){return document.createElement("<"+e+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}(),Sr={_initContainer:function(){this._container=Y("div","leaflet-vml-container")},_update:function(){this._map._animatingZoom||(ct.prototype._update.call(this),this.fire("update"))},_initPath:function(e){var t=e._container=li("shape");Z(t,"leaflet-vml-shape "+(this.options.className||"")),t.coordsize="1 1",e._path=li("path"),t.appendChild(e._path),this._updateStyle(e),this._layers[m(e)]=e},_addPath:function(e){var t=e._container;this._container.appendChild(t),e.options.interactive&&e.addInteractiveTarget(t)},_removePath:function(e){var t=e._container;ue(t),e.removeInteractiveTarget(t),delete this._layers[m(e)]},_updateStyle:function(e){var t=e._stroke,i=e._fill,n=e.options,l=e._container;l.stroked=!!n.stroke,l.filled=!!n.fill,n.stroke?(t||(t=e._stroke=li("stroke")),l.appendChild(t),t.weight=n.weight+"px",t.color=n.color,t.opacity=n.opacity,n.dashArray?t.dashStyle=ne(n.dashArray)?n.dashArray.join(" "):n.dashArray.replace(/( *, *)/g," "):t.dashStyle="",t.endcap=n.lineCap.replace("butt","flat"),t.joinstyle=n.lineJoin):t&&(l.removeChild(t),e._stroke=null),n.fill?(i||(i=e._fill=li("fill")),l.appendChild(i),i.color=n.fillColor||n.color,i.opacity=n.fillOpacity):i&&(l.removeChild(i),e._fill=null)},_updateCircle:function(e){var t=e._point.round(),i=Math.round(e._radius),n=Math.round(e._radiusY||i);this._setPath(e,e._empty()?"M0 0":"AL "+t.x+","+t.y+" "+i+","+n+" 0,"+65535*360)},_setPath:function(e,t){e._path.v=t},_bringToFront:function(e){Pt(e._container)},_bringToBack:function(e){At(e._container)}},Oi=I.vml?li:ba,di=ct.extend({_initContainer:function(){this._container=Oi("svg"),this._container.setAttribute("pointer-events","none"),this._rootGroup=Oi("g"),this._container.appendChild(this._rootGroup)},_destroyContainer:function(){ue(this._container),re(this._container),delete this._container,delete this._rootGroup,delete this._svgSize},_update:function(){if(!(this._map._animatingZoom&&this._bounds)){ct.prototype._update.call(this);var e=this._bounds,t=e.getSize(),i=this._container;(!this._svgSize||!this._svgSize.equals(t))&&(this._svgSize=t,i.setAttribute("width",t.x),i.setAttribute("height",t.y)),ge(i,e.min),i.setAttribute("viewBox",[e.min.x,e.min.y,t.x,t.y].join(" ")),this.fire("update")}},_initPath:function(e){var t=e._path=Oi("path");e.options.className&&Z(t,e.options.className),e.options.interactive&&Z(t,"leaflet-interactive"),this._updateStyle(e),this._layers[m(e)]=e},_addPath:function(e){this._rootGroup||this._initContainer(),this._rootGroup.appendChild(e._path),e.addInteractiveTarget(e._path)},_removePath:function(e){ue(e._path),e.removeInteractiveTarget(e._path),delete this._layers[m(e)]},_updatePath:function(e){e._project(),e._update()},_updateStyle:function(e){var t=e._path,i=e.options;t&&(i.stroke?(t.setAttribute("stroke",i.color),t.setAttribute("stroke-opacity",i.opacity),t.setAttribute("stroke-width",i.weight),t.setAttribute("stroke-linecap",i.lineCap),t.setAttribute("stroke-linejoin",i.lineJoin),i.dashArray?t.setAttribute("stroke-dasharray",i.dashArray):t.removeAttribute("stroke-dasharray"),i.dashOffset?t.setAttribute("stroke-dashoffset",i.dashOffset):t.removeAttribute("stroke-dashoffset")):t.setAttribute("stroke","none"),i.fill?(t.setAttribute("fill",i.fillColor||i.color),t.setAttribute("fill-opacity",i.fillOpacity),t.setAttribute("fill-rule",i.fillRule||"evenodd")):t.setAttribute("fill","none"))},_updatePoly:function(e,t){this._setPath(e,_a(e._parts,t))},_updateCircle:function(e){var t=e._point,i=Math.max(Math.round(e._radius),1),n=Math.max(Math.round(e._radiusY),1)||i,l="a"+i+","+n+" 0 1,0 ",c=e._empty()?"M0 0":"M"+(t.x-i)+","+t.y+l+i*2+",0 "+l+-i*2+",0 ";this._setPath(e,c)},_setPath:function(e,t){e._path.setAttribute("d",t)},_bringToFront:function(e){Pt(e._path)},_bringToBack:function(e){At(e._path)}});I.vml&&di.include(Sr);function go(e){return I.svg||I.vml?new di(e):null}G.include({getRenderer:function(e){var t=e.options.renderer||this._getPaneRenderer(e.options.pane)||this.options.renderer||this._renderer;return t||(t=this._renderer=this._createRenderer()),this.hasLayer(t)||this.addLayer(t),t},_getPaneRenderer:function(e){if(e==="overlayPane"||e===void 0)return!1;var t=this._paneRenderers[e];return t===void 0&&(t=this._createRenderer({pane:e}),this._paneRenderers[e]=t),t},_createRenderer:function(e){return this.options.preferCanvas&&vo(e)||go(e)}});var yo=Bt.extend({initialize:function(e,t){Bt.prototype.initialize.call(this,this._boundsToLatLngs(e),t)},setBounds:function(e){return this.setLatLngs(this._boundsToLatLngs(e))},_boundsToLatLngs:function(e){return e=ve(e),[e.getSouthWest(),e.getNorthWest(),e.getNorthEast(),e.getSouthEast()]}});function Pr(e,t){return new yo(e,t)}di.create=Oi,di.pointsToPath=_a,dt.geometryToLayer=Si,dt.coordsToLatLng=Bn,dt.coordsToLatLngs=Pi,dt.latLngToCoords=Rn,dt.latLngsToCoords=Ai,dt.getFeature=Rt,dt.asFeature=Ii,G.mergeOptions({boxZoom:!0});var bo=tt.extend({initialize:function(e){this._map=e,this._container=e._container,this._pane=e._panes.overlayPane,this._resetStateTimeout=0,e.on("unload",this._destroy,this)},addHooks:function(){F(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){re(this._container,"mousedown",this._onMouseDown,this)},moved:function(){return this._moved},_destroy:function(){ue(this._pane),delete this._pane},_resetState:function(){this._resetStateTimeout=0,this._moved=!1},_clearDeferredResetState:function(){this._resetStateTimeout!==0&&(clearTimeout(this._resetStateTimeout),this._resetStateTimeout=0)},_onMouseDown:function(e){if(!e.shiftKey||e.which!==1&&e.button!==1)return!1;this._clearDeferredResetState(),this._resetState(),ei(),yn(),this._startPoint=this._map.mouseEventToContainerPoint(e),F(document,{contextmenu:xt,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseMove:function(e){this._moved||(this._moved=!0,this._box=Y("div","leaflet-zoom-box",this._container),Z(this._container,"leaflet-crosshair"),this._map.fire("boxzoomstart")),this._point=this._map.mouseEventToContainerPoint(e);var t=new ce(this._point,this._startPoint),i=t.getSize();ge(this._box,t.min),this._box.style.width=i.x+"px",this._box.style.height=i.y+"px"},_finish:function(){this._moved&&(ue(this._box),me(this._container,"leaflet-crosshair")),ti(),bn(),re(document,{contextmenu:xt,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseUp:function(e){if(!(e.which!==1&&e.button!==1)&&(this._finish(),!!this._moved)){this._clearDeferredResetState(),this._resetStateTimeout=setTimeout(p(this._resetState,this),0);var t=new Re(this._map.containerPointToLatLng(this._startPoint),this._map.containerPointToLatLng(this._point));this._map.fitBounds(t).fire("boxzoomend",{boxZoomBounds:t})}},_onKeyDown:function(e){e.keyCode===27&&(this._finish(),this._clearDeferredResetState(),this._resetState())}});G.addInitHook("addHandler","boxZoom",bo),G.mergeOptions({doubleClickZoom:!0});var _o=tt.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(e){var t=this._map,i=t.getZoom(),n=t.options.zoomDelta,l=e.originalEvent.shiftKey?i-n:i+n;t.options.doubleClickZoom==="center"?t.setZoom(l):t.setZoomAround(e.containerPoint,l)}});G.addInitHook("addHandler","doubleClickZoom",_o),G.mergeOptions({dragging:!0,inertia:!0,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,easeLinearity:.2,worldCopyJump:!1,maxBoundsViscosity:0});var xo=tt.extend({addHooks:function(){if(!this._draggable){var e=this._map;this._draggable=new pt(e._mapPane,e._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),this._draggable.on("predrag",this._onPreDragLimit,this),e.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDragWrap,this),e.on("zoomend",this._onZoomEnd,this),e.whenReady(this._onZoomEnd,this))}Z(this._map._container,"leaflet-grab leaflet-touch-drag"),this._draggable.enable(),this._positions=[],this._times=[]},removeHooks:function(){me(this._map._container,"leaflet-grab"),me(this._map._container,"leaflet-touch-drag"),this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},moving:function(){return this._draggable&&this._draggable._moving},_onDragStart:function(){var e=this._map;if(e._stop(),this._map.options.maxBounds&&this._map.options.maxBoundsViscosity){var t=ve(this._map.options.maxBounds);this._offsetLimit=Be(this._map.latLngToContainerPoint(t.getNorthWest()).multiplyBy(-1),this._map.latLngToContainerPoint(t.getSouthEast()).multiplyBy(-1).add(this._map.getSize())),this._viscosity=Math.min(1,Math.max(0,this._map.options.maxBoundsViscosity))}else this._offsetLimit=null;e.fire("movestart").fire("dragstart"),e.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(e){if(this._map.options.inertia){var t=this._lastTime=+new Date,i=this._lastPos=this._draggable._absPos||this._draggable._newPos;this._positions.push(i),this._times.push(t),this._prunePositions(t)}this._map.fire("move",e).fire("drag",e)},_prunePositions:function(e){for(;this._positions.length>1&&e-this._times[0]>50;)this._positions.shift(),this._times.shift()},_onZoomEnd:function(){var e=this._map.getSize().divideBy(2),t=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=t.subtract(e).x,this._worldWidth=this._map.getPixelWorldBounds().getSize().x},_viscousLimit:function(e,t){return e-(e-t)*this._viscosity},_onPreDragLimit:function(){if(!(!this._viscosity||!this._offsetLimit)){var e=this._draggable._newPos.subtract(this._draggable._startPos),t=this._offsetLimit;e.x<t.min.x&&(e.x=this._viscousLimit(e.x,t.min.x)),e.y<t.min.y&&(e.y=this._viscousLimit(e.y,t.min.y)),e.x>t.max.x&&(e.x=this._viscousLimit(e.x,t.max.x)),e.y>t.max.y&&(e.y=this._viscousLimit(e.y,t.max.y)),this._draggable._newPos=this._draggable._startPos.add(e)}},_onPreDragWrap:function(){var e=this._worldWidth,t=Math.round(e/2),i=this._initialWorldOffset,n=this._draggable._newPos.x,l=(n-t+i)%e+t-i,c=(n+t+i)%e-t-i,f=Math.abs(l+i)<Math.abs(c+i)?l:c;this._draggable._absPos=this._draggable._newPos.clone(),this._draggable._newPos.x=f},_onDragEnd:function(e){var t=this._map,i=t.options,n=!i.inertia||e.noInertia||this._times.length<2;if(t.fire("dragend",e),n)t.fire("moveend");else{this._prunePositions(+new Date);var l=this._lastPos.subtract(this._positions[0]),c=(this._lastTime-this._times[0])/1e3,f=i.easeLinearity,b=l.multiplyBy(f/c),x=b.distanceTo([0,0]),E=Math.min(i.inertiaMaxSpeed,x),S=b.multiplyBy(E/x),N=E/(i.inertiaDeceleration*f),q=S.multiplyBy(-N/2).round();!q.x&&!q.y?t.fire("moveend"):(q=t._limitOffset(q,t.options.maxBounds),Q(function(){t.panBy(q,{duration:N,easeLinearity:f,noMoveStart:!0,animate:!0})}))}}});G.addInitHook("addHandler","dragging",xo),G.mergeOptions({keyboard:!0,keyboardPanDelta:80});var wo=tt.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,54,173]},initialize:function(e){this._map=e,this._setPanDelta(e.options.keyboardPanDelta),this._setZoomDelta(e.options.zoomDelta)},addHooks:function(){var e=this._map._container;e.tabIndex<=0&&(e.tabIndex="0"),F(e,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.on({focus:this._addHooks,blur:this._removeHooks},this)},removeHooks:function(){this._removeHooks(),re(this._map._container,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.off({focus:this._addHooks,blur:this._removeHooks},this)},_onMouseDown:function(){if(!this._focused){var e=document.body,t=document.documentElement,i=e.scrollTop||t.scrollTop,n=e.scrollLeft||t.scrollLeft;this._map._container.focus(),window.scrollTo(n,i)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanDelta:function(e){var t=this._panKeys={},i=this.keyCodes,n,l;for(n=0,l=i.left.length;n<l;n++)t[i.left[n]]=[-1*e,0];for(n=0,l=i.right.length;n<l;n++)t[i.right[n]]=[e,0];for(n=0,l=i.down.length;n<l;n++)t[i.down[n]]=[0,e];for(n=0,l=i.up.length;n<l;n++)t[i.up[n]]=[0,-1*e]},_setZoomDelta:function(e){var t=this._zoomKeys={},i=this.keyCodes,n,l;for(n=0,l=i.zoomIn.length;n<l;n++)t[i.zoomIn[n]]=e;for(n=0,l=i.zoomOut.length;n<l;n++)t[i.zoomOut[n]]=-e},_addHooks:function(){F(document,"keydown",this._onKeyDown,this)},_removeHooks:function(){re(document,"keydown",this._onKeyDown,this)},_onKeyDown:function(e){if(!(e.altKey||e.ctrlKey||e.metaKey)){var t=e.keyCode,i=this._map,n;if(t in this._panKeys){if(!i._panAnim||!i._panAnim._inProgress)if(n=this._panKeys[t],e.shiftKey&&(n=H(n).multiplyBy(3)),i.options.maxBounds&&(n=i._limitOffset(H(n),i.options.maxBounds)),i.options.worldCopyJump){var l=i.wrapLatLng(i.unproject(i.project(i.getCenter()).add(n)));i.panTo(l)}else i.panBy(n)}else if(t in this._zoomKeys)i.setZoom(i.getZoom()+(e.shiftKey?3:1)*this._zoomKeys[t]);else if(t===27&&i._popup&&i._popup.options.closeOnEscapeKey)i.closePopup();else return;xt(e)}}});G.addInitHook("addHandler","keyboard",wo),G.mergeOptions({scrollWheelZoom:!0,wheelDebounceTime:40,wheelPxPerZoomLevel:60});var ko=tt.extend({addHooks:function(){F(this._map._container,"wheel",this._onWheelScroll,this),this._delta=0},removeHooks:function(){re(this._map._container,"wheel",this._onWheelScroll,this)},_onWheelScroll:function(e){var t=Va(e),i=this._map.options.wheelDebounceTime;this._delta+=t,this._lastMousePos=this._map.mouseEventToContainerPoint(e),this._startTime||(this._startTime=+new Date);var n=Math.max(i-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(p(this._performZoom,this),n),xt(e)},_performZoom:function(){var e=this._map,t=e.getZoom(),i=this._map.options.zoomSnap||0;e._stop();var n=this._delta/(this._map.options.wheelPxPerZoomLevel*4),l=4*Math.log(2/(1+Math.exp(-Math.abs(n))))/Math.LN2,c=i?Math.ceil(l/i)*i:l,f=e._limitZoom(t+(this._delta>0?c:-c))-t;this._delta=0,this._startTime=null,f&&(e.options.scrollWheelZoom==="center"?e.setZoom(t+f):e.setZoomAround(this._lastMousePos,t+f))}});G.addInitHook("addHandler","scrollWheelZoom",ko);var Ar=600;G.mergeOptions({tapHold:I.touchNative&&I.safari&&I.mobile,tapTolerance:15});var Lo=tt.extend({addHooks:function(){F(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){re(this._map._container,"touchstart",this._onDown,this)},_onDown:function(e){if(clearTimeout(this._holdTimeout),e.touches.length===1){var t=e.touches[0];this._startPos=this._newPos=new O(t.clientX,t.clientY),this._holdTimeout=setTimeout(p(function(){this._cancel(),this._isTapValid()&&(F(document,"touchend",ze),F(document,"touchend touchcancel",this._cancelClickPrevent),this._simulateEvent("contextmenu",t))},this),Ar),F(document,"touchend touchcancel contextmenu",this._cancel,this),F(document,"touchmove",this._onMove,this)}},_cancelClickPrevent:function e(){re(document,"touchend",ze),re(document,"touchend touchcancel",e)},_cancel:function(){clearTimeout(this._holdTimeout),re(document,"touchend touchcancel contextmenu",this._cancel,this),re(document,"touchmove",this._onMove,this)},_onMove:function(e){var t=e.touches[0];this._newPos=new O(t.clientX,t.clientY)},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_simulateEvent:function(e,t){var i=new MouseEvent(e,{bubbles:!0,cancelable:!0,view:window,screenX:t.screenX,screenY:t.screenY,clientX:t.clientX,clientY:t.clientY});i._simulated=!0,t.target.dispatchEvent(i)}});G.addInitHook("addHandler","tapHold",Lo),G.mergeOptions({touchZoom:I.touch,bounceAtZoomLimits:!0});var Co=tt.extend({addHooks:function(){Z(this._map._container,"leaflet-touch-zoom"),F(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){me(this._map._container,"leaflet-touch-zoom"),re(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(e){var t=this._map;if(!(!e.touches||e.touches.length!==2||t._animatingZoom||this._zooming)){var i=t.mouseEventToContainerPoint(e.touches[0]),n=t.mouseEventToContainerPoint(e.touches[1]);this._centerPoint=t.getSize()._divideBy(2),this._startLatLng=t.containerPointToLatLng(this._centerPoint),t.options.touchZoom!=="center"&&(this._pinchStartLatLng=t.containerPointToLatLng(i.add(n)._divideBy(2))),this._startDist=i.distanceTo(n),this._startZoom=t.getZoom(),this._moved=!1,this._zooming=!0,t._stop(),F(document,"touchmove",this._onTouchMove,this),F(document,"touchend touchcancel",this._onTouchEnd,this),ze(e)}},_onTouchMove:function(e){if(!(!e.touches||e.touches.length!==2||!this._zooming)){var t=this._map,i=t.mouseEventToContainerPoint(e.touches[0]),n=t.mouseEventToContainerPoint(e.touches[1]),l=i.distanceTo(n)/this._startDist;if(this._zoom=t.getScaleZoom(l,this._startZoom),!t.options.bounceAtZoomLimits&&(this._zoom<t.getMinZoom()&&l<1||this._zoom>t.getMaxZoom()&&l>1)&&(this._zoom=t._limitZoom(this._zoom)),t.options.touchZoom==="center"){if(this._center=this._startLatLng,l===1)return}else{var c=i._add(n)._divideBy(2)._subtract(this._centerPoint);if(l===1&&c.x===0&&c.y===0)return;this._center=t.unproject(t.project(this._pinchStartLatLng,this._zoom).subtract(c),this._zoom)}this._moved||(t._moveStart(!0,!1),this._moved=!0),he(this._animRequest);var f=p(t._move,t,this._center,this._zoom,{pinch:!0,round:!1},void 0);this._animRequest=Q(f,this,!0),ze(e)}},_onTouchEnd:function(){if(!this._moved||!this._zooming){this._zooming=!1;return}this._zooming=!1,he(this._animRequest),re(document,"touchmove",this._onTouchMove,this),re(document,"touchend touchcancel",this._onTouchEnd,this),this._map.options.zoomAnimation?this._map._animateZoom(this._center,this._map._limitZoom(this._zoom),!0,this._map.options.zoomSnap):this._map._resetView(this._center,this._map._limitZoom(this._zoom))}});G.addInitHook("addHandler","touchZoom",Co),G.BoxZoom=bo,G.DoubleClickZoom=_o,G.Drag=xo,G.Keyboard=wo,G.ScrollWheelZoom=ko,G.TapHold=Lo,G.TouchZoom=Co,s.Bounds=ce,s.Browser=I,s.CRS=st,s.Canvas=fo,s.Circle=$n,s.CircleMarker=Mi,s.Class=de,s.Control=Ke,s.DivIcon=po,s.DivOverlay=it,s.DomEvent=Js,s.DomUtil=Gs,s.Draggable=pt,s.Evented=Te,s.FeatureGroup=rt,s.GeoJSON=dt,s.GridLayer=ri,s.Handler=tt,s.Icon=$t,s.ImageOverlay=$i,s.LatLng=ae,s.LatLngBounds=Re,s.Layer=Je,s.LayerGroup=It,s.LineUtil=dr,s.Map=G,s.Marker=zi,s.Mixin=nr,s.Path=ht,s.Point=O,s.PolyUtil=ar,s.Polygon=Bt,s.Polyline=lt,s.Popup=Bi,s.PosAnimation=Wa,s.Projection=cr,s.Rectangle=yo,s.Renderer=ct,s.SVG=di,s.SVGOverlay=uo,s.TileLayer=Ot,s.Tooltip=Ri,s.Transformation=sn,s.Util=$e,s.VideoOverlay=co,s.bind=p,s.bounds=Be,s.canvas=vo,s.circle=yr,s.circleMarker=gr,s.control=ai,s.divIcon=Tr,s.extend=d,s.featureGroup=mr,s.geoJSON=lo,s.geoJson=xr,s.gridLayer=zr,s.icon=fr,s.imageOverlay=wr,s.latLng=W,s.latLngBounds=ve,s.layerGroup=hr,s.map=Ys,s.marker=vr,s.point=H,s.polygon=_r,s.polyline=br,s.popup=Cr,s.rectangle=Pr,s.setOptions=C,s.stamp=m,s.svg=go,s.svgOverlay=Lr,s.tileLayer=ho,s.tooltip=Er,s.transformation=Jt,s.version=r,s.videoOverlay=kr;var Ir=window.L;s.noConflict=function(){return window.L=Ir,this},window.L=s})})(ia,ia.exports);var Cl=ia.exports;const be=Ll(Cl),ha="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABSCAMAAAAhFXfZAAAC91BMVEVMaXEzeak2f7I4g7g3g7cua5gzeKg8hJo3grY4g7c3grU0gLI2frE0daAubJc2gbQwd6QzeKk2gLMtd5sxdKIua5g1frA2f7IydaM0e6w2fq41fK01eqo3grgubJgta5cxdKI1f7AydaQydaMxc6EubJgvbJkwcZ4ubZkwcJwubZgubJcydqUydKIxapgubJctbJcubZcubJcvbJYubJcvbZkubJctbJctbZcubJg2f7AubJcrbZcubJcubJcua5g3grY0fq8ubJcubJdEkdEwhsw6i88vhswuhcsuhMtBjMgthMsrg8srgss6is8qgcs8i9A9iMYtg8spgcoogMo7hcMngMonf8olfso4gr8kfck5iM8jfMk4iM8he8k1fro7itAgesk2hs8eecgzfLcofssdeMg0hc4cd8g2hcsxeLQbdsgZdcgxeLImfcszhM0vda4xgckzhM4xg84wf8Yxgs4udKsvfcQucqhUndROmdM1fK0wcZ8vb5w0eqpQm9MzeKhXoNVcpdYydKNWn9VZotVKltJFjsIwcJ1Rms9OlslLmtH///8+kc9epdYzd6dbo9VHkMM2f7FHmNBClM8ydqVcpNY9hro3gLM9hLczealQmcw3fa46f7A8gLMxc6I3eagyc6FIldJMl9JSnNRSntNNl9JPnNJFi75UnM9ZodVKksg8kM45jc09e6ZHltFBk883gbRBh7pDk9EwcaBzn784g7dKkcY2i81Om9M7j85Llc81is09g7Q4grY/j9A0eqxKmdFFltBEjcXf6fFImdBCiLxJl9FGlNFBi78yiMxVndEvbpo6js74+vx+psPP3+o/ks5HkcpGmNCjwdZCkNDM3ehYoNJEls+lxNkxh8xHks0+jdC1zd5Lg6r+/v/H2ufz9/o3jM3t8/edvdM/k89Th61OiLBSjbZklbaTt9BfptdjmL1AicBHj8hGk9FAgK1dkLNTjLRekrdClc/k7fM0icy0y9tgp9c4jc2NtM9Dlc8zicxeXZn3AAAAQ3RSTlMAHDdTb4yPA+LtnEQmC4L2EmHqB7XA0d0sr478x4/Yd5i1zOfyPkf1sLVq4Nh3FvjxopQ2/STNuFzUwFIwxKaejILpIBEV9wAABhVJREFUeF6s1NdyFEcYBeBeoQIhRAkLlRDGrhIgY3BJL8CVeKzuyXFzzjkn5ZxzzuScg3PO8cKzu70JkO0LfxdTU//pM9vTu7Xgf6KqOVTb9X7toRrVEfBf1HTVjZccrT/2by1VV928Yty9ZbVuucdz90frG8DBjl9pVApbOstvmMuvVgaNXSfAAd6pGxpy6yxf5ph43pS/4f3uoaGm2rdu72S9xzOvMymkZFq/ptDrk90mhW7e4zl7HLzhxGWPR20xmSxJ/VqldG5m9XhaVOA1DadsNh3Pu5L2N6QtPO/32JpqQBVVk20oy/Pi2s23WEvyfHbe1thadVQttvm7Llf65gGmXK67XtupyoM7HQhmXdLS8oGWJNeOJ3C5fG5XCEJnkez3/oFdsvgJ4l2ANZwhrJKk/7OSXa+3Vw2WJMlKnGkobouYk6T0TyX30klOUnTD9HJ5qpckL3EW/w4XF3Xd0FGywXUrstrclVsqz5Pd/sXFYyDnPdrLcQODmGOK47IZb4CmibmMn+MYRzFZ5jg33ZL/EJrWcszHmANy3ARBK/IXtciJy8VsitPSdE3uuHxzougojcUdr8/32atnz/ev3f/K5wtpxUTpcaI45zusVDpYtZi+jg0oU9b3x74h7+n9ABvYEZeKaVq0sh0AtLKsFtqNBdeT0MrSzwwlq9+x6xAO4tgOtSzbCjrNQQiNvQUbUEubvzBUeGw26yDCsRHCoLkTHDa7IdOLIThs/gHvChszh2CimE8peRs47cxANI0lYNB5y1DljpOF0IhzBDPOZnDOqYYbeGKECbPzWnXludPphw5c2YBq5zlwXphIbO4VDCZ0gnPfUO1TwZoYwAs2ExPCedAu9DAjfQUjzITQb3jNj0KG2Sgt6BHaQUdYzWz+XmBktOHwanXjaSTcwwziBcuMOtwBmqPrTOxFQR/DRKKPqyur0aiW6cULYsx6tBm0jXpR/AUWR6HRq9WVW6MRhIq5jLyjbaCTDCijyYJNpCajdyobP/eTw0iexBAKkJ3gA5KcQb2zBXsIBckn+xVv8jkZSaEFHE+jFEleAEfayRU0MouNoBmB/L50Ai/HSLIHxcrpCvnhSQAuakKp2C/YbCylJjXRVy/z3+Kv/RrNcCo+WUzlVEhzKffnTQnxeN9fWF88fiNCUdSTsaufaChKWInHeysygfpIqagoakW+vV20J8uyl6TyNKEZWV4oRSPyCkWpgOLSbkCObT8o2r6tlG58HQquf6O0v50tB7JM7F4EORd2dx/K0w/KHsVkLPaoYrwgP/y7krr3SSMA4zj+OBgmjYkxcdIJQyQRKgg2viX9Hddi9UBb29LrKR7CVVEEEXWojUkXNyfTNDE14W9gbHJNuhjDettN3ZvbOvdOqCD3Jp/9l+/wJE+9PkYGjx/fqkys3S2rMozM/o2106rfMUINo6hVqz+eu/hd1c4xTg0TAfy5kV+4UG6+IthHTU9woWmxuKNbTfuCSfovBCxq7EtHqvYL4Sm6F8GVxsSXHMQ07TOi1DKtZxjWaaIyi4CXWjxPccUw8WVbMYY5wxC1mzEyXMJWkllpRloi+Kkoq69sxBTlElF6aAxYUbjXNlhlDZilDnM4U5SlN5biRsRHnbx3mbeWjEh4mEyiuJDl5XcWVmX5GvNkFgLWZM5qwsop4/AWfLhU1cR7k1VVvcYCWRkOI6Xy5gmnphCYIkvzuNYzHzosq2oNk2RtSs8khfUOfHIDgR6ysYBaMpl4uEgk2U/oJTs9AaTSwma7dT69geAE2ZpEjUsn2ieJNHeKfrI3EcAGJ2ZaNgVuC8EBctCLc57P5u5led6IOBkIYkuQMrmmjChs4VkfOerHqSBkPzZlhe06RslZ3zMjk2sscqKwY0RcjKK+LWbzd7KiHhkncs/siFJ+V5eXxD34B8nVuJEpGJNmxN2gH3vSvp7J70tF+D1Ej8qUJD1TkErAND2GZwTFg/LubvmgiBG3SOvdlsqFQrkEzJCL1rstlnVFROixZoDDSuXQFHESwVGlcuQcMb/b42NgjLowh5MTDFE3vNB5qStRIErdCQEh6pLPR92anSUb/wAIhldAaDMpGgAAAABJRU5ErkJggg==",ma="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=",fa="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC";delete be.Icon.Default.prototype._getIconUrl;be.Icon.Default.mergeOptions({iconRetinaUrl:ha,iconUrl:ma,shadowUrl:fa});const El="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",Tl='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';function zl(a){if(!a||a.latitude==null||a.longitude==null)return"";const o=Number(a.latitude),s=Number(a.longitude);if(isNaN(o)||isNaN(s))return"";const r=a.maps_url||`https://www.google.com/maps/search/?api=1&query=${o},${s}`,d=`readonly-map-${a.entity_id||"preview"}-${Math.random().toString(36).substring(2,7)}`;return`
    <div class="card mb-6" style="border-top:3px solid var(--primary);">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="card-title" style="display:flex; align-items:center; gap:8px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Location & Geo-Coordinates
        </div>
        <a href="${r}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          Open in Google Maps
        </a>
      </div>
      <div class="card-body" style="padding:16px;">
        <div id="${d}" data-lat="${o}" data-lng="${s}" class="entity-readonly-map-instance" style="height:220px; width:100%; border-radius:6px; border:1px solid var(--border); background:#f1f5f9; z-index:1;"></div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:12px; color:var(--text-muted);">
          <span>Latitude: <strong>${o.toFixed(6)}</strong> • Longitude: <strong>${s.toFixed(6)}</strong></span>
          <span class="badge badge-success" style="font-size:11px;">Verified Coordinates</span>
        </div>
      </div>
    </div>
  `}function Ml(){document.querySelectorAll(".entity-readonly-map-instance").forEach(o=>{if(o.dataset.initialized)return;const s=parseFloat(o.dataset.lat),r=parseFloat(o.dataset.lng);if(!(isNaN(s)||isNaN(r))){o.dataset.initialized="true";try{const d=be.map(o,{center:[s,r],zoom:14,zoomControl:!0,attributionControl:!0,scrollWheelZoom:!1});be.tileLayer(El,{attribution:Tl,maxZoom:19}).addTo(d),be.marker([s,r]).addTo(d),setTimeout(()=>{d.invalidateSize()},200)}catch(d){console.warn("[ReadOnlyMap] Failed to initialize map container:",d)}}})}function U(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}async function va({id:a}){var d;const o=String(a||"").split("?")[0].split("#")[0];if(!o||o==="new"){ie("/entities/new"+(window.location.search||""));return}if(!ot(ie))return;const s=Mt(),r=document.getElementById("app");r.innerHTML=_e(`
    <div class="page-header mb-4" style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div class="page-header-left">
        <div class="topbar-breadcrumb mb-2"><a href="/entities" class="text-link">My Requests</a> / Case #${o}</div>
        <h1 id="header-title">Loading Case...</h1>
      </div>
      <div id="header-extra-actions" style="display:flex; gap:10px;"></div>
    </div>
    
    <div id="detail-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,`Case #${o}`),xe();try{const[u,p,h,m,v]=await Promise.all([le.get(o),as.list(o).catch(()=>({data:[]})),le.audit(o).catch(()=>({data:{auditLogs:[],approvalHistory:[]}})),le.getLineage(o).catch(()=>({data:{current:null,parent:null,children:[],rules:[]}})),le.workflow(o).catch(()=>({data:{allowedTransitions:[]}}))]),y=u.data,g=p.data||[],w=h.data||{auditLogs:[],approvalHistory:[]},_=m.data||{current:null,parent:null,children:[],rules:[]},z=v.data||{allowedTransitions:[]};let C=[];try{C=(await tn.list({entity_type_id:y.entity_type_id})).data||[]}catch{C=[]}if(document.getElementById("header-title").textContent=y.name,["approved","coordinator_approved","verified","in_progress","resolved","closed"].includes(String(y.status||"").toLowerCase())&&((d=y.entityType)==null?void 0:d.name)!=="Civic Campaign"){const B=document.getElementById("header-extra-actions");B&&(B.innerHTML=`
          <a href="/meme/studio/${y.entity_id}" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:6px; font-weight:700; border-color:#f59e0b; color:#d97706; background:#fffbeb;">
            <span>⚡</span> Create Civic Meme
          </a>
        `)}Sl(document.getElementById("detail-content"),y,g,w,_,z,C,s)}catch(u){console.error("Failed to load case detail:",u),V("Failed to load case details"),document.getElementById("detail-content").innerHTML=`<div class="alert alert-error">Failed to load case #${o}. It may not exist.</div>`}}function Sl(a,o,s,r,d,u,p,h){var $e,de;const m=at(o.entityType),v=["draft","submitted","coordinator_approved","approved"],y=v.indexOf(o.status)!==-1?v.indexOf(o.status):-1,g=o.status==="rejected";let w='<div class="workflow-steps mt-4 mb-2">';v.forEach((j,J)=>{const Te=J<y||J===y&&!g&&o.status==="approved",O=J===y&&o.status!=="approved";w+=`
      <div class="workflow-step">
        <div class="workflow-step-node">
          <div class="workflow-step-circle ${g&&J===y?"rejected":Te?"done":O?"current":""}">${J+1}</div>
          <div class="workflow-step-label mt-1">${Il(j)}</div>
        </div>
        ${J<v.length-1?`<div class="workflow-step-connector ${Te?"done":""}"></div>`:""}
      </div>
    `}),g&&(w+=`
      <div class="workflow-step">
        <div class="workflow-step-connector"></div>
        <div class="workflow-step-node">
          <div class="workflow-step-circle rejected">!</div>
          <div class="workflow-step-label mt-1 text-red-600">Rejected</div>
        </div>
      </div>
    `),w+="</div>";const _=Pl(o,u.allowedTransitions||[],h),z=h&&["coordinator_area","coordinator_general","director","admin"].includes(h.role);let C="";z&&o.status!=="deleted"&&(C=`
      <div class="card mb-6" id="ai-report-card" style="border: 1px solid var(--primary-border); background: #f8fafc;">
        <div class="card-header" style="background: var(--surface); display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border);">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="display:flex; align-items:center; color:var(--primary);">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </span>
            <div>
              <h3 class="card-title" style="color: var(--text-primary); margin:0;">Civic Intelligence Analysis</h3>
              <span style="font-size: 12px; color: var(--text-muted);">AI-Assisted Decision Layer</span>
            </div>
          </div>
          <span class="badge badge-primary" style="font-weight:600;">Executive Analysis</span>
        </div>
        <div class="card-body" id="ai-report-body" style="padding: 1.25rem;">
          <div style="text-align:center; padding: 1rem 0;">
            <p style="color:var(--text-secondary); margin-bottom:1.25rem; font-size:14px; max-width:600px; margin-left:auto; margin-right:auto;">
              Run an automated AI analytical breakdown of this case to inspect observations, patterns, recommendations, and evidence.
            </p>
            <button id="btn-generate-ai" class="btn btn-primary" style="padding:10px 22px; font-weight:600; box-shadow:var(--shadow-sm); display:inline-flex; align-items:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Run Civic Intelligence Analysis
            </button>
          </div>
        </div>
      </div>
    `);let M="";d.children&&d.children.length>0&&(M=`
      <div class="card mb-6" style="border-top:4px solid var(--green-600); background:#f0fdf4; border-color:#bbf7d0;">
        <div class="card-body" style="padding:16px;">
          <div style="display:flex; align-items:flex-start; gap:12px;">
            <div style="display:flex; align-items:center; padding-top:2px; color:#16a34a;">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div style="flex:1;">
              <h4 style="font-size:1rem; font-weight:700; color:#166534; margin-bottom:4px;">
                Civic Automation Executed
              </h4>
              <p style="font-size:0.875rem; color:#15803d; margin-bottom:12px;">
                This case approval automatically triggered <strong>${d.children.length} related civic record(s)</strong> via configured metadata automation rules.
              </p>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${d.children.map(j=>`
                  <div style="padding:10px 14px; background:#ffffff; border:1px solid #a7f3d0; border-radius:6px; font-size:0.875rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:var(--text-primary);">#PR-${String(j.entity_id).padStart(5,"0")} ${U(j.name)}</strong>
                      <span class="badge badge-secondary ml-2">${U(j.type_name)}</span>
                    </div>
                    <a href="/entities/${j.entity_id}" class="btn btn-secondary btn-sm" style="font-size:12px;">View Related Record →</a>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `);const R=s.map(j=>{var J,Te;return`
    <tr>
      <td class="param-key" style="font-weight:600; width:35%; font-size:0.875rem;">${U(((J=j.parameterMaster)==null?void 0:J.label)||((Te=j.parameterMaster)==null?void 0:Te.field_key)||`Parameter #${j.parameter_id}`)}</td>
      <td class="param-val" style="font-size:0.875rem;">${U(j.value||"—")}</td>
    </tr>
  `}).join(""),B=s.length>0?`<div class="table-container"><table class="table"><tbody>${R}</tbody></table></div>`:'<div class="text-muted p-4">No custom parameter values submitted for this case.</div>',ne=r.auditLogs||[];r.approvalHistory;const we=ne.map(j=>`
    <div class="timeline-item mb-3" style="padding:12px; border-left:3px solid var(--primary); background:var(--gray-50); border-radius:4px;">
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
        <span><strong>${U(j.user||"System")}</strong> (${U(j.role||"User")})</span>
        <span>${new Date(j.datetime).toLocaleString()}</span>
      </div>
      <div style="font-size:0.875rem; color:var(--text-primary); margin-top:4px; font-weight:500;">
        ${j.action==="status_transition"?`Status Transition: <strong>${Ct(j.old_status)}</strong> → <strong>${Ct(j.new_status)}</strong>`:`Action Executed: <strong>${j.action}</strong>`}
      </div>
      ${j.reason?`<div style="font-size:0.8rem; color:var(--text-secondary); font-style:italic; margin-top:4px; background:#fff; padding:6px; border-radius:4px; border:1px solid var(--border);">"${U(j.reason)}"</div>`:""}
    </div>
  `).join(""),fe=ne.length>0?`<div>${we}</div>`:'<div class="text-muted p-4">No audit logs recorded yet for this case.</div>';let Me="";p.length>0&&(Me=`
      <div class="card mb-6" style="border-top:3px solid var(--green-600);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            Civic Reports
          </div>
          <span class="badge badge-success">${p.length} Reports</span>
        </div>
        <div class="card-body" style="padding:16px;">
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            ${p.map(j=>`
              <button type="button" class="btn btn-secondary btn-sm execute-rep-btn" data-repid="${j.report_id}" style="display:inline-flex; align-items:center; gap:6px;">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Execute "${U(j.report_name)}"
              </button>
            `).join("")}
          </div>
          <div id="report-result-output" class="mt-4" style="display:none;"></div>
        </div>
      </div>
    `);let D="";(d.parent||d.children&&d.children.length>0)&&(D=`
      <div class="card mb-6" style="border-top:3px solid var(--primary);">
        <div class="card-header">
          <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            Civic Lineage
          </div>
          <div class="card-subtitle">Connected parent and auto-created child civic activities</div>
        </div>
        <div class="card-body" style="padding:16px;">
          ${d.parent?`
            <div style="margin-bottom:12px; padding:12px; background:var(--primary-light); border:1px solid var(--primary-border); border-radius:6px; font-size:13px;">
              <div style="font-size:0.75rem; color:var(--primary); font-weight:700; text-transform:uppercase; margin-bottom:2px;">Parent Case</div>
              <a href="/entities/${d.parent.entity_id}" class="text-link font-medium">#PR-${String(d.parent.entity_id).padStart(5,"0")} ${U(d.parent.name)} (${U((($e=d.parent.entityType)==null?void 0:$e.name)||"Capability")})</a>
            </div>
          `:""}
          ${d.children&&d.children.length>0?`
            <div style="font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:8px;">Linked Child Activities:</div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${d.children.map(j=>`
                <div style="padding:10px; background:var(--surface); border:1px solid var(--border); border-radius:6px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <a href="/entities/${j.entity_id}" class="text-link font-medium">#PR-${String(j.entity_id).padStart(5,"0")} ${U(j.name)}</a>
                    <span class="badge badge-secondary ml-2">${U(j.type_name)}</span>
                  </div>
                  <span class="badge badge-${j.status}">${Ct(j.status)}</span>
                </div>
              `).join("")}
            </div>
          `:""}
        </div>
      </div>
    `),a.innerHTML=`
    <!-- Top Case Summary Card -->
    <div class="card mb-6">
      <div class="card-body" style="padding: 1.5rem;">
        <div class="flex justify-between items-start flex-wrap gap-4 mb-2">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-primary font-semibold">${U(m.title)}</span>
              <span class="badge badge-${o.status}">${Ct(o.status)}</span>
            </div>
            <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:4px 0;">${U(o.name)}</h2>
            <div style="font-size:13px; color:var(--text-muted);">
              Submitted by <strong>${U(((de=o.owner)==null?void 0:de.name)||"System")}</strong> • Jurisdiction Area: <strong>${U(o.area||"—")}</strong> • Location: <strong>${U(o.location||"—")}</strong>
            </div>
          </div>
        </div>
        ${w}
      </div>
    </div>

    ${M}
    ${C}
    ${zl(o)}
    ${Me}
    ${D}

    <!-- Main Detail & Actions Layout -->
    <div class="entity-detail-layout" style="display:grid; grid-template-columns: 2fr 1fr; gap: 20px;">
      <div>
        <div class="card">
          <div class="card-header border-b">
            <div class="tabs">
              <button class="tab-btn active" id="tab-info">Case Details & Parameters</button>
              <button class="tab-btn" id="tab-audit">Activity & Accountability Log</button>
            </div>
          </div>
          <div class="card-body" id="tab-content">
            ${B}
          </div>
        </div>
      </div>

      <div>
        <!-- Dynamic Workflow Actions Box -->
        <div class="card" style="border-top: 4px solid var(--primary);">
          <div class="card-header">
            <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Available Actions
          </div>
            <div class="card-subtitle">Role-permitted workflow actions</div>
          </div>
          <div class="card-body" style="padding:16px;">
            <div class="workflow-actions flex-col gap-2">
              ${_}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;const A=document.getElementById("tab-info"),$=document.getElementById("tab-audit"),K=document.getElementById("tab-content");A&&$&&K&&(A.addEventListener("click",()=>{A.classList.add("active"),$.classList.remove("active"),K.innerHTML=B}),$.addEventListener("click",()=>{$.classList.add("active"),A.classList.remove("active"),K.innerHTML=fe}));const Q=document.getElementById("btn-generate-ai");Q&&Q.addEventListener("click",()=>Ol(o,s)),document.querySelectorAll(".execute-rep-btn").forEach(j=>{j.addEventListener("click",()=>{const J=j.getAttribute("data-repid");Rl(J)})}),$l(o.entity_id),Ml(),typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}function Pl(a,o,s){const r=[],d=String(a.status||"draft").trim().toLowerCase(),u=new Set;if(Array.isArray(o)&&o.length>0&&o.forEach(p=>{const h=p.action||p.to||p.to_status;if(!h||u.has(h))return;u.add(h);const m=h==="rejected",v=Al(d,h),y=m?"btn-danger":"btn-primary";r.push(`
        <button class="btn ${y} btn-full wf-action-btn mt-2" 
          data-to="${U(h)}" 
          data-label="${U(v)}"
          data-reason="${m?"true":"false"}">
          ${U(v)}
        </button>
      `)}),s&&s.role==="admin"&&r.push(`
      <button class="btn btn-secondary btn-full mt-3" id="btn-fire-rules" data-rule="true" style="display:inline-flex; align-items:center; gap:8px; justify-content:center;">
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Execute Automation Rules
      </button>
    `),r.length===0){if(s&&s.role==="coordinator_area"){const p=s.assignedArea||s.assigned_area,h=a.area;if(p&&h&&p.toLowerCase()!==h.toLowerCase())return`
          <div style="padding:14px; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; font-size:13px; color:#9a3412; line-height:1.4;">
            <div style="font-weight:700; color:#c2410c; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Jurisdiction Boundary Constraint
            </div>
            Your coordinator account is assigned to <strong>"${U(p)}"</strong>, but this case belongs to <strong>"${U(h)}"</strong>.
            <div style="margin-top:8px; font-size:12px; color:#7c2d12;">
              Area Coordinators are strictly authorized to verify cases within their own jurisdiction. Only a Coordinator assigned to <strong>${U(h)}</strong> (or a General Coordinator) can verify this case.
            </div>
          </div>
        `}return`<div class="text-muted text-sm text-center py-2">No workflow actions currently permitted for your role (${U((s==null?void 0:s.role)||"user")}) at status "${U(Ct(d))}".</div>`}return r.join("")}function Al(a,o){const s=String(o||"").toLowerCase(),r=String(a||"").toLowerCase();return r==="draft"&&s==="submitted"?"Submit Request":r==="submitted"&&(s==="coordinator_approved"||s==="verified")?"Verify & Recommend Approval":r==="coordinator_approved"&&s==="approved"||r==="verified"&&s==="approved"?"Executive Approval (Director)":s==="rejected"?"Reject Request":`Transition to ${o}`}function Il(a){return a==="draft"?"Draft":a==="submitted"?"Submitted":a==="coordinator_approved"?"Coord Approved":a==="verified"?"Verified":a==="approved"?"Approved":a==="rejected"?"Rejected":a}function $l(a){const o=r=>{const d=r.getAttribute("data-to"),u=r.getAttribute("data-label")||`Transition to ${d}`,p=r.getAttribute("data-reason")==="true";if(r.getAttribute("data-rule")==="true"){Bl(a);return}p?(ta({title:"Provide Reason for Rejection",content:`
          <div class="form-group mb-4">
            <label class="form-label" for="action-reason">Reason for Rejection <span class="required">*</span></label>
            <textarea id="action-reason" class="form-control" rows="3" placeholder="Please state rationale for rejecting this case..." required></textarea>
          </div>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-danger" id="confirm-action-btn">Confirm Rejection</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",qt),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{const m=document.getElementById("action-reason").value.trim();if(!m){V("Reason is required for rejection");return}qt(),Bo(a,d,m)})):(ta({title:`Confirm Action: ${u}`,content:`
          <p style="font-size:0.9rem; color:var(--text-secondary);">
            Are you sure you want to execute <strong>${U(u)}</strong> for case #${a}?
          </p>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-action-btn">Confirm Transition</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",qt),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{qt(),Bo(a,d,null)}))};document.querySelectorAll(".wf-action-btn, #btn-fire-rules").forEach(r=>{r.addEventListener("click",()=>o(r))})}async function Bo(a,o,s){try{const r=await le.transition(a,o,s);Ae(r.message||`Status updated to ${o}`),va({id:a})}catch(r){V(r.message||"Transition failed")}}async function Bl(a){var o,s;try{const r=await le.fireRules(a,"approved");Ae(`Rule Engine executed! ${((s=(o=r.data)==null?void 0:o.createdEntities)==null?void 0:s.length)||0} entity created.`),va({id:a})}catch(r){V(r.message||"Rule trigger failed")}}async function Rl(a){const o=document.getElementById("report-result-output");if(o){o.style.display="block",o.innerHTML='<div class="spinner spinner-sm"></div> Running report...';try{const r=(await tn.execute(a)).data;let d=(r.rows||[]).map(u=>{var p;return`
      <tr>
        <td>${U(u[r.groupBy]||u.area||"Total")}</td>
        <td style="font-weight:bold;">${u[(p=r.metric)==null?void 0:p.toLowerCase()]||u.count||u.total_count||0}</td>
      </tr>
    `}).join("");o.innerHTML=`
      <div style="background:var(--green-50); border:1px solid var(--green-100); border-radius:6px; padding:12px; font-size:13px;">
        <div style="font-weight:bold; color:var(--green-700); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10"/></svg>
          Execution Result: "${U(r.reportName)}"
        </div>
        <table class="table-sm" style="width:100%; font-size:12px;">
          <thead><tr><th>${U(r.groupBy||"Group")}</th><th>${U(r.metric)}</th></tr></thead>
          <tbody>${d}</tbody>
        </table>
      </div>
    `}catch(s){o.innerHTML=`<div class="alert alert-error">Report execution failed: ${U(s.message)}</div>`}}}async function Ol(a,o=[]){const s=a.entity_id,r=document.getElementById("ai-report-body");if(r){r.innerHTML=`
    <div style="text-align:center; padding: 2rem 1rem;">
      <div class="spinner spinner-lg mb-3" style="border-top-color:var(--primary); margin:0 auto 12px auto;"></div>
      <div style="font-weight:600; color:var(--text-primary); font-size:15px;">Running Civic Intelligence Analysis...</div>
      <div style="color:var(--text-muted); font-size:13px; margin-top:4px;">Evaluating observations, patterns, recommendations, and evidence.</div>
    </div>
  `;try{const d=await le.aiAnalysis(s);Ae("Civic Intelligence Analysis generated successfully!"),r.innerHTML=Ro(d.data)}catch(d){if(String(d.message||"").includes("GEMINI_API_KEY")||String(d.message||"").includes("Gemini API key")){Ae("Generated Civic Decision Intelligence Preview from Case Parameters");const p=Nl(a,o);r.innerHTML=Ro(p)}else V(d.message||"Could not generate AI report"),r.innerHTML=`<div class="alert alert-error">AI Analysis failed: ${U(d.message)}</div>`}}}function Nl(a,o=[]){var h;const s={};if(Array.isArray(o))for(const m of o){const v=((h=m.parameterMaster)==null?void 0:h.field_key)||`param_${m.parameter_id}`;s[v]=m.value}const r=s.problem_need||s.description||a.name||"Civic improvement proposal",d=s.proposed_solution||"Community coordination and departmental municipal intervention",u=s.urgency||"Normal",p=a.area||"Ward / Area Jurisdiction";return{problem_summary:`The initiative "${a.name}" in ${p} highlights a local priority: "${r}". The citizen proposes "${d}".`,root_cause_analysis:[`Localized civic and infrastructure upkeep requirement in ${p}.`,"Gap between standard municipal routine maintenance and citizen-level expectations.","Absence of structured community-departmental participatory coordination."],stakeholder_analysis:[{group:`Residents & Citizens of ${p}`,interest:"Timely resolution, cleaner living environment, and reliable public amenities."},{group:"Area Coordinator & Field Inspectors",interest:"On-site verification of scope, resource estimation, and jurisdiction validation."},{group:"Competent Department (Works / Sanitation)",interest:"Feasibility check, alignment with ward budget, and task execution."}],risk_register:[{risk:`Delays in site inspection may exacerbate citizen grievances in ${p}`,severity:u==="Urgent"||u==="Critical"?"High":"Medium"},{risk:"Potential overlap with scheduled municipal ward maintenance works",severity:"Low"},{risk:"Incomplete initial citizen documentation requiring field verification",severity:"Low"}],recommendation:[`Area Coordinator should verify the physical site in ${p} and confirm exact requirements.`,"Coordinate with the relevant zonal engineering / sanitation unit to assess resource requirements.","If verified, transition case status to 'coordinator_approved' to forward for Executive Director sanction."],notice:"Live GEMINI_API_KEY is not configured in backend/.env. This structured decision analysis was synthesized by the CIVIC-KALKI Governance Intelligence Engine using case parameters."}}function Ro(a){const o=Array.isArray(a.recommendation)?a.recommendation:Array.isArray(a.actionable_recommendations)?a.actionable_recommendations:[a.recommendation||a.actionable_recommendations||"Proceed with field verification."],s=Array.isArray(a.root_cause_analysis)?a.root_cause_analysis:[a.root_cause_analysis||"No root cause factors recorded."],r=Array.isArray(a.stakeholder_analysis)?a.stakeholder_analysis:[],d=Array.isArray(a.risk_register)?a.risk_register:[];return`
    <div style="font-size:13px; color:var(--text-primary); line-height:1.5;">
      ${a.notice?`
        <div style="margin-bottom:12px; padding:10px 12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; font-size:12px; color:#1e40af; display:flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div><strong>Notice:</strong> ${U(a.notice)}</div>
        </div>
      `:""}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">1. Observations & Problem Scope</strong>
        <p style="margin:0; color:var(--text-secondary);">${U(a.problem_summary)}</p>
      </div>
      
      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">2. Patterns & Root Cause Analysis</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${s.map(u=>`<li style="margin-bottom:4px;">${U(u)}</li>`).join("")}
        </ul>
      </div>

      ${r.length>0?`
        <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
          <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">3. Stakeholder Impact Analysis</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${r.map(u=>`
              <div style="font-size:12px; background:var(--surface); padding:6px 10px; border-radius:4px; border:1px solid var(--border);">
                <strong style="color:var(--text-primary);">${U(u.group||"Stakeholder")}:</strong>
                <span style="color:var(--text-secondary); margin-left:4px;">${U(u.interest||"")}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `:""}

      ${d.length>0?`
        <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
          <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">4. Risk Register & Feasibility</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${d.map(u=>{const p=String(u.severity||"Medium").toLowerCase(),h=p==="high"?"background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;":p==="low"?"background:#dcfce7; color:#15803d; border:1px solid #86efac;":"background:#fef3c7; color:#b45309; border:1px solid #fcd34d;";return`
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; background:var(--surface); padding:6px 10px; border-radius:4px; border:1px solid var(--border);">
                  <span style="color:var(--text-primary);">${U(u.risk||"")}</span>
                  <span style="padding:2px 8px; border-radius:12px; font-weight:700; font-size:11px; ${h}">${U(u.severity||"Medium")}</span>
                </div>
              `}).join("")}
          </div>
        </div>
      `:""}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">5. Recommendations for Coordinator / Executive Action</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${o.map(u=>`<li style="margin-bottom:4px;">${U(u)}</li>`).join("")}
        </ul>
      </div>

      <div style="padding:10px 12px; background:var(--yellow-50); border:1px solid var(--yellow-100); border-radius:6px; font-size:12px; color:var(--yellow-700); display:flex; align-items:center; gap:8px;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span><strong>Civic Intelligence Protocol:</strong> This automated advisory report is generated to assist municipal coordinators and directors. Ground evidence and field verification must precede final sanction.</span>
      </div>
    </div>
  `}const Dt=[{type:"country",label:"Country"},{type:"state",label:"State / Province"},{type:"city",label:"City / District"},{type:"ward",label:"Ward / Local Area"}];function fi(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function jl(a,o){if(!o)return fi(a);const s=new RegExp(`(${o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return fi(a).replace(s,'<strong style="color:var(--primary,#ff5a36);">$1</strong>')}class Hl{constructor(o,s={}){this._container=o,this._required=s.required||!1,this._onChange=s.onChange||null,this._prefix=s.labelPrefix||"jsel",this._levelStates=[],this._hiddenInput=null,this._destroyed=!1,this._onDocumentClick=this._handleDocumentClick.bind(this),document.addEventListener("click",this._onDocumentClick)}async init(){this._render(),await this._loadLevel(0,null)}getValue(){const o=this._levelStates.map(r=>r.selectedItem).filter(Boolean);return o.length===0?null:{jurisdiction_id:o[o.length-1].jurisdiction_id,display_path:o.map(r=>r.name).join(" › ")}}async setValue(o){if(o)try{const s=await Ui.get(o),{path:r}=s.data;if(!Array.isArray(r)||r.length===0)return;for(let u=0;u<r.length;u++){const p=u===0?null:r[u-1].jurisdiction_id;await this._loadLevel(u,p);const h=r[u],m=this._levelStates[u].items.find(v=>v.jurisdiction_id===h.jurisdiction_id)||h;this._setSelection(u,m,!1)}this._syncHidden(),this._notifyChange();const d=r.length;if(d<Dt.length){const u=r[r.length-1].jurisdiction_id;await this._loadLevel(d,u)}}catch(s){console.warn("[JurisdictionSelector] setValue failed:",s)}}destroy(){this._destroyed=!0,document.removeEventListener("click",this._onDocumentClick),this._container.innerHTML="",this._levelStates=[],this._hiddenInput=null}_render(){this._container.innerHTML="",this._container.classList.add("jurisdiction-selector");const o=document.createElement("div");o.className="jurisdiction-selector-grid",Dt.forEach((r,d)=>{const u=document.createElement("div");u.className="form-group jsel-group",u.id=`${this._prefix}-group-${d}`;const p=this._required&&d===0?'<span class="required">*</span>':"",h=document.createElement("label");h.className="form-label",h.innerHTML=`${fi(r.label)} ${p}`;const m=document.createElement("div");m.className="jsel-combobox",m.id=`${this._prefix}-combobox-${d}`;const v=document.createElement("div");v.className="jsel-trigger is-disabled",v.setAttribute("tabindex",d===0?"0":"-1"),v.setAttribute("role","combobox"),v.setAttribute("aria-expanded","false"),v.setAttribute("aria-label",r.label);const y=document.createElement("span");y.className="jsel-trigger-text is-placeholder",y.textContent=d===0?`-- Search or Select ${r.label} --`:`-- Select ${Dt[d-1].label} first --`;const g=document.createElement("div");g.className="jsel-trigger-actions";const w=document.createElement("button");w.type="button",w.className="jsel-clear-btn",w.title="Clear selection",w.style.display="none",w.innerHTML="&#x2715;";const _=document.createElement("span");_.className="jsel-chevron",_.innerHTML='<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>',g.appendChild(w),g.appendChild(_),v.appendChild(y),v.appendChild(g);const z=document.createElement("div");z.className="jsel-dropdown";const C=document.createElement("div");C.className="jsel-search-wrapper",C.innerHTML=`
        <svg class="jsel-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `;const M=document.createElement("input");M.type="text",M.className="jsel-search-input",M.placeholder=`Search ${r.label}...`,M.setAttribute("autocomplete","off"),C.appendChild(M);const R=document.createElement("ul");R.className="jsel-options-list",R.setAttribute("role","listbox"),z.appendChild(C),z.appendChild(R),m.appendChild(v),m.appendChild(z),u.appendChild(h),u.appendChild(m),o.appendChild(u),this._levelStates[d]={meta:r,groupEl:u,comboboxEl:m,triggerEl:v,triggerTextEl:y,clearBtnEl:w,dropdownEl:z,searchInputEl:M,optionsListEl:R,items:[],filteredItems:[],selectedItem:null,focusedIdx:-1,isOpen:!1,disabled:d!==0},v.addEventListener("click",B=>{B.target.closest(".jsel-clear-btn")||this._toggleDropdown(d)}),v.addEventListener("keydown",B=>{this._levelStates[d].disabled||(B.key==="Enter"||B.key===" "||B.key==="ArrowDown")&&(B.preventDefault(),this._openDropdown(d))}),w.addEventListener("click",B=>{B.stopPropagation(),this._clearSelection(d)}),M.addEventListener("input",B=>{this._filterOptions(d,B.target.value)}),M.addEventListener("keydown",B=>{this._handleSearchKeydown(d,B)})}),this._container.appendChild(o);const s=document.createElement("input");s.type="hidden",s.name="_jurisdiction_id",s.id=`${this._prefix}-hidden`,s.value="",this._container.appendChild(s),this._hiddenInput=s}async _loadLevel(o,s){if(this._destroyed)return;const r=this._levelStates[o];if(r){r.disabled=!0,r.triggerEl.classList.add("is-disabled"),r.triggerEl.setAttribute("tabindex","-1"),r.triggerTextEl.className="jsel-trigger-text is-placeholder",r.triggerTextEl.textContent=`Loading ${r.meta.label}…`,r.optionsListEl.innerHTML=`<li class="jsel-loading"><div class="spinner" style="width:14px;height:14px;border-width:2px;"></div> Loading ${r.meta.label}...</li>`;try{const d=s==null?{}:{parent_id:String(s)},p=(await Ui.list(d)).data||[];if(this._destroyed)return;if(r.items=p,r.filteredItems=p,p.length===0){r.disabled=!0,r.triggerEl.classList.add("is-disabled"),r.triggerEl.setAttribute("tabindex","-1"),r.triggerTextEl.textContent=`-- No ${r.meta.label} available --`,this._clearLevelsFrom(o+1);return}r.disabled=!1,r.triggerEl.classList.remove("is-disabled"),r.triggerEl.setAttribute("tabindex","0"),r.triggerTextEl.textContent=`-- Search or Select ${r.meta.label} --`,this._renderOptionsList(o,"")}catch(d){console.warn("[JurisdictionSelector] Failed to load level",o,d),r.disabled=!0,r.triggerEl.classList.add("is-disabled"),r.triggerTextEl.textContent=`-- Error loading ${r.meta.label} --`}}}_renderOptionsList(o,s){const r=this._levelStates[o],d=r.optionsListEl;d.innerHTML="",r.focusedIdx=-1;const u=(s||"").trim().toLowerCase();let p=r.items;if(u&&(p=r.items.filter(m=>m.name&&m.name.toLowerCase().includes(u)||m.code&&m.code.toLowerCase().includes(u))),r.filteredItems=p,p.length===0){d.innerHTML=`<li class="jsel-empty">No ${fi(r.meta.label)} found matching "${fi(s)}"</li>`;return}if(o===0&&!u){const m=r.items.find(v=>v.name==="India");if(m){const v=document.createElement("li");v.className="jsel-divider",v.textContent="★ Pinned / Quick Select",d.appendChild(v);const y=this._createOptionElement(o,m,u,0);d.appendChild(y);const g=document.createElement("li");g.className="jsel-divider",g.textContent=`All Countries (${r.items.length})`,d.appendChild(g)}}if(p.slice(0,150).forEach((m,v)=>{const y=this._createOptionElement(o,m,u,v);d.appendChild(y)}),p.length>150){const m=document.createElement("li");m.className="jsel-empty",m.style.fontSize="0.78rem",m.style.padding="8px",m.textContent=`Showing top 150 of ${p.length} matches — type to narrow down`,d.appendChild(m)}}_createOptionElement(o,s,r,d){const u=this._levelStates[o],p=u.selectedItem&&u.selectedItem.jurisdiction_id===s.jurisdiction_id,h=document.createElement("li");h.className=`jsel-option ${p?"is-selected":""}`,h.setAttribute("role","option"),h.setAttribute("aria-selected",p?"true":"false"),h.dataset.index=String(d);const m=document.createElement("span");if(m.innerHTML=jl(s.name,r),h.appendChild(m),s.code){const v=document.createElement("span");v.className="jsel-option-badge",v.textContent=s.code,h.appendChild(v)}return h.addEventListener("click",v=>{v.stopPropagation(),this._selectItem(o,s)}),h}_toggleDropdown(o){const s=this._levelStates[o];s.disabled||(s.isOpen?this._closeDropdown(o):this._openDropdown(o))}_openDropdown(o){this._levelStates.forEach((r,d)=>{d!==o&&r.isOpen&&this._closeDropdown(d)});const s=this._levelStates[o];s.disabled||(s.isOpen=!0,s.comboboxEl.classList.add("is-open"),s.triggerEl.classList.add("is-active"),s.triggerEl.setAttribute("aria-expanded","true"),s.searchInputEl.value="",this._renderOptionsList(o,""),setTimeout(()=>{s.searchInputEl.focus()},50))}_closeDropdown(o){const s=this._levelStates[o];s.isOpen&&(s.isOpen=!1,s.comboboxEl.classList.remove("is-open"),s.triggerEl.classList.remove("is-active"),s.triggerEl.setAttribute("aria-expanded","false"))}_filterOptions(o,s){this._renderOptionsList(o,s)}_handleSearchKeydown(o,s){const r=this._levelStates[o],d=r.optionsListEl.querySelectorAll(".jsel-option");d.length!==0&&(s.key==="ArrowDown"?(s.preventDefault(),r.focusedIdx=Math.min(r.focusedIdx+1,d.length-1),this._updateFocus(d,r.focusedIdx)):s.key==="ArrowUp"?(s.preventDefault(),r.focusedIdx=Math.max(r.focusedIdx-1,0),this._updateFocus(d,r.focusedIdx)):s.key==="Enter"?(s.preventDefault(),r.focusedIdx>=0&&r.focusedIdx<d.length?d[r.focusedIdx].click():d.length>0&&d[0].click()):s.key==="Escape"&&(this._closeDropdown(o),r.triggerEl.focus()))}_updateFocus(o,s){o.forEach((r,d)=>{d===s?(r.classList.add("is-focused"),r.scrollIntoView({block:"nearest"})):r.classList.remove("is-focused")})}_selectItem(o,s){this._setSelection(o,s,!0),this._closeDropdown(o);const r=o+1;r<Dt.length&&this._loadLevel(r,s.jurisdiction_id)}_setSelection(o,s,r=!0){const d=this._levelStates[o];d.selectedItem=s,d.triggerTextEl.className="jsel-trigger-text",d.triggerTextEl.textContent=s.name,d.clearBtnEl.style.display="flex",r&&(this._clearLevelsFrom(o+1),this._syncHidden(),this._notifyChange())}_clearSelection(o){const s=this._levelStates[o];s.selectedItem=null,s.triggerTextEl.className="jsel-trigger-text is-placeholder",s.triggerTextEl.textContent=`-- Search or Select ${s.meta.label} --`,s.clearBtnEl.style.display="none",this._clearLevelsFrom(o+1),this._syncHidden(),this._notifyChange()}_clearLevelsFrom(o){for(let s=o;s<Dt.length;s++){const r=this._levelStates[s];r&&(r.selectedItem=null,r.disabled=!0,r.items=[],r.filteredItems=[],r.triggerEl.classList.add("is-disabled"),r.triggerEl.setAttribute("tabindex","-1"),r.triggerTextEl.className="jsel-trigger-text is-placeholder",r.triggerTextEl.textContent=`-- Select ${Dt[s-1].label} first --`,r.clearBtnEl.style.display="none",r.optionsListEl.innerHTML="",this._closeDropdown(s))}}_handleDocumentClick(o){this._destroyed||this._levelStates.forEach((s,r)=>{s.isOpen&&!s.comboboxEl.contains(o.target)&&this._closeDropdown(r)})}_syncHidden(){if(!this._hiddenInput)return;const o=this.getValue();this._hiddenInput.value=o?String(o.jurisdiction_id):""}_notifyChange(){const o=this.getValue();this._onChange&&this._onChange(o),this._container.dispatchEvent(new CustomEvent("jurisdiction:change",{bubbles:!0,detail:o}))}}delete be.Icon.Default.prototype._getIconUrl;be.Icon.Default.mergeOptions({iconRetinaUrl:ha,iconUrl:ma,shadowUrl:fa});const Dl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",Fl='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',Zl=[28.6139,77.209],Ul=13;function ql(a,o={}){const s=typeof a=="string"?document.getElementById(a):a;if(!s)return console.error("[LocationPicker] Mount target not found:",a),null;let r={latitude:o.initialLat?Number(o.initialLat):null,longitude:o.initialLng?Number(o.initialLng):null,area:o.initialArea?String(o.initialArea).trim():"",address:""},d=null,u=null,p=0;const h="loc-picker-"+Math.random().toString(36).substring(2,9);s.innerHTML=`
    <div class="location-picker-box card" id="${h}" style="border:1px solid var(--border); background:var(--surface); padding:16px; border-radius:8px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <label style="font-weight:600; font-size:14px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Select Location & Coordinates
        </label>
        <button type="button" class="btn btn-secondary btn-sm" id="${h}-btn-geolocate" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Use My Current Location
        </button>
      </div>

      <!-- Search Box & Area Input -->
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:10px; margin-bottom:12px;" class="loc-input-grid">
        <div style="display:flex; gap:6px;">
          <input type="text" id="${h}-search-input" class="form-control" placeholder="Search landmark, address, street..." style="flex:1;">
          <button type="button" class="btn btn-primary" id="${h}-btn-search" style="padding:6px 14px; font-weight:600; flex-shrink:0;">
            Search
          </button>
        </div>
        <div>
          <input type="text" id="${h}-area-input" class="form-control" placeholder="Locality / Ward (optional)" value="${Un(r.area)}">
        </div>
      </div>

      <!-- Feedback Banner -->
      <div id="${h}-feedback" style="display:none; padding:8px 12px; border-radius:6px; font-size:13px; margin-bottom:10px;"></div>

      <!-- Map Display -->
      <div id="${h}-map" style="height:280px; width:100%; border-radius:6px; border:1px solid var(--border); background:#f1f5f9; z-index:1;"></div>

      <!-- Selected Coordinates Display -->
      <div id="${h}-coords-bar" style="margin-top:10px; display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--text-muted); background:var(--gray-50); padding:8px 12px; border-radius:6px;">
        <span id="${h}-coords-text">
          ${r.latitude&&r.longitude?`Selected: <strong>${r.latitude.toFixed(6)}, ${r.longitude.toFixed(6)}</strong>`:"Click on the map or drag the pin to set exact coordinates"}
        </span>
        <span style="font-size:11px; color:var(--text-secondary);">Drag marker to fine-tune</span>
      </div>
    </div>
  `;const m=document.getElementById(`${h}-map`),v=document.getElementById(`${h}-feedback`),y=document.getElementById(`${h}-search-input`),g=document.getElementById(`${h}-btn-search`),w=document.getElementById(`${h}-btn-geolocate`),_=document.getElementById(`${h}-area-input`),z=document.getElementById(`${h}-coords-text`);function C(A,$="error"){v&&(v.style.display="block",$==="error"?(v.style.background="#fef2f2",v.style.border="1px solid #fecaca",v.style.color="#dc2626"):$==="info"?(v.style.background="#eff6ff",v.style.border="1px solid #bfdbfe",v.style.color="#1d4ed8"):(v.style.background="#f0fdf4",v.style.border="1px solid #bbf7d0",v.style.color="#16a34a"),v.textContent=A)}function M(){v&&(v.style.display="none",v.textContent="")}function R(){z&&(r.latitude!=null&&r.longitude!=null?z.innerHTML=`Coordinates: <strong>${r.latitude.toFixed(6)}, ${r.longitude.toFixed(6)}</strong> ${r.address?` • <span title="${Un(r.address)}">${Un(r.address)}</span>`:""}`:z.textContent="Click on the map or drag the pin to set exact coordinates")}function B(A,$,K="",Q=!0){r.latitude=Math.round(A*1e6)/1e6,r.longitude=Math.round($*1e6)/1e6,K&&(r.address=K),R(),!u&&d?(u=be.marker([r.latitude,r.longitude],{draggable:!0}).addTo(d),u.on("dragend",he=>{const $e=he.target.getLatLng();B($e.lat,$e.lng,"",!1)})):u&&u.setLatLng([r.latitude,r.longitude]),Q&&d&&d.setView([r.latitude,r.longitude],Math.max(d.getZoom(),14)),o.onChange&&o.onChange(Me())}function ne(){if(!m)return;const A=r.latitude&&r.longitude?[r.latitude,r.longitude]:Zl,$=r.latitude&&r.longitude?14:Ul;d=be.map(m,{center:A,zoom:$,zoomControl:!0,attributionControl:!0}),be.tileLayer(Dl,{attribution:Fl,maxZoom:19}).addTo(d),r.latitude&&r.longitude&&(u=be.marker([r.latitude,r.longitude],{draggable:!0}).addTo(d),u.on("dragend",K=>{const Q=K.target.getLatLng();B(Q.lat,Q.lng,"",!1)})),d.on("click",K=>{B(K.latlng.lat,K.latlng.lng,"",!1)}),setTimeout(()=>{d&&d.invalidateSize()},250)}async function we(){if(M(),!navigator.geolocation){C("Geolocation is not supported by your browser. Please search or pick manually on the map.","error");return}w.disabled=!0;const A=w.innerHTML;w.innerHTML='<span class="spinner" style="width:14px;height:14px;border-width:2px;margin-right:6px;"></span> Locating...',navigator.geolocation.getCurrentPosition($=>{w.disabled=!1,w.innerHTML=A;const K=$.coords.latitude,Q=$.coords.longitude;B(K,Q,"Current Location",!0),C("Location retrieved successfully from GPS.","success"),setTimeout(M,3500)},$=>{w.disabled=!1,w.innerHTML=A;let K="Could not retrieve your location. Please use the search bar or click on the map.";$.code===1?K="Location permission was denied. Please use the search box or click on the map.":$.code===2?K="Location unavailable. Please search for your location.":$.code===3&&(K="Location request timed out. Please try searching for your area."),C(K,"error")},{timeout:1e4,enableHighAccuracy:!0,maximumAge:0})}async function fe(){M();const A=String(y.value||"").trim();if(!A){C("Please enter an address, city, or landmark to search.","error");return}const $=Date.now();if($-p<1e3){C("Please wait a second before searching again.","info");return}p=$,g.disabled=!0;const K=g.textContent;g.textContent="Searching...";try{const Q=`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(A)}&limit=1`,he=await fetch(Q,{headers:{Accept:"application/json"}});if(!he.ok)throw new Error(`Geocoding failed with status ${he.status}`);const $e=await he.json();if(!Array.isArray($e)||$e.length===0){C(`No location found for "${A}". Try a broader address or landmark.`,"error");return}const de=$e[0],j=parseFloat(de.lat),J=parseFloat(de.lon),Te=de.display_name||A;B(j,J,Te,!0),C(`Found: ${Te}`,"success"),setTimeout(M,4e3)}catch(Q){console.warn("[LocationPicker] Nominatim search error:",Q),C("Failed to lookup address. Please click directly on the map to set coordinates.","error")}finally{g.disabled=!1,g.textContent=K}}w&&w.addEventListener("click",we),g&&g.addEventListener("click",fe),y&&y.addEventListener("keydown",A=>{A.key==="Enter"&&(A.preventDefault(),fe())}),_&&_.addEventListener("input",A=>{r.area=A.target.value.trim(),o.onChange&&o.onChange(Me())}),ne();function Me(){return{latitude:r.latitude,longitude:r.longitude,area:r.area?r.area:null,address:r.address||null}}function D(){d&&(d.remove(),d=null),s.innerHTML=""}return{getValue:Me,setCoordinates:B,destroy:D}}function Un(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}const Vl="/api";function He(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}let Gt=null,Ye=null,mt=[],Ut=null,Tt=null,vi=new Map;const Wl=new Set(["title","name","movement_title","area","jurisdiction","jurisdiction_id","location","landmark","reported_date","reported_on","contact_person","contact_phone","contact_email","priority_level","volunteer_coordinator"]);function ss(a){const o=String(a.field_key||"").trim().toLowerCase();return Wl.has(o)}async function Gl(a={},o=null){if(!ot(ie))return;try{mt=(await le.listTypes().catch(()=>({data:[]}))).data||[]}catch{mt=[]}const s=o||new URLSearchParams(window.location.search);s.has("entity_type_id")?Ye=Number(s.get("entity_type_id")):mt.length>0&&(Ye=mt[0].entity_type_id);const r=mt.find(p=>Number(p.entity_type_id)===Number(Ye));Ut=at(r);const d=document.getElementById("app");d.innerHTML=_e(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="page-capability-title">${He(Ut.title)}</h1>
        <p id="page-capability-sub">Tell us what is happening and where.</p>
      </div>
    </div>
    
    <div class="card mb-6">
      <div class="card-body" style="padding:16px;">
        <div class="form-group" style="max-width: 450px; margin-bottom: 0;">
          <label class="form-label" for="entity-type-select">Target Civic Capability <span class="required">*</span></label>
          <select id="entity-type-select" class="form-control">
            <option value="">-- Select Capability --</option>
            ${mt.map(p=>{const h=at(p);return`<option value="${p.entity_type_id}" ${Number(Ye)===Number(p.entity_type_id)?"selected":""}>${He(h.title)}</option>`}).join("")}
          </select>
        </div>
      </div>
    </div>
    
    <div id="dynamic-form-container"></div>
  `,Ut.title,mt),xe(),document.getElementById("entity-type-select").addEventListener("change",async p=>{const h=p.target.value;if(!h){document.getElementById("dynamic-form-container").innerHTML="",Gt=null;return}Ye=Number(h);const m=mt.find(v=>Number(v.entity_type_id)===Number(Ye));Ut=at(m),document.getElementById("page-capability-title").textContent=Ut.title,window.history.replaceState({},"",`/entities/new?entity_type_id=${Ye}`),await Oo(Ye)}),Ye&&await Oo(Ye)}async function Oo(a){Tt&&(Tt.destroy(),Tt=null);const o=document.getElementById("dynamic-form-container");o.innerHTML='<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';try{Gt=(await ca.schema(a)).data,Yl(o,Gt),await Kl()}catch(s){console.error("Form schema load error:",s),V("Failed to load form schema"),o.innerHTML='<div class="alert alert-error">Unable to load form for selected capability. No form configuration exists.</div>'}}async function Kl(){const a=document.getElementById("jurisdiction-selector-mount");a&&(Tt=new Hl(a,{required:!0,labelPrefix:"ent-jsel"}),await Tt.init())}function Jl(a){var z;const o=a.mandatory||a.is_mandatory,s=o?"required":"",r=o?'<span class="required">*</span>':"",d=`param_${a.parameter_id}`,u=(a.field_type||a.data_type||"text").toLowerCase(),p=He(a.label||a.field_key),h=(z=a.options)==null?void 0:z.depends_on;let m="",v="",y="";h&&h.field_key&&(m=`data-depends-key="${He(h.field_key)}" data-depends-val="${He(h.value)}"`,v="conditional-field",y="display:none;");const w=["textarea","file","location"].includes(u)?"flex:1 1 100%; min-width:100%;":"flex:1 1 calc(50% - 8px); min-width:200px;";let _="";switch(u){case"location":_=`
        <div id="location-picker-mount-${a.parameter_id}" class="location-picker-field-mount" data-parameter-id="${a.parameter_id}"></div>
      `;break;case"textarea":_=`<textarea name="${d}" class="form-control" rows="3" ${s} placeholder="Enter ${p.toLowerCase()}..."></textarea>`;break;case"number":_=`<input type="number" name="${d}" class="form-control" ${s} placeholder="0">`;break;case"date":_=`<input type="date" name="${d}" class="form-control" ${s}>`;break;case"email":_=`<input type="email" name="${d}" class="form-control" ${s} placeholder="email@example.com">`;break;case"phone":_=`<input type="tel" name="${d}" class="form-control" ${s} placeholder="+91 XXXXX XXXXX">`;break;case"checkbox":_=`
        <div class="check-group mt-2">
          <input type="checkbox" name="${d}" id="${d}" value="true">
          <label for="${d}">Yes</label>
        </div>
      `;break;case"select":{const C=a.meta_options||(a.options?Array.isArray(a.options)?a.options:a.options.choices:null)||["Option 1","Option 2"],M=a.options&&a.options.default?a.options.default:"";_=`<select name="${d}" class="form-control" ${s}>
        <option value="">-- Select --</option>
        ${C.map(R=>`<option value="${He(R)}" ${R===M?"selected":""}>${He(R)}</option>`).join("")}
      </select>`;break}case"file":_=`
        <div class="file-upload-wrapper" id="file-wrap-${a.parameter_id}">
          <input type="file" name="${d}" id="file-${a.parameter_id}" 
            class="form-control file-input" 
            data-parameter-id="${a.parameter_id}"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.csv,.txt,.zip"
            ${s}>
          <div class="file-upload-info mt-1" style="font-size:0.75rem; color:var(--text-muted);">
            Max 10MB • PDF, Word, Excel, Images, CSV, ZIP
          </div>
          <div id="file-status-${a.parameter_id}" class="file-upload-status mt-1" style="display:none;"></div>
        </div>
      `;break;default:_=`<input type="text" name="${d}" class="form-control" ${s} placeholder="Enter ${p.toLowerCase()}...">`;break}return`<div class="form-group ${v}" ${m} style="${y} ${w}">
    <label class="form-label">${p} ${r}</label>
    ${_}
  </div>`}function Yl(a,o){if(!o||!o.sections||o.sections.length===0){a.innerHTML='<div class="alert alert-warning">This capability has no form fields configured yet.</div>';return}let s=`
    <div class="card">
      <div class="card-header border-b">
        <div class="card-title">${He(Ut.title)}</div>
        <div class="card-subtitle">Complete all required parameter fields for your submission.</div>
      </div>
      
      <div id="form-validation-alert" class="alert alert-danger hidden m-4"></div>
      ${Array.isArray(o.configuration_errors)&&o.configuration_errors.length>0?`<div class="alert alert-warning m-4">${He(o.configuration_errors.join(" "))}</div>`:""}

      <form id="dynamic-form" style="padding:24px;">
  `,r=!1,d=!1;o.sections.forEach((h,m)=>{const v=(h.section_name||h.title||"").trim(),y=m===0,g=v.toLowerCase().includes("where")||v.toLowerCase().includes("location");s+=`
      <div class="form-section mb-6" data-section-name="${He(v)}">
        <div class="form-section-title">${He(v)}</div>
        ${h.description?`<div class="form-section-subtitle">${He(h.description)}</div>`:""}
    `,y&&!r&&(s+=`
        <div class="form-row mt-4" style="display:flex; flex-wrap:wrap; gap:16px;">
          <div class="form-group" style="flex:1 1 100%; min-width:100%;">
            <label class="form-label" for="base_name">Title / Summary <span class="required">*</span></label>
            <input type="text" id="base_name" name="_base_name" class="form-control" required placeholder="Brief title summarizing the initiative">
          </div>
        </div>
      `,r=!0),g&&!d&&(s+=`
        <div class="form-row mt-4" style="display:flex; flex-direction:column; gap:16px;">
          <div class="form-group" style="width:100%;">
            <label class="form-label">Jurisdiction <span class="required">*</span></label>
            <div id="jurisdiction-selector-mount"></div>
          </div>
          <div class="form-group" style="width:100%;">
            <label class="form-label" for="base_location">Specific Location / Address</label>
            <input type="text" id="base_location" name="_base_location" class="form-control" placeholder="Specific street address or building/area (optional)">
          </div>
        </div>
      `,d=!0),(h.subsections||[]).forEach(w=>{w.subsection_name&&w.subsection_name!=="Main"&&(s+=`<div class="form-subsection mt-3"><div class="form-subsection-title">${He(w.subsection_name)}</div>`);const z=[...w.parameters||[]].sort((C,M)=>(C.display_order||0)-(M.display_order||0)).filter(C=>!ss(C)&&String(C.field_key||"").trim()&&String(C.label||"").trim());z.length>0&&(s+='<div class="form-row mt-3" style="display:flex; flex-wrap:wrap; gap:16px;">',z.forEach(C=>{s+=Jl(C)}),s+="</div>"),w.subsection_name&&w.subsection_name!=="Main"&&(s+="</div>")}),s+="</div>"}),d||(s+=`
      <div class="form-section mb-6" data-section-name="Where is it?">
        <div class="form-section-title">Where is it?</div>
        <div class="form-row mt-4" style="display:flex; flex-direction:column; gap:16px;">
          <div class="form-group" style="width:100%;">
            <label class="form-label">Jurisdiction <span class="required">*</span></label>
            <div id="jurisdiction-selector-mount"></div>
          </div>
          <div class="form-group" style="width:100%;">
            <label class="form-label" for="base_location">Specific Location / Address</label>
            <input type="text" id="base_location" name="_base_location" class="form-control" placeholder="Specific street address or building/area (optional)">
          </div>
        </div>
      </div>
    `),s+=`
        <div class="form-section mt-6" style="border-bottom:none; margin-bottom:0; padding-bottom:0;">
          <div class="flex items-center justify-between">
            <div class="text-sm text-muted">Submissions enter the workflow for review by jurisdiction coordinators.</div>
            <button type="submit" id="submit-form-btn" class="btn btn-primary btn-lg" style="box-shadow:var(--shadow-md); display:inline-flex; align-items:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>
  `,a.innerHTML=s,vi.forEach(h=>h.destroy&&h.destroy()),vi.clear(),a.querySelectorAll(".location-picker-field-mount").forEach(h=>{const m=h.getAttribute("data-parameter-id"),v=ql(h);v&&vi.set(String(m),v)});const p=document.getElementById("dynamic-form");p.addEventListener("submit",Ql),Xl(p,o)}function Xl(a,o){const s=[];(o.sections||[]).forEach(u=>{(u.subsections||[]).forEach(p=>{(p.parameters||[]).forEach(h=>s.push(h))})});const r=a.querySelectorAll(".conditional-field");if(r.length===0)return;function d(){r.forEach(u=>{const p=u.getAttribute("data-depends-key"),h=u.getAttribute("data-depends-val");if(!p)return;const m=s.find(w=>w.field_key===p);if(!m)return;const v=a.querySelector(`[name="param_${m.parameter_id}"]`);if(!v)return;String(v.value||"").trim().toLowerCase()===String(h).toLowerCase()?(u.style.display="",u.querySelectorAll("input, select, textarea").forEach(w=>{w.disabled=!1})):(u.style.display="none",u.querySelectorAll("input, select, textarea").forEach(w=>{w.disabled=!0,w.value=""}))})}a.addEventListener("change",d),a.addEventListener("input",d),d()}async function Ql(a){a.preventDefault();const o=document.getElementById("form-validation-alert");o&&(o.classList.add("hidden"),o.textContent="");const s=document.getElementById("submit-form-btn");s.disabled=!0,s.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Submitting...';try{const r=new FormData(a.target),d=Object.fromEntries(r.entries());if(!d._base_name||!d._base_name.trim()){const w=document.getElementById("base_name");throw w&&w.focus(),new Error("Title / Summary is a required field.")}const u=Tt?Tt.getValue():null;if(!u)throw new Error("Please select a jurisdiction (at minimum a Country) before submitting.");if(Gt&&Gt.sections){for(const w of Gt.sections)for(const _ of w.subsections||[])for(const z of _.parameters||[])if(!ss(z)&&(z.mandatory||z.is_mandatory)){const C=a.target.querySelector(`[name="param_${z.parameter_id}"]`);if(C&&!C.disabled&&!(C.type==="file"?C.files&&C.files.length>0:String(C.value||"").trim()))throw C.focus(),new Error(`"${z.label||z.field_key}" is a required field.`)}}let p=null;for(const[w,_]of vi.entries()){const z=_.getValue();if(z&&z.latitude!=null&&z.longitude!=null){p=z;break}}const h={entity_type_id:Ye,name:d._base_name.trim(),jurisdiction_id:u.jurisdiction_id,area:p&&p.area?p.area:u.display_path,location:d._base_location?d._base_location.trim():p&&p.address?p.address:null,status:"submitted",...p?{latitude:p.latitude,longitude:p.longitude}:{}},v=(await le.create(h)).data.entity_id;p&&p.latitude!=null&&p.longitude!=null&&await le.update(v,{latitude:p.latitude,longitude:p.longitude,...p.area?{area:p.area}:{}});const y=[];for(const[w,_]of r.entries())if(w.startsWith("param_")){const z=Number(w.replace("param_",""));if(vi.has(String(z)))continue;const C=a.target.querySelector(`[name="${w}"]`);if(C&&(C.type==="file"||C.disabled))continue;_!=null&&String(_).trim()!==""&&y.push({parameter_id:z,value:String(_).trim()})}y.length>0&&await as.create(v,y);const g=a.target.querySelectorAll('input[type="file"]');for(const w of g)if(w.files&&w.files.length>0){const _=w.getAttribute("data-parameter-id");if(!_)continue;const z=new FormData;z.append("entity_id",v),z.append("parameter_id",_);for(const C of w.files)z.append("files",C);try{await fetch(`${Vl}/files/upload`,{method:"POST",headers:{"X-Requested-With":"ck-web"},credentials:"include",body:z})}catch(C){console.warn("File upload warning:",C)}}Ae("Request submitted successfully!"),ed(v,d._base_name)}catch(r){const d=r.message||"Failed to submit request";o&&(o.textContent=d,o.classList.remove("hidden")),V(d),s.disabled=!1,s.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:8px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> Submit Request'}}function ed(a,o){const s=document.getElementById("dynamic-form-container"),r=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});s.innerHTML=`
    <div class="card p-8 text-center" style="padding:48px 24px; text-align:center; max-width:640px; margin:0 auto;">
      <div style="width:64px; height:64px; border-radius:50%; background:var(--green-50); border:2px solid var(--green-100); color:var(--green-600); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      </div>

      <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:6px;">
        Request Submitted
      </h2>
      <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:24px;">
        Your request has been recorded and entered into the civic workflow for jurisdiction review.
      </p>

      <div style="background:var(--gray-50); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; text-align:left; margin-bottom:32px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-size:0.875rem;">
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Request ID</div>
            <div style="font-weight:700; color:var(--primary); font-family:var(--font-mono); margin-top:2px;">#PR-${String(a).padStart(5,"0")}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Status</div>
            <div style="margin-top:2px;"><span class="badge badge-submitted">Submitted</span></div>
          </div>
          <div style="grid-column: span 2;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Title</div>
            <div style="font-weight:600; color:var(--text-primary); margin-top:2px;">${He(o)}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Submission Date</div>
            <div style="color:var(--text-secondary); margin-top:2px;">${r}</div>
          </div>
        </div>
      </div>

      <div style="display:flex; gap:12px; justify-content:center;">
        <a href="/entities/${a}" class="btn btn-primary btn-lg" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          View Request Details
        </a>
        <a href="/dashboard" class="btn btn-secondary btn-lg">Back to My Workspace</a>
      </div>
    </div>
  `}let Wi=[],kt=null,zt="";async function td(){if(!da(["admin"],ie))return;const a=document.getElementById("app");a.innerHTML=_e(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>User Management</h1>
        <p>Manage system users, search accounts, assign roles, and allocate areas to coordinators.</p>
      </div>
    </div>
    
    <!-- User Search Filter Bar -->
    <div class="card mb-6" style="padding: 14px 18px;">
      <div style="position: relative; display: flex; align-items: center;">
        <span style="position: absolute; left: 14px; display: flex; align-items: center; color: var(--text-muted); pointer-events: none;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </span>
        <input type="text" id="user-search-input" class="form-control" style="padding-left: 42px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search users by email (e.g. demo.coord.area@example.com), name, or assigned area..." value="${De(zt)}">
        ${zt?'<button id="clear-search-btn" class="btn btn-ghost btn-sm" style="position:absolute; right:10px; padding:4px 8px; font-size:12px;">Clear</button>':""}
      </div>
    </div>

    <div id="admin-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Admin"),xe(),id(),await Gi()}let No=null;function id(){const a=document.getElementById("user-search-input");if(!a)return;a.addEventListener("input",s=>{zt=s.target.value.trim(),clearTimeout(No),No=setTimeout(()=>{Gi(zt)},200)});const o=document.getElementById("clear-search-btn");o&&o.addEventListener("click",()=>{zt="",a.value="",o.remove(),Gi("")})}async function Gi(a=zt){const o=document.getElementById("admin-content");if(o)try{const s={limit:100};a&&(s.search=a),Wi=(await ns.listUsers(s)).data,nd(o,Wi)}catch{V("Failed to load users"),o.innerHTML='<div class="alert alert-error">Failed to load users data.</div>'}}function nd(a,o=Wi){if(o.length===0){a.innerHTML=`
      <div class="card">
        <div class="card-header">
          <div class="card-title">System Users & Regional Allocations (${o.length})</div>
        </div>
        <div class="table-empty py-6 text-center text-muted">
          No users found matching "${De(zt)}".
        </div>
      </div>
    `;return}const s=o.map(r=>`
    <tr>
      <td>${r.user_id}</td>
      <td class="font-medium">${De(r.name)}</td>
      <td class="text-muted">${De(r.email)}</td>
      <td><span class="badge badge-role-${r.role}">${od(r.role)}</span></td>
      <td>${r.assignedArea?`<span class="badge badge-primary font-semibold" style="font-size:12px;">${De(r.assignedArea)}</span>`:'<span class="text-muted">—</span>'}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="window.editUserRole(${r.user_id})">Change Role / Area</button></td>
    </tr>
  `).join("");a.innerHTML=`
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <div class="card-title">System Users & Regional Allocations (${o.length})</div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Assigned Area / Ward</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${s}
          </tbody>
        </table>
      </div>
    </div>
  `}async function ad(){if(kt&&kt.length>0)return kt;try{const a=await Ui.tree();a.data&&Array.isArray(a.data)&&(kt=rs(a.data))}catch(a){console.warn("Failed to load jurisdiction tree for admin, falling back to flat list",a);try{kt=((await Ui.list({parent_id:"all"})).data||[]).map(s=>({jurisdiction_id:s.jurisdiction_id,name:s.name,type:s.type,fullPath:s.name}))}catch{kt=[]}}return kt||[]}function rs(a,o=""){let s=[];for(const r of a){const d=o?`${o} › ${r.name}`:r.name;s.push({jurisdiction_id:r.jurisdiction_id,name:r.name,type:r.type,fullPath:d}),r.children&&r.children.length>0&&(s=s.concat(rs(r.children,d)))}return s}window.editUserRole=async a=>{const o=Wi.find(_=>_.user_id===a);if(!o)return;const s=await ad(),r=s.filter(_=>_.type==="ward"),d=s.filter(_=>_.type==="city"),u=s.filter(_=>_.type!=="ward"&&_.type!=="city");let p=!1,h="";r.length>0&&(h+='<optgroup label="Wards / Local Areas (Recommended)">',r.forEach(_=>{const z=o.assignedArea===_.name;z&&(p=!0),h+=`<option value="${De(_.name)}" ${z?"selected":""}>${De(_.fullPath)}</option>`}),h+="</optgroup>"),d.length>0&&(h+='<optgroup label="Cities / Districts">',d.forEach(_=>{const z=o.assignedArea===_.name;z&&(p=!0),h+=`<option value="${De(_.name)}" ${z?"selected":""}>${De(_.fullPath)}</option>`}),h+="</optgroup>"),u.length>0&&(h+='<optgroup label="States / Regions">',u.forEach(_=>{const z=o.assignedArea===_.name;z&&(p=!0),h+=`<option value="${De(_.name)}" ${z?"selected":""}>${De(_.fullPath)}</option>`}),h+="</optgroup>"),o.assignedArea&&!p&&o.assignedArea!=="Unassigned"&&(h=`<option value="${De(o.assignedArea)}" selected>${De(o.assignedArea)} (Currently Assigned)</option>`+h),ta({title:`User Role & Area Allocation: ${o.name}`,content:`
      <form id="role-form">
        <div class="form-group">
          <label class="form-label font-semibold">User Role</label>
          <select id="new-role" class="form-control">
            <option value="citizen" ${o.role==="citizen"?"selected":""}>Citizen</option>
            <option value="coordinator_area" ${o.role==="coordinator_area"?"selected":""}>Area Coordinator</option>
            <option value="coordinator_general" ${o.role==="coordinator_general"?"selected":""}>General Coordinator</option>
            <option value="director" ${o.role==="director"?"selected":""}>Director</option>
            <option value="admin" ${o.role==="admin"?"selected":""}>Admin</option>
          </select>
        </div>
        <div class="form-group" id="area-group" style="${o.role==="coordinator_area"?"":"display:none;"}">
          <label class="form-label font-semibold">Allocated Region / Ward <span class="required">*</span></label>
          <select id="new-area" class="form-control">
            <option value="">-- Select Allocated Area / Jurisdiction --</option>
            ${h}
            <option value="__custom__">➕ Other / Custom Area Name...</option>
          </select>
          <div id="custom-area-wrapper" style="display:none; margin-top:8px;">
            <input type="text" id="custom-area-input" class="form-control" placeholder="Type custom jurisdiction or ward name (e.g. Kothrud, Sector 5)..." />
          </div>
          <div class="form-hint" style="margin-top:6px;">
            Area Coordinators only have workflow authority to review and approve cases located in their allocated jurisdiction.
          </div>
        </div>
      </form>
    `,footer:`
      <button class="btn btn-ghost" onclick="document.getElementById('modal-close-btn').click()">Cancel</button>
      <button class="btn btn-primary" id="save-role-btn">Save Allocation</button>
    `,onClose:()=>{}});const m=document.getElementById("new-role"),v=document.getElementById("area-group"),y=document.getElementById("new-area"),g=document.getElementById("custom-area-wrapper"),w=document.getElementById("custom-area-input");m.addEventListener("change",_=>{const z=_.target.value==="coordinator_area";v.style.display=z?"block":"none"}),y.addEventListener("change",_=>{_.target.value==="__custom__"?(g.style.display="block",w.focus()):g.style.display="none"}),document.getElementById("save-role-btn").addEventListener("click",async()=>{const _=m.value;let z=y.value;if(_==="coordinator_area"&&(z==="__custom__"&&(z=w.value.trim()),!z)){V("Please select or enter an allocated area for the coordinator");return}const C=document.getElementById("save-role-btn");C.disabled=!0,C.textContent="Saving...";try{await ns.setRole(a,_,_==="coordinator_area"?z:null),Ae(`Updated role & area allocation for ${o.name}`),qt(),Gi()}catch(M){V(M.message||"Failed to update role"),C.disabled=!1,C.textContent="Save Allocation"}})};function od(a){return a?a.split("_").map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" "):"Unknown"}function De(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function sd(){if(!ot(ie))return;const a=Mt(),o=document.getElementById("app");o.innerHTML=_e(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Profile & Security Settings</h1>
        <p>Manage your account credentials, view role permissions, and update password.</p>
      </div>
    </div>
    
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap:24px; width:100%;">
      <!-- Profile Info Card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">User Account Details</div>
        </div>
        <div class="card-body p-6">
          <div class="flex items-center gap-4 mb-6">
            <div style="width:64px; height:64px; border-radius:50%; background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:700;">
              ${a.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style="font-size:1.25rem; font-weight:700; color:var(--text-primary);">${qn(a.name)}</h2>
              <p style="font-size:0.875rem; color:var(--text-muted);">${qn(a.email)}</p>
            </div>
          </div>
          
          <div class="form-group mb-4">
            <label class="form-label">User ID</label>
            <div class="font-mono text-muted" style="font-size:0.9rem;">#${a.user_id}</div>
          </div>

          <div class="form-group mb-4">
            <label class="form-label">Assigned Role</label>
            <div><span class="badge badge-primary">${hi(a.role)}</span></div>
          </div>
          
          ${a.assignedArea?`
            <div class="form-group">
              <label class="form-label">Jurisdiction Area</label>
              <div style="font-weight:600; color:var(--text-primary);">${qn(a.assignedArea)}</div>
            </div>
          `:""}
        </div>
      </div>

      <!-- Password Change Card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Password & Security</div>
          <div class="card-subtitle">Update your system login password</div>
        </div>
        <div class="card-body p-6">
          <div id="password-alert" class="alert alert-danger hidden mb-4"></div>

          <form id="change-password-form">
            <div class="form-group mb-4">
              <label class="form-label" for="current_password">Current Password <span class="required">*</span></label>
              <input type="password" id="current_password" name="current_password" class="form-control" required placeholder="Enter current password">
            </div>

            <div class="form-group mb-4">
              <label class="form-label" for="new_password">New Password <span class="required">*</span></label>
              <input type="password" id="new_password" name="new_password" class="form-control" required minlength="8" placeholder="At least 8 characters">
            </div>

            <div class="form-group mb-6">
              <label class="form-label" for="confirm_password">Confirm New Password <span class="required">*</span></label>
              <input type="password" id="confirm_password" name="confirm_password" class="form-control" required minlength="8" placeholder="Re-enter new password">
            </div>

            <button type="submit" id="btn-change-pwd" class="btn btn-primary btn-full" style="display:inline-flex; align-items:center; justify-content:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  `,"Profile"),xe();const s=document.getElementById("change-password-form");s&&s.addEventListener("submit",async r=>{r.preventDefault();const d=document.getElementById("password-alert");d.classList.add("hidden"),d.textContent="";const u=document.getElementById("current_password").value,p=document.getElementById("new_password").value,h=document.getElementById("confirm_password").value;if(p!==h){d.textContent="New password and confirmation do not match.",d.classList.remove("hidden");return}const m=document.getElementById("btn-change-pwd");m.disabled=!0,m.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Updating...';try{await en.changePassword(u,p),Ae("Password updated successfully!"),s.reset(),m.disabled=!1,m.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}catch(v){const y=v.message||"Failed to update password";d.textContent=y,d.classList.remove("hidden"),V(y),m.disabled=!1,m.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}})}function qn(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function ee(a){return a?String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}let T={step:1,basics:{name:"",description:"",icon:"📋",domain_id:1},form:{name:"",sections:[{id:"sec_1",name:"General Information",parameters:[{id:"param_1",label:"Title",field_key:"title",field_type:"text",mandatory:!0,options:[]},{id:"param_2",label:"Area",field_key:"area",field_type:"select",mandatory:!0,options:["Sector 5","Sector 12","Pune North","Pune South","Pune Central"]}]}]},workflow:{transitions:[{from:"draft",to:"submitted",role:"citizen"},{from:"submitted",to:"coordinator_approved",role:"coordinator_area"},{from:"submitted",to:"rejected",role:"coordinator_area"},{from:"coordinator_approved",to:"approved",role:"director"},{from:"coordinator_approved",to:"rejected",role:"director"}]},rule:{enabled:!1,target_entity_type_id:"",event:"approved"},report:{enabled:!0,name:"",groupBy:"area",metric:"COUNT",metricField:"",publicStats:!0},existingTypes:[],domains:[],isSubmitting:!1};async function rd(){var a;if(da(["admin","director"],ie)){try{const[o,s]=await Promise.all([le.listTypes().catch(()=>({data:[]})),ca.getMetadata().catch(()=>({data:{domains:[]}}))]);T.existingTypes=o.data||[],T.domains=((a=s.data)==null?void 0:a.domains)||[]}catch(o){console.warn("Could not load metadata for module builder:",o)}Ie()}}function Ie(){const a=document.getElementById("app");let o="";T.step===1?o=ld():T.step===2?o=dd():T.step===3?o=ud():T.step===4?o=pd():T.step===5?o=hd():T.step===6?o=md():T.step===7&&(o=fd());const s=[{num:1,label:"Basics"},{num:2,label:"Form & Fields"},{num:3,label:"Workflow"},{num:4,label:"Rules"},{num:5,label:"Reports"},{num:6,label:"Review"}],r=s.map((d,u)=>`
    <div style="display:flex; align-items:center; gap:0.4rem; color:${T.step>=d.num?"var(--primary)":"var(--gray-400)"}; font-weight:${T.step===d.num?"bold":"normal"}; font-size:13px;">
      <span style="width:24px; height:24px; border-radius:50%; background:${T.step>=d.num?"var(--primary)":"#e5e7eb"}; color:${T.step>=d.num?"#fff":"#4b5563"}; display:flex; align-items:center; justify-content:center; font-size:12px;">${d.num}</span>
      ${d.label}
    </div>
    ${u<s.length-1?`<div style="flex:1; height:2px; background:${T.step>d.num?"var(--primary)":"#e5e7eb"}; margin:0 4px;"></div>`:""}
  `).join("");a.innerHTML=_e(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>No-Code Module Builder</h1>
        <p>Design and deploy brand-new civic governance capabilities purely through metadata.</p>
      </div>
    </div>

    <!-- Stepper Navigation -->
    <div class="card mb-6" style="padding: 0.8rem 1.2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; overflow-x:auto;">
        ${r}
      </div>
    </div>

    ${o}
  `,"Module Builder"),xe(),vd()}function ld(){const a=T.domains&&T.domains.length>0?T.domains.map(o=>`<option value="${o.domain_id}" ${T.basics.domain_id==o.domain_id?"selected":""}>${ee(o.domain_name)}</option>`).join(""):'<option value="1">Civic Operations</option>';return`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 1: Module Basics</div>
        <div class="card-subtitle">Define the name, domain, and description for your new civic capability.</div>
      </div>
      <div class="card-body">
        <form id="step1-form">
          <div class="form-group">
            <label class="form-label">Module / Entity Type Name <span class="required">*</span></label>
            <input type="text" id="module-name" class="form-control" placeholder="e.g. Park Renovation Request, Public Grievance" value="${ee(T.basics.name)}" required>
            <div class="form-hint">Must be unique across the platform.</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="module-desc" class="form-control" rows="3" placeholder="Briefly describe what this module governs...">${ee(T.basics.description)}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group" style="flex:1;">
              <label class="form-label">Civic Domain</label>
              <select id="module-domain" class="form-control" onchange="state.basics.domain_id = Number(this.value)">
                ${a}
              </select>
            </div>
            <div class="form-group" style="flex:1;">
              <label class="form-label">Icon Identifier</label>
              <select id="module-icon" class="form-control">
                <option value="📋" ${T.basics.icon==="📋"?"selected":""}>📋 Form / Registration</option>
                <option value="📢" ${T.basics.icon==="📢"?"selected":""}>📢 Notice / Alert</option>
                <option value="🛡️" ${T.basics.icon==="🛡️"?"selected":""}>🛡️ Governance / Policy</option>
                <option value="💼" ${T.basics.icon==="💼"?"selected":""}>💼 Employment / Exchange</option>
                <option value="🤝" ${T.basics.icon==="🤝"?"selected":""}>🤝 Volunteer / Community</option>
                <option value="🌳" ${T.basics.icon==="🌳"?"selected":""}>🌳 Parks / Environment</option>
                <option value="🏗️" ${T.basics.icon==="🏗️"?"selected":""}>🏗️ Infrastructure</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="submit" class="btn btn-primary">Next: Form & Fields →</button>
          </div>
        </form>
      </div>
    </div>
  `}function dd(){const a=T.basics.name?`${T.basics.name} Form`:"Module Registration Form",o=T.form.sections.map((s,r)=>{const d=s.parameters.map((u,p)=>{const h=u.field_type==="select";return`
        <div style="background:var(--gray-50, #f9fafb); border:1px solid var(--gray-200, #e5e7eb); border-radius:8px; padding:12px; margin-bottom:10px; position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-weight:600; font-size:13px; color:var(--gray-700);">Field #${p+1} (${ee(u.field_key||"field")})</span>
            <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeParam(${r}, ${p})" style="padding:2px 6px;">✕ Remove</button>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:2;">
              <label class="form-label" style="font-size:12px;">Field Label <span class="required">*</span></label>
              <input type="text" class="form-control" value="${ee(u.label)}" onchange="window.updateParam(${r}, ${p}, 'label', this.value)" placeholder="e.g. Budget, Location" required>
            </div>
            <div class="form-group" style="flex:1.5;">
              <label class="form-label" style="font-size:12px;">Data Type</label>
              <select class="form-control" onchange="window.updateParam(${r}, ${p}, 'field_type', this.value)">
                <option value="text" ${u.field_type==="text"?"selected":""}>Text Input</option>
                <option value="textarea" ${u.field_type==="textarea"?"selected":""}>Long Text (Textarea)</option>
                <option value="number" ${u.field_type==="number"?"selected":""}>Number (Metric)</option>
                <option value="date" ${u.field_type==="date"?"selected":""}>Date</option>
                <option value="select" ${u.field_type==="select"?"selected":""}>Dropdown Select</option>
              </select>
            </div>
            <div class="form-group" style="flex:1; display:flex; align-items:flex-end; padding-bottom:8px;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:13px;">
                <input type="checkbox" ${u.mandatory?"checked":""} onchange="window.updateParam(${r}, ${p}, 'mandatory', this.checked)">
                Required?
              </label>
            </div>
          </div>

          ${h?`
            <div style="margin-top:8px; padding-top:8px; border-top:1px dashed var(--gray-200);">
              <label class="form-label" style="font-size:12px;">Dropdown Choices (comma-separated)</label>
              <input type="text" class="form-control" value="${ee((u.options||[]).join(", "))}" onchange="window.updateParamOptions(${r}, ${p}, this.value)" placeholder="Choice 1, Choice 2, Choice 3">
            </div>
          `:""}
        </div>
      `}).join("");return`
      <div class="card mb-4" style="border:1px solid var(--gray-300);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
          <input type="text" class="form-control" style="font-weight:bold; max-width:300px;" value="${ee(s.name)}" onchange="window.updateSectionName(${r}, this.value)">
          <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeSection(${r})">Delete Section</button>
        </div>
        <div class="card-body">
          ${d}
          <button type="button" class="btn btn-secondary btn-sm mt-2" onclick="window.addParam(${r})">+ Add Field</button>
        </div>
      </div>
    `}).join("");return`
    <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px;">
      <div>
        <div class="card mb-4">
          <div class="card-header">
            <div class="card-title">Step 2: Form & Field Configuration</div>
            <div class="card-subtitle">Define parameters and form sections for "${ee(T.basics.name)}".</div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Form Title</label>
              <input type="text" id="form-name-input" class="form-control" value="${ee(a)}" onchange="state.form.name = this.value">
            </div>
          </div>
        </div>

        ${o}

        <div class="mb-6">
          <button type="button" class="btn btn-secondary" onclick="window.addSection()">+ Add Section</button>
        </div>

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=1; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="window.validateAndGoStep3()">Next: Workflow →</button>
        </div>
      </div>

      <!-- Right Column: Live Interactive Preview -->
      <div>
        <div class="card" style="position:sticky; top:20px; border-top: 4px solid var(--primary);">
          <div class="card-header flex justify-between align-center">
            <div class="card-title" style="display:flex; align-items:center; gap:8px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              Live Form Preview
            </div>
            <span class="badge badge-role-citizen">Generic FormEngine</span>
          </div>
          <div class="card-body" style="max-height:80vh; overflow-y:auto;">
            ${cd()}
          </div>
        </div>
      </div>
    </div>
  `}function cd(){const a=T.basics.name?`${T.basics.name} Form`:"Untitled Form";let o=`<div style="font-weight:bold; font-size:1.1rem; margin-bottom:12px; color:var(--gray-900);">${ee(a)}</div>`;return T.form.sections.forEach(s=>{o+=`
      <div style="margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
        <div style="font-weight:600; font-size:14px; color:var(--primary); margin-bottom:8px;">${ee(s.name)}</div>
    `,s.parameters.forEach(r=>{const d=r.mandatory?'<span style="color:red">*</span>':"";if(o+=`<div style="margin-bottom:10px;">
        <label style="display:block; font-size:12px; font-weight:500; margin-bottom:4px;">${ee(r.label||"Unlabelled")} ${d}</label>`,r.field_type==="textarea")o+='<textarea class="form-control" rows="2" disabled placeholder="Text response..."></textarea>';else if(r.field_type==="number")o+='<input type="number" class="form-control" disabled placeholder="0">';else if(r.field_type==="date")o+='<input type="date" class="form-control" disabled>';else if(r.field_type==="select"){const u=r.options&&r.options.length?r.options:["Option 1","Option 2"];o+=`<select class="form-control" disabled>
          ${u.map(p=>`<option>${ee(p)}</option>`).join("")}
        </select>`}else o+='<input type="text" class="form-control" disabled placeholder="Text response...">';o+="</div>"}),o+="</div>"}),o}function ud(){const a=[{value:"citizen",label:"Citizen (Owner)"},{value:"coordinator_area",label:"Area Coordinator"},{value:"coordinator_general",label:"General Coordinator"},{value:"director",label:"Director"},{value:"admin",label:"Administrator"}],o=T.workflow.transitions.map((s,r)=>`
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:600; font-size:13px; color:#1e293b;">Transition #${r+1}</span>
        <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeTransition(${r})">✕ Remove</button>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">From Status</label>
          <input type="text" class="form-control" value="${ee(s.from)}" onchange="window.updateTransition(${r}, 'from', this.value)" placeholder="e.g. draft, submitted" required>
        </div>
        <div style="display:flex; align-items:center; padding-top:16px; font-weight:bold; color:#64748b;">→</div>
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">To Status</label>
          <input type="text" class="form-control" value="${ee(s.to)}" onchange="window.updateTransition(${r}, 'to', this.value)" placeholder="e.g. submitted, approved" required>
        </div>
        <div class="form-group" style="flex:1.2;">
          <label class="form-label" style="font-size:12px;">Allowed Role</label>
          <select class="form-control" onchange="window.updateTransition(${r}, 'role', this.value)">
            ${a.map(d=>`<option value="${d.value}" ${s.role===d.value?"selected":""}>${d.label}</option>`).join("")}
          </select>
        </div>
      </div>
    </div>
  `).join("");return`
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 3: Workflow & State Transitions</div>
        <div class="card-subtitle">Configure the state machine and permitted actor roles for "${ee(T.basics.name)}".</div>
      </div>
      <div class="card-body">
        <p style="font-size:13px; color:#64748b; margin-bottom:16px;">
          Define which roles can transition entities of this module from one state to another. These will be generated into <code>WorkflowMaster</code>.
        </p>

        ${o}

        <button type="button" class="btn btn-secondary btn-sm mb-6" onclick="window.addTransition()">+ Add Transition</button>

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=2; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="window.validateAndGoStep4()">Next: Rules →</button>
        </div>
      </div>
    </div>
  `}function pd(){return T.existingTypes.map(a=>`<option value="${a.entity_type_id}" ${T.rule.target_entity_type_id==a.entity_type_id?"selected":""}>${ee(a.name)}</option>`).join(""),`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 4: Relationship Rules (Optional)</div>
        <div class="card-subtitle">Configure cascading auto-creation when entities are approved or submitted.</div>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label" style="font-size:15px; font-weight:600;">Enable Auto-Creation Rule?</label>
          <div style="display:flex; gap:16px; margin-top:8px;">
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="radio" name="rule-enable" value="false" checked onchange="state.rule.enabled = false; renderWizard();">
              No rule (Standalone module)
            </label>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="radio" name="rule-enable" value="true"  onchange="state.rule.enabled = true; renderWizard();">
              Yes, auto-create linked entity
            </label>
          </div>
        </div>

        

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=3; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="state.step=5; renderWizard();">Next: Reports →</button>
        </div>
      </div>
    </div>
  `}function hd(){const a=[];T.form.sections.forEach(d=>d.parameters.forEach(u=>a.push(u)));const o=T.basics.name?`${T.basics.name}s by Area`:"Module Report",s=a.filter(d=>d.field_type==="number"),r=['<option value="area">area (Native Area)</option>','<option value="status">status (Workflow Status)</option>',...a.map(d=>`<option value="${ee(d.field_key||d.label)}" ${T.report.groupBy===(d.field_key||d.label)?"selected":""}>${ee(d.label)} (${d.field_type})</option>`)].join("");return s.map(d=>`
    <option value="${ee(d.field_key||d.label)}" ${T.report.metricField===(d.field_key||d.label)?"selected":""}>${ee(d.label)}</option>
  `).join(""),`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 5: Reporting Definition</div>
        <div class="card-subtitle">Configure dynamic analytical reporting for "${ee(T.basics.name)}" via ReportMaster.</div>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label style="display:flex; align-items:center; gap:8px; font-weight:600; cursor:pointer;">
            <input type="checkbox" checked onchange="state.report.enabled = this.checked; renderWizard();">
            Generate Default Analytical Report
          </label>
        </div>

        ${`
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
            <div class="form-group">
              <label class="form-label">Report Name <span class="required">*</span></label>
              <input type="text" class="form-control" value="${ee(o)}" onchange="state.report.name = this.value" placeholder="e.g. Park Requests by Area">
            </div>

            <div class="form-row">
              <div class="form-group" style="flex:1;">
                <label class="form-label">Group By Field</label>
                <select class="form-control" onchange="state.report.groupBy = this.value">
                  ${r}
                </select>
              </div>

              <div class="form-group" style="flex:1;">
                <label class="form-label">Aggregation Metric</label>
                <select class="form-control" onchange="state.report.metric = this.value; renderWizard();">
                  <option value="COUNT" selected>COUNT (Entity Count)</option>
                  <option value="SUM" >SUM (Sum of Numeric Field)</option>
                  <option value="AVG" >AVG (Average)</option>
                  <option value="MIN" >MIN (Minimum)</option>
                  <option value="MAX" >MAX (Maximum)</option>
                </select>
              </div>
            </div>

            

            <div class="form-group mb-0">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:13px;">
                <input type="checkbox" checked onchange="state.report.publicStats = this.checked">
                Public Statistics? (Allows citizens to view aggregated summary without row-level access)
              </label>
            </div>
          </div>
        `}

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=4; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="state.step=6; renderWizard();">Next: Review & Deploy →</button>
        </div>
      </div>
    </div>
  `}function md(){const a=`${T.basics.name} Form`,o=T.form.sections.reduce((r,d)=>r+d.parameters.length,0),s=`${T.basics.name}s by Area`;return`
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 6: Review & Deploy Module</div>
        <div class="card-subtitle">Review the complete declarative metadata definition before atomic deployment.</div>
      </div>
      <div class="card-body">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:20px;">
          <!-- Module & Form Header -->
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <span style="font-size:2.2rem;">${T.basics.icon}</span>
            <div>
              <div style="font-weight:bold; font-size:1.2rem; color:#0f172a;">${ee(T.basics.name)}</div>
              <div style="color:#64748b; font-size:13px;">${ee(T.basics.description||"Civic Operating System Module")}</div>
            </div>
          </div>
          
          <div style="border-top:1px solid #cbd5e1; padding-top:12px; font-size:13px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Form Definition
              </div>
              <div>Title: <strong>${ee(a)}</strong></div>
              <div>Sections: <strong>${T.form.sections.length}</strong></div>
              <div>Total Parameters: <strong>${o}</strong></div>
            </div>
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Workflow (${T.workflow.transitions.length} transitions)
              </div>
              ${T.workflow.transitions.map(r=>`<div style="font-size:12px;">• <code>${ee(r.from)}</code> → <code>${ee(r.to)}</code> (${ee(r.role)})</div>`).join("")}
            </div>
          </div>

          <div style="border-top:1px solid #cbd5e1; margin-top:12px; padding-top:12px; font-size:13px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Automation Rule
              </div>
              <div>None</div>
            </div>
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                Reporting
              </div>
              <div>${`${ee(s)} (${T.report.metric} by ${T.report.groupBy})`}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <button type="button" class="btn btn-ghost" onclick="state.step=5; renderWizard();" ${T.isSubmitting?"disabled":""}>← Back</button>
          <button type="button" class="btn btn-primary btn-lg" id="create-module-btn" onclick="window.submitModuleCreation()" style="display:inline-flex; align-items:center; gap:8px;">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Deploy Module via Metadata
          </button>
        </div>
      </div>
    </div>
  `}function fd(){return`
    <div class="card" style="max-width: 650px; margin: 0 auto; text-align: center; padding: 40px 20px;">
      <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:#dcfce7; color:#16a34a; margin:0 auto 16px;">
        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 style="font-size: 1.8rem; color: var(--gray-900); margin-bottom: 10px;">Module Successfully Deployed!</h2>
      <p style="color: var(--gray-600); margin-bottom: 24px;">
        <strong>"${ee(T.basics.name)}"</strong> has been generated atomically with complete Form, Workflow, Rule, and Report metadata.
      </p>

      <div style="display: flex; justify-content: center; gap: 12px;">
        <button class="btn btn-secondary btn-lg" onclick="state.step=1; state.basics.name=''; renderWizard();">Create Another Module</button>
        <button class="btn btn-primary btn-lg" onclick="navigate('/entities/new')">Test New Module Form →</button>
      </div>
    </div>
  `}function vd(){const a=document.getElementById("step1-form");a&&a.addEventListener("submit",o=>{o.preventDefault();const s=document.getElementById("module-name").value.trim(),r=document.getElementById("module-desc").value.trim(),d=document.getElementById("module-icon").value;if(!s){V("Module name is required");return}if(T.existingTypes.some(p=>p.name.toLowerCase()===s.toLowerCase())){V(`Module "${s}" already exists. Please choose a different name.`);return}T.basics.name=s,T.basics.description=r,T.basics.icon=d,T.step=2,Ie()})}window.addSection=()=>{const a=T.form.sections.length+1;T.form.sections.push({id:`sec_${Date.now()}`,name:`Section ${a}`,parameters:[{id:`param_${Date.now()}`,label:"New Field",field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}]}),Ie()};window.removeSection=a=>{if(T.form.sections.length<=1){V("Form must have at least one section");return}T.form.sections.splice(a,1),Ie()};window.updateSectionName=(a,o)=>{T.form.sections[a].name=o,Ie()};window.addParam=a=>{const o=T.form.sections[a].parameters.length+1;T.form.sections[a].parameters.push({id:`param_${Date.now()}`,label:`Field ${o}`,field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}),Ie()};window.removeParam=(a,o)=>{T.form.sections[a].parameters.splice(o,1),Ie()};window.updateParam=(a,o,s,r)=>{const d=T.form.sections[a].parameters[o];d[s]=r,s==="label"&&(d.field_key=r.toLowerCase().replace(/[^a-z0-9]/g,"_")),Ie()};window.updateParamOptions=(a,o,s)=>{const r=s.split(",").map(d=>d.trim()).filter(Boolean);T.form.sections[a].parameters[o].options=r,Ie()};window.validateAndGoStep3=()=>{for(const a of T.form.sections){if(!a.name.trim()){V("All sections must have a title");return}for(const o of a.parameters)if(!o.label.trim()){V("All fields must have a label");return}}T.step=3,Ie()};window.addTransition=()=>{T.workflow.transitions.push({from:"draft",to:"submitted",role:"citizen"}),Ie()};window.removeTransition=a=>{if(T.workflow.transitions.length<=1){V("Workflow must have at least one transition");return}T.workflow.transitions.splice(a,1),Ie()};window.updateTransition=(a,o,s)=>{T.workflow.transitions[a][o]=s,Ie()};window.validateAndGoStep4=()=>{for(let a=0;a<T.workflow.transitions.length;a++){const o=T.workflow.transitions[a];if(!o.from.trim()||!o.to.trim()){V(`Transition #${a+1} must have both from and to states.`);return}}T.step=4,Ie()};window.submitModuleCreation=async()=>{const a=document.getElementById("create-module-btn");a&&(a.disabled=!0,a.textContent="Deploying Metadata Atomically..."),T.isSubmitting=!0;try{const o=T.form.name||`${T.basics.name} Form`,s=T.report.name||`${T.basics.name}s by Area`,r={module:{name:T.basics.name,description:T.basics.description,domain_id:T.basics.domain_id||1},form:{name:o,sections:T.form.sections.map(u=>({name:u.name,parameters:u.parameters.map(p=>({field_key:p.field_key,label:p.label,field_type:p.field_type,mandatory:!!p.mandatory,options:p.options}))}))},workflow:{transitions:T.workflow.transitions.map(u=>({from_status:u.from,to_status:u.to,role:u.role}))},rules:T.rule.enabled&&T.rule.target_entity_type_id?[{target_entity_type_id:Number(T.rule.target_entity_type_id),event:T.rule.event||"approved",auto_create:!0,auto_approve:!1}]:[],reports:T.report.enabled?[{report_name:s,output_format:"grouped_count",filters:{groupBy:T.report.groupBy||"area",metric:T.report.metric||"COUNT",metricField:T.report.metricField||void 0,public_stats:T.report.publicStats}}]:[]},d=await nl.deploy(r);Ae(d.message||`Module "${T.basics.name}" deployed successfully!`),T.isSubmitting=!1,T.step=7,Ie()}catch(o){V(o.message||"Failed to deploy module"),T.isSubmitting=!1,a&&(a.disabled=!1,a.innerHTML='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Deploy Module via Metadata')}};function Fe(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}let Di=[],jo=[];async function gd(){if(!ot(ie))return;const a=document.getElementById("app");a.innerHTML=_e(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Reports</h1>
        <p>Analytical summaries and metric aggregations of municipal activity.</p>
      </div>
    </div>
    <div id="reports-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Reports"),xe();try{const[o,s]=await Promise.all([tn.list().catch(()=>({data:[]})),le.listTypes().catch(()=>({data:[]}))]);Di=o.data||[],jo=s.data||[],a.innerHTML=_e(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Reports</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Execute analytical query reports configured via ReportMaster metadata.
          </p>
        </div>
      </div>
      
      <div id="reports-container"></div>
    `,"Civic Reports",jo),xe(),yd(document.getElementById("reports-container"))}catch{V("Failed to load reports catalog"),document.getElementById("reports-container").innerHTML=`
      <div class="alert alert-error">Unable to load reports. Please try again later.</div>
    `}}function yd(a){if(!Di||Di.length===0){a.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No configured civic reports available</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Reports can be defined via ReportMaster metadata configurations in the Capability Builder.
        </p>
      </div>
    `;return}const o=Di.map(d=>{const u=at(d.entityType);return`
      <div class="report-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <span class="badge badge-primary" style="font-size:11px;">${Fe(u.shortTitle)}</span>
            <span class="badge badge-secondary" style="font-size:10px;">${Fe(d.metric_type||"COUNT")}</span>
          </div>
          <div class="report-card-title">${Fe(d.report_name)}</div>
          <div class="report-card-desc">
            Aggregates <strong>${Fe(u.shortTitle)}</strong> records grouped by <strong>${Fe(d.group_by_field||"area / status")}</strong>.
          </div>
        </div>
        
        <div>
          <div class="report-card-meta mb-3">
            <span>Group By: ${Fe(d.group_by_field||"area")}</span>
            <span>•</span>
            <span>Metric: ${Fe(d.metric_type||"COUNT")}</span>
          </div>
          <button class="btn btn-primary btn-full execute-report-btn" data-repid="${d.report_id}" style="display:inline-flex; align-items:center; justify-content:center; gap:6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Run Report
          </button>
        </div>
      </div>
    `}).join("");a.innerHTML=`
    <div class="reports-grid mb-8">
      ${o}
    </div>

    <!-- Execution Result Output Panel -->
    <div class="card" id="report-execution-panel" style="display:none;">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="card-title" id="execution-title">Report Results</div>
        <button class="btn btn-ghost btn-sm" id="btn-close-result">Close Panel</button>
      </div>
      <div class="card-body p-6" id="execution-body"></div>
    </div>
  `,a.querySelectorAll(".execute-report-btn").forEach(d=>{d.addEventListener("click",()=>{const u=d.getAttribute("data-repid");bd(u)})});const r=document.getElementById("btn-close-result");r&&r.addEventListener("click",()=>{document.getElementById("report-execution-panel").style.display="none"})}async function bd(a){const o=document.getElementById("report-execution-panel"),s=document.getElementById("execution-title"),r=document.getElementById("execution-body");if(!(!o||!r)){o.style.display="block",o.scrollIntoView({behavior:"smooth"}),r.innerHTML='<div class="loading-overlay" style="padding:24px;"><div class="spinner spinner-lg"></div></div>';try{const u=(await tn.execute(a)).data;s.textContent=`Report Results: ${u.reportName||"Execution"}`;const p=u.rows||[];if(p.length===0){r.innerHTML='<div class="text-muted text-center p-4">Report executed successfully, but returned 0 data rows.</div>';return}const h=p.map(m=>{var v;return`
      <tr>
        <td style="font-weight:600;">${Fe(m[u.groupBy]||m.area||m.status||"Total")}</td>
        <td style="font-weight:700; color:var(--primary);">${m[(v=u.metric)==null?void 0:v.toLowerCase()]||m.count||m.total_count||0}</td>
      </tr>
    `}).join("");r.innerHTML=`
      <div style="margin-bottom:16px; font-size:0.875rem; color:var(--text-secondary);">
        Metric: <strong>${Fe(u.metric)}</strong> | Grouped By: <strong>${Fe(u.groupBy)}</strong> | Total Groups: <strong>${p.length}</strong>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${Fe(u.groupBy||"Group")}</th>
              <th>Aggregation Metric (${Fe(u.metric)})</th>
            </tr>
          </thead>
          <tbody>
            ${h}
          </tbody>
        </table>
      </div>
    `}catch(d){V(d.message||"Report execution failed"),r.innerHTML=`<div class="alert alert-error">Execution Error: ${Fe(d.message)}</div>`}}}function ji(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}async function _d(){if(!ot(ie))return;const a=document.getElementById("app");a.innerHTML=_e(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Capabilities</h1>
        <p>Explore all available civic operations, initiatives, and request modules.</p>
      </div>
    </div>
    <div id="modules-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Capabilities"),xe();try{const s=(await le.listTypes().catch(()=>({data:[]}))).data||[];a.innerHTML=_e(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Capabilities</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Select a civic capability to initiate requests, grievances, community initiatives, or civic actions.
          </p>
        </div>
      </div>

      <div id="modules-container"></div>
    `,"Civic Capabilities",s),xe(),xd(document.getElementById("modules-container"),s)}catch{V("Failed to load civic capabilities"),document.getElementById("modules-container").innerHTML=`
      <div class="alert alert-error">Unable to load capabilities catalog. Please try again.</div>
    `}}function xd(a,o){if(!o||o.length===0){a.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:flex; align-items:center; justify-content:center; width:56px; height:56px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No capabilities configured</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Administrators can publish new civic capabilities using the No-Code Module Builder.
        </p>
      </div>
    `;return}const s=o.map(r=>{var p;const d=at(r),u=((p=r._count)==null?void 0:p.entities)||0;return`
      <div class="card capability-card" style="padding:24px; border-top:3px solid rgba(255, 90, 54, 0.45); display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-xs);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="display:flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:12px; background:rgba(255, 90, 54, 0.12); color:var(--primary);">
              ${vt(d.iconKey,24)}
            </div>
            <span class="badge badge-secondary" style="font-size:11px;">${u} Active Cases</span>
          </div>

          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--primary); margin-bottom:4px;">
            ${ji(d.category)}
          </div>

          <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
            ${ji(d.title)}
          </h3>

          <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.5;">
            ${ji(d.description)}
          </p>
        </div>

        <div style="display:flex; gap:10px; padding-top:16px; border-top:1px solid var(--border);">
          <a href="/entities?entity_type_id=${r.entity_type_id}" class="btn btn-secondary" style="flex:1; text-align:center; font-size:0.85rem;">
            Explore Cases
          </a>
          <a href="/entities/new?entity_type_id=${r.entity_type_id}" class="btn btn-translucent-orange" style="flex:1; text-align:center; font-size:0.85rem;">
            ${ji(d.actionLabel)} →
          </a>
        </div>
      </div>
    `}).join("");a.innerHTML=`
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:24px;">
      ${s}
    </div>
  `}function ke(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}let na=null,gi=!1,Ki=[];async function wd(){if(!da(["director","admin"],ie))return;const a=document.getElementById("app");a.innerHTML=_e(`
    <div style="padding: 24px 0;">
      <div class="loading-overlay" style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div class="spinner spinner-lg"></div>
        <div style="margin-top: 16px; color: var(--text-secondary); font-weight: 500;">
          Initializing Governance Intelligence Engine...
        </div>
      </div>
    </div>
  `,"/governance"),xe();try{Ki=(await le.listTypes().catch(()=>({data:[]}))).data||[],await ls()}catch(o){V(o.message||"Failed to load governance intelligence"),kd(o.message)}}async function ls(){gi=!0,Ho();try{const a=await al.analyze();if(a&&a.success)na=a.data,Ae("Governance telemetry updated");else throw new Error((a==null?void 0:a.error)||"Analysis returned invalid response")}catch(a){V(a.message||"Governance analysis failed")}finally{gi=!1,Ho()}}function Ho(){const a=document.getElementById("app");if(!a)return;if(!na&&gi){a.innerHTML=_e(`
      <div style="padding: 32px 0;">
        <div class="loading-overlay" style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="spinner spinner-lg"></div>
          <div style="margin-top: 16px; color: var(--text-secondary); font-weight: 600;">
            Running Deterministic Rules & Telemetry Pipeline...
          </div>
        </div>
      </div>
    `,"/governance",Ki),xe();return}const o=na||{},s=o.summary_metrics||{},r=o.process_health||{pipeline:[]},d=o.exceptions||[],u=o.stakeholder_intelligence||[],p=o.ai_summary||null,h=o.analysis_mode==="AI_ASSISTED",m=`
    <div class="governance-page" style="padding: 20px 0 60px 0;">

      <!-- SIMULATION DISCLAIMER BANNER -->
      <div style="background: linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%); border: 1px solid #bfdbfe; border-left: 5px solid #3b82f6; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; display: flex; align-items: flex-start; gap: 14px;">
        <div style="color: #2563eb; flex-shrink: 0; margin-top: 2px;">
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div style="flex: 1; font-size: 13px; line-height: 1.5; color: #1e3a8a;">
          <strong style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
            Simulated Governance Environment (Civic Intelligence Capability)
          </strong>
          All transactions, records, and verification workflows shown here are synthetic simulation scenarios generated to test algorithmic control-gap detection and process health monitoring. No conclusions or allegations regarding real individuals, trusts, or public bodies are made.
        </div>
      </div>

      <!-- PAGE HEADER -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 28px;">
        <div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
            <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin: 0;">
              Governance Intelligence
            </h1>
            <span style="background: ${h?"rgba(147, 51, 234, 0.12)":"rgba(100, 116, 139, 0.12)"}; color: ${h?"#9333ea":"#475569"}; border: 1px solid ${h?"rgba(147, 51, 234, 0.3)":"rgba(100, 116, 139, 0.25)"}; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
              ${h?`
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14H8a4 4 0 01-.986-7.876 4 4 0 017.972 0A4 4 0 0112 14z"></path>
                </svg>
                AI-ASSISTED SYNTHESIS (GEMINI)
              `:`
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                DETERMINISTIC ENGINE ONLY
              `}
            </span>
          </div>
          <p style="color: var(--text-secondary); margin: 0; font-size: 14px;">
            Target Module: <strong style="color: var(--text-primary);">${ke(o.entity_type_name||"Donation Transaction")}</strong> • 
            Telemetry analyzed at ${o.analyzed_at?new Date(o.analyzed_at).toLocaleTimeString():"now"}
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <button id="btn-reanalyze" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 600;" ${gi?"disabled":""}>
            ${gi?`
              <div class="spinner spinner-sm" style="border-top-color:#fff;"></div>
              Analyzing Telemetry...
            `:`
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Re-run Intelligence Engine
            `}
          </button>
        </div>
      </div>

      <!-- KPI METRIC CARDS -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px;">
        
        <div class="card" style="padding: 18px; border-top: 4px solid var(--primary);">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Total Volume</div>
          <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 6px 0 2px 0;">${s.total_transactions??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Transactions tracked</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #16a34a;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Verified</div>
          <div style="font-size: 2rem; font-weight: 800; color: #16a34a; margin: 6px 0 2px 0;">${s.verified_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Confirmed verification</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #ea580c;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Pending Verification</div>
          <div style="font-size: 2rem; font-weight: 800; color: #ea580c; margin: 6px 0 2px 0;">${s.pending_verification_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Awaiting officer review</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #dc2626;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Failed Verification</div>
          <div style="font-size: 2rem; font-weight: 800; color: #dc2626; margin: 6px 0 2px 0;">${s.failed_verification_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Process failures flagged</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #ca8a04;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Unreconciled</div>
          <div style="font-size: 2rem; font-weight: 800; color: #ca8a04; margin: 6px 0 2px 0;">${s.unresolved_reconciliation_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Bank matching pending</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #9333ea;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Exceptions Flagged</div>
          <div style="font-size: 2rem; font-weight: 800; color: #9333ea; margin: 6px 0 2px 0;">${d.length}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Deterministic control gaps</div>
        </div>

      </div>

      <!-- PROCESS HEALTH PIPELINE VISUALIZER -->
      <div class="card" style="padding: 24px; margin-bottom: 28px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
          <div>
            <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0;">
              Process Health Pipeline
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin: 2px 0 0 0;">
              Lifecycle workflow stage velocity and dwell time computed from real AuditLog history
            </p>
          </div>
          <span style="font-size: 12px; font-weight: 600; color: var(--text-muted);">
            Authoritative Workflow: Entity.status
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; position: relative;">
          ${(r.pipeline||[]).map((y,g)=>{const w=y.exception_count>0;return`
              <div style="background: var(--gray-50); border: 1px solid ${w?"#fca5a5":"var(--gray-200)"}; border-radius: 8px; padding: 14px; position: relative;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 11px; font-weight: 700; background: var(--gray-200); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                    STAGE ${g+1}
                  </span>
                  ${w?`
                    <span style="font-size: 11px; font-weight: 700; background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                      ⚠️ ${y.exception_count} gap${y.exception_count>1?"s":""}
                    </span>
                  `:`
                    <span style="font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px;">
                      ✓ Healthy
                    </span>
                  `}
                </div>
                <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); text-transform: capitalize; margin-bottom: 4px;">
                  ${ke(y.label||y.stage)}
                </div>
                <div style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
                  ${y.count} <span style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">in stage</span>
                </div>
                <div style="font-size: 12px; color: var(--text-muted); border-top: 1px dashed var(--gray-200); padding-top: 6px; margin-top: 6px;">
                  ⏱ ${y.avg_days_in_stage!==null?`${y.avg_days_in_stage} days avg`:"Terminal stage"}
                </div>
              </div>
            `}).join("")}
        </div>
      </div>

      <!-- AI-ASSISTED EXECUTIVE SYNTHESIS (IF PRESENT) -->
      ${p?`
        <div class="card" style="border: 1px solid #d8b4fe; background: linear-gradient(180deg, #faf5ff 0%, #ffffff 100%); padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 16px rgba(147, 51, 234, 0.06);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #f3e8ff; padding-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="background: #9333ea; color: #ffffff; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h2 style="font-size: 1.2rem; font-weight: 800; color: #581c87; margin: 0;">
                  Executive Synthesis & Risk Assessment
                </h2>
                <div style="font-size: 12px; color: #7e22ce;">
                  Synthesized via Gemini AI from live deterministic exception telemetry
                </div>
              </div>
            </div>
            <span style="background: #9333ea; color: #ffffff; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
              AI: ${ke(p.analysis_mode||"AI")}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 18px;">
            <div>
              <h3 style="font-size: 13px; font-weight: 700; color: #581c87; text-transform: uppercase; margin-bottom: 6px;">
                Pipeline Velocity Assessment
              </h3>
              <p style="font-size: 13px; line-height: 1.6; color: #374151; margin: 0;">
                ${ke(p.process_health_narrative||"Pipeline telemetry shows operational stages operating within standard thresholds.")}
              </p>
            </div>
            <div>
              <h3 style="font-size: 13px; font-weight: 700; color: #581c87; text-transform: uppercase; margin-bottom: 6px;">
                Control Gap Concentration
              </h3>
              <p style="font-size: 13px; line-height: 1.6; color: #374151; margin: 0;">
                ${ke(p.risk_narrative||"Exceptions detected require periodic verification per standard governance protocols.")}
              </p>
            </div>
          </div>

          ${Array.isArray(p.recommendations)&&p.recommendations.length>0?`
            <div style="background: #ffffff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 14px 18px;">
              <h3 style="font-size: 12px; font-weight: 700; color: #6b21a8; text-transform: uppercase; margin-bottom: 8px;">
                Recommended Corrective Governance Actions
              </h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #4b5563;">
                ${p.recommendations.map(y=>`<li>${ke(y)}</li>`).join("")}
              </ul>
            </div>
          `:""}
        </div>
      `:`
        <div style="background: var(--gray-50); border: 1px dashed var(--gray-300); border-radius: 8px; padding: 16px 20px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 13px; color: var(--text-secondary);">
            <strong>Deterministic Mode Active:</strong> All exception rules, pipeline metrics, and stakeholder mappings are computed via deterministic database queries. AI synthesis is optional.
          </div>
          <span style="font-size: 11px; font-weight: 700; background: var(--gray-200); color: var(--gray-700); padding: 3px 8px; border-radius: 4px;">
            MODE: DETERMINISTIC_ONLY
          </span>
        </div>
      `}

      <!-- DETERMINISTIC EXCEPTION REGISTER -->
      <div class="card" style="padding: 24px; margin-bottom: 28px;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px;">
          <div>
            <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0;">
              Deterministic Exception Register
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin: 2px 0 0 0;">
              Rules-based anomalies detected directly from Entity state, ParameterValues, and AuditLog telemetry
            </p>
          </div>
          <span style="background: #fee2e2; color: #b91c1c; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;">
            ${d.length} Active Observations
          </span>
        </div>

        ${d.length===0?`
          <div style="text-align: center; padding: 32px; color: var(--text-secondary);">
            <div style="font-size: 2rem; margin-bottom: 8px;">✓</div>
            <strong>Zero Exceptions Detected</strong>
            <p style="font-size: 13px; margin-top: 4px;">All transactions strictly satisfy configured governance and state-sync rules.</p>
          </div>
        `:`
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${d.map(y=>`
              <div style="border: 1px solid var(--gray-200); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; background: #ffffff;">
                <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; font-weight: 700; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-family: monospace;">
                      ${ke(y.trigger_rule)}
                    </span>
                    <strong style="font-size: 14px; color: var(--text-primary);">
                      ${ke(y.observation)}
                    </strong>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 10px; font-weight: 700; background: var(--gray-100); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                      MODE: ${ke(y.analysis_mode||"DETERMINISTIC")}
                    </span>
                    ${y.requires_human_review?`
                      <span style="font-size: 10px; font-weight: 700; background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px;">
                        HUMAN REVIEW REQUIRED
                      </span>
                    `:""}
                  </div>
                </div>

                <div style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; font-family: monospace; font-size: 12px; color: #1e293b;">
                  <strong>Evidence:</strong> ${ke(y.evidence)}
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; font-size: 12.5px;">
                  <div>
                    <span style="color: var(--text-secondary); font-weight: 600;">Possible Process Weakness:</span>
                    <div style="color: var(--text-primary); margin-top: 2px;">${ke(y.possible_cause)}</div>
                  </div>
                  <div>
                    <span style="color: var(--text-secondary); font-weight: 600;">Governance Recommendation:</span>
                    <div style="color: var(--text-primary); margin-top: 2px;">${ke(y.recommendation)}</div>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>

      <!-- STAKEHOLDER INTELLIGENCE MATRIX -->
      <div class="card" style="padding: 24px;">
        <div style="margin-bottom: 18px;">
          <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0;">
            Stakeholder Intelligence Matrix
          </h2>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 2px 0 0 0;">
            Configured in DashboardMaster metadata and populated dynamically with live telemetry evidence
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
          ${u.map(y=>`
            <div style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 18px; background: var(--gray-50); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <strong style="font-size: 15px; color: var(--text-primary);">
                    ${ke(y.stakeholder)}
                  </strong>
                  <span style="font-size: 10px; font-weight: 700; background: var(--gray-200); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                    ${ke(y.analysis_mode||"DETERMINISTIC")}
                  </span>
                </div>
                
                <div style="margin-bottom: 10px;">
                  <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Core Responsibility</div>
                  <div style="font-size: 13px; color: var(--text-primary); margin-top: 2px;">${ke(y.interest)}</div>
                </div>

                <div style="margin-bottom: 10px;">
                  <div style="font-size: 11px; font-weight: 700; color: #b91c1c; text-transform: uppercase;">Governance Concern</div>
                  <div style="font-size: 13px; color: #7f1d1d; margin-top: 2px;">${ke(y.concern)}</div>
                </div>

                <div style="margin-bottom: 12px;">
                  <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Relevant Process Stage</div>
                  <div style="font-size: 12.5px; color: var(--text-primary); margin-top: 2px; font-family: monospace;">${ke(y.relevant_process)}</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid var(--gray-200); border-radius: 6px; padding: 10px; font-size: 12px; color: #334155;">
                <strong style="color: var(--text-secondary); display: block; margin-bottom: 2px; font-size: 11px; text-transform: uppercase;">Live Telemetry Evidence:</strong>
                ${ke(y.evidence)}
              </div>
            </div>
          `).join("")}
        </div>
      </div>

    </div>
  `;a.innerHTML=_e(m,"/governance",Ki),xe();const v=document.getElementById("btn-reanalyze");v&&v.addEventListener("click",()=>{ls()})}function kd(a){const o=document.getElementById("app");o&&(o.innerHTML=_e(`
    <div style="padding: 40px 0; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 12px;">⚠️</div>
      <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 8px;">Governance Intelligence Error</h2>
      <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px auto;">
        ${ke(a||"Unable to execute governance analysis.")}
      </p>
      <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
    </div>
  `,"/governance",Ki),xe())}let mi=null,Fi=!1,aa=null,nt=null;function je(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function ds(a){return je(a).replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}function cs(a){return!a||isNaN(a)?"":a<1024?a+" B":a<1024*1024?(a/1024).toFixed(1)+" KB":(a/(1024*1024)).toFixed(1)+" MB"}function Ld(a,o=null){let s="";o&&(o.isImage&&o.previewUrl?s=`
        <div class="agent-user-attachment">
          <img src="${je(o.previewUrl)}" alt="${je(o.name)}" class="agent-attachment-thumb" />
          <div class="agent-attachment-meta">
            <span class="agent-attachment-name">📷 ${je(o.name)}</span>
            <span class="agent-attachment-size">${je(o.sizeStr)}</span>
          </div>
        </div>
      `:s=`
        <div class="agent-user-attachment agent-attachment-doc">
          <span class="agent-attachment-icon">📄</span>
          <div class="agent-attachment-meta">
            <span class="agent-attachment-name">${je(o.name)}</span>
            <span class="agent-attachment-size">${je(o.sizeStr)}</span>
          </div>
        </div>
      `);const r=a?`<div class="agent-bubble-text">${je(a)}</div>`:"";return`
    <div class="agent-msg-row agent-msg-user">
      <div class="agent-bubble agent-bubble-user">
        ${s}
        ${r}
      </div>
    </div>
  `}function oa(a){return`
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <div class="agent-bubble agent-bubble-agent">${ds(a)}</div>
    </div>
  `}function Cd(a,o){const s=Array.isArray(a)?a.map(d=>`
        <div class="agent-confirm-row ${d.isFile?"agent-confirm-file-row":""}">
          <span class="agent-confirm-label">${je(d.label)}</span>
          <span class="agent-confirm-value">${je(d.value)}</span>
        </div>`).join(""):"";return`
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div class="agent-confirm-card">
        <div class="agent-confirm-title">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);flex-shrink:0;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          Submission Summary — Please Review
        </div>
        ${o?`<p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:12px;">${ds(o.split(`

`)[0])}</p>`:""}
        <div class="agent-confirm-table">${s}</div>
        <div class="agent-confirm-note" style="margin-top:10px; font-size:0.75rem; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
          <span>📎</span> <span>Uploaded photo/document evidence will be attached directly to your official submission.</span>
        </div>
        <div class="agent-confirm-actions" id="agent-confirm-btns">
          <button id="agent-submit-btn" class="btn btn-primary" style="min-width:120px;">
            ✓ Submit
          </button>
          <button id="agent-cancel-btn" class="btn btn-secondary" style="min-width:100px;">
            ✗ Cancel
          </button>
        </div>
      </div>
    </div>
  `}function Ed(a,o,s,r=[]){const d=Array.isArray(r)&&r.length>0?`<div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px; display:flex; align-items:center; gap:4px;">
         <span>📎</span> <span>Attached evidence: <strong>${r.map(je).join(", ")}</strong></span>
       </div>`:"";return`
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" style="background:var(--green-600);" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div class="agent-success-card">
        <div style="font-weight:700; font-size:1rem; color:var(--green-700); margin-bottom:6px;">
          ✅ ${je(s)} Submitted!
        </div>
        <div style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:8px;">
          <strong>#${a}</strong> — ${je(o)}
        </div>
        ${d}
        <a href="/entities/${a}" class="btn btn-sm btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          View My Request
        </a>
        <button id="agent-new-request-btn" class="btn btn-sm btn-ghost" style="margin-left:8px;">
          + Start New Request
        </button>
      </div>
    </div>
  `}function Td(){return`
    <div class="agent-msg-row agent-msg-agent" id="agent-thinking">
      <div class="agent-bubble-avatar" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <div class="agent-bubble agent-bubble-agent agent-thinking-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `}function zd(){return document.getElementById("agent-thread")}function sa(){return document.getElementById("agent-input")}function Md(){return document.getElementById("agent-send-btn")}function Sd(){return document.getElementById("agent-attach-btn")}function us(){return document.getElementById("agent-file-input")}function Ft(a){const o=zd();if(!o)return;const s=document.createElement("div");for(s.innerHTML=a;s.firstChild;)o.appendChild(s.firstChild);o.scrollTop=o.scrollHeight}function Do(){const a=document.getElementById("agent-thinking");a&&a.remove()}function Vn(a){const o=sa(),s=Md(),r=Sd();o&&(o.disabled=!a),s&&(s.disabled=!a,s.style.opacity=a?"1":"0.5"),r&&(r.disabled=!a,r.style.opacity=a?"1":"0.5")}function ga(){var r;const a=document.getElementById("agent-file-preview-bar");if(!a)return;if(!nt){a.innerHTML="",a.style.display="none";return}const o=nt.type.startsWith("image/"),s=o?URL.createObjectURL(nt):null;a.style.display="flex",a.innerHTML=`
    <div class="agent-preview-chip">
      ${o?`<img src="${s}" class="agent-preview-thumb" alt="Preview" />`:'<span class="agent-preview-icon">📄</span>'}
      <div class="agent-preview-info">
        <span class="agent-preview-filename">${je(nt.name)}</span>
        <span class="agent-preview-filesize">${cs(nt.size)}</span>
      </div>
      <button type="button" id="agent-remove-file-btn" class="agent-preview-remove" title="Remove attachment" aria-label="Remove attachment">&times;</button>
    </div>
  `,(r=document.getElementById("agent-remove-file-btn"))==null||r.addEventListener("click",()=>{nt=null;const d=us();d&&(d.value=""),ga()})}async function yi(a,o=null){const s=o||nt,r=(a||"").trim();if(Fi||!r&&!s)return;Fi=!0;let d=null;if(s){const h=s.type.startsWith("image/");d={name:s.name,sizeStr:cs(s.size),isImage:h,previewUrl:h?URL.createObjectURL(s):null}}const u=sa();u&&(u.value="",u.style.height="auto"),nt=null;const p=us();p&&(p.value=""),ga(),Ft(Ld(r||(s?`Uploaded: ${s.name}`:""),d)),Vn(!1),Ft(Td());try{const h=await qi.chat(mi,r,s);Do();const m=h.data;aa=null,m.type==="confirm"?(aa=m,Ft(Cd(m.summary||[],m.text)),setTimeout(()=>{const v=document.getElementById("agent-submit-btn"),y=document.getElementById("agent-cancel-btn");v&&v.addEventListener("click",()=>{var g;(g=document.getElementById("agent-confirm-btns"))==null||g.remove(),yi("yes")}),y&&y.addEventListener("click",()=>{var g;(g=document.getElementById("agent-confirm-btns"))==null||g.remove(),yi("cancel")})},50)):m.type==="submitted"?(Ft(Ed(m.entity_id,m.entity_name,m.capability,m.files)),Vn(!1),setTimeout(()=>{const v=document.getElementById("agent-new-request-btn");v&&v.addEventListener("click",()=>{ie("/agent/chat")})},50)):Ft(oa(m.text||"Something went wrong. Please try again."))}catch(h){Do(),Ft(oa("Sorry, I encountered an error processing your request. Please try again or use the manual form.")),console.error("[Agent Chat] Error:",h)}finally{if(Fi=!1,document.getElementById("agent-input")){Vn(!0);const h=sa();h&&!h.disabled&&h.focus()}}}async function Pd(a={},o=null){if(!ot(ie))return;mi=null,Fi=!1,aa=null,nt=null;const s=o||new URLSearchParams(window.location.search),r=s.get("sessionId"),d=s.get("message");mi=r||"ck-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);const u=document.getElementById("app");u.innerHTML=_e(`
    <style>
      /* ── Agent chat layout ── */
      .agent-chat-wrap {
        display: flex; flex-direction: column; height: calc(100vh - 140px);
        max-width: 780px; margin: 0 auto;
      }
      .agent-chat-header {
        display:flex; align-items:center; gap:12px;
        padding:16px 20px; background:var(--surface);
        border:1px solid var(--border); border-radius:12px 12px 0 0;
        border-bottom:none;
      }
      .agent-chat-avatar-wrap {
        width:38px;height:38px;border-radius:50%;
        background:linear-gradient(135deg,#ff5a36,#e03c22);
        display:flex;align-items:center;justify-content:center;flex-shrink:0;
      }
      #agent-thread {
        flex:1; overflow-y:auto; padding:20px;
        background:var(--surface); border:1px solid var(--border);
        display:flex; flex-direction:column; gap:12px;
      }
      /* Input bar & Attachment preview */
      .agent-input-container {
        display: flex; flex-direction: column;
        background:var(--surface); border:1px solid var(--border);
        border-radius:0 0 12px 12px; border-top: 1px solid var(--border-strong);
      }
      .agent-file-preview-bar {
        display: none; padding: 8px 16px 0 16px;
      }
      .agent-preview-chip {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 5px 10px; background: var(--bg); border: 1px solid var(--border-strong);
        border-radius: 8px; font-size: 0.8rem;
      }
      .agent-preview-thumb {
        width: 28px; height: 28px; object-fit: cover; border-radius: 4px;
      }
      .agent-preview-icon { font-size: 1.1rem; }
      .agent-preview-info { display: flex; flex-direction: column; line-height: 1.2; }
      .agent-preview-filename { font-weight: 600; color: var(--text-primary); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .agent-preview-filesize { font-size: 0.7rem; color: var(--text-muted); }
      .agent-preview-remove {
        background: none; border: none; font-size: 1rem; color: var(--text-muted);
        cursor: pointer; padding: 0 4px; line-height: 1;
      }
      .agent-preview-remove:hover { color: var(--red-600, #dc2626); }

      .agent-input-bar {
        display:flex; gap:8px; align-items:center;
        padding:12px 16px;
      }
      .agent-attach-btn {
        background: none; border: none; color: var(--text-secondary);
        cursor: pointer; padding: 8px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.2s, color 0.2s;
      }
      .agent-attach-btn:hover {
        background: var(--bg); color: var(--primary);
      }
      #agent-input {
        flex:1; padding:10px 14px; border-radius:20px;
        border:1px solid var(--border-strong); background:var(--bg);
        color:var(--text-primary); font-size:0.9rem; font-family:inherit;
        resize:none; outline:none; min-height:40px; max-height:120px;
        transition: border-color 0.2s;
      }
      #agent-input:focus { border-color:var(--primary); }

      /* Message rows */
      .agent-msg-row { display:flex; gap:8px; max-width:88%; }
      .agent-msg-user { align-self:flex-end; flex-direction:row-reverse; max-width:75%; }
      .agent-msg-agent { align-self:flex-start; }
      .agent-bubble {
        padding:10px 16px; border-radius:18px; font-size:0.875rem;
        line-height:1.55; word-break:break-word;
      }
      .agent-bubble-user {
        background:linear-gradient(135deg,#ff5a36,#e03c22);
        color:white; border-bottom-right-radius:4px;
      }
      .agent-bubble-agent {
        background:var(--surface-2,#f9f9fb); color:var(--text-primary);
        border:1px solid var(--border); border-bottom-left-radius:4px;
      }
      .agent-bubble-avatar {
        width:28px;height:28px;border-radius:50%;flex-shrink:0;margin-top:2px;
        background:linear-gradient(135deg,#ff5a36,#e03c22);
        display:flex;align-items:center;justify-content:center;
      }

      /* Attachment in bubble */
      .agent-user-attachment {
        display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
        background: rgba(0,0,0,0.15); padding: 6px 10px; border-radius: 10px;
      }
      .agent-attachment-thumb {
        width: 48px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.4);
      }
      .agent-attachment-icon { font-size: 1.5rem; }
      .agent-attachment-meta { display: flex; flex-direction: column; }
      .agent-attachment-name { font-weight: 600; font-size: 0.8rem; }
      .agent-attachment-size { font-size: 0.7rem; opacity: 0.85; }

      /* Thinking animation */
      .agent-thinking-dots { display:flex; gap:4px; padding:12px 16px; align-items:center; }
      .agent-thinking-dots span {
        width:7px;height:7px;background:var(--text-muted);border-radius:50%;
        animation:agent-dot-bounce 1.2s infinite ease-in-out;
      }
      .agent-thinking-dots span:nth-child(1){animation-delay:0s;}
      .agent-thinking-dots span:nth-child(2){animation-delay:0.2s;}
      .agent-thinking-dots span:nth-child(3){animation-delay:0.4s;}
      @keyframes agent-dot-bounce {
        0%,80%,100%{transform:scale(0.7);opacity:0.5;}
        40%{transform:scale(1);opacity:1;}
      }

      /* Confirm card */
      .agent-confirm-card {
        background:var(--surface); border:2px solid var(--primary);
        border-radius:12px; padding:18px 20px; max-width:480px;
      }
      .agent-confirm-title {
        font-weight:700; font-size:0.9rem; color:var(--text-primary);
        margin-bottom:12px; display:flex; align-items:center; gap:8px;
      }
      .agent-confirm-table { display:flex; flex-direction:column; gap:6px; }
      .agent-confirm-row {
        display:flex; gap:12px; font-size:0.83rem;
        padding:5px 0; border-bottom:1px solid var(--border);
      }
      .agent-confirm-file-row {
        background: rgba(255, 90, 54, 0.05); padding: 6px 8px; border-radius: 6px;
      }
      .agent-confirm-row:last-child { border-bottom:none; }
      .agent-confirm-label { font-weight:600; color:var(--text-secondary); min-width:130px; flex-shrink:0; }
      .agent-confirm-value { color:var(--text-primary); font-weight:500; }
      .agent-confirm-actions { display:flex; gap:10px; margin-top:16px; }

      /* Success card */
      .agent-success-card {
        background:var(--green-50,#f0fdf4); border:1px solid var(--green-200,#bbf7d0);
        border-radius:12px; padding:18px 20px; max-width:400px;
      }
    </style>

    <div class="agent-chat-wrap">
      <div class="agent-chat-header">
        <div class="agent-chat-avatar-wrap">
          <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <div>
          <div style="font-weight:700; font-size:0.95rem;">CIVIC-KALKI Assistant</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">
            Report problems · Upload photo evidence · Start initiatives · Check request status
          </div>
        </div>
        <div style="margin-left:auto;">
          <a href="/dashboard" class="btn btn-ghost btn-sm">← Dashboard</a>
        </div>
      </div>

      <div id="agent-thread" role="log" aria-live="polite" aria-label="Conversation with Civic Assistant">
        <!-- Initial greeting -->
        ${oa(`Hello! I'm your CIVIC-KALKI assistant. I can help you:

**1.** Report a civic problem (potholes, garbage, water supply, broken street lights…)
     *Tip: You can attach photo/document evidence directly using the 📎 button! Our AI will analyze the photo and fill the details for you.*
**2.** Start a civic initiative (community project, campaign…)
**3.** Check the status of your existing requests

What would you like to do today?`)}
      </div>

      <div class="agent-input-container">
        <!-- Attachment preview chip -->
        <div id="agent-file-preview-bar" class="agent-file-preview-bar"></div>

        <div class="agent-input-bar">
          <button
            id="agent-attach-btn"
            type="button"
            class="agent-attach-btn"
            title="Attach photo or document evidence"
            aria-label="Attach photo or document evidence"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="file"
            id="agent-file-input"
            style="display:none;"
            accept="image/*,.pdf,.doc,.docx,.txt,.csv"
          />

          <textarea
            id="agent-input"
            placeholder="Type your message or attach a photo…"
            rows="1"
            autocomplete="off"
            aria-label="Message to civic assistant"
          ></textarea>

          <button
            id="agent-send-btn"
            class="btn btn-primary"
            style="border-radius:20px; padding:10px 18px; white-space:nowrap;"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  `,"Civic Assistant"),xe();const p=document.getElementById("agent-input"),h=document.getElementById("agent-send-btn"),m=document.getElementById("agent-attach-btn"),v=document.getElementById("agent-file-input");!p||!h||(m==null||m.addEventListener("click",()=>{v==null||v.click()}),v==null||v.addEventListener("change",y=>{var w;const g=(w=y.target.files)==null?void 0:w[0];g&&(nt=g,ga(),p.focus())}),p.addEventListener("input",()=>{p.style.height="auto",p.style.height=Math.min(p.scrollHeight,120)+"px"}),p.addEventListener("keydown",y=>{y.key==="Enter"&&!y.shiftKey&&(y.preventDefault(),yi(p.value))}),h.addEventListener("click",()=>{yi(p.value)}),d&&d.trim()?setTimeout(()=>yi(decodeURIComponent(d)),120):p.focus(),window.addEventListener("beforeunload",()=>{mi&&qi.clearSession(mi)},{once:!0}))}function ft(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}const Fo={relatable:{primary:"#FF6B35",secondary:"#1A1A2E",accent:"#FFD700",text:"#FFFFFF"},awareness:{primary:"#2E86AB",secondary:"#1A1A2E",accent:"#A8DADC",text:"#FFFFFF"},cta:{primary:"#43AA8B",secondary:"#1A1A2E",accent:"#F8961E",text:"#FFFFFF"}};function ps(a){const{template_type:o="awareness",headline:s,caption:r,locality:d,category:u,photoUrl:p,shareLink:h,exportMode:m=!1}=a,v=Fo[o]||Fo.awareness,y=p?`background-image:url('${p}'); background-size:cover; background-position:center;`:`background:linear-gradient(135deg, ${v.secondary} 0%, #2d2d44 100%);`,g={relatable:"?? Relatable",awareness:"?? Awareness",cta:"CTA"}[o]||"?? Awareness",w={relatable:`
      <div style="background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;">
        <div style="font-size:22px;font-weight:800;color:${v.accent};letter-spacing:-0.5px;line-height:1.2;margin-bottom:10px;">${ft(s)}</div>
        <div style="font-size:15px;color:#fff;line-height:1.5;">${ft(r)}</div>
      </div>
    `,awareness:`
      <div style="background:rgba(46,134,171,0.85);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;border-left:4px solid ${v.accent};">
        <div style="font-size:12px;color:${v.accent};font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">CIVIC ISSUE � ${ft(u||"Infrastructure")}</div>
        <div style="font-size:20px;font-weight:700;color:#fff;line-height:1.2;margin-bottom:8px;">${ft(s)}</div>
        <div style="font-size:14px;color:#ddd;line-height:1.5;">${ft(r)}</div>
      </div>
    `,cta:`
      <div style="background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;">
        <div style="font-size:20px;font-weight:800;color:${v.accent};line-height:1.2;margin-bottom:8px;">${ft(s)}</div>
        <div style="font-size:14px;color:#fff;line-height:1.5;margin-bottom:12px;">${ft(r)}</div>
        <div style="display:inline-block;background:${v.primary};color:#fff;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:700;">Report &amp; Support ?</div>
      </div>
    `}[o]||"";return`
    <div class="${m?"":"ck-meme-card"}" id="meme-preview-canvas" style="
      width:360px;
      min-height:400px;
      border-radius:${m?"0":"16px"};
      overflow:hidden;
      position:relative;
      font-family:'Inter','Segoe UI',sans-serif;
      ${y}
      display:flex;
      flex-direction:column;
      justify-content:flex-end;
    ">
      <!-- Gradient overlay -->
      <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%);"></div>

      <!-- Template label badge -->
      <div style="position:absolute;top:12px;right:12px;background:${v.primary};color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;z-index:2;">
        ${g}
      </div>

      <!-- Locality badge -->
      <div style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.6);color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;z-index:2;">
        ?? ${ft(d||"Your Locality")}
      </div>

      <!-- Content -->
      <div style="position:relative;z-index:2;padding:16px;">
        ${w}

        <!-- Footer (mandatory � never remove) -->
        <div style="font-size:10px;color:rgba(255,255,255,0.55);text-align:center;padding-top:6px;border-top:1px solid rgba(255,255,255,0.15);margin-top:4px;">
          Civic awareness content | Caption AI-assisted
        </div>
      </div>
    </div>
  `}async function Ad(a,o="civic-meme.png"){const s=document.getElementById(a);if(!s)throw new Error("Meme canvas element not found.");try{const{toPng:r}=await Jn(async()=>{const{toPng:p}=await import("./index-6sdqbm2o.js");return{toPng:p}},[]),d=await r(s,{quality:.95,pixelRatio:2}),u=document.createElement("a");u.download=o,u.href=d,u.click()}catch(r){throw console.error("[MEME EXPORT] html-to-image failed:",r),new Error("Image export failed. Please try a screenshot instead.")}}function Pe(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}let k={step:1,issueId:null,issue:null,config:null,myIssues:[],category:"",locality:"",photoFile:null,photoPreviewUrl:null,eligibility:null,templateType:null,aiOptions:[],selectedOption:null,editedHeadline:"",editedCaption:"",captionSource:"manual",originalAiSuggestion:null,safetyResult:null,attestationAccepted:!1,submitting:!1};async function hs({issueId:a}){if(!ot(ie))return;const o=document.getElementById("app");o.innerHTML=_e(`
    <div class="page-header mb-4">
      <div class="topbar-breadcrumb mb-2">
        ${a?`<a href="/entities/${a}" class="text-link">Back to Issue</a>`:'<a href="/buzz" class="text-link">Back to Civic Buzz</a>'}
      </div>
      <h1>Civic Buzz Studio</h1>
      <p class="text-secondary" style="margin-top:4px;">Create civic awareness content. Every post requires moderator approval before publication.</p>
    </div>
    <div id="meme-studio-body"></div>
  `,"Civic Buzz Studio"),xe(),k.photoPreviewUrl&&URL.revokeObjectURL(k.photoPreviewUrl),k={...k,step:1,issueId:a?Number(a):null,issue:null,eligibility:null,config:null,myIssues:[],category:"",locality:"",photoFile:null,photoPreviewUrl:null},await Id(a)}async function Id(a){const o=document.getElementById("meme-studio-body");o.innerHTML='<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';try{const[s,r]=await Promise.all([P("GET","/meme/config"),P("GET","/meme/my-issues")]);if(k.config=s.data,k.myIssues=r.data||[],a){if(k.issue=k.myIssues.find(d=>Number(d.issue_id)===Number(a))||null,!k.issue){$d(o,"Only your own approved issues can be linked.");return}k.category=k.issue.category,k.locality=k.issue.locality}Bd(o)}catch(s){o.innerHTML=`<div class="alert alert-error">${Pe(s.message||"Failed to load issue.")}</div>`}}function $d(a,o){a.innerHTML=`
    <div class="alert alert-warning" style="max-width:600px;">
      <strong>? Cannot Create Meme Campaign</strong>
      <p style="margin-top:8px;">${Pe(o)}</p>
      <p style="margin-top:8px;color:var(--text-secondary);font-size:0.875rem;">
        If this is a serious matter (crime, harassment, communal issues), please
        <a href="/entities/new" class="text-link">file a Grievance</a> instead.
      </p>
    </div>
  `}function Bd(a){var p;const o=k.config.categories||[],s=k.config.localities||[],r=((p=k.issue)==null?void 0:p.issue_id)||"";a.innerHTML=`
    <div class="ck-studio-wizard" style="max-width:720px;">
      <h2 class="mb-2">Start a Civic Buzz post</h2>
      <p class="text-secondary mb-4">Add an issue photo, choose its category and locality, then send it for moderator review.</p>
      <label class="form-label" for="buzz-photo">Photo</label>
      <input id="buzz-photo" class="form-input mb-3" type="file" accept="image/*" capture="environment" />
      <div id="buzz-photo-preview" class="mb-4"></div>
      <label class="form-label" for="buzz-category">Category</label>
      <select id="buzz-category" class="form-input mb-3" ${r?"disabled":""}>
        <option value="">Choose a category</option>
        ${o.map(h=>`<option value="${Pe(h)}" ${h===k.category?"selected":""}>${Pe(h)}</option>`).join("")}
      </select>
      <label class="form-label" for="buzz-locality">Locality</label>
      <select id="buzz-locality" class="form-input mb-3" ${r?"disabled":""}>
        <option value="">Unassigned</option>
        ${s.map(h=>`<option value="${Pe(h)}" ${h===k.locality?"selected":""}>${Pe(h)}</option>`).join("")}
      </select>
      <label class="form-label" for="buzz-linked-issue">Link one of my approved issues (optional)</label>
      <select id="buzz-linked-issue" class="form-input mb-3">
        <option value="">Standalone post</option>
        ${k.myIssues.map(h=>`<option value="${h.issue_id}" ${Number(h.issue_id)===Number(r)?"selected":""}>${Pe(h.name)} (${Pe(h.category)})</option>`).join("")}
      </select>
      <div id="buzz-category-feedback" aria-live="polite" class="mb-3"></div>
      <button id="buzz-details-next" class="btn btn-primary" type="button" disabled onclick="window._memeStartBuzz()">Continue</button>
    </div>
  `;const d=document.getElementById("buzz-photo");d.addEventListener("change",()=>{var m;const h=((m=d.files)==null?void 0:m[0])||null;k.photoFile=h,k.photoPreviewUrl&&URL.revokeObjectURL(k.photoPreviewUrl),k.photoPreviewUrl=h?URL.createObjectURL(h):null,document.getElementById("buzz-photo-preview").innerHTML=k.photoPreviewUrl?`<img src="${k.photoPreviewUrl}" alt="Selected photo preview" style="max-width:100%;max-height:320px;border-radius:12px;" />`:"",u()}),document.getElementById("buzz-category").addEventListener("change",h=>{k.category=h.target.value,u()}),document.getElementById("buzz-locality").addEventListener("change",h=>{k.locality=h.target.value||"Unassigned"}),document.getElementById("buzz-linked-issue").addEventListener("change",h=>{const m=k.myIssues.find(v=>String(v.issue_id)===h.target.value)||null;k.issue=m,k.issueId=(m==null?void 0:m.issue_id)||null,m&&(k.category=m.category,k.locality=m.locality||"Unassigned",document.getElementById("buzz-category").value=k.category,document.getElementById("buzz-locality").value=k.locality==="Unassigned"?"":k.locality),document.getElementById("buzz-category").disabled=!!m,document.getElementById("buzz-locality").disabled=!!m,u()});function u(){const h=k.category.toLowerCase(),m=k.config.no_meme_categories.some(g=>h.includes(g.toLowerCase())),v=k.config.humor_allowed_categories.includes(h),y=m?'<div class="alert alert-error">This category cannot be used for Civic Buzz. Please use the <a href="/entities/new" class="text-link">Grievance form</a>.</div>':k.config.safety_sensitive_categories.some(g=>h.includes(g.toLowerCase()))?'<div class="alert alert-warning">Only neutral Awareness and CTA templates are available for this safety-sensitive category.</div>':!v&&h?'<div class="alert alert-info">Only Awareness and CTA templates are available for this category.</div>':"";document.getElementById("buzz-category-feedback").innerHTML=y,document.getElementById("buzz-details-next").disabled=!k.photoFile||!h||m}window._memeStartBuzz=()=>{const h=k.category.toLowerCase(),m=k.config.no_meme_categories.some(g=>h.includes(g.toLowerCase()));if(!k.photoFile||!h||m)return;const v=k.config.safety_sensitive_categories.some(g=>h.includes(g.toLowerCase())),y=k.config.humor_allowed_categories.includes(h);k.eligibility={eligible:!0,templateTypes:v?["awareness","cta"]:y?["relatable","awareness","cta"]:["awareness","cta"]},ms(a)}}function ms(a){k.step=1;const o=k.eligibility.templateTypes||[],s={relatable:{icon:"??",name:"Relatable",desc:`Light situational humor that makes people nod. "We've all been there." Perfect for everyday civic frustrations.`},awareness:{icon:"??",name:"Awareness",desc:"Factual, informative content that raises visibility for an issue. Facts from the actual report only."},cta:{icon:"??",name:"Call to Action",desc:"Energizing content that encourages citizens to report, support, or take action together."}};a.innerHTML=`
    <div class="ck-studio-wizard">
      ${Kt(2)}
      <h2 class="mb-2">Choose a Template</h2>
      <p class="text-secondary mb-4">Pick the tone that best fits this issue.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;max-width:720px;">
        ${o.map(r=>{const d=s[r]||{icon:"??",name:r,desc:""};return`
            <button class="ck-template-card" data-template="${r}" onclick="window._memePickTemplate('${r}')">
              <div style="font-size:2.5rem;margin-bottom:8px;">${d.icon}</div>
              <div style="font-weight:700;font-size:1rem;margin-bottom:6px;">${d.name}</div>
              <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;">${d.desc}</div>
            </button>
          `}).join("")}
      </div>
    </div>
  `,window._memePickTemplate=r=>{k.templateType=r,fs(a)}}async function fs(a){k.step=2,a.innerHTML=`
    <div class="ck-studio-wizard">
      ${Kt(3)}
      <h2 class="mb-2">Caption Your Meme</h2>
      <div class="loading-overlay" style="position:static;height:80px;"><div class="spinner"></div></div>
      <p class="text-secondary">Generating AI caption suggestions...</p>
    </div>
  `;let o={options:[],ai_unavailable:!1};try{o=(await P("POST","/meme/captions",{issue_id:k.issueId||null,category:k.category,locality:k.locality,template:k.templateType})).data}catch(m){o={options:[],ai_unavailable:!0,reason:m.message||"AI unavailable."}}k.aiOptions=o.options||[];const s=o.ai_unavailable?`<div class="alert alert-warning mb-3" style="max-width:640px;">
        <strong>?? AI Unavailable</strong>
        <p style="margin-top:4px;font-size:0.875rem;">${Pe(o.reason||"AI caption service is temporarily unavailable. Please write your own caption below.")}</p>
        <p style="font-size:0.75rem;color:var(--text-secondary);">Note: Automated safety check flagged as "unavailable" � moderator will review manually.</p>
      </div>`:"",r=k.aiOptions.length>0?`
      <div class="mb-3" style="max-width:640px;">
        <label class="form-label mb-2"><strong>AI Suggestions (select one to pre-fill):</strong></label>
        ${k.aiOptions.map((m,v)=>`
          <button class="ck-caption-option" onclick="window._memeSelectOption(${v})" id="capopt-${v}" style="display:block;width:100%;text-align:left;padding:12px 16px;margin-bottom:8px;border-radius:8px;border:2px solid var(--border-color);background:var(--bg-secondary);cursor:pointer;">
            <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);">${Pe(m.headline)}</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px;">${Pe(m.caption)}</div>
          </button>
        `).join("")}
      </div>
    `:"";a.innerHTML=`
    <div class="ck-studio-wizard" style="max-width:720px;">
      ${Kt(3)}
      <h2 class="mb-2">Caption Your Meme</h2>
      ${s}
      ${r}

      <div class="mb-3">
        <label class="form-label" for="meme-headline">Headline <span style="color:var(--text-muted);font-size:0.8rem;">(max 60 chars)</span></label>
        <input id="meme-headline" class="form-input" type="text" maxlength="60"
          placeholder="e.g. Pothole life got real"
          value="${Pe(k.editedHeadline)}"
          oninput="window._memeSafetyCheck()"
        />
        <div id="headline-chars" style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">0 / 60</div>
      </div>

      <div class="mb-3">
        <label class="form-label" for="meme-caption">Caption <span style="color:var(--text-muted);font-size:0.8rem;">(max 140 chars)</span></label>
        <textarea id="meme-caption" class="form-input" rows="3" maxlength="140"
          placeholder="e.g. Me checking the same pothole every day like it's a long-term relationship."
          oninput="window._memeSafetyCheck()"
        >${Pe(k.editedCaption)}</textarea>
        <div id="caption-chars" style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">0 / 140</div>
      </div>

      <div id="safety-feedback" style="min-height:40px;"></div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;">
        <button class="btn btn-secondary" onclick="window._memeGoStep(1)">? Back</button>
        <button class="btn btn-primary" id="step2-next" onclick="window._memeGoStep3()" disabled>
          Next: Preview ?
        </button>
      </div>
    </div>
  `,h(),window._memeSelectOption=m=>{const v=k.aiOptions[m];v&&(k.selectedOption=v,k.editedHeadline=v.headline,k.editedCaption=v.caption,k.captionSource="ai",k.originalAiSuggestion=v,document.getElementById("meme-headline").value=v.headline,document.getElementById("meme-caption").value=v.caption,k.aiOptions.forEach((y,g)=>{const w=document.getElementById(`capopt-${g}`);w&&(w.style.borderColor=g===m?"var(--accent-primary)":"var(--border-color)")}),window._memeSafetyCheck())};let d;window._memeSafetyCheck=()=>{h(),clearTimeout(d),d=setTimeout(u,500)};async function u(){var y,g,w,_,z,C,M,R;const m=((y=document.getElementById("meme-headline"))==null?void 0:y.value)||"",v=((g=document.getElementById("meme-caption"))==null?void 0:g.value)||"";if(!m&&!v){p("",!1);return}k.captionSource==="ai"?(m!==(((w=k.selectedOption)==null?void 0:w.headline)||"")||v!==(((_=k.selectedOption)==null?void 0:_.caption)||""))&&(k.captionSource="ai_edited"):k.captionSource="manual",k.editedHeadline=m,k.editedCaption=v,p('<span style="color:var(--text-muted);">Checking...</span>',!1);try{const B=await P("POST","/meme/safety-check",{headline:m,caption:v,issue_id:k.issueId,category:k.category,template:k.templateType});if(k.safetyResult=B.data,B.data.passed)p('<span style="color:var(--success);">? Caption looks good!</span>',!0);else{const ne=[...((z=B.data.deterministic)==null?void 0:z.violations)||[],...((C=B.data.ai_safety)==null?void 0:C.violations)||[]],we=((M=B.data.ai_safety)==null?void 0:M.status)==="unavailable",fe=ne.map($=>`<li>${Pe($)}</li>`).join(""),Me=we?'<li style="color:var(--warning);">AI safety check unavailable. This post will be flagged for moderator review.</li>':"",D=((R=B.data.deterministic)==null?void 0:R.passed)===!0;p(`<div class="alert ${D&&we?"alert-warning":"alert-error"}" style="margin:0;padding:8px 12px;"><ul style="margin:0;padding-left:18px;">${fe}${Me}</ul></div>`,D&&we)}}catch{k.safetyResult={passed:!1,deterministic:{passed:!1,violations:["Safety check unavailable."]},ai_safety:{safe:!1,violations:[],status:"unavailable"}},p('<span style="color:var(--warning);">Safety check unavailable. This post will be flagged for moderator review.</span>',!0)}}function p(m,v){const y=document.getElementById("safety-feedback");y&&(y.innerHTML=m);const g=document.getElementById("step2-next");g&&(g.disabled=!v)}function h(){const m=document.getElementById("meme-headline"),v=document.getElementById("meme-caption"),y=document.getElementById("headline-chars"),g=document.getElementById("caption-chars");m&&y&&(y.textContent=`${m.value.length} / 60`),v&&g&&(g.textContent=`${v.value.length} / 140`)}window._memeGoStep=m=>{m===1&&ms(a)},window._memeGoStep3=()=>{var m,v;k.editedHeadline=((m=document.getElementById("meme-headline"))==null?void 0:m.value)||"",k.editedCaption=((v=document.getElementById("meme-caption"))==null?void 0:v.value)||"",vs(a)}}function vs(a){k.step=3,a.innerHTML=`
    <div class="ck-studio-wizard" style="max-width:600px;">
      ${Kt(4)}
      <h2 class="mb-2">Photo Attestation</h2>
      <p class="text-secondary mb-4">
        Confirm that you have permission to share this photo.
      </p>

      <div class="alert alert-info mb-4" style="font-size:0.875rem;line-height:1.6;">
        <strong>Your photo will be visible to the public after moderator approval.</strong>
        Please ensure it does not show:
        <ul style="margin:8px 0 0 18px;">
          <li>Identifiable faces of individuals</li>
          <li>Vehicle number plates</li>
          <li>Private property interiors</li>
          <li>Any person who has not given consent</li>
        </ul>
      </div>

      <label style="display:flex;align-items:flex-start;gap:12px;cursor:pointer;padding:16px;border:2px solid var(--border-color);border-radius:8px;">
        <input type="checkbox" id="attestation-checkbox" style="margin-top:2px;width:18px;height:18px;flex-shrink:0;"
          onchange="window._memeAttestCheck(this.checked)" />
        <span style="font-size:0.875rem;line-height:1.5;">
          <strong>No identifiable faces, number plates, or private property in my photo, or I have consent.</strong>
        </span>
      </label>

      <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="window._memeGoStep(2)">? Back</button>
        <button class="btn btn-primary" id="step3-next" onclick="window._memeGoStep4()" disabled>
          Next: Preview ?
        </button>
      </div>
    </div>
  `,window._memeAttestCheck=o=>{k.attestationAccepted=o;const s=document.getElementById("step3-next");s&&(s.disabled=!o)},window._memeGoStep=o=>{o===2&&fs(a)},window._memeGoStep4=()=>{if(!k.attestationAccepted){V("Please accept the attestation to continue.");return}Rd(a)}}function Rd(a){var d,u,p,h;k.step=4;const o=k.photoPreviewUrl,s=ps({template_type:k.templateType,headline:k.editedHeadline,caption:k.editedCaption,locality:k.locality||"Unassigned",category:k.category,photoUrl:o,shareLink:k.issueId?`/entities/${k.issueId}`:null}),r=((u=(d=k.safetyResult)==null?void 0:d.ai_safety)==null?void 0:u.status)==="unavailable"?'<div class="alert alert-warning" style="font-size:0.8rem;margin-bottom:12px;max-width:420px;">?? AI safety check was unavailable. Your meme will be flagged for manual moderator review.</div>':"";a.innerHTML=`
    <div class="ck-studio-wizard">
      ${Kt(5)}
      <h2 class="mb-2">Preview Your Meme</h2>
      <p class="text-secondary mb-3">This is how your meme will appear in Civic Buzz after approval.</p>

      ${r}

      <div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;">
        <div>${s}</div>

        <div style="max-width:280px;">
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Template</div>
            <div style="font-weight:600;">${(p=k.templateType)==null?void 0:p.replace(/_/g," ")}</div>
          </div>
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Caption Source</div>
            <div>${k.captionSource==="ai"?"?? AI-generated":k.captionSource==="ai_edited"?"?? AI-assisted + edited":"?? Manual"}</div>
          </div>
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Linked Issue</div>
            ${k.issueId?`<a href="/entities/${k.issueId}" class="text-link">#${k.issueId} - ${Pe(((h=k.issue)==null?void 0:h.name)||"")}</a>`:"<span>Standalone civic highlight</span>"}
          </div>
          <div class="alert alert-info" style="font-size:0.8rem;margin-top:12px;">
            This meme will be submitted to a moderator before being published. You can check its status in "My Memes".
          </div>
        </div>
      </div>

      <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="window._memeGoStep(3)">? Back</button>
        <button class="btn btn-primary" id="step4-submit" onclick="window._memeSubmit()">
          ?? Submit for Review
        </button>
      </div>
    </div>
  `,window._memeGoStep=m=>{m===3&&vs(a)},window._memeSubmit=async()=>{if(k.submitting)return;k.submitting=!0;const m=document.getElementById("step4-submit");m&&(m.disabled=!0,m.textContent="Submitting...");try{const y=(await P("POST","/meme/campaigns",{issue_id:k.issueId,category:k.category,locality:k.locality,template:k.templateType,headline:k.editedHeadline,caption:k.editedCaption,caption_source:k.captionSource,original_ai_suggestion:k.originalAiSuggestion,attestation_accepted:!0})).data.campaign.entity_id,g=new FormData;g.append("photo",k.photoFile),await P("POST",`/meme/campaigns/${y}/photo`,null,{body:g,headers:{"X-Requested-With":"ck-web"}}),await P("POST",`/meme/campaigns/${y}/submit`),Od(a,y)}catch(v){k.submitting=!1,m&&(m.disabled=!1,m.textContent="?? Submit for Review"),V(v.message||"Submission failed. Please try again.")}}}function Od(a,o){k.step=5,a.innerHTML=`
    <div class="ck-studio-wizard" style="text-align:center;max-width:520px;margin:0 auto;">
      ${Kt(6)}
      <div style="font-size:3rem;margin-bottom:16px;">??</div>
      <h2 class="mb-2">Submitted for Review!</h2>
      <p class="text-secondary mb-4">
        Your meme campaign has been submitted to a moderator for review.
        You will be able to download and share it once it is approved and published.
      </p>
      <div class="alert alert-info mb-4" style="font-size:0.875rem;text-align:left;">
        <strong>What happens next?</strong>
        <ul style="margin:8px 0 0 18px;line-height:1.7;">
          <li>An area coordinator or admin will review your meme</li>
          <li>If approved, it will appear in Civic Buzz</li>
          <li>If rejected, you will see the reason in "My Memes"</li>
          <li>The campaign links back to your original issue automatically</li>
        </ul>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a href="/buzz" class="btn btn-secondary">View Civic Buzz</a>
        ${k.issueId?`<a href="/entities/${k.issueId}" class="btn btn-primary">Back to Issue</a>`:""}
      </div>
    </div>
  `}function Kt(a){const o=[{n:1,label:"Photo and details"},{n:2,label:"Template"},{n:3,label:"Caption"},{n:4,label:"Attestation"},{n:5,label:"Preview"},{n:6,label:"Done"}];return`
    <div class="ck-studio-steps" style="display:flex;align-items:center;gap:0;margin-bottom:28px;flex-wrap:wrap;">
      ${o.map((s,r)=>`
        <div style="display:flex;align-items:center;">
          <div style="
            width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
            font-size:0.75rem;font-weight:700;
            background:${s.n<=a?"var(--accent-primary)":"var(--bg-tertiary)"};
            color:${s.n<=a?"#fff":"var(--text-muted)"};
          ">${s.n}</div>
          <div style="font-size:0.75rem;margin-left:6px;color:${s.n===a?"var(--text-primary)":"var(--text-muted)"};">${s.label}</div>
          ${r<o.length-1?'<div style="width:24px;height:2px;background:var(--border-color);margin:0 8px;"></div>':""}
        </div>
      `).join("")}
    </div>
  `}function Ce(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function ra(){let a=localStorage.getItem("ck_buzz_session_id");a||(a="sess_"+Math.random().toString(36).substring(2,12)+Date.now().toString(36),localStorage.setItem("ck_buzz_session_id",a));const o=new Date().toISOString().slice(0,10);return`${a}_${o}`}let Le="feed",Wn=[],Zo=[],Zi=null;async function Nd(){var r;const a=["coordinator_area","coordinator_general","admin"].includes((r=Mt())==null?void 0:r.role);Le=new URLSearchParams(window.location.search).get("tab")==="review"&&a?"review":"feed";const s=document.getElementById("app");s.innerHTML=_e(`
    <div class="buzz-container" style="max-width: 1200px; margin: 0 auto; padding: 24px 16px;">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
                  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 28px 24px;
                  margin-bottom: 28px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="font-size: 28px;">🔥</span>
              <h1 style="font-size: 26px; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.5px;">
                Civic Buzz &amp; Meme Studio
              </h1>
            </div>
            <p style="color: #94a3b8; font-size: 14px; margin: 0; max-width: 620px;">
              Transforming verified civic issues into relatable awareness campaigns. Every meme is linked to a real issue with honest accountability tracking.
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="buzz-create-btn" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 700;">
              <span>⚡</span> Create a Meme
            </button>
            <a href="/entities" class="btn btn-secondary" style="font-size: 13px;">Browse Issues</a>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 8px; margin-top: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 8px;">
          <button id="tab-feed" class="buzz-tab ${Le==="feed"?"buzz-tab-active":""}" style="
            background: ${Le==="feed"?"var(--primary, #3b82f6)":"transparent"};
            color: ${Le==="feed"?"#fff":"#94a3b8"};
            border: none; padding: 8px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
            🌐 Community Feed
          </button>
          <button id="tab-my" class="buzz-tab ${Le==="my"?"buzz-tab-active":""}" style="
            background: ${Le==="my"?"var(--primary, #3b82f6)":"transparent"};
            color: ${Le==="my"?"#fff":"#94a3b8"};
            border: none; padding: 8px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
            👤 My Memes &amp; Drafts
          </button>
          ${a?`<button id="tab-review" class="buzz-tab ${Le==="review"?"buzz-tab-active":""}" style="
            background: ${Le==="review"?"var(--primary, #3b82f6)":"transparent"};
            color: ${Le==="review"?"#fff":"#94a3b8"};
            border: none; padding: 8px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
            Review Queue
          </button>`:""}
        </div>
      </div>

      <!-- Main Content Area -->
      <div id="buzz-content">
        <div style="text-align: center; padding: 60px 20px; color: #94a3b8;">
          <div class="spinner" style="margin: 0 auto 16px;"></div>
          <p>Loading Civic Buzz feed...</p>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <div id="buzz-report-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 9999;
                align-items: center; justify-content: center; padding: 16px;">
      <div style="background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px;
                  max-width: 480px; width: 100%; padding: 24px; color: #fff;">
        <h3 style="font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 10px;">🚩 Report Meme</h3>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 16px;">
          Reports are reviewed by moderators. Multiple distinct reports may hide a post while it is reviewed.
        </p>
        <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Reason for Report *</label>
        <textarea id="buzz-report-reason" rows="3" class="form-input" placeholder="e.g. Inappropriate photo, contains private individual, misleading claim..."
                  style="width: 100%; border-radius: 8px; padding: 10px; margin-bottom: 16px; font-size: 13px;"></textarea>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button id="buzz-report-cancel" class="btn btn-secondary">Cancel</button>
          <button id="buzz-report-submit" class="btn btn-danger" style="background: #ef4444; color: #fff; border: none; font-weight: 600;">
            Submit Report
          </button>
        </div>
      </div>
    </div>
  `),xe(),jd(),await Et()}function jd(){var a,o,s,r,d,u;(a=document.getElementById("buzz-create-btn"))==null||a.addEventListener("click",()=>{ie("/meme/studio")}),(o=document.getElementById("tab-feed"))==null||o.addEventListener("click",async()=>{Le!=="feed"&&(Le="feed",Gn(),await Et())}),(s=document.getElementById("tab-my"))==null||s.addEventListener("click",async()=>{if(Le==="my")return;if(!Mt()){ua("Please sign in to view your memes and drafts."),ie("/login");return}Le="my",Gn(),await Et()}),(r=document.getElementById("tab-review"))==null||r.addEventListener("click",async()=>{Le="review",Gn(),await Et()}),(d=document.getElementById("buzz-report-cancel"))==null||d.addEventListener("click",()=>{document.getElementById("buzz-report-modal").style.display="none",Zi=null}),(u=document.getElementById("buzz-report-submit"))==null||u.addEventListener("click",async()=>{const p=document.getElementById("buzz-report-reason").value.trim();if(!p){V("Please provide a reason for the report.");return}try{const h=await P("POST",`/meme/campaigns/${Zi}/report`,{reason:p});Ae(h.message||"Report recorded for moderator review."),document.getElementById("buzz-report-modal").style.display="none",Zi=null,await Et()}catch(h){V(h.message||"Failed to submit report")}})}function Gn(){const a=document.getElementById("tab-feed"),o=document.getElementById("tab-my"),s=document.getElementById("tab-review");for(const[r,d]of[[a,"feed"],[o,"my"],[s,"review"]])r&&(r.style.background=Le===d?"var(--primary, #3b82f6)":"transparent",r.style.color=Le===d?"#fff":"#94a3b8")}async function Et(){var o;const a=document.getElementById("buzz-content");if(a){a.innerHTML=`
    <div style="text-align: center; padding: 60px 20px; color: #94a3b8;">
      <div class="spinner" style="margin: 0 auto 16px;"></div>
      <p>Loading...</p>
    </div>
  `;try{if(Le==="feed"){Wn=(await P("GET","/meme/feed")).data||[],Hd(a,Wn);const r=ra();Wn.forEach(d=>{P("POST",`/meme/campaigns/${d.campaign_id}/event`,{event_type:"view",session_id:r}).catch(()=>{})})}else if(Le==="review"){const s=await P("GET","/meme/campaigns?status=pending_review");Fd(a,s.data||[])}else Zo=(await P("GET","/meme/my")).data||[],Zd(a,Zo)}catch(s){a.innerHTML=`
      <div style="text-align: center; padding: 48px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px;">
        <p style="color: #ef4444; font-weight: 600; margin-bottom: 8px;">Failed to load campaigns</p>
        <p style="color: #94a3b8; font-size: 13px;">${Ce(s.message)}</p>
        <button id="buzz-retry-btn" class="btn btn-secondary" style="margin-top: 12px;">Try Again</button>
      </div>
    `,(o=document.getElementById("buzz-retry-btn"))==null||o.addEventListener("click",Et)}}}function Hd(a,o){if(!o||o.length===0){a.innerHTML=`
      <div style="text-align: center; padding: 80px 24px; background: rgba(30, 41, 59, 0.5);
                  border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 16px;">
        <span style="font-size: 48px; display: block; margin-bottom: 16px;">🌱</span>
        <h3 style="color: #fff; font-size: 20px; font-weight: 700; margin-bottom: 8px;">No Active Civic Campaigns Yet</h3>
        <p style="color: #94a3b8; font-size: 14px; max-width: 480px; margin: 0 auto 24px;">
          Be the first to turn a real, approved civic problem into relatable awareness content that drives action.
        </p>
        <a href="/entities" class="btn btn-primary" style="font-weight: 700;">Explore Civic Issues</a>
      </div>
    `;return}const s=o.map(r=>{const d=ps({template_type:r.template_type,headline:r.headline,caption:r.caption,locality:r.locality,category:r.category,photoUrl:r.photo_url,shareLink:r.linked_entity_id?`/entities/${r.linked_entity_id}`:null,exportMode:!1}),u=r.impact,p=u.views>0||u.clicks>0||u.shares>0||u.upvotes>0;return`
      <div class="buzz-feed-item" style="
        background: #1e293b;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      ">
        <!-- Visual Meme Container -->
        <div style="display: flex; justify-content: center; background: #0f172a; padding: 12px;" id="meme-container-${r.campaign_id}">
          ${d}
        </div>

        <!-- Issue Meta & Honest Impact Bar -->
        <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08);">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 12px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">
                ${Ce(r.category||"Civic Issue")}
              </span>
              <span style="font-size: 11px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 2px 8px; font-weight: 600;">
                ${r.linked_entity_id?`Live issue status: ${Ce(r.linked_issue_status||"Unavailable")}`:Ce(r.verification_label)}
              </span>
            </div>
            <h4 style="color: #fff; font-size: 15px; font-weight: 700; margin: 0 0 10px; line-height: 1.4;">
              ${Ce(r.headline)}
            </h4>
          </div>

          <!-- Real Impact Stats Card -->
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 10px; padding: 10px 12px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 6px;">
              <span>📈 REAL IMPACT (RECORDED ONLY)</span>
              ${p?"":'<span style="color: #64748b; font-style: italic;">No activity yet</span>'}
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; text-align: center;">
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #fff;">${u.views}</div>
                <div style="font-size: 10px; color: #94a3b8;">Views</div>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #38bdf8;">${u.clicks}</div>
                <div style="font-size: 10px; color: #94a3b8;">Issue Taps</div>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #a78bfa;">${u.shares}</div>
                <div style="font-size: 10px; color: #94a3b8;">Shares Init.</div>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #34d399;">${u.upvotes}</div>
                <div style="font-size: 10px; color: #94a3b8;">Upvotes</div>
              </div>
            </div>
          </div>

          <!-- Actions Bar -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${r.linked_entity_id?`<button class="btn btn-primary buzz-view-issue-btn" data-campaign="${r.campaign_id}" data-issue="${r.linked_entity_id}"
                    style="flex: 1; font-size: 12px; padding: 8px 12px; font-weight: 600; min-width: 100px;">
              🔍 View Issue
            </button>`:""}
            <button class="btn btn-secondary buzz-share-btn" data-campaign="${r.campaign_id}" data-issue="${r.linked_entity_id}"
                    style="font-size: 12px; padding: 8px 12px;">
              🔗 Share
            </button>
            <button class="btn btn-secondary buzz-export-btn" data-container="meme-container-${r.campaign_id}" data-id="${r.campaign_id}"
                    style="font-size: 12px; padding: 8px 10px;" title="Export PNG image">
              📥
            </button>
            <button class="btn buzz-report-btn" data-campaign="${r.campaign_id}"
                    style="background: transparent; border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; font-size: 11px; padding: 8px 10px; border-radius: 6px;"
                    title="Report content">
              🚩
            </button>
          </div>
        </div>
      </div>
    `}).join("");a.innerHTML=`
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;">
      ${s}
    </div>
  `,Dd()}function Dd(){document.querySelectorAll(".buzz-view-issue-btn").forEach(a=>{a.addEventListener("click",async()=>{const o=a.getAttribute("data-campaign"),s=a.getAttribute("data-issue");P("POST",`/meme/campaigns/${o}/event`,{event_type:"click",session_id:ra()}).catch(()=>{}),ie(`/entities/${s}?campaign_id=${o}`)})}),document.querySelectorAll(".buzz-share-btn").forEach(a=>{a.addEventListener("click",async()=>{const o=a.getAttribute("data-campaign"),s=`${window.location.origin}/buzz?campaignId=${o}`;P("POST",`/meme/campaigns/${o}/event`,{event_type:"share",session_id:ra()}).catch(()=>{}),navigator.clipboard?(await navigator.clipboard.writeText(s),Ae("Share link copied to clipboard! (Shares initiated recorded)")):ua(`Share URL: ${s}`)})}),document.querySelectorAll(".buzz-export-btn").forEach(a=>{a.addEventListener("click",async()=>{const o=a.getAttribute("data-container"),s=a.getAttribute("data-id");try{a.disabled=!0,a.textContent="⏳",await Ad(o,`civic-meme-${s}.png`),Ae("Meme downloaded successfully!")}catch(r){V(r.message||"Export failed")}finally{a.disabled=!1,a.textContent="📥"}})}),document.querySelectorAll(".buzz-report-btn").forEach(a=>{a.addEventListener("click",()=>{Zi=a.getAttribute("data-campaign"),document.getElementById("buzz-report-reason").value="",document.getElementById("buzz-report-modal").style.display="flex"})})}function Fd(a,o){if(!o.length){a.innerHTML='<div class="alert alert-info">No Civic Buzz posts are awaiting review.</div>';return}a.innerHTML=o.map(s=>`
    <article style="display:grid;grid-template-columns:minmax(180px,300px) 1fr;gap:20px;padding:18px;margin-bottom:16px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:#1e293b;color:#fff;">
      <img src="${Ce(s.photo_url)}" alt="Submitted civic issue photo" style="width:100%;max-height:300px;object-fit:cover;border-radius:10px;" />
      <div>
        <div style="font-size:12px;color:#94a3b8;">${Ce(s.category)} · ${Ce(s.locality)} · ${Ce(s.caption_source)}</div>
        <h3>${Ce(s.headline)}</h3>
        <p>${Ce(s.caption)}</p>
        <p><strong>Deterministic safety:</strong> <code>${Ce(JSON.stringify(s.deterministic_result))}</code></p>
        <p><strong>AI safety:</strong> <code>${Ce(JSON.stringify(s.ai_safety_result))}</code></p>
        ${s.safety_unavailable?'<div class="alert alert-warning">A safety check is unavailable. This post is flagged for moderator review and is not automatically approved.</div>':""}
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button type="button" class="btn btn-primary buzz-review-publish" data-campaign="${s.campaign_id}">Approve and publish</button>
          <button type="button" class="btn btn-secondary buzz-review-reject" data-campaign="${s.campaign_id}">Reject</button>
        </div>
      </div>
    </article>
  `).join(""),a.querySelectorAll(".buzz-review-publish").forEach(s=>{s.addEventListener("click",async()=>{await Uo(s.dataset.campaign,"published")})}),a.querySelectorAll(".buzz-review-reject").forEach(s=>{s.addEventListener("click",async()=>{var d;const r=(d=window.prompt("Reason for rejection (required):"))==null?void 0:d.trim();r&&await Uo(s.dataset.campaign,"rejected",r)})})}async function Uo(a,o,s){try{await P("POST",`/meme/campaigns/${a}/transition`,{to_status:o,reason:s}),Ae(o==="published"?"Post approved and published.":"Post rejected with feedback for its author."),await Et()}catch(r){V(r.message||"Campaign moderation failed.")}}function Zd(a,o){if(!o||o.length===0){a.innerHTML=`
      <div style="text-align: center; padding: 60px 24px; background: rgba(30, 41, 59, 0.4);
                  border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 16px;">
        <span style="font-size: 40px; display: block; margin-bottom: 12px;">🎨</span>
        <h3 style="color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 8px;">No Memes Created Yet</h3>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">
          You haven't created any civic meme campaigns yet. Go to an approved issue to get started!
        </p>
        <a href="/entities" class="btn btn-primary">Select an Issue</a>
      </div>
    `;return}const s=o.map(r=>`
      <div style="background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              ${{draft:'<span class="badge" style="background:#64748b;color:#fff;">Draft</span>',pending_review:'<span class="badge" style="background:#eab308;color:#000;">Pending Moderator Review</span>',approved:'<span class="badge" style="background:#10b981;color:#fff;">Approved</span>',published:'<span class="badge" style="background:#3b82f6;color:#fff;">Published &amp; Live</span>',rejected:'<span class="badge" style="background:#ef4444;color:#fff;">Rejected</span>',under_review:'<span class="badge" style="background:#f97316;color:#fff;">Under Review (Hidden)</span>'}[r.status]||`<span class="badge">${Ce(r.status)}</span>`}
              <span style="font-size: 11px; color: #94a3b8;">Template: <strong>${Ce(r.template_type)}</strong></span>
              <span style="font-size: 11px; color: #94a3b8;">Created: ${new Date(r.created_date).toLocaleDateString()}</span>
            </div>
            <h4 style="color: #fff; font-size: 16px; font-weight: 700; margin: 0 0 6px;">
              "${Ce(r.headline)}"
            </h4>
            <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 10px; font-style: italic;">
              "${Ce(r.caption)}"
            </p>
            <div style="font-size: 12px; color: #94a3b8;">
              Linked Issue: <a href="/entities/${r.linked_entity_id}" style="color: #38bdf8; text-decoration: underline;">Issue #${r.linked_entity_id}</a>
            </div>
          </div>
        </div>

        ${r.status==="rejected"&&r.rejection_reason?`
          <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 10px 14px; border-radius: 6px; margin: 10px 0;">
            <div style="font-size: 12px; font-weight: 700; color: #ef4444; margin-bottom: 2px;">Moderator Feedback:</div>
            <div style="font-size: 13px; color: #fca5a5;">${Ce(r.rejection_reason)}</div>
          </div>
        `:""}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; pt-2; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #94a3b8;">
          <div>Source: <strong>${Ce(r.caption_source||"AI-assisted")}</strong></div>
          <div style="display: flex; gap: 8px;">
            ${r.status==="draft"?`
              <button class="btn btn-primary" onclick="window.location.href='/meme/studio/${r.linked_entity_id}'" style="font-size: 12px; padding: 6px 12px;">
                Continue Editing
              </button>
            `:""}
            ${r.status==="published"?`
              <a href="/entities/${r.linked_entity_id}" class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;">
                View on Issue
              </a>
            `:""}
          </div>
        </div>
      </div>
    `).join("");a.innerHTML=`<div>${s}</div>`}delete be.Icon.Default.prototype._getIconUrl;be.Icon.Default.mergeOptions({iconRetinaUrl:ha,iconUrl:ma,shadowUrl:fa});const Ud="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",qd='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';let Ne=null,Hi=null,pi=null;async function gs(){const a=document.getElementById("app"),o=`
    <div style="max-width:1200px; margin:0 auto; padding-bottom:40px;">
      <!-- Hero Banner -->
      <div class="card mb-6" style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:#fff; border:none; padding:28px; border-radius:12px; box-shadow:var(--shadow-lg);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
          <div style="max-width:650px;">
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,90,54,0.2); border:1px solid rgba(255,90,54,0.4); padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; color:#ff7d5c; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px;">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Civic Geo-Intelligence
            </div>
            <h1 style="font-size:2rem; font-weight:800; line-height:1.2; margin-bottom:10px; color:#ffffff;">Nearby Civic Protests & Operations</h1>
            <p style="color:#94a3b8; font-size:14px; margin-bottom:0; line-height:1.6;">
              Locate public, approved civic rallies, protests, and community campaigns within your vicinity.
              Location coordinates are verified and publicly accessible once officially authorized.
            </p>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:10px; align-items:flex-end;">
            <button id="btn-detect-location" class="btn btn-primary" style="padding:12px 24px; font-size:15px; font-weight:700; box-shadow:0 4px 14px rgba(255,90,54,0.4); display:inline-flex; align-items:center; gap:8px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Find Protests Near Me
            </button>
            <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#cbd5e1;">
              <span>Search Radius:</span>
              <select id="select-radius" style="background:#334155; color:#fff; border:1px solid #475569; border-radius:6px; padding:4px 8px; font-size:12px; font-weight:600; cursor:pointer;">
                <option value="5">5 km</option>
                <option value="10" selected>10 km (Default)</option>
                <option value="25">25 km</option>
                <option value="50">50 km (Max)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid: Map & Results List -->
      <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:20px;" class="nearby-grid">
        <!-- Interactive Leaflet Map Container -->
        <div class="card" style="padding:0; overflow:hidden; border-radius:10px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; height:580px;">
          <div style="padding:14px 18px; background:var(--surface); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:700; font-size:14px; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              Live Map Radar
            </div>
            <div id="map-status-pill" style="font-size:11px; color:var(--text-muted);">
              Awaiting location permission
            </div>
          </div>
          <div id="nearby-map" style="flex:1; width:100%; background:#e2e8f0; z-index:1;"></div>
        </div>

        <!-- Protests List Container -->
        <div class="card" style="padding:0; overflow:hidden; border-radius:10px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; height:580px;">
          <div style="padding:14px 18px; background:var(--surface); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:700; font-size:14px; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              Nearby Records
            </div>
            <span id="results-count-badge" class="badge badge-secondary" style="font-weight:700;">0 found</span>
          </div>

          <div id="nearby-results-list" style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; background:var(--gray-50);">
            <!-- Empty state default -->
            <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--surface); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto; color:var(--text-muted);">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">No Search Initiated</div>
              <div style="font-size:13px; max-width:320px; margin:0 auto;">Click "Find Protests Near Me" above to discover verified civic events around your current location.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;a.innerHTML=_e(o,"Nearby Civic Protests"),xe(),Vd()}function Vd(){const a=document.getElementById("nearby-map"),o=document.getElementById("btn-detect-location"),s=document.getElementById("select-radius"),r=document.getElementById("nearby-results-list"),d=document.getElementById("results-count-badge"),u=document.getElementById("map-status-pill");let p=null;a&&(Ne&&(Ne.remove(),Ne=null),Ne=be.map(a,{center:[28.6139,77.209],zoom:12,zoomControl:!0,attributionControl:!0}),be.tileLayer(Ud,{attribution:qd,maxZoom:19}).addTo(Ne),pi=be.layerGroup().addTo(Ne),setTimeout(()=>{Ne&&Ne.invalidateSize()},200));async function h(v,y,g){r&&(r.innerHTML=`
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; color:var(--text-muted);">
          <div class="spinner" style="width:32px; height:32px; border-width:3px; margin-bottom:12px;"></div>
          <div style="font-size:13px;">Scanning within ${g} km radius...</div>
        </div>
      `);try{const _=(await le.nearby(v,y,g)).data||[];d&&(d.textContent=`${_.length} found`,d.className=_.length>0?"badge badge-primary":"badge badge-secondary"),u&&(u.textContent=`Showing ${_.length} records within ${g} km`),m(_,v,y)}catch(w){console.error("[NearbyProtests] Fetch error:",w),V(w.message||"Failed to search nearby events"),r&&(r.innerHTML=`
          <div style="padding:40px 20px; text-align:center; color:#dc2626;">
            <div style="font-weight:600; margin-bottom:4px;">Search Error</div>
            <div style="font-size:13px;">${Zt(w.message||"Could not load nearby events")}</div>
          </div>
        `)}}function m(v,y,g){if(!r)return;pi&&pi.clearLayers(),Hi&&Ne&&Ne.removeLayer(Hi);const w=be.divIcon({className:"user-radar-pin",html:'<div style="background:#2563eb; width:18px; height:18px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 10px rgba(37,99,235,0.8); animation:pulse 2s infinite;"></div>',iconSize:[18,18],iconAnchor:[9,9]});if(Hi=be.marker([y,g],{icon:w}).addTo(Ne),Hi.bindPopup("<strong>Your Location</strong>"),v.length===0){r.innerHTML=`
        <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
          <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">No Approved Protests Found</div>
          <div style="font-size:13px; max-width:320px; margin:0 auto;">
            There are currently no public, approved civic rallies or protests within ${s.value} km.
            Try expanding the search radius.
          </div>
        </div>
      `,Ne.setView([y,g],13);return}const _=be.latLngBounds([[y,g]]),z=v.map(C=>{var we,fe;const M=C.latitude,R=C.longitude,B=C.distance_km!=null?`${Number(C.distance_km).toFixed(1)} km away`:"",ne=C.maps_url||`https://www.google.com/maps/search/?api=1&query=${M},${R}`;return M!=null&&R!=null&&pi&&(_.extend([M,R]),be.marker([M,R]).addTo(pi).bindPopup(`
          <div style="padding:4px; max-width:220px;">
            <div style="font-weight:700; font-size:13px; color:#0f172a; margin-bottom:4px;">${Zt(C.name)}</div>
            <div style="font-size:11px; color:#64748b; margin-bottom:6px;">${Zt(((we=C.entityType)==null?void 0:we.name)||"Civic Event")} • ${B}</div>
            <a href="${ne}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-size:11px; color:#ff5a36; font-weight:600; text-decoration:none;">Open in Google Maps →</a>
          </div>
        `)),`
        <div class="card" style="padding:14px; border:1px solid var(--border); background:var(--surface); border-radius:8px; transition:all 0.2s ease;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:6px;">
            <div>
              <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700; letter-spacing:0.04em;">
                ${Zt(((fe=C.entityType)==null?void 0:fe.name)||"Event")}
              </div>
              <a href="/entities/${C.entity_id}" class="text-link" style="font-size:15px; font-weight:700; color:var(--text-primary); text-decoration:none;">
                ${Zt(C.name)}
              </a>
            </div>
            <span class="badge badge-success" style="font-size:11px; flex-shrink:0;">Approved</span>
          </div>

          <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">
            ${C.area?`<span>Area: <strong>${Zt(C.area)}</strong></span> • `:""}
            <span>Distance: <strong style="color:var(--primary);">${B}</strong></span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px; font-size:12px;">
            <a href="/entities/${C.entity_id}" class="btn btn-secondary btn-sm" style="font-size:12px; padding:4px 10px;">
              View Details
            </a>
            <a href="${ne}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-size:12px; padding:4px 10px; display:inline-flex; align-items:center; gap:4px;">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              Open in Maps
            </a>
          </div>
        </div>
      `}).join("");r.innerHTML=z,Ne&&_.isValid()&&Ne.fitBounds(_,{padding:[40,40],maxZoom:15})}o&&o.addEventListener("click",()=>{if(!navigator.geolocation){V("Geolocation is not supported by your browser.");return}o.disabled=!0;const v=o.innerHTML;o.innerHTML='<span class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></span> Locating...',navigator.geolocation.getCurrentPosition(y=>{o.disabled=!1,o.innerHTML=v,p={latitude:y.coords.latitude,longitude:y.coords.longitude},Ae("Location detected! Searching nearby records...");const g=Number(s?s.value:10);h(p.latitude,p.longitude,g)},y=>{o.disabled=!1,o.innerHTML=v;let g="Could not access your location.";y.code===1?g="Location permission was denied. Please allow location access in your browser.":y.code===2?g="Location unavailable.":y.code===3&&(g="Location request timed out."),V(g)},{timeout:1e4,enableHighAccuracy:!0})}),s&&s.addEventListener("change",()=>{p&&h(p.latitude,p.longitude,Number(s.value))})}function Zt(a){return String(a||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}pe("/",tl);pe("/login",dl);pe("/signup",cl);pe("/dashboard",nn);pe("/governance",wd);pe("/modules",_d);pe("/entities",_l);pe("/entities/new",Gl);pe("/entities/:id",va);pe("/nearby",gs);pe("/protests/nearby",gs);pe("/admin",td);pe("/module-builder",rd);pe("/reports",gd);pe("/profile",sd);pe("/director",nn);pe("/coordinator",nn);pe("/workspace",nn);pe("/agent/chat",Pd);pe("/meme/studio",hs);pe("/meme/studio/:issueId",hs);pe("/buzz",Nd);Wo(()=>{document.getElementById("app").innerHTML=`
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:24px;">
      <h1 style="font-size:4rem; color:var(--text-muted); font-weight:800;">404</h1>
      <h2 style="margin-bottom:var(--space-4); color:var(--text-primary);">Page Not Found</h2>
      <p style="color:var(--text-secondary); margin-bottom:var(--space-6);">The requested page does not exist or has been moved.</p>
      <a href="/" class="btn btn-primary">Go to CIVIC-KALKI Home</a>
    </div>
  `});window.addEventListener("auth:expired",()=>{Jn(()=>Promise.resolve().then(()=>ll),void 0).then(a=>{a.toastWarning("Your session has expired. Please sign in again.")}),Jn(()=>Promise.resolve().then(()=>qr),void 0).then(a=>a.navigate("/login"))});const Kn=document.getElementById("app");Kn&&!Kn.innerHTML.trim()&&(Kn.innerHTML=`
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; gap:16px;">
      <div class="spinner" style="width:36px; height:36px; border-width:3px;"></div>
      <div style="font-size:14px; font-weight:600; color:var(--text-secondary);">Loading CIVIC-KALKI...</div>
    </div>
  `);Vr().finally(()=>{Go(),el()});
