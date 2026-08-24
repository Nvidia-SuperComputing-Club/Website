import { teamService } from '../../../../services/supabaseService.js';

// Removed MOCK_TEAM entirely to strictly rely on Supabase DB.

export default async function teamHandler(args = []) {
  let members = [];
  try {
    const data = await teamService.getTeamMembers();
    members = data.filter(m => m.is_active !== false);
  } catch (err) {
    // Only fallback if the database actually crashes/errors, not if it's just empty
    members = [];
  }

  if (args.length > 0) {
    const query = args.join(' ').toLowerCase();
    const match = members.find(m => m.name.toLowerCase().includes(query) || m.role.toLowerCase().includes(query));

    if (!match) {
      return `Member matching "${args.join(' ')}" not found in active records.`;
    }

    let profile = `MEMBER PROFILE: ${match.name}\n`;
    profile += `--------------------------------------------------------------------------------\n`;
    profile += `Role:        ${match.role}\n`;
    if (match.department)   profile += `Department:  ${match.department}\n`;
    if (match.year)         profile += `Year:        ${match.year}\n`;
    if (match.github_url)   profile += `GitHub:      ${match.github_url}\n`;
    if (match.linkedin_url) profile += `LinkedIn:    ${match.linkedin_url}\n`;
    if (match.twitter_url)  profile += `Twitter/X:   ${match.twitter_url}\n`;
    if (match.email)        profile += `Email:       ${match.email}\n`;
    profile += `--------------------------------------------------------------------------------\n\n`;
    profile += `Bio:\n${match.bio || 'No bio listed.'}\n`;
    return profile;
  }

  let output = `NVIDIA-SC TEAM MEMBERS:\n`;
  output += `--------------------------------------------------------------------------------\n`;
  output += `${'NAME'.padEnd(28)} ${'ROLE'}\n`;
  output += `--------------------------------------------------------------------------------\n`;

  if (members.length === 0) {
    output += `No active team members found in the database.\n`;
  } else {
    members.forEach(m => {
      output += `${m.name.padEnd(28)} ${m.role}\n`;
    });
  }

  output += `--------------------------------------------------------------------------------\n`;
  output += `Tip: Use "team <name>" to inspect bio & social details (e.g., team daksh).`;

  return output;
}
