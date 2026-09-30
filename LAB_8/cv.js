(function () {
    'use strict';
    /* ТОГТМОЛ ӨГӨГДӨЛ */
    const TEACHERS = [
        { value: 'CSA322', text: 'Э.Сүх-Очир'    },
        { value: 'FA211',  text: 'Б.Долгорсүрэн'  },
        { value: 'CA222',  text: 'Г.Ганбат'       },
        { value: 'CD22',   text: 'А.Дорж'         },
        { value: 'VV2221', text: 'Б.Сэрдарям'     },
        { value: 'CD33',   text: 'Т.Амаржаргал'   }
    ];

    const LEC_SLOTS = [
        { value: '1-1_VI-129т', text: '1-1 VI-129т' },
        { value: '2-2_VI-129т', text: '2-2 VI-129т' },
        { value: '3-3_VI-129т', text: '3-3 VI-129т' },
        { value: '4-4_VI-129т', text: '4-4 VI-129т' },
        { value: '4-6_VI-129т', text: '4-6 VI-129т' },
        { value: '5-3_VI-129т', text: '5-3 VI-129т' }
    ];

    const LAB_SLOTS = [
        { value: '1-2_VI-121т', text: '1-2 VI-121т' },
        { value: '2-3_VI-111т', text: '2-3 VI-111т' },
        { value: '3-4_VI-111т', text: '3-4 VI-111т' },
        { value: '4-5_VI-121т', text: '4-5 VI-121т' },
        { value: '5-1_VI-121т', text: '5-1 VI-121т' },
        { value: '5-4_VI-121т', text: '5-4 VI-121т' }
    ];

  /* Хичээл бүрийн анхдагч багш / лекц / лаб */
    const DEFAULTS = {
        'F.ITM202': { teacher: 'CSA322', lec: '1-1_VI-129т', lab: '1-2_VI-121т' },
        'F.CSA311': { teacher: 'FA211',  lec: '2-2_VI-129т', lab: '2-3_VI-111т' },
        'F.ITM207': { teacher: 'CA222',  lec: '3-3_VI-129т', lab: '3-4_VI-111т' },
        'F.CSM303': { teacher: 'CD22',   lec: '4-4_VI-129т', lab: '4-5_VI-121т' },
        'S.EPM301': { teacher: 'VV2221', lec: '4-6_VI-129т', lab: '5-1_VI-121т' },
        'F.ITM237': { teacher: 'CD33',   lec: '5-3_VI-129т', lab: '5-4_VI-121т' },
        'S.MTM132': { teacher: 'CA222',  lec: '4-6_VI-129т', lab: '3-4_VI-111т' }
    };

    const DAYS    = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан'];
    const PERIODS = 7;

    const HOBBY_MAP = {
        nom_unshih:    'Ном унших',
        uuland_alkhah: 'Ууланд алхах',
        shuleg_bichih: 'Шүлэг бичих',
        duu_sonsoh:    'Дуу сонсох',
        togloom:       'Оюун ухааны тоглоом тоглох'
    };
    const TALENT_MAP = {
        hool_hiih:    'Хоол хийх',
        shuleg_bichih:'Шүлэг бичих'
    };
    const EDU_MAP = {
        baga:       'Бага',
        suuri:      'Суурь',
        bvren_dund: 'Бүрэн дунд'
    };

    /* ХУУДАС АЧААЛЛАГДАХАД */
    let table1, table2;

    document.addEventListener('DOMContentLoaded', function () {
        table1 = document.getElementById('lesson_table1');
        table2 = document.getElementById('lesson_table2');

        setupTable1();
        setupTable2();
        addValidation();
        addCVButton();
    });

    /* 1. ХИЧЭЭЛ СОНГОЛТ №1 — НЭМЭХ / ХАСАХ */
    function setupTable1() {
        const headerRow = table1.rows[0];
        const th = document.createElement('td');
        th.align = 'center';
        th.innerHTML = '<b>Үйлдэл</b>';
        headerRow.appendChild(th);

        const dropRow = table1.rows[1];
        const addCell = document.createElement('td');
        addCell.align = 'center';
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.textContent = 'НЭМЭХ';
        addBtn.addEventListener('click', onAddCourse);
        addCell.appendChild(addBtn);
        dropRow.appendChild(addCell);

        for (let i = 2; i < table1.rows.length; i++) {
            appendRemoveBtn(table1.rows[i]);
        }
    }

    function appendRemoveBtn(row) {
        const cell = document.createElement('td');
        cell.align = 'center';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'ХАСАХ';
        btn.addEventListener('click', function () { removeRow(row); });
        cell.appendChild(btn);
        row.appendChild(cell);
    }

  /* НЭМЭХ дарахад — таг хэвлэх аргаар мөр оруулах */
    function onAddCourse() {
        const codeSel   = document.getElementById('lesson_code1');
        const nameSel   = document.getElementById('lesson_name1');
        const creditSel = document.getElementById('lesson_credit1');
        const methodSel = document.getElementById('lesson_method1');
        
        const code   = codeSel.value;
        const name   = nameSel.options[nameSel.selectedIndex].text;
        const credit = creditSel.options[creditSel.selectedIndex].text;
        const method = methodSel.options[methodSel.selectedIndex].text;

      const num = table1.rows.length - 1; // 0=header, 1=dropdown → дугаар

        /* innerHTML (таг хэвлэх) аргаар шинэ мөр нэмэх */
        const newRow = table1.insertRow(-1);
        newRow.innerHTML =
            '<td align="center">' + num + '</td>' +
            '<td>' + escHtml(code)   + '</td>' +
            '<td>' + escHtml(name)   + '</td>' +
            '<td align="center">' + escHtml(credit) + '</td>' +
            '<td>' + escHtml(method) + '</td>' +
            '<td align="center"></td>';

        /* ХАСАХ товчийг DOM-аар нэмэх (eventlistener шаардлагатай) */
        const lastCell = newRow.cells[newRow.cells.length - 1];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'ХАСАХ';
        btn.addEventListener('click', function () { removeRow(newRow); });
        lastCell.appendChild(btn);

        renumberRows();
        updateTable2();
        showAlert('"' + name + '" нэмэгдлээ!', true);
    }

    function removeRow(row) {
        if (!row.parentNode) return;
        const name = row.cells[2] ? row.cells[2].textContent : '';
        row.parentNode.removeChild(row);
        renumberRows();
        updateTable2();
        showAlert('"' + name + '" хасагдлаа.', true);
    }

    function renumberRows() {
        for (let i = 2; i < table1.rows.length; i++) {
            table1.rows[i].cells[0].textContent = i - 1;
        }
    }

    function getSelectedCodes() {
        const codes = [];
        for (let i = 2; i < table1.rows.length; i++) {
            codes.push(table1.rows[i].cells[1].textContent.trim());
        }
        return codes;
    }

    function getSelectedCourses() {
        const list = [];
        for (let i = 2; i < table1.rows.length; i++) {
            const r = table1.rows[i];
            list.push({
            num:    r.cells[0].textContent.trim(),
            code:   r.cells[1].textContent.trim(),
            name:   r.cells[2].textContent.trim(),
            credit: r.cells[3].textContent.trim(),
            method: r.cells[4].textContent.trim()
            });
        }
        return list;
    }

    /* 2. ХИЧЭЭЛ СОНГОЛТ №2 — Автомат шинэчлэлт */
    function setupTable2() {
        updateTable2();
    }

    function updateTable2() {
      /* Толгойгоос бусад мөр бүгдийг устгах */
        while (table2.rows.length > 1) table2.deleteRow(1);
        
        const courses = getSelectedCourses();
        courses.forEach(function (c, i) {
            const defs = DEFAULTS[c.code] || {
                teacher: TEACHERS[i % TEACHERS.length].value,
                lec:     LEC_SLOTS[i % LEC_SLOTS.length].value,
                lab:     LAB_SLOTS[i % LAB_SLOTS.length].value
            };
            const row = table2.insertRow(-1);
            /* № */
            row.insertCell(0).textContent = i + 1;
            /* Код + Нэр */
            const nameCell = row.insertCell(1);
            nameCell.textContent = c.code + ' ' + c.name;
            /* Багш */
            row.insertCell(2).appendChild(
                makeSelect('t2_teacher_' + i, TEACHERS, defs.teacher)
            );
            /* Лекц */
            row.insertCell(3).appendChild(
                makeSelect('t2_lec_' + i, LEC_SLOTS, defs.lec)
            );
            /* Лаб/Сем */
            row.insertCell(4).appendChild(
                makeSelect('t2_lab_' + i, LAB_SLOTS, defs.lab)
            );
        });
    }

    function makeSelect(name, options, selectedValue) {
        const sel = document.createElement('select');
        sel.name  = name;
        sel.style.width = '100%';
        options.forEach(function (opt) {
            const o = document.createElement('option');
            o.value = opt.value;
            o.textContent = opt.text;
            if (opt.value === selectedValue) o.selected = true;
            sel.appendChild(o);
        });
        return sel;
    }

    /* 3. БАТАЛГААЖУУЛАЛТ — onchange / oninput */
    function addValidation() {
      /* Текст талбарууд */
        addTextValidation('student_code',
            function (v) { return /^[Bb]\d{9,}$/.test(v); },
            'Оюутны код: B үсгтэй 9+ оронтой тоон дугаар (жишээ: B242270128)');
            
        addTextValidation('urgiin_ovog',
            function (v) { return v.trim().length > 0; },
            'Ургийн овог хоосон байж болохгүй');

        addTextValidation('ovog',
            function (v) { return v.trim().length > 0; },
            'Овог хоосон байж болохгүй');

        addTextValidation('ner',
            function (v) { return v.trim().length > 0; },
            'Нэр хоосон байж болохгүй');

        addTextValidation('phone_number',
            function (v) { return /^(\d{3}-)?(\d{8})$/.test(v.trim()); },
            'Утас: 80308283 эсвэл 976-80308283 хэлбэртэй байх ёстой');

        addTextValidation('email_address',
            function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
            'Email хаяг буруу байна (жишээ: user@gmail.com)');
            
        addTextValidation('social_address',
            function (v) { try { new URL(v); return true; } catch { return false; } },
            'URL https:// -ээр эхлэх ёстой (жишээ: https://facebook.com/...)');
            
        addRangeValidation('nas', 16, 80, 'Нас 16–80 хооронд байх ёстой');
    }

    function addTextValidation(id, isValid, msg) {
        const el = document.getElementById(id);
        if (!el) return;
        const errSpan = makeErrSpan(el);
        function check() {
            if (!isValid(el.value)) {
                showFieldErr(el, errSpan, msg);
            } else {
                clearFieldErr(el, errSpan);
            }
        }
        el.addEventListener('change', check);
        el.addEventListener('input',  check);
    }

    function addRangeValidation(id, min, max, msg) {
        const el = document.getElementById(id);
        if (!el) return;
        const errSpan = makeErrSpan(el);
        function check() {
            const n = parseInt(el.value, 10);
            if (isNaN(n) || n < min || n > max) {
                showFieldErr(el, errSpan, msg);
            } else {
                clearFieldErr(el, errSpan);
            }
        }
        el.addEventListener('change', check);
        el.addEventListener('input',  check);
    }

    function makeErrSpan(el) {
        const span = document.createElement('span');
        span.style.cssText =
            'color:#c0392b;font-size:11px;display:none;font-style:italic;margin-left:4px;';
        el.parentNode.insertBefore(span, el.nextSibling);
        return span;
    }

    function showFieldErr(el, span, msg) {
        span.textContent  = '' + msg;
        span.style.display = 'inline';
        el.style.outline   = '2px solid #c0392b';
        el.style.background = '#fff5f5';
    }

    function clearFieldErr(el, span) {
        span.textContent   = '';
        span.style.display = 'none';
        el.style.outline   = '2px solid #27ae60';
        el.style.background = '#f0fff4';
    }

    /* 4. CV ҮҮСГЭХ ТОВЧ */
    function addCVButton() {
        const form = document.body;
        const divider = document.createElement('hr');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'CV үүсгэх';
        btn.addEventListener('click', generateAndShowCV);
        
        form.appendChild(divider);
        form.appendChild(btn);
    }

    /* 5. ФОРМЫН УТГА ЦУГЛУУЛАХ */
    function getVal(name) {
        const el = document.getElementsByName(name);
        return el.length > 0 ? el[0].value : '';
    }

    function getSelText(name) {
        const el = document.getElementsByName(name);
        if (!el || el.length === 0) return '';

        const el = els[0];
        if (el.tagName === 'SELECT' && el.selectedIndex >= 0) {
            return el.options[el.selectedIndex].text;
        }
        return el.value;
    }

    function collectFormData() {
        /* Үндсэн мэдээлэл */
        const studentCode = getVal('student_code');
        const urgiinOvog  = getVal('urgiin_ovog');
        const ovog        = getVal('ovog');
        const ner         = getVal('ner');
        const nas         = getVal('nas');
        const birthday    = getVal('birthday');
        const phone       = getVal('phone_number');
        const email       = getVal('email_address');
        const facebook    = getVal('social_address');
        const address     = getVal('geriin_hayg');
        const salbar      = getSelText('salbar');
        const course      = getSelText('course');

        /* Хүйс */
        let gender = '';
        const genders = document.getElementsByName("gender");
            
        for (let g of genders) {
            if (g.checked) {
                gender = g.value === 'er' ? 'Эр' : 'Эм';
            }
        }

        /* Боловсрол */
        const edus = [];
        const boxes = document.getElementsByName('bolovsrol');
        for(let b of boxes){
            if(b.checked){
                edus.push(EDU_MAP[b.value] || b.value);
            }
        }

        /* Садан */
        const sadan1Type = getSelText('sadan_torol_1');
        const sadan1Name = getVal('ner1');
        const sadan2Type = getSelText('sadan_torol_2');
        const sadan2Name = getVal('ner_2');
        
        /* Ур чадвар */
        const skills = [];
        for (let i = 1; i <= 5; i++) {
            const se = document.getElementsByName(`skill${i}`)[0];
            const le = document.getElementsByName(`level${i}`)[0];
            if (se && le && se.selectedIndex >= 0) {
                skills.push({
                    skill: se.options[se.selectedIndex].text,
                    level: le.options[le.selectedIndex] ? le.options[le.selectedIndex].text : ''
                });
            }
        }
        
        /* Хэлний чадвар */
        const langDefs = [
            { name: 'Монгол', prefix: 'mongol'  },
            { name: 'Англи',  prefix: 'english' },
            { name: 'Орос',   prefix: 'oros'    },
            { name: 'Хятад',  prefix: 'khyatad' }
        ];
        const langs = langDefs.map(function (l) {
            return {
                name:  l.name,
                read:  getSelText(`${l.prefix}_unshih`),
                speak: getSelText(`${l.prefix}_yarih`),
                write: getSelText(`${l.prefix}_bichih`)
            };
        });

        /* Хобби */
        const hobbies = [];
        const hobbyEls = document.getElementsByName("hobby");
        for(let h of hobbyEls){
            if(h.checked){
                hobbies.push(HOBBY_MAP[h.value] || h.value);
            }
        }

        /* Авъяас */
        const talents = [];
        const talentEls = document.getElementsByName("talent");

        for(let t of talentEls){
            if(t.checked){
                talents.push(TALENT_MAP[t.value] || t.value);
            }
        }

        /* Шагнал */
        const awards = [];
        for (let i = 1; i <= 4; i++) {
            const t = getVal(`award_type${i}`);
            const a = getVal(`award${i}`);
            if (t && a) awards.push({ type: t, award: a });
        }
        
        /* Хичээл сонголт 1 & 2 */
        const courses1 = getSelectedCourses();
        const courses2 = getTable2Data();
        
        /* Хуваарь */
        const schedule = buildScheduleGrid(courses2);
        
        return {
            studentCode, urgiinOvog, ovog, ner, nas, birthday, phone, email,
            facebook, address, salbar, course, gender, edus,
            sadan1Type, sadan1Name, sadan2Type, sadan2Name,
            skills, langs, hobbies, talents, awards, courses1, courses2, schedule
        };
    }

    /* 6. ХИЧЭЭЛ СОНГОЛТ №2 УТГУУДЫГ УНШИХ */
    function getTable2Data() {
        const data = [];
        for (let i = 1; i < table2.rows.length; i++) {
            const row = table2.rows[i];
            if (row.cells.length < 5) continue;
            const tSel = row.cells[2].querySelector('select');
            const lSel = row.cells[3].querySelector('select');
            const bSel = row.cells[4].querySelector('select');
            data.push({
                num:      i,
                codeName: row.cells[1].textContent.trim(),
                teacher:  tSel && tSel.selectedIndex >= 0 ? tSel.options[tSel.selectedIndex].text : '',
                lec:      lSel ? lSel.value : '',
                lab:      bSel ? bSel.value : ''
            });
        }
        return data;
    }

    /* 5. ХИЧЭЭЛИЙН ХУВААРЬ ҮҮСГЭХ */
    function parseSlot(slotVal) {
        const m = (slotVal || '').match(/^(\d+)-(\d+)/);
        if (!m) return null;
        return { day: parseInt(m[1], 10) - 1, period: parseInt(m[2], 10) - 1 };
    }

    function buildScheduleGrid(courses2) {
        /* grid[period][day] = хичээлийн нэр */
        const grid = [];
        for (let p = 0; p < PERIODS; p++) {
            grid.push(new Array(5).fill(''));
        }
        
        courses2.forEach(function (c) {
          /* Кодыг хасаж зөвхөн нэрийг авах */
            const fullName = c.codeName;
            const namePart = fullName.replace(/^[A-Z]+\.[A-Z]+\d+\s*/, '').trim() || fullName;

            function place(slot, suffix) {
                const pos = parseSlot(slot);
                if (!pos) return;
                if (pos.day < 0 || pos.day >= 5 || pos.period < 0 || pos.period >= PERIODS) return;
                const label = namePart + (suffix ? suffix : '');
                if (!grid[pos.period][pos.day]) {
                    grid[pos.period][pos.day] = label;
                } else if (grid[pos.period][pos.day] !== label) {
                    grid[pos.period][pos.day] += ' / ' + label;
                }
            }
            
            place(c.lec, '');
            place(c.lab, c.lec === c.lab ? '' : '');  // лаб адрес өөр байвал мөн харуулна
        });
        
        return grid;
    }

    /* CV HTML БИЧИХ ба ХАРУУЛАХ */
    function generateAndShowCV() {
        const data = collectFormData();
        const html = buildCVHTML(data);

        let container = document.getElementById('cv_result');

        if (!container) {
            container = document.createElement('div');
            container.id = 'cv_result';
            container.style.marginTop = '30px';
            document.body.appendChild(container);
        }

        container.innerHTML = html;
        
        container.scrollIntoView({ behavior: 'smooth' });
    }

    function rowspan(arr) { return Math.max(arr.length, 1); }

    function firstAndRest(arr, label, firstCellsFn, restRowFn) {
        if (arr.length === 0) {
            return '<tr><td align="center" rowspan="1"><b>' + label + '</b></td><td colspan="2">—</td></tr>';
        }
        return (
            '<tr><td align="center" rowspan="' + arr.length + '"><b>' + label + '</b></td>' +
            firstCellsFn(arr[0]) + '</tr>' +
            arr.slice(1).map(function (item) { return '<tr>' + restRowFn(item) + '</tr>'; }).join('')
        );
    }

    function buildCVHTML(d) {
        const totalCredits = d.courses1.reduce(function (s, c) {
            return s + (parseInt(c.credit, 10) || 0);
        }, 0);

      /* ── Боловсрол ── */
        const eduSection = firstAndRest(
            d.edus, 'Боловсрол:',
            function (e) { return '<td colspan="2">- ' + escHtml(e) + '</td>'; },
            function (e) { return '<td colspan="2">- ' + escHtml(e) + '</td>'; }
        );

      /* ── Ур чадвар ── */
        const skillSection = firstAndRest(
            d.skills, 'Ур чадвар:',
            function (s) { return '<td>' + escHtml(s.skill) + '</td><td>' + escHtml(s.level) + '</td>'; },
            function (s) { return '<td>' + escHtml(s.skill) + '</td><td>' + escHtml(s.level) + '</td>'; }
        );

      /* ── Хэлний чадвар ── */
        const langSection = firstAndRest(
            d.langs, 'Хэлний чадвар:',
            function (l) {
                return '<td>' + escHtml(l.name) + '</td><td>' +
                'Унших-' + escHtml(l.read) + ', ярих-' + escHtml(l.speak) +
                ', бичих-' + escHtml(l.write) + '</td>';
            },
            function (l) {
                return '<td>' + escHtml(l.name) + '</td><td>' +
                'Унших-' + escHtml(l.read) + ', ярих-' + escHtml(l.speak) +
                ', бичих-' + escHtml(l.write) + '</td>';
            }
        );

      /* ── Хобби ── */
        const hobbySection = firstAndRest(
            d.hobbies, 'Хобби:',
            function (h) { return '<td colspan="2">' + escHtml(h) + '</td>'; },
            function (h) { return '<td colspan="2">' + escHtml(h) + '</td>'; }
        );

        /* ── Авъяас ── */
        const talentSection = firstAndRest(
            d.talents, 'Авъяас, чадвар:',
            function (t) { return '<td colspan="2">' + escHtml(t) + '</td>'; },
            function (t) { return '<td colspan="2">' + escHtml(t) + '</td>'; }
        );

        /* ── Шагнал ── */
        const awardSection = firstAndRest(
            d.awards, 'Шагнал урамшуулал:',
            function (a) { return '<td>' + escHtml(a.type) + '</td><td>' + escHtml(a.award) + '</td>'; },
            function (a) { return '<td>' + escHtml(a.type) + '</td><td>' + escHtml(a.award) + '</td>'; }
        );

        /* ── Хичээл №1 мөрүүд ── */
        const course1Rows = d.courses1.map(function (c) {
            return '<tr><td>' + escHtml(c.num) + '</td><td>' + escHtml(c.code) +
            '</td><td>' + escHtml(c.name) + '</td><td>' + escHtml(c.credit) +
            '</td><td>' + escHtml(c.method) + '</td></tr>';
        }).join('');

        /* ── Хичээл №2 мөрүүд ── */
        const course2Rows = d.courses2.map(function (c) {
            return '<tr><td>' + c.num + '</td><td>' + escHtml(c.codeName) +
            '</td><td>' + escHtml(c.teacher) + '</td><td>' +
            escHtml(c.lec.replace('_', ' ')) + '</td><td>' +
            escHtml(c.lab.replace('_', ' ')) + '</td></tr>';
        }).join('');

        /* ── Хуваарийн мөрүүд ── */
        const scheduleRows = d.schedule.map(function (row, pi) {
            return '<tr><td align="center"><b>' + (pi + 1) + '-р пар</b></td>' +
            row.map(function (cell) {
                return '<td align="center">' + (cell ? escHtml(cell) : '=') + '</td>';
            }).join('') + '</tr>';
        }).join('');

        return `
        <h3>Миний танилцуулга</h3>
        <hr>
        <table border="1" width="100%">
        <tr>
            <td rowspan="11" align="center" width="200">
            <img src="profile.jpg" width="200" alt="Profile image"
                    onerror="this.outerHTML='<div style=&quot;width:200px;height:220px;background:#eee;display:flex;align-items:center;justify-content:center;color:#999&quot;>Зураг байхгүй</div>'">
            </td>
            <td><b>Оюутны код:</b></td><td>${escHtml(d.studentCode)}</td>
        </tr>
        <tr><td><b>Салбар:</b></td><td>${escHtml(d.salbar)}</td></tr>
        <tr><td><b>Хөтөлбөр:</b></td><td>${escHtml(d.course)}</td></tr>
        <tr><td><b>Ургийн овог:</b></td><td>${escHtml(d.urgiinOvog)}</td></tr>
        <tr><td><b>Овог:</b></td><td>${escHtml(d.ovog)}</td></tr>
        <tr><td><b>Нэр:</b></td><td>${escHtml(d.ner)}</td></tr>
        <tr><td><b>Нас:</b></td><td>${escHtml(d.nas)}</td></tr>
        <tr><td><b>Хүйс:</b></td><td>${escHtml(d.gender)}</td></tr>
        <tr><td><b>Утас:</b></td><td>${escHtml(d.phone)}</td></tr>
        <tr><td><b>Email:</b></td><td><u>${escHtml(d.email)}</u></td></tr>
        <tr>
            <td><b>Facebook хаяг:</b></td>
            <td><a href="${escHtml(d.facebook)}">${escHtml(d.facebook)}</a></td>
        </tr>
        <tr>
            <td align="center"><b>Гэрийн хаяг:</b></td>
            <td colspan="2">${escHtml(d.address)}</td>
        </tr>
        <tr>
            <td colspan="3" align="center"><b>Нэмэлт мэдээлэл</b></td>
        </tr>
        ${eduSection}
        <tr>
            <td rowspan="2" align="center"><b>Садан төрлийн байдал:</b></td>
            <td>- ${escHtml(d.sadan1Type)}</td><td>${escHtml(d.sadan1Name)}</td>
        </tr>
        <tr>
            <td>- ${escHtml(d.sadan2Type)}</td><td>${escHtml(d.sadan2Name)}</td>
        </tr>
        ${skillSection}
        ${langSection}
        ${hobbySection}
        ${talentSection}
        ${awardSection}
        </table>

        <h3>2025-2026 оны 2-р улирал. Хичээл сонголт №1</h3>
        <hr>
        <table border="1" width="100%" cellspacing="10">
        <tr>
            <td align="center"><b>№</b></td>
            <td align="center"><b>Хичээлийн код</b></td>
            <td align="center"><b>Хичээлийн нэр</b></td>
            <td align="center"><b>Кредит</b></td>
            <td align="center"><b>Орох хэлбэр</b></td>
        </tr>
        ${course1Rows}
        </table>
        <table border="0">
        <tr><td><b>Нийт:</b></td><td>${totalCredits} Кредит</td></tr>
        </table>

        <h3>2025-2026 оны 2-р улирал. Хичээл сонголт №2</h3>
        <hr>
        <table border="1" width="100%">
        <tr>
            <td align="center"><b>№</b></td>
            <td align="center"><b>Хичээлийн код, нэр</b></td>
            <td align="center"><b>Багш</b></td>
            <td align="center"><b>Лекц</b></td>
            <td align="center"><b>Лаб/Сем</b></td>
        </tr>
        ${course2Rows}
        </table>

        <h3>2025-2026 оны 2-р улирал. Хичээлийн хуваарь</h3>
        <hr>
        <table border="1" width="100%" cellpadding="10">
        <tr>
            <td align="center"><b>Гариг/Пар</b></td>
            ${DAYS.map(function (day) { return '<td align="center"><b>' + day + '</b></td>'; }).join('')}
        </tr>
        ${scheduleRows}
        </table>`;
    }

    /* ТУСЛАХ ФУНКЦҮҮД */
    function escHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g,  '&amp;')
            .replace(/</g,  '&lt;')
            .replace(/>/g,  '&gt;')
            .replace(/"/g,  '&quot;')
            .replace(/'/g,  '&#39;');
    }

    function showAlert(msg, isInfo) {
        const div = document.createElement('div');
        div.textContent = msg;
        div.style.cssText =
            'position:fixed;top:20px;right:20px;z-index:9999;padding:12px 20px;' +
            'border-radius:8px;font-size:14px;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,.2);' +
            'background:' + (isInfo ? '#d4edda' : '#f8d7da') + ';' +
            'color:'       + (isInfo ? '#155724' : '#721c24') + ';' +
            'border:1px solid ' + (isInfo ? '#c3e6cb' : '#f5c6cb') + ';';
        document.body.appendChild(div);
        setTimeout(function () {
            if (div.parentNode) div.parentNode.removeChild(div);
        }, 2500);
    }
})();