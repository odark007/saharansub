// js/data/learnToPlayData.js
// ─────────────────────────────────────────────────────────────
// All Learn to Play content lives here.
// To add a track: push a new object into LTP_TRACKS.
// To add a lesson: push into the track's lessons array.
// To swap in real content: update videoUrl, body, and images.
//
// IMAGE PATHS: relative to learn-to-play.html
//   e.g. '../images/my-image.jpg'  (images/ is sibling to flag-football-platform/)
//
// VIDEO URLS: full YouTube URL or YouTube embed URL
//   e.g. 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
// ─────────────────────────────────────────────────────────────

export const LTP_TRACKS = [

  // ────────────────────────────────────────────
  // TRACK 1 — Intro to Flag Football
  // Coach: Coach Goddie
  // ────────────────────────────────────────────
  {
    id:          'goddie-intro',
    title:       'Intro to Flag Football',
    coach:       'Coach Goddie',
    emoji:       '<i class="fa-solid fa-football" aria-hidden="true"></i>',
    color:       '#E1F5EE',
    accentColor: '#085041',
    description: 'Start here. Coach Goddie walks you through the fundamentals of flag football from the ground up — perfect for new players, parents, and first-time coaches.',
    lessons: [

      {
        id:         'what-is-flag',
        title:      'What is flag football?',
        duration:   '4:20',
        types:      ['video', 'text'],
        videoUrl:   'https://www.youtube.com/watch?v=z-NvsNMgvpM',
        videoLabel: 'Coach Goddie introduces flag football',
        body: [
          'Flag football is a non-contact version of American football where the ball carrier\'s flags are pulled to end a play instead of tackling. It\'s played by millions of kids, teens, and adults worldwide.',
          'Unlike tackle football, flag football removes the physical contact — making it safer, faster, and accessible to all ages and skill levels. The NFL Flag program is one of the most widely played youth sports in the United States.',
          'In this series, Coach Goddie breaks down everything you need to know — from the rules of the game to how to play your best on the field.',
        ],
        images: [],
      },

      {
        id:         'the-field',
        title:      'The playing field explained',
        duration:   '6:10',
        types:      ['video', 'image'],
        videoUrl:   'https://www.youtube.com/watch?v=PLACEHOLDER_002',
        videoLabel: 'Field layout walkthrough with Coach Goddie',
        body: [
          'The NFL Flag field is 70 yards long by 25 yards wide (Option A) or 64 yards long by 25 yards wide (Option B). Both options have the same core layout.',
          'At each end is a 10-yard (or 7-yard) end zone. The midfield line is the first-down marker — your offense has 4 downs to cross it, then 3 more to score.',
          'Two no-run zones sit 5 yards before midfield and 5 yards before the end zone. Inside these zones, all plays must result in a forward pass. Knowing where these lines are is crucial for every player on the field.',
        ],
        images: [
          { src: '../images/field-diagram.jpg', alt: 'NFL Flag field diagram showing end zones, midfield and no-run zones' },
        ],
      },

      {
        id:         'roles-on-field',
        title:      'Roles on the field',
        duration:   '5:45',
        types:      ['video', 'text'],
        videoUrl:   'https://www.youtube.com/watch?v=PLACEHOLDER_003',
        videoLabel: 'Offensive and defensive roles explained',
        body: [
          'Every NFL Flag game has two teams — offense and defense. The offense has possession of the ball and tries to advance it into the end zone to score. The defense tries to stop them.',
          'On offense, the quarterback receives the snap and either throws, hands off, or runs (though the QB cannot run past the line of scrimmage directly). All other players on offense are eligible to receive a pass — even after a handoff.',
          'On defense, up to two players can rush the quarterback from the 7-yard rush line. Rushers must raise their hand before the snap and rush immediately — no delayed rush is allowed. All other defenders protect their end of the field.',
        ],
        images: [],
      },

      {
        id:         'scoring-and-downs',
        title:      'Scoring & downs',
        duration:   '4:55',
        types:      ['video', 'text', 'image'],
        videoUrl:   'https://www.youtube.com/watch?v=PLACEHOLDER_004',
        videoLabel: 'How scoring works in NFL Flag',
        body: [
          'A touchdown is worth 6 points. After scoring, the team must immediately declare whether they want to attempt a 1-point conversion (from the 5-yard line, pass only) or a 2-point conversion (from the 10-yard line, run or pass).',
          'A safety is worth 2 points and occurs when the ball carrier is downed in their own end zone.',
          'Each possession starts at the offense\'s own 5-yard line. You have 4 downs to cross midfield. Once you\'ve crossed midfield, you have 3 downs to score. Fail to cross midfield or score and possession changes.',
        ],
        images: [
          { src: '../images/scoring-chart.jpg', alt: 'NFL Flag scoring values chart' },
        ],
      },

      {
        id:         'flag-pulling-basics',
        title:      'Flag pulling basics',
        duration:   '7:00',
        types:      ['video', 'text'],
        videoUrl:   'https://www.youtube.com/watch?v=PLACEHOLDER_005',
        videoLabel: 'Legal and illegal flag pulling techniques',
        body: [
          'A legal flag pull happens when the defender removes the ball carrier\'s flag while the carrier is in full possession of the ball. The ball is spotted where the carrier was when the flag was pulled.',
          'Flag guarding is illegal — this is when the ball carrier uses their arm, shoulder, elbow, or the ball itself to block a defender from pulling their flag. Referees watch for stiff arms and deliberate covering of the belt.',
          'Defenders can dive to pull flags, but cannot tackle, hold, or run through the ball carrier. If a flag falls off accidentally during a play, the carrier is immediately down at that spot.',
        ],
        images: [],
      },

    ],
  },

  // ────────────────────────────────────────────
  // TRACK 2 — Rules Deep Dive
  // (Placeholder — content to be added)
  // ────────────────────────────────────────────
  {
    id:          'rules-deep-dive',
    title:       'Rules Deep Dive',
    coach:       'Rules Series',
    emoji:       '<i class="fa-solid fa-clipboard-list" aria-hidden="true"></i>',
    color:       '#EEF3FE',
    accentColor: '#3C3489',
    description: 'A structured walkthrough of the official NFL Flag rulebook — ideal for referees and coaches who want to know every rule precisely and confidently.',
    lessons: [

      {
        id:         'live-dead-ball',
        title:      'Live ball vs dead ball',
        duration:   '5:30',
        types:      ['text', 'image'],
        videoUrl:   null,
        videoLabel: null,
        body: [
          'The ball is live from the moment it is snapped until the referee whistles it dead. Every player on the field must know all 10 dead ball triggers to avoid costly mistakes.',
          'Key triggers: flag pulled, ball hits the ground, ball carrier steps out of bounds, score, knee or arm touches the ground, flag falls off, receiver catches with 0 or 1 flags, 7-second pass clock expires, or inadvertent whistle.',
          'If an inadvertent whistle occurs, the team in possession chooses: take the ball where the whistle blew (down counts) or replay the down from the original line of scrimmage.',
        ],
        images: [
          { src: '../images/dead-ball-triggers.jpg', alt: 'Dead ball triggers reference chart' },
        ],
      },

      {
        id:         'passing-receiving',
        title:      'Passing & receiving rules',
        duration:   '6:40',
        types:      ['video', 'text'],
        videoUrl:   'https://www.youtube.com/watch?v=PLACEHOLDER_006',
        videoLabel: 'Passing clock, shovel passes, and interceptions',
        body: [
          'Only one forward pass per play is permitted, thrown from behind the line of scrimmage. The quarterback has a 7-second pass clock — if no pass is thrown, the play is dead and the down counts.',
          'Shovel passes are legal — they must originate from behind the LOS and be received beyond it. There is no intentional grounding in NFL Flag; the QB can throw anywhere beyond the LOS to avoid a sack.',
          'All players are eligible receivers. A catch requires at least one foot or other body part (not a hand) to contact the ground in bounds while maintaining possession. Interceptions are returnable — a returned interception for a score is worth 6 points in regulation.',
        ],
        images: [],
      },

      {
        id:         'penalties-ref',
        title:      'Penalties reference',
        duration:   '8:10',
        types:      ['text', 'image'],
        videoUrl:   null,
        videoLabel: null,
        body: [
          'All penalties are assessed from the line of scrimmage unless noted as a spot foul. Only the team captain or head coach may question a penalty ruling.',
          'Key defensive penalties: pass interference (spot foul, automatic first down), illegal rush (+5 yds + first down), roughing the passer (+5 yds + first down), taunting (+10 yds + first down).',
          'Key offensive penalties: flag guarding (-5 yds, loss of down), false start (-5 yds, loss of down), illegal motion (-5 yds, loss of down), impeding the rusher (-5 yds, loss of down). Games or halves cannot end on a defensive penalty unless the offense declines it.',
        ],
        images: [
          { src: '../images/penalties-chart.jpg', alt: 'Full penalties reference chart' },
        ],
      },

    ],
  },

  // ────────────────────────────────────────────
  // TRACK 3 — Coaching Fundamentals
  // (Placeholder — content to be added)
  // ────────────────────────────────────────────
  {
    id:          'coaching-fundamentals',
    title:       'Coaching Fundamentals',
    coach:       'Coach Series',
    emoji:       '<i class="fa-solid fa-bullhorn" aria-hidden="true"></i>',
    color:       '#FAEEDA',
    accentColor: '#633806',
    description: 'For new and returning coaches — how to run a practice, manage game day, and communicate effectively with young players at every age group.',
    lessons: [

      {
        id:         'first-practice',
        title:      'Running your first practice',
        duration:   '9:00',
        types:      ['video', 'text'],
        videoUrl:   'https://www.youtube.com/watch?v=PLACEHOLDER_007',
        videoLabel: 'A complete 60-minute practice structure',
        body: [
          'A great first practice sets the tone for the entire season. Keep it simple, high-energy, and focused on fun — competitive drills can wait until week two.',
          'Recommended 60-minute structure: 10 minutes warm-up and introductions, 15 minutes flag pulling drills, 15 minutes route running basics, 15 minutes 3-on-3 scrimmage, 5 minutes cooldown and team talk.',
          'The most important thing you can do in practice is make sure every player touches the ball and every player pulls a flag. Involvement builds confidence faster than any drill.',
        ],
        images: [],
      },

      {
        id:         'communicating-youth',
        title:      'Communicating with young athletes',
        duration:   '5:15',
        types:      ['video', 'text'],
        videoUrl:   'https://www.youtube.com/watch?v=PLACEHOLDER_008',
        videoLabel: 'Age-appropriate coaching language',
        body: [
          'The way you talk to a 6-year-old is completely different from how you\'d coach a 14-year-old. Age-appropriate communication is one of the most important — and most overlooked — coaching skills.',
          'For 6U and 7U: use simple one-step instructions, lots of physical demonstration, and immediate positive reinforcement. Never use negative comparisons between players.',
          'For 10U and above: you can introduce more tactical language, but keep feedback specific and constructive. "Your route broke too early — try staying straight for two more steps" is better than "that was wrong."',
        ],
        images: [],
      },

    ],
  },

  // ────────────────────────────────────────────
  // TRACK 4 — Youth Age Group Rules
  // (Placeholder — content to be added)
  // ────────────────────────────────────────────
  {
    id:          'youth-age-rules',
    title:       'Youth Age Group Rules',
    coach:       'Age Groups',
    emoji:       '<i class="fa-solid fa-children" aria-hidden="true"></i>',
    color:       '#FAECE7',
    accentColor: '#712B13',
    description: '6U, 7U, and 8U divisions have modified rules. This track explains every difference clearly so coaches and referees know exactly what applies to each age group.',
    lessons: [

      {
        id:         '8u-rules',
        title:      '8U / 2nd & 3rd grade rules',
        duration:   '4:00',
        types:      ['text', 'image'],
        videoUrl:   null,
        videoLabel: null,
        body: [
          'The 8U division (and equivalent 2nd & 3rd grade groups) removes no-run zones in regular season play — teams may run the ball anywhere on the field. Note: no-run zones ARE in effect for 8U tournament play.',
          'Defenders may not rush the passer in regular season unless a legal handoff has already been executed in the backfield. In tournament play, rushers may rush at the snap from the 7-yard line.',
          'One coach per team is permitted on the field pre-snap to help their players, but must be off the field before the snap. In tournament play, coaches must remain on the sideline at all times.',
        ],
        images: [
          { src: '../images/8u-rules.jpg', alt: '8U rule modifications reference' },
        ],
      },

      {
        id:         '7u-6u-rules',
        title:      '7U / 6U / 1st grade & below',
        duration:   '4:30',
        types:      ['text', 'image'],
        videoUrl:   null,
        videoLabel: null,
        body: [
          'The youngest divisions prioritise learning over competition. No-run zones are eliminated — teams may run anywhere. Defenders may not rush the passer unless a legal handoff occurs in the backfield.',
          'The "Do Over" rule: if the ball touches the ground during the initial snap exchange, it\'s a Do Over with no loss of down — once per down. A second consecutive bad snap consumes the down.',
          'Defenders must line up at least 5 yards from the line of scrimmage before the snap. If the ball is spotted on or inside the 5-yard line, the distance reduces to 3 yards. One coach per team may remain on the field throughout the entire play.',
        ],
        images: [
          { src: '../images/7u-rules.jpg', alt: '7U and 6U rule modifications reference' },
        ],
      },

    ],
  },

];

// ─────────────────────────────────────────────
// Helper: flatten all lessons across all tracks
// Used by the live search
// ─────────────────────────────────────────────
export const LTP_ALL_LESSONS = LTP_TRACKS.flatMap(track =>
  track.lessons.map(lesson => ({
    ...lesson,
    trackId:          track.id,
    trackTitle:       track.title,
    trackColor:       track.color,
    trackAccentColor: track.accentColor,
  }))
);

// ─────────────────────────────────────────────
// Helper: get a track by id
// ─────────────────────────────────────────────
export function getTrack(trackId) {
  return LTP_TRACKS.find(t => t.id === trackId) || null;
}

// ─────────────────────────────────────────────
// Helper: get a lesson by track id + lesson id
// ─────────────────────────────────────────────
export function getLesson(trackId, lessonId) {
  const track = getTrack(trackId);
  if (!track) return null;
  return track.lessons.find(l => l.id === lessonId) || null;
}

// ─────────────────────────────────────────────
// Helper: get lesson index within its track
// ─────────────────────────────────────────────
export function getLessonIndex(trackId, lessonId) {
  const track = getTrack(trackId);
  if (!track) return -1;
  return track.lessons.findIndex(l => l.id === lessonId);
}
