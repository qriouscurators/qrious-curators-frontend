
const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
revealItems.forEach(item => observer.observe(item));

const parallaxImages = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll',()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const y = window.scrollY;
  parallaxImages.forEach((img,i)=>{
    const rect = img.parentElement.getBoundingClientRect();
    if(rect.bottom > 0 && rect.top < innerHeight){
      img.style.transform = `scale(1.06) translateY(${(rect.top-innerHeight/2)*-.012}px)`;
    }
  });
},{passive:true});
