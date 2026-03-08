(function(){
'use strict';
const START_DATE = new Date('2025-03-23T00:00:00');
let uScene,uCam,uRen,eScene,eCam,eRen,eMesh,eAutoRot=true,eDrag=false,ePrev={x:0,y:0};
let hearts3D=[],heartMode=false;

// ===== INTRO =====
document.getElementById('startBtn').onclick=function(){
    const s=document.getElementById('introScreen');
    s.classList.add('hidden');
    document.getElementById('mainNav').classList.add('visible');
    try{document.getElementById('bgMusic').play();document.getElementById('musicToggle').classList.add('playing');}catch(e){}
    setTimeout(()=>s.style.display='none',1000);
};

// ===== COUNTDOWN =====
function tick(){
    const d=Date.now()-START_DATE.getTime();
    document.getElementById('countDays').textContent=Math.floor(d/864e5);
    document.getElementById('countHours').textContent=Math.floor((d%864e5)/36e5);
    document.getElementById('countMins').textContent=Math.floor((d%36e5)/6e4);
    document.getElementById('countSecs').textContent=Math.floor((d%6e4)/1e3);
}
tick();setInterval(tick,1000);

// ===== STARS BACKGROUND =====
function initUniverse(){
    const c=document.getElementById('universeCanvas');
    uScene=new THREE.Scene();
    uCam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,1000);
    uCam.position.z=1;
    uRen=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});
    uRen.setSize(innerWidth,innerHeight);
    uRen.setPixelRatio(Math.min(devicePixelRatio,2));
    const n=2500,pos=new Float32Array(n*3),col=new Float32Array(n*3);
    const cr=[[1,.42,.62],[.98,.65,.8],[.85,.55,.95],[.95,.78,.92],[.7,.55,.85]];
    for(let i=0;i<n;i++){
        pos[i*3]=(Math.random()-.5)*10;pos[i*3+1]=(Math.random()-.5)*10;pos[i*3+2]=(Math.random()-.5)*10;
        const c=cr[Math.floor(Math.random()*5)];col[i*3]=c[0];col[i*3+1]=c[1];col[i*3+2]=c[2];
    }
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    g.setAttribute('color',new THREE.BufferAttribute(col,3));
    const m=new THREE.PointsMaterial({size:.02,vertexColors:true,transparent:true,opacity:.8,sizeAttenuation:true});
    const p=new THREE.Points(g,m);
    uScene.add(p);
    (function a(){requestAnimationFrame(a);p.rotation.y+=.0002;p.rotation.x+=.0001;uRen.render(uScene,uCam);})();
}

// ===== PETALS =====
function initPetals(){
    const c=document.getElementById('petalsCanvas'),ctx=c.getContext('2d');
    c.width=innerWidth;c.height=innerHeight;
    const em=['🌸','🌹','🌷','💐','🌺','✿','🌼'],ps=[];
    for(let i=0;i<20;i++) ps.push({x:Math.random()*c.width,y:Math.random()*c.height-c.height,sz:Math.random()*14+10,sy:Math.random()*.8+.3,sx:Math.random()*.5-.25,r:Math.random()*360,rs:Math.random()*1.5-.75,o:Math.random()*.4+.3,e:em[Math.floor(Math.random()*7)]});
    (function a(){requestAnimationFrame(a);ctx.clearRect(0,0,c.width,c.height);
    ps.forEach(p=>{p.y+=p.sy;p.x+=p.sx+Math.sin(p.y*.01)*.3;p.r+=p.rs;
    if(p.y>c.height+20){p.y=-20;p.x=Math.random()*c.width;}
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r*Math.PI/180);ctx.globalAlpha=p.o;ctx.font=p.sz+'px serif';ctx.textAlign='center';ctx.fillText(p.e,0,0);ctx.restore();});})();
}

// ===== EARTH 3D: PHOTO GALAXY =====
function initEarth(){
    const box=document.getElementById('earthWrap'),c=document.getElementById('earthCanvas');
    const w=box.clientWidth,h=box.clientHeight;
    eScene=new THREE.Scene();
    eCam=new THREE.PerspectiveCamera(50,w/h,.1,1000);
    eCam.position.z=5;
    eRen=new THREE.WebGLRenderer({canvas:c,antialias:true,alpha:true});
    eRen.setSize(w,h);eRen.setPixelRatio(Math.min(devicePixelRatio,2));

    // Lighting
    eScene.add(new THREE.AmbientLight(0xffffff,.5));
    const dl=new THREE.DirectionalLight(0xffffff,.8);dl.position.set(5,5,5);eScene.add(dl);
    const pk1=new THREE.PointLight(0xff6b9d,1.2,15);pk1.position.set(0,0,0);eScene.add(pk1);
    const pk2=new THREE.PointLight(0xa29bfe,.6,12);pk2.position.set(-3,2,2);eScene.add(pk2);

    // Central glowing star (small bright core + animated particles)
    const coreGroup=new THREE.Group();
    eScene.add(coreGroup);

    // Tiny bright white core
    const coreGeo=new THREE.SphereGeometry(.12,32,32);
    const coreMat=new THREE.MeshBasicMaterial({color:0xffffff});
    eMesh=new THREE.Mesh(coreGeo,coreMat);
    coreGroup.add(eMesh);

    // Inner glow rings (cross-shaped lens flare effect)
    const flareGeo=new THREE.PlaneGeometry(1.8,.04);
    const flareMat=new THREE.MeshBasicMaterial({color:0xff6b9d,transparent:true,opacity:.35,side:THREE.DoubleSide});
    const flare1=new THREE.Mesh(flareGeo,flareMat);
    const flare2=new THREE.Mesh(flareGeo,flareMat.clone());
    flare2.rotation.z=Math.PI/2;
    const flare3=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.03),new THREE.MeshBasicMaterial({color:0xa29bfe,transparent:true,opacity:.25,side:THREE.DoubleSide}));
    flare3.rotation.z=Math.PI/4;
    const flare4=flare3.clone();flare4.rotation.z=-Math.PI/4;
    coreGroup.add(flare1,flare2,flare3,flare4);

    // Multiple soft glow spheres
    const glows=[
        {s:.18,c:0xffffff,o:.6},
        {s:.28,c:0xffb3d0,o:.3},
        {s:.45,c:0xff6b9d,o:.12},
        {s:.7,c:0xe84393,o:.06},
        {s:1.0,c:0xa29bfe,o:.025},
    ];
    glows.forEach(g=>{
        coreGroup.add(new THREE.Mesh(new THREE.SphereGeometry(g.s,32,32),new THREE.MeshBasicMaterial({color:g.c,transparent:true,opacity:g.o,side:THREE.BackSide})));
    });

    // Tiny orbiting sparkle particles around core
    const sparkCount=80;
    const sparkPos=new Float32Array(sparkCount*3);
    const sparkCol=new Float32Array(sparkCount*3);
    for(let i=0;i<sparkCount;i++){
        const r=.2+Math.random()*.6;
        const t=Math.random()*Math.PI*2;
        const p=Math.random()*Math.PI;
        sparkPos[i*3]=r*Math.sin(p)*Math.cos(t);
        sparkPos[i*3+1]=r*Math.sin(p)*Math.sin(t);
        sparkPos[i*3+2]=r*Math.cos(p);
        const b=Math.random()*.5+.5;
        sparkCol[i*3]=1;sparkCol[i*3+1]=b*.7;sparkCol[i*3+2]=b*.9;
    }
    const sparkGeo=new THREE.BufferGeometry();
    sparkGeo.setAttribute('position',new THREE.BufferAttribute(sparkPos,3));
    sparkGeo.setAttribute('color',new THREE.BufferAttribute(sparkCol,3));
    const sparkPts=new THREE.Points(sparkGeo,new THREE.PointsMaterial({size:.025,vertexColors:true,transparent:true,opacity:.8,sizeAttenuation:true}));
    coreGroup.add(sparkPts);

    // Orbit rings
    [1.8,2.4,3.0].forEach((r,i)=>{
        const ring=new THREE.Mesh(new THREE.RingGeometry(r,r+.015,128),new THREE.MeshBasicMaterial({color:0xff6b9d,transparent:true,opacity:.12-.03*i,side:THREE.DoubleSide}));
        ring.rotation.x=Math.PI*.35+i*.15;ring.rotation.z=i*.3;
        eScene.add(ring);
    });

    // Surrounding stars
    const sn=600,sp=new Float32Array(sn*3),sc=new Float32Array(sn*3);
    for(let i=0;i<sn;i++){
        const r=Math.random()*4+1.5,t=Math.random()*Math.PI*2,p=Math.random()*Math.PI;
        sp[i*3]=r*Math.sin(p)*Math.cos(t);sp[i*3+1]=r*Math.sin(p)*Math.sin(t);sp[i*3+2]=r*Math.cos(p);
        const bright=Math.random()*.5+.5;sc[i*3]=bright;sc[i*3+1]=bright*.7;sc[i*3+2]=bright*.9;
    }
    const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));sg.setAttribute('color',new THREE.BufferAttribute(sc,3));
    const oStars=new THREE.Points(sg,new THREE.PointsMaterial({size:.02,vertexColors:true,transparent:true,opacity:.7,sizeAttenuation:true}));
    eScene.add(oStars);

    // Photo planes orbiting (load real photos)
    const photoGroup=new THREE.Group();
    eScene.add(photoGroup);
    const photoMeshes=[];
    const totalPhotos=30;
    const loader=new THREE.TextureLoader();

    for(let i=0;i<totalPhotos;i++){
        const imgIdx=Math.floor(Math.random()*97)+1;
        const ext=imgIdx<=8?'jpeg':'jpg';
        const path='data/images/300days/image'+imgIdx+'.'+ext;
        const angle=((Math.PI*2)/totalPhotos)*i;
        const radius=1.6+Math.random()*1.2;
        const yOff=(Math.random()-.5)*2;

        // Placeholder pink card first
        const geo=new THREE.PlaneGeometry(.35,.35);
        const mat=new THREE.MeshBasicMaterial({color:0x2a1040,transparent:true,opacity:.6,side:THREE.DoubleSide});
        const mesh=new THREE.Mesh(geo,mat);
        mesh.position.set(Math.cos(angle)*radius,yOff,Math.sin(angle)*radius);
        mesh.userData={angle,radius,yOff,speed:.003+Math.random()*.004,bobSpeed:.5+Math.random()*.5,bobAmp:.05+Math.random()*.05,time:Math.random()*100};
        photoGroup.add(mesh);
        photoMeshes.push(mesh);

        // Load actual photo texture
        loader.load(path,function(tex){
            tex.minFilter=THREE.LinearFilter;
            const aspect=tex.image.width/tex.image.height;
            const pw=.4,ph=pw/aspect;
            mesh.geometry.dispose();mesh.material.dispose();
            mesh.geometry=new THREE.PlaneGeometry(pw,ph);
            mesh.material=new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.9,side:THREE.DoubleSide});
        },undefined,function(){});
    }

    // Heart spawner
    function spawnH(){
        const s=.04,shape=new THREE.Shape();
        shape.moveTo(0,s*2);shape.bezierCurveTo(s*2,s*4,s*4,s*2,s*2.5,0);shape.bezierCurveTo(s*1.5,-s*2,0,-s*3,0,-s*4);shape.bezierCurveTo(0,-s*3,-s*1.5,-s*2,-s*2.5,0);shape.bezierCurveTo(-s*4,s*2,-s*2,s*4,0,s*2);
        const cs=[0xff6b9d,0xfd79a8,0xff7675,0xfab1a0,0xe84393];
        const m=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshBasicMaterial({color:cs[Math.floor(Math.random()*5)],transparent:true,opacity:.8,side:THREE.DoubleSide}));
        const a=Math.random()*Math.PI*2,r=Math.random()*.5+.8;
        m.position.set(Math.cos(a)*r,(Math.random()-.5)*1.2,Math.sin(a)*r);
        m.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,0);
        m.userData={spd:Math.random()*.02+.008,a,r,life:0};
        eScene.add(m);hearts3D.push(m);
    }

    // Mouse controls
    c.onmousedown=e=>{eDrag=true;ePrev={x:e.clientX,y:e.clientY};eAutoRot=false;document.getElementById('eAuto').classList.remove('active');};
    c.onmousemove=e=>{if(!eDrag)return;photoGroup.rotation.y+=(e.clientX-ePrev.x)*.005;photoGroup.rotation.x+=(e.clientY-ePrev.y)*.003;ePrev={x:e.clientX,y:e.clientY};};
    c.onmouseup=c.onmouseleave=()=>eDrag=false;
    c.onclick=()=>{if(heartMode)for(let i=0;i<3;i++)spawnH();};
    c.ontouchstart=e=>{eDrag=true;ePrev={x:e.touches[0].clientX,y:e.touches[0].clientY};eAutoRot=false;};
    c.ontouchmove=e=>{if(!eDrag)return;photoGroup.rotation.y+=(e.touches[0].clientX-ePrev.x)*.005;photoGroup.rotation.x+=(e.touches[0].clientY-ePrev.y)*.003;ePrev={x:e.touches[0].clientX,y:e.touches[0].clientY};};
    c.ontouchend=()=>eDrag=false;
    c.onwheel=e=>{e.preventDefault();eCam.position.z=Math.max(2,Math.min(10,eCam.position.z+e.deltaY*.003));};

    document.getElementById('eAuto').onclick=function(){eAutoRot=!eAutoRot;this.classList.toggle('active',eAutoRot);};
    document.getElementById('eZoomIn').onclick=()=>eCam.position.z=Math.max(2,eCam.position.z-.4);
    document.getElementById('eZoomOut').onclick=()=>eCam.position.z=Math.min(10,eCam.position.z+.4);
    document.getElementById('eReset').onclick=()=>{eCam.position.z=5;photoGroup.rotation.set(0,0,0);eAutoRot=true;document.getElementById('eAuto').classList.add('active');};
    document.getElementById('eHeart').onclick=function(){heartMode=!heartMode;this.classList.toggle('active',heartMode);if(heartMode)for(let i=0;i<8;i++)spawnH();};
    document.getElementById('eAuto').classList.add('active');

    let time=0;
    (function a(){requestAnimationFrame(a);time+=.01;
    if(eAutoRot)photoGroup.rotation.y+=.002;

    // Core animations
    sparkPts.rotation.y+=.008;sparkPts.rotation.x+=.003;
    flare1.rotation.z+=.003;flare2.rotation.z+=.003;
    const pulse=.85+Math.sin(time*3)*.15;
    coreGroup.scale.set(pulse,pulse,pulse);

    oStars.rotation.y+=.0003;oStars.rotation.x+=.0001;

    // Photos orbit + bob
    photoMeshes.forEach(pm=>{
        pm.userData.time+=.01;
        pm.userData.angle+=pm.userData.speed;
        pm.position.x=Math.cos(pm.userData.angle)*pm.userData.radius;
        pm.position.z=Math.sin(pm.userData.angle)*pm.userData.radius;
        pm.position.y=pm.userData.yOff+Math.sin(pm.userData.time*pm.userData.bobSpeed)*pm.userData.bobAmp;
        pm.lookAt(eCam.position);
    });

    // Glow pulse
    pk1.intensity=1.2+Math.sin(time*2)*.3;

    // Hearts
    for(let i=hearts3D.length-1;i>=0;i--){const h=hearts3D[i];h.userData.life+=.008;h.userData.a+=h.userData.spd;h.position.x=Math.cos(h.userData.a)*h.userData.r;h.position.z=Math.sin(h.userData.a)*h.userData.r;h.position.y+=.004;h.rotation.y+=.02;h.material.opacity=Math.max(0,.8-h.userData.life*.25);if(h.material.opacity<=0){eScene.remove(h);hearts3D.splice(i,1);}}
    if(heartMode&&Math.random()<.04)spawnH();
    eRen.render(eScene,eCam);})();
}

// ===== COUPONS =====
document.querySelectorAll('.coupon-use').forEach(btn=>{
    btn.onclick=function(e){
        e.stopPropagation();
        const cp=this.closest('.coupon');
        cp.classList.add('used');cp.dataset.used='true';
        for(let i=0;i<8;i++) spawnEmoji(['💖','✨','🎉','💕','🌸'][Math.floor(Math.random()*5)]);
    };
});

// ===== ENVELOPE =====
document.getElementById('envelopeBox').onclick=function(){this.classList.toggle('open');};

// ===== MUSIC =====
const playlist=[
    {src:'data/music/bang-duyen-7.mp3',name:'Duyên Mình Là Mãi Mãi (v7)'},
    {src:'data/music/bang-duyen-5.mp3',name:'Duyên Mình Là Mãi Mãi (v5)'},
    {src:'data/music/bang-duyen-6.mp3',name:'Duyên Mình Là Mãi Mãi (v6)'},
    {src:'data/music/bang-duyen-4.mp3',name:'Duyên Mình Là Mãi Mãi (v4)'},
    {src:'data/music/bang-duyen-1.mp3',name:'Duyên Mình Là Mãi Mãi (v1)'}
];
let curTrack=0;
function loadTrack(i){
    curTrack=((i%playlist.length)+playlist.length)%playlist.length;
    const a=document.getElementById('bgMusic'),wasPlaying=!a.paused;
    a.src=playlist[curTrack].src;
    document.getElementById('musicName').textContent=playlist[curTrack].name;
    if(wasPlaying)a.play();
}
document.getElementById('musicToggle').onclick=function(){
    const a=document.getElementById('bgMusic');
    if(a.paused){a.play();this.classList.add('playing');}
    else{a.pause();this.classList.remove('playing');}
};
document.getElementById('musicPrev').onclick=function(){loadTrack(curTrack-1);};
document.getElementById('musicNext').onclick=function(){loadTrack(curTrack+1);};

// ===== SCROLL ANIMATIONS =====
function initObs(){
    const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const d=parseInt(e.target.dataset.delay)||0;setTimeout(()=>e.target.classList.add('visible'),d);}});},{threshold:.15});
    document.querySelectorAll('.wish-card').forEach(el=>obs.observe(el));
    document.querySelectorAll('.lyric-section').forEach((el,i)=>{el.dataset.delay=i*120;obs.observe(el);});
    const navObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));const l=document.querySelector(`.nav-link[data-section="${e.target.id}"]`);if(l)l.classList.add('active');}});},{threshold:.25});
    document.querySelectorAll('section[id]').forEach(s=>navObs.observe(s));
}

// ===== FABs =====
function spawnEmoji(em){
    const el=document.createElement('div');el.textContent=em;
    el.style.cssText=`position:fixed;font-size:${Math.random()*18+14}px;left:${Math.random()*100}vw;top:100vh;z-index:98;pointer-events:none;`;
    document.body.appendChild(el);
    const dur=Math.random()*2500+2500,st=performance.now(),sx=parseFloat(el.style.left);
    (function a(now){const p=(now-st)/dur;if(p>1){el.remove();return;}
    el.style.top=(100-p*115)+'vh';el.style.left=sx+Math.sin(p*6)*2.5+'vw';
    el.style.opacity=p>.7?1-(p-.7)/.3:1;el.style.transform=`rotate(${p*300}deg)`;requestAnimationFrame(a);})(performance.now());
}
document.getElementById('fabFlower').onclick=()=>{for(let i=0;i<25;i++)spawnEmoji(['🌸','🌹','🌷','🌺','🌻','💐','🌼'][Math.floor(Math.random()*7)]);};
document.getElementById('fabHeart').onclick=()=>{for(let i=0;i<25;i++)spawnEmoji(['❤️','💕','💖','💗','💘','💝','💞'][Math.floor(Math.random()*7)]);};
document.getElementById('fabBoom').onclick=()=>{
    const c=document.getElementById('petalsCanvas'),ctx=c.getContext('2d'),ps=[];
    const cls=['#ff6b9d','#ffb3d0','#f9ca24','#55efc4','#a29bfe','#fd79a8','#ff7675'];
    for(let b=0;b<4;b++){const cx=Math.random()*c.width*.6+c.width*.2,cy=Math.random()*c.height*.35+c.height*.1;
    for(let i=0;i<35;i++){const a=Math.random()*Math.PI*2,s=Math.random()*3.5+1.5;
    ps.push({x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,c:cls[Math.floor(Math.random()*7)],sz:Math.random()*2.5+1});}}
    (function a(){let ok=false;ps.forEach(p=>{if(p.life<=0)return;ok=true;p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.life-=.012;p.vx*=.99;p.vy*=.99;
    ctx.beginPath();ctx.arc(p.x,p.y,p.sz*p.life,0,Math.PI*2);ctx.fillStyle=p.c;ctx.globalAlpha=p.life;ctx.fill();ctx.globalAlpha=1;});
    if(ok)requestAnimationFrame(a);})();
};

// ===== RESIZE =====
function onR(){
    const w=innerWidth,h=innerHeight;
    if(uRen){uCam.aspect=w/h;uCam.updateProjectionMatrix();uRen.setSize(w,h);}
    const pc=document.getElementById('petalsCanvas');if(pc){pc.width=w;pc.height=h;}
    if(eRen){const b=document.getElementById('earthWrap');if(b){eCam.aspect=b.clientWidth/b.clientHeight;eCam.updateProjectionMatrix();eRen.setSize(b.clientWidth,b.clientHeight);}}
}
window.onresize=onR;

// ===== INIT =====
window.addEventListener('DOMContentLoaded',()=>{initUniverse();initPetals();initEarth();initObs();});
})();
