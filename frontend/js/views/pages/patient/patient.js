import Component from '../../../views/component.js';

import Error404 from '../error404.js';

import Doctors from '../../../models/doctors.js';

class Patient extends Component {
    constructor() {
        super();

        this.model = new Doctors();
    }

    getData() {
        return new Promise(resolve => this.model.getPatientInfo(this.request.id).then(patient => resolve(patient)));
    }

    render(patient) {
        return new Promise(resolve => {
            let html;

            if(Object.keys(patient).length) {
                const {name, age, weight, sex, height, creatinine, docId, id} = patient,
                    [formulaCG, formulaMDRD, formulaCKDEPI] = this.calculateTheClearence(age, weight, height, sex, creatinine);

                html = `
                    <h1 class="page-title">Patient: ${name}</h1>
                    <div class="patient-info">
				        <p>
							<span class="patient-info__title">Patient's age:</span>
							${age}
						</p>
						<p>
							<span class="patient-info__title">Patient's sex:</span>
							${sex}
						</p>
						<p>
							<span class="patient-info__title">Patient's weight:</span>
							${weight} kg
						</p>
						<p>
							<span class="patient-info__title">Patient's height:</span>
							${height} cm
						</p>
						<p>
							<span class="patient-info__title">Patient's creatinine level:</span>
							${creatinine} mcmol/l
						</p>
						<p>
                            <b><span class="patient-info__title">Patient's Clearence (Cocraft-Golt formula):</span></b>
                            ${formulaCG} ml/min
                        </p>
                        <p>
                            <b><span class="patient-info__title">Patient's Clearence (MDRD formula):</span></b>
                            ${formulaMDRD} ml/min
                        </p>
                        <p>
                            <b><span class="patient-info__title">Patient's Clearence (CKD-EPI formula):</span></b>
                            ${formulaCKDEPI} ml/min
                        </p>
                        <p>
                            <b><span class="patient-info__title">Patient's degree of renal failure:</span></b>
                            <br>
                            <span class="patient-info__renal-failure">${this.defineRenalFailureDegree(formulaCKDEPI)}</span>
                        </p>

						<div class="patient-info__buttons">
							<a class="patient-info__btn-back button" href="#/doctor/${docId}">Back to doctor' page</a>
							<a class="patient-info__btn-edit button" href="#/patient/${id}/edit">Edit patient's information</a>
						</div>

						<div class="antibiotics_list"></div>
					</div>
				`;
            }else {
                html = new Error404().render();
            }
            resolve(html);
        });
    }

    calculateTheClearence(age, weight, height, sex, creatinine) {
        let formulaCocraftGold,
            formulaMDRD,
            formulaCKD_EPI,
            bodyArea,
            a = 141,
            b = 79.6,
            c = -1.209;

        if (sex === 'male'){
            formulaCocraftGold = ((140 - age)*weight)/(creatinine*0.8);
            formulaMDRD = 186.3*((creatinine/88.4)**(-1.154))*(age**(-0.203));
            c = (creatinine <= 62) ? -0.411 : c;
            formulaCKD_EPI = a*((creatinine/b)**c)*(0.993**age);
        }
        if (sex === 'female'){
            formulaCocraftGold = ((140 - age)*weight*0.85)/(creatinine*0.8);
            formulaMDRD = 186.3*((creatinine/88.4)**(-1.154))*(age**(-0.203))*0.742;
            a = 144;
            b = 61.9;
            c = (creatinine <= 62) ? -0.411 : c;
            formulaCKD_EPI = a*((creatinine/b)**c)*(0.993**age);
        }

        bodyArea = (weight**0.425)*(height**0.725)*0.007184;
        formulaCocraftGold = ((formulaCocraftGold/bodyArea)*1.73).toFixed(2);

        return [formulaCocraftGold, formulaMDRD.toFixed(2), formulaCKD_EPI.toFixed(2)];

    }

    defineRenalFailureDegree(clearence) {
        if(clearence > 90) return 'G1 - normal function';
        if(clearence < 90 && clearence >= 60) return 'G2 - mildly decreased';
        if(clearence < 60 && clearence >= 45) return 'G3a - mildly to moderately decreased';
        if(clearence < 45 && clearence >= 30) return 'G3b - moderately to severely decreased';
        if(clearence < 30 && clearence >= 15) return 'G4 - severe reduction';
        if(clearence < 15) return 'G5 - kidney failure';
    }

}

export default Patient;