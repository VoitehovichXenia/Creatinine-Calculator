import Component from '../../../views/component.js';

import Error404 from '../../../views/pages/error404.js';

import Doctors from '../../../models/doctors.js';

class EditPatient extends Component {
    constructor() {
        super();

        this.model = new Doctors();
    }

    getData() {
        return new Promise(resolve => this.model.getPatientInfo(this.request.id).then(patient => {
            this.patient = patient;

            resolve(patient);
        }));
    }

    render(patient) {
        return new Promise(resolve => {
            let html;

            if(Object.keys(patient).length) {
                const {id, name, age, weight, height, creatinine, docId} = patient;

                html = `
					<h1 class="page-title">Patient information edit</h1>
					
					<div class="patient-edit">
					    <div class="doctor-add__error-name"></div>
						<p class="patient-edit-block">
							<b>Patient's name:</b>
							<input class="patient-edit__name" type="text" value="${name}">
						</p>
						<p class="patient-edit-block">
							<b>Patient's age:</b>
							<input class="patient-edit__age" value="${age}">
						</p>
						<p class="patient-edit-block">
							<b>Patient's weight:</b>
							<input class="patient-edit__weight" type="text" value="${weight}">
						</p>
						<p class="patient-edit-block">
							<b>Patient's height:</b>
							<input class="patient-edit__height" value="${height}">
						</p>
						<p class="patient-edit-block">
							<b>Patient's creatinine:</b>
							<input class="patient-edit__creatinine" value="${creatinine}">
						</p>
				
						<div class="patient-edit__buttons">
							<button class="patient-edit__btn-save button" disabled>Save information</button>
							<a class="patient-edit__btn-back button" href="#/patient/${id}">Back to patient's page</a>
							<a class="patient-edit__btn-back button" href="#/doctor/${docId}">Back to doctor's page</a>
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
        const editPatientName = document.getElementsByClassName('patient-edit__name')[0],
            editPatientAge = document.getElementsByClassName('patient-edit__age')[0],
            editPatientWeight = document.getElementsByClassName('patient-edit__weight')[0],
            editPatientHeight = document.getElementsByClassName('patient-edit__height')[0],
            editPatientCreatinine = document.getElementsByClassName('patient-edit__creatinine')[0],
            editBlock = document.getElementsByClassName('patient-edit')[0],
            editErrorMessage = document.getElementsByClassName('doctor-add__error-name')[0],
            saveBtn = document.getElementsByClassName('patient-edit__btn-save')[0];

        editBlock.addEventListener('keyup', () => this.fieldsValidation(saveBtn, editPatientName, editPatientAge, editPatientHeight, editPatientWeight, editPatientCreatinine, editErrorMessage));
        saveBtn.addEventListener('click', () => this.editPatientInfo(editPatientName, editPatientAge, editPatientHeight, editPatientWeight, editPatientCreatinine));
    }

    fieldsValidation(saveBtn, editPatientName, editPatientAge, editPatientHeight, editPatientWeight, editPatientCreatinine, editErrorMessage) {
        const nameTemplate = /^[a-zа-я]{1,10}\s?[a-zа-я]{1,10}$/i,
            age = +editPatientAge.value.trim(),
            weight = +editPatientWeight.value.trim(),
            height = +editPatientHeight.value.trim(),
            creatinine = +editPatientCreatinine.value.trim();

        for (let i = 0; i < arguments.length; i++){
            arguments[i].classList.remove('input-edit-error');
        }

        editErrorMessage.innerText = '';

        saveBtn.disabled = false;

        if(!nameTemplate.test(editPatientName.value.trim())){
            this.setErrorActions(saveBtn, editPatientName, editErrorMessage);
        }

        (age < 18 || age > 99 || !age) && this.setErrorActions(saveBtn, editPatientAge, editErrorMessage);
        (weight < 38|| weight > 130 || !weight) && this.setErrorActions(saveBtn, editPatientWeight, editErrorMessage);
        (height < 150 || height > 210 || !height) && this.setErrorActions(saveBtn, editPatientHeight, editErrorMessage);
        (creatinine < 30|| creatinine > 350 || !creatinine) && this.setErrorActions(saveBtn, editPatientCreatinine, editErrorMessage);
    }

    setErrorActions(saveBtn, field, editErrorMessage) {
        const errorMessage = editErrorMessage.innerText;

        saveBtn.disabled = true;
        field.classList.add('input-edit-error');
        if(!errorMessage){
            editErrorMessage.insertAdjacentHTML('afterbegin', '<span class="doctor-add__error-name">Please enter the correct information</span>');
        }
    }

    editPatientInfo(editPatientName, editPatientAge, editPatientHeight, editPatientWeight, editPatientCreatinine) {
        this.patient.name = editPatientName.value.trim();
        this.patient.age = editPatientAge.value.trim();
        this.patient.weight = editPatientWeight.value.trim();
        this.patient.height = editPatientHeight.value.trim();
        this.patient.creatinine = editPatientCreatinine.value.trim();
        this.model.editPatientInfo(this.patient).then(() => this.redirectToPatientPage());
    }

    redirectToPatientPage() {
        location.hash = `#/patient/${this.patient.id}`;
    }
}

export default EditPatient;