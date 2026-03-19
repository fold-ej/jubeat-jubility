// ===================================================================
// jubeat Jubility Visualizer v1.2
//
// Usage: Copy & paste this entire script into the browser console
// while on any e-amusement jubeat page (must be logged in)
// e.g. play data top, 악곡데이터, etc.
//
// Output: Downloads a PNG image with jubility visualization
// Expected time: 2~4 minutes (fetches ~1000+ detail pages)
//
// COMMON_MIDS is embedded directly. Songs not in COMMON_MIDS = PICKUP.
// When new pickup songs are added, they are automatically classified
// as PICKUP (since they won't be in COMMON_MIDS).
// ===================================================================

(async () => {
  'use strict';

  // ===== DOMAIN CHECK =====
  if (!location.hostname.includes('eagate.573.jp')) {
    console.error('[Jubility] e-amusement 사이트(eagate.573.jp)에서 실행해주세요.');
    return;
  }

  // ===== COMMON SONGS (all seasons before "beyond the Ave.") =====
  // Songs NOT in this set are classified as PICKUP.
  const COMMON_MIDS = new Set([
    "10145048","10147544","10177039","10220164","10343674","10371252",
    "10429194","10456845","10457480","10476503","10564761","10784296",
    "10789174","11075477","11076676","11135257","11388842","11455076",
    "11557003","11560500","11563994","11710721","11893148","11908453",
    "11927571","12336666","12348190","12493693","12554284","12686883",
    "12723652","12760488","12855861","12918355","12977082","13004126",
    "13047998","13093017","13095404","13239494","13314533","13364904",
    "13396844","13414719","13458909","13590120","13606353","13606746",
    "13641724","13652907","13666670","13711302","13748345","13843993",
    "13908684","13978373","14027221","14066836","14196838","14431976",
    "14837596","14941164","14981562","15061079","15097558","15256365",
    "15297115","15485575","15549172","15641340","15743094","15809599",
    "15839132","16027868","16198822","16308284","16485380","16580492",
    "16679442","16786845","16842684","16885730","17044725","17067770",
    "17117809","17181753","17308557","17344438","17414416","17449812",
    "17475068","17479636","17619739","17635140","17765003","17799550",
    "17821805","17857627","17882229","17939306","18041879","18176474",
    "18283302","18346724","18513582","18613108","18665252","18798856",
    "18819140","19008373","19284003","19301407","19334013","19372761",
    "19415244","19600729","19793220","19803389","19907858","19924203",
    "19943085","19993311","20087317","20091598","20181683","20356991",
    "20384360","20484580","20515722","20561396","20618281","20657624",
    "20847279","20982563","20994573","21033662","21165222","21184698",
    "21767447","21823050","21911919","21912238","21915571","22030496",
    "22216208","22243595","22248883","22260840","22318351","22401731",
    "22431808","22601746","22751207","22827894","22855698","23163274",
    "23448053","23459302","23747497","23751776","23886896","23966420",
    "24078335","24081249","24104712","24588368","24648889","24651896",
    "24729875","24758171","24760451","24925584","24940201","24987037",
    "25337835","25374290","25506943","25574425","25675641","25701288",
    "25707124","25803878","25821002","25822016","25844357","25866791",
    "25876574","25924717","26243783","26252561","26343607","26379539",
    "26497600","26550719","26689902","26850810","26866892","27196307",
    "27213864","27250167","27250986","27257536","27488736","27715455",
    "28052737","28165755","28274298","28308820","28495190","28527155",
    "28617874","28874482","29119352","29143489","29314677","29506311",
    "29523504","29529825","29574688","29587963","29648144","30027672",
    "30074101","30154924","30233181","30275084","30367909","30535746",
    "30628592","30631427","30870430","31067644","31435322","31462334",
    "31484584","31625765","31676747","31684764","31719195","31720718",
    "31784098","31856112","31864666","31952814","31974041","32090076",
    "32209228","32219255","32356338","32493613","32501912","32509817",
    "32561331","32623578","32715498","32734305","32939729","33033104",
    "33152193","33264982","33392320","33451015","33477488","33567796",
    "33822419","34098416","34133411","34167650","34227316","34292876",
    "34544668","34595498","34647818","34654093","34708238","34850727",
    "34910154","34933648","34981760","35005001","35018326","35151371",
    "35158730","35182739","35261432","35364065","35367035","35406017",
    "35523478","35576894","35584339","35588499","35621878","35636161",
    "35678669","35725097","35802983","35816923","36134574","36205289",
    "36243753","36246817","36280106","36436376","36477210","36656267",
    "36662014","36970706","37022684","37027741","37035492","37042292",
    "37075687","37086663","37236895","37250399","37267395","37280801",
    "37425143","37476669","37695090","37762673","37935774","38150846",
    "38233349","38381201","38431062","38492405","38497493","38542207",
    "38556629","38632734","38651794","38690018","38724730","38825397",
    "38917405","38923868","38991890","39020806","39034414","39229859",
    "39305949","39315916","39345258","39428414","39550231","39593911",
    "39623216","39693677","39733566","39782356","39803749","39871176",
    "39926566","39941068","40049693","40076790","40088443","40341027",
    "40457306","40535394","40537881","40624191","40639158","40719358",
    "40895507","41034568","41074859","41082796","41125010","41154864",
    "41292502","41337012","41496555","41664082","41668903","41809573",
    "41933957","42079632","42134193","42747309","42911287","42944351",
    "43035116","43064647","43099933","43148807","43167072","43194464",
    "43368719","43591137","43629783","43751257","43796075","44035849",
    "44077659","44099530","44114910","44237248","44317258","44353410",
    "44526843","44549278","44587429","44669955","44709658","44711214",
    "44776712","44910700","45039880","45078883","45157594","45161618",
    "45287832","45295020","45352508","45475114","45588034","45604864",
    "45641891","45651922","45736087","45828280","46063791","46302853",
    "46356259","46359738","46492530","46541821","46576344","46791423",
    "46909617","47137132","47209408","47211790","47536415","47748099",
    "47749853","47790925","47945401","47951489","47970281","47975509",
    "48356022","48373212","48562361","48661512","48676349","48731315",
    "48745291","48806387","48838105","48868599","48992638","49452570",
    "49592885","49645821","49710111","49736118","49749557","49806690",
    "50128676","50270733","50452026","50474670","50561040","50594127",
    "50702539","50721491","50794802","50850218","50978940","51162734",
    "51351168","51581262","51647087","51665960","51831679","51896993",
    "51938445","52058898","52100153","52294157","52440323","52592044",
    "52833291","52904405","52961560","53209946","53221622","53647696",
    "53649099","53678450","53743550","53807004","53914150","53923081",
    "53924712","53983513","54125352","54248724","54262795","54355142",
    "54430198","54558861","54593628","54598508","54647513","54681325",
    "54805034","54809241","54812767","54941286","54963313","54970003",
    "55017076","55317640","55330887","55377023","55398915","55443288",
    "55579982","55663424","56048043","56141250","56219942","56296380",
    "56377933","56480878","56688980","56793934","56857429","56878148",
    "57012516","57050586","57051826","57325800","57336008","57338079",
    "57643043","57874429","57915638","58073193","58167529","58172715",
    "58189606","58218011","58312555","58323521","58481108","58491653",
    "58744251","58833238","58883521","58919478","59057028","59060891",
    "59122490","59220571","59286717","59370343","59390357","59423157",
    "59690248","59853258","59861282","59871483","60078991","60101599",
    "60164837","60289888","60312935","60324251","60703963","60707650",
    "60872273","61211006","61314544","61337590","61367554","61393387",
    "61440275","61487355","61558172","61969779","61974785","62190277",
    "62233223","62369331","62460393","62533519","62642565","62687114",
    "62767087","62793962","62825556","63186908","63211304","63316740",
    "63344250","63368286","63391627","63451368","63527834","63528953",
    "63578142","63734374","63763250","63880350","63888566","64008785",
    "64027231","64106986","64137901","64509859","64536306","64577879",
    "64604535","64728317","64856451","64944942","65014035","65037187",
    "65055123","65165304","65192665","65441471","65513899","65599283",
    "65664704","65752303","65755877","65788635","65836580","65995720",
    "66115906","66169084","66219795","66421287","66657141","66752395",
    "66802771","66816079","66939121","67124580","67167088","67278058",
    "67308265","67329745","67351634","67368476","67425463","67446138",
    "67462485","67469002","67530945","67531941","67690440","67780562",
    "67864424","68139959","68218329","68243764","68487003","68500959",
    "68510627","68513124","68582517","68609081","68627220","69039415",
    "69175252","69177930","69247548","69362036","69379076","69449996",
    "69487953","69544682","69740316","69749389","69956690","70239270",
    "70296722","70401948","70563135","70584390","70807912","70830611",
    "70886411","71192914","71231163","71344918","71381078","71416315",
    "71447285","71506609","71531011","71533198","71588407","71640525",
    "71833278","72070515","72286665","72290118","72448599","72528887",
    "72577666","72583550","72682535","72738050","72753217","72765009",
    "72866871","73069520","73154085","73297875","73327266","73672309",
    "73689061","73759698","73804258","73891308","73897193","73919507",
    "74063601","74282345","74606879","74744457","75056687","75201890",
    "75487328","75525569","75640546","75708486","75722936","75728040",
    "75837790","75884089","75958326","75968603","76012381","76353598",
    "76426911","76605801","76663724","76745469","76858116","76884449",
    "76938721","77012234","77121509","77145984","77278486","77334153",
    "77625020","77625079","77650819","77702017","77815447","77857711",
    "77858176","77956060","77971855","78275717","78361624","78428018",
    "78481410","78531127","78661804","78766102","78840300","78924174",
    "79016920","79082548","79107094","79289857","79300495","79443709",
    "79449781","79507088","79508629","79570740","79662312","79824362",
    "79896257","80014809","80068784","80112112","80299225","80303856",
    "80304845","80331613","80401748","80752815","80768363","80839408",
    "80861996","80909498","81084086","81119663","81147879","81173950",
    "81201841","81355986","81370968","81419473","81466028","81490397",
    "81681558","81833461","81841520","81901778","82021120","82027807",
    "82056867","82145887","82355452","82530763","82667668","82961126",
    "83041866","83063282","83114360","83121235","83121687","83135244",
    "83155318","83205131","83210360","83270007","83313368","83499276",
    "83552878","83725258","83821360","83877156","84059908","84157981",
    "84254998","84493602","84532508","84842043","84931910","85005886",
    "85205721","85389376","85522159","85542558","85563063","85645485",
    "85686812","85881583","85978964","86017151","86019607","86120863",
    "86168797","86221988","86351682","86455991","86466692","86474836",
    "86560381","86606942","86693326","86772956","86891582","86944748",
    "87207439","87226936","87247277","87641973","87838909","87851128",
    "87879796","87969050","87973675","88056675","88151052","88206606",
    "88336511","88392995","88606203","88628546","88641784","88644151",
    "88751340","88782471","88787965","88963399","89148169","89165674",
    "89171766","89207084","89219253","89241638","89331867","89482901",
    "89633908","89731744","89950113","90149613","90760688","90816879",
    "90871924","91251021","91275682","91310934","91744188","91793867",
    "91888393","91890586","91925485","91982258","91997735","92031685",
    "92215787","92393527","92454141","92460795","92673621","92838263",
    "92987568","93008889","93025807","93047373","93053583","93247578",
    "93308516","93312790","93361888","93380763","93455464","93510320",
    "93624908","93652328","93678024","93796101","93836398","93872142",
    "93894207","93995688","94007069","94239920","94311831","94321479",
    "94556128","94771363","94912329","95110867","95128718","95162924",
    "95317321","95321203","95323646","95324011","95358154","95379463",
    "95402114","95425636","95455468","95571216","95633959","95729690",
    "95813126","95915185","96085235","96116681","96172488","96177028",
    "96209810","96312088","96323008","96391664","96407127","96437401",
    "96466843","96490588","96600315","96685646","96817913","96874613",
    "96896079","96942210","97015591","97386402","97423720","97759726",
    "98123279","98208746","98214422","98252495","98312654","98329407",
    "98466859","98515350","98768952","98808001","98971641","99440992",
    "99611365","99691018","99703872","99868652","99950175"
  ]);

  // ===== CONFIG =====
  const CONCURRENT = 5;
  const DELAY_MIN = 150;
  const DELAY_MAX = 250;
  const PICKUP_COUNT = 30;
  const COMMON_COUNT = 30;

  // ===== UTILITIES =====
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const randomDelay = () => sleep(DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN));

  async function fetchDoc(url) {
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) return null;
    const html = await res.text();
    return new DOMParser().parseFromString(html, 'text/html');
  }

  // ===== PROGRESS OVERLAY =====
  const overlay = document.createElement('div');
  overlay.id = 'jubility-overlay';
  overlay.innerHTML = `
    <div style="
      position:fixed; top:0; left:0; width:100%; height:100%;
      background:rgba(0,0,0,0.7); z-index:99999;
      display:flex; align-items:center; justify-content:center;
    ">
      <div style="
        background:#0d1b2a; border:2px solid #1e2a5a; border-radius:16px;
        padding:32px 40px; min-width:360px; max-width:480px;
        font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;
        color:#e0e0e0; box-shadow:0 8px 32px rgba(0,0,0,0.5);
      ">
        <div style="text-align:center; margin-bottom:20px;">
          <div style="color:#ffd700; font-size:22px; font-weight:bold;">JUBILITY</div>
          <div id="jub-step" style="color:#888; font-size:13px; margin-top:4px;">Initializing...</div>
        </div>
        <div style="
          background:#0a0a1f; border-radius:8px; height:24px;
          overflow:hidden; margin-bottom:12px;
        ">
          <div id="jub-bar" style="
            height:100%; width:0%; border-radius:8px;
            background:linear-gradient(90deg,#e94560,#ffd700);
            transition:width 0.3s ease;
          "></div>
        </div>
        <div id="jub-detail" style="color:#888; font-size:12px; text-align:center;">0%</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const stepEl = document.getElementById('jub-step');
  const barEl = document.getElementById('jub-bar');
  const detailEl = document.getElementById('jub-detail');

  function setProgress(pct, step, detail) {
    barEl.style.width = `${Math.min(pct, 100)}%`;
    if (step) stepEl.textContent = step;
    if (detail) detailEl.textContent = detail;
    else detailEl.textContent = `${Math.round(pct)}%`;
  }

  function removeOverlay() {
    overlay.remove();
  }

  function log(msg) {
    console.log(`[Jubility] ${msg}`);
  }

  // ===== PHASE 1: COLLECT SONG LIST FROM LIST PAGES =====
  function parseSongList(doc) {
    const table = doc.querySelector('table.music_data');
    if (!table) return { songs: [], maxPage: 0 };

    const rows = [...table.querySelectorAll('tbody tr')];
    const songs = rows
      .filter(tr => tr.querySelector('a.popup-link'))
      .map(tr => {
        const cells = [...tr.querySelectorAll('td')];
        const link = cells[0]?.querySelector('a.popup-link');
        const href = link?.getAttribute('href') || '';
        const mid = href.match(/mid=(\d+)/)?.[1];
        const name = cells[1]?.querySelector('a')?.textContent?.trim();
        const jacketImg = cells[0]?.querySelector('img');
        const jacket = jacketImg?.getAttribute('src');

        const scores = [];
        for (let i = 2; i < cells.length; i++) {
          const text = cells[i].textContent.trim();
          if (text !== '-' && /\d/.test(text)) {
            scores.push(parseInt(text.replace(/,/g, ''), 10));
          } else {
            scores.push(null);
          }
        }

        return { mid, name, jacket, scores };
      })
      .filter(s => s.mid);

    let maxPage = 1;
    const pageLinks = [...doc.querySelectorAll('a[href*="page="]')];
    for (const a of pageLinks) {
      const m = a.getAttribute('href')?.match(/page=(\d+)/);
      if (m) maxPage = Math.max(maxPage, parseInt(m[1]));
    }

    return { songs, maxPage };
  }

  async function collectAllSongs(basePath) {
    const allSongs = [];

    const firstDoc = await fetchDoc(basePath);
    if (!firstDoc) { log(`  Failed to fetch ${basePath}`); return allSongs; }

    const { songs: firstSongs, maxPage } = parseSongList(firstDoc);
    allSongs.push(...firstSongs);
    log(`  Page 1/${maxPage}: ${firstSongs.length} songs`);

    for (let page = 2; page <= maxPage; page++) {
      await randomDelay();
      const doc = await fetchDoc(`${basePath}?page=${page}`);
      if (!doc) continue;
      const { songs } = parseSongList(doc);
      if (songs.length === 0) break;
      allSongs.push(...songs);
      if (page % 5 === 0 || page === maxPage) {
        log(`  Page ${page}/${maxPage}: ${allSongs.length} songs total`);
      }
    }

    return allSongs;
  }

  // ===== PHASE 2: PARSE DETAIL PAGES =====
  function parseDetailPage(doc) {
    if (!doc) return [];
    const scoreDiv = doc.querySelector('#music_score');
    if (!scoreDiv) return [];

    const tables = scoreDiv.querySelectorAll(':scope > div > table');
    const results = [];

    for (const table of tables) {
      const firstRow = table.querySelector('tr:first-child');
      if (!firstRow) continue;

      // [FIX #1] Difficulty detection — match end of filename
      // Filenames: msc_dif_txt_00_0.png (BSC), _1.png (ADV), _2.png (EXT)
      const diffImg = firstRow.querySelector('th:first-child img');
      const diffSrc = diffImg?.getAttribute('src') || '';
      let diff = 'UNK';
      if (/_0\.\w+$/.test(diffSrc)) diff = 'BSC';
      else if (/_1\.\w+$/.test(diffSrc)) diff = 'ADV';
      else if (/_2\.\w+$/.test(diffSrc)) diff = 'EXT';

      // Level (e.g., "LEVEL:10.2")
      const levelTh = firstRow.querySelector('th:nth-child(2)');
      const levelMatch = levelTh?.textContent?.match(/LEVEL[:\s]*([\d.]+)/);
      const level = levelMatch ? parseFloat(levelMatch[1]) : null;

      // Music Rate (e.g., "98.4%" or "-%")
      let musicRate = null;
      for (const row of table.querySelectorAll('tr')) {
        const tds = row.querySelectorAll('td');
        if (tds.length >= 2 && tds[0].textContent.trim() === 'MUSIC RATE') {
          const rateText = tds[1].textContent.trim();
          if (rateText && rateText !== '-%') {
            musicRate = parseFloat(rateText.replace('%', ''));
          }
          break;
        }
      }

      if (level !== null) {
        results.push({ diff, level, musicRate });
      }
    }

    return results;
  }

  // ===== PHASE 3: JUBILITY CALCULATION =====
  // jubility = LEVEL x 12.5 x (MUSIC RATE / 99)
  // Truncated to 1 decimal place (소수점 둘째 자리 이하 버림)
  function calcJubility(level, musicRate) {
    return Math.floor(level * 12.5 * (musicRate / 99) * 10) / 10;
  }

  function getGrade(score) {
    if (score >= 1000000) return 'EXC';
    if (score >= 980000) return 'SSS';
    if (score >= 950000) return 'SS';
    if (score >= 900000) return 'S';
    if (score >= 850000) return 'A';
    if (score >= 800000) return 'B';
    if (score >= 700000) return 'C';
    if (score >= 500000) return 'D';
    return 'E';
  }

  function formatScore(score) {
    return score.toLocaleString();
  }

  // ===== PHASE 4: IMAGE GENERATION =====
  function loadImage(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function generateImage(pickupEntries, commonEntries, totalJub, pickupJub, commonJub) {
    const COLS = 6;
    const CELL_W = 140;
    const CELL_H = 220;
    const JACKET_SIZE = 82;
    const MARGIN = 20;
    const HEADER_H = 100;
    const SECTION_H = 42;
    const GAP = 15;

    const pickupRows = Math.ceil(Math.max(pickupEntries.length, 1) / COLS);
    const commonRows = Math.ceil(Math.max(commonEntries.length, 1) / COLS);

    const WIDTH = COLS * CELL_W + MARGIN * 2;
    const HEIGHT = HEADER_H + SECTION_H + pickupRows * CELL_H + GAP +
                   SECTION_H + commonRows * CELL_H + MARGIN + 10;

    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');

    // ---- Background ----
    const bgGrad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    bgGrad.addColorStop(0, '#0a0a1f');
    bgGrad.addColorStop(0.5, '#0d1b2a');
    bgGrad.addColorStop(1, '#0a0a1f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // ---- Header ----
    ctx.textAlign = 'center';

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 36px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('JUBILITY', WIDTH / 2, 38);

    ctx.font = 'bold 30px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(totalJub.toFixed(1), WIDTH / 2, 72);

    ctx.font = '13px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = '#888888';
    ctx.fillText(
      `PICKUP: ${pickupJub.toFixed(1)}  |  COMMON: ${commonJub.toFixed(1)}`,
      WIDTH / 2, 92
    );

    // ---- Helper: draw section header ----
    function drawSectionHeader(title, count, y, color) {
      ctx.fillStyle = color + '22';
      ctx.fillRect(MARGIN, y, WIDTH - MARGIN * 2, SECTION_H);
      ctx.fillStyle = color;
      ctx.fillRect(MARGIN, y, 4, SECTION_H);
      ctx.textAlign = 'left';
      ctx.font = 'bold 17px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
      ctx.fillStyle = color;
      ctx.fillText(`${title} (${count})`, MARGIN + 14, y + 27);
    }

    // ---- Helper: draw song entries ----
    function drawEntries(entries, startY) {
      const diffColors = {
        BSC: '#4caf50',
        ADV: '#ff9800',
        EXT: '#f44336',
        UNK: '#cccccc'
      };

      for (let i = 0; i < entries.length; i++) {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = MARGIN + col * CELL_W;
        const y = startY + row * CELL_H;
        const entry = entries[i];

        // Cell background
        const cx = x + 3, cy = y + 3, cw = CELL_W - 6, ch = CELL_H - 6;
        ctx.fillStyle = '#0f1535';
        ctx.fillRect(cx, cy, cw, ch);
        ctx.strokeStyle = '#1e2a5a';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx, cy, cw, ch);

        // Jacket image
        const jx = x + (CELL_W - JACKET_SIZE) / 2;
        const jy = y + 8;
        if (entry.jacketImg) {
          ctx.drawImage(entry.jacketImg, jx, jy, JACKET_SIZE, JACKET_SIZE);
        } else {
          ctx.fillStyle = '#1a1a3e';
          ctx.fillRect(jx, jy, JACKET_SIZE, JACKET_SIZE);
          ctx.fillStyle = '#333366';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('NO IMAGE', x + CELL_W / 2, jy + JACKET_SIZE / 2 + 4);
        }

        const centerX = x + CELL_W / 2;
        ctx.textAlign = 'center';

        // Song name
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '11px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
        let name = entry.name || '???';
        const maxNameW = CELL_W - 14;
        if (ctx.measureText(name).width > maxNameW) {
          while (ctx.measureText(name + '...').width > maxNameW && name.length > 1) {
            name = name.slice(0, -1);
          }
          name += '...';
        }
        ctx.fillText(name, centerX, jy + JACKET_SIZE + 16);

        // Difficulty + Level
        ctx.fillStyle = diffColors[entry.diff] || '#cccccc';
        ctx.font = 'bold 12px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(`${entry.diff} Lv${entry.level}`, centerX, jy + JACKET_SIZE + 32);

        // Score + Grade
        const gradeColors = {
          EXC: '#ffd700', SSS: '#ff4081', SS: '#ff9800', S: '#ffeb3b',
          A: '#4caf50', B: '#2196f3', C: '#03a9f4', D: '#9e9e9e', E: '#616161'
        };
        if (entry.score !== null) {
          const gradeColor = gradeColors[entry.grade] || '#cccccc';
          ctx.fillStyle = gradeColor;
          ctx.font = 'bold 11px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
          ctx.fillText(`${entry.grade} ${formatScore(entry.score)}`, centerX, jy + JACKET_SIZE + 47);
        }

        // Music Rate + Hard mode indicator
        const modeLabel = entry.isHard ? 'H' : 'N';
        const modeColor = entry.isHard ? '#ff6b6b' : '#8bc34a';
        const rateText = `${modeLabel} ${entry.musicRate.toFixed(1)}%`;
        ctx.fillStyle = modeColor;
        ctx.font = '11px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(rateText, centerX, jy + JACKET_SIZE + 62);

        // Jubility value
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 15px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(entry.jubility.toFixed(1), centerX, jy + JACKET_SIZE + 82);
      }
    }

    // ---- Load jacket images ----
    log('Loading jacket images...');
    const allEntries = [...pickupEntries, ...commonEntries];
    const uniqueJackets = [...new Set(allEntries.map(e => e.jacket).filter(Boolean))];
    const jacketMap = new Map();

    for (let i = 0; i < uniqueJackets.length; i += 10) {
      const batch = uniqueJackets.slice(i, i + 10);
      const imgs = await Promise.all(batch.map(src => loadImage(src)));
      batch.forEach((src, j) => jacketMap.set(src, imgs[j]));
    }

    allEntries.forEach(e => { e.jacketImg = jacketMap.get(e.jacket) || null; });

    // ---- Draw sections ----
    let y = HEADER_H;

    drawSectionHeader('PICKUP', pickupEntries.length, y, '#e94560');
    y += SECTION_H;
    drawEntries(pickupEntries, y);
    y += pickupRows * CELL_H + GAP;

    drawSectionHeader('COMMON', commonEntries.length, y, '#4e9ae9');
    y += SECTION_H;
    drawEntries(commonEntries, y);

    // ---- Download ----
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `jubility_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      log('Image downloaded!');
    } catch (e) {
      log('Canvas export failed (CORS issue). Showing in new tab instead...');
      const w = window.open('');
      w.document.write(`<img src="${canvas.toDataURL()}">`);
    }
  }

  // ===== MAIN EXECUTION =====
  try {
    const startTime = Date.now();
    log('=== jubeat Jubility Visualizer v1.2 ===');
    setProgress(0, 'Step 1/6: Collecting songs (normal mode)...');

    // ---- Step 1: Collect songs from normal mode list ----
    log('[1/6] Collecting songs (normal mode)...');
    const normalSongs = await collectAllSongs(
      '/game/jubeat/beyond/playdata/music.html'
    );
    log(`  Normal mode total: ${normalSongs.length} songs`);
    setProgress(8, 'Step 2/6: Collecting songs (hard mode)...');

    // ---- Step 2: Collect songs from hard mode list ----
    log('[2/6] Collecting songs (hard mode)...');
    const hardSongs = await collectAllSongs(
      '/game/jubeat/beyond/playdata/music_hard.html'
    );
    log(`  Hard mode total: ${hardSongs.length} songs`);
    setProgress(16, null, `Normal: ${normalSongs.length}, Hard: ${hardSongs.length}`);

    // ---- Build unified song map ----
    const songMap = new Map();

    // scores[0]=BSC, scores[1]=ADV, scores[2]=EXT
    const DIFF_KEYS = ['BSC', 'ADV', 'EXT'];

    for (const s of normalSongs) {
      const normalScores = {};
      DIFF_KEYS.forEach((k, i) => { normalScores[k] = s.scores[i] ?? null; });
      songMap.set(s.mid, {
        mid: s.mid,
        name: s.name,
        jacket: s.jacket,
        hasNormalScore: s.scores.some(v => v !== null),
        hasHardScore: false,
        normalScores,
        hardScores: {}
      });
    }

    for (const s of hardSongs) {
      const hardScores = {};
      DIFF_KEYS.forEach((k, i) => { hardScores[k] = s.scores[i] ?? null; });
      const existing = songMap.get(s.mid);
      if (existing) {
        existing.hasHardScore = s.scores.some(v => v !== null);
        existing.hardScores = hardScores;
        if (!existing.jacket && s.jacket) existing.jacket = s.jacket;
      } else {
        songMap.set(s.mid, {
          mid: s.mid,
          name: s.name,
          jacket: s.jacket,
          hasNormalScore: false,
          hasHardScore: s.scores.some(v => v !== null),
          normalScores: {},
          hardScores
        });
      }
    }

    const songsWithScores = [...songMap.values()].filter(
      s => s.hasNormalScore || s.hasHardScore
    );
    log(`  Songs with at least one score: ${songsWithScores.length}`);

    // ---- Step 3: Fetch normal mode detail pages ----
    setProgress(16, 'Step 3/6: Fetching normal details...');
    log('[3/6] Fetching normal mode details...');
    const normalMids = songsWithScores
      .filter(s => s.hasNormalScore)
      .map(s => s.mid);
    const normalDetails = new Map();

    for (let i = 0; i < normalMids.length; i += CONCURRENT) {
      const batch = normalMids.slice(i, i + CONCURRENT);
      const docs = await Promise.all(
        batch.map(mid =>
          fetchDoc(`/game/jubeat/beyond/playdata/music_detail.html?mid=${mid}`)
        )
      );
      batch.forEach((mid, j) => {
        normalDetails.set(mid, parseDetailPage(docs[j]));
      });
      const done = Math.min(i + CONCURRENT, normalMids.length);
      const pct = 16 + (done / normalMids.length) * 34;
      setProgress(pct, null, `Normal: ${done} / ${normalMids.length}`);
      if (done % 50 < CONCURRENT || done === normalMids.length) {
        log(`  Normal: ${done}/${normalMids.length}`);
      }
      if (i + CONCURRENT < normalMids.length) await randomDelay();
    }

    // ---- Step 4: Fetch hard mode detail pages ----
    setProgress(50, 'Step 4/6: Fetching hard details...');
    log('[4/6] Fetching hard mode details...');
    const hardMids = songsWithScores
      .filter(s => s.hasHardScore)
      .map(s => s.mid);
    const hardDetails = new Map();

    for (let i = 0; i < hardMids.length; i += CONCURRENT) {
      const batch = hardMids.slice(i, i + CONCURRENT);
      const docs = await Promise.all(
        batch.map(mid =>
          fetchDoc(`/game/jubeat/beyond/playdata/music_detail_hard.html?mid=${mid}`)
        )
      );
      batch.forEach((mid, j) => {
        hardDetails.set(mid, parseDetailPage(docs[j]));
      });
      const done = Math.min(i + CONCURRENT, hardMids.length);
      const pct = 50 + (done / hardMids.length) * 34;
      setProgress(pct, null, `Hard: ${done} / ${hardMids.length}`);
      if (done % 50 < CONCURRENT || done === hardMids.length) {
        log(`  Hard: ${done}/${hardMids.length}`);
      }
      if (i + CONCURRENT < hardMids.length) await randomDelay();
    }

    // ---- Step 5: Calculate jubility for all entries ----
    setProgress(84, 'Step 5/6: Calculating jubility...');
    log('[5/6] Calculating jubility...');
    const entries = [];

    for (const song of songsWithScores) {
      const nDiffs = normalDetails.get(song.mid) || [];
      const hDiffs = hardDetails.get(song.mid) || [];

      // Merge by difficulty: for each (song, diff), take the higher music rate
      const diffMap = new Map();

      for (const d of nDiffs) {
        diffMap.set(d.diff, {
          diff: d.diff,
          level: d.level,
          normalRate: d.musicRate
        });
      }

      for (const d of hDiffs) {
        const existing = diffMap.get(d.diff);
        if (existing) {
          existing.hardRate = d.musicRate;
        } else {
          diffMap.set(d.diff, {
            diff: d.diff,
            level: d.level,
            hardRate: d.musicRate
          });
        }
      }

      for (const [, data] of diffMap) {
        const normalRate = data.normalRate ?? 0;
        const hardRate = data.hardRate ?? 0;
        const bestRate = Math.max(normalRate, hardRate);
        const isHard = hardRate > normalRate && hardRate > 0;
        const score = isHard
          ? (song.hardScores[data.diff] ?? null)
          : (song.normalScores[data.diff] ?? null);

        if (bestRate > 0 && data.level) {
          entries.push({
            mid: song.mid,
            name: song.name,
            jacket: song.jacket,
            diff: data.diff,
            level: data.level,
            musicRate: bestRate,
            isHard,
            score,
            grade: score !== null ? getGrade(score) : null,
            jubility: calcJubility(data.level, bestRate),
            isPickup: !COMMON_MIDS.has(song.mid)
          });
        }
      }
    }

    log(`  Total jubility entries (with music rate): ${entries.length}`);

    // Sort and select top entries
    const pickupEntries = entries
      .filter(e => e.isPickup)
      .sort((a, b) => b.jubility - a.jubility)
      .slice(0, PICKUP_COUNT);

    const commonEntries = entries
      .filter(e => !e.isPickup)
      .sort((a, b) => b.jubility - a.jubility)
      .slice(0, COMMON_COUNT);

    const pickupJub = pickupEntries.reduce((sum, e) => sum + e.jubility, 0);
    const commonJub = commonEntries.reduce((sum, e) => sum + e.jubility, 0);
    const totalJub = pickupJub + commonJub;

    log(`  Pickup: ${pickupEntries.length} entries, total = ${pickupJub.toFixed(1)}`);
    log(`  Common: ${commonEntries.length} entries, total = ${commonJub.toFixed(1)}`);
    log(`  === TOTAL JUBILITY: ${totalJub.toFixed(1)} ===`);

    // ---- Debug: print top entries for verification ----
    log('--- PICKUP TOP 30 ---');
    pickupEntries.forEach((e, i) =>
      log(`  ${i + 1}. [mid:${e.mid}] ${e.name} (${e.diff} Lv${e.level}) jub=${e.jubility}`)
    );
    log('--- COMMON TOP 30 ---');
    commonEntries.forEach((e, i) =>
      log(`  ${i + 1}. [mid:${e.mid}] ${e.name} (${e.diff} Lv${e.level}) jub=${e.jubility}`)
    );

    // ---- Step 6: Generate image ----
    setProgress(90, 'Step 6/6: Generating image...');
    log('[6/6] Generating image...');
    await generateImage(pickupEntries, commonEntries, totalJub, pickupJub, commonJub);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    setProgress(100, 'Complete!', `JUBILITY: ${totalJub.toFixed(1)} (${elapsed}s)`);
    log(`=== Complete! (${elapsed}s) ===`);

    setTimeout(removeOverlay, 3000);

  } catch (error) {
    console.error('[Jubility] Fatal error:', error);
    removeOverlay();
  }
})();
