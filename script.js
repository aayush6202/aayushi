/* Personalize the whole experience here. Replace the photo files and optional background music in /assets. */
const birthdayConfig = {
  name: "Aayushi",
  senderName: "Aayush",
  introMessage: "Something special is waiting for you.",
  letterMessage: `I hope your birthday is filled with happiness,\nbeautiful memories and lots of smiles.\n\nKeep shining and keep being amazing.\nWishing you an amazing year ahead!`,
  photos: ["assets/photo1.jpg", "assets/photo2.jpg", "assets/photo3.jpg", "assets/photo4.jpg", "assets/photo5.jpg"],
  captions: ["A little moment ♥", "That smile", "Always lovely", "A favorite memory", "Made of memories"],
  // Set this to "assets/birthday-music.mp3" after adding your own audio file.
  music: ""
};

(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const name = birthdayConfig.name.trim();
  $$('[data-name]').forEach(el => {
    el.replaceChildren(document.createTextNode(name), document.createTextNode(' ❤️'));
  });
  $('[data-intro]').textContent = birthdayConfig.introMessage;
  $('.letter-message').textContent = birthdayConfig.letterMessage.trim();
  $('.sender-name').textContent = birthdayConfig.senderName;
  document.title = `Happy Birthday, ${name}`;
  const music = $('#music');
  if (birthdayConfig.music) music.src = birthdayConfig.music;
  const musicButton = $('#musicToggle');
  let fluteContext = null, fluteMaster = null, flutePlaying = false, fluteTimer = null, fluteVoices = [];
  const birthdayTune = [
    ['G4',.5],['G4',.5],['A4',1],['G4',1],['C5',1],['B4',2],
    ['G4',.5],['G4',.5],['A4',1],['G4',1],['D5',1],['C5',2],
    ['G4',.5],['G4',.5],['G5',1],['E5',1],['C5',1],['B4',1],['A4',2],
    ['F5',.5],['F5',.5],['E5',1],['C5',1],['D5',1],['C5',2]
  ];
  const fluteNotes = {G4:392,A4:440,B4:494,C5:523,D5:587,E5:659,F5:698,G5:784};
  function stopFlute() {
    flutePlaying = false;
    clearTimeout(fluteTimer);
    const now = fluteContext?.currentTime || 0;
    if (fluteMaster) { fluteMaster.gain.cancelScheduledValues(now); fluteMaster.gain.setTargetAtTime(0,now,.035); }
    fluteVoices.forEach(voice => { try { voice.stop(now+.14); } catch {} });
    setTimeout(() => { fluteVoices.forEach(voice => { try { voice.disconnect(); } catch {} }); fluteVoices=[]; try { fluteMaster?.disconnect(); } catch {} fluteMaster=null; },220);
  }
  function playFlutePhrase() {
    if (!flutePlaying || !fluteContext || !fluteMaster) return;
    const beat=.43, start=fluteContext.currentTime+.08;
    let at=start;
    for (const [note,length] of birthdayTune) {
      const duration=length*beat, end=at+duration;
      const voiceGain=fluteContext.createGain();
      voiceGain.gain.setValueAtTime(.0001,at);
      voiceGain.gain.exponentialRampToValueAtTime(.22,at+.045);
      voiceGain.gain.setValueAtTime(.22,Math.max(at+.05,end-.07));
      voiceGain.gain.exponentialRampToValueAtTime(.0001,end);
      voiceGain.connect(fluteMaster);
      const fundamental=fluteContext.createOscillator(); fundamental.type='sine'; fundamental.frequency.setValueAtTime(fluteNotes[note],at); fundamental.connect(voiceGain);
      const overtone=fluteContext.createOscillator(), overtoneGain=fluteContext.createGain();
      overtone.type='sine'; overtone.frequency.setValueAtTime(fluteNotes[note]*2,at); overtoneGain.gain.value=.055; overtone.connect(overtoneGain); overtoneGain.connect(voiceGain);
      fundamental.start(at); overtone.start(at); fundamental.stop(end+.02); overtone.stop(end+.02);
      fluteVoices.push(fundamental,overtone,voiceGain,overtoneGain);
      at=end+.018;
    }
    fluteTimer=setTimeout(()=>{fluteVoices=[];if(flutePlaying)playFlutePhrase();},(at-start+beat*2)*1000);
  }
  async function toggleMusic() {
    if (birthdayConfig.music) {
      if (music.paused) {
        try { await music.play(); musicButton.classList.add('playing'); musicButton.setAttribute('aria-label','Pause background music'); musicButton.title='Pause music'; }
        catch { musicButton.title='Check the music path in birthdayConfig'; }
      } else { music.pause(); musicButton.classList.remove('playing'); musicButton.setAttribute('aria-label','Play background music'); musicButton.title='Play music'; }
      return;
    }
    if (flutePlaying) {
      stopFlute(); musicButton.classList.remove('playing'); musicButton.setAttribute('aria-label','Play flute birthday song'); musicButton.title='Play flute birthday song'; return;
    }
    try {
      const AudioContextClass=window.AudioContext||window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('Web Audio unavailable');
      fluteContext ||= new AudioContextClass();
      await fluteContext.resume();
      fluteMaster=fluteContext.createGain(); fluteMaster.gain.value=.42; fluteMaster.connect(fluteContext.destination);
      flutePlaying=true; playFlutePhrase(); musicButton.classList.add('playing');
      musicButton.setAttribute('aria-label','Pause flute birthday song'); musicButton.title='Pause flute birthday song';
    } catch { musicButton.title='Flute audio is not supported in this browser'; }
  }

  // Low-cost ambient stars: fixed canvas, capped DPR and particle count.
  const canvas = $('#stars'), ctx = canvas.getContext('2d');
  let stars = [], w = 0, h = 0, dpr = 1;
  function resizeStars() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5); w = innerWidth; h = innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`; ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.min(85, Math.max(42, Math.round(w * h / 11000)));
    stars = Array.from({length:count}, () => ({x:Math.random()*w,y:Math.random()*h,r:.35+Math.random()*1.05,v:.06+Math.random()*.2,a:.22+Math.random()*.65,t:Math.random()*7}));
  }
  function drawStars() {
    ctx.clearRect(0,0,w,h);
    for(const s of stars){s.y-=s.v;if(s.y<0){s.y=h;s.x=Math.random()*w;}s.t+=.018;const alpha=s.a*(.65+.35*Math.sin(s.t));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(${Math.random()>.965?'245,207,146':'232,222,255'},${alpha})`;ctx.fill();}
    requestAnimationFrame(drawStars);
  }
  resizeStars(); requestAnimationFrame(drawStars); addEventListener('resize', resizeStars, {passive:true});

  let current = 'welcome', transitioning = false;
  const scenes = $$('.scene');
  function go(id, force = false) {
    if((transitioning && !force) || id === current) return;
    const from = $(`#${current}`), to = $(`#${id}`); if(!to) return;
    transitioning = true; from.classList.add('leaving');
    window.setTimeout(() => {
      from.classList.remove('active','leaving'); to.classList.add('active'); current = id;
      if(id === 'finale') startFinale();
      window.setTimeout(() => { transitioning = false; }, 850);
    }, 360);
  }
  function burst(x,y,count=15){
    const colors=['#f0c987','#efa0bb','#8fd7db','#d5a3ed','#fff0cf'];
    for(let i=0;i<count;i++){const p=document.createElement('i');p.className='confetti';p.style.setProperty('--left',`${x+(Math.random()*60-30)}px`);p.style.setProperty('--color',colors[Math.floor(Math.random()*colors.length)]);p.style.setProperty('--duration',`${1.7+Math.random()*1.4}s`);p.style.setProperty('--drift',`${Math.random()*170-85}px`);p.style.setProperty('--rot',`${Math.random()*360}deg`);document.body.appendChild(p);setTimeout(()=>p.remove(),3400);}
  }
  $('#unlock').addEventListener('click', e => {e.stopPropagation();burst(innerWidth/2,innerHeight/2,28);go('intro');});
  $('#intro').addEventListener('click', e => {if(e.target.closest('button'))return;go('cake');});
  $('[data-next="cake"]').addEventListener('click', () => go('cake'));
  let cakeDone=false;
  $('#blowOut').addEventListener('click', e => {
    if(cakeDone)return; cakeDone=true; const btn=e.currentTarget; btn.classList.add('blown');
    const smoke=document.createElement('span');smoke.className='smoke';btn.appendChild(smoke);burst(innerWidth/2,innerHeight*.58,36);
    $('#cakePrompt').innerHTML='Wish sent <span>✧</span>';$('.micro-hint', $('#cake')).textContent='';
    setTimeout(()=>go('balloons',true),2300);
  });

  const balloonMessages=['Keep smiling ♥','You’re amazing ✨','Stay happy!','Never stop shining!','The world is brighter with you ♥'];
  const colors=['#ef83ab','#56c4cb','#f0a05f','#a47bd6','#ee8c98'];
  const field=$('#balloonField'); let popped=0;
  balloonMessages.forEach((msg,i)=>{
    const b=document.createElement('button');b.className='balloon';b.setAttribute('aria-label',`Pop balloon ${i+1}`);b.style.setProperty('--balloon',colors[i]);
    b.innerHTML='<span class="balloon-shape"></span><span class="balloon-string"></span>';field.appendChild(b);
    b.addEventListener('click',e=>{if(b.classList.contains('popped'))return;const rect=b.getBoundingClientRect();burst(rect.left+rect.width/2,rect.top+rect.height/3,20);b.classList.add('popped');$('#surpriseMessage').textContent=msg;popped++;$('#balloonHint').textContent=`${5-popped} ${5-popped===1?'balloon':'balloons'} left`;
      if(popped===5){$('#balloonHint').textContent='All your little surprises, just for you ✦';$('#balloonContinue').classList.remove('hidden');burst(innerWidth/2,innerHeight*.48,44);}
    });
  });
  $('#balloonContinue').addEventListener('click',()=>go('memories'));

  const track=$('#memoryTrack'), dots=$('#carouselDots'), win=$('#memoryWindow');
  const captionFallback=['That smile ♥','One beautiful memory','Moments worth keeping','The best kind of day','Always a favorite'];
  birthdayConfig.photos.forEach((src,i)=>{
    const card=document.createElement('button');card.className='memory-card';card.style.setProperty('--tilt',`${[-2,1.5,-1,2,-1.5][i%5]}deg`);card.setAttribute('aria-label',`View memory ${i+1}`);
    const img=document.createElement('img');img.className='photo';img.loading='lazy';img.alt=`Birthday memory ${i+1}`;img.src=src;img.onerror=()=>{img.onerror=null;img.src=`assets/photo${i+1}.svg`;};
    const cap=document.createElement('span');cap.className='photo-caption';cap.textContent=birthdayConfig.captions[i]||captionFallback[i%captionFallback.length];card.append(img,cap);track.appendChild(card);
    card.addEventListener('click',()=>{const was=card.classList.contains('enlarged');$$('.memory-card').forEach(c=>c.classList.remove('enlarged'));if(!was)card.classList.add('enlarged');});
    const dot=document.createElement('i');dots.appendChild(dot);
  });
  const cards=()=>$$('.memory-card',track), dotEls=()=>$$('i',dots);
  function updateCarousel(){const center=win.scrollLeft+win.clientWidth/2;let active=0,best=Infinity;cards().forEach((c,i)=>{const d=Math.abs(c.offsetLeft+c.offsetWidth/2-center);if(d<best){best=d;active=i;}});dotEls().forEach((d,i)=>d.classList.toggle('active',i===active));if(active===cards().length-1)$('#memoryContinue').classList.remove('hidden');}
  win.addEventListener('scroll',updateCarousel,{passive:true});
  requestAnimationFrame(updateCarousel);
  $('#memoryContinue').addEventListener('click',()=>go('envelope'));
  // Desktop drag support while native touch scrolling stays enabled.
  let drag=null;win.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){drag={x:e.clientX,left:win.scrollLeft};win.setPointerCapture(e.pointerId);win.style.cursor='grabbing';}});win.addEventListener('pointermove',e=>{if(drag)win.scrollLeft=drag.left-(e.clientX-drag.x);});['pointerup','pointercancel','pointerleave'].forEach(ev=>win.addEventListener(ev,()=>{drag=null;win.style.cursor='grab';}));

  let envelopeDone=false;
  $('#openEnvelope').addEventListener('click',()=>{if(envelopeDone)return;envelopeDone=true;$('#openEnvelope').classList.add('open');$('#envelopeHint').textContent='';burst(innerWidth/2,innerHeight*.57,18);setTimeout(()=>go('letter'),1900);});
  $('#letterContinue').addEventListener('click',()=>go('finale'));
  let finaleStarted=false;
  function startFinale(){if(finaleStarted)return;finaleStarted=true;for(let i=0;i<85;i++)setTimeout(()=>burst(Math.random()*innerWidth,-8,1),i*110);const fw=$('#fireworks');for(let i=0;i<8;i++){const p=document.createElement('i');p.className='firework';p.style.left=`${8+Math.random()*84}%`;p.style.top=`${12+Math.random()*60}%`;p.style.setProperty('--x',`${Math.random()*90-45}px`);p.style.setProperty('--y',`${Math.random()*90-45}px`);p.style.animationDelay=`${Math.random()*2}s`;fw.appendChild(p);}}
  $('#replay').addEventListener('click',()=>location.reload());
  musicButton.addEventListener('click',toggleMusic);
})();

