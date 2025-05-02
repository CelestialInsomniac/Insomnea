require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Konfiguration mit Umgebungsvariablen aus .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Beispiel-Upload
const imagePath = path.join(__dirname, 'assets/fineart/Gouldianfinch.png');

cloudinary.uploader.upload(imagePath, {
    folder: 'concept-art'
})
    .then(result => {
        console.log('Upload erfolgreich!');
        console.log(result.secure_url); // URL zum Bild
    })
    .catch(err => {
        console.error('Fehler beim Upload:', err);
    });
