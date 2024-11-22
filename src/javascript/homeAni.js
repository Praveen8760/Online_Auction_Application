
let scrollTL=gsap.timeline({
    scrollTrigger:{
        trigger:".latestAuction",
        start:"top bottom",
        end:"bottom bottom",
        markers:false,
        scrub:true,
        toggleActions:"none play none reset",
    }
})

scrollTL.from('.auction',{x:"-20rem",opacity:1,duration:1,ease:"power1.inOut",stagger:{each:0.5}})


let loadReg=gsap.timeline();
loadReg.from("#homeImg",{opacity:0,y:"-40rem",duration:1,ease:"sine.inOut"})
loadReg.from("#navbar",{opacity:0,duration:0.5,ease:"sine.inOut"})
