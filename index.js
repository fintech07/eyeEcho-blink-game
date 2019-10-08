// Imports
require('dotenv').config()
const express = require('express')
var cors = require('cors')
var bodyParser = require("body-parser")
const path = require('path')
const { exec } = require('child_process');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var useragent = require('useragent');



//const fs = require('fs')
//let localization = fs.readFileSync('./public/lang/en-US.json', 'utf8')
//let localizationUS = localization
//let localizationDE = fs.readFileSync('./public/lang/de-DE.json','utf8')

// Variables
express.static.mime.types['wasm'] = 'application/wasm';
const PORT = process.env.PORT || 5000
const templateData= {
	'BACKEND_URL':process.env.BACKEND_URL,
	'FRONTEND_URL':process.env.FRONTEND_URL
}

//const templateDataDE = {...templateData,localization:localizationDE}

console.log(".env FRONTEND_URL: " + templateData.FRONTEND_URL)

console.log(".env BACKEND_URL: " + templateData.BACKEND_URL)



// Express Routes
express()
	.use(cors('*'))
	.use(express.static(path.join(__dirname, 'public')))
	//.use(express.static(path.join(__dirname, './public/vendor/face/weights')))
	//.use(express.static(path.join(__dirname, './public/vendor/face/dist')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')

	.get("/script.js",(req,res)=>res.render("../public/js/script",templateData))
	.get('/eyeEchoembed.js', (req, res) => res.render('../public/js/eyeEchoembed', templateData))
	.get('/js/vendor/BRFv4Demo.js', (req,res) => res.render('../public/js/vendor/BRFv4Demo.ejs',templateData))

	.get('/', (req, res) => res.render('pages/index', templateData))
	.get('/eyeEcho', (req, res) => res.render('pages/eyeEcho', templateData))
	.get('/banner', (req, res) => res.render('pages/banner', templateData))



	//.use(express.static(path.join(__dirname, './public/vendor/face/weights')))
	//.use(express.static(path.join(__dirname, './public/vendor/face/dist')))
	//.set('views', path.join(__dirname, 'views'))
	//.set('view engine', 'ejs')

	.get('/', (req, res) => res.render('index', templateData))
	.get('/getSpecs', (req,res)=>{
		var agent = useragent.parse(req.headers['user-agent']);
		res.send(agent);
	})
	.post('/report-error', (req,res) =>{
			if(reportToSlack){
				messageToSlack(req.body);
			}
			res.send(JSON.stringify({"status": "200","message":"slack reporting not active"}));
		})

	.listen(PORT, () => console.log(`Listening on ${ PORT }`))
