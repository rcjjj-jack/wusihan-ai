const chat = document.querySelector('#chat');
const input = document.querySelector('#input');
const form = document.querySelector('#form');
const key = 'wusihan-chat-v1';

const replies = [
  '我在呢。你想说什么就说，不用组织得特别好，我会慢慢听你讲。',
  '这个可以，我们一起拆开来想。你现在最想先解决哪一部分？',
  '哈哈，听起来确实有点意思。要不我先陪你聊会儿，再一起把事情安排好？',
  '别急，先给自己一点时间。我陪着你，我们一步一步来。'
];

function addMessage(text, who) {
  const row = document.createElement('div'); row.className = `message ${who}`;
  const bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.textContent = text;
  row.appendChild(bubble); chat.appendChild(row); chat.scrollTop = chat.scrollHeight;
}
function save() { localStorage.setItem(key, chat.innerHTML); }
function restore() {
  const saved = localStorage.getItem(key);
  if (saved) chat.innerHTML = saved;
  else addMessage('嗨，我是武思寒！北林大数据专业大二学生。今天想让我陪你聊天，还是一起搞定学习、写作和生活上的事情？', 'bot');
}
function replyTo(text) {
  const t = text.toLowerCase();
  if (/c语言|c 语言|c语言|指针|数组|结构体|链表|scanf|printf|malloc|for循环|while循环|编程/.test(t)) return '当然可以学 C 语言！你把具体题目、代码或报错信息发给我，我可以帮你逐行解释、找 bug，并告诉你为什么这样写。比如：变量与数据类型、if/for 循环、数组、指针、函数、结构体、文件操作都可以聊。';
  if (/学习|作业|复习|考试/.test(t)) return '学习这件事我们可以安排得轻松一点。你告诉我科目、截止时间和现在的进度，我帮你拆成今天能完成的小步骤。';
  if (/写|作文|文章|文案/.test(t)) return '可以，把主题、用途和你想要的风格发给我，我陪你一起写，先搭一个清晰的框架。';
  if (/规划|计划|安排|今天/.test(t)) return '好呀。先告诉我今天必须完成的事、想做的事，还有你大概有多少时间，我来帮你排一个不那么累的计划。';
  if (/难过|烦|焦虑|累|压力/.test(t)) return '听起来你现在真的挺累的。我先陪你待一会儿，不急着解决所有事情。愿意的话，告诉我最让你难受的那一件。';
  if (/无畏|valorant|瓦/.test(t)) return '来聊瓦！你最近主玩哪个特工？今天是准备认真上分，还是快乐整活？';
  if (/象棋/.test(t)) return '下象棋我也可以陪你分析。你是想聊开局、中残局，还是直接来一盘文字对弈？';
  return replies[Math.floor(Math.random() * replies.length)];
}
form.addEventListener('submit', async e => {
  e.preventDefault(); const text = input.value.trim(); if (!text) return;
  addMessage(text, 'user'); input.value = ''; save();
  try {
    const response = await fetch('/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text }) });
    const data = await response.json(); addMessage(data.reply || '我暂时没有想好怎么回答。', 'bot');
  } catch { addMessage('我还没有连上大脑。请确认 server.js 已经启动。', 'bot'); }
  save();
});
input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
document.querySelectorAll('.suggestions button').forEach(b => b.onclick = () => { input.value = b.textContent; form.requestSubmit(); });
document.querySelector('#clearBtn').onclick = () => { localStorage.removeItem(key); chat.innerHTML = ''; restore(); };
restore();
