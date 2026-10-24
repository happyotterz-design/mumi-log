/* 이번 게임 공지 카드
 * 내용은 같은 폴더의 event.json에서 읽어요. 다음 게임 때는 event.json과 포스터 이미지만 바꾸면 돼요.
 * 공지를 내리려면 event.json의 "show"를 false로.
 * 사용법: <div id="featured"></div> 를 두고 <script src=".../events/featured.js"></script> */
(function () {
  "use strict";
  var me = document.currentScript;
  var base = me ? me.src.replace(/[^\/]*$/, "") : "events/";
  var mount = document.getElementById("featured");
  if (!mount) return;

  var css =
    ".fe{--fe-bg:#0f1730;--fe-bg2:#16213f;--fe-gold:#e7b54a;--fe-gold2:#f6d68a;--fe-ink:#eef0f6;--fe-mute:#aab2c8;--fe-red:#e0564c;" +
    "background:linear-gradient(180deg,var(--fe-bg2),var(--fe-bg));color:var(--fe-ink);border:2px solid var(--fe-gold);border-radius:14px;" +
    "box-shadow:0 0 0 4px #0f173022,0 10px 30px rgba(10,15,35,.25);padding:18px;margin:0 0 18px;display:grid;grid-template-columns:minmax(0,220px) minmax(0,1fr);gap:18px;" +
    "font-family:'Noto Sans KR','IBM Plex Sans KR','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif;line-height:1.6;color-scheme:dark}" +
    ".fe *{box-sizing:border-box}" +
    ".fe-poster{display:block;border-radius:8px;overflow:hidden;border:1px solid #e7b54a66;align-self:start}" +
    ".fe-poster img{display:block;width:100%;height:auto}" +
    ".fe-body{display:flex;flex-direction:column;gap:10px;min-width:0}" +
    ".fe-top{display:flex;flex-wrap:wrap;gap:8px;align-items:center}" +
    ".fe-badge{font-size:12px;font-weight:700;letter-spacing:.04em;border-radius:6px;padding:3px 10px;background:var(--fe-red);color:#fff}" +
    ".fe-badge.open{background:var(--fe-gold);color:var(--fe-bg)}" +
    ".fe-kicker{font-size:13px;font-weight:700;color:var(--fe-gold2);overflow-wrap:anywhere}" +
    ".fe-title{margin:0;font-family:'Gowun Batang','Nanum Myeongjo',Batang,serif;font-weight:700;font-size:clamp(24px,5vw,34px);line-height:1.2;color:var(--fe-gold);text-wrap:balance}" +
    ".fe-intro{margin:0;white-space:pre-wrap;font-size:14.5px;color:var(--fe-ink)}" +
    ".fe-facts{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;margin:0;font-size:15px}" +
    ".fe-facts dt{color:var(--fe-gold);font-weight:700}" +
    ".fe-facts dd{margin:0;overflow-wrap:anywhere;font-variant-numeric:tabular-nums}" +
    ".fe-people{display:flex;flex-wrap:wrap;gap:6px}" +
    ".fe-people span{border:1px solid #e7b54a88;color:var(--fe-gold2);border-radius:999px;padding:1px 10px;font-size:13.5px}" +
    ".fe-notes{margin:2px 0 0;padding:10px 12px;list-style:none;border-top:1px dashed #e7b54a55;display:flex;flex-direction:column;gap:4px;font-size:13.5px;color:var(--fe-mute)}" +
    ".fe-notes li{padding-left:1.3em;text-indent:-1.3em}" +
    ".fe-notes li::before{content:'📌 '}" +
    ".fe-urgent{grid-column:1/-1;background:var(--fe-red);color:#fff;border-radius:10px;padding:10px 14px;display:flex;gap:10px;align-items:flex-start}" +
    ".fe-urgent b{flex:none;font-size:12px;letter-spacing:.06em;background:#fff;color:var(--fe-red);border-radius:5px;padding:2px 8px;margin-top:2px}" +
    ".fe-urgent p{margin:0;white-space:pre-wrap;font-size:15px;font-weight:600;line-height:1.55;min-width:0;overflow-wrap:anywhere}" +
    ".fe-change{display:block;margin-top:2px;font-size:12.5px;font-weight:700;color:var(--fe-red);background:#fff;border-radius:5px;padding:1px 8px;width:fit-content;max-width:100%}" +
    "@media (max-width:560px){.fe{grid-template-columns:1fr;padding:14px}.fe-poster{max-width:260px;justify-self:center}}";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  fetch(base + "event.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (e) {
      if (!e || !e.show) return;
      var st = document.createElement("style");
      st.textContent = css;
      document.head.appendChild(st);

      var poster = e.poster ? base + e.poster : "";
      var people = e.people || [];
      var done = /완료|마감/.test(e.status || "");
      var html =
        '<section class="fe" aria-label="이번 게임 공지">' +
        (e.urgent && e.urgent.text ? '<div class="fe-urgent" role="note"><b>' + esc(e.urgent.title || "긴급 공지") + "</b><p>" + esc(e.urgent.text) + "</p></div>" : "") +
        (poster ? '<a class="fe-poster" href="' + esc(poster) + '" target="_blank" rel="noopener"><img src="' + esc(poster) + '" alt="' + esc(e.title) + ' 포스터"></a>' : "") +
        '<div class="fe-body">' +
        '<div class="fe-top">' + (e.status ? '<span class="fe-badge' + (done ? "" : " open") + '">' + esc(e.status) + (e.cap ? " · " + people.length + "/" + e.cap + "인" : "") + "</span>" : "") +
        (e.kicker ? '<span class="fe-kicker">' + esc(e.kicker) + "</span>" : "") + "</div>" +
        '<h2 class="fe-title">' + esc(e.title) + "</h2>" +
        (e.intro ? '<p class="fe-intro">' + esc(e.intro) + "</p>" : "") +
        '<dl class="fe-facts">' +
        (e.date ? "<dt>일시</dt><dd>" + esc(e.date) + (e.time ? " " + esc(e.time) : "") + "</dd>" : "") +
        (e.place ? "<dt>장소</dt><dd>" + esc(e.place) + (e.placeNote ? '<span class="fe-change">' + esc(e.placeNote) + "</span>" : "") + "</dd>" : "") +
        (people.length ? "<dt>참석자</dt><dd><div class=\"fe-people\">" + people.map(function (p) { return "<span>" + esc(p) + "</span>"; }).join("") + "</div></dd>" : "") +
        "</dl>" +
        ((e.notes || []).length ? '<ul class="fe-notes">' + e.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>" : "") +
        "</div></section>";
      mount.innerHTML = html;
    })
    .catch(function () {});
})();
