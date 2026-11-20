const storageKey = 'edge-study-notes-v1';
const list = document.querySelector('#notes');
const template = document.querySelector('#card');
const search = document.querySelector('#search');
const filter = document.querySelector('#filter');
const status = document.querySelector('#status');
const editor = document.querySelector('#editor');
const form = document.querySelector('#form');
const error = document.querySelector('#error');
const add = document.querySelector('#add');
const formatDate = new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium' });

let notes = [
  { id: 'workers', title: '認識 Cloudflare Workers', category: 'Cloudflare',
    body: 'Workers 可以託管 HTML、CSS 與 JavaScript，也能執行後端程式。',
    updatedAt: '2026-11-19T04:00:00Z' },
  { id: 'wrangler', title: '記下部署指令', category: '部署',
    body: '本機預覽使用 npm run dev。登入 Cloudflare 後，執行 npm run deploy。',
    updatedAt: '2026-11-18T04:00:00Z' },
  { id: 'storage', title: '比較資料儲存方式', category: '筆記',
    body: '這份日誌使用 localStorage。若要讓多台裝置共用資料，可以用 Worker API 搭配 D1。',
    updatedAt: '2026-11-17T04:00:00Z' },
];
let editingId;

try {
  const saved = localStorage.getItem(storageKey);
  if (saved !== null) {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(note => note &&
      ['id', 'title', 'category', 'body', 'updatedAt'].every(key => typeof note[key] === 'string') &&
      Number.isFinite(Date.parse(note.updatedAt)))) {
      throw new Error('Invalid notes');
    }
    notes = parsed;
  }
} catch {
  status.textContent = '無法讀取已儲存的筆記，目前顯示範例。';
}

function save(nextNotes) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(nextNotes));
  } catch {
    return false;
  }
  notes = nextNotes;
  return true;
}

function render() {
  const selectedCategory = filter.value;
  const categories = [...new Set(notes.map(note => note.category))];
  categories.sort((a, b) => a.localeCompare(b, 'zh-TW'));
  filter.replaceChildren(new Option('全部分類', ''), ...categories.map(name => new Option(name)));
  if (categories.includes(selectedCategory)) filter.value = selectedCategory;

  const query = search.value.trim().toLocaleLowerCase('zh-TW');
  const visible = notes.filter(note =>
    (!filter.value || note.category === filter.value) &&
    [note.title, note.category, note.body].some(value => value.toLocaleLowerCase('zh-TW').includes(query))
  );
  document.querySelector('#count').textContent = `${visible.length} / ${notes.length} 則`;
  list.replaceChildren();

  if (!visible.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = notes.length ? '找不到符合條件的筆記。' : '還沒有筆記，試著新增一則。';
    list.append(empty);
    return;
  }

  for (const note of visible) {
    const card = template.content.cloneNode(true);
    const date = card.querySelector('time');
    date.dateTime = note.updatedAt;
    date.textContent = formatDate.format(new Date(note.updatedAt));
    card.querySelector('.tag').textContent = note.category;
    card.querySelector('h3').textContent = note.title;
    card.querySelector('.body').textContent = note.body;
    const edit = card.querySelector('.edit');
    const remove = card.querySelector('.remove');
    edit.setAttribute('aria-label', `編輯「${note.title}」`);
    remove.setAttribute('aria-label', `刪除「${note.title}」`);
    edit.addEventListener('click', () => openEditor(note));
    remove.addEventListener('click', () => {
      if (!confirm(`要刪除「${note.title}」嗎？`)) return;
      if (!save(notes.filter(item => item.id !== note.id))) {
        status.textContent = '無法儲存變更，筆記仍在清單中。';
        return;
      }
      status.textContent = '已刪除筆記。';
      render();
      (list.querySelector('.edit') ?? add).focus();
    });
    list.append(card);
  }
}

function openEditor(note) {
  editingId = note?.id;
  form.reset();
  error.textContent = '';
  document.querySelector('#editor-title').textContent = note ? '編輯筆記' : '新增筆記';
  form.elements.namedItem('title').value = note?.title ?? '';
  form.elements.namedItem('category').value = note?.category ?? '';
  form.elements.namedItem('body').value = note?.body ?? '';
  editor.showModal();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const title = data.get('title').trim();
  const body = data.get('body').trim();
  if (!title || !body) {
    error.textContent = '請填寫標題和筆記內容。';
    return;
  }

  const note = {
    id: editingId ?? crypto.randomUUID(),
    title,
    body,
    category: data.get('category').trim() || '未分類',
    updatedAt: new Date().toISOString(),
  };
  if (!save([note, ...notes.filter(item => item.id !== note.id)])) {
    error.textContent = '無法寫入瀏覽器儲存空間，請確認空間與權限。';
    return;
  }
  search.value = '';
  filter.value = '';
  status.textContent = editingId ? '已更新筆記。' : '已新增筆記。';
  editor.close();
  render();
  list.querySelector('.edit').focus();
});

add.addEventListener('click', () => openEditor());
document.querySelector('#cancel').addEventListener('click', () => editor.close());
search.addEventListener('input', render);
filter.addEventListener('change', render);
render();
