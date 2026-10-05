(function(){
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* headline split into letters */
var h=document.getElementById('headline'),txt=h.textContent;h.textContent='';h.setAttribute('aria-label',txt);
var chars=[];
txt.split(' ').forEach(function(word){
  var w=document.createElement('span');w.className='w';w.setAttribute('aria-hidden','true');
  word.split('').forEach(function(ch){var c=document.createElement('span');c.className='c';c.textContent=ch;w.appendChild(c);chars.push(c)});
  h.appendChild(w);h.appendChild(document.createTextNode(' '));
});
/* extruded 3D tooth: stacked SVG layers */
var tooth=document.getElementById('tooth'),D='M50 8C38-2 14 4 12 28 10 48 22 58 24 80 26 100 30 114 38 112 46 110 44 88 50 88 56 88 54 110 62 112 70 114 74 100 76 80 78 58 90 48 88 28 86 4 62-2 50 8Z';
var N=18;
for(var i=0;i<N;i++){
  var z=(i-N/2)*5,front=i===N-1,t=i/N;
  var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 100 120');
  s.style.transform='translateZ('+z+'px)';
  s.innerHTML='<path d="'+D+'" fill="'+(front?'url(#g)':'hsl(172 '+(30+t*30)+'% '+(62+t*30)+'%)')+'" stroke="#0A2F3A" stroke-opacity="'+(front?.55:.12)+'" stroke-width="'+(front?1.4:.6)+'"/>'+
    (front?'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#e7fbf5"/><stop offset="1" stop-color="#b9ece0"/></linearGradient></defs><path d="M26 22C28 14 38 10 44 12" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".9"/><circle cx="62" cy="40" r="3" fill="#9FE0CF"/>':'');
  tooth.appendChild(s);
}
/* pointer-driven 3D */
var tx=0,ty=0,cx=0,cy=0,t0=0;
addEventListener('pointermove',function(e){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)});
function loop(ts){
  cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
  var auto=reduce?0:Math.sin(ts/1400)*14;
  tooth.style.transform='rotateY('+(cx*90+auto)+'deg) rotateX('+(-cy*50)+'deg)';
  h.style.transform='rotateY('+(cx*10)+'deg) rotateX('+(-cy*8)+'deg)';
  if(!reduce)chars.forEach(function(c,i){
    var d=(i%3+1)*7;
    c.style.transform='translate3d('+(cx*d*1.6)+'px,'+(cy*d*1.6+Math.sin(ts/700+i)*3)+'px,'+((i%3)*18)+'px)';
  });
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
/* draggable chips */
document.querySelectorAll('.chip').forEach(function(el){
  var sx,sy,ox,oy,on=false;
  el.addEventListener('pointerdown',function(e){on=true;el.setPointerCapture(e.pointerId);sx=e.clientX;sy=e.clientY;ox=el.offsetLeft;oy=el.offsetTop;el.style.right='auto';el.style.bottom='auto';el.style.left=ox+'px';el.style.top=oy+'px';el.style.rotate='-4deg'});
  el.addEventListener('pointermove',function(e){if(!on)return;el.style.left=(ox+e.clientX-sx)+'px';el.style.top=(oy+e.clientY-sy)+'px'});
  el.addEventListener('pointerup',function(){on=false;el.style.rotate='0deg'});
});
/* tilt cards */
document.querySelectorAll('.card').forEach(function(c){
  c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='rotateY('+x*22+'deg) rotateX('+(-y*22)+'deg) translateZ(14px)'});
  c.addEventListener('pointerleave',function(){c.style.transform=''});
});
/* reveal on scroll */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll('.rv').forEach(function(el,i){el.style.transitionDelay=(i%3)*90+'ms';io.observe(el)});
/* booking form */
var d=document.getElementById('d');d.min=new Date().toISOString().split('T')[0];
document.getElementById('f').addEventListener('submit',function(e){
  e.preventDefault();
  var o=document.getElementById('ok');o.style.display='block';
  o.textContent='Thanks '+document.getElementById('n').value+'. We will call you to confirm your '+document.getElementById('s').value.toLowerCase()+' on '+d.value+'.';
});
})();
