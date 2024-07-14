import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 3000; 

dotenv.config();

app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: true }));

// Replace with your actual API key
const apiKey = process.env.API_ID;
const apiUrl = 'https://getthirukural.appspot.com/api/3.0/kural/'; 

let kuralNumber=1;

function getRandomKuralIndex() {
    return Math.floor(Math.random() * 1330) + 1;
  }

app.get('/', async (req, res) => {
    try {
        // let kuralNumber = Math.floor(Math.random() * 1330) + 1; 


        if (req.query.kuralNumber) {
            kuralNumber= parseInt(req.query.kuralNumber, 10);
          } else if (req.query.random) {
            kuralNumber = getRandomKuralIndex();
          }
        const response = await axios.get(`${apiUrl}${kuralNumber}`, {
            params: {
                'appid': apiKey // If the API requires it
            }
        });

        const kuralData = response.data;
        res.render('index', { kural: kuralData });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('An error occurred.');
    }
});

app.post('/kural', (req, res) => {
    const requestedKural = parseInt(req.body.kuralNumber, 10);
  
    // Validate input (make sure it's within the range 1-1330)
    if (requestedKural >= 1 && requestedKural <= 1330) {
      kuralNumber = requestedKural;
      res.redirect('/'); // Redirect to display the requested kural
    } else {
      res.redirect('/?error=invalid'); 
    }
  });
app.post('/next', async(req, res) => {
    kuralNumber = (kuralNumber % 1330) + 1; 
  res.redirect('/'); 
  });

  app.get('/random', (req, res) => {
    res.redirect('/?random=true'); 
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});