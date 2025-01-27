import axios from 'axios';
import cors from 'cors';
import 'dotenv/config'; 
import express from 'express';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


let fedExToken = null;
let tokenExpiration = null;

const getFedExToken = async () => {
    if (fedExToken && tokenExpiration > Date.now()) {
        return fedExToken;
    }

    try {
        // Set up URL-encoded form data
        const data = new URLSearchParams();
        data.append('grant_type', 'client_credentials');
        data.append('client_id', process.env.CLIENT_ID);
        data.append('client_secret', process.env.CLIENT_SECRET_KEY);

        const tokenResponse = await axios.post('https://apis.fedex.com/oauth/token', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });

        fedExToken = tokenResponse.data.access_token;
        tokenExpiration = Date.now() + (tokenResponse.data.expires_in * 1000); // Cache token until it expires
        console.log("FedEx token retrieved successfully:", fedExToken);
        return fedExToken;
    } catch (error) {
        console.error('Error obtaining FedEx token:', error.response?.data || error.message);
        throw new Error('Could not authenticate with FedEx API');
    }
};

app.post('/validate-address', async (req, res) => {
    try {
        const token = await getFedExToken();
        const response = await axios.post('https://apis.fedex.com/address/v1/addresses/resolve', req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error validating address with FedEx:', error.response?.data || error.message);
        res.status(500).send('Error validating address with FedEx');
    }
});


// app.post('/validate-address', async (req, res) => {

//     try {
//         const response = await axios.post('https://apis.fedex.com/address/v1/addresses/resolve', req.body, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${process.env.FEDEX_API_TOKEN}`
//             }
//         });
//         res.status(response.status).send(response.data);
//     } catch (error) {
//         res.status(500).send('Error validating address with FedEx');
//     }
// });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
