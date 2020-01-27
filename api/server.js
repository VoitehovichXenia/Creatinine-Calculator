const express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	fs = require('file-system'),
	shortId = require('shortid'),
	patientsData = 'database/patients.json',
	doctorsData = 'database/doctors.json',
	nodemailer = require('nodemailer'),
	app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/api/doctors', (req, res) => {
	res.send(getDoctorsFromDB());
});

app.post('/api/doctors', (req, res) => {
	const data = getDoctorsFromDB(),
		doctor = req.body;

	doctor.id = shortId.generate();

	data.push(doctor);
	setDoctorsToDB(data);

	res.send(doctor);
});

app.delete('/api/doctors', (req, res) => {
	setDoctorsToDB([]);
	setPatientToDB([]);

	res.sendStatus(204);
});

app.get('/api/doctor/:id', (req, res) => {
	const data = getDoctorsFromDB(),
		doctor = data.find(doctor => doctor.id === req.params.id);

	doctor ? res.send(doctor) : res.send({});

});

app.post('/api/doctor/:id', (req, res) => {
	let data = getDoctorsFromDB(),
		patientData = getPatientsFromDB(),
		doctor = data.find(doctor => doctor.id === req.params.id),
		newPatient = req.body;

	newPatient.id = shortId.generate();
	newPatient.docId = req.params.id;
	data = data.filter(doctorData => doctorData !== doctor);
	doctor.patients.push(newPatient);
	data.push(doctor);
	patientData.push(newPatient);

	setDoctorsToDB(data);
	setPatientToDB(patientData);

	res.send(newPatient);
});

app.delete('/api/doctor/:id', (req, res) => {
	const data = getDoctorsFromDB(),
		newData = data.filter(doctor => doctor.id !== req.params.id);

	setDoctorsToDB(newData);

	res.sendStatus(204);
});

app.put('/api/doctor/:id', (req, res) => {
	const data = getDoctorsFromDB(),
		newData = data.filter(doctor => doctor.id !== req.params.id),
		updatedDoctorInfo =  req.body;

	newData.push(updatedDoctorInfo);
	setDoctorsToDB(newData);

	res.sendStatus(204);
});

app.delete('/api/patient/:id', (req, res) => {
	const doctorsData = getDoctorsFromDB(),
		patientsData = getPatientsFromDB(),
		regDoctor = doctorsData.find(doctor => doctor.id === req.params.id.split('*')[1]),
		newDoctorsData = doctorsData.filter(doctor => doctor.id !== req.params.id.split('*')[1]),
		newPatientsData = patientsData.filter(patient => patient.id !== req.params.id.split('*')[0]);

	regDoctor.patients = regDoctor.patients.filter(patient => patient.id !== req.params.id.split('*')[0]);
	newDoctorsData.push(regDoctor);

	setDoctorsToDB(newDoctorsData);
	setPatientToDB(newPatientsData);

	res.sendStatus(204);
});

app.put('/api/patient/:id', (req, res) => {
	const doctorsData = getDoctorsFromDB(),
		patientsData = getPatientsFromDB(),
		updatedPatient = req.body,
		regDoctor = doctorsData.find(doctor => doctor.id === req.params.id.split('*')[1]),
		newDoctorsData = doctorsData.filter(doctor => doctor.id !== req.params.id.split('*')[1]),
		newPatientsData = patientsData.filter(patient => patient.id !== req.params.id.split('*')[0]);

	regDoctor.patients = regDoctor.patients.filter(patient => patient.id !== req.params.id.split('*')[0]);
	regDoctor.patients.push(updatedPatient);
	newDoctorsData.push(regDoctor);
	newPatientsData.push(updatedPatient);

	setDoctorsToDB(newDoctorsData);
	setPatientToDB(newPatientsData);

	res.sendStatus(204);
});

app.get('/api/patient/:id', (req, res) => {
	const data = getPatientsFromDB(),
		patient = data.find(patient => patient.id === req.params.id);

	patient ? res.send(patient) : res.send({});
});

app.get('/api/:email', (req, res) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'creatinine.calculator@gmail.com',
			pass: 'XV666666'
		}
	});
	transporter.sendMail({
		from: '"Voitehovich Xenia" <voitehovichkg@gmail.com>',
		to: req.params.email,
		subject: 'Creatinine Calculator',
		text: "Hello! I'm the creator of Creatine Calculator application and I hope you really like it. If you have some questions you can contact me on this e-mail adress.",
		html:`Hello! I'm the creator of <b>Creatine Calculator application</b> and I hope you really like it. <br>
			Click on this links to learn more about <a href="https://en.wikipedia.org/wiki/Renal_function">renal function</a> and <a href="https://en.wikipedia.org/wiki/Chronic_kidney_disease">chronic kidney disease</a>. <br>
			If you have some questions you can contact me on this e-mail adress.`,
	});
		res.sendStatus(204);
});

function getDoctorsFromDB() {
	return JSON.parse(fs.readFileSync(doctorsData, 'utf8'));
}

function getPatientsFromDB() {
	return JSON.parse(fs.readFileSync(patientsData, 'utf8'));
}

function setDoctorsToDB(data) {
	fs.writeFileSync(doctorsData, JSON.stringify(data));
}

function setPatientToDB(data) {
	fs.writeFileSync(patientsData, JSON.stringify(data));
}

app.listen(3000, () => console.log('SERVER HAS BEEN STARTED'));