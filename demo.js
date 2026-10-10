/* "How blabbing works" demo: a scripted, self-playing walkthrough in a modal.
   Pure animation on a copy of one paragraph. Nothing is read from or written to Firestore. */
(function () {
  var SENTENCE = 'A teacher running a pod of 20 students at $6,000-8,000 per student makes a strong income.';
  var PARA_BEFORE = 'When teachers set their own rates and operate independently, competition drives prices down while great teachers actually earn more. ';
  var PARA_AFTER = ' Way more than they’d make in the current system.';
  var BLAB1 = 'How does a teacher in a small town get 20 students? There aren’t that many kids in my grade.';
  var PHRASE = 'get 20 students';
  var BLAB2 = 'Remote students. A teacher in Malta can teach kids in ten counties at once.';

  var modal = document.createElement('div');
  modal.className = 'm28-demo';
  modal.innerHTML =
    '<div class="m28-demo-card" role="dialog" aria-label="How blabbing works">' +
      '<div class="m28-demo-head"><span>How blabbing works</span><button type="button" class="m28-close" aria-label="Close">&times;</button></div>' +
      '<div class="m28-demo-stage">' +
        '<p class="m28-demo-para">' + PARA_BEFORE + '<span class="m28-demo-sweep s1">' + SENTENCE + '</span>' + PARA_AFTER + '</p>' +
        '<div class="m28-demo-thread"></div>' +
        '<button type="button" class="m28-demo-fakebtn">💬 Blab on this</button>' +
        '<div class="m28-demo-cursor"><div class="m28-tip"></div></div>' +
      '</div>' +
      '<div class="m28-demo-foot"><span class="m28-demo-note">Example only. Names and comments are made up.</span>' +
        '<span><button type="button" class="m28-demo-replay">Replay</button> <button type="button" class="m28-demo-try">Try it yourself</button></span></div>' +
    '</div>';
  document.body.appendChild(modal);

  var card = modal.querySelector('.m28-demo-card');
  var stage = modal.querySelector('.m28-demo-stage');
  var tip = modal.querySelector('.m28-tip');
  var SLOW = 1.6;  /* stretch every pause; raise to slow the demo down */
  var thread = modal.querySelector('.m28-demo-thread');
  var cursor = modal.querySelector('.m28-demo-cursor');
  var fakeBtn = modal.querySelector('.m28-demo-fakebtn');
  var timers = [], run = 0;

  function wait(ms, id) { return new Promise(function (res) { timers.push(setTimeout(function () { if (id === run) res(); }, ms * SLOW)); }); }
  function stop() { timers.forEach(clearTimeout); timers = []; run++; }
  function pos(el, dx, dy) {
    var s = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - s.left + (dx || 0), y: r.top - s.top + (dy || 0) };
  }
  var cur = { x: 0, y: 0 };
  /* Keep the instruction box beside the cursor, flipping left/up near the stage edges */
  function placeTip() {
    var W = stage.clientWidth, H = stage.clientHeight;
    tip.classList.toggle('flip-x', cur.x + 24 + tip.offsetWidth > W - 8);
    tip.classList.toggle('flip-y', cur.y + 26 + tip.offsetHeight > H - 8);
  }
  function moveCursor(p) { cur = p; cursor.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px)'; placeTip(); }
  function click() { cursor.classList.add('click'); timers.push(setTimeout(function () { cursor.classList.remove('click'); }, 250)); }
  /* Instruction box rides with the cursor */
  function say(t) {
    tip.classList.remove('show');
    tip.innerHTML = t;
    placeTip();
    void tip.offsetWidth; tip.classList.add('show');
  }
  function typeInto(el, text, id) {
    var i = 0;
    return new Promise(function (res) {
      (function step() {
        if (id !== run) return;
        el.textContent = text.slice(0, ++i);
        if (i < text.length) timers.push(setTimeout(step, 45)); else res();
      })();
    });
  }
  function blabCard(name, stance, stanceClass, quote) {
    var d = document.createElement('div');
    d.className = 'm28-blab m28-demo-blab';
    d.innerHTML = (quote ? '<div class="m28-onquote">on “' + quote + '”</div>' : '') +
      '<div class="m28-meta"><strong>' + name + '</strong> ' + (stance ? '<span class="m28-stance ' + stanceClass + '">' + stance + '</span>' : '') + ' <span class="m28-when">just now</span></div>' +
      '<div class="m28-body"></div>';
    return d;
  }
  function showBtnAt(p) { fakeBtn.style.left = p.x + 'px'; fakeBtn.style.top = p.y + 'px'; fakeBtn.classList.add('show'); }

  async function play() {
    stop(); var id = run;
    thread.innerHTML = ''; fakeBtn.classList.remove('show');
    var s1 = modal.querySelector('.s1'); s1.className = 'm28-demo-sweep s1';
    modal.querySelectorAll('.m28-demo-badge').forEach(function (b) { b.remove(); });
    cursor.style.transition = 'none'; moveCursor({ x: stage.clientWidth - 40, y: stage.clientHeight - 30 });
    await wait(50, id); cursor.style.transition = '';

    tip.className = 'm28-tip';
    await wait(300, id);
    say('<span class="m28-step">1</span> Highlight the section you want to comment on.');
    await wait(700, id);
    moveCursor(pos(s1, 0, 6)); await wait(800, id);
    s1.classList.add('sweeping'); moveCursor(pos(s1, s1.getBoundingClientRect().width > stage.clientWidth * 0.6 ? stage.clientWidth * 0.55 : s1.getBoundingClientRect().width, 26));
    await wait(1300, id);
    showBtnAt(pos(s1, 0, s1.getBoundingClientRect().height + 52));
    await wait(500, id);
    moveCursor(pos(fakeBtn, 40, 14)); await wait(700, id); click(); await wait(300, id);
    fakeBtn.classList.remove('show');

    var b1 = blabCard('Example: Sam in Roundup', 'Question', 'm28-question');
    thread.appendChild(b1);
    say('<span class="m28-step">2</span> Leave your comment.');
    await wait(900, id);
    moveCursor(pos(b1.querySelector('.m28-body'), -6, b1.querySelector('.m28-body').offsetHeight));
    await wait(700, id);
    await typeInto(b1.querySelector('.m28-body'), BLAB1, id);
    await wait(500, id);
    s1.classList.add('done');
    var badge = document.createElement('span'); badge.className = 'm28-badge m28-demo-badge'; badge.setAttribute('data-count', '1'); s1.after(badge);
    await wait(1500, id);

    say('<span class="m28-step">3</span> Someone else can respond to your comment, or a section of your comment.');
    var body1 = b1.querySelector('.m28-body');
    var i = BLAB1.indexOf(PHRASE);
    body1.innerHTML = BLAB1.slice(0, i) + '<span class="m28-demo-sweep s2">' + PHRASE + '</span>' + BLAB1.slice(i + PHRASE.length);
    var s2 = body1.querySelector('.s2');
    await wait(600, id);
    moveCursor(pos(s2, 0, 6)); await wait(800, id);
    s2.classList.add('sweeping'); moveCursor(pos(s2, s2.getBoundingClientRect().width, 26));
    await wait(1100, id);
    showBtnAt(pos(s2, 0, 34));
    await wait(500, id);
    moveCursor(pos(fakeBtn, 40, 14)); await wait(700, id); click(); await wait(300, id);
    fakeBtn.classList.remove('show');

    var b2 = blabCard('Example: Darren', '', '', PHRASE);
    b2.style.marginLeft = '14px';
    thread.appendChild(b2);
    moveCursor(pos(b2.querySelector('.m28-body'), -6, b2.querySelector('.m28-body').offsetHeight));
    await wait(700, id);
    await typeInto(b2.querySelector('.m28-body'), BLAB2, id);
    s2.classList.add('done');
    var badge2 = document.createElement('span'); badge2.className = 'm28-badge m28-demo-badge'; badge2.setAttribute('data-count', '1'); s2.after(badge2);
    await wait(900, id);
    moveCursor({ x: stage.clientWidth - 40, y: stage.clientHeight - 30 });
    say('<span class="m28-step">\u2713</span> That\u2019s it. Click any highlight to read the discussion.');
  }

  function open() { modal.classList.add('open'); play(); }
  function close() { stop(); modal.classList.remove('open'); }
  modal.querySelector('.m28-close').addEventListener('click', close);
  modal.querySelector('.m28-demo-try').addEventListener('click', close);
  modal.querySelector('.m28-demo-replay').addEventListener('click', play);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  document.querySelectorAll('[data-demo]').forEach(function (b) { b.addEventListener('click', open); });
})();
