const list = document.querySelector('#list');
const q = document.querySelector('#q');
const chips = document.querySelectorAll('.chip');

if (q) q.addEventListener('input', filter);
chips.forEach(c => c.addEventListener('click', () => {
  chips.forEach(x=>x.classList.remove('is-active'));
  c.classList.add('is-active');
  list.dataset.cat = c.dataset.cat;
  filter();
}));

function filter(){
  const term = (q?.value || '').trim().toLowerCase();
  const cat = document.querySelector('.chip.is-active')?.dataset.cat || 'all';
  document.querySelectorAll('.row').forEach(row=>{
    const inCat = cat === 'all' || row.dataset.cat === cat;
    const text = row.innerText.toLowerCase();
    const inText = !term || text.includes(term);
    row.style.display = (inCat && inText) ? '' : 'none';
  });
}

// Global background pan tied to page scroll
