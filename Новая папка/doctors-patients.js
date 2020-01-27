const express = require('express'),
    router = express.Router(),
    config = require('config'),
    fs = require('file-system'),
    shortId = require('shortid');

router.get('/api/doctors', (req, res) => {
    res.send(getDoctorsFromDB());
});

router.post('/api/doctors', (req, res) => {
    const data = getDoctorsFromDB(),
        doctor = req.body;

    doctor.id = shortId.generate();

    data.push(doctor);
    setDoctorsToDB(data);

    res.send(doctor);
});

router.delete('/api/doctors', (req, res) => {
    setDoctorsToDB([]);
    setPatientToDB([]);

    res.sendStatus(204);
});

router.get('/api/doctor/:id', (req, res) => {
    const data = getDoctorsFromDB(),
        doctor = data.find(doctor => doctor.id === req.params.id);

    doctor ? res.send(doctor) : res.send({});

});

router.post('/api/doctor/:id', (req, res) => {
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

router.delete('/api/doctor/:id', (req, res) => {
    const data = getDoctorsFromDB(),
        newData = data.filter(doctor => doctor.id !== req.params.id);

    setDoctorsToDB(newData);

    res.sendStatus(204);
});

router.put('/api/doctor/:id', (req, res) => {
    const data = getDoctorsFromDB(),
        newData = data.filter(doctor => doctor.id !== req.params.id),
        updatedDoctorInfo =  req.body;

    newData.push(updatedDoctorInfo);
    setDoctorsToDB(newData);

    res.sendStatus(204);
});

router.delete('/api/patient/:id', (req, res) => {
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

router.put('/api/patient/:id', (req, res) => {
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

router.get('/api/patient/:id', (req, res) => {
    const data = getPatientsFromDB(),
        patient = data.find(patient => patient.id === req.params.id);

    patient ? res.send(patient) : res.send({});
});

function getDoctorsFromDB() {
    return JSON.parse(fs.readFileSync(config.get('database.doctors'), 'utf8'));
}

function getPatientsFromDB() {
    return JSON.parse(fs.readFileSync(config.get('database.patients'), 'utf8'));
}

function setDoctorsToDB(data) {
    fs.writeFileSync(config.get('database.doctors'), JSON.stringify(data));
}

function setPatientToDB(data) {
    fs.writeFileSync(config.get('database.patients'), JSON.stringify(data));
}

app.listen(3000, () => console.log('SERVER HAS BEEN STARTED'));