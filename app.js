(function () {
  'use strict';

  var STAGES = ['Idea', 'Shoot', 'Edit', 'Post'];
  var THAI_DOW = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  var THAI_DOW_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  var THAI_MONTH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  var THAI_MONTH_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  var QUOTES = [
    'วินัยไม่ใช่การบังคับตัวเอง แต่คือการเลือกสิ่งที่สำคัญกว่าในระยะยาว',
    'ร้านที่ดีไม่ได้เกิดจากวันที่ขายดี แต่เกิดจากวันธรรมดาที่ทำซ้ำอย่างสม่ำเสมอ',
    'ทำทีละอย่างให้จบ ดีกว่าเริ่มสิบอย่างแล้วไม่มีอย่างไหนเสร็จ',
    'ความสำเร็จเล็กๆ ของวันนี้ คือฐานของความสำเร็จใหญ่ของพรุ่งนี้',
    'ไม่ต้องสมบูรณ์แบบทุกวัน แค่ดีขึ้นกว่าเมื่อวานนิดหนึ่งก็พอ',
    'ลูกค้าจดจำร้านที่สม่ำเสมอ มากกว่าร้านที่เก่งแค่บางวัน',
    'พักได้ แต่อย่าหยุด — จังหวะสำคัญกว่าความเร็ว',
    'ทุกงานเล็กที่ทำเสร็จวันนี้ คือก้าวหนึ่งที่ไม่ต้องแบกไปวันพรุ่งนี้',
    'เจ้าของธุรกิจที่ดี ไม่ใช่คนที่ไม่เหนื่อย แต่คือคนที่รู้ว่าจะพักตรงไหน',
    'สิ่งที่วัดผลไม่ได้ มักจะถูกมองข้าม จดไว้ก่อน แล้วค่อยตัดสินใจ',
    'ระบบที่ดีทำงานแทนความจำที่ไม่น่าเชื่อถือ',
    'ไม่ต้องรอให้พร้อมร้อยเปอร์เซ็นต์ เริ่มจากที่มีก่อนแล้วค่อยปรับ',
    'ธุรกิจเล็กที่ไปรอด มักมาจากวินัยที่ใหญ่',
    'กิจวัตรที่น่าเบื่อวันนี้ คืออิสรภาพของวันข้างหน้า',
    'อย่าเปรียบเทียบร้านตัวเองกับวันที่ดีที่สุดของคนอื่น',
    'ทำให้ครบดีกว่าทำให้เยอะ',
    'ลูกค้าประจำเกิดจากความสม่ำเสมอ ไม่ใช่ความประทับใจครั้งเดียว',
    'เขียนสิ่งที่ต้องทำลงกระดาษ แล้วหัวจะโล่งพอให้คิดเรื่องสำคัญกว่า',
    'ทุนที่แท้จริงของธุรกิจเล็ก คือความไว้ใจที่สะสมมาทีละวัน',
    'ไม่มีวันไหนสำคัญที่สุด มีแต่วันนี้ที่ทำได้จริง',
    'ระหว่างทางจะมีวันที่ล้าเสมอ แค่กลับมาทำต่อก็พอแล้ว',
    'สิ่งเล็กที่ทำซ้ำทุกวัน สร้างผลลัพธ์ที่สิ่งใหญ่ทำครั้งเดียวไม่ได้',
    'เจ้าของร้านที่ดูแลตัวเองดี คือคนที่ดูแลร้านได้นานที่สุด',
    'ทำให้เสร็จวันนี้ ดีกว่าทำให้สมบูรณ์แบบสักวัน'
  ];

  function pickQuoteOfDay() {
    var key = todayKeyClient();
    var h = 0;
    for (var i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return QUOTES[h % QUOTES.length];
  }

  function renderQuoteOfDay() {
    var el = $('quoteOfDay');
    if (el) el.textContent = '"' + pickQuoteOfDay() + '"';
  }

  /* ================= MOOD TRACKER ================= */
  var MOODS = [
    { key: 'awful', label: 'Awful', color: '#D6BEEA', mouth: -6 },
    { key: 'bad', label: 'Bad', color: '#7FB9E6', mouth: -3 },
    { key: 'okay', label: 'Okay', color: '#F4D77A', mouth: 0 },
    { key: 'good', label: 'Good', color: '#B7C96A', mouth: 3 },
    { key: 'great', label: 'Great', color: '#FF8F45', mouth: 6 }
  ];
  var MOOD_BY_KEY = {};
  MOODS.forEach(function (m) { MOOD_BY_KEY[m.key] = m; });

  function moodFaceSvg(mood, size) {
    size = size || 40;
    var mouthPath = 'M13 23q7 ' + mood.mouth + ' 14 0';
    return '<svg viewBox="0 0 40 40" width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="20" cy="20" r="19" fill="' + mood.color + '"/>' +
      '<circle cx="14.5" cy="17" r="1.8" fill="#2E2A4D"/><circle cx="25.5" cy="17" r="1.8" fill="#2E2A4D"/>' +
      '<path d="' + mouthPath + '" fill="none" stroke="#2E2A4D" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';
  }

  function renderMoodCheckin() {
    var wrap = $('moodCheckinGrid');
    if (!wrap) return;
    var todayK = todayKeyClient();
    wrap.innerHTML = MOODS.map(function (m) {
      return '<button type="button" class="mood-btn' + (MOOD_TODAY === m.key ? ' selected' : '') + '" data-mood="' + m.key + '">' +
        moodFaceSvg(m, 56) + '<span class="mood-label">' + m.label + '</span></button>';
    }).join('');
    wrap.querySelectorAll('.mood-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-mood');
        MOOD_TODAY = MOOD_TODAY === key ? '' : key;
        renderMoodCheckin();
        call('set_mood', { p_date: todayK, p_mood_key: MOOD_TODAY }).then(function () {
          loadPoints();
          loadMoodWeek();
        }).catch(function (err) { toast(errMsg(err), true); });
      });
    });
  }

  var MOOD_TODAY = '';
  var moodWeekStart = '';

  function loadMoodWeek() {
    return call('get_mood_week', { p_week_start: moodWeekStart }).then(function (res) {
      renderMoodAnalysis(res);
    }).catch(function (err) { toast(errMsg(err), true); });
  }

  function renderMoodAnalysis(week) {
    $('moodWeekLabel').textContent = formatWeekLabel(week.weekStart);
    var w = 700, h = 190, padX = 40, padTop = 25, padBottom = 30;
    var stepX = (w - padX * 2) / 6;
    var levelY = function (idx) { return h - padBottom - (idx * ((h - padTop - padBottom) / 4)); };
    var pts = week.days.map(function (d, i) {
      var mood = MOOD_BY_KEY[d.moodKey];
      var idx = MOODS.findIndex(function (m) { return m.key === d.moodKey; });
      return { x: padX + i * stepX, y: idx >= 0 ? levelY(idx) : null, mood: mood, date: d.date };
    });
    var line = '';
    var segStart = null;
    pts.forEach(function (p) {
      if (p.y === null) { segStart = null; return; }
      if (segStart === null) { line += '<path d="M' + p.x + ' ' + p.y; segStart = p; }
      else { line += ' L' + p.x + ' ' + p.y; }
    });
    if (segStart) line += '" fill="none" stroke="#B7C96A" stroke-width="3" stroke-linecap="round"/>';
    var dots = pts.map(function (p) {
      if (!p.mood) return '';
      return '<g transform="translate(' + (p.x - 16) + ',' + (p.y - 16) + ')">' + moodFaceSvg(p.mood, 32) + '</g>';
    }).join('');
    var labels = pts.map(function (p, i) {
      return '<text x="' + p.x + '" y="' + (h - 6) + '" text-anchor="middle" font-size="11" fill="#6B6690" font-family="Kanit,sans-serif">' + THAI_DOW_SHORT[(i + 1) % 7] + '</text>';
    }).join('');
    $('moodAnalysisSvg').innerHTML = line + dots + labels;
  }

  function bindMood() {
    moodWeekStart = mondayOf(todayKeyClient());
    $('moodWeekPrev').addEventListener('click', function () { moodWeekStart = addDays(moodWeekStart, -7); loadMoodWeek(); });
    $('moodWeekNext').addEventListener('click', function () { moodWeekStart = addDays(moodWeekStart, 7); loadMoodWeek(); });
  }

  function loadMoodView() {
    call('get_daily_entry', { p_date: todayKeyClient() }).then(function (data) {
      MOOD_TODAY = data.mood || '';
      renderMoodCheckin();
    }).catch(function () {});
    loadMoodWeek();
  }

  /* ================= OVERALL PROGRESS (POINTS) ================= */
  var POINT_TIERS = [0, 200, 800, 2000, 5000, 12000, 30000, 60000];
  var POINTS = { totalPoints: 0, todayPoints: 0 };

  function renderPoints() {
    var total = POINTS.totalPoints || 0;
    var start = POINT_TIERS[0], end = POINT_TIERS[POINT_TIERS.length - 1];
    for (var i = 0; i < POINT_TIERS.length - 1; i++) {
      if (total >= POINT_TIERS[i] && total < POINT_TIERS[i + 1]) { start = POINT_TIERS[i]; end = POINT_TIERS[i + 1]; break; }
      if (total >= POINT_TIERS[POINT_TIERS.length - 1]) { start = POINT_TIERS[POINT_TIERS.length - 2]; end = POINT_TIERS[POINT_TIERS.length - 1]; }
    }
    var pct = end > start ? Math.min(100, Math.round(((total - start) / (end - start)) * 100)) : 100;
    $('progressFill').style.width = pct + '%';
    $('progressNums').textContent = fmt(total - start) + ' / ' + fmt(end - start);
    $('progressToday').textContent = 'วันนี้ทำไปแล้ว ' + (POINTS.todayPoints || 0) + ' คะแนน';
  }

  function loadPoints() {
    call('get_points_progress').then(function (res) {
      POINTS = res || POINTS;
      renderPoints();
    }).catch(function () {});
  }

  var S = { view: 'daily' };
  var D = null;      // current daily entry
  var W = null;      // current week summary
  var CAL = null;    // current content calendar
  var PIPELINE = null; // current pipeline board
  var SETTINGS = null; // last-known settings (grouped)
  var SETTINGS_DRAFT = null;
  var IDEA_EDIT = null;
  var contentFilter = { q: '', channelId: '' };
  var calMonth = '';
  var miniCalMonth = '';
  var CHALLENGES = { active: [], past: [] };

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- supabase client + auth ---------- */
  var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  function call(fn, params) {
    return supabase.rpc(fn, params || {}).then(function (res) {
      if (res.error) throw res.error;
      return res.data;
    });
  }

  function errMsg(err) { return (err && err.message) ? err.message : String(err || 'ไม่ทราบสาเหตุ'); }
  function fmt(n) { n = Number(n) || 0; return n.toLocaleString('th-TH', { maximumFractionDigits: 2 }); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function show(id) { var n = $(id); if (n) n.classList.remove('hidden'); }
  function hide(id) { var n = $(id); if (n) n.classList.add('hidden'); }

  var toastTimer = null;
  function toast(msg, isErr) {
    var t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast' + (isErr ? ' err' : '');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.add('hidden'); }, 3000);
  }

  function showFatal(err) {
    var box = $('loading');
    box.className = 'screen center';
    box.innerHTML =
      '<div class="fatal">' +
        '<p class="fatal-title">โหลดแอปไม่สำเร็จ</p>' +
        '<p class="fatal-msg">' + esc(errMsg(err)) + '</p>' +
        '<div class="fatal-actions"><button id="fRetry" class="btn">ลองใหม่</button></div>' +
      '</div>';
    show('loading');
    $('fRetry').onclick = function () { location.reload(); };
  }

  /* ---------- date helpers ---------- */
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function toKey(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function fromKey(key) { var p = key.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2], 12, 0, 0); }
  function addDays(key, n) { var d = fromKey(key); d.setDate(d.getDate() + n); return toKey(d); }
  function mondayOf(key) { var d = fromKey(key); var day = d.getDay(); var diff = day === 0 ? -6 : 1 - day; d.setDate(d.getDate() + diff); return toKey(d); }
  function todayKeyClient() { return toKey(new Date()); }
  function monthKeyOf(dateKey) { return dateKey.slice(0, 7); }
  function prevMonth(m) { var p = m.split('-').map(Number); var d = new Date(p[0], p[1] - 2, 1); return d.getFullYear() + '-' + pad2(d.getMonth() + 1); }
  function nextMonth(m) { var p = m.split('-').map(Number); var d = new Date(p[0], p[1], 1); return d.getFullYear() + '-' + pad2(d.getMonth() + 1); }

  function formatDayLabel(key) {
    var d = fromKey(key);
    return THAI_DOW[d.getDay()] + ' ' + d.getDate() + ' ' + THAI_MONTH[d.getMonth()] + ' ' + (d.getFullYear() + 543);
  }
  function formatWeekLabel(weekStart) {
    var d1 = fromKey(weekStart), d2 = fromKey(addDays(weekStart, 6));
    return d1.getDate() + ' ' + THAI_MONTH_SHORT[d1.getMonth()] + ' – ' + d2.getDate() + ' ' + THAI_MONTH_SHORT[d2.getMonth()] + ' ' + (d2.getFullYear() + 543);
  }
  function formatMonthLabel(monthStr) {
    var p = monthStr.split('-').map(Number);
    return THAI_MONTH[p[1] - 1] + ' ' + (p[0] + 543);
  }
  function channelLabel(id, group) {
    if (!id || !SETTINGS || !SETTINGS[group]) return '';
    var found = SETTINGS[group].filter(function (c) { return c.id === id; })[0];
    return found ? found.label : '';
  }

  /* ================= AUTH ================= */
  function bindLogin() {
    $('loginBtn').addEventListener('click', submitLogin);
    $('loginPassword').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submitLogin(); } });
  }

  function submitLogin() {
    var email = $('loginEmail').value.trim();
    var password = $('loginPassword').value;
    if (!email || !password) { $('loginErr').textContent = 'กรุณากรอกอีเมลและรหัสผ่าน'; return; }
    $('loginBtn').disabled = true;
    $('loginErr').textContent = '';
    supabase.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
      $('loginBtn').disabled = false;
      if (res.error) { $('loginErr').textContent = errMsg(res.error); return; }
      hide('loginScreen');
      show('loading');
      bootApp();
    });
  }

  function bindLogout() {
    $('logoutBtn').addEventListener('click', function () {
      supabase.auth.signOut().then(function () { location.reload(); });
    });
  }

  /* ================= BOOT ================= */
  function start() {
    bindLogin();
    supabase.auth.getSession().then(function (res) {
      var session = res.data && res.data.session;
      if (session) {
        bootApp();
      } else {
        hide('loading');
        show('loginScreen');
      }
    }).catch(showFatal);
  }

  function bootApp() {
    bindViewTabs();
    bindDaily();
    bindMiniCal();
    bindWeekly();
    bindContent();
    bindIdeaModal();
    bindSettingsModal();
    bindQuickEventModal();
    bindChallenge();
    bindMood();
    bindLogout();
    renderQuoteOfDay();
    $('settingsBtn').addEventListener('click', openSettingsModal);

    call('get_bootstrap').then(function (boot) {
      D = boot.daily;
      SETTINGS = D.settings;
      POINTS = boot.points || POINTS;
      renderPoints();
      hide('loading'); hide('loginScreen'); show('app');
      renderDailyAll();
      loadIdeaBank();
    }).catch(showFatal);
  }

  /* ================= VIEW SWITCH ================= */
  function bindViewTabs() {
    document.body.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.view-switch-btn') : null;
      if (!btn) return;
      var v = btn.getAttribute('data-view');
      if (!v || v === S.view) return;
      if (S.view === 'daily') flushDailySave();
      if (S.view === 'weekly') flushWeekSave();
      switchView(v);
    });
  }

  function switchView(v) {
    S.view = v;
    var tabs = document.querySelectorAll('.view-switch-btn');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('on', tabs[i].getAttribute('data-view') === v);
    $('headerStats').classList.toggle('hidden', v !== 'daily');
    hide('dailyView'); hide('weeklyView'); hide('contentView'); hide('challengeView'); hide('moodView');
    if (v === 'daily') { show('dailyView'); loadDaily(D ? D.date : todayKeyClient()); }
    else if (v === 'weekly') { show('weeklyView'); loadWeek(W ? W.weekStart : mondayOf(D ? D.date : todayKeyClient())); }
    else if (v === 'content') {
      show('contentView');
      if (!calMonth) calMonth = monthKeyOf(todayKeyClient());
      loadCalendar().then(function () { reloadPipeline(); });
    } else if (v === 'challenge') {
      show('challengeView');
      loadChallenges();
    } else if (v === 'mood') {
      show('moodView');
      loadMoodView();
    }
    window.scrollTo(0, 0);
  }

  /* ================= DAILY ================= */
  var dailySaveTimer = null, dailyDirty = false;

  function setSaveState(text) { $('dailySaveState').textContent = text || ' '; }

  function markDirty() {
    dailyDirty = true;
    setSaveState('กำลังพิมพ์…');
    if (dailySaveTimer) clearTimeout(dailySaveTimer);
    dailySaveTimer = setTimeout(flushDailySave, 700);
  }

  function buildDailyPayload() {
    return {
      p_date: D.date,
      p_priorities: D.priorities.map(function (p) { return { text: p.text || '', done: !!p.done }; }),
      p_brain_dump: D.brainDump || '',
      p_habits: D.habits.map(function (h) { return { itemKey: h.itemKey, checked: !!h.checked }; }),
      p_todos: D.todos.map(function (t) { return { text: t.text || '', done: !!t.done }; }),
      p_events: D.events.map(function (e) { return { time: e.time || '', title: e.title || '' }; })
    };
  }

  function flushDailySave() {
    if (dailySaveTimer) { clearTimeout(dailySaveTimer); dailySaveTimer = null; }
    if (!dailyDirty || !D) return;
    dailyDirty = false;
    setSaveState('กำลังบันทึก…');
    call('save_daily_entry', buildDailyPayload()).then(function () {
      setSaveState('บันทึกแล้ว ✓');
      loadPoints();
    }).catch(function (err) {
      setSaveState('บันทึกไม่สำเร็จ: ' + errMsg(err));
    });
  }

  function goToDay(newDate) { flushDailySave(); loadDaily(newDate); }

  function loadDaily(dateKey) {
    call('get_daily_entry', { p_date: dateKey }).then(function (data) {
      D = data; SETTINGS = D.settings;
      renderDailyAll();
    }).catch(function (err) { toast(errMsg(err), true); });
  }

  function bindDaily() {
    $('dayPrev').addEventListener('click', function () { goToDay(addDays(D.date, -1)); });
    $('dayNext').addEventListener('click', function () { goToDay(addDays(D.date, 1)); });
    $('dayToday').addEventListener('click', function () { goToDay(todayKeyClient()); });
    $('brainDump').addEventListener('input', function () { D.brainDump = this.value; markDirty(); });
    $('quickIdea').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submitQuickIdea(); }
    });
    $('todoInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submitNewTodo(); }
    });
    $('eventTitle').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submitNewEvent(); }
    });
  }

  function submitNewTodo() {
    var input = $('todoInput');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    D.todos.push({ text: text, done: false });
    renderTodoList();
    updateHeaderStats();
    markDirty();
  }

  function sortEvents(arr) {
    arr.sort(function (a, b) {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  }

  /** เพิ่มกิจกรรมให้วันไหนก็ได้ — วันเดียวกับที่กำลังดูอยู่จะรีเฟรชในหน้าทันที, วันอื่นยิงตรงไปที่ฐานข้อมูล */
  function addEventCore(targetDate, time, title) {
    return new Promise(function (resolve, reject) {
      if (D && targetDate === D.date) {
        D.events.push({ time: time, title: title });
        sortEvents(D.events);
        renderEventList();
        markDirty();
        markMiniCalHasEvent(targetDate, true);
        resolve({ sameDay: true });
      } else {
        call('add_event_to_date', { p_date: targetDate, p_time: time, p_title: title }).then(function () {
          markMiniCalHasEvent(targetDate, true);
          resolve({ sameDay: false });
        }).catch(reject);
      }
    });
  }

  function submitNewEvent() {
    var dateInput = $('eventDate');
    var titleInput = $('eventTitle');
    var timeInput = $('eventTime');
    var title = titleInput.value.trim();
    if (!title) return;
    var time = timeInput.value || '';
    var targetDate = dateInput.value || D.date;
    titleInput.value = ''; timeInput.value = '';
    addEventCore(targetDate, time, title).then(function (res) {
      if (!res.sameDay) {
        toast('เพิ่มกิจกรรมวันที่ ' + formatDayLabel(targetDate) + ' แล้ว');
        dateInput.value = D.date;
      }
    }).catch(function (err) { toast(errMsg(err), true); });
  }

  function markMiniCalHasEvent(dateStr, hasEvent) {
    if (monthKeyOf(dateStr) !== miniCalMonth) return;
    if (hasEvent) miniCalEventDates[dateStr] = true;
    else delete miniCalEventDates[dateStr];
    renderMiniCal();
  }

  function openQuickEventModal() {
    $('quickEventTitle').value = '';
    $('quickEventDate').value = D ? D.date : todayKeyClient();
    $('quickEventTime').value = '';
    $('quickEventErr').textContent = '';
    show('quickEventOverlay');
    setTimeout(function () { $('quickEventTitle').focus(); }, 30);
  }

  function bindQuickEventModal() {
    $('quickEventBtn').addEventListener('click', openQuickEventModal);
    $('quickEventCancel').addEventListener('click', function () { hide('quickEventOverlay'); });
    $('quickEventOverlay').addEventListener('click', function (e) { if (e.target === $('quickEventOverlay')) hide('quickEventOverlay'); });
    $('quickEventSave').addEventListener('click', submitQuickEventModal);
    $('quickEventTitle').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submitQuickEventModal(); }
    });
  }

  function submitQuickEventModal() {
    var title = $('quickEventTitle').value.trim();
    if (!title) { $('quickEventErr').textContent = 'กรุณาใส่ชื่อกิจกรรม'; return; }
    var targetDate = $('quickEventDate').value || (D ? D.date : todayKeyClient());
    var time = $('quickEventTime').value || '';
    $('quickEventSave').disabled = true;
    addEventCore(targetDate, time, title).then(function () {
      $('quickEventSave').disabled = false;
      hide('quickEventOverlay');
      toast('เพิ่มกิจกรรมวันที่ ' + formatDayLabel(targetDate) + ' แล้ว');
    }).catch(function (err) {
      $('quickEventSave').disabled = false;
      $('quickEventErr').textContent = errMsg(err);
    });
  }


  function submitQuickIdea() {
    var input = $('quickIdea');
    var title = input.value.trim();
    if (!title) return;
    input.value = ''; input.disabled = true;
    call('quick_capture_idea', { p_title: title }).then(function () {
      return call('get_daily_entry', { p_date: D.date });
    }).then(function (data) {
      input.disabled = false;
      D.pipelineCounts = data.pipelineCounts;
      renderPipelineSnapshot(D.pipelineCounts, 'pipelineSnapshot');
      toast('เพิ่มไอเดียแล้ว');
      loadIdeaBank();
    }).catch(function (err) { input.disabled = false; toast(errMsg(err), true); });
  }

  var IDEA_BANK = [];

  function loadIdeaBank() {
    call('get_content_pipeline', { p_channel_id: null, p_q: '' }).then(function (res) {
      if (!res || !res.board) { toast('โหลดคลังไอเดียไม่สำเร็จ (ไม่ได้รับข้อมูลจากเซิร์ฟเวอร์)', true); return; }
      PIPELINE = res.board; SETTINGS = res.settings || SETTINGS;
      IDEA_BANK = res.board.Idea || [];
      renderIdeaBank();
    }).catch(function (err) { toast('โหลดคลังไอเดียไม่สำเร็จ: ' + errMsg(err), true); });
  }

  function renderIdeaBank() {
    var wrap = $('ideaBankList');
    if (!wrap) return;
    if (!IDEA_BANK.length) {
      wrap.innerHTML = '<p class="checklist-empty">ยังไม่มีไอเดีย — พิมพ์ด้านบนแล้วกด Enter</p>';
      return;
    }
    wrap.innerHTML = IDEA_BANK.map(function (it) {
      return '<div class="idea-bank-row" data-id="' + esc(it.ideaId) + '">' +
        '<span class="idea-bank-title">' + esc(it.title) + '</span>' +
        (it.channelId ? '<span class="idea-bank-chan">' + esc(channelLabel(it.channelId, 'contentChannels')) + '</span>' : '') +
        '<button type="button" class="idea-bank-del" data-id="' + esc(it.ideaId) + '" title="ลบ">✕</button>' +
        '</div>';
    }).join('');
    wrap.querySelectorAll('.idea-bank-row').forEach(function (row) {
      row.addEventListener('click', function (e) {
        if (e.target.closest('.idea-bank-del')) return;
        var id = row.getAttribute('data-id');
        var item = IDEA_BANK.filter(function (x) { return x.ideaId === id; })[0];
        if (item) openIdeaModal(item);
      });
    });
    wrap.querySelectorAll('.idea-bank-del').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-id');
        call('delete_content_idea', { p_idea_id: id }).then(function () {
          toast('ลบไอเดียแล้ว');
          loadIdeaBank();
          if (CAL) loadCalendar();
        }).catch(function (err) { toast(errMsg(err), true); });
      });
    });
  }

  function renderDailyAll() {
    $('dayLabel').textContent = formatDayLabel(D.date);
    renderPriorities();
    renderCarryOver();
    renderTodoList();
    renderEventList();
    $('eventDate').value = D.date;
    $('brainDump').value = D.brainDump || '';
    renderQuickLinks();
    renderHabitGrid(D.habits);
    renderDailyChallenges(D.activeChallenges || []);
    renderPipelineSnapshot(D.pipelineCounts, 'pipelineSnapshot');
    updateHeaderStats();
    miniCalMonth = monthKeyOf(D.date);
    renderMiniCal();
    loadMiniCalEvents();
    setSaveState('');
  }

  function setStatBar(id, done, total) {
    var el = $(id);
    if (!el) return;
    var pct = total > 0 ? Math.round((done / total) * 100) : 0;
    el.style.width = pct + '%';
  }

  function updateHeaderStats() {
    var doneP = D.priorities.filter(function (p) { return p.done; }).length;
    $('statPriorities').textContent = doneP + '/3';
    setStatBar('statPrioritiesBar', doneP, 3);

    if (D.habits.length) {
      var doneH = D.habits.filter(function (h) { return h.checked; }).length;
      $('statHabits').textContent = doneH + '/' + D.habits.length;
      setStatBar('statHabitsBar', doneH, D.habits.length);
    } else {
      $('statHabits').textContent = '—';
      setStatBar('statHabitsBar', 0, 1);
    }
  }

  var QUICK_LINK_ICONS = ['🧾', '🔗', '⭐', '📌', '💡', '📎'];

  function renderQuickLinks() {
    var wrap = $('quickLinksList');
    if (!wrap) return;
    var links = (SETTINGS && SETTINGS.quickLinks) || [];
    if (!links.length) {
      wrap.innerHTML = '<p class="checklist-empty">ยังไม่มีลิงก์ — กด "แก้ไขรายการ" เพื่อเพิ่ม</p>';
      return;
    }
    wrap.innerHTML = links.map(function (it, i) {
      var isUrl = /^https?:\/\//i.test(it.extraValue || '');
      var icon = QUICK_LINK_ICONS[i % QUICK_LINK_ICONS.length];
      var inner = '<span class="quick-link-icon quick-link-icon-' + (i % 4) + '">' + icon + '</span>' +
        '<span class="quick-link-label">' + esc(it.label) + '</span>';
      return isUrl
        ? '<a class="quick-link-tile" href="' + esc(it.extraValue) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>'
        : '<span class="quick-link-tile quick-link-noref">' + inner + '</span>';
    }).join('');
  }

  var miniCalEventDates = {};

  function loadMiniCalEvents() {
    var forMonth = miniCalMonth;
    call('get_event_dates_in_month', { p_month: forMonth }).then(function (res) {
      if (forMonth !== miniCalMonth) return; // user already navigated away
      miniCalEventDates = {};
      (res.dates || []).forEach(function (d) { miniCalEventDates[d] = true; });
      renderMiniCal();
    }).catch(function () {});
  }

  function bindMiniCal() {
    $('miniCalPrev').addEventListener('click', function () { miniCalMonth = prevMonth(miniCalMonth); renderMiniCal(); loadMiniCalEvents(); });
    $('miniCalNext').addEventListener('click', function () { miniCalMonth = nextMonth(miniCalMonth); renderMiniCal(); loadMiniCalEvents(); });
  }

  function renderMiniCal() {
    var p = miniCalMonth.split('-').map(Number);
    var year = p[0], month = p[1] - 1;
    $('miniCalLabel').textContent = THAI_MONTH_SHORT[month] + ' ' + (year + 543);
    var first = new Date(year, month, 1);
    var startWeekday = (first.getDay() + 6) % 7; // Mon=0..Sun=6
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var todayK = todayKeyClient();
    var cells = [];
    for (var i = 0; i < startWeekday; i++) cells.push('<span class="mc-cell mc-blank"></span>');
    for (var d = 1; d <= daysInMonth; d++) {
      var key = year + '-' + pad2(month + 1) + '-' + pad2(d);
      var cls = 'mc-cell';
      if (key === todayK) cls += ' mc-today';
      if (D && key === D.date) cls += ' mc-selected';
      var dot = miniCalEventDates[key] ? '<span class="mc-dot"></span>' : '';
      cells.push('<button type="button" class="' + cls + '" data-date="' + key + '">' + d + dot + '</button>');
    }
    $('miniCalGrid').innerHTML = cells.join('');
    $('miniCalGrid').querySelectorAll('[data-date]').forEach(function (btn) {
      btn.addEventListener('click', function () { goToDay(btn.getAttribute('data-date')); });
    });
  }

  function renderPriorities() {
    var wrap = $('priorityList');
    wrap.innerHTML = [0, 1, 2].map(function (i) {
      return '<div class="priority-row" data-idx="' + i + '">' +
        '<span class="priority-num">' + (i + 1) + '</span>' +
        '<input type="checkbox" class="priority-check" data-idx="' + i + '">' +
        '<input type="text" class="priority-text" data-idx="' + i + '" placeholder="สิ่งสำคัญอันดับ ' + (i + 1) + '…">' +
        '</div>';
    }).join('');
    var rows = wrap.querySelectorAll('.priority-row');
    rows.forEach(function (row, i) {
      var p = D.priorities[i];
      var chk = row.querySelector('.priority-check');
      var txt = row.querySelector('.priority-text');
      chk.checked = !!p.done;
      txt.value = p.text || '';
      row.classList.toggle('is-done', !!p.done);
      chk.addEventListener('change', function () {
        D.priorities[i].done = chk.checked;
        row.classList.toggle('is-done', chk.checked);
        updateHeaderStats();
        markDirty();
      });
      txt.addEventListener('input', function () {
        D.priorities[i].text = txt.value;
        markDirty();
      });
    });
  }

  function renderCarryOver() {
    var wrap = $('carryOverList');
    var hasEmptySlot = D.priorities.some(function (p) { return !String(p.text || '').trim(); });
    var items = D.carryOverPriorities || [];
    if (!items.length || !hasEmptySlot) {
      wrap.innerHTML = '';
      return;
    }
    wrap.innerHTML = '<p class="carryover-label">ค้างจากเมื่อวาน</p>' +
      items.map(function (it, i) {
        return '<div class="carryover-row" data-idx="' + i + '">' +
          '<span class="carryover-text">' + esc(it.text) + '</span>' +
          '<button type="button" class="carryover-use" data-idx="' + i + '">ใช้ต่อ</button>' +
          '<button type="button" class="carryover-dismiss" data-idx="' + i + '" title="ไม่ต้องแล้ว">✕</button>' +
          '</div>';
      }).join('');
    wrap.querySelectorAll('.carryover-use').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = Number(btn.getAttribute('data-idx'));
        var text = items[idx].text;
        var slot = D.priorities.findIndex(function (p) { return !String(p.text || '').trim(); });
        if (slot === -1) return;
        D.priorities[slot] = { text: text, done: false };
        D.carryOverPriorities.splice(idx, 1);
        renderPriorities();
        renderCarryOver();
        updateHeaderStats();
        markDirty();
      });
    });
    wrap.querySelectorAll('.carryover-dismiss').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = Number(btn.getAttribute('data-idx'));
        D.carryOverPriorities.splice(idx, 1);
        renderCarryOver();
      });
    });
  }

  function renderTodoList() {
    var wrap = $('todoList');
    if (!D.todos.length) {
      wrap.innerHTML = '<p class="checklist-empty">ยังไม่มีสิ่งที่ต้องทำ — พิมพ์ด้านล่างแล้วกด Enter</p>';
      return;
    }
    wrap.innerHTML = D.todos.map(function (t, i) {
      return '<div class="todo-row' + (t.done ? ' is-done' : '') + '" data-idx="' + i + '">' +
        '<input type="checkbox" class="todo-check" data-idx="' + i + '">' +
        '<input type="text" class="todo-text" data-idx="' + i + '">' +
        '<button type="button" class="todo-del" data-idx="' + i + '" title="ลบ">✕</button>' +
        '</div>';
    }).join('');
    wrap.querySelectorAll('.todo-row').forEach(function (row, i) {
      var chk = row.querySelector('.todo-check');
      var txt = row.querySelector('.todo-text');
      var del = row.querySelector('.todo-del');
      chk.checked = !!D.todos[i].done;
      txt.value = D.todos[i].text || '';
      chk.addEventListener('change', function () {
        D.todos[i].done = chk.checked;
        row.classList.toggle('is-done', chk.checked);
        updateHeaderStats();
        markDirty();
      });
      txt.addEventListener('input', function () {
        D.todos[i].text = txt.value;
        markDirty();
      });
      del.addEventListener('click', function () {
        D.todos.splice(i, 1);
        renderTodoList();
        updateHeaderStats();
        markDirty();
      });
    });
  }

  function renderEventList() {
    var wrap = $('eventList');
    if (!D.events.length) {
      wrap.innerHTML = '<p class="checklist-empty">ยังไม่มีนัดหมาย/กิจกรรมวันนี้</p>';
      return;
    }
    wrap.innerHTML = D.events.map(function (e, i) {
      return '<div class="event-row" data-idx="' + i + '">' +
        (e.time ? '<span class="event-time">' + esc(e.time) + '</span>' : '<span class="event-time event-time-blank">—</span>') +
        '<span class="event-title">' + esc(e.title) + '</span>' +
        '<button type="button" class="event-del" data-idx="' + i + '" title="ลบ">✕</button>' +
        '</div>';
    }).join('');
    wrap.querySelectorAll('.event-del').forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        D.events.splice(i, 1);
        renderEventList();
        markDirty();
        markMiniCalHasEvent(D.date, D.events.length > 0);
      });
    });
  }


  var HABIT_ICONS = [
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"/></svg>'
  ];

  function renderHabitGrid(items) {
    var wrap = $('habitList');
    if (!items.length) {
      wrap.innerHTML = '<p class="checklist-empty">ยังไม่ได้ตั้งกิจวัตร — กด "แก้ไขรายการ" เพื่อเพิ่ม</p>';
      return;
    }
    var dayKeys = D.habitWeekDayKeys || [];
    var todayK = todayKeyClient();

    var head = '<div class="habit-grid-head"><span></span>' + dayKeys.map(function (dk) {
      return '<span>' + THAI_DOW_SHORT[fromKey(dk).getDay()] + '</span>';
    }).join('') + '</div>';

    var rows = items.map(function (it, i) {
      var icon = HABIT_ICONS[i % HABIT_ICONS.length];
      var cells = dayKeys.map(function (dk, j) {
        var checked = !!(it.week && it.week[j]);
        var isFuture = dk > todayK;
        var isToday = dk === todayK;
        var cls = 'habit-day-cell' + (checked ? ' checked' : '') + (isFuture ? ' is-future' : '') + (isToday ? ' is-today' : '');
        return '<button type="button" class="' + cls + '" data-hidx="' + i + '" data-day="' + j + '"' + (isFuture ? ' disabled' : '') + '>' + icon + '</button>';
      }).join('');
      return '<div class="habit-grid-row">' +
        '<span class="habit-row-label"><span class="habit-row-icon">' + icon + '</span>' + esc(it.label) + '</span>' +
        cells +
        '</div>';
    }).join('');

    wrap.innerHTML = head + rows;

    wrap.querySelectorAll('.habit-day-cell:not(.is-future)').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-hidx'));
        var j = Number(btn.getAttribute('data-day'));
        var dk = dayKeys[j];
        var newChecked = !items[i].week[j];
        items[i].week[j] = newChecked;
        btn.classList.toggle('checked', newChecked);
        if (dk === D.date) {
          items[i].checked = newChecked;
          updateHeaderStats();
        }
        if (newChecked) toast('เก่งมาก! ✨');
        call('toggle_habit_day', { p_habit_id: items[i].itemKey, p_date: dk, p_checked: newChecked }).then(function () {
          loadPoints();
        }).catch(function (err) {
          toast(errMsg(err), true);
          items[i].week[j] = !newChecked;
          btn.classList.toggle('checked', !newChecked);
        });
      });
    });
  }

  function renderPipelineSnapshot(counts, elId) {
    var el = $(elId);
    el.innerHTML = STAGES.map(function (s) { return '<span class="pl-stage">' + s + '</span> ' + (counts[s] || 0); }).join(' &middot; ');
    el.onclick = function () {
      if (S.view === 'daily') flushDailySave();
      if (S.view === 'weekly') flushWeekSave();
      switchView('content');
    };
  }

  /* ================= CHALLENGES ================= */
  function renderDailyChallenges(list) {
    var card = $('dailyChallengeCard');
    var wrap = $('dailyChallengeList');
    if (!list.length) { card.classList.add('hidden'); return; }
    card.classList.remove('hidden');
    wrap.innerHTML = list.map(function (c) {
      return '<div class="daily-challenge-row" data-id="' + esc(c.id) + '">' +
        '<button type="button" class="challenge-check' + (c.checkedToday ? ' checked' : '') + '" data-id="' + esc(c.id) + '">' + (c.checkedToday ? '✓' : '') + '</button>' +
        '<span class="daily-challenge-name">' + esc(c.name) + '</span>' +
        '<span class="daily-challenge-progress">' + c.doneCount + '/' + c.durationDays + ' วันที่ทำแล้ว</span>' +
        '</div>';
    }).join('');
    wrap.querySelectorAll('.challenge-check').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var item = list.filter(function (x) { return x.id === id; })[0];
        var newChecked = !item.checkedToday;
        item.checkedToday = newChecked;
        item.doneCount += newChecked ? 1 : -1;
        renderDailyChallenges(list);
        call('toggle_challenge_day', { p_challenge_id: id, p_date: D.date, p_checked: newChecked }).then(function () {
          loadPoints();
        }).catch(function (err) {
          toast(errMsg(err), true);
        });
      });
    });
  }

  function bindChallenge() {
    $('addChallengeBtn').addEventListener('click', function () {
      $('challengeName').value = '';
      $('challengeDuration').value = 30;
      $('challengeErr').textContent = '';
      show('challengeOverlay');
      setTimeout(function () { $('challengeName').focus(); }, 30);
    });
    $('challengeCancel').addEventListener('click', function () { hide('challengeOverlay'); });
    $('challengeOverlay').addEventListener('click', function (e) { if (e.target === $('challengeOverlay')) hide('challengeOverlay'); });
    $('challengeSave').addEventListener('click', function () {
      var name = $('challengeName').value.trim();
      var duration = Number($('challengeDuration').value) || 0;
      if (!name) { $('challengeErr').textContent = 'กรุณาใส่ชื่อ Challenge'; return; }
      if (duration < 1) { $('challengeErr').textContent = 'ระยะเวลาต้องมากกว่า 0 วัน'; return; }
      $('challengeSave').disabled = true;
      call('create_challenge', { p_name: name, p_duration_days: duration }).then(function () {
        $('challengeSave').disabled = false;
        hide('challengeOverlay');
        toast('สร้าง Challenge แล้ว');
        loadChallenges();
        if (D) loadDaily(D.date);
      }).catch(function (err) { $('challengeSave').disabled = false; $('challengeErr').textContent = errMsg(err); });
    });
  }

  function loadChallenges() {
    call('get_challenges').then(function (res) {
      CHALLENGES = res || { active: [], past: [] };
      renderChallengeView();
    }).catch(function (err) { toast(errMsg(err), true); });
  }

  function renderChallengeView() {
    var activeWrap = $('activeChallengeList');
    var todayK = todayKeyClient();
    if (!CHALLENGES.active.length) {
      activeWrap.innerHTML = '<p class="checklist-empty">ยังไม่มี Challenge ที่กำลังทำ — กด "+ สร้าง Challenge"</p>';
    } else {
      activeWrap.innerHTML = CHALLENGES.active.map(function (c) {
        var checkedToday = (c.checkedDates || []).indexOf(todayK) >= 0;
        var pct = c.durationDays > 0 ? Math.round((c.doneCount / c.durationDays) * 100) : 0;
        var checkedSet = {};
        (c.checkedDates || []).forEach(function (d) { checkedSet[d] = true; });
        var dots = '';
        for (var i = 0; i < c.durationDays; i++) {
          var dDate = addDays(c.startDate, i);
          var cls = 'challenge-dot';
          if (checkedSet[dDate]) cls += ' done';
          else if (dDate > todayK) cls += ' future';
          dots += '<span class="' + cls + '" title="' + dDate + '"></span>';
        }
        return '<div class="challenge-card" data-id="' + esc(c.id) + '">' +
          '<div class="challenge-card-top">' +
            '<button type="button" class="challenge-check' + (checkedToday ? ' checked' : '') + '" data-id="' + esc(c.id) + '">' + (checkedToday ? '✓' : '') + '</button>' +
            '<span class="challenge-name">' + esc(c.name) + '</span>' +
            '<span class="challenge-progress">' + c.doneCount + '/' + c.durationDays + ' วันที่ทำแล้ว (' + pct + '%)</span>' +
            '<button type="button" class="challenge-del" data-id="' + esc(c.id) + '" title="ลบ">✕</button>' +
          '</div>' +
          '<div class="challenge-bar-track"><div class="challenge-bar-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="challenge-dots">' + dots + '</div>' +
          '</div>';
      }).join('');
      activeWrap.querySelectorAll('.challenge-check').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-id');
          var checked = !btn.classList.contains('checked');
          call('toggle_challenge_day', { p_challenge_id: id, p_date: todayK, p_checked: checked }).then(function () {
            loadChallenges();
            loadPoints();
            if (D) loadDaily(D.date);
          }).catch(function (err) { toast(errMsg(err), true); });
        });
      });
      activeWrap.querySelectorAll('.challenge-del').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!window.confirm('ลบ Challenge นี้ใช่ไหม?')) return;
          call('delete_challenge', { p_challenge_id: btn.getAttribute('data-id') }).then(function () {
            toast('ลบแล้ว');
            loadChallenges();
          }).catch(function (err) { toast(errMsg(err), true); });
        });
      });
    }

    var pastWrap = $('pastChallengeList');
    if (!CHALLENGES.past.length) {
      pastWrap.innerHTML = '<p class="checklist-empty">ยังไม่มีประวัติ Challenge</p>';
    } else {
      pastWrap.innerHTML = CHALLENGES.past.map(function (c) {
        return '<div class="challenge-past-row">' +
          '<span class="challenge-past-name">' + esc(c.name) + '</span>' +
          '<span class="challenge-progress">' + c.doneCount + '/' + c.durationDays + ' วันที่ทำแล้ว</span>' +
          '</div>';
      }).join('');
    }
  }

  /* ================= WEEKLY ================= */
  var weekSaveTimer = null, weekDirty = false;

  function setWeekSaveState(text) { $('weekSaveState').textContent = text || ' '; }

  function markWeekDirty() {
    weekDirty = true;
    setWeekSaveState('กำลังพิมพ์…');
    if (weekSaveTimer) clearTimeout(weekSaveTimer);
    weekSaveTimer = setTimeout(flushWeekSave, 700);
  }

  function flushWeekSave() {
    if (weekSaveTimer) { clearTimeout(weekSaveTimer); weekSaveTimer = null; }
    if (!weekDirty || !W) return;
    weekDirty = false;
    setWeekSaveState('กำลังบันทึก…');
    call('save_week_reflection', { p_week_start: W.weekStart, p_reflection: W.reflectionNote, p_goals: W.goalsNote })
      .then(function () { setWeekSaveState('บันทึกแล้ว ✓'); })
      .catch(function (err) { setWeekSaveState('บันทึกไม่สำเร็จ: ' + errMsg(err)); });
  }

  function goToWeek(newStart) { flushWeekSave(); loadWeek(newStart); }

  function loadWeek(weekStart) {
    call('get_week_summary', { p_week_start: weekStart }).then(function (w) {
      W = w;
      renderWeekAll();
    }).catch(function (err) { toast(errMsg(err), true); });
  }

  function bindWeekly() {
    $('weekPrev').addEventListener('click', function () { goToWeek(addDays(W.weekStart, -7)); });
    $('weekNext').addEventListener('click', function () { goToWeek(addDays(W.weekStart, 7)); });
    $('weekToday').addEventListener('click', function () { goToWeek(mondayOf(todayKeyClient())); });
    $('weekReflection').addEventListener('input', function () { W.reflectionNote = this.value; markWeekDirty(); });
    $('weekGoals').addEventListener('input', function () { W.goalsNote = this.value; markWeekDirty(); });
  }

  function renderWeekAll() {
    $('weekLabel').textContent = formatWeekLabel(W.weekStart);
    renderWeekStrip();
    $('weekReflection').value = W.reflectionNote || '';
    $('weekGoals').value = W.goalsNote || '';
    renderPipelineSnapshot(W.pipelineCounts, 'weekPipelineSummary');
    renderScheduledList();
    setWeekSaveState('');
  }

  function renderWeekStrip() {
    var today = todayKeyClient();
    $('weekStrip').innerHTML = W.days.map(function (d) {
      var dObj = fromKey(d.date);
      var isToday = d.date === today;
      var priorityText = d.topPriority ? esc(d.topPriority) : '—';
      var habitText = d.habitTotal > 0 ? (d.habitDone + '/' + d.habitTotal + ' กิจวัตร') : '';
      return '<div class="week-day' + (isToday ? ' is-today' : '') + '">' +
        '<div class="wd-date">' + THAI_DOW_SHORT[dObj.getDay()] + ' ' + dObj.getDate() + '/' + (dObj.getMonth() + 1) + '</div>' +
        '<div class="wd-priority' + (d.topPriority ? '' : ' empty') + '">' + priorityText +
          (d.priorityFilledCount > 1 ? ' (' + d.priorityDoneCount + '/' + d.priorityFilledCount + ')' : '') + '</div>' +
        (habitText ? '<div class="wd-habit">' + habitText + '</div>' : '') +
        '</div>';
    }).join('');
  }

  function renderScheduledList() {
    var wrap = $('weekScheduledList');
    if (!W.scheduledThisWeek.length) {
      wrap.innerHTML = '<p class="checklist-empty">ยังไม่มีคอนเทนต์กำหนดโพสต์สัปดาห์นี้</p>';
      return;
    }
    wrap.innerHTML = W.scheduledThisWeek.map(function (s) {
      return '<div class="scheduled-row">' +
        '<span class="scheduled-date">' + esc(s.scheduledDate) + '</span>' +
        (s.channelId ? '<span class="scheduled-chan">' + esc(channelLabel(s.channelId, 'contentChannels')) + '</span>' : '') +
        '<span>' + esc(s.title) + '</span>' +
        '</div>';
    }).join('');
  }

  /* ================= CONTENT PLANNER ================= */
  function bindContent() {
    var searchTimer = null;
    $('contentSearch').addEventListener('input', function (e) {
      contentFilter.q = e.target.value.trim();
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(reloadPipeline, 250);
    });
    $('channelChips').addEventListener('click', function (e) {
      var k = e.target.getAttribute('data-ch');
      if (k === null) return;
      contentFilter.channelId = k;
      reloadPipeline();
    });
    $('addIdeaBtn').addEventListener('click', function () { openIdeaModal(null); });
    $('calPrev').addEventListener('click', function () { calMonth = prevMonth(calMonth); loadCalendar(); });
    $('calNext').addEventListener('click', function () { calMonth = nextMonth(calMonth); loadCalendar(); });
  }

  function loadCalendar() {
    return call('get_content_calendar', { p_month: calMonth }).then(function (res) {
      if (!res || !res.byDate) { toast('โหลดปฏิทินคอนเทนต์ไม่สำเร็จ (ไม่ได้รับข้อมูลจากเซิร์ฟเวอร์)', true); return; }
      CAL = res; SETTINGS = res.settings || SETTINGS;
      renderCalendar();
    }).catch(function (err) { toast(errMsg(err), true); });
  }

  function renderCalendar() {
    $('calLabel').textContent = formatMonthLabel(calMonth);
    var p = calMonth.split('-').map(Number);
    var year = p[0], month = p[1] - 1;
    var first = new Date(year, month, 1);
    var startWeekday = first.getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var todayK = todayKeyClient();
    var cells = [];
    for (var i = 0; i < startWeekday; i++) cells.push('<div class="cal-cell other-month"></div>');
    for (var d = 1; d <= daysInMonth; d++) {
      var key = year + '-' + pad2(month + 1) + '-' + pad2(d);
      var items = CAL.byDate[key] || [];
      var tags = items.map(function (it) {
        return '<span class="cal-tag" data-idea="' + esc(it.ideaId) + '">' + esc(it.title) + '</span>';
      }).join('');
      cells.push('<div class="cal-cell' + (key === todayK ? ' is-today' : '') + '"><div class="cal-daynum">' + d + '</div>' + tags + '</div>');
    }
    $('calGrid').innerHTML = cells.join('');
    $('calGrid').querySelectorAll('[data-idea]').forEach(function (tag) {
      tag.addEventListener('click', function () { openIdeaModalById(tag.getAttribute('data-idea')); });
    });
  }

  function reloadPipeline() {
    return call('get_content_pipeline', { p_channel_id: contentFilter.channelId || null, p_q: contentFilter.q || '' }).then(function (res) {
      if (!res || !res.board) { toast('โหลด Pipeline ไม่สำเร็จ (ไม่ได้รับข้อมูลจากเซิร์ฟเวอร์)', true); return; }
      PIPELINE = res.board; SETTINGS = res.settings || SETTINGS;
      renderChannelChips();
      renderPipelineBoard();
    }).catch(function (err) { toast(errMsg(err), true); });
  }

  function renderChannelChips() {
    var wrap = $('channelChips');
    var channels = ((SETTINGS && SETTINGS.contentChannels) || []).filter(function (c) { return c.active !== false; });
    var chips = [['', 'ทั้งหมด']].concat(channels.map(function (c) { return [c.id, c.label]; }));
    wrap.innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip' + (contentFilter.channelId === c[0] ? ' on' : '') + '" data-ch="' + esc(c[0]) + '">' + esc(c[1]) + '</button>';
    }).join('');
  }

  function renderPipelineBoard() {
    var wrap = $('pipelineBoard');
    wrap.innerHTML = STAGES.map(function (stage) {
      var items = PIPELINE[stage] || [];
      var nextStage = STAGES[STAGES.indexOf(stage) + 1];
      var cards = items.length ? items.map(function (it) {
        return '<div class="pl-card" data-idea="' + esc(it.ideaId) + '">' +
          '<div class="pl-card-title">' + esc(it.title) + '</div>' +
          '<div class="pl-card-meta">' +
            '<span class="pl-card-chan">' + (it.channelId ? esc(channelLabel(it.channelId, 'contentChannels')) : '') + '</span>' +
            (nextStage ? '<button type="button" class="pl-advance" data-advance="' + esc(it.ideaId) + '" data-next="' + nextStage + '">→ ' + nextStage + '</button>' : '') +
          '</div>' +
          '</div>';
      }).join('') : '<p class="pl-empty">ว่าง</p>';
      return '<div class="pl-col"><p class="pl-col-head">' + stage + ' <b>' + items.length + '</b></p>' + cards + '</div>';
    }).join('');

    wrap.querySelectorAll('[data-advance]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-advance'), next = btn.getAttribute('data-next');
        call('update_pipeline_stage', { p_idea_id: id, p_new_stage: next }).then(function () {
          toast('ย้ายไปสถานะ ' + next);
          reloadPipeline();
          loadIdeaBank();
          if (CAL) loadCalendar();
        }).catch(function (err) { toast(errMsg(err), true); });
      });
    });
    wrap.querySelectorAll('.pl-card').forEach(function (card) {
      card.addEventListener('click', function () { openIdeaModalById(card.getAttribute('data-idea')); });
    });
  }

  function findIdeaById(id) {
    var all = [];
    STAGES.forEach(function (s) { all = all.concat((PIPELINE && PIPELINE[s]) || []); });
    return all.filter(function (x) { return x.ideaId === id; })[0];
  }

  function openIdeaModalById(id) {
    var idea = findIdeaById(id);
    if (idea) openIdeaModal(idea);
  }

  function fillChannelSelect(sel, selected) {
    var channels = ((SETTINGS && SETTINGS.contentChannels) || []).filter(function (c) { return c.active !== false; });
    sel.innerHTML = '<option value="">— ไม่ระบุ —</option>' +
      channels.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.label) + '</option>'; }).join('');
    sel.value = selected || '';
  }

  function openIdeaModal(idea) {
    IDEA_EDIT = idea || null;
    $('ideaModalTitle').textContent = idea ? 'แก้ไขไอเดีย' : 'เพิ่มไอเดียใหม่';
    $('ideaTitle').value = idea ? idea.title : '';
    $('ideaNotes').value = idea ? (idea.notes || '') : '';
    fillChannelSelect($('ideaChannel'), idea ? idea.channelId : '');
    $('ideaStage').value = idea ? idea.stage : 'Idea';
    $('ideaScheduled').value = idea ? (idea.scheduledDate || '') : '';
    $('ideaErr').textContent = '';
    $('ideaDelete').classList.toggle('hidden', !idea);
    show('ideaOverlay');
    setTimeout(function () { $('ideaTitle').focus(); }, 30);
  }

  function bindIdeaModal() {
    $('ideaCancel').addEventListener('click', function () { hide('ideaOverlay'); });
    $('ideaOverlay').addEventListener('click', function (e) { if (e.target === $('ideaOverlay')) hide('ideaOverlay'); });
    $('ideaSave').addEventListener('click', submitIdeaSave);
    $('ideaDelete').addEventListener('click', submitIdeaDelete);
  }

  function submitIdeaSave() {
    var title = $('ideaTitle').value.trim();
    if (!title) { $('ideaErr').textContent = 'กรุณาใส่หัวข้อ'; return; }
    var payload = {
      p_idea_id: IDEA_EDIT ? IDEA_EDIT.ideaId : null,
      p_title: title,
      p_notes: $('ideaNotes').value.trim(),
      p_channel_id: $('ideaChannel').value || null,
      p_stage: $('ideaStage').value,
      p_scheduled_date: $('ideaScheduled').value || null,
      p_created_from: 'content-planner'
    };
    $('ideaSave').disabled = true;
    call('save_content_idea', payload).then(function () {
      $('ideaSave').disabled = false;
      hide('ideaOverlay');
      toast('บันทึกไอเดียแล้ว');
      reloadPipeline();
      loadIdeaBank();
      if (CAL) loadCalendar();
    }).catch(function (err) { $('ideaSave').disabled = false; $('ideaErr').textContent = errMsg(err); });
  }

  function submitIdeaDelete() {
    if (!IDEA_EDIT) return;
    if (!window.confirm('ลบไอเดียนี้ใช่ไหม?')) return;
    call('delete_content_idea', { p_idea_id: IDEA_EDIT.ideaId }).then(function () {
      hide('ideaOverlay');
      toast('ลบแล้ว');
      reloadPipeline();
      loadIdeaBank();
      if (CAL) loadCalendar();
    }).catch(function (err) { toast(errMsg(err), true); });
  }

  /* ================= SETTINGS MODAL ================= */
  function openSettingsModal() {
    call('get_settings').then(function (s) {
      SETTINGS = s;
      SETTINGS_DRAFT = JSON.parse(JSON.stringify(s));
      renderSettingsModal();
      $('settingsErr').textContent = '';
      show('settingsOverlay');
    }).catch(function (err) { toast(errMsg(err), true); });
  }

  function renderSettingsModal() {
    renderFixedSettingsList('settingsHabits', SETTINGS_DRAFT.habits, { extra: false, labelPlaceholder: 'ชื่อกิจวัตร' });
    renderEditableSettingsList('settingsQuickLinks', SETTINGS_DRAFT.quickLinks, { extra: true, labelPlaceholder: 'ชื่อลิงก์', extraPlaceholder: 'https://...' });
    renderEditableSettingsList('settingsContentChannels', SETTINGS_DRAFT.contentChannels);
  }

  function renderFixedSettingsList(containerId, list, opts) {
    var wrap = $(containerId);
    wrap.innerHTML = list.map(function (item, i) {
      return '<div class="settings-row" data-idx="' + i + '">' +
        '<input type="text" class="text-input st-label" data-idx="' + i + '" placeholder="' + esc(opts.labelPlaceholder || 'ชื่อ') + '">' +
        (opts.extra ? '<input type="text" class="text-input st-extra" data-idx="' + i + '" placeholder="' + esc(opts.extraPlaceholder || '') + '">' : '') +
        '</div>';
    }).join('');
    wrap.querySelectorAll('.st-label').forEach(function (inp, i) {
      inp.value = list[i].label || '';
      inp.addEventListener('input', function () { list[i].label = inp.value; });
    });
    if (opts.extra) {
      wrap.querySelectorAll('.st-extra').forEach(function (inp, i) {
        inp.value = list[i].extraValue || '';
        inp.addEventListener('input', function () { list[i].extraValue = inp.value; });
      });
    }
  }

  function renderEditableSettingsList(containerId, list, opts) {
    opts = opts || {};
    var wrap = $(containerId);
    if (!list.length) { wrap.innerHTML = '<p class="checklist-empty">ยังไม่มีรายการ</p>'; return; }
    wrap.innerHTML = list.map(function (item, i) {
      return '<div class="settings-row" data-idx="' + i + '">' +
        '<input type="text" class="text-input st-label" data-idx="' + i + '" placeholder="' + esc(opts.labelPlaceholder || 'ชื่อรายการ') + '">' +
        (opts.extra ? '<input type="text" class="text-input st-extra" data-idx="' + i + '" placeholder="' + esc(opts.extraPlaceholder || '') + '">' : '') +
        '<button type="button" class="st-del" data-idx="' + i + '" title="ลบ">✕</button>' +
        '</div>';
    }).join('');
    wrap.querySelectorAll('.st-label').forEach(function (inp, i) {
      inp.value = list[i].label || '';
      inp.addEventListener('input', function () { list[i].label = inp.value; });
    });
    if (opts.extra) {
      wrap.querySelectorAll('.st-extra').forEach(function (inp, i) {
        inp.value = list[i].extraValue || '';
        inp.addEventListener('input', function () { list[i].extraValue = inp.value; });
      });
    }
    wrap.querySelectorAll('.st-del').forEach(function (btn, i) {
      btn.addEventListener('click', function () { list.splice(i, 1); renderSettingsModal(); });
    });
  }

  function bindSettingsModal() {
    $('quickLinkAddBtn').addEventListener('click', function () {
      SETTINGS_DRAFT.quickLinks.push({ id: null, label: '', extraValue: '', active: true });
      renderSettingsModal();
    });
    $('ccAddBtn').addEventListener('click', function () {
      SETTINGS_DRAFT.contentChannels.push({ id: null, label: '', extraValue: '', active: true });
      renderSettingsModal();
    });
    $('settingsCancel').addEventListener('click', function () { SETTINGS_DRAFT = null; hide('settingsOverlay'); });
    $('settingsOverlay').addEventListener('click', function (e) { if (e.target === $('settingsOverlay')) { SETTINGS_DRAFT = null; hide('settingsOverlay'); } });
    $('settingsSave').addEventListener('click', submitSettingsSave);
  }

  function submitSettingsSave() {
    $('settingsErr').textContent = '';
    ['quickLinks', 'contentChannels'].forEach(function (k) {
      SETTINGS_DRAFT[k] = SETTINGS_DRAFT[k].filter(function (x) { return String(x.label || '').trim(); });
    });
    $('settingsSave').disabled = true;
    call('save_settings', { p_payload: SETTINGS_DRAFT }).then(function (fresh) {
      SETTINGS_DRAFT = null;
      SETTINGS = fresh;
      $('settingsSave').disabled = false;
      hide('settingsOverlay');
      toast('บันทึกรายการแล้ว');
      if (S.view === 'daily') loadDaily(D.date);
      else if (S.view === 'weekly') loadWeek(W.weekStart);
      else if (S.view === 'content') { renderChannelChips(); renderPipelineBoard(); loadCalendar(); }
    }).catch(function (err) { $('settingsSave').disabled = false; $('settingsErr').textContent = errMsg(err); });
  }

  /* ---------- go ---------- */
  function boot() {
    try { start(); } catch (e) { showFatal(e); }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
