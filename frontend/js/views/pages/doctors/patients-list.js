import Component from '../../../views/component.js';

import Error404 from '../../../views/pages/error404.js';

import Doctors from '../../../models/doctors.js';

class PatientsList extends Component {
    constructor() {
        super();

        this.model = new Doctors();
    }
	
	getData() {
		return new Promise(resolve => this.model.getDoctorInfo(this.request.id).then(doctorInfo => resolve(doctorInfo)));
	}

	
    render(doctor) {
        return new Promise(resolve => {
            let html;

			if(Object.keys(doctor).length) {
			    const {id, name, patients, post} = doctor;
				
				html = `
					<h1 class="page-title">Patients of ${name}</h1>
					<div class="doctor-info">
						<p>
							<span class="doctor-info__title">Doctor's post:</span>
							${post || 'Not mentioned'}
						</p>
					
						<div class="doctor-info__buttons">
							<a class="doctor-info__btn-back button" href="#/doctors">Back to doctors list</a>
							<a class="doctor-info__btn-edit button" href="#/doctor/${id}/edit">Edit doctor's information</a>
						</div>
					</div>	
					<div class="patient-data">
						<form class="patient-data__form">
							<div class="doctor-add__error-name"></div>
							<div class="patient-data__label">
								<label for="name">Patient's name:</label>
								<input class="patient-data__input name" type="text" id="name" placeholder="Name">
							</div>	
							<div class="patient-data__label">
								<label for="age">Patient's age:</label>
								<input type="text" id="age" class="patient-data__input age" placeholder="From 18 to 99 years">
							</div>
							<div class="patient-data__label">	
								<label>Patient's sex:</label>
								<div class="input-radio">
									<input type="radio" id="male" name="sex" class="patient-data__input male" value="male" checked>
									<label for="male">male</label>
									<input type="radio" id="female" name="sex" class="patient-data__input female" value="female">
									<label for="female">female</label>
								</div>
							</div>
							<div class="patient-data__label">	
								<label for="weight">Patient's weight, kg:</label>
								<input type="text" id="weight" class="patient-data__input weight" placeholder="From 38 to 130 kg">
							</div>
							<div class="patient-data__label">		
								<label for="height">Patient's height, cm:</label>
								<input type="text" id="height" class="patient-data__input height" placeholder="From 150 to 210 cm">
							</div>	
							<div class="patient-data__label">	
								<label for="creatinine">Patient's creatinine level, mcmol/l:</label>
								<input type="text" id="creatinine" class="patient-data__input creatinine" placeholder="From 30 to 350 mcmol/l">
							</div>							
						</form>
						<a ><button type="submit" class="patient-data__submit-btn button" disabled>Add new patient</button></a>
					</div>
						
					<div class="patients">
						<div class="patients__list" data-id="${id}">
						    ${patients.map((patient) => this.getPatientBlockHTML(patient)).join('\n ')}
                        </div>
					</div>	
				`;
			}else {
				html = new Error404().render();
			}
			resolve(html);
        });
    }

    afterRender() {
		this.setActions();
	}

	setActions() {
    	const submitBtn = document.getElementsByClassName('patient-data__submit-btn')[0],
			form = document.getElementsByClassName('patient-data__form')[0],
			name = document.getElementsByClassName('name')[0],
			age = document.getElementsByClassName('age')[0],
			weight = document.getElementsByClassName('weight')[0],
			height = document.getElementsByClassName('height')[0],
			male = document.getElementsByClassName('patient-data__input male')[0],
			female = document.getElementsByClassName('patient-data__input female')[0],
			patientsContainer = document.getElementsByClassName('patients__list')[0],
			creatinine = document.getElementsByClassName('creatinine')[0];

		form.addEventListener('keyup', event => {
			const target = event.target;
			this.formValidation(target, submitBtn, form, name, age, weight, height, creatinine);
		});

    	submitBtn.addEventListener('click', event => this.addPatientProfile(event, name, age, weight, height, male, female, creatinine, patientsContainer));
    	patientsContainer.addEventListener('click', (event) => {
    	    const target = event.target,
                targetClassList = target.classList;

    	    switch (true) {
                case targetClassList.contains('patient'):
                case targetClassList.contains('patient__title'):
                    this.redirectToPatientPage(target.dataset.pid);
                    break;

                case targetClassList.contains('patient__btn-remove'):
                    this.removePatientBlock(target.parentNode.parentNode, patientsContainer.dataset.id);
                    break;
            }
        });
	}

	addPatientProfile(event, name, age, weight, height, male, female, creatinine, patientsContainer) {
		event.preventDefault();

		let sex;
		sex = (male.checked === true) ? male : female;

		const newPatient = {
			name: name.value.trim(),
			age: +age.value,
			weight: +weight.value,
			height: +height.value,
			sex: sex.value,
			creatinine: +creatinine.value
		};

		this.model.setNewPatient(newPatient, patientsContainer.dataset.id).then((newPatient) =>
			patientsContainer.insertAdjacentHTML('beforeEnd', this.getPatientBlockHTML(newPatient))
		);
	}

	getPatientBlockHTML(patient) {
		return `
            <div class="patient" data-pid="${patient.id}">
                <a class="patient__title" data-pid="${patient.id}">${patient.name}</a>
                
                <div class="patient__buttons">
                    <a class="patient__btn-edit button" href="#/patient/${patient.id}/edit">Edit</a>
                	<a class="patient__btn-remove button">Remove</a>   
                </div>                            
            </div>
        `;
	}

	removePatientBlock(patientBlock, doctorId) {
		if (confirm('Are you sure?')) {
			this.model.removePatient(patientBlock.dataset.pid, doctorId).then(() => {
					patientBlock.remove();
			});
		}
	}

	redirectToPatientPage(patientId){
		location.hash = `#/patient/${patientId}`;
	}

	formValidation(target, submitBtn, form, name, age, weight, height, creatinine){
		const nameTemplate = /^[a-zа-я]{1,10}\s?[a-zа-я]{1,10}$/i,
			errorMessage = document.getElementsByClassName('doctor-add__error-name')[0],
			ageValue = +age.value.trim(),
			nameValue = name.value.trim(),
			weightValue = +weight.value.trim(),
			heightValue = +height.value.trim(),
			creatinineValue =+creatinine.value.trim();

		errorMessage.innerText = '';
		target.classList.remove('error');
		submitBtn.disabled = false;

		this.disableSubmitButton(submitBtn, name, age, weight, height, creatinine);

		!nameTemplate.test(nameValue) && this.setErrorActions(submitBtn, name, errorMessage);
		(!ageValue || ageValue < 18 || ageValue > 99) && this.setErrorActions(submitBtn, age, errorMessage);
		(!weightValue || weightValue < 38|| weightValue > 130) && this.setErrorActions(submitBtn, weight, errorMessage);
		(!heightValue || heightValue < 150 || heightValue > 210) && this.setErrorActions(submitBtn, height, errorMessage);
		(!creatinineValue || creatinineValue < 30|| creatinineValue > 350) && this.setErrorActions(submitBtn, creatinine, errorMessage);
	}

	disableSubmitButton(submitBtn, ...inputsCollection){
		submitBtn.disabled = !inputsCollection.every(input => input.value.trim());
		submitBtn.disabled = inputsCollection.some(input => input.classList.contains('error'));
    }

	setErrorActions(submitBtn, target, errorMessage){
		errorMessage.innerText = '';
		submitBtn.disabled = true;
		target.classList.add('error');
		errorMessage.insertAdjacentHTML('afterbegin','<span class="doctor-add__error-name">Please enter the correct information</span>');
	}
}

export default PatientsList;