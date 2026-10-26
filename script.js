const sidebar=document.getElementById('sidebar');
const section=document.getElementById('section');
const ideaBox=document.getElementById('idea');
const memoryBox=document.getElementById('memoryNotes');
const memoryStatus=document.getElementById('memoryStatus');
const resultBox=document.getElementById('result');
const IDEA_KEY='erd_idea_v1';
const MEMORY_KEY='erd_memory_v1';

document.getElementById('menu').addEventListener('click',()=>sidebar.classList.toggle('open'));

function navigate(name){
  section.textContent=name;
  document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  sidebar.classList.remove('open');
  const titles={
    Inicio:['Tu taller creativo','¿Qué vamos a crear hoy?'],
    Historias:['Taller de historias','Organiza capítulos, misterios y arcos narrativos.'],
    Escenas:['Taller de escenas','Convierte una idea en tomas y prompts de animación.'],
    Personajes:['Biblia de personajes','Cuida los diseños y la continuidad de cada etapa.']
  };
  const title=titles[name]||titles.Inicio;
  document.querySelector('.heading h2').textContent=title[0];
  document.querySelector('.heading p').textContent=title[1];
  if(name==='Historias'&&!ideaBox.value.trim()) ideaBox.value='Organiza el siguiente capítulo de El origen del Submundo sin revelar misterios antes de tiempo.';
  if(name==='Escenas'&&!ideaBox.value.trim()) ideaBox.value='Divide esta parte del guion en escenas y crea prompts cortos para animación vertical 9:16.';
  if(name==='Personajes'&&!ideaBox.value.trim()) ideaBox.value='Prepara una ficha visual y revisa la continuidad de Dante, Flamita y Sofía.';
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
document.getElementById('story').addEventListener('click',()=>navigate('Historias'));

function buildDraft(value){
  const mode=section.textContent;
  const memory=(memoryBox?.value||'').trim();
  const canon=[
    'Dante: cabello castaño rizado, pecas y ropa de aventurero en su diseño inicial.',
    'Sofía: cabello rubio trenzado y vestido morado.',
    'Flamita cambia de diseño según la etapa; no mostrar alas antes de su evolución correspondiente.',
    'No revelar misterios del origen del Submundo antes del momento narrativo indicado.'
  ];
  let output='';
  if(mode==='Escenas'){
    output='PLAN DE ESCENAS\n\nIdea base: '+value+
      '\n\nESCENA 1 — ESTABLECIMIENTO\n• Mostrar dónde está el personaje y qué ocurre.\n• Cámara: plano general breve y luego plano medio.\n• Acción: una sola acción principal, fácil de animar.\n• Sonido: ambiente y efecto puntual.\n\nESCENA 2 — ACCIÓN PRINCIPAL\n• Mostrar la reacción del personaje.\n• Cámara: plano medio o primer plano.\n• Movimiento: sencillo, claro y sin cambios bruscos de diseño.\n\nESCENA 3 — CIERRE\n• Terminar con una imagen que conecte con la siguiente escena.\n• Evitar añadir información que la idea original no confirme.\n\nPROMPT BASE PARA VIDEO\nAnime cinematográfico, formato vertical 9:16, mantener exactamente el diseño del personaje de referencia, una acción clara, movimiento de cámara suave, iluminación coherente, sin texto en pantalla, sin personajes nuevos no solicitados.\n\nNota: sustituye las acciones generales por los detalles concretos del guion antes de generar los clips.';
  }else if(mode==='Personajes'){
    output='FICHA DE CONTINUIDAD\n\nIdea o personaje: '+value+
      '\n\n• Nombre y edad en esta escena: confirmar según el capítulo.\n• Diseño del cabello, ojos, ropa y accesorios: describir sin cambiar el diseño base.\n• Estado/evolución: indicar la etapa exacta del personaje.\n• Emoción y postura: elegir una emoción principal.\n• Elementos prohibidos: no añadir alas, poderes, objetos ni cambios que todavía no hayan aparecido en la cronología.\n\nREGLAS BASE DEL PROYECTO\n'+canon.map(x=>'• '+x).join('\n')+
      (memory?'\n\nNOTAS DEL CREADOR\n'+memory:'');
  }else{
    output='BORRADOR DE HISTORIA\n\nIdea: '+value+
      '\n\n1. OBJETIVO DE LA ESCENA\n¿Qué debe conseguir o descubrir el protagonista?\n\n2. DESARROLLO\n• Inicio: establecer el lugar y la situación.\n• Conflicto: introducir un problema relacionado con la idea.\n• Reacción: mostrar qué decide hacer el personaje.\n• Cierre: dejar una consecuencia o gancho para continuar.\n\n3. CONTROL DE CONTINUIDAD\n'+canon.map(x=>'• '+x).join('\n')+
      '\n\n4. COSAS QUE FALTA CONFIRMAR\n• Capítulo y momento exacto de la cronología.\n• Personajes presentes y diseños que corresponden.\n• Qué información puede revelarse y qué debe seguir siendo un misterio.'+
      (memory?'\n\nNOTAS DEL CREADOR\n'+memory:'');
  }
  return output+'\n\n— Borrador preparado por las herramientas locales de El Rincón de Dante. Aún no es una respuesta generada por una IA conectada.';
}

async function organize(){
  const value=ideaBox.value.trim();
  resultBox.hidden=false;
  if(!value){resultBox.textContent='Escribe una idea primero y la organizamos.';return;}
  try{localStorage.setItem(IDEA_KEY,value);}catch(e){}
  const button=document.getElementById('send');
  button.disabled=true;
  button.textContent='Preparando…';
  resultBox.textContent='Preparando tu borrador…';
  try{
    const response=await fetch('/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message:value,section:section.textContent,taskType:taskType?.value||'auto',memory:memoryBox?.value||''})
    });
    const data=await response.json();
    if(response.ok&&data.reply){
      resultBox.textContent=data.reply;
      return;
    }
    resultBox.textContent=buildDraft(value)+'\n\nESTADO DE CONEXIÓN\n'+(data.error||'La IA todavía no está configurada.')+'\nPuedes seguir usando los borradores locales mientras preparamos el proveedor.';
  }catch(e){
    resultBox.textContent=buildDraft(value)+'\n\nESTADO DE CONEXIÓN\nNo se encontró un servidor de IA activo. El borrador local está disponible; cuando publiquemos el backend podrás conectar un proveedor compatible.';
  }finally{
    button.disabled=false;
    button.textContent='Organizar idea →';
  }
}
document.getElementById('send').addEventListener('click',organize);

try{
  const savedIdea=localStorage.getItem(IDEA_KEY);
  const savedMemory=localStorage.getItem(MEMORY_KEY);
  if(savedIdea) ideaBox.value=savedIdea;
  if(savedMemory){memoryBox.value=savedMemory;memoryStatus.textContent='Memoria cargada desde este navegador.';}
}catch(e){if(memoryStatus)memoryStatus.textContent='El navegador no permitió acceder al almacenamiento local.';}

ideaBox.addEventListener('input',()=>{try{localStorage.setItem(IDEA_KEY,ideaBox.value);}catch(e){}});
document.getElementById('saveMemory').addEventListener('click',()=>{
  try{
    localStorage.setItem(MEMORY_KEY,memoryBox.value);
    memoryStatus.textContent='Memoria guardada en este navegador.';
  }catch(e){memoryStatus.textContent='No se pudo guardar. Revisa la configuración del navegador.';}
});

document.getElementById('exportMemory').addEventListener('click',()=>{
  const payload={app:'El Rincón de Dante',version:1,exportedAt:new Date().toISOString(),memory:memoryBox.value,idea:ideaBox.value};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='rincon-de-dante-copia.json';a.click();
  URL.revokeObjectURL(url);
  memoryStatus.textContent='Copia exportada. Guárdala en un lugar seguro.';
});
document.getElementById('importMemory').addEventListener('change',async(event)=>{
  const file=event.target.files&&event.target.files[0];if(!file)return;
  try{
    const data=JSON.parse(await file.text());
    if(typeof data.memory!=='string'&&typeof data.idea!=='string') throw new Error('Formato no reconocido');
    if(typeof data.memory==='string') memoryBox.value=data.memory;
    if(typeof data.idea==='string') ideaBox.value=data.idea;
    try{localStorage.setItem(MEMORY_KEY,memoryBox.value);localStorage.setItem(IDEA_KEY,ideaBox.value);}catch(e){}
    memoryStatus.textContent='Copia importada en este navegador.';
  }catch(e){memoryStatus.textContent='No se pudo importar. Elige una copia JSON válida de este proyecto.';}
  event.target.value='';
});


// Director de tareas: añade estructura e instrucciones según el objetivo seleccionado.
const taskType=document.getElementById('taskType');
const taskHint=document.getElementById('taskHint');
const taskDescriptions={
  auto:'El director detectará la tarea según tu instrucción.',
  story:'Prioriza estructura narrativa, diálogos, ritmo y secretos que deben reservarse.',
  scene:'Devuelve escenas breves, acciones claras, cámara, sonido y prompts de video.',
  character:'Crea una ficha de aspecto, ropa, etapa evolutiva, emociones y elementos prohibidos.',
  continuity:'Compara la idea con las notas del creador y separa contradicciones de dudas.',
  game:'Organiza mecánicas, controles, bucle de juego, progresión y prototipo para Android.',
  code:'Ayuda con código por etapas, explica dónde va cada archivo y evita exponer secretos.'
};
taskType.addEventListener('change',()=>{taskHint.textContent=taskDescriptions[taskType.value]||taskDescriptions.auto;});
const previousBuildDraft=buildDraft;
buildDraft=function(value){
  const base=previousBuildDraft(value);
  const mode=taskType.value;
  if(mode==='auto') return base;
  const instructions={
    story:'OBJETIVO DEL DIRECTOR: historia. Propón una estructura con inicio, conflicto, reacción, cierre y diálogos cuando correspondan. Distingue canon confirmado de ideas nuevas.',
    scene:'OBJETIVO DEL DIRECTOR: escenas y prompts. Separa cada escena con ubicación, acción visible, plano de cámara, audio y prompt corto. Mantén la continuidad visual.',
    character:'OBJETIVO DEL DIRECTOR: personaje. Organiza nombre, edad según capítulo, aspecto, ropa, etapa evolutiva, personalidad, habilidades confirmadas y cambios prohibidos.',
    continuity:'OBJETIVO DEL DIRECTOR: continuidad. Enumera hechos confirmados, posibles contradicciones y preguntas pendientes. No cambies el canon por tu cuenta.',
    game:'OBJETIVO DEL DIRECTOR: videojuego. Propón objetivo del jugador, bucle de juego, controles táctiles, mecánicas, recursos y un prototipo pequeño antes de añadir complejidad.',
    code:'OBJETIVO DEL DIRECTOR: programación. Entrega pasos numerados, archivos que cambian, código completo cuando sea necesario y una explicación breve. Nunca pongas claves secretas en código del navegador.'
  };
  return (instructions[mode]||'')+'\n\n'+base;
};
