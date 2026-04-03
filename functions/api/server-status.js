export async function onRequest() {
  const SERVER = 'http://fivem-mochi.kr:30120';

  try {
    const [playersRes, infoRes] = await Promise.allSettled([
      fetch(`${SERVER}/players.json`, { signal: AbortSignal.timeout(5000) }),
      fetch(`${SERVER}/info.json`, { signal: AbortSignal.timeout(5000) }),
    ]);

    let players = [], maxPlayers = 64, online = false;

    if (playersRes.status === 'fulfilled' && playersRes.value.ok) {
      players = await playersRes.value.json();
      online = true;
    }
    if (infoRes.status === 'fulfilled' && infoRes.value.ok) {
      const info = await infoRes.value.json();
      maxPlayers = info?.vars?.sv_maxClients || 64;
      online = true;
    }

    return new Response(JSON.stringify({ online, current: players.length, max: Number(maxPlayers) }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch {
    return new Response(JSON.stringify({ online: false, current: 0, max: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
