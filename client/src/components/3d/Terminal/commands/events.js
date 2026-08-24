import { eventsService } from '../../../../services/supabaseService.js';

// Removed MOCK_EVENTS entirely to strictly rely on Supabase DB.

export default async function eventsHandler(args = []) {
  const showOnlyFeatured = args.includes('--featured');

  let events = [];
  try {
    events = await eventsService.getEvents();
  } catch (err) {
    // Only fallback if there's a real crash/error, not just an empty array
    events = [];
  }

  if (showOnlyFeatured) {
    events = events.filter(e => e.is_featured);
  }

  if (events.length === 0) {
    return 'No events found in the database.';
  }

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    } catch {
      return dateStr.substring(0, 10);
    }
  };

  let output = `UPCOMING CLUB EVENTS${showOnlyFeatured ? ' (FEATURED ONLY)' : ''}:\n`;
  output += `--------------------------------------------------------------------------------\n`;
  output += `${'DATE'.padEnd(14)} ${'EVENT TITLE'.padEnd(46)} ${'LOCATION'}\n`;
  output += `--------------------------------------------------------------------------------\n`;

  events.forEach(e => {
    const dateFormatted = formatDate(e.date);
    const title = e.title.length > 44 ? e.title.substring(0, 41) + '...' : e.title;
    const loc = e.location.length > 25 ? e.location.substring(0, 22) + '...' : e.location;
    output += `${dateFormatted.padEnd(14)} ${title.padEnd(46)} ${loc}\n`;
  });

  output += `--------------------------------------------------------------------------------\n`;
  output += `Tip: Use "events --featured" to filter featured items.`;

  return output;
}
