let c1 = document.querySelectorAll('.small-img');
let c = document.querySelector('#big-image');
c1[0].addEventListener('click',()=>{
    c.src = c1[0].src;
})
c1[1].addEventListener('click',()=>{
    c.src = c1[1].src;
})
c1[2].addEventListener('click',()=>{
    c.src = c1[2].src;
})
c1[3].addEventListener('click',()=>{
    c.src = c1[3].src;
})