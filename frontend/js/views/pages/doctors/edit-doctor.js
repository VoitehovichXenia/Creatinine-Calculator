import Component from '../../../views/component.js';

import Error404 from '../../../views/pages/error404.js';

import Doctors from '../../../models/doctors.js';

class EditDoctor extends Component {
    constructor() {
        super();

        this.model = new Doctors();
    }
	
	getData() {
		return new Promise(resolve => this.model.getDoctorInfo(this.request.id).then(doctor => {
			this.doctor = doctor;
			
			resolve(doctor);
		}));
	}
	
    render(doctor) {
        return new Promise(resolve => {
            let html;

            if(Object.keys(doctor).length) {
                const {id, name, post} = doctor;
				
				html = `
					<h1 class="page-title">Doctor's profile editing</h1>
					<div class="doctor-edit">
					    <div class="doctor-add__error-name"></div>
						<p class="doctor-edit-block">
							<b>Doctor's name:</b>
							<input class="doctor-edit__name" type="text" value="${name}">
						</p>
						<p class="doctor-edit-block">
							<b>Doctor's post:</b>
							<input class="doctor-edit__post" value="${(post === 'Not mentioned') ? '' : post}">
						</p>
						<div class="doctor-edit__buttons">
							<button class="doctor-edit__btn-save button" disabled>Save information</button>
							<a class="doctor-edit__btn-back button" href="#/doctor/${id}">Back to doctor's page</a>
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
        const editDoctorName = document.getElementsByClassName('doctor-edit__name')[0],
			editDoctorPost = document.getElementsByClassName('doctor-edit__post')[0],
			saveBtn = document.getElementsByClassName('doctor-edit__btn-save')[0],
            editBlock = document.getElementsByClassName('doctor-edit')[0];
	
		editBlock.addEventListener('keyup', () => this.nameValidation(saveBtn, editDoctorName));
        saveBtn.addEventListener('click', () => this.editDoctorInfo(editDoctorName, editDoctorPost));
    }

    nameValidation(saveBtn, editDoctorName) {
        const nameTemplate = /^[A-Za-zА-Яа-я\s]{0,20}$/,
            name = editDoctorName.value.trim(),
            errorMessageName = document.getElementsByClassName('doctor-add__error-name')[0];

        errorMessageName.innerText = '';
        editDoctorName.classList.remove('input-edit-error');
        saveBtn.disabled = !editDoctorName.value.trim();

        if(!nameTemplate.test(name) || name.length < 3){
            saveBtn.disabled = true;
            editDoctorName.classList.add('input-edit-error');
            errorMessageName.insertAdjacentHTML('afterbegin', '<span class="doctor-add__error-name">Please enter the correct information</span>')
        }
    }

    editDoctorInfo(editDoctorName, editDoctorPost) {
        this.doctor.name = editDoctorName.value.trim();
        this.doctor.post = editDoctorPost.value.trim();
        this.model.editDoctorInfo(this.doctor).then(() => this.redirectToDoctorPage());
    }

    redirectToDoctorPage() {
        location.hash = `#/doctor/${this.doctor.id}`;
    }
}

export default EditDoctor;