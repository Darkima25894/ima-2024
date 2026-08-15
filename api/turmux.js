// api/termux.js
const API_KEYS = {
  // In production, store these in environment variables
  'tmx_vercel_key_12345': 'authorized'
};

export default function handler(req, res) {
  // CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-API-Key'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check API key
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || !API_KEYS[apiKey]) {
    return res.status(401).json({
      error: 'Invalid or missing API key',
      status: 401
    });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { command } = req.body;
  if (!command) {
    return res.status(400).json({
      error: 'Missing "command" field',
      status: 400
    });
  }

  // Execute command (simulated - in real scenario, you'd use a proper shell)
  // Note: Vercel doesn't allow child_process in serverless functions
  // This is a simulated response
  const output = executeSimulatedCommand(command);

  return res.status(200).json({
    status: 'success',
    command: command,
    output: output,
    timestamp: new Date().toISOString()
  });
}

function executeSimulatedCommand(command) {
  // Simple command simulation
  const parts = command.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase() || '';
  const args = parts.slice(1);

  const outputs = [];

  if (cmd === 'echo') {
    outputs.push(args.join(' '));
  } else if (cmd === 'ls') {
    outputs.push('file1.txt  file2.txt  directory/');
  } else if (cmd === 'pwd') {
    outputs.push('/home/termux');
  } else if (cmd === 'whoami') {
    outputs.push('termux-user');
  } else if (cmd === 'date') {
    outputs.push(new Date().toString());
  } else if (cmd === 'uname') {
    outputs.push('Linux termux-web 5.10.0 #1 SMP');
  } else if (cmd === 'help') {
    outputs.push('Available commands: echo, ls, cat, touch, rm, mkdir, cd, pwd, whoami, date, uname, help');
  } else {
    outputs.push(`command not found: ${cmd}`);
  }

  return outputs;
}