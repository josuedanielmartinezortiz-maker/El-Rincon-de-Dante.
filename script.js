const sidebar=document.getElementById('sidebar');const section=document.getElementById('section');document.getElementById('menu').addEventListener('click',()=>sidebar.classList.toggle('open'));function navigate(name){section.textContent=name;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===name));sidebar.classList.remove('open');if(name==='Historias'){document.getElementById('idea').value='Ayúdame a organizar el guion de El origen del Submundo sin revelar misterios antes de tiempo.'}if(name==='Escenas'){document.getElementById('idea').value='Divide mi guion en escenas y crea prompts cortos de animación, manteniendo la continuidad visual.'}if(name==='Personajes'){document.getElementById('idea').value='Revisa los diseños y las reglas de continuidad de Dante, Flamita y Sofía.'}document.querySelector('.heading h2').textContent=name==='Inicio'?'Tu taller creativo':name==='Historias'?'Taller de historias':name==='Escenas'?'Taller de escenas':'Biblia de personajes';document.querySelector('.heading p').textContent=name==='Inicio'?'¿Qué vamos a crear hoy?':'Escribe tu instrucción en el cerebro creativo para preparar un borrador.'}document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));function organize(){const value=document.getElementById('idea').value.trim();const out=document.getElementById('result');out.hidden=false;if(!value){out.textContent='Escribe una idea primero y la preparamos juntos.';return}out.textContent='BORRADOR DE TU IDEA\n\n'+value+'\n\nSiguiente paso: convertir esta idea en escenas, diálogos y prompts, comprobando la continuidad de los personajes.\n\nNota: esta versión es una interfaz funcional local; todavía no está conectada a un modelo de IA, así que no inventará que ya procesó tu guion.'}document.getElementById('send').addEventListener('click',organize);document.getElementById('story').addEventListener('click',()=>navigate('Historias'));

// Memoria local del proyecto y borradores: se guardan solo en este navegador.
const IDEA_KEY='erd_idea_v1';
const MEMORY_KEY='erd_memory_v1';
const ideaBox=document.getElementById('idea');
const memoryBox=document.getElementById('memoryNotes');
const memoryStatus=document.getElementById('memoryStatus');
try{
  const savedIdea=localStorage.getItem(IDEA_KEY);
  const savedMemory=localStorage.getItem(MEMORY_KEY);
  if(savedIdea) ideaBox.value=savedIdea;
  if(savedMemory){memoryBox.value=savedMemory;memoryStatus.textContent='Memoria cargada desde este navegador.';}
}catch(e){memoryStatus.textContent='El navegador no permitió acceder al almacenamiento local.';}
ideaBox.addEventListener('input',()=>{try{localStorage.setItem(IDEA_KEY,ideaBox.value);}catch(e){}});
document.getElementById('saveMemory').addEventListener('click',()=>{
  try{
    localStorage.setItem(MEMORY_KEY,memoryBox.value);
    memoryStatus.textContent='Memoria guardada en este navegador.';
  }catch(e){memoryStatus.textContent='No se pudo guardar. Revisa la configuración del navegador.';}
});
