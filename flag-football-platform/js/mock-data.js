export const MOCK_RULEBOOKS = [
  {
    id: 'nfl_flag_2024',
    name: 'NFL Flag Rulebook',
    version: '2024',
    status: 'active',
    created_at: '2024-08-01T10:00:00.000Z'
  },
  {
    id: 'ifaf_2024',
    name: 'IFAF Rulebook',
    version: '2024',
    status: 'active',
    created_at: '2024-09-15T10:00:00.000Z'
  }
];

export const MOCK_STATS = {
  rulebooks: MOCK_RULEBOOKS.length,
  rules: 96,
  users: 1240
};
