import { supabase } from '../../../../lib/supabase';

const MOCK_EVENTS = [
  {
    title: "Galgotias NVIDIA DGX H200 AI Sprint 2026",
    date: "2026-09-01T09:00:00",
    location: "Galgotias University C-Block Auditorium",
    is_featured: true,
    description: "24-hour GPU coding sprint to optimize LLM training kernels."
  },
  {
    title: "CUDA Optimization and Parallel Programming Workshop",
    date: "2026-10-15T14:30:00",
    location: "C-Block Lab 302",
    is_featured: false,
    description: "Learn warp divergence elimination and shared memory allocation in CUDA C++."
  },
  {
    title: "Deep Learning Institute: LLM Quantization Sprints",
    date: "2026-11-10T10:00:00",
    location: "Online / Hybrid",
    is_featured: false,
    description: "Implement AWQ and GPTQ quantization on custom Llama-3 models."
  }
];

export default async function eventsHandler(args = []) {
  const showOnlyFeatured = args.includes('--featured');
  
  let events = [];
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
      
    if (error || !data || data.length === 0) {
      events = MOCK_EVENTS;
    } else {
      events = data;
    }
  } catch (err) {
    events = MOCK_EVENTS;
  }

  // Filter if featured flag is passed
  if (showOnlyFeatured) {
    events = events.filter(e => e.is_featured);
  }

  if (events.length === 0) {
    return 'No events found.';
  }

  // Format date helper
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
