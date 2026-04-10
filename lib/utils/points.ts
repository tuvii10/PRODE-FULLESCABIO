export function calcPoints(
  pHome: number, pAway: number,
  mHome: number, mAway: number
): number {
  if (pHome === mHome && pAway === mAway) return 3;
  const predWinner = Math.sign(pHome - pAway);
  const realWinner = Math.sign(mHome - mAway);
  if (predWinner === realWinner) return 1;
  return 0;
}

export function stageName(stage: string): string {
  const map: Record<string, string> = {
    group:   'Fase de Grupos',
    round16: 'Octavos de Final',
    quarter: 'Cuartos de Final',
    semi:    'Semifinal',
    third:   'Tercer Puesto',
    final:   'Final',
  };
  return map[stage] ?? stage;
}

export function flagUrl(code: string | null): string {
  if (!code) return '/placeholder-flag.svg';
  return `https://flagcdn.com/48x36/${code.toLowerCase()}.png`;
}
