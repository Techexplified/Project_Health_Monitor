// Trello Power-Up Client Library Bridge
import { getMemberColor } from './utils/healthCalculator';

export function isInsideTrello() {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function getTrelloContext() {
  if (typeof window === 'undefined') return null;
  if (!isInsideTrello()) return null;

  if (window.TrelloPowerUp && typeof window.TrelloPowerUp.iframe === 'function') {
    try {
      return window.TrelloPowerUp.iframe();
    } catch (e) {
      console.warn('Could not initialize Trello iframe context:', e);
      return null;
    }
  }
  return null;
}

export async function waitForTrelloContext(timeoutMs = 4000) {
  if (typeof window === 'undefined') return null;
  if (!isInsideTrello()) return null;

  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const t = getTrelloContext();
    if (t) return t;
    await new Promise(resolve => setTimeout(resolve, 50));
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
    // 1. Fetch Board information & members
    let board = {};
    try {
      board = await t.board('id', 'name', 'url', 'members');
    } catch (e) {
      try {
        board = await t.board('all');
      } catch (e2) {
        try {
          board = await t.board('id', 'name', 'url');
        } catch (e3) {
          console.warn('Could not fetch board info:', e3);
        }
      }
    }

    // 2. Fetch Lists
    let lists = [];
    try {
      lists = await t.lists('id', 'name');
    } catch (e) {
      try {
        lists = await t.lists('all');
      } catch (e2) {
        console.warn('Could not fetch lists:', e2);
      }
    }

    // 3. Fetch Cards
    // In Trello Power-Up client library, t.cards('all') retrieves all visible cards with full properties.
    // Explicit list of allowed fields excludes 'idMembers' to prevent client SDK rejection.
    let cards = [];
    try {
      cards = await t.cards('all');
    } catch (e) {
      console.warn("t.cards('all') failed, attempting explicit fields:", e);
      try {
        cards = await t.cards('id', 'name', 'idList', 'due', 'dueComplete', 'labels', 'url', 'members', 'badges');
      } catch (e2) {
        console.warn("t.cards explicit failed, attempting basic fields:", e2);
        try {
          cards = await t.cards('id', 'name', 'idList', 'due', 'dueComplete', 'url');
        } catch (e3) {
          console.error('Could not fetch cards from Trello:', e3);
        }
      }
    }

    // 4. Extract Board Members
    let members = Array.isArray(board?.members) ? board.members : [];
    if (members.length === 0) {
      try {
        const memObj = await t.board('members');
        if (memObj && Array.isArray(memObj.members)) {
          members = memObj.members;
        }
      } catch (e) {}
    }

    // Normalize member objects to match UI expectation
    const normalizedMembers = members.map(m => ({
      id: m.id,
      name: m.fullName || m.username || 'Member',
      username: m.username ? `@${m.username}` : '',
      initials: (m.initials || m.fullName?.slice(0, 2) || m.username?.slice(0, 2) || 'TM').toUpperCase(),
      avatar: m.avatar || m.avatarUrl || null,
      avatarColor: getMemberColor(m.id || m.fullName || m.username)
    }));

    // Normalize cards to ensure id, name/title, url, and member references are standardized
    const normalizedCards = (cards || []).map(c => {
      // Ensure URL is a valid Trello URL
      let url = c.url;
      if (!url || url === '#') {
        if (c.shortLink) {
          url = `https://trello.com/c/${c.shortLink}`;
        } else if (c.id) {
          url = `https://trello.com/c/${c.id}`;
        } else {
          url = '#';
        }
      }

      // Member IDs
      let idMembers = [];
      if (Array.isArray(c.idMembers)) {
        idMembers = c.idMembers;
      } else if (Array.isArray(c.members)) {
        idMembers = c.members.map(m => (typeof m === 'object' && m ? m.id : m)).filter(Boolean);
      }

      return {
        ...c,
        id: c.id,
        name: c.name || c.title || 'Untitled Card',
        title: c.name || c.title || 'Untitled Card',
        idList: c.idList,
        due: c.due || null,
        dueComplete: Boolean(c.dueComplete || c.badges?.dueComplete),
        labels: Array.isArray(c.labels) ? c.labels : [],
        idMembers,
        members: Array.isArray(c.members) ? c.members : [],
        url
      };
    });

    return {
      boardName: board?.name || 'My Trello board',
      boardUrl: board?.url || '#',
      cards: normalizedCards,
      lists: lists || [],
      members: normalizedMembers
    };
  } catch (err) {
    console.error('Error fetching Trello board data:', err);
    return null;
  }
}
