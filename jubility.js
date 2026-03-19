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
    "85542558","34933648","73327266","18283302","96209810","80752815",
    "67308265","35367035","24104712","18798856","17449812","11455076",
    "78531127","49749557","35406017","88151052","12336666","69177930",
    "10220164","78766102","38556629","39623216","54941286","88641784",
    "94321479","65752303","93678024","26550719","44353410","86221988",
    "21767447","80303856","54593628","81201841","99691018","29119352",
    "65192665","90760688","30535746","36656267","78924174","23751776",
    "48992638","82056867","17308557","28274298","35018326","40639158",
    "86455991","93247578","77145984","37086663","13314533","89950113",
    "87247277","51647087","22431808","31864666","63880350","40537881",
    "63888566","16027868","83135244","20087317","63186908","21912238",
    "58218011","73897193","70401948","38492405","35364065","23163274",
    "95162924","40049693","13748345","25822016","54598508","12977082",
    "26243783","43796075","35182739","67469002","10145048","77815447",
    "88336511","44587429","27257536","86891582","29143489","66802771",
    "45295020","80768363","25701288","71531011","35584339","88644151",
    "96172488","67864424","13396844","79508629","86466692","16842684",
    "39941068","53807004","45287832","34708238","73154085","49736118",
    "86560381","95813126","85645485","53983513","15809599","47536415",
    "18513582","35588499","88963399","80401748","60164837","25675641",
    "25803878","39803749","44317258","29529825","34227316","25876574",
    "54262795","61440275","17635140","75722936","37476669","20847279",
    "12760488","71833278","58323521","47945401","59871483","17475068",
    "93510320","42079632","62369331","33392320","53221622","76745469",
    "75708486","24081249","10789174","28308820","38431062","70807912",
    "67425463","83725258","41074859","28874482","40341027","89482901",
    "22855698","38690018","83270007","61393387","46791423","33152193",
    "34654093","15743094","96391664","26850810","65037187","72738050",
    "79824362","95324011","93836398","94311831","28617874","59057028",
    "96896079","19284003","43629783","57643043","62233223","66421287",
    "11135257","93308516","43751257","94239920","87969050","31676747",
    "50794802","43148807","78428018","13004126","79449781","12918355",
    "22030496","46576344","96490588","16580492","38923868","38724730",
    "32509817","57325800","29314677","83205131","10343674","75487328",
    "30275084","38917405","64008785","92987568","33451015","90871924",
    "13606746","16679442","35151371","32501912","91793867","61558172",
    "93361888","10429194","16308284","60078991","16885730","17882229",
    "19372761","60872273","44077659","46356259","30074101","91925485",
    "72682535","71344918","10371252","32219255","17479636","65664704",
    "62793962","59060891","65055123","87641973","42911287","31974041",
    "11893148","63451368","61367554","73891308","39428414","71588407",
    "57915638","66169084","43194464","48745291","35523478","20384360",
    "49645821","52100153","83499276","93624908","38150846","96312088",
    "28165755","77971855","46541821","69449996","89207084","34167650",
    "66752395","67780562","37027741","53914150","80861996","26497600",
    "44910700","75968603","41125010","87207439","38233349","38632734",
    "77625079","95571216","45588034","83041866","87879796","64728317",
    "19803389","83063282","58883521","79016920","36134574","31462334",
    "98214422","80304845","37022684","47749853","40624191","40088443",
    "87226936","96085235","77625020","43368719","36205289","68627220",
    "90149613","95321203","34098416","54681325","10177039","27196307",
    "37762673","82667668","35005001","81419473","61969779","68609081",
    "25821002","16485380","20484580","46359738","11076676","41809573",
    "67124580","59370343","86772956","98329407","54805034","53647696",
    "54809241","71447285","48868599","19907858","67329745","13908684",
    "93796101","58312555","91982258","85522159","25506943","61211006",
    "83821360","69039415","26866892","19334013","92031685","41933957",
    "64106986","84493602","37935774","93652328","77121509","68513124",
    "35621878","48661512","94771363","42747309","74282345","54355142",
    "77278486","86606942","19924203","75201890","81901778","59861282",
    "48356022","45157594","62767087","15097558","66816079","49592885",
    "54558861","79507088","93455464","72528887","37267395","34133411",
    "11075477","55663424","81355986","55017076","74063601","27213864",
    "13364904","40719358","76012381","30027672","19993311","47137132",
    "79662312","80331613","22601746","45604864","69544682","22243595",
    "10456845","93025807","81147879","30154924","79896257","22401731",
    "54248724","62533519","98208746","52592044","84254998","57338079",
    "39693677","13843993","59122490","30628592","54812767","31720718",
    "57012516","13666670","39020806","63391627","89241638","80014809",
    "76938721","78481410","88392995","65836580","31856112","63527834",
    "70584390","95317321","88782471","89219253","95633959","82145887",
    "13458909","13093017","20561396","52058898","84059908","65014035",
    "66115906","51162734","25574425","53678450","86019607","77702017",
    "99868652","39229859","93872142","96942210","82021120","13711302",
    "56296380","60703963","94912329","64604535","25707124","58491653",
    "95915185","98466859","44526843","41664082","72583550","64509859",
    "47211790","29523504","31952814","17181753","58744251","59853258",
    "48373212","93380763","10564761","12855861","17044725","69379076",
    "21911919","19008373","22827894","79082548","77650819","96685646",
    "64137901","38991890","26343607","84931910","20657624","69956690",
    "22260840","59423157","97386402","88206606","72070515","24729875",
    "56141250","70296722","92460795","64856451","31484584","54430198",
    "47970281","33567796","19793220","57051826","72866871","85389376",
    "93312790","15549172","36436376","32623578","11560500","89331867",
    "25866791","50702539","81841520","72290118","80299225","68510627",
    "63316740","75958326","41337012","56793934","95128718","50452026",
    "31719195","91744188","18346724","92393527","13047998","65165304",
    "83114360","70886411","37042292","28527155","47209408","43035116",
    "18665252","36970706","35576894","96407127","24760451","35158730",
    "21184698","85978964","84842043","72286665","45078883","96874613",
    "43591137","38497493","46492530","61314544","93047373","65599283",
    "31784098","52440323","38825397","17619739","40457306","44711214",
    "85881583","68487003","37695090","57050586","87973675","37236895",
    "98123279","78361624","56048043","29648144","51938445","93008889",
    "92454141","94556128","39345258","12348190","37075687","12554284",
    "76605801","73689061","68500959","59690248","91310934","91275682",
    "11557003","35802983","62825556","44237248","32493613","91997735",
    "64536306","84157981","23966420","84532508","93995688","37035492",
    "18613108","56857429","88628546","10784296","96437401","35636161",
    "76884449","14196838","54970003","80909498","41154864","83155318",
    "17939306","44669955","22751207","15641340","31625765","95729690",
    "47748099","45039880","50594127","39782356","34981760","24648889",
    "67368476","38542207","89731744","13590120","11563994","27250167",
    "69175252","63344250","10147544","27250986","58189606","35261432",
    "11388842","17344438","86474836","15256365","48806387","95402114",
    "86120863","55330887","62190277","60324251","87838909","67167088",
    "73069520","26689902","27488736","70563135","12686883","17765003",
    "72753217","40076790","63734374","71381078","48838105","22216208",
    "65755877","30233181","59390357","15061079","48731315","14941164",
    "50270733","73919507","36246817","21165222","90816879","47951489",
    "33033104","71416315","96323008","77956060","86944748","32209228",
    "45641891","88751340","61974785","13641724","58833238","72448599",
    "73804258","25374290","92215787","99440992","58167529","31067644",
    "34544668","67351634","75884089","96466843","11710721","77857711",
    "12493693","14027221","81833461","51831679","98808001","15839132",
    "51581262","72765009","85563063","77334153","76663724","48676349",
    "85205721","59220571","60289888","29574688","49806690","86351682",
    "46909617","41292502","24078335","53209946","39871176","13978373",
    "61487355","44776712","20618281","99950175","64027231","35678669",
    "37250399","68582517","95358154","25844357","19943085","14981562",
    "82355452","51351168","80839408","43099933","11927571","92838263",
    "23459302","45352508","23448053","62642565","42944351","25924717",
    "39034414","53743550","54963313","14066836","50474670","13606353",
    "88787965","97015591","26252561","24588368","48562361","71192914",
    "70239270","91251021","19415244","67690440","32090076","15485575",
    "95425636","12723652","83877156","32715498","85005886","34850727",
    "39550231","51665960","41082796","89633908","54647513","98252495",
    "62460393","80112112","44549278","41496555","17799550","81173950",
    "67530945","32734305","89165674","45475114","20356991","53924712",
    "36280106","66657141","62687114","81490397","93053583","17117809",
    "86017151","13652907","66219795","55579982","58481108","13239494",
    "63763250","65995720","86693326","83210360","79289857","65441471",
    "17821805","69487953","85686812","46063791","68243764","96817913",
    "47790925","83121687","98971641","20982563","94007069","89171766",
    "30631427","77858176","95455468","11908453","45828280","30870430",
    "73759698","50721491","60312935","83313368","65788635","69362036",
    "44114910","51896993","13095404","37280801","60101599","50850218",
    "67278058","38381201","95379463","53649099","13414719","20091598",
    "72577666","23886896","74744457","31435322","59286717","39315916",
    "56219942","52294157","88606203","49452570","91890586","49710111",
    "50128676","19600729","25337835","76353598","17414416","28495190",
    "86168797","29506311","58073193","16198822","34292876","78840300",
    "56377933","91888393","79443709","88056675","56480878","21033662",
    "39305949","26379539","21915571","69740316","33822419","64577879",
    "43167072","63368286","75640546","54125352","24925584","24758171",
    "69247548","81466028","52961560","24987037","83121235","30367909",
    "81370968","63528953","23747497","45651922","39733566","32939729",
    "34595498","95110867","58919478","19301407","40535394","80068784",
    "87851128","29587963","76858116","44709658","65513899","95323646",
    "14837596","63211304","22248883","43064647","61337590","40895507",
    "18819140","32356338","96177028","75728040","98515350","66939121",
    "45736087","74606879","39926566","56878148","83552878","47975509",
    "71506609","69749389","17857627","82530763","97759726","41668903",
    "81119663","52904405","67531941","68218329","75837790","56688980",
    "33477488","39593911","14431976","79107094","78661804","35816923",
    "58172715","99611365","81681558","44035849","71640525","79570740",
    "10476503","38651794","36243753","55443288","20181683","79300495",
    "21823050","37425143","68139959","96116681","28052737","52833291",
    "45161618","92673621","64944942","89148169","22318351","60707650",
    "73297875","76426911","75056687","41034568","34647818","35725097",
    "31684764","46302853","99703872","42134193","27715455","78275717",
    "53923081","81084086","57874429","36477210","17067770","67462485",
    "33264982","71231163","32561331","77012234","18041879","75525569",
    "70830611","18176474","98312654","71533198","82027807","73672309",
    "24940201","16786845","82961126","36662014","93894207","34910154",
    "24651896","15297115","55317640","63578142","55398915","97423720",
    "50978940","20515722","57336008","67446138","50561040",
    "10457480","98768952","96600315"
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
