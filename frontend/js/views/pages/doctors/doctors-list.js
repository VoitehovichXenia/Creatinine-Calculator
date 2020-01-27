import Component from '../../../views/component.js';
import Doctors from '../../../models/doctors.js';

class DoctorsList extends Component {
    constructor() {
        super();

        this.model = new Doctors();
    }

    getData() {
        return new Promise(resolve => this.model.getDoctorsList().then(doctors => resolve(doctors)));
    }

    render(doctors) {
        return new Promise(resolve =>
            resolve(`
                <h1 class="page-title">List of department's doctors</h1>    
                <div class="doctor-add">
                    <form class="doctor-add__form">
                        <div class="doctor-add__error-name"></div>
                        <input id="name" class="doctor-add__input" type="text" placeholder="Doctor's name (at least 3 letters)">
                        <br>
                        <input class="doctor-add__input" type="text" placeholder="Doctor's post">
                    </form>
                    <button class="doctor-add__add-btn button" disabled>Create a profile</button>
                    <br>
                    <button class="doctors__clear-btn button" ${!doctors.length ? 'disabled' : ''}>Clear List</button>
                </div>
                 
                <div class="doctors">				
                   <div class="doctors__list">
                      ${doctors.map(doctor => this.getDoctorBlockHTML(doctor)).join('\n ')}
                   </div>   
                </div>    
            `)
        );
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const addDoctorName = document.getElementsByClassName('doctor-add__input')[0],
            addDoctorPost = document.getElementsByClassName('doctor-add__input')[1],
            addForm = document.getElementsByTagName('form')[0],
            createDoctorBtn = document.getElementsByClassName('doctor-add__add-btn')[0],
            doctorsContainer = document.getElementsByClassName('doctors')[0],
            clearDoctorsListBtn = document.getElementsByClassName('doctors__clear-btn')[0],
            doctorsList = doctorsContainer.getElementsByClassName('doctors__list')[0];


        addForm.addEventListener('keyup', (ev) => this.addDoctorValidation(addDoctorName, createDoctorBtn, addDoctorPost, ev.target));
        createDoctorBtn.addEventListener('click', () => this.addDoctorProfile(addDoctorName, addDoctorPost, createDoctorBtn, clearDoctorsListBtn, doctorsList));
        clearDoctorsListBtn.addEventListener('click', () =>  this.clearDoctorsList(doctorsList, clearDoctorsListBtn));

        doctorsContainer.addEventListener('click', event => {
            const target = event.target,
                targetClassList = target.classList;

            switch (true) {
                case targetClassList.contains('doctor'):
                case targetClassList.contains('doctor__name'):
                    this.redirectToDoctorsPage(target.dataset.id);
                    break;

                case targetClassList.contains('doctor__remove-btn'):
                    this.removeDoctorBlock(doctorsList, target.parentNode.parentNode, clearDoctorsListBtn);
                    break;

                case targetClassList.contains('doctor__edit-btn'):
                    this.redirectToEditPage(target.parentNode.parentNode);
                    break;
            }
        });
    }

    addDoctorProfile(addDoctorName, addDoctorPost, createDoctorBtn, clearDoctorsListBtn, doctorsList) {
        const newDoctor = {
            name: addDoctorName.value.trim(),
            post: addDoctorPost.value.trim(),
            patients: []
        };

        this.model.addDoctorProfile(newDoctor).then(doctor => {
            this.clearAddDoctorField(addDoctorName, addDoctorPost, createDoctorBtn);
            clearDoctorsListBtn.disabled && (clearDoctorsListBtn.disabled = false);

            doctorsList.insertAdjacentHTML('beforeEnd', this.getDoctorBlockHTML(doctor));
        });
    }

    getDoctorBlockHTML(doctor) {
        return `
            <div class="doctor" data-id="${doctor.id}">
                <a class="doctor__name" data-id="${doctor.id}">${doctor.name}</a>
                
                <div class="doctor__buttons">
                	<a class="doctor__edit-btn button">
                	    Edit
                	</a>
                	<a class="doctor__remove-btn button">
                	    Remove
                	</a>   
                </div>                            
            </div>
        `;
    }

    clearAddDoctorField(addDoctorName, addDoctorPost, createDoctorBtn) {
        addDoctorName.value = '';
        addDoctorPost.value = '';
        createDoctorBtn.disabled = true;
    }

    clearDoctorsList(doctorsList, clearDoctorsListBtn) {
        if (confirm('Are you sure you want to remove all doctor\'s information?')) {
            this.model.clearDoctorsList();
            clearDoctorsListBtn.disabled = true;
            doctorsList.innerHTML = '';

        }
    }

    redirectToDoctorsPage(id) {
        location.hash = `#/doctor/${id}`;
    }

    addDoctorValidation(addDoctorName, createDoctorBtn) {
        const nameTemplate = /^[a-zа-я\s]{0,20}$/i,
            errorMessageName = document.getElementsByClassName('doctor-add__error-name')[0];

        createDoctorBtn.disabled = !addDoctorName.value.trim();
        addDoctorName.classList.remove('input-error');
        errorMessageName.innerText = '';

        if(!addDoctorName.value.trim() || !nameTemplate.test(addDoctorName.value) || addDoctorName.value.length < 3){
            errorMessageName.insertAdjacentHTML('afterbegin', '<span class="doctor-add__error-name">Please enter the correct doctor\'s name</span>');
            addDoctorName.classList.add('input-error');
            createDoctorBtn.disabled = true;
        }
    }

    removeDoctorBlock(doctorsList, doctorsContainer, clearDoctorsListBtn) {
        if(confirm('Are you sure?')) {
            this.model.getDoctorInfo(doctorsContainer.dataset.id).then(doctor => {
                this.model.removeDoctor(doctor).then(() => {
                    doctorsContainer.remove();
                    !doctorsList.children.length && (clearDoctorsListBtn.disabled = true);
                });
            });
        }
    }

    redirectToEditPage(doctorBlock) {
        location.hash = `#/doctor/${doctorBlock.dataset.id}/edit`;
    }

}

export default DoctorsList;