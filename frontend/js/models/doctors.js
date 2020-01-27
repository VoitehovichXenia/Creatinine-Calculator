class Doctors {
    getDoctorsList() {
    	return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('GET', 'http://localhost:3000/api/doctors', true);

			xhr.onload = () => {

				try {
                    resolve(JSON.parse(xhr.response));
                } catch (e) {
					alert('Oops... Something went wrong');
                }
			};

			xhr.send();
		});
    }

    clearDoctorsList() {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('DELETE', 'http://localhost:3000/api/doctors', true);

			xhr.onload = () => resolve();

			xhr.send();
		});
	}

	addDoctorProfile(newTask) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('POST', 'http://localhost:3000/api/doctors', true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => {

                try {
                    resolve(JSON.parse(xhr.response));
                } catch (e) {
                    alert('Oops... Something went wrong');
                }
            };

			xhr.send(JSON.stringify(newTask));
		});
	}

	getDoctorInfo(id) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('GET', `http://localhost:3000/api/doctor/${id}`, true);

			xhr.onload = () => {

                try {
                    resolve(JSON.parse(xhr.response));
                } catch (e) {
                    alert('Oops... Something went wrong');
                }
            };

			xhr.send();
		});
	}

    getPatientInfo(patientId) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', `http://localhost:3000/api/patient/${patientId}`, true);

            xhr.onload = () => {

                try {
                    resolve(JSON.parse(xhr.response));
                } catch (e) {
                    alert('Oops... Something went wrong');
                }
            };

            xhr.send();
        });
    }


	setNewPatient(patientData, id){
    	return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('POST', `http://localhost:3000/api/doctor/${id}`, true);
			xhr.setRequestHeader('Content-Type','application/json');

			xhr.onload = () => {

                try {
                    resolve(JSON.parse(xhr.response));
                } catch (e) {
                    alert('Oops... Something went wrong');
                }
            };

			xhr.send(JSON.stringify(patientData));
		});
	}


	editDoctorInfo(updatedDoctor) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('PUT', `http://localhost:3000/api/doctor/${updatedDoctor.id}`, true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve();

			xhr.send(JSON.stringify(updatedDoctor));
		});
	}

	editPatientInfo(updatedPatient) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('PUT', `http://localhost:3000/api/patient/${updatedPatient.id}*${updatedPatient.docId}`, true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve();

			xhr.send(JSON.stringify(updatedPatient));
		});
	}

	removeDoctor(doctor){
    	return new Promise ( resolve => {
    		const xhr = new XMLHttpRequest();

    		xhr.open('DELETE', `http://localhost:3000/api/doctor/${doctor.id}`, true);

    		xhr.onload = () => resolve();

			xhr.send();
		});
	}

	removePatient(patientId, doctorId){
		return new Promise ( resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('DELETE', `http://localhost:3000/api/patient/${patientId}*${doctorId}`, true);

			xhr.onload = () => resolve();

			xhr.send();
		});
	}

	sendEmail(email){
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('GET', `http://localhost:3000/api/${email}`, true);

			xhr.onloadend = () => resolve();

			xhr.send();
		});
	}

}

export default Doctors;