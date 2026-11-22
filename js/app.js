var cats = ["All"].concat(SERVICES.map(function(s){return s.c}).filter(function(v,i,a){return a.indexOf(v)===i}));
var ICON={"Threading":["🧵","#f6e3a8"],"Waxing":["🌿","#c9e4cf"],"Facial":["🧖‍♀️","#f9c6d8"],"Makeup":["💄","#f7b8c8"],"Hair":["💇‍♀️","#d7cdf2"],"Hands & feet":["💅","#ffd9c2"]};
var cat="All", picked={}, where="Home visit";
var $=function(i){return document.getElementById(i)};
var rs=function(n){return "₹"+n.toLocaleString("en-IN")};

function renderTabs(){
  $("tabs").innerHTML="";
  cats.forEach(function(c){
    var b=document.createElement("button");b.type="button";b.className="tab";b.textContent=c;
    b.setAttribute("aria-pressed",c===cat);
    b.onclick=function(){cat=c;renderTabs();renderList()};
    $("tabs").appendChild(b);
  });
}
function renderList(){
  $("list").innerHTML="";
  SERVICES.forEach(function(s,i){
    if(cat!=="All"&&s.c!==cat)return;
    var b=document.createElement("button");b.type="button";b.className="svc";
    b.setAttribute("aria-pressed",!!picked[i]);
    b.innerHTML='<span><span class="th" style="background:'+ICON[s.c][1]+'">'+ICON[s.c][0]+'</span><span><b>'+s.n+'</b><small>★ 4.9 · '+s.m+' min</small></span></span><span class="r">'+rs(s.p)+'<span class="add">'+(picked[i]?"✓":"+")+'</span></span>';
    b.onclick=function(){picked[i]=!picked[i];if(!picked[i])delete picked[i];renderList();renderSum()};
    $("list").appendChild(b);
  });
}
function renderSum(){
  var ids=Object.keys(picked);
  if(!ids.length){$("sum").textContent="Tap a service to add it.";return}
  var t=0,m=0,h="";
  ids.forEach(function(i){var s=SERVICES[i];t+=s.p;m+=s.m;h+=s.n+"<br>"});
  $("sum").innerHTML=h+'<div class="tot"><span>About '+m+' min</span><span>From '+rs(t)+'</span></div>';
}
// time slots
(function(){
  var o="";for(var h=9;h<=19;h++){["00","30"].forEach(function(mm){
    if(h===19&&mm==="30")return;
    var hh=h>12?h-12:h,ap=h>=12?"PM":"AM";o+="<option>"+hh+":"+mm+" "+ap+"</option>"})}
  $("time").innerHTML=o;
  var d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());
  $("date").min=d.toISOString().slice(0,10);$("date").value=$("date").min;
})();
document.querySelectorAll("#where button").forEach(function(b){
  b.onclick=function(){where=b.dataset.v;document.querySelectorAll("#where button").forEach(function(x){x.setAttribute("aria-pressed",x===b)})}
});
$("callLink").href="tel:+"+WHATSAPP;
function showResult(msg){
  var q=encodeURIComponent(msg),r=$("res");
  r.hidden=false;r.className="res";
  r.innerHTML='<b>Last step: send this booking to '+BUSINESS+' on WhatsApp.</b>'+
   '<a class="cta" target="_blank" rel="noopener" href="https://wa.me/'+WHATSAPP+'?text='+q+'">Open WhatsApp</a>'+
   '<a class="alt" href="whatsapp://send?phone='+WHATSAPP+'&text='+q+'">Open in WhatsApp app</a>'+
   '<button type="button" class="alt" id="cp">Copy message</button>'+
   '<p class="note">If WhatsApp doesn’t open, tap Copy message and paste it in a chat to +'+WHATSAPP.slice(0,2)+' '+WHATSAPP.slice(2)+'.</p>';
  $("cp").onclick=function(){
    var done=function(){$("cp").textContent="Copied ✓"};
    try{navigator.clipboard.writeText(msg).then(done,fallback)}catch(e){fallback()}
    function fallback(){var t=document.createElement("textarea");t.value=msg;document.body.appendChild(t);t.select();try{document.execCommand("copy");done()}catch(e){}document.body.removeChild(t)}
  };
  r.scrollIntoView({behavior:"smooth",block:"center"});
}
function calLink(title,details,loc,m){
  var tm=$("time").value.match(/(\d+):(\d+) (AM|PM)/),h=(+tm[1])%12+(tm[3]==="PM"?12:0),mi=+tm[2];
  var s=new Date(2000,0,1,h,mi),e=new Date(s.getTime()+m*60000);
  var f=function(x){return ("0"+x.getHours()).slice(-2)+("0"+x.getMinutes()).slice(-2)+"00"};
  var dt=$("date").value.replace(/-/g,"");
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(title)+"&dates="+dt+"T"+f(s)+"/"+dt+"T"+f(e)+"&ctz=Asia/Kolkata&details="+encodeURIComponent(details)+"&location="+encodeURIComponent(loc);
}
$("go").onclick=function(){
  var ids=Object.keys(picked),err=$("err");err.textContent="";
  if(!ids.length)return err.textContent="Choose at least one service.";
  if(!$("name").value.trim())return err.textContent="Enter your name.";
  if(!/^\d{10}$/.test($("phone").value.replace(/\D/g,"").slice(-10)))return err.textContent="Enter a valid 10-digit mobile number.";
  if(where==="Home visit"&&!$("addr").value.trim())return err.textContent="Enter your address for the home visit.";
  var t=0,mm=0,names=[],lines=ids.map(function(i){var s=SERVICES[i];t+=s.p;mm+=s.m;names.push(s.n);return "• "+s.n+" ("+rs(s.p)+")"});
  var d=$("date").value.split("-").reverse().join("/");
  var msg="Hi "+BUSINESS+", I'd like to book:\n"+lines.join("\n")+"\nEstimate: "+rs(t)+"\n\nDate: "+d+"\nTime: "+$("time").value+"\nPlace: "+where+
    ($("addr").value.trim()?"\nAddress: "+$("addr").value.trim():"")+"\nName: "+$("name").value.trim()+"\nPhone: "+$("phone").value.trim()+
    "\n\n(For owner) After confirming, tap to add to Google Calendar:\n"+calLink(names.join(", ")+" - "+$("name").value.trim(),"Phone: "+$("phone").value.trim()+"\nEstimate: "+rs(t),$("addr").value.trim()||"Studio",mm);
  showResult(msg);
};
Object.keys(ICON).forEach(function(k){var b=document.createElement("button");b.type="button";b.className="cat";b.style.background=ICON[k][1];b.innerHTML="<i>"+ICON[k][0]+"</i>"+k;
  b.onclick=function(){cat=k;renderTabs();renderList();$("book").scrollIntoView({behavior:"smooth"})};$("cats").appendChild(b)});
renderTabs();renderList();
// ---- Gallery, hero photo, reviews, FAQs (content comes from data.js) ----
(function(){
  var el=function(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e};
  if(GALLERY.length){
    GALLERY.forEach(function(f){var im=el("img");im.src="images/"+f;im.alt="Work by "+BUSINESS;im.loading="lazy";$("gallery").appendChild(im)});
    $("gallerySec").hidden=false;
  }
  if(HERO_IMAGE){var d=document.querySelector(".hv div");d.style.background="url('images/"+HERO_IMAGE+"') center/cover";d.innerHTML="";}
  REVIEWS.forEach(function(r){
    var c=el("div","card");c.appendChild(el("div","st",new Array(r.stars+1).join("\u2605")));
    c.appendChild(el("p","",r.text));c.appendChild(el("b","",r.name+", "+r.place));$("reviews").appendChild(c);
  });
  FAQS.forEach(function(f){var d=el("details");d.appendChild(el("summary","",f.q));d.appendChild(el("p","",f.a));$("faqs").appendChild(d)});
})();
