
let loopImg=gsap.timeline({repeat:-1,yoyo:true,paused:true})
loopImg.to('#regImg',{y:"-1rem",duration:1,ease:"power1.inOut"})


let loadReg=gsap.timeline();
loadReg.from("#regImg",{x:"-20rem",opacity:0,duration:1,ease:"sine.out"})
loadReg.from(".form-class",{scale:0,opacity:1,x:"5rem",stagger:{amount:1,from:"start"},position:1,onComplete:loopImg.play()})