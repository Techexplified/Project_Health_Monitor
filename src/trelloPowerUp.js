// Trello Power-Up Client Library Bridge

export function isInsideTrello() {
  return typeof window !== 'undefined' && 
         window.parent !== window && 
         typeof window.TrelloPowerUp !== 'undefined';
}

export function getTrelloContext() {
  if (isInsideTrello()) {
    try {
      return window.TrelloPowerUp.iframe();
    } catch (e) {
      console.warn('Could not initialize Trello iframe context:', e);
      return null;
    }
  }
  return null;
}

export function autoSize(t) {
  if (t && typeof t.sizeTo === 'function') {
    try {
      t.sizeTo('#root').catch(() => {});
    } catch (e) {}
  }
}

export async function getBoardData(t) {
  if (!t) return null;

  try {
    const [board, cards, lists, members] = await Promise.all([
      t.board('id', 'name', 'url').catch(() => ({})),
      t.cards('id', 'name', 'idList', 'due', 'dueComplete', 'idMembers', 'labels', 'url').catch(() => []),
      t.lists('id', 'name').catch(() => []),
      t.board('members').then(b => b.members || []).catch(() => [])
    ]);

    return {
      boardName: board.name || 'Trello Board',
      boardUrl: board.url || '#',
      cards: cards || [],
      lists: lists || [],
      members: members || []
    };
  } catch (err) {
    console.error('Error fetching Trello board data:', err);
    return null;
  }
}
