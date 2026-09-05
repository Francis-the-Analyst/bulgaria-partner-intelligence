/*!
 * Bulgaria Partner Intelligence — shared application core.
 * Ported from the Uzbekistan 2.0 / Russia partner-intelligence apps.
 * Loaded by proposal_A.html AFTER data.js.
 * Contains: i18n dictionary (EN/BG/RU), state, filtering, scoring model,
 * positioning-map layout (collision avoidance), drawer builder, CSV export,
 * coverage / competitive computations. Visual language lives in the CSS
 * files, not here.
 */
(function (global) {
  'use strict';

  /* =========================================================
   * 1. CONFIG — values read from the actual data, not invented
   * ========================================================= */

  var RETAIL_TYPOLOGIES = ['Kitchen', 'Kitchen & Bath', 'Premium Materials Showroom', 'Interior Designer', 'Architecture Studio', 'Developer', 'Contractor', 'Hybrid'];
  var PROYECTOS_TYPOLOGIES = ['Developer', 'Architecture Studio', 'Contractor', 'Technical Specifier', 'Facade Installer', 'Flooring Installer', 'Interior Designer', 'Hybrid'];
  var CITIES = ['Sofia', 'Plovdiv', 'Varna', 'Burgas'];
  var PRICE_TIERS = ['Low', 'Medium', 'High', 'Not determinable'];
  var EXHIBITION_TIERS = ['Yes', 'No', 'Not determinable'];
  var SUBCHANNELS = ['Volume', 'Tourism'];
  var LANGS = ['en', 'bg', 'ru'];

  var MIN_DIST_DESKTOP = 24;
  var MIN_DIST_NARROW = 18;

  var NO_EVIDENCE_FREE_TEXT = ['', 'n/a', 'none', 'not specified', 'not specified by brand', 'not determinable'];

  var SERVICE_BREADTH = {
    'Design+Install+Supply': 1.0,
    'Design+Construction+Development': 0.9,
    'Manufacture+Supply': 0.9,
    'Design+Build': 0.85,
    'Design+Install': 0.7,
    'Supply only': 0.55,
    'Design only': 0.4,
    'Not determinable': 0.3,
    '': 0.3
  };

  var RETAIL_TYPOLOGY_FIT = {
    'Kitchen': 1.0,
    'Kitchen & Bath': 1.0,
    'Premium Materials Showroom': 0.95,
    'Architecture Studio': 0.75,
    'Developer': 0.7,
    'Contractor': 0.65,
    'Interior Designer': 0.7,
    'Hybrid': 0.8
  };
  var PROYECTOS_TYPOLOGY_FIT = {
    'Facade Installer': 1.0,
    'Technical Specifier': 0.95,
    'Flooring Installer': 0.9,
    'Developer': 0.85,
    'Architecture Studio': 0.8,
    'Contractor': 0.75,
    'Interior Designer': 0.6,
    'Hybrid': 0.8
  };

  var PRICE_SCORE_RETAIL = { 'High': 1.0, 'Medium': 0.85, 'Low': 0.45, 'Not determinable': 0.4 };

  /* =========================================================
   * 2. I18N DICTIONARY — single source, EN + BG + RU
   * ========================================================= */

  var I18N = {
    en: {
      cover_choose_channel: 'Choose an intelligence channel',
      cover_explore: 'Explore market →',
      cover_view: 'View channel →',
      internal_use: 'Commercial intelligence · Internal use',
      executive_intelligence: 'Executive intelligence · Internal decision support',
      hero_eyebrow: 'Market view · Commercial intelligence',
      hero_title: 'Where should the next conversation start?',
      hero_context: 'A working priority model for prospective partners, built from category fit, physical exposure, market evidence and price positioning.',
      filters_refine: 'Refine the market',
      filters_search_label: 'Search',
      map_key: 'Opportunity key',
      opportunity_field: 'Opportunity field',
      all_accounts: 'All accounts in view',
      first_conversations: 'First conversations',
      developments_title: 'Named project developments',
      dev_project: 'Project',
      dev_horizon: 'Commercial horizon',
      horizon_execution: 'In execution / sale',
      horizon_near: 'Near-term milestone',
      horizon_concept: 'Announced / concept',
      horizon_delivered: 'Delivered',
      brand_line_pre: 'Market research & dashboard created by',
      brand_author: 'Francisco González',
      cover_eyebrow: 'Cosentino · Bulgaria',
      cover_title: 'Bulgaria · Partner Intelligence',
      cover_message: 'From market visibility to the next partner conversation.',
      cover_enter_retail: 'Retail intelligence',
      cover_enter_proyectos: 'Projects intelligence',
      cover_stat_retail: 'Retail actors',
      cover_stat_proyectos: 'Projects actors',
      cover_stat_developments: 'Named developments',
      cover_stat_cities: 'Retail cities',
      cover_proposal_label: 'Design proposal',
      cover_proposal_a: 'A — Executive Intelligence',
      cover_open: 'Open',
      cover_brands_title: 'Cosentino surfaces',
      channels_label: 'Channels',
      back_to_cover: 'Back to cover',
      channel_retail: 'Retail',
      channel_proyectos: 'Projects',
      nav_map: 'Positioning map',
      nav_map_desc: 'Priority vs. positioning, no overlaps',
      nav_list: 'Account list',
      nav_list_desc: 'Full filtered table',
      nav_shortlist: 'Priority shortlist',
      nav_shortlist_desc: 'High / medium tier, why now',
      nav_coverage: 'Coverage',
      nav_coverage_desc: 'City × typology × exhibition',
      nav_competitive: 'Competitive landscape',
      nav_competitive_desc: 'Materials & brands mentioned',
      nav_developments: 'Project developments',
      nav_developments_desc: 'Named developments only — see coverage for the full projects channel',
      filters_title: 'Filters',
      filters_search: 'Search name, address, phone, email, brand, message…',
      filters_city: 'City',
      filters_typology: 'Typology',
      filters_priority: 'Priority',
      filters_price: 'Price range',
      filters_exhibition: 'Physical exhibition',
      filters_competitive: 'Competitive signal',
      filters_secondary: 'Secondary channel',
      filters_subchannel: 'Project type',
      filters_all: 'All',
      filters_reset: 'Reset',
      filters_open_mobile: 'Filters',
      filters_close_mobile: 'Done',
      priority_high: 'High',
      priority_medium: 'Medium',
      priority_low: 'Low',
      exhibition_yes: 'Confirmed',
      exhibition_no: 'Not confirmed',
      exhibition_nd: 'Not determinable',
      yes_label: 'Yes',
      no_label: 'No',
      subchannel_volume: 'Volume (>2,000 m²)',
      subchannel_tourism: 'Tourism resort',
      kpi_total: 'Total accounts',
      kpi_total_action: 'View all',
      kpi_priority: 'High priority',
      kpi_priority_action: 'Open shortlist',
      kpi_showroom: 'Confirmed showroom',
      kpi_showroom_action: 'Filter exhibition',
      kpi_cities: 'Cities covered',
      kpi_cities_action: 'Open coverage',
      results_count: 'accounts match current filters',
      table_name: 'Name',
      table_city: 'City',
      table_typology: 'Typology',
      table_price: 'Price',
      table_exhibition: 'Showroom',
      table_priority: 'Priority',
      table_action: 'Open',
      map_axis_y: 'Vertical axis: priority / fit score (0–100)',
      map_axis_x: 'Horizontal axis: price positioning, spread by service breadth within tier',
      map_note: 'Points are nudged slightly to avoid overlap; exact score shown on hover / selection.',
      map_empty: 'No accounts match the current filters.',
      shortlist_why: 'Why now',
      shortlist_next: 'Next action',
      shortlist_empty: 'No high or medium priority accounts match the current filters.',
      coverage_title: 'Coverage by city',
      coverage_typology: 'By typology',
      coverage_price: 'By price range',
      coverage_exhibition: 'By physical exhibition',
      competitive_title: 'Materials & brands mentioned',
      competitive_hint: 'Select a signal to filter matching accounts',
      competitive_empty: 'No competitive signal evidenced in current filters.',
      competitive_count: 'mentions',
      dev_status: 'Status',
      dev_developer: 'Developer',
      dev_location: 'Location',
      dev_scale: 'Scale',
      dev_delivery: 'Estimated delivery / horizon',
      dev_reading: 'Commercial timing read',
      dev_reading_body: 'Reading, not a confirmed fact — validate directly before committing resources.',
      drawer_title: 'Detail',
      drawer_close: 'Close',
      drawer_account_city: 'Account & city',
      drawer_typology_channel: 'Typology & channel',
      drawer_score: 'Score & priority',
      drawer_score_explain: 'About the model',
      drawer_exhibition: 'Physical exhibition',
      drawer_price: 'Price range & signal',
      drawer_service: 'Service scope',
      drawer_address: 'Address',
      drawer_contact: 'Contact',
      drawer_source: 'Web / source',
      drawer_competitive: 'Competitive signal',
      drawer_messages: 'Key messages',
      drawer_notes: 'Raw notes',
      drawer_provenance: 'Data provenance',
      drawer_recommendation: 'Commercial recommendation',
      drawer_secondary_channel: 'Also active in',
      verified_evidence: 'Verified evidence',
      commercial_recommendation: 'Commercial recommendation — validate with local team',
      not_evidenced: 'Not evidenced in current research',
      model_about_title: 'About the priority model',
      model_about_retail: 'Retail score (0–100): physical exhibition confirmed (25 pts), typology fit for Silestone/Sensa countertops (20), price positioning Medium/High favored over Low (15), service scope breadth (15), competitive/material signal present (15), contact & source evidence quality (10). Tiers: High ≥ 70, Medium 40–69, Low < 40.',
      model_about_proyectos: 'Projects score (0–100): evidence of scale above the 2,000 m² project threshold or a named tourism-resort development (20 pts), typology fit for Dekton facades/cladding/flooring (20), status & delivery horizon signal (15), specification/scale signal (15), competitive/material signal (15), contact & source evidence quality (15). Tiers: High ≥ 70, Medium 40–69, Low < 40.',
      export_csv: 'Export CSV (current filters)',
      lang_toggle: 'EN',
      source_language_tag: 'Source language',
      next_action_kitchen: 'Propose free sample display in exchange for countertop brand exclusivity; open with an initial-volume discount.',
      next_action_kitchen_bath: 'Propose free sample display in exchange for countertop brand exclusivity; open with an initial-volume discount.',
      next_action_showroom: 'Propose a joint display corner and a starter material kit at an aggressive entry price.',
      next_action_interior: 'Offer referral commission on completed sales plus a pocket sample kit and digital catalogue access for rendering/specification.',
      next_action_architecture: 'Propose preferred technical specification on active projects, with technical support and samples for client proposals.',
      next_action_contractor: 'Propose volume pricing for active builds and project-based payment terms.',
      next_action_developer: 'Propose a framework supply agreement for show-flats, with an option to scale to full-phase supply if commercial reception is strong.',
      next_action_specifier: 'Propose preferred inclusion in project specification documents, with technical training and specification support for the prescribing team.',
      next_action_facade: 'Propose a certified installer partnership for Dekton ventilated facades, with volume pricing per project.',
      next_action_flooring: 'Propose volume pricing for large-scale flooring projects, with technical samples and on-site installation support.',
      next_action_hybrid: 'Qualify which of its combined activities is the strongest entry point, then apply the matching typology playbook.',
      next_action_default: 'Qualify contact details directly before proposing a specific commercial angle.',
      not_available: 'Not available'
    },
    bg: {
      cover_choose_channel: 'Изберете канал за анализ',
      cover_explore: 'Разгледайте пазара →',
      cover_view: 'Отворете канала →',
      internal_use: 'Търговски анализ · За вътрешно ползване',
      executive_intelligence: 'Executive intelligence · Подкрепа за вътрешни решения',
      hero_eyebrow: 'Преглед на пазара · Търговски анализ',
      hero_title: 'С кого да започнем следващия разговор?',
      hero_context: 'Работен модел за приоритизиране на потенциални партньори, изграден върху съответствие с категорията, физическа експозиция, пазарни доказателства и ценово позициониране.',
      filters_refine: 'Прецизирайте пазара',
      filters_search_label: 'Търсене',
      map_key: 'Легенда на възможностите',
      opportunity_field: 'Поле на възможностите',
      all_accounts: 'Всички акаунти в изгледа',
      first_conversations: 'Първи разговори',
      developments_title: 'Именувани проекти за развитие',
      dev_project: 'Проект',
      dev_horizon: 'Търговски хоризонт',
      horizon_execution: 'В изпълнение / продажба',
      horizon_near: 'Предстоящ етап',
      horizon_concept: 'Обявен / концепция',
      horizon_delivered: 'Завършен',
      brand_line_pre: 'Пазарно проучване и табло, изготвени от',
      brand_author: 'Francisco González',
      cover_eyebrow: 'Cosentino · България',
      cover_title: 'България · Partner Intelligence',
      cover_message: 'От видимост на пазара към следващия разговор с партньор.',
      cover_enter_retail: 'Ритейл анализ',
      cover_enter_proyectos: 'Анализ на проекти',
      cover_stat_retail: 'Ритейл участници',
      cover_stat_proyectos: 'Участници в проекти',
      cover_stat_developments: 'Именувани проекта',
      cover_stat_cities: 'Градове в ритейла',
      cover_proposal_label: 'Дизайн предложение',
      cover_proposal_a: 'A — Executive Intelligence',
      cover_open: 'Отвори',
      cover_brands_title: 'Повърхности на Cosentino',
      channels_label: 'Канали',
      back_to_cover: 'Към началото',
      channel_retail: 'Ритейл',
      channel_proyectos: 'Проекти',
      nav_map: 'Карта на позициониране',
      nav_map_desc: 'Приоритет срещу позициониране, без застъпвания',
      nav_list: 'Списък с акаунти',
      nav_list_desc: 'Пълна филтрирана таблица',
      nav_shortlist: 'Приоритетен шортлист',
      nav_shortlist_desc: 'Високо / средно ниво, защо сега',
      nav_coverage: 'Покритие',
      nav_coverage_desc: 'Град × типология × експозиция',
      nav_competitive: 'Конкурентна среда',
      nav_competitive_desc: 'Споменати материали и марки',
      nav_developments: 'Проекти за развитие',
      nav_developments_desc: 'Само именувани проекти — за целия канал проекти виж „Покритие“',
      filters_title: 'Филтри',
      filters_search: 'Търсене по име, адрес, телефон, имейл, марка, съобщение…',
      filters_city: 'Град',
      filters_typology: 'Типология',
      filters_priority: 'Приоритет',
      filters_price: 'Ценови диапазон',
      filters_exhibition: 'Физическа експозиция',
      filters_competitive: 'Конкурентен сигнал',
      filters_secondary: 'Вторичен канал',
      filters_subchannel: 'Вид проект',
      filters_all: 'Всички',
      filters_reset: 'Нулиране',
      filters_open_mobile: 'Филтри',
      filters_close_mobile: 'Готово',
      priority_high: 'Висок',
      priority_medium: 'Среден',
      priority_low: 'Нисък',
      exhibition_yes: 'Потвърдено',
      exhibition_no: 'Непотвърдено',
      exhibition_nd: 'Неопределено',
      yes_label: 'Да',
      no_label: 'Не',
      subchannel_volume: 'Обем (>2 000 м²)',
      subchannel_tourism: 'Туристически курорт',
      kpi_total: 'Общо акаунти',
      kpi_total_action: 'Виж всички',
      kpi_priority: 'Висок приоритет',
      kpi_priority_action: 'Отвори шортлиста',
      kpi_showroom: 'Потвърден шоурум',
      kpi_showroom_action: 'Филтър по експозиция',
      kpi_cities: 'Обхванати градове',
      kpi_cities_action: 'Отвори покритието',
      results_count: 'акаунта отговарят на текущите филтри',
      table_name: 'Име',
      table_city: 'Град',
      table_typology: 'Типология',
      table_price: 'Цена',
      table_exhibition: 'Шоурум',
      table_priority: 'Приоритет',
      table_action: 'Отвори',
      map_axis_y: 'Вертикална ос: приоритет / резултат за съответствие (0–100)',
      map_axis_x: 'Хоризонтална ос: ценово позициониране, разпределено по обхват на услугите в рамките на сегмента',
      map_note: 'Точките са леко изместени, за да се избегне застъпване; точният резултат се показва при посочване/избор.',
      map_empty: 'Няма акаунти, отговарящи на текущите филтри.',
      shortlist_why: 'Защо сега',
      shortlist_next: 'Следваща стъпка',
      shortlist_empty: 'Няма акаунти с висок/среден приоритет по текущите филтри.',
      coverage_title: 'Покритие по град',
      coverage_typology: 'По типология',
      coverage_price: 'По ценови диапазон',
      coverage_exhibition: 'По физическа експозиция',
      competitive_title: 'Споменати материали и марки',
      competitive_hint: 'Изберете сигнал, за да филтрирате съответните акаунти',
      competitive_empty: 'Няма установен конкурентен сигнал в текущите филтри.',
      competitive_count: 'споменавания',
      dev_status: 'Статус',
      dev_developer: 'Инвеститор',
      dev_location: 'Местоположение',
      dev_scale: 'Мащаб',
      dev_delivery: 'Очакван срок / хоризонт',
      dev_reading: 'Търговска оценка на сроковете',
      dev_reading_body: 'Оценка, а не потвърден факт — проверете директно преди да заделите ресурси.',
      drawer_title: 'Детайли',
      drawer_close: 'Затвори',
      drawer_account_city: 'Акаунт и град',
      drawer_typology_channel: 'Типология и канал',
      drawer_score: 'Резултат и приоритет',
      drawer_score_explain: 'За модела',
      drawer_exhibition: 'Физическа експозиция',
      drawer_price: 'Ценови диапазон и сигнал',
      drawer_service: 'Обхват на услугите',
      drawer_address: 'Адрес',
      drawer_contact: 'Контакт',
      drawer_source: 'Уебсайт / източник',
      drawer_competitive: 'Конкурентен сигнал',
      drawer_messages: 'Ключови послания',
      drawer_notes: 'Бележки',
      drawer_provenance: 'Произход на данните',
      drawer_recommendation: 'Търговска препоръка',
      drawer_secondary_channel: 'Активен също в',
      verified_evidence: 'Потвърдени доказателства',
      commercial_recommendation: 'Търговска препоръка — потвърдете с местния екип',
      not_evidenced: 'Не е потвърдено в текущото проучване',
      model_about_title: 'За модела на приоритизация',
      model_about_retail: 'Резултат Retail (0–100): потвърдена физическа експозиция (25 т.), съответствие на типологията с плотове Silestone/Sensa (20), ценово позициониране Medium/High предпочетено пред Low (15), обхват на услугите (15), наличие на конкурентен/материален сигнал (15), качество на контакта и източника (10). Нива: висок ≥ 70, среден 40–69, нисък < 40.',
      model_about_proyectos: 'Резултат Projects (0–100): доказателство за мащаб над прага от 2 000 м² или именуван туристически проект (20 т.), съответствие на типологията с фасади/облицовки/подове Dekton (20), сигнал за статус и срок на изпълнение (15), сигнал за спецификация/мащаб (15), конкурентен/материален сигнал (15), качество на контакта и източника (15). Нива: висок ≥ 70, среден 40–69, нисък < 40.',
      export_csv: 'Експорт на CSV (текущи филтри)',
      lang_toggle: 'BG',
      source_language_tag: 'Език на източника',
      next_action_kitchen: 'Предложете безплатна демонстрация на мостри срещу изключителност на марката за плотове; започнете с отстъпка за начален обем.',
      next_action_kitchen_bath: 'Предложете безплатна демонстрация на мостри срещу изключителност на марката за плотове; започнете с отстъпка за начален обем.',
      next_action_showroom: 'Предложете съвместен демонстрационен кът и стартов комплект материали на агресивна входна цена.',
      next_action_interior: 'Предложете комисионна за завършени продажби, джобен комплект мостри и достъп до цифров каталог за визуализация/спецификация.',
      next_action_architecture: 'Предложете предпочитана техническа спецификация по активни проекти, с техническа поддръжка и мостри за клиентски предложения.',
      next_action_contractor: 'Предложете обемно ценообразуване за текущи строежи и условия на плащане по проект.',
      next_action_developer: 'Предложете рамково споразумение за доставка за демонстрационни апартаменти, с опция за разширяване до доставка за цяла фаза при добър търговски прием.',
      next_action_specifier: 'Предложете предпочитано включване в проектната документация за спецификация, с техническо обучение и подкрепа за екипа по спецификация.',
      next_action_facade: 'Предложете партньорство със сертифициран монтажник за вентилируеми фасади Dekton, с обемно ценообразуване по проект.',
      next_action_flooring: 'Предложете обемно ценообразуване за мащабни проекти за подови настилки, с технически мостри и поддръжка при монтаж на обекта.',
      next_action_hybrid: 'Определете коя от съчетаните дейности е най-силната входна точка, след което приложете съответния сценарий за типологията.',
      next_action_default: 'Уточнете директно данните за контакт, преди да предложите конкретен търговски ъгъл.',
      not_available: 'Не е налично'
    },
    ru: {
      cover_choose_channel: 'Выберите канал аналитики',
      cover_explore: 'Изучить рынок →',
      cover_view: 'Открыть канал →',
      internal_use: 'Коммерческая аналитика · Для внутреннего использования',
      executive_intelligence: 'Executive intelligence · Поддержка внутренних решений',
      hero_eyebrow: 'Обзор рынка · Коммерческая аналитика',
      hero_title: 'С кем начать следующий разговор?',
      hero_context: 'Рабочая модель приоритизации потенциальных партнёров на основе соответствия категории, физической экспозиции, рыночных свидетельств и ценового позиционирования.',
      filters_refine: 'Уточнить рынок',
      filters_search_label: 'Поиск',
      map_key: 'Ключ возможностей',
      opportunity_field: 'Поле возможностей',
      all_accounts: 'Все аккаунты в выборке',
      first_conversations: 'Первые переговоры',
      developments_title: 'Именованные проекты застройки',
      dev_project: 'Проект',
      dev_horizon: 'Коммерческий горизонт',
      horizon_execution: 'В реализации / продаже',
      horizon_near: 'Ближайший этап',
      horizon_concept: 'Анонс / концепция',
      horizon_delivered: 'Завершён',
      brand_line_pre: 'Маркетинговое исследование и дашборд подготовил',
      brand_author: 'Francisco González',
      cover_eyebrow: 'Cosentino · Болгария',
      cover_title: 'Болгария · Partner Intelligence',
      cover_message: 'От видимости рынка к следующему разговору с партнёром.',
      cover_enter_retail: 'Розничный канал',
      cover_enter_proyectos: 'Проектный канал',
      cover_stat_retail: 'Розничных актора',
      cover_stat_proyectos: 'Проектных актора',
      cover_stat_developments: 'Именованных проектов',
      cover_stat_cities: 'Города розницы',
      cover_proposal_label: 'Дизайн-предложение',
      cover_proposal_a: 'A — Executive Intelligence',
      cover_open: 'Открыть',
      cover_brands_title: 'Поверхности Cosentino',
      channels_label: 'Каналы',
      back_to_cover: 'На обложку',
      channel_retail: 'Розница',
      channel_proyectos: 'Проекты',
      nav_map: 'Карта позиционирования',
      nav_map_desc: 'Приоритет vs. позиционирование, без наложений',
      nav_list: 'Список аккаунтов',
      nav_list_desc: 'Полная таблица с фильтрами',
      nav_shortlist: 'Приоритетный шортлист',
      nav_shortlist_desc: 'Высокий / средний уровень, почему сейчас',
      nav_coverage: 'Покрытие',
      nav_coverage_desc: 'Город × типология × экспозиция',
      nav_competitive: 'Конкурентная среда',
      nav_competitive_desc: 'Упомянутые материалы и бренды',
      nav_developments: 'Проекты застройки',
      nav_developments_desc: 'Только именованные проекты — полный канал проектов см. в разделе «Покрытие»',
      filters_title: 'Фильтры',
      filters_search: 'Поиск: название, адрес, телефон, email, бренд, сообщение…',
      filters_city: 'Город',
      filters_typology: 'Типология',
      filters_priority: 'Приоритет',
      filters_price: 'Ценовой сегмент',
      filters_exhibition: 'Физическая экспозиция',
      filters_competitive: 'Конкурентный сигнал',
      filters_secondary: 'Вторичный канал',
      filters_subchannel: 'Тип проекта',
      filters_all: 'Все',
      filters_reset: 'Сбросить',
      filters_open_mobile: 'Фильтры',
      filters_close_mobile: 'Готово',
      priority_high: 'Высокий',
      priority_medium: 'Средний',
      priority_low: 'Низкий',
      exhibition_yes: 'Подтверждено',
      exhibition_no: 'Не подтверждено',
      exhibition_nd: 'Не определено',
      yes_label: 'Да',
      no_label: 'Нет',
      subchannel_volume: 'Объём (>2 000 м²)',
      subchannel_tourism: 'Туристический курорт',
      kpi_total: 'Всего аккаунтов',
      kpi_total_action: 'Показать все',
      kpi_priority: 'Высокий приоритет',
      kpi_priority_action: 'Открыть шортлист',
      kpi_showroom: 'Подтверждённый шоурум',
      kpi_showroom_action: 'Фильтр по экспозиции',
      kpi_cities: 'Городов охвачено',
      kpi_cities_action: 'Открыть покрытие',
      results_count: 'аккаунтов соответствуют текущим фильтрам',
      table_name: 'Название',
      table_city: 'Город',
      table_typology: 'Типология',
      table_price: 'Цена',
      table_exhibition: 'Шоурум',
      table_priority: 'Приоритет',
      table_action: 'Открыть',
      map_axis_y: 'Вертикальная ось: приоритет / оценка соответствия (0–100)',
      map_axis_x: 'Горизонтальная ось: ценовое позиционирование, распределено по широте услуг внутри сегмента',
      map_note: 'Позиции слегка смещены во избежание наложения; точная оценка — при наведении/выборе.',
      map_empty: 'Нет аккаунтов, соответствующих текущим фильтрам.',
      shortlist_why: 'Почему сейчас',
      shortlist_next: 'Следующее действие',
      shortlist_empty: 'Нет аккаунтов высокого/среднего приоритета по текущим фильтрам.',
      coverage_title: 'Покрытие по городу',
      coverage_typology: 'По типологии',
      coverage_price: 'По ценовому сегменту',
      coverage_exhibition: 'По физической экспозиции',
      competitive_title: 'Упомянутые материалы и бренды',
      competitive_hint: 'Выберите сигнал, чтобы отфильтровать аккаунты',
      competitive_empty: 'Конкурентный сигнал не подтверждён в текущих фильтрах.',
      competitive_count: 'упоминаний',
      dev_status: 'Статус',
      dev_developer: 'Застройщик',
      dev_location: 'Расположение',
      dev_scale: 'Масштаб',
      dev_delivery: 'Оценка срока сдачи / горизонт',
      dev_reading: 'Коммерческая оценка сроков',
      dev_reading_body: 'Оценочное суждение, а не подтверждённый факт — уточняйте напрямую перед выделением ресурсов.',
      drawer_title: 'Детали',
      drawer_close: 'Закрыть',
      drawer_account_city: 'Аккаунт и город',
      drawer_typology_channel: 'Типология и канал',
      drawer_score: 'Оценка и приоритет',
      drawer_score_explain: 'О модели',
      drawer_exhibition: 'Физическая экспозиция',
      drawer_price: 'Ценовой сегмент и сигнал',
      drawer_service: 'Широта услуг',
      drawer_address: 'Адрес',
      drawer_contact: 'Контакты',
      drawer_source: 'Сайт / источник',
      drawer_competitive: 'Конкурентный сигнал',
      drawer_messages: 'Ключевые сообщения',
      drawer_notes: 'Заметки',
      drawer_provenance: 'Происхождение данных',
      drawer_recommendation: 'Коммерческая рекомендация',
      drawer_secondary_channel: 'Также активен в',
      verified_evidence: 'Подтверждённые данные',
      commercial_recommendation: 'Коммерческая рекомендация — проверить с локальной командой',
      not_evidenced: 'Не подтверждено текущим исследованием',
      model_about_title: 'О модели приоритизации',
      model_about_retail: 'Оценка Retail (0–100): подтверждённая физическая экспозиция (25 бал.), соответствие типологии для столешниц Silestone/Sensa (20), ценовое позиционирование Medium/High предпочтительнее Low (15), широта услуг (15), наличие конкурентного/материального сигнала (15), качество контактов и источника (10). Уровни: высокий ≥ 70, средний 40–69, низкий < 40.',
      model_about_proyectos: 'Оценка Projects (0–100): свидетельство масштаба выше порога 2 000 м² или именованный туристический проект (20 бал.), соответствие типологии для фасадов/облицовки/пола Dekton (20), сигнал статуса и срока сдачи (15), сигнал спецификации/масштаба (15), конкурентный/материальный сигнал (15), качество контактов и источника (15). Уровни: высокий ≥ 70, средний 40–69, низкий < 40.',
      export_csv: 'Экспорт CSV (текущие фильтры)',
      lang_toggle: 'RU',
      source_language_tag: 'Язык источника',
      next_action_kitchen: 'Предложить бесплатную демонстрацию образцов в обмен на эксклюзив по столешницам; начать со скидки за первый объём.',
      next_action_kitchen_bath: 'Предложить бесплатную демонстрацию образцов в обмен на эксклюзив по столешницам; начать со скидки за первый объём.',
      next_action_showroom: 'Предложить совместный демонстрационный уголок и стартовый набор материалов по агрессивной входной цене.',
      next_action_interior: 'Предложить комиссию за реализованные продажи, карманный набор образцов и доступ к цифровому каталогу для рендера/спецификации.',
      next_action_architecture: 'Предложить приоритетную техническую спецификацию на активных проектах с техподдержкой и образцами для предложений клиенту.',
      next_action_contractor: 'Предложить объёмные цены для текущих строек и условия оплаты по проекту.',
      next_action_developer: 'Предложить рамочное соглашение о поставке для шоурумов/шоу-квартир с опцией масштабирования на всю фазу при хорошем коммерческом приёме.',
      next_action_specifier: 'Предложить приоритетное включение в проектные спецификации, техническое обучение и поддержку по спецификации материалов.',
      next_action_facade: 'Предложить партнёрство сертифицированного монтажника по вентилируемым фасадам Dekton с объёмными ценами за проект.',
      next_action_flooring: 'Предложить объёмные цены для крупных проектов по напольным покрытиям с техническими образцами и поддержкой монтажа на объекте.',
      next_action_hybrid: 'Определить самое сильное направление среди совмещаемых видов деятельности и применить соответствующий сценарий типологии.',
      next_action_default: 'Уточнить контактные данные напрямую перед тем, как предлагать конкретный коммерческий угол.',
      not_available: 'Недоступно'
    }
  };

  function t(lang, key) {
    var d = I18N[lang] || I18N.en;
    return (key in d) ? d[key] : (I18N.en[key] || key);
  }

  /* =========================================================
   * 3. STATE
   * ========================================================= */

  var state = {
    lang: 'en',
    channel: 'retail',
    proposal: 'A',
    view: 'map',
    filters: { search: '', city: 'all', typology: 'all', priority: 'all', price: 'all', exhibition: 'all', competitive: false, secondary: 'all', subchannel: 'all' },
    selectedId: null,
    devFilters: { project: 'all', status: 'all', developer: 'all', horizon: 'all' },
    selectedDevId: null
  };

  function loadSession() {
    try {
      var l = sessionStorage.getItem('bpi_lang');
      var p = sessionStorage.getItem('bpi_proposal');
      if (LANGS.indexOf(l) !== -1) state.lang = l;
      if (p === 'A') state.proposal = p;
    } catch (e) { /* sessionStorage unavailable (privacy mode) — fall back to defaults */ }
  }
  function saveSession() {
    try {
      sessionStorage.setItem('bpi_lang', state.lang);
      sessionStorage.setItem('bpi_proposal', state.proposal);
    } catch (e) { /* ignore */ }
  }

  /* =========================================================
   * 4. HELPERS
   * ========================================================= */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function normCity(c) {
    return c || 'Unknown';
  }

  function hasEvidence(v) {
    if (v == null) return false;
    var s = String(v).trim().toLowerCase();
    return NO_EVIDENCE_FREE_TEXT.indexOf(s) === -1;
  }

  function evidenceOr(v, lang) {
    return hasEvidence(v) ? esc(v) : ('<em class="no-evidence">' + esc(t(lang, 'not_evidenced')) + '</em>');
  }

  function linkify(url) {
    if (!hasEvidence(url)) return null;
    var first = String(url).split(/[;,]\s*/)[0].trim();
    if (!/^https?:\/\//i.test(first)) return null;
    return first;
  }

  function uniqueValues(arr, key) {
    var seen = {}, out = [];
    for (var i = 0; i < arr.length; i++) {
      var v = arr[i][key];
      if (v && !seen[v]) { seen[v] = true; out.push(v); }
    }
    return out;
  }

  function getDataset(channel) {
    return channel === 'proyectos' ? global.PROYECTOS_DATA : global.RETAIL_DATA;
  }
  function getTypologies(channel) {
    return channel === 'proyectos' ? PROYECTOS_TYPOLOGIES : RETAIL_TYPOLOGIES;
  }

  function subchannelLabel(v) {
    if (v === 'Volume') return t(state.lang, 'subchannel_volume');
    if (v === 'Tourism') return t(state.lang, 'subchannel_tourism');
    return v;
  }

  /* =========================================================
   * 5. SCORING MODEL
   * ========================================================= */

  function scoreRetail(rec) {
    var breakdown = [];
    var exhib = rec.physical_exhibition === 'Yes' ? 1 : (rec.physical_exhibition === 'Not determinable' ? 0.4 : 0);
    breakdown.push({ key: 'exhibition', pts: exhib * 25, max: 25 });
    var fit = RETAIL_TYPOLOGY_FIT[rec.typology] != null ? RETAIL_TYPOLOGY_FIT[rec.typology] : 0.5;
    breakdown.push({ key: 'typology_fit', pts: fit * 20, max: 20 });
    var price = PRICE_SCORE_RETAIL[rec.price_range] != null ? PRICE_SCORE_RETAIL[rec.price_range] : 0.4;
    breakdown.push({ key: 'price', pts: price * 15, max: 15 });
    var breadth = SERVICE_BREADTH[rec.service_scope] != null ? SERVICE_BREADTH[rec.service_scope] : 0.3;
    breakdown.push({ key: 'service', pts: breadth * 15, max: 15 });
    var competitive = hasEvidence(rec.materials_brands_mentioned) ? 1 : 0;
    breakdown.push({ key: 'competitive', pts: competitive * 15, max: 15 });
    var evid = (hasEvidence(rec.email) || hasEvidence(rec.phone) ? 0.5 : 0) + (hasEvidence(rec.source_url) ? 0.5 : 0);
    breakdown.push({ key: 'evidence', pts: evid * 10, max: 10 });
    return breakdown;
  }

  function scoreProyectos(rec) {
    var breakdown = [];
    var volumeText = ((rec.project_volume_note || '') + ' ' + (rec.raw_notes || '')).toLowerCase();
    var volumeEvidence = /\d[\d.,]*\s*(m²|millones|million|млн|apartments|units|апартамент)|más de \d|more than \d|над \d|\d+\+/.test(volumeText) ? 1 : (rec.project_type === 'Tourism' ? 0.6 : 0.4);
    breakdown.push({ key: 'volume_evidence', pts: volumeEvidence * 20, max: 20 });
    var fit = PROYECTOS_TYPOLOGY_FIT[rec.typology] != null ? PROYECTOS_TYPOLOGY_FIT[rec.typology] : 0.5;
    breakdown.push({ key: 'typology_fit', pts: fit * 20, max: 20 });
    var statusText = ((rec.raw_notes || '') + ' ' + (rec.project_volume_note || '')).toLowerCase();
    var horizon = /under construction|в строительстве|строится|в строеж|в изграждане|for sale|в продаж|за продажба/.test(statusText) ? 1 : 0.5;
    breakdown.push({ key: 'status_horizon', pts: horizon * 15, max: 15 });
    var breadth = SERVICE_BREADTH[rec.service_scope] != null ? SERVICE_BREADTH[rec.service_scope] : 0.3;
    breakdown.push({ key: 'spec_scale', pts: breadth * 15, max: 15 });
    var competitive = hasEvidence(rec.materials_brands_mentioned) ? 1 : 0;
    breakdown.push({ key: 'competitive', pts: competitive * 15, max: 15 });
    var evid = (hasEvidence(rec.email) || hasEvidence(rec.phone) ? 0.5 : 0) + (hasEvidence(rec.source_url) ? 0.5 : 0);
    breakdown.push({ key: 'evidence', pts: evid * 15, max: 15 });
    return breakdown;
  }

  var SCORE_LABEL_KEYS = {
    exhibition: { en: 'physical exhibition', bg: 'физическа експозиция', ru: 'физическая экспозиция' },
    typology_fit: { en: 'typology fit', bg: 'съответствие на типологията', ru: 'соответствие типологии' },
    price: { en: 'price positioning', bg: 'ценово позициониране', ru: 'ценовое позиционирование' },
    service: { en: 'service breadth', bg: 'обхват на услугите', ru: 'широта услуг' },
    competitive: { en: 'competitive signal', bg: 'конкурентен сигнал', ru: 'конкурентный сигнал' },
    evidence: { en: 'contact/source evidence', bg: 'контакт/източник', ru: 'контакты/источник' },
    volume_evidence: { en: 'scale/volume evidence', bg: 'доказателство за мащаб', ru: 'свидетельство масштаба' },
    status_horizon: { en: 'status & horizon', bg: 'статус и срок', ru: 'статус и срок' },
    spec_scale: { en: 'specification/scale signal', bg: 'сигнал за спецификация/мащаб', ru: 'сигнал спецификации/масштаба' }
  };

  function computeScore(rec, channel, lang) {
    var breakdown = channel === 'proyectos' ? scoreProyectos(rec) : scoreRetail(rec);
    var total = 0;
    for (var i = 0; i < breakdown.length; i++) total += breakdown[i].pts;
    total = Math.round(total);
    var tier = total >= 70 ? 'High' : (total >= 40 ? 'Medium' : 'Low');
    var sorted = breakdown.slice().sort(function (a, b) { return b.pts - a.pts; });
    var why = sorted.slice(0, 2).map(function (b) {
      var lbl = (SCORE_LABEL_KEYS[b.key] || {})[lang] || b.key;
      return lbl + ' (' + Math.round(b.pts) + '/' + b.max + ')';
    });
    return { total: total, tier: tier, breakdown: breakdown, why: why };
  }

  function typologySlug(typology) {
    var map = {
      'Kitchen': 'kitchen', 'Kitchen & Bath': 'kitchen_bath', 'Premium Materials Showroom': 'showroom',
      'Interior Designer': 'interior', 'Architecture Studio': 'architecture', 'Contractor': 'contractor',
      'Developer': 'developer', 'Technical Specifier': 'specifier', 'Facade Installer': 'facade',
      'Flooring Installer': 'flooring', 'Hybrid': 'hybrid'
    };
    return map[typology] || 'default';
  }
  function nextAction(rec, lang) {
    var slug = typologySlug(rec.typology);
    return t(lang, 'next_action_' + slug) || t(lang, 'next_action_default');
  }

  /* =========================================================
   * 6. FILTERING
   * ========================================================= */

  function filterRecords(channel, filters, lang) {
    var data = getDataset(channel) || [];
    var q = (filters.search || '').trim().toLowerCase();
    return data.filter(function (rec) {
      if (filters.city !== 'all' && normCity(rec.city) !== filters.city) return false;
      if (filters.typology !== 'all' && rec.typology !== filters.typology) return false;
      if (filters.price !== 'all' && rec.price_range !== filters.price) return false;
      if (filters.exhibition !== 'all' && rec.physical_exhibition !== filters.exhibition) return false;
      if (filters.competitive && !hasEvidence(rec.materials_brands_mentioned)) return false;
      if (filters.secondary === 'yes' && !hasEvidence(rec.canal_secundario)) return false;
      if (filters.secondary === 'no' && hasEvidence(rec.canal_secundario)) return false;
      if (channel === 'proyectos' && filters.subchannel && filters.subchannel !== 'all' && rec.project_type !== filters.subchannel) return false;
      if (filters.priority !== 'all') {
        var tier = computeScore(rec, channel, lang).tier;
        if (tier !== filters.priority) return false;
      }
      if (q) {
        var hay = [rec.name, rec.address, rec.phone, rec.email, rec.materials_brands_mentioned, rec.key_messages].join(' ').toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  /* =========================================================
   * 7. POSITIONING MAP — deterministic collision avoidance
   * ========================================================= */

  function priceX(rec, channel) {
    var order = { 'Low': 0, 'Medium': 1, 'High': 2, 'Not determinable': 1 };
    var base = order[rec.price_range] != null ? order[rec.price_range] : 1;
    var breadth = SERVICE_BREADTH[rec.service_scope] != null ? SERVICE_BREADTH[rec.service_scope] : 0.3;
    return (base + breadth) / 3; // 0..1
  }

  function layoutPoints(records, channel, lang, opts) {
    opts = opts || {};
    var width = opts.width || 800, height = opts.height || 480, margin = opts.margin || 24;
    var minDist = opts.minDist || MIN_DIST_DESKTOP;
    var plotW = width - margin * 2, plotH = height - margin * 2;

    var pts = records.map(function (rec) {
      var score = computeScore(rec, channel, lang);
      var x = margin + priceX(rec, channel) * plotW;
      var y = margin + (1 - score.total / 100) * plotH;
      return { id: rec.id_actor, rec: rec, score: score, trueX: x, trueY: y, x: x, y: y };
    });

    pts.sort(function (a, b) { return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0); });

    var placed = [];
    pts.forEach(function (p) {
      var x = p.trueX, y = p.trueY;
      var attempt = 0;
      var ok = false;
      while (!ok && attempt < 400) {
        ok = true;
        for (var i = 0; i < placed.length; i++) {
          var dx = x - placed[i].x, dy = y - placed[i].y;
          if (Math.sqrt(dx * dx + dy * dy) < minDist) { ok = false; break; }
        }
        if (!ok) {
          attempt++;
          var angle = attempt * 2.4;
          var radius = 3 + attempt * 1.6;
          x = Math.max(margin, Math.min(width - margin, p.trueX + Math.cos(angle) * radius));
          y = Math.max(margin, Math.min(height - margin, p.trueY + Math.sin(angle) * radius));
        }
      }
      p.x = x; p.y = y;
      placed.push(p);
    });
    return pts;
  }

  function minPairwiseDistance(pts) {
    var min = Infinity;
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < min) min = d;
      }
    }
    return pts.length < 2 ? Infinity : min;
  }

  /* =========================================================
   * 8. CSV EXPORT
   * ========================================================= */

  function csvEscape(v) {
    var s = v == null ? '' : String(v);
    if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }
  function toCSV(rows, columns) {
    var lines = [columns.map(function (c) { return csvEscape(c.label); }).join(',')];
    rows.forEach(function (r) {
      lines.push(columns.map(function (c) { return csvEscape(r[c.key]); }).join(','));
    });
    return lines.join('\r\n');
  }
  function downloadCSV(filename, csvString) {
    var blob = new Blob([String.fromCharCode(0xFEFF) + csvString], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  var ACTOR_CSV_COLUMNS = ['id_actor', 'name', 'city', 'typology', 'channel', 'project_type', 'canal_secundario', 'physical_exhibition',
    'price_range', 'service_scope', 'email', 'phone', 'address', 'source_url', 'materials_brands_mentioned', 'key_messages'
  ].map(function (k) { return { key: k, label: k }; });

  var DEV_CSV_COLUMNS = ['project_name', 'developer', 'location', 'status', 'scale', 'estimated_delivery', 'source_url', 'notes']
    .map(function (k) { return { key: k, label: k }; });

  /* =========================================================
   * 9. COVERAGE / COMPETITIVE COMPUTATIONS
   * ========================================================= */

  function computeCoverage(records, channel) {
    var byCity = {}, byTypology = {}, byPrice = {}, byExhibition = {};
    records.forEach(function (r) {
      var c = normCity(r.city);
      byCity[c] = (byCity[c] || 0) + 1;
      byTypology[r.typology] = (byTypology[r.typology] || 0) + 1;
      byPrice[r.price_range] = (byPrice[r.price_range] || 0) + 1;
      byExhibition[r.physical_exhibition] = (byExhibition[r.physical_exhibition] || 0) + 1;
    });
    return { byCity: byCity, byTypology: byTypology, byPrice: byPrice, byExhibition: byExhibition, total: records.length };
  }

  function computeCompetitive(records) {
    var tags = {};
    records.forEach(function (r) {
      if (!hasEvidence(r.materials_brands_mentioned)) return;
      var parts = String(r.materials_brands_mentioned).split(/[,;]|(?:\band\b)/i);
      parts.forEach(function (p) {
        var name = p.replace(/\([^)]*\)/g, '').trim();
        if (!name || name.length < 3) return;
        if (!tags[name]) tags[name] = { name: name, count: 0, ids: [] };
        tags[name].count++;
        tags[name].ids.push(r.id_actor);
      });
    });
    return Object.keys(tags).map(function (k) { return tags[k]; }).sort(function (a, b) { return b.count - a.count; });
  }

  /* =========================================================
   * 10. NAV / VIEW METADATA
   * ========================================================= */

  var VIEWS_COMMON = [
    { id: 'map', num: '01', titleKey: 'nav_map', descKey: 'nav_map_desc' },
    { id: 'list', num: '02', titleKey: 'nav_list', descKey: 'nav_list_desc' },
    { id: 'shortlist', num: '03', titleKey: 'nav_shortlist', descKey: 'nav_shortlist_desc' },
    { id: 'coverage', num: '04', titleKey: 'nav_coverage', descKey: 'nav_coverage_desc' },
    { id: 'competitive', num: '05', titleKey: 'nav_competitive', descKey: 'nav_competitive_desc' }
  ];
  var VIEW_DEVELOPMENTS = { id: 'developments', num: '06', titleKey: 'nav_developments', descKey: 'nav_developments_desc' };

  function viewsForChannel(channel) {
    return channel === 'proyectos' ? VIEWS_COMMON.concat([VIEW_DEVELOPMENTS]) : VIEWS_COMMON;
  }

  /* =========================================================
   * 11. RENDERING / MOUNT
   * ========================================================= */

  var lastFocused = null;
  var extraMaterialFilter = null; // set by competitive-landscape click; substring match, cleared on Reset

  function byId(id) { return document.getElementById(id); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

  function currentFiltered() {
    var recs = filterRecords(state.channel, state.filters, state.lang);
    if (extraMaterialFilter) {
      var q = extraMaterialFilter.toLowerCase();
      recs = recs.filter(function (r) { return hasEvidence(r.materials_brands_mentioned) && r.materials_brands_mentioned.toLowerCase().indexOf(q) !== -1; });
    }
    return recs;
  }

  function render() {
    if (document.body) document.body.classList.toggle('developments-active', state.view === 'developments');
    renderHeaderState();
    renderNav();
    renderKPI();
    renderFilters();
    VIEWS_COMMON.concat([VIEW_DEVELOPMENTS]).forEach(function (v) {
      var el = byId('view-' + v.id);
      if (el) el.hidden = (state.view !== v.id);
    });
    var recs = currentFiltered();
    var countEl = byId('results-count');
    if (countEl) countEl.textContent = recs.length + ' ' + t(state.lang, 'results_count');
    var liveCountEl = byId('filter-live-count');
    if (liveCountEl) liveCountEl.textContent = recs.length + ' / ' + getDataset(state.channel).length;

    if (state.view === 'map') renderMap(recs);
    else if (state.view === 'list') renderTable(recs);
    else if (state.view === 'shortlist') renderShortlist(recs);
    else if (state.view === 'coverage') renderCoverage(recs);
    else if (state.view === 'competitive') renderCompetitive(recs);
    else if (state.view === 'developments') renderDevelopments();
    applyStaticI18n();
  }

  function applyStaticI18n() {
    document.documentElement.lang = state.lang;
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      nodes[i].textContent = t(state.lang, key);
    }
    var attrNodes = document.querySelectorAll('[data-i18n-aria]');
    for (var j = 0; j < attrNodes.length; j++) {
      attrNodes[j].setAttribute('aria-label', t(state.lang, attrNodes[j].getAttribute('data-i18n-aria')));
    }
    var placeholderNodes = document.querySelectorAll('[data-i18n-placeholder]');
    for (var k = 0; k < placeholderNodes.length; k++) {
      placeholderNodes[k].setAttribute('placeholder', t(state.lang, placeholderNodes[k].getAttribute('data-i18n-placeholder')));
    }
    LANGS.forEach(function (l) {
      var btn = byId('lang-' + l);
      if (btn) btn.setAttribute('aria-pressed', state.lang === l ? 'true' : 'false');
      if (btn) btn.classList.toggle('is-active', state.lang === l);
    });
  }

  function renderHeaderState() {
    var authEl = byId('brand-authorship');
    if (authEl) {
      authEl.innerHTML = esc(t(state.lang, 'brand_line_pre')) + ' <strong>' + esc(t(state.lang, 'brand_author')) + '</strong>';
    }
    ['retail', 'proyectos'].forEach(function (ch) {
      var btn = byId('channel-btn-' + ch);
      if (btn) {
        var active = state.channel === ch;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.classList.toggle('is-active', active);
      }
    });
    var modelSummary = byId('model-summary');
    if (modelSummary) {
      var modelKey = state.channel === 'proyectos' ? 'model_about_proyectos' : 'model_about_retail';
      modelSummary.setAttribute('data-i18n', modelKey);
      modelSummary.textContent = t(state.lang, modelKey);
    }
  }

  function defaultFilters() {
    return { search: '', city: 'all', typology: 'all', priority: 'all', price: 'all', exhibition: 'all', competitive: false, secondary: 'all', subchannel: 'all' };
  }

  function setChannel(ch) {
    if (state.channel === ch) return;
    state.channel = ch;
    state.view = 'map';
    state.filters = defaultFilters();
    extraMaterialFilter = null;
    render();
  }

  function setView(v) { state.view = v; render(); }

  function renderNav() {
    var band = byId('nav-band');
    if (!band) return;
    var views = viewsForChannel(state.channel);
    band.classList.toggle('nav-band-6', views.length === 6);
    band.innerHTML = views.map(function (v) {
      var active = state.view === v.id;
      return '<button type="button" class="nav-mod' + (active ? ' is-active' : '') + '" data-view="' + v.id + '" aria-pressed="' + active + '">' +
        '<span class="nav-mod-num">' + v.num + '</span>' +
        '<span class="nav-mod-title">' + esc(t(state.lang, v.titleKey)) + '</span>' +
        '<span class="nav-mod-desc">' + esc(t(state.lang, v.descKey)) + '</span>' +
        '</button>';
    }).join('');
    Array.prototype.forEach.call(band.querySelectorAll('.nav-mod'), function (btn) {
      on(btn, 'click', function () { setView(btn.getAttribute('data-view')); });
    });
  }

  function renderKPI() {
    var band = byId('kpi-band');
    if (!band) return;
    var recs = currentFiltered();
    var total = recs.length;
    var high = recs.filter(function (r) { return computeScore(r, state.channel, state.lang).tier === 'High'; }).length;
    var showroom = recs.filter(function (r) { return r.physical_exhibition === 'Yes'; }).length;
    var cities = uniqueValues(recs.map(function (r) { return { c: normCity(r.city) }; }), 'c').length;
    var tiles = [
      { key: 'total', label: t(state.lang, 'kpi_total'), value: total, action: t(state.lang, 'kpi_total_action') },
      { key: 'priority', label: t(state.lang, 'kpi_priority'), value: high, action: t(state.lang, 'kpi_priority_action') },
      { key: 'showroom', label: t(state.lang, 'kpi_showroom'), value: showroom, action: t(state.lang, 'kpi_showroom_action') },
      { key: 'cities', label: t(state.lang, 'kpi_cities'), value: cities, action: t(state.lang, 'kpi_cities_action') }
    ];
    band.innerHTML = tiles.map(function (tl) {
      return '<button type="button" class="kpi-tile" data-kpi="' + tl.key + '" aria-label="' + esc(tl.label) + ': ' + tl.value + '. ' + esc(tl.action) + '">' +
        '<span class="kpi-value">' + tl.value + '</span>' +
        '<span class="kpi-label">' + esc(tl.label) + '</span>' +
        '<span class="kpi-action">' + esc(tl.action) + ' →</span>' +
        '</button>';
    }).join('');
    Array.prototype.forEach.call(band.querySelectorAll('.kpi-tile'), function (btn) {
      on(btn, 'click', function () {
        var kpi = btn.getAttribute('data-kpi');
        if (kpi === 'total') { resetFilters(); }
        else if (kpi === 'priority') { state.filters.priority = 'High'; setView('shortlist'); }
        else if (kpi === 'showroom') { state.filters.exhibition = 'Yes'; setView('list'); }
        else if (kpi === 'cities') { setView('coverage'); }
      });
    });
  }

  function chipGroup(labelKey, groupKey, options, optionLabeler) {
    var current = state.filters[groupKey];
    var html = '<div class="chip-group" role="group" aria-label="' + esc(t(state.lang, labelKey)) + '">' +
      '<span class="chip-group-label">' + esc(t(state.lang, labelKey)) + '</span>' +
      '<button type="button" class="chip' + (current === 'all' ? ' is-pressed' : '') + '" data-group="' + groupKey + '" data-value="all" aria-pressed="' + (current === 'all') + '">' + esc(t(state.lang, 'filters_all')) + '</button>' +
      options.map(function (opt) {
        var pressed = current === opt;
        return '<button type="button" class="chip' + (pressed ? ' is-pressed' : '') + '" data-group="' + groupKey + '" data-value="' + esc(opt) + '" aria-pressed="' + pressed + '">' + esc(optionLabeler ? optionLabeler(opt) : opt) + '</button>';
      }).join('') + '</div>';
    return html;
  }

  function exhibitionLabel(v) {
    if (v === 'Yes') return t(state.lang, 'exhibition_yes');
    if (v === 'No') return t(state.lang, 'exhibition_no');
    return t(state.lang, 'exhibition_nd');
  }
  function priorityLabel(v) {
    if (v === 'High') return t(state.lang, 'priority_high');
    if (v === 'Medium') return t(state.lang, 'priority_medium');
    return t(state.lang, 'priority_low');
  }

  function renderFilters() {
    var panel = byId('filters-chips');
    if (!panel) return;
    var data = getDataset(state.channel) || [];
    var cities = uniqueValues(data.map(function (r) { return { c: normCity(r.city) }; }), 'c').sort();
    var typologies = getTypologies(state.channel).filter(function (ty) { return data.some(function (r) { return r.typology === ty; }); });
    var hasSecondary = data.some(function (r) { return hasEvidence(r.canal_secundario); });
    var hasSubchannel = state.channel === 'proyectos' && data.some(function (r) { return hasEvidence(r.project_type); });

    var html = '';
    html += chipGroup('filters_city', 'city', cities);
    html += chipGroup('filters_typology', 'typology', typologies);
    if (hasSubchannel) html += chipGroup('filters_subchannel', 'subchannel', SUBCHANNELS, subchannelLabel);
    html += chipGroup('filters_priority', 'priority', ['High', 'Medium', 'Low'], priorityLabel);
    html += chipGroup('filters_price', 'price', PRICE_TIERS);
    html += chipGroup('filters_exhibition', 'exhibition', EXHIBITION_TIERS, exhibitionLabel);
    if (hasSecondary) html += chipGroup('filters_secondary', 'secondary', ['yes', 'no'], function (v) { return v === 'yes' ? t(state.lang, 'yes_label') : t(state.lang, 'no_label'); });
    html += '<div class="chip-group" role="group" aria-label="' + esc(t(state.lang, 'filters_competitive')) + '">' +
      '<span class="chip-group-label">' + esc(t(state.lang, 'filters_competitive')) + '</span>' +
      '<button type="button" class="chip' + (state.filters.competitive ? ' is-pressed' : '') + '" data-toggle="competitive" aria-pressed="' + !!state.filters.competitive + '">' + esc(t(state.lang, 'yes_label')) + '</button></div>';
    panel.innerHTML = html;

    Array.prototype.forEach.call(panel.querySelectorAll('.chip[data-group]'), function (btn) {
      on(btn, 'click', function () {
        var group = btn.getAttribute('data-group'), value = btn.getAttribute('data-value');
        state.filters[group] = (state.filters[group] === value) ? 'all' : value;
        render();
      });
    });
    Array.prototype.forEach.call(panel.querySelectorAll('[data-toggle="competitive"]'), function (btn) {
      on(btn, 'click', function () { state.filters.competitive = !state.filters.competitive; render(); });
    });

    var searchInput = byId('filters-search');
    if (searchInput && searchInput.value !== state.filters.search) searchInput.value = state.filters.search;
  }

  function resetFilters() {
    state.filters = defaultFilters();
    extraMaterialFilter = null;
    state.view = 'list';
    render();
  }

  /* ---------- Positioning map ---------- */

  function renderMap(recs) {
    var wrap = byId('map-svg-wrap');
    if (!wrap) return;
    var axisY = byId('map-axis-y'), axisX = byId('map-axis-x'), note = byId('map-note');
    if (axisY) axisY.textContent = t(state.lang, 'map_axis_y');
    if (axisX) axisX.textContent = t(state.lang, 'map_axis_x');
    if (note) note.textContent = t(state.lang, 'map_note');

    if (!recs.length) {
      wrap.innerHTML = '<p class="empty-state">' + esc(t(state.lang, 'map_empty')) + '</p>';
      return;
    }
    var width = Math.max(320, wrap.clientWidth || 800);
    var narrow = width < 640;
    var height = narrow ? 420 : 480;
    var minDist = narrow ? MIN_DIST_NARROW : MIN_DIST_DESKTOP;
    var pts = layoutPoints(recs, state.channel, state.lang, { width: width, height: height, minDist: minDist });

    var svg = '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" height="' + height + '" role="img" aria-label="' + esc(t(state.lang, 'nav_map')) + '">';
    for (var gy = 0; gy <= 4; gy++) {
      var yy = 24 + (gy / 4) * (height - 48);
      svg += '<line x1="24" y1="' + yy + '" x2="' + (width - 24) + '" y2="' + yy + '" class="map-gridline" />';
    }
    // Render the selected point last so it paints on top (SVG has no z-index; document order decides stacking).
    var drawOrder = pts.slice().sort(function (a, b) {
      var aSel = a.id === state.selectedId ? 1 : 0, bSel = b.id === state.selectedId ? 1 : 0;
      return aSel - bSel;
    });
    drawOrder.forEach(function (p) {
      var r = state.selectedId === p.id ? 9 : 6;
      var doubleRing = p.rec.physical_exhibition === 'Yes';
      var cls = 'map-point priority-' + p.score.tier.toLowerCase() + (state.selectedId === p.id ? ' is-selected' : '');
      var label = p.rec.name + ', ' + normCity(p.rec.city) + ', ' + t(state.lang, 'kpi_priority') + ' ' + p.score.total +
        (doubleRing ? ', ' + t(state.lang, 'kpi_showroom') : '');
      svg += '<g class="' + cls + '" tabindex="0" role="button" aria-label="' + esc(label) + '" data-id="' + esc(p.id) + '" transform="translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')">';
      svg += '<circle r="14" class="map-hit" />';
      if (doubleRing) svg += '<circle r="' + (r + 4) + '" class="map-ring" />';
      svg += '<circle r="' + r + '" class="map-dot" />';
      svg += '<title>' + esc(label) + '</title>';
      svg += '</g>';
    });
    svg += '</svg>';
    wrap.innerHTML = svg;

    Array.prototype.forEach.call(wrap.querySelectorAll('.map-point'), function (g) {
      var id = g.getAttribute('data-id');
      on(g, 'click', function () { openDrawer(id); });
      on(g, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(id); } });
    });

    wrap._minDistCache = minPairwiseDistance(pts);
  }

  /* ---------- Account list (table) ---------- */

  var sortState = { key: 'name', dir: 1 };

  function renderTable(recs) {
    var wrap = byId('table-container');
    if (!wrap) return;
    if (!recs.length) { wrap.innerHTML = '<p class="empty-state">' + esc(t(state.lang, 'map_empty')) + '</p>'; return; }
    var rows = recs.map(function (r) { return { r: r, score: computeScore(r, state.channel, state.lang) }; });
    rows.sort(function (a, b) {
      var ka = sortState.key === 'priority' ? a.score.total : (a.r[sortState.key] || '');
      var kb = sortState.key === 'priority' ? b.score.total : (b.r[sortState.key] || '');
      if (ka < kb) return -1 * sortState.dir; if (ka > kb) return 1 * sortState.dir; return 0;
    });
    var cols = [
      { key: 'name', label: 'table_name' }, { key: 'city', label: 'table_city' }, { key: 'typology', label: 'table_typology' },
      { key: 'price_range', label: 'table_price' }, { key: 'physical_exhibition', label: 'table_exhibition' }, { key: 'priority', label: 'table_priority' }
    ];
    var html = '<table class="data-table"><thead><tr>' + cols.map(function (c) {
      return '<th><button type="button" class="sort-btn" data-sort="' + c.key + '">' + esc(t(state.lang, c.label)) + (sortState.key === c.key ? (sortState.dir === 1 ? ' ▲' : ' ▼') : '') + '</button></th>';
    }).join('') + '<th>' + esc(t(state.lang, 'table_action')) + '</th></tr></thead><tbody>';
    rows.forEach(function (row) {
      var r = row.r;
      html += '<tr tabindex="0" data-id="' + esc(r.id_actor) + '" class="table-row">' +
        '<td>' + esc(r.name) + '</td><td>' + esc(normCity(r.city)) + '</td><td>' + esc(r.typology) + '</td>' +
        '<td><span class="badge badge-price-' + esc((r.price_range || '').toLowerCase().replace(/\s+/g, '-')) + '">' + esc(r.price_range) + '</span></td>' +
        '<td><span class="badge badge-exhib-' + esc((r.physical_exhibition || '').toLowerCase().replace(/\s+/g, '-')) + '">' + esc(exhibitionLabel(r.physical_exhibition)) + '</span></td>' +
        '<td><span class="badge badge-priority-' + row.score.tier.toLowerCase() + '">' + esc(priorityLabel(row.score.tier)) + ' · ' + row.score.total + '</span></td>' +
        '<td><button type="button" class="link-btn" data-open="' + esc(r.id_actor) + '">' + esc(t(state.lang, 'table_action')) + '</button></td></tr>';
    });
    html += '</tbody></table>';
    wrap.innerHTML = html;

    Array.prototype.forEach.call(wrap.querySelectorAll('.sort-btn'), function (btn) {
      on(btn, 'click', function () {
        var key = btn.getAttribute('data-sort');
        if (sortState.key === key) sortState.dir *= -1; else { sortState.key = key; sortState.dir = 1; }
        renderTable(currentFiltered());
      });
    });
    Array.prototype.forEach.call(wrap.querySelectorAll('.table-row'), function (tr) {
      var id = tr.getAttribute('data-id');
      on(tr, 'click', function (e) { if (e.target.tagName !== 'BUTTON') openDrawer(id); });
      on(tr, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(id); } });
    });
    Array.prototype.forEach.call(wrap.querySelectorAll('[data-open]'), function (btn) {
      on(btn, 'click', function () { openDrawer(btn.getAttribute('data-open')); });
    });
  }

  /* ---------- Priority shortlist ---------- */

  function renderShortlist(recs) {
    var wrap = byId('shortlist-container');
    if (!wrap) return;
    var scored = recs.map(function (r) { return { r: r, score: computeScore(r, state.channel, state.lang) }; })
      .filter(function (x) { return x.score.tier !== 'Low'; })
      .sort(function (a, b) { return b.score.total - a.score.total; });
    if (!scored.length) { wrap.innerHTML = '<p class="empty-state">' + esc(t(state.lang, 'shortlist_empty')) + '</p>'; return; }
    wrap.innerHTML = scored.map(function (x) {
      var r = x.r;
      return '<article class="shortlist-card" tabindex="0" role="button" data-id="' + esc(r.id_actor) + '" aria-label="' + esc(r.name) + '">' +
        '<div class="shortlist-head"><span class="badge badge-priority-' + x.score.tier.toLowerCase() + '">' + esc(priorityLabel(x.score.tier)) + ' · ' + x.score.total + '</span><h3>' + esc(r.name) + '</h3><span class="muted">' + esc(normCity(r.city)) + ' · ' + esc(r.typology) + '</span></div>' +
        '<p class="shortlist-why"><strong>' + esc(t(state.lang, 'shortlist_why')) + ':</strong> ' + x.score.why.join('; ') + '</p>' +
        '<p class="shortlist-next"><strong>' + esc(t(state.lang, 'shortlist_next')) + ':</strong> ' + esc(nextAction(r, state.lang)) + '</p>' +
        '</article>';
    }).join('');
    Array.prototype.forEach.call(wrap.querySelectorAll('.shortlist-card'), function (card) {
      var id = card.getAttribute('data-id');
      on(card, 'click', function () { openDrawer(id); });
      on(card, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(id); } });
    });
  }

  /* ---------- Coverage ---------- */

  function barRow(label, value, max) {
    var pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return '<div class="cov-row"><span class="cov-label">' + esc(label) + '</span>' +
      '<span class="cov-bar-track"><span class="cov-bar-fill" style="width:' + pct + '%"></span></span>' +
      '<span class="cov-value">' + value + '</span></div>';
  }
  function coverageBlock(titleKey, obj) {
    var keys = Object.keys(obj).filter(Boolean);
    var max = Math.max.apply(null, keys.map(function (k) { return obj[k]; }).concat([1]));
    return '<div class="cov-block"><h3>' + esc(t(state.lang, titleKey)) + '</h3>' +
      keys.sort(function (a, b) { return obj[b] - obj[a]; }).map(function (k) { return barRow(k, obj[k], max); }).join('') + '</div>';
  }

  function renderCoverage(recs) {
    var wrap = byId('coverage-container');
    if (!wrap) return;
    var cov = computeCoverage(recs, state.channel);
    var html = '<div class="cov-block"><h3>' + esc(t(state.lang, 'coverage_title')) + '</h3>' +
      Object.keys(cov.byCity).sort(function (a, b) { return cov.byCity[b] - cov.byCity[a]; })
        .map(function (c) { return barRow(c, cov.byCity[c], cov.total); }).join('') + '</div>';
    html += coverageBlock('coverage_typology', cov.byTypology);
    html += coverageBlock('coverage_price', cov.byPrice);
    html += coverageBlock('coverage_exhibition', cov.byExhibition);
    wrap.innerHTML = html;
  }

  /* ---------- Competitive landscape ---------- */

  function renderCompetitive(recs) {
    var wrap = byId('competitive-container');
    if (!wrap) return;
    var tags = computeCompetitive(recs);
    if (!tags.length) { wrap.innerHTML = '<p class="empty-state">' + esc(t(state.lang, 'competitive_empty')) + '</p>'; return; }
    var html = '<p class="hint">' + esc(t(state.lang, 'competitive_hint')) + '</p><div class="tag-cloud">' +
      tags.map(function (tg) {
        return '<button type="button" class="tag-chip" data-tag="' + esc(tg.name) + '">' + esc(tg.name) + ' <span class="tag-count">' + tg.count + ' ' + esc(t(state.lang, 'competitive_count')) + '</span></button>';
      }).join('') + '</div>';
    wrap.innerHTML = html;
    Array.prototype.forEach.call(wrap.querySelectorAll('.tag-chip'), function (btn) {
      on(btn, 'click', function () { extraMaterialFilter = btn.getAttribute('data-tag'); setView('list'); });
    });
  }

  /* ---------- Project developments (Proyectos only) ---------- */

  var devSortState = { key: 'project_name', dir: 1 };

  function developmentHorizon(dev) {
    var status = String(dev.status || '').toLowerCase();
    var delivery = String(dev.estimated_delivery || '').toLowerCase();
    if (status.indexOf('delivered') !== -1) return 'delivered';
    if (/2026|2027|2028|near-term|imminent/.test(delivery)) return 'near';
    if (status.indexOf('construction') !== -1 || status.indexOf('sale') !== -1) return 'execution';
    return 'concept';
  }

  function filteredDevelopments() {
    var data = global.DEVELOPMENTS_DATA || [];
    return data.filter(function (d) {
      if (state.devFilters.project !== 'all' && d.project_name !== state.devFilters.project) return false;
      if (state.devFilters.status !== 'all' && d.status !== state.devFilters.status) return false;
      if (state.devFilters.developer !== 'all' && d.developer !== state.devFilters.developer) return false;
      if (state.devFilters.horizon !== 'all' && developmentHorizon(d) !== state.devFilters.horizon) return false;
      return true;
    });
  }

  function devSelect(key, labelKey, options, labeler) {
    return '<label class="dev-select"><span>' + esc(t(state.lang, labelKey)) + '</span><select data-dev="' + key + '">' +
      '<option value="all">' + esc(t(state.lang, 'filters_all')) + '</option>' +
      options.map(function (value) {
        return '<option value="' + esc(value) + '"' + (state.devFilters[key] === value ? ' selected' : '') + '>' + esc(labeler ? labeler(value) : value) + '</option>';
      }).join('') + '</select></label>';
  }

  function renderDevelopments() {
    var filterWrap = byId('dev-filters');
    var data = global.DEVELOPMENTS_DATA || [];
    if (filterWrap) {
      var projects = uniqueValues(data, 'project_name');
      var statuses = uniqueValues(data, 'status');
      var developers = uniqueValues(data, 'developer');
      var horizons = ['execution', 'near', 'concept', 'delivered'];
      var html = devSelect('project', 'dev_project', projects) +
        devSelect('developer', 'dev_developer', developers) +
        devSelect('status', 'dev_status', statuses) +
        devSelect('horizon', 'dev_horizon', horizons, function (value) { return t(state.lang, 'horizon_' + value); });
      filterWrap.innerHTML = html;
      Array.prototype.forEach.call(filterWrap.querySelectorAll('select[data-dev]'), function (select) {
        on(select, 'change', function () {
          state.devFilters[select.getAttribute('data-dev')] = select.value;
          renderDevelopments();
        });
      });
    }
    var recs = filteredDevelopments();
    var countEl = byId('results-count');
    if (countEl && state.view === 'developments') countEl.textContent = recs.length + ' ' + t(state.lang, 'results_count');
    var wrap = byId('dev-table-container');
    if (!wrap) return;
    if (!recs.length) { wrap.innerHTML = '<p class="empty-state">' + esc(t(state.lang, 'map_empty')) + '</p>'; return; }
    recs = recs.slice().sort(function (a, b) {
      var ka = a[devSortState.key] || '', kb = b[devSortState.key] || '';
      if (ka < kb) return -1 * devSortState.dir; if (ka > kb) return 1 * devSortState.dir; return 0;
    });
    var html = '<table class="data-table"><thead><tr>' +
      ['project_name', 'developer', 'location', 'status', 'estimated_delivery'].map(function (k) {
        var labelKey = k === 'project_name' ? 'table_name' : (k === 'developer' ? 'dev_developer' : (k === 'location' ? 'dev_location' : (k === 'status' ? 'dev_status' : 'dev_delivery')));
        return '<th><button type="button" class="sort-btn" data-devsort="' + k + '">' + esc(t(state.lang, labelKey)) + (devSortState.key === k ? (devSortState.dir === 1 ? ' ▲' : ' ▼') : '') + '</button></th>';
      }).join('') + '</tr></thead><tbody>';
    recs.forEach(function (d, idx) {
      html += '<tr tabindex="0" data-devidx="' + idx + '" class="table-row">' +
        '<td>' + esc(d.project_name) + '</td><td>' + esc(d.developer) + '</td><td>' + esc(d.location) + '</td>' +
        '<td>' + esc(d.status) + '</td><td>' + esc(d.estimated_delivery) + '</td></tr>';
    });
    html += '</tbody></table>';
    wrap.innerHTML = html;
    Array.prototype.forEach.call(wrap.querySelectorAll('.sort-btn'), function (btn) {
      on(btn, 'click', function () {
        var key = btn.getAttribute('data-devsort');
        if (devSortState.key === key) devSortState.dir *= -1; else { devSortState.key = key; devSortState.dir = 1; }
        renderDevelopments();
      });
    });
    Array.prototype.forEach.call(wrap.querySelectorAll('.table-row'), function (tr) {
      var idx = parseInt(tr.getAttribute('data-devidx'), 10);
      on(tr, 'click', function () { openDevDrawer(recs[idx]); });
      on(tr, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDevDrawer(recs[idx]); } });
    });
  }

  /* =========================================================
   * 12. DRAWER
   * ========================================================= */

  function fieldRow(labelKey, valueHtml) {
    return '<div class="field-row"><span class="field-label">' + esc(t(state.lang, labelKey)) + '</span><div class="field-value">' + valueHtml + '</div></div>';
  }

  function buildActorDrawer(rec) {
    var lang = state.lang;
    var score = computeScore(rec, state.channel, lang);
    var lines = '';
    lines += fieldRow('drawer_account_city', '<strong>' + esc(rec.name) + '</strong> — ' + esc(normCity(rec.city)));
    lines += fieldRow('drawer_typology_channel', esc(rec.typology) + (rec.typology_detail ? ' — ' + esc(rec.typology_detail) : '') + ' · ' + esc(rec.channel));
    if (hasEvidence(rec.project_type)) lines += fieldRow('filters_subchannel', esc(subchannelLabel(rec.project_type)));
    if (hasEvidence(rec.canal_secundario)) lines += fieldRow('drawer_secondary_channel', esc(rec.canal_secundario));
    lines += fieldRow('drawer_score', '<span class="badge badge-priority-' + score.tier.toLowerCase() + '">' + esc(priorityLabel(score.tier)) + ' · ' + score.total + '/100</span>' +
      '<details class="model-details"><summary>' + esc(t(lang, 'drawer_score_explain')) + '</summary><p>' + esc(t(lang, state.channel === 'proyectos' ? 'model_about_proyectos' : 'model_about_retail')) + '</p></details>');
    lines += fieldRow('drawer_exhibition', '<span class="badge badge-exhib-' + esc((rec.physical_exhibition || '').toLowerCase().replace(/\s+/g, '-')) + '">' + esc(exhibitionLabel(rec.physical_exhibition)) + '</span><br>' + evidenceOr(rec.exhibition_evidence, lang));
    lines += fieldRow('drawer_price', esc(rec.price_range) + ' — ' + evidenceOr(rec.price_signal, lang));
    lines += fieldRow('drawer_service', esc(rec.service_scope || t(lang, 'not_evidenced')));
    lines += fieldRow('drawer_address', evidenceOr(rec.address, lang));
    var contactParts = [];
    if (hasEvidence(rec.phone)) contactParts.push('<a href="tel:' + esc(rec.phone.replace(/\s+/g, '')) + '">' + esc(rec.phone) + '</a>');
    if (hasEvidence(rec.email)) contactParts.push('<a href="mailto:' + esc(rec.email) + '">' + esc(rec.email) + '</a>');
    lines += fieldRow('drawer_contact', contactParts.length ? contactParts.join(' · ') : ('<em class="no-evidence">' + esc(t(lang, 'not_evidenced')) + '</em>'));
    var srcUrl = linkify(rec.source_url);
    lines += fieldRow('drawer_source', srcUrl ? '<a href="' + esc(srcUrl) + '" target="_blank" rel="noopener">' + esc(srcUrl) + '</a>' : evidenceOr(rec.source_url, lang));
    lines += fieldRow('drawer_competitive', evidenceOr(rec.materials_brands_mentioned, lang));
    lines += fieldRow('drawer_messages', evidenceOr(rec.key_messages, lang));
    if (hasEvidence(rec.raw_notes)) lines += fieldRow('drawer_notes', esc(rec.raw_notes));
    lines += fieldRow('drawer_provenance', esc([rec.data_source, rec.tool_used, rec._source_file].filter(Boolean).join(' · ')) +
      (hasEvidence(rec.source_language) ? ' <span class="muted">(' + esc(t(lang, 'source_language_tag')) + ': ' + esc(rec.source_language) + ')</span>' : ''));
    lines += '<div class="field-row recommendation-block"><span class="field-label">' + esc(t(lang, 'drawer_recommendation')) + '</span><div class="field-value">' +
      '<span class="tag-verified">' + esc(t(lang, 'commercial_recommendation')) + '</span><p>' + esc(nextAction(rec, lang)) + '</p></div></div>';
    return lines;
  }

  function buildDevDrawer(dev) {
    var lang = state.lang;
    var lines = '';
    lines += fieldRow('table_name', '<strong>' + esc(dev.project_name) + '</strong>');
    lines += fieldRow('dev_developer', evidenceOr(dev.developer, lang));
    lines += fieldRow('dev_location', evidenceOr(dev.location, lang));
    lines += fieldRow('dev_status', evidenceOr(dev.status, lang));
    lines += fieldRow('dev_scale', evidenceOr(dev.scale, lang));
    lines += fieldRow('dev_delivery', evidenceOr(dev.estimated_delivery, lang));
    var srcUrl = linkify(dev.source_url);
    lines += fieldRow('drawer_source', srcUrl ? '<a href="' + esc(srcUrl) + '" target="_blank" rel="noopener">' + esc(srcUrl) + '</a>' : evidenceOr(dev.source_url, lang));
    if (hasEvidence(dev.notes)) lines += fieldRow('drawer_notes', esc(dev.notes));
    lines += '<div class="field-row recommendation-block"><span class="field-label">' + esc(t(lang, 'dev_reading')) + '</span><div class="field-value">' +
      '<span class="tag-verified">' + esc(t(lang, 'commercial_recommendation')) + '</span><p>' + esc(t(lang, 'dev_reading_body')) + '</p></div></div>';
    return lines;
  }

  function openDrawerCommon(bodyHtml, id) {
    var drawer = byId('drawer'), body = byId('drawer-body'), overlay = byId('drawer-overlay');
    if (!drawer || !body) return;
    lastFocused = document.activeElement;
    body.innerHTML = bodyHtml;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.hidden = false;
    var closeBtn = byId('drawer-close-btn');
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onDrawerKeydown);
  }

  function openDrawer(id) {
    state.selectedId = id;
    var rec = (getDataset(state.channel) || []).filter(function (r) { return r.id_actor === id; })[0];
    if (!rec) return;
    openDrawerCommon(buildActorDrawer(rec), id);
    if (state.view === 'map') renderMap(currentFiltered());
  }
  function openDevDrawer(dev) {
    openDrawerCommon(buildDevDrawer(dev), dev.project_name);
  }

  function closeDrawer() {
    var drawer = byId('drawer'), overlay = byId('drawer-overlay');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.hidden = true;
    document.removeEventListener('keydown', onDrawerKeydown);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  function onDrawerKeydown(e) { if (e.key === 'Escape') closeDrawer(); }

  /* =========================================================
   * 13. CSV EXPORT (wired)
   * ========================================================= */

  function exportCurrentCSV() {
    if (state.view === 'developments') {
      var devs = filteredDevelopments();
      downloadCSV('bulgaria_developments.csv', toCSV(devs, DEV_CSV_COLUMNS));
    } else {
      var recs = currentFiltered();
      downloadCSV('bulgaria_' + state.channel + '_accounts.csv', toCSV(recs, ACTOR_CSV_COLUMNS));
    }
  }

  /* =========================================================
   * 14. MOUNT
   * ========================================================= */

  function parseHash() {
    var h = (location.hash || '').replace(/^#/, '');
    var parts = h.split('&').reduce(function (acc, kv) {
      var pair = kv.split('=');
      if (pair[0]) acc[pair[0]] = decodeURIComponent(pair[1] || '');
      return acc;
    }, {});
    if (parts.channel === 'retail' || parts.channel === 'proyectos') state.channel = parts.channel;
    if (parts.view) state.view = parts.view;
  }

  function setLang(l) {
    if (LANGS.indexOf(l) === -1 || state.lang === l) return;
    state.lang = l;
    saveSession();
    render();
  }

  function mount(config) {
    config = config || {};
    state.proposal = config.proposal || state.proposal;
    loadSession();
    parseHash();
    saveSession();

    LANGS.forEach(function (l) {
      on(byId('lang-' + l), 'click', function () { setLang(l); });
    });
    on(byId('channel-btn-retail'), 'click', function () { setChannel('retail'); });
    on(byId('channel-btn-proyectos'), 'click', function () { setChannel('proyectos'); });
    on(byId('filters-reset'), 'click', resetFilters);
    on(byId('export-btn'), 'click', exportCurrentCSV);
    on(byId('drawer-close-btn'), 'click', closeDrawer);
    on(byId('drawer-overlay'), 'click', closeDrawer);
    var searchInput = byId('filters-search');
    on(searchInput, 'input', function () { state.filters.search = searchInput.value; render(); });
    on(byId('filters-mobile-toggle'), 'click', function () {
      var panel = byId('filters-drawer');
      if (panel) panel.classList.add('is-open-mobile');
    });
    on(byId('filters-mobile-close'), 'click', function () {
      var panel = byId('filters-drawer');
      if (panel) panel.classList.remove('is-open-mobile');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var panel = byId('filters-drawer');
      if (panel && panel.classList.contains('is-open-mobile')) panel.classList.remove('is-open-mobile');
    });
    window.addEventListener('resize', debounce(function () { if (state.view === 'map') renderMap(currentFiltered()); }, 150));
    window.addEventListener('hashchange', function () {
      var previousChannel = state.channel;
      parseHash();
      if (state.channel !== previousChannel) {
        state.filters = defaultFilters();
        extraMaterialFilter = null;
      }
      saveSession();
      render();
    });

    render();
  }

  function debounce(fn, ms) {
    var tm;
    return function () { clearTimeout(tm); var args = arguments; tm = setTimeout(function () { fn.apply(null, args); }, ms); };
  }

  /* =========================================================
   * 15. PUBLIC API
   * ========================================================= */

  global.AppCore = {
    I18N: I18N, t: t,
    state: state, loadSession: loadSession, saveSession: saveSession, setLang: setLang,
    CITIES: CITIES, PRICE_TIERS: PRICE_TIERS, EXHIBITION_TIERS: EXHIBITION_TIERS, SUBCHANNELS: SUBCHANNELS, LANGS: LANGS,
    RETAIL_TYPOLOGIES: RETAIL_TYPOLOGIES, PROYECTOS_TYPOLOGIES: PROYECTOS_TYPOLOGIES,
    MIN_DIST_DESKTOP: MIN_DIST_DESKTOP, MIN_DIST_NARROW: MIN_DIST_NARROW,
    esc: esc, normCity: normCity, hasEvidence: hasEvidence, evidenceOr: evidenceOr, linkify: linkify,
    uniqueValues: uniqueValues, getDataset: getDataset, getTypologies: getTypologies, subchannelLabel: subchannelLabel,
    computeScore: computeScore, nextAction: nextAction,
    filterRecords: filterRecords, layoutPoints: layoutPoints, minPairwiseDistance: minPairwiseDistance,
    csvEscape: csvEscape, toCSV: toCSV, downloadCSV: downloadCSV,
    ACTOR_CSV_COLUMNS: ACTOR_CSV_COLUMNS, DEV_CSV_COLUMNS: DEV_CSV_COLUMNS,
    computeCoverage: computeCoverage, computeCompetitive: computeCompetitive,
    mount: mount, render: render, resetFilters: resetFilters, openDrawer: openDrawer, closeDrawer: closeDrawer
  };

})(window);
