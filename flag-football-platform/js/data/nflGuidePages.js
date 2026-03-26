// NFL Flag Referee Guide — 24-page content data
// Each page object: id, pageNumber, section, sectionColor, title, body,
// expandedBody, rulebookRef, faqs[], images[], videoUrl (null if none)
//
// images[] entries: { src: 'assets/images/...', alt: '' }
// videoUrl: YouTube embed URL (no autoplay) or null

export const GUIDE_SECTIONS = {
  OPENING: { label: 'Opening', color: { bg: '#E1F5EE', text: '#085041', border: '#9FE1CB' } },
  BEFORE: { label: 'Before the game', color: { bg: '#EEF3FE', text: '#3C3489', border: '#AFA9EC' } },
  FIELD: { label: 'Field setup', color: { bg: '#EAF3DE', text: '#27500A', border: '#C0DD97' } },
  MANAGEMENT: { label: 'Game management', color: { bg: '#FAEEDA', text: '#633806', border: '#FAC775' } },
  LIVEPLAY: { label: 'Live play rules', color: { bg: '#FAECE7', text: '#712B13', border: '#F5C4B3' } },
  CONDUCT: { label: 'Conduct & penalties', color: { bg: '#FBEAF0', text: '#72243E', border: '#F4C0D1' } },
  AGEGROUPS: { label: 'Age group rules', color: { bg: '#E1F5EE', text: '#085041', border: '#9FE1CB' } },
  CLOSING: { label: 'Closing', color: { bg: '#F1EFE8', text: '#444441', border: '#D3D1C7' } },
};

export const NFL_GUIDE_PAGES = [

  // ─────────────────────────────────────────────
  // PAGE 1 — Welcome & how to use this guide
  // ─────────────────────────────────────────────
  {
    id: 'welcome',
    pageNumber: 1,
    section: 'OPENING',
    title: 'Welcome, referee',
    body: 'This guide walks you through everything you need to officiate an NFL Flag game — from field setup to post-game responsibilities. Use it as a pre-game refresher or a full training walkthrough.',
    expandedBody: 'Each page covers one topic from the official NFL Flag rulebook (revised March 2025). Rules are written plainly and supported with diagrams, checklists, and FAQs drawn directly from referee scenarios. Your progress is saved automatically — signed-in users sync across devices, guests save locally. You can pick up where you left off at any time.',
    rulebookRef: null,
    pdfDownload: {
      label: 'Download official NFL Flag rulebook (PDF)',
      src: '/flag-football-platform/assets/images/NFL_Flag_Rulebook_21423-2025.pdf',
    },
    faqs: [
      {
        q: 'Do I need to create an account?',
        a: 'No. You can use the full guide as a guest — progress is saved on this device. Create an account to sync progress across devices.',
      },
      {
        q: 'How long does the full guide take?',
        a: 'About 25–35 minutes to read through completely. Each page takes 1–3 minutes. You can stop and resume at any time.',
      },
      {
        q: 'Is this guide official NFL Flag material?',
        a: 'The rules content is drawn directly from the official NFL Flag Playing Rules (revised 03/24/2025). The guide format and commentary are by Coach Goddie.',
      },
    ],
    images: [
      { src: 'assets/images/guide-intro.jpg', alt: 'Referee on the field overseeing a flag football game' },
    ],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 2 — Terminology & key definitions
  // ─────────────────────────────────────────────
  {
    id: 'terminology',
    pageNumber: 2,
    section: 'OPENING',
    title: 'Terminology & key definitions',
    body: 'Before stepping onto the field, referees must be fluent in the official NFL Flag terminology. These terms are used throughout the rulebook and will come up in every game situation.',
    expandedBody: 'Knowing these terms cold is what separates a confident referee from a hesitant one. When a coach challenges a call, you need to respond with the precise rule language — not a paraphrase.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section II: Terminology', page: 2 },
    faqs: [
      {
        q: 'What is the difference between a lateral and a backward pass?',
        a: 'Both are tosses behind or parallel to the line of scrimmage. "Lateral" is the common name; the rulebook uses it interchangeably with backward pass. Neither counts as the one permitted forward pass.',
      },
      {
        q: 'Can any offensive player be a "passer"?',
        a: 'Yes. The passer is any offensive player who throws the ball forward — not just the QB. This matters when calling passing violations.',
      },
      {
        q: 'What triggers a "dead ball" call?',
        a: 'The official\'s whistle signals dead ball. Key triggers: flag pulled, ball hits ground, ball carrier steps out of bounds, score, knee touches ground, or 7-second pass clock expires.',
      },
    ],
    glossary: [
      { term: 'Boundary Lines', def: 'Outer lines marking the field perimeter — sidelines and end zones.' },
      { term: 'Line of Scrimmage (LOS)', def: 'Imaginary line through the point of the ball across the field width.' },
      { term: 'Line-to-Gain', def: 'The yard line the offense must reach for a first down.' },
      { term: 'Rush Line', def: 'Imaginary line 7 yards from the LOS on the defense\'s side.' },
      { term: 'Passer', def: 'Any offensive player who throws the ball forward.' },
      { term: 'Rusher', def: 'Defensive player who rushes from the 7-yard rush line.' },
      { term: 'Live Ball', def: 'Period when play is in action, from snap to whistle.' },
      { term: 'Dead Ball', def: 'Time between plays; no action occurring.' },
      { term: 'Inadvertent Whistle', def: 'Official\'s whistle sounded in error.' },
      { term: 'Charging', def: 'Ball-carrier illegally running into a set defensive player.' },
      { term: 'Flag Guarding', def: 'Ball-carrier illegally blocking access to their own flags.' },
      { term: 'Shovel Pass', def: 'Legal forward pass from behind LOS — underhand, backhand, or push.' },
      { term: 'Lateral', def: 'Backward or parallel toss of the ball by the ball-carrier.' },
      { term: 'Unsportsmanlike Conduct', def: 'Confrontational or offensive behavior or language.' },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 3 — Equipment checklist
  // ─────────────────────────────────────────────
  {
    id: 'equipment',
    pageNumber: 3,
    section: 'BEFORE',
    title: 'Equipment checklist',
    body: 'As referee, you are responsible for verifying all player equipment before every game. Players who fail the equipment check may not take the field until compliant.',
    expandedBody: 'In tournament play, officials conduct a formal equipment check for all players before the game begins. Non-compliance results in team timeouts being used (up to 3) for the time taken to become compliant. Do not begin the game until all players on both teams pass the check.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section III: Equipment', page: 3 },
    faqs: [
      {
        q: 'Are metal cleats ever allowed?',
        a: 'No. Cleats with exposed metal are never permitted and must be removed before play. Regular cleats may be restricted at certain venues — check with the league organizer.',
      },
      {
        q: 'What if a player\'s flag belt matches their shorts color?',
        a: 'Flag belts and flags cannot be the same color as the player\'s shorts or pants. This is a required equipment correction — the player may not take the field until resolved.',
      },
      {
        q: 'Are soft-shell helmets required?',
        a: 'No — soft shell helmets are permitted but not required. If worn, they must be secured at all times on the field.',
      },
      {
        q: 'What happens if a jersey is not tucked in?',
        a: 'Jerseys must be tucked in before play begins. Untucked jerseys obstruct the flags and can be called as flag guarding. Blow the play dead and require compliance before resuming.',
      },
    ],
    checklist: [
      { item: 'Official NFL FLAG belt and flags', required: true },
      { item: 'Mouth guard worn at all times', required: true },
      { item: 'Shoes (no exposed metal cleats)', required: true },
      { item: 'All jewelry removed', required: true },
      { item: 'Jersey tucked in at belt line', required: true },
      { item: 'Flag color differs from shorts/pants', required: true },
      { item: 'No braces with exposed metal', required: true },
      { item: 'Gloves, elbow/knee pads — permitted', required: false },
      { item: 'Soft-shell helmet — permitted if secured', required: false },
      { item: 'Headbands / winter beanies — permitted', required: false },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: true,
    tournamentNote: 'In tournament play, NFL FLAG belts and flags are issued at check-in. All players must wear the issued equipment for all games — no exceptions. Equipment check by game officials is mandatory before every game.',
  },

  // ─────────────────────────────────────────────
  // PAGE 4 — Field dimensions & layout
  // ─────────────────────────────────────────────
  {
    id: 'field',
    pageNumber: 4,
    section: 'FIELD',
    title: 'Field dimensions & layout',
    body: 'There are two standard NFL Flag field options. Both share the same core structure: end zones, a midfield first-down line, and no-run zones. Verify all markings are correct before the coin toss.',
    expandedBody: 'The no-run zones are critical for referee positioning. You must be on or near these lines to call violations accurately. The 5-yard no-run zone before each end zone means all plays in that area must result in a forward pass across the LOS — any run attempt is an immediate dead ball and penalty. The referee spots the ball in the middle of the field; it may never be closer than 10 yards to any sideline.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section IV: Field', page: 5 },
    faqs: [
      {
        q: 'What are the two field size options?',
        a: 'Option A: 25 yards wide × 70 yards long with 10-yard end zones. Option B: 25 yards wide × 64 yards long with 7-yard end zones. Both have the same no-run zone rules.',
      },
      {
        q: 'Where exactly are the no-run zones?',
        a: 'Two per drive: 5 yards before midfield (to gain the first down) and 5 yards before the opponent\'s end zone (to score). Teams only cross two no-run zones per possession.',
      },
      {
        q: 'Does stepping on the boundary line count as out of bounds?',
        a: 'Yes. Stepping on the boundary line is out of bounds. The ball is spotted at the last in-bounds position.',
      },
    ],
    images: [
      { src: 'assets/images/field-option-a.jpg', alt: 'Option A field diagram — 70 yards with 10-yard end zones' },
      { src: 'assets/images/field-option-b.jpg', alt: 'Option B field diagram — 64 yards with 7-yard end zones' },
    ],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 5 — One-way field rules
  // ─────────────────────────────────────────────
  {
    id: 'one-way-field',
    pageNumber: 5,
    section: 'FIELD',
    title: 'One-way field rules',
    body: 'Some venues use a one-way field setup where multiple games share overlapping space. The rules for a one-way field differ from the standard rulebook in several key ways.',
    expandedBody: 'On a one-way field, the attacking team always moves in one direction — there is no reversal of field sides. This simplifies positioning for referees when multiple games share the same grass but eliminates certain standard plays like safeties and live interception returns.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section V: One-Way Field', page: 4 },
    faqs: [
      {
        q: 'Can a safety be scored on a one-way field?',
        a: 'No. There are no safeties on a one-way field. If the ball would result in a safety, possession changes and the ball is spotted at the 40-yard line.',
      },
      {
        q: 'Are interceptions returnable on a one-way field?',
        a: 'No. Interceptions are dead balls on a one-way field and are spotted at the 40-yard line.',
      },
      {
        q: 'Can a team declare PUNT on a one-way field?',
        a: 'Yes, but a declaration to PUNT is final — teams cannot change their mind on a one-way field. Use a timeout to reverse a PLAY declaration, not a PUNT.',
      },
    ],
    keyDifferences: [
      'Starting possession begins at the 40-yard line',
      'No safeties — ball spotted at 40 on change of possession',
      'Ball never starts further back than the 40-yard line',
      'Interceptions are dead balls, spotted at the 40',
      'Home and away teams line opposite sidelines',
      'All one-way rules supersede the standard rulebook',
      'A declaration to PUNT is final — no reversal',
    ],
    images: [
      { src: 'assets/images/one-way-field.jpg', alt: 'One-way field layout diagram showing four fields sharing space' },
    ],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 6 — Tournament vs regular season
  // ─────────────────────────────────────────────
  {
    id: 'tournament-vs-regular',
    pageNumber: 6,
    section: 'FIELD',
    title: 'Tournament vs regular season differences',
    body: 'Several rules change between regular season league play and tournament play. As a referee you must know which format you are officiating before the game begins — the differences affect clock, timeouts, play clock, equipment, mercy rule, and coaching sideline access.',
    expandedBody: 'When in doubt about which rules apply, confirm with the league organizer or site director before the first whistle. In tournament play, the faster pace means less margin for error — know the 25-second play clock and 3-timeout rule cold.',
    rulebookRef: { label: 'NFL Flag Rulebook — Multiple sections', page: null },
    faqs: [
      {
        q: 'How do I know which format I\'m officiating?',
        a: 'The league organizer or site director will brief you before the game. When in doubt — ask before the coin toss, never mid-game.',
      },
      {
        q: 'What is the mercy rule in each format?',
        a: 'Regular season: game ends when one team leads by 35 points or more. Tournament: game ends at a 28-point lead. Forfeits are scored 35-0 (regular) or 28-0 (tournament).',
      },
    ],
    comparisonTable: [
      { rule: 'Game length', regular: '2 × 24-min halves (48 min)', tournament: '2 × 12-min halves (24 min)' },
      { rule: 'Clock type', regular: 'Continuous running clock', tournament: 'Running clock' },
      { rule: 'Halftime', regular: '2 minutes', tournament: '1 minute' },
      { rule: 'Play clock', regular: '40 seconds after spot', tournament: '25 seconds after spot' },
      { rule: 'Timeouts', regular: '1 × 60 sec per half', tournament: '3 × 30 sec for entire game' },
      { rule: 'Mercy rule', regular: '35-point lead', tournament: '28-point lead' },
      { rule: 'Forfeit score', regular: '35–0', tournament: '28–0' },
      { rule: 'Equipment issued', regular: 'Teams bring own', tournament: 'NFL FLAG issues at check-in' },
      { rule: 'Coaches on field', regular: 'Age-group rules apply', tournament: 'Sideline only — 2 coaches max' },
      { rule: 'No-run zones (8U)', regular: 'Eliminated', tournament: 'In effect' },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 7 — Game setup & coin toss
  // ─────────────────────────────────────────────
  {
    id: 'game-setup',
    pageNumber: 7,
    section: 'MANAGEMENT',
    title: 'Game setup & coin toss',
    body: 'Every game begins with a coin toss at midfield. The referee conducts the toss, records the outcome, and confirms starting positions. Getting this right sets the tone for the entire game.',
    expandedBody: 'There is no option to defer in NFL Flag. The coin toss winner chooses offense or defense — the loser chooses field direction. Teams automatically switch sides at halftime, and the team that started with possession in the first half begins the second half on defense. Possession begins at the offensive team\'s own 5-yard line.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section I: Game Setup and Flow', page: 1 },
    faqs: [
      {
        q: 'Who calls the coin toss?',
        a: 'The visiting team calls the toss. If there is no clear visiting team, the referee may use any fair method to assign the call.',
      },
      {
        q: 'Can the coin toss winner defer to the second half?',
        a: 'No. There is no option to defer in NFL Flag. The winner must immediately choose offense or defense.',
      },
      {
        q: 'What happens when the offense fails to cross midfield?',
        a: 'If the offense punts on 4th down, the opposing team starts at their own 5-yard line. If they go for it and fail, the opposing team starts from the spot where 4th down ended.',
      },
      {
        q: 'How many downs to cross midfield vs score?',
        a: '4 downs to cross midfield. Once across, 3 downs to score. If the offense fails to score on their 3rd down past midfield, possession changes and the new offense starts at their 5-yard line.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 8 — Timing, clock & timeouts
  // ─────────────────────────────────────────────
  {
    id: 'timing',
    pageNumber: 8,
    section: 'MANAGEMENT',
    title: 'Timing, clock & timeouts',
    body: 'NFL Flag runs on a continuous clock. Knowing when to stop and restart the clock — and when not to — is one of the most visible parts of your job as referee.',
    expandedBody: 'The clock only stops for halftime, player injuries, and at officials\' discretion. Team timeouts and the play clock are separate concerns — the play clock starts when the referee spots the ball and signals Ready to Play. It does not stop for team huddles on the sideline in tournament play.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section VI: Timing and Overtime', page: 6 },
    faqs: [
      {
        q: 'Does the clock stop for out of bounds?',
        a: 'No. The clock runs continuously except for halftime, injuries, and official\'s discretion. It does not stop for incomplete passes, out of bounds, or scores.',
      },
      {
        q: 'When does the play clock begin?',
        a: 'The play clock begins when the referee spots the ball and signals Ready to Play. Regular season: 40 seconds. Tournament: 25 seconds.',
      },
      {
        q: 'Can a team use a timeout to change a 4th-down declaration?',
        a: 'Yes — a team may use a timeout to change a "Play" declaration at any time before the play clock expires. A PUNT declaration on a one-way field is final.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: true,
    tournamentNote: 'Tournament play: 2 × 12-minute halves, 1-minute halftime, 25-second play clock, 3 × 30-second timeouts for the entire game (not per half). Timeouts do not carry over.',
  },

  // ─────────────────────────────────────────────
  // PAGE 9 — Overtime format
  // ─────────────────────────────────────────────
  {
    id: 'overtime',
    pageNumber: 9,
    section: 'MANAGEMENT',
    title: 'Overtime format',
    body: 'If the score is tied at the end of regulation, an overtime period determines the winner. NFL Flag overtime has a unique multi-round structure that changes with each round.',
    expandedBody: 'There are no timeouts in overtime. Each team receives one coaches challenge for the entire overtime session — challenges must be based on misapplication of a rule, not a judgement call. The referee determines which end of the field the entire overtime is played on.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section VI: Timing and Overtime', page: 6 },
    faqs: [
      {
        q: 'Who chooses offense or defense in overtime?',
        a: 'The home team calls the coin toss for OT. In round 2, the team that lost the coin toss gets the choice. Teams alternate the choice at the start of each subsequent round.',
      },
      {
        q: 'Can a team win in the first overtime round?',
        a: 'Yes. If Team A scores from the 10-yard line (2 pts) and Team B cannot match or beat it, the game ends immediately.',
      },
      {
        q: 'What happens in a 3rd overtime?',
        a: 'Each team gets 1 play from the 5-yard line going out from the end zone. The team with the most yards wins — they are awarded 1 point added to their final score.',
      },
      {
        q: 'Are interceptions returnable in overtime?',
        a: 'Yes. Interceptions returned for a score in OT are worth 2 points. In the 1st or 2nd OT, a returned interception ends the game. In the 3rd OT, any advanced interception ends the game.',
      },
    ],
    overtimeRounds: [
      {
        round: '1st overtime',
        rule: 'Each team gets 1 play. Offense chooses: 1 point from 5-yard line OR 2 points from 10-yard line.',
      },
      {
        round: '2nd overtime',
        rule: 'Both teams must attempt a 2-point conversion from the 10-yard line.',
      },
      {
        round: '3rd overtime',
        rule: '1 play per team from the 5-yard line going out. Most yards wins — worth 1 point.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 10 — Scoring guide
  // ─────────────────────────────────────────────
  {
    id: 'scoring',
    pageNumber: 10,
    section: 'MANAGEMENT',
    title: 'Scoring guide',
    body: 'Referees must know all scoring values and the conditions under which each applies. After every score, confirm the point value with both coaches and the scorekeeper before resuming play.',
    expandedBody: 'A team that scores a touchdown must immediately declare whether they attempt a 1-point or 2-point conversion. Any change after the declaration requires a charged timeout. A decision cannot be changed after a penalty. The coaches, officials, and scorekeeper must all verify the score sheet — if a coach leaves without verifying, the score is final as recorded.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section VII: Scoring', page: 7 },
    faqs: [
      {
        q: 'How many points is a returned interception worth?',
        a: 'During a regulation scrimmage down: 6 points. During a PAT conversion attempt or in overtime: 2 points.',
      },
      {
        q: 'What is a safety and when does it occur?',
        a: 'A safety (2 points) occurs when the ball-carrier is declared down in their own end zone — flag pulled, flag falls off, steps out, knee/arm touches ground, fumble in end zone, or snapped ball lands in/beyond the end zone.',
      },
      {
        q: 'Can the offense change from a 1-pt to a 2-pt conversion?',
        a: 'Only by using a charged timeout before the snap. Once a penalty is called, the decision cannot be changed.',
      },
    ],
    scoringValues: [
      { play: 'Touchdown', points: 6, note: 'Standard score' },
      { play: 'PAT — 1 point (pass only)', points: 1, note: 'From the 5-yard line' },
      { play: 'PAT — 2 points (run or pass)', points: 2, note: 'From the 10-yard line' },
      { play: 'Safety', points: 2, note: 'Ball-carrier downed in own end zone' },
      { play: 'Interception returned for TD (regulation)', points: 6, note: 'Live return during scrimmage down' },
      { play: 'Interception returned (PAT / OT)', points: 2, note: 'During conversion or overtime' },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: true,
    tournamentNote: 'Tournament mercy rule: game ends when one team leads by 28 points or more. Regular season: 35 points.',
  },

  // ─────────────────────────────────────────────
  // PAGE 11 — Coaching guidelines
  // ─────────────────────────────────────────────
  {
    id: 'coaching',
    pageNumber: 11,
    section: 'MANAGEMENT',
    title: 'Coaching guidelines',
    body: 'Coaches play an important role in game flow, but their access to the field and sideline behavior is governed by the rulebook. Referees are responsible for enforcing these guidelines.',
    expandedBody: 'All team photographers, managers, position coaches, team moms, fans and other team members must remain off the playing field in the designated viewing area. Coaches are responsible for the conduct of their fans and associated team members. Referee intervention is required if conduct standards are not met.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section VIII: Coaches', page: 7 },
    faqs: [
      {
        q: 'Can coaches be on the field during play?',
        a: 'In regular season: age-group rules apply (see pages 22–23). In tournament play: coaches must remain on the sideline — they may only enter the field to attend to an injured player.',
      },
      {
        q: 'Can teams huddle with their coach during a play clock?',
        a: 'Teams may huddle on the sideline with their coach to get a play call, but the play clock does not stop once the ball is signaled Ready to Play.',
      },
      {
        q: 'Who is responsible for fan behavior?',
        a: 'The coach is responsible for their fans\' conduct and all associated team members in the designated team area. Unsportsmanlike fan behavior can result in a penalty on the head coach.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: true,
    tournamentNote: 'Tournament play: only 2 coaches permitted on the sideline. Coaches must remain on the sideline except to attend to an injured player.',
  },

  // ─────────────────────────────────────────────
  // PAGE 12 — Live ball / dead ball
  // ─────────────────────────────────────────────
  {
    id: 'live-dead-ball',
    pageNumber: 12,
    section: 'LIVEPLAY',
    title: 'Live ball / dead ball',
    body: 'The ball is live from the snap until the referee whistles it dead. Knowing every dead ball trigger is essential — you must blow the whistle decisively and at exactly the right moment.',
    expandedBody: 'Any official can whistle the play dead. If an inadvertent whistle (IW) occurs, the team in possession has two options: take the ball where the whistle blew (down counts) or replay the down from the original LOS. If an IW occurs on the last play of a half or game, the offense gets one untimed down with those same two options.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section IX: Live Ball/Dead Ball', page: 8 },
    faqs: [
      {
        q: 'Is a fumble a live ball?',
        a: 'Only until ground contact is made. A fumble (loss of possession resulting in ball touching the ground) is dead at the spot where ground contact occurs.',
      },
      {
        q: 'Can a defender enter the neutral zone before the snap?',
        a: 'No. It is an automatic dead ball foul. Officials may give a courtesy neutral zone notification before enforcing, allowing players to reset.',
      },
      {
        q: 'What happens if a receiver catches the ball with 1 or 0 flags?',
        a: 'The play is dead immediately at the catch spot — a player with 1 or 0 flags who gains possession causes an automatic dead ball.',
      },
    ],
    deadBallTriggers: [
      'Ball hits the ground',
      'Ball-carrier\'s flag is pulled',
      'Ball-carrier steps out of bounds',
      'Touchdown, PAT, or safety is scored',
      'Ball-carrier\'s knee, shin, leg, forearm or arm hits the ground',
      'Ball-carrier\'s flag falls out',
      'Receiver catches ball while in possession of 1 or 0 flags',
      '7-second pass clock expires',
      'Inadvertent whistle',
      'Ball-carrier leaves feet to dive, jump or hurdle a player',
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 13 — Running the ball
  // ─────────────────────────────────────────────
  {
    id: 'running',
    pageNumber: 13,
    section: 'LIVEPLAY',
    title: 'Running the ball',
    body: 'Running rules in NFL Flag are restrictive compared to tackle football. Referees must know the quarterback\'s limitations, no-run zone enforcement, and the distinction between legal and illegal ball advancement.',
    expandedBody: 'No blocking or screening is ever allowed in NFL Flag. Offensive players near the ball carrier must stop motion once the ball crosses the LOS — running alongside the carrier is illegal. Once the ball is advanced beyond the LOS, only the current ball carrier may possess the ball until the play is dead.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section X: Running', page: 9 },
    faqs: [
      {
        q: 'Can the quarterback run with the ball?',
        a: 'No. The quarterback cannot directly run with the ball across the LOS. The QB is the player who receives the snap under center or in shotgun formation.',
      },
      {
        q: 'What is the "center sneak" play and is it legal?',
        a: 'Illegal. The QB may not handoff, pitch, or lateral the ball first to the center. Any center sneak attempt is a dead ball foul.',
      },
      {
        q: 'Can a runner jump to avoid a defender?',
        a: 'Runners may not jump, leap, or hurdle in the official\'s judgement to advance the ball. The play is blown dead and ball spotted where the jump occurred. Exception: a player can dive to catch a pass or pull a flag.',
      },
      {
        q: 'What happens once the ball is handed off behind the LOS?',
        a: 'The 7-second pass clock is eliminated and ALL defensive players may immediately rush the ball carrier.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 14 — Passing rules
  // ─────────────────────────────────────────────
  {
    id: 'passing',
    pageNumber: 14,
    section: 'LIVEPLAY',
    title: 'Passing rules',
    body: 'Only one forward pass per play is permitted, thrown from behind the LOS. The quarterback has a 7-second pass clock. These are among the most frequently called violations in NFL Flag.',
    expandedBody: 'There is no intentional grounding in NFL Flag — the QB may throw the ball anywhere across the LOS to avoid a sack. Shovel passes are legal and must originate from behind the LOS and be received beyond the LOS. Unlimited backward passes are permitted behind the LOS.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section XI: Passing', page: 10 },
    faqs: [
      {
        q: 'What happens when the 7-second pass clock expires?',
        a: 'The play is dead, the down counts, and the ball returns to the LOS. If the QB is in the end zone at the 7-second mark, the ball returns to the LOS — not a safety.',
      },
      {
        q: 'Is it legal to throw a forward pass that doesn\'t cross the LOS?',
        a: 'No — it is an illegal forward pass unless touched by a defender. All forward passes must go beyond the LOS.',
      },
      {
        q: 'What if the QB throws the ball and then catches it themselves?',
        a: 'The play is dead and treated as an incomplete pass.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 15 — Receiving & interceptions
  // ─────────────────────────────────────────────
  {
    id: 'receiving',
    pageNumber: 15,
    section: 'LIVEPLAY',
    title: 'Receiving & interceptions',
    body: 'All players are eligible receivers in NFL Flag — including the QB after a handoff. Referees must judge inbound possession and know interception return rules accurately.',
    expandedBody: 'In cases of simultaneous possession by both an offensive and a defensive player, possession is awarded to the offense. This is an important judgment call that referees must be ready to make quickly and confidently.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section XII: Receiving', page: 10 },
    faqs: [
      {
        q: 'Can the QB receive a pass?',
        a: 'Yes — if the ball has been handed off, pitched, or lateraled behind the LOS, the QB becomes an eligible receiver.',
      },
      {
        q: 'What counts as a legal catch?',
        a: 'At least one foot or other body part (not a hand) must contact the ground in bounds while maintaining possession.',
      },
      {
        q: 'Are interceptions returnable?',
        a: 'Yes. A returned interception for a score during regular play is worth 6 points. During a PAT conversion or overtime, it is worth 2 points.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 16 — Rushing the passer
  // ─────────────────────────────────────────────
  {
    id: 'rushing',
    pageNumber: 16,
    section: 'LIVEPLAY',
    title: 'Rushing the passer',
    body: 'Defensive rushers must start from the 7-yard rush line and identify themselves before the snap. Up to 2 players may rush. This is one of the most rule-dense areas of the game — knowing legal vs illegal rush is critical.',
    expandedBody: 'The offense cannot impede the rusher\'s pre-set path to the QB. The path is set pre-snap from the rusher directly to the QB and does not move when the QB moves. A moving offensive player in the path must avoid the rusher — contact is the offense\'s responsibility. A stationary offensive player is the rusher\'s responsibility to avoid.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section XIII: Rushing the Passer', page: 11 },
    faqs: [
      {
        q: 'How does a rusher identify themselves?',
        a: 'Rushers MUST raise their hand before the snap. Failure to identify is not itself a penalty, but an unidentified player rushing is an illegal rush.',
      },
      {
        q: 'Can a rusher delay their rush?',
        a: 'No. Rushers MUST rush the passer immediately after the snap. Delayed rush is not permitted.',
      },
      {
        q: 'What is a sack and when is a safety awarded?',
        a: 'A sack occurs when the QB\'s flags are pulled behind the LOS. A 2-point safety is awarded if the flag pull occurs in the offensive team\'s own end zone.',
      },
      {
        q: 'Can the defense rush after a handoff?',
        a: 'Yes — once the ball is handed off, pitched, or lateraled behind the LOS, ALL defensive players may cross the LOS immediately.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: true,
    tournamentNote: 'Regular season 8U/7U/6U and 1st–3rd grade: defenders may NOT rush the passer unless a legal handoff has occurred in the backfield. Tournament 8U and up: rushers may rush at the snap from the 7-yard rush line.',
  },

  // ─────────────────────────────────────────────
  // PAGE 17 — Flag pulling rules
  // ─────────────────────────────────────────────
  {
    id: 'flag-pulling',
    pageNumber: 17,
    section: 'LIVEPLAY',
    title: 'Flag pulling rules',
    body: 'Flag pulling is the core tackle mechanic of NFL Flag. A legal flag pull ends a play — but there are several illegal acts around flag pulling that referees must be ready to call.',
    expandedBody: 'Flag guarding — when a ball carrier obstructs a defender\'s access to their flags — is one of the most commonly missed calls in youth NFL Flag. Watch for stiff arms, elbow drops, using the ball as a shield, or intentionally tucking the jersey over the flags.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section XIV: Flag Pulling', page: 12 },
    faqs: [
      {
        q: 'Can a defender tackle the ball carrier while pulling the flag?',
        a: 'No. Defenders cannot tackle, hold, or run through the ball carrier when pulling flags. Only the flag may be pulled.',
      },
      {
        q: 'What if a flag falls off accidentally?',
        a: 'If the ball carrier\'s flag falls off during a play while they have possession, they are down immediately and the ball is placed where the flag lands.',
      },
      {
        q: 'Can a defender pull flags from a player who doesn\'t have the ball?',
        a: 'No. A defensive player may not intentionally pull the flag(s) of a player who is not in possession of the ball — this is a penalty.',
      },
      {
        q: 'Is it legal to dive to pull a flag?',
        a: 'Yes. Defenders can dive to pull flags — this is one of the explicit exceptions to the no-diving rule for ball carriers.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 18 — Formations & motion
  // ─────────────────────────────────────────────
  {
    id: 'formations',
    pageNumber: 18,
    section: 'LIVEPLAY',
    title: 'Formations & motion',
    body: 'NFL Flag has specific formation requirements and motion rules that referees must enforce at the snap. False starts and illegal motion are common violations that affect game flow.',
    expandedBody: 'All players who shift positions must reset for 1 full second before the snap. Only one player may be in motion when the ball is snapped, and that motion must be parallel or backwards to the LOS — never forward.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section XV: Formations', page: 13 },
    faqs: [
      {
        q: 'How many players can be on the line of scrimmage?',
        a: 'Minimum 1 (the center), maximum 4. The QB must be off the LOS.',
      },
      {
        q: 'What is a false start?',
        a: 'Any movement simulating the snap by a player who is already set. This is an automatic penalty — call it immediately.',
      },
      {
        q: 'Can multiple players go in motion before the snap?',
        a: 'No — only one player may be in motion when the ball is snapped. More than one person moving is illegal motion.',
      },
      {
        q: 'How must the center snap the ball?',
        a: 'With a rapid and continuous motion between their legs to a player in the backfield. The ball must completely leave the center\'s hands.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 19 — Unsportsmanlike conduct
  // ─────────────────────────────────────────────
  {
    id: 'unsportsmanlike',
    pageNumber: 19,
    section: 'CONDUCT',
    title: 'Unsportsmanlike conduct',
    body: 'Intentional physical play and confrontational language are immediate grounds for ejection. Referees have full discretion to stop the game and eject any player — no appeals are considered.',
    expandedBody: 'Two unsportsmanlike penalties on any single player or coach in a game result in automatic disqualification and may lead to additional discipline from the league. Coaches are responsible for their fans\' behavior — poor fan conduct can result in a penalty on the head coach.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section XVI: Unsportsmanlike Conduct', page: 13 },
    faqs: [
      {
        q: 'What qualifies as unsportsmanlike conduct?',
        a: 'Intentional tackling, elbowing, cheap shots, blocking, offensive or confrontational language, verbal or physical abuse of opponents, coaches, or officials.',
      },
      {
        q: 'Can a player appeal an ejection?',
        a: 'No. The decision to eject is at the game official\'s sole discretion. No appeals will be considered on the field.',
      },
      {
        q: 'What are the penalty yardages for unsportsmanlike conduct?',
        a: 'Defensive: +10 yards from dead ball spot and automatic first down. Offensive: -10 yards from dead ball spot and loss of down.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 20 — Defensive penalties
  // ─────────────────────────────────────────────
  {
    id: 'defensive-penalties',
    pageNumber: 20,
    section: 'CONDUCT',
    title: 'Defensive penalties',
    body: 'Defensive penalties generally result in yardage gains for the offense and automatic first downs. Know every call and its exact enforcement before you take the field.',
    expandedBody: 'All penalties are assessed from the LOS unless noted as a spot foul. Spot fouls administered in the end zone: Defensive — ball placed on the 1-yard line with a first down. Only the team captain or head coach may question rule interpretations. Games or halves may not end on a defensive penalty unless the offense declines it.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section XVII: Penalties', page: 14 },
    faqs: [
      {
        q: 'What is defensive pass interference?',
        a: 'Automatic first down — it is a spot foul. The ball is placed at the spot of the foul.',
      },
      {
        q: 'What is an illegal rush?',
        a: 'When a rusher starts their rush from inside the 7-yard marker. Penalty: +5 yards from LOS and automatic first down.',
      },
      {
        q: 'What is roughing the passer?',
        a: 'Any contact with the QB during a rush that is not ruled incidental by the official. Penalty: +5 yards from LOS and automatic first down.',
      },
    ],
    penaltyTable: [
      { type: 'spot', foul: 'Defensive pass interference', result: 'Automatic first down' },
      { type: 'spot', foul: 'Holding / Illegal contact', result: '+5 yards and automatic first down' },
      { type: 'spot', foul: 'Stripping', result: '+5 yards and automatic first down' },
      { type: 'general', foul: 'Defensive unnecessary roughness', result: '+10 yards and automatic first down' },
      { type: 'general', foul: 'Defensive unsportsmanlike conduct', result: '+10 yards and automatic first down' },
      { type: 'general', foul: 'Offside / illegal substitution', result: '+5 yards from LOS and automatic first down' },
      { type: 'general', foul: 'Illegal rush (inside 7-yard marker)', result: '+5 yards from LOS and automatic first down' },
      { type: 'general', foul: 'Illegal flag pull (before receiver has ball)', result: '+5 yards from LOS and automatic first down' },
      { type: 'general', foul: 'Roughing the passer', result: '+5 yards from LOS and automatic first down' },
      { type: 'general', foul: 'Taunting', result: '+10 yards from LOS and automatic first down' },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 21 — Offensive penalties
  // ─────────────────────────────────────────────
  {
    id: 'offensive-penalties',
    pageNumber: 21,
    section: 'CONDUCT',
    title: 'Offensive penalties',
    body: 'Offensive penalties result in yardage loss and a loss of down. These are the calls coaches are most likely to dispute — know the exact rule language for each one.',
    expandedBody: 'Penalties are assessed live ball first, then dead ball. Live ball penalties must be enforced before the down is considered complete. When penalty yardage exceeds half the distance to the goal, the penalty is assessed at half the distance instead.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section XVII: Penalties', page: 14 },
    faqs: [
      {
        q: 'What is flag guarding as a penalty?',
        a: 'Offensive spot foul: -5 yards from the spot and loss of down.',
      },
      {
        q: 'What counts as illegal motion?',
        a: 'More than one player moving before the snap. Penalty: -5 yards from LOS and loss of down.',
      },
      {
        q: 'What is impeding the rusher?',
        a: 'When an offensive player disrupts the rusher\'s pre-set path to the QB. Penalty: -5 yards from LOS and loss of down.',
      },
    ],
    penaltyTable: [
      { type: 'spot', foul: 'Screening or blocking', result: '-5 yards and loss of down' },
      { type: 'spot', foul: 'Charging', result: '-5 yards and loss of down' },
      { type: 'spot', foul: 'Flag guarding', result: '-5 yards and loss of down' },
      { type: 'spot', foul: 'Holding / Illegal contact', result: '-5 yards and loss of down' },
      { type: 'general', foul: 'Offensive unnecessary roughness', result: '-10 yards and loss of down' },
      { type: 'general', foul: 'Offensive unsportsmanlike conduct', result: '-10 yards and loss of down' },
      { type: 'general', foul: 'Offside / false start / illegal substitution', result: '-5 yards from LOS and loss of down' },
      { type: 'general', foul: 'Illegal forward pass', result: '-5 yards from LOS and loss of down' },
      { type: 'general', foul: 'Offensive pass interference', result: '-5 yards from LOS and loss of down' },
      { type: 'general', foul: 'Illegal motion (more than 1 moving)', result: '-5 yards from LOS and loss of down' },
      { type: 'general', foul: 'Delay of game', result: '-5 yards from LOS and loss of down' },
      { type: 'general', foul: 'Impeding the rusher', result: '-5 yards from LOS and loss of down' },
      { type: 'general', foul: 'Illegal procedure', result: '-5 yards from LOS and loss of down' },
      { type: 'general', foul: 'Taunting', result: '-10 yards from LOS and loss of down' },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 22 — 8U / 2nd & 3rd grade rules
  // ─────────────────────────────────────────────
  {
    id: '8u-rules',
    pageNumber: 22,
    section: 'AGEGROUPS',
    title: '8U / 2nd & 3rd grade rules',
    body: 'The 8U division (and equivalent 2nd & 3rd grade divisions) has modified rules designed to help younger players learn the game. Several standard rules are adjusted or removed.',
    expandedBody: 'These rule modifications are NFL FLAG recommended and adopted adjustments proven successful among RCX grade-based leagues and NFL leagues nationwide. They are designed to prioritize teaching over competition at the youngest levels.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section XVIII: 8U, 7U & 6U Guidelines', page: 15 },
    faqs: [
      {
        q: 'Are no-run zones enforced in 8U regular season?',
        a: 'No. No-run zones are eliminated in 8U regular season. Teams may run anywhere on the field. However, in 8U tournament play, no-run zones ARE in effect.',
      },
      {
        q: 'Can defenders rush the passer in 8U?',
        a: 'In regular season only: defenders may NOT rush the passer unless a legal handoff has been executed in the backfield. In tournament play, rushers may rush at the snap.',
      },
      {
        q: 'Can coaches be on the field in 8U?',
        a: 'In regular season: one coach per team is permitted on the field pre-snap to help players, but MUST be off the field before the snap. In tournament play, coaches must remain on the sideline.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: true,
    tournamentNote: '8U tournament play: no-run zones ARE in effect. Coaches must remain on the sideline. Rushers may rush at the snap from the 7-yard rush line.',
  },

  // ─────────────────────────────────────────────
  // PAGE 23 — 7U / 6U / 1st grade & below
  // ─────────────────────────────────────────────
  {
    id: '7u-6u-rules',
    pageNumber: 23,
    section: 'AGEGROUPS',
    title: '7U / 6U / 1st grade & below',
    body: 'The youngest divisions have the most modified rules. The focus is entirely on learning fundamentals — safety, participation, and enjoyment take priority over strict rule enforcement.',
    expandedBody: 'Referees officiating these age groups must exercise maximum patience and discretion. The "Do Over" rule for bad snaps exists to keep the game moving without punishing players for mechanics they are still learning.',
    rulebookRef: { label: 'NFL Flag Rulebook — Section XVIII: 8U, 7U & 6U Guidelines', page: 15 },
    faqs: [
      {
        q: 'What is the "Do Over" rule?',
        a: 'If the ball falls to or touches the ground during the initial center-to-QB exchange, the play is ruled a Do Over with no loss of down — once per down. On a second consecutive occurrence, the down is consumed.',
      },
      {
        q: 'How far must defenders line up from the LOS in 7U/6U?',
        a: 'At least 5 yards from the LOS before the snap. If the ball is spotted on or inside the 5-yard line, the distance reduces to 3 yards.',
      },
      {
        q: 'Can coaches be on the field during the play in 7U/6U?',
        a: 'Yes — one coach per team is permitted on the field pre AND post snap, but must maintain a safe distance from the play in progress.',
      },
    ],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
  },

  // ─────────────────────────────────────────────
  // PAGE 24 — What's next — Contact Coach Goddie
  // ─────────────────────────────────────────────
  {
    id: 'closing',
    pageNumber: 24,
    section: 'CLOSING',
    title: "You're ready, referee",
    body: "You've completed the full NFL Flag Referee Guide. You now have the knowledge to officiate with confidence — from the coin toss to the final whistle. Keep this guide bookmarked for pre-game refreshers.",
    expandedBody: 'Remember: the best referees are consistent, calm, and clear. Players and coaches respect decisive officiating more than hesitant perfection. Know the rules, trust your judgment, and keep the game moving.',
    rulebookRef: null,
    faqs: [],
    images: [],
    videoUrl: null,
    tournamentCallout: false,
    closingCTA: {
      message: 'Questions about the rules, referee training, or getting your league started? Reach out to Coach Goddie.',
      creator: {
        name: 'Coach Goddie',
        tagline: 'Flag coach, educator & platform creator',
        socials: [
          { platform: 'tiktok', url: 'https://www.tiktok.com/@saharansub', label: 'TikTok' },
          { platform: 'youtube', url: 'https://www.youtube.com/channel/UC71G7RIUgg90Em-NASXAY0A', label: 'YouTube' },
          { platform: 'linkedin', url: 'https://www.linkedin.com/in/godwin-france/', label: 'LinkedIn' },
          { platform: 'twitter', url: 'https://x.com/godwin_france', label: 'Twitter / X' },
        ],
      },
    },
  },
];

export const TOTAL_PAGES = NFL_GUIDE_PAGES.length;