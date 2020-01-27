import Component from '../component.js';

class Calculator extends Component {
   render() {
       return new Promise(resolve =>
           resolve(`
               <h1 class="page-title">Please enter tre required information in the form below</h1>
			   <div class="patient-data">
					<form class="patient-data__form">
						<div class="doctor-add__error-name"></div>
						<div class="patient-data__label">
							<label for="age">Patient's age:</label>
							<input type="text" id="age" class="patient-data__input age" placeholder="From 18 to 99">
						</div>
						<div class="patient-data__label">	
							<label for="sex">Patient's sex:</label>
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
					<a><button type="submit" class="patient-data__submit-btn button" disabled>Calculate</button></a>
					<div class="calculator__buttons">
					    <a class="calculator__buttons button" href="#/">Back to start page</a>
                    </div>
					</div>
						
					<div class="patient-info"></div>
           `)
       );
   }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const submitBtn = document.getElementsByClassName('patient-data__submit-btn')[0],
            form = document.getElementsByClassName('patient-data__form')[0],
            age = document.getElementsByClassName('age')[0],
            weight = document.getElementsByClassName('weight')[0],
            height = document.getElementsByClassName('height')[0],
            male = document.getElementsByClassName('male')[0],
            female = document.getElementsByClassName('female')[0],
            patientInfo = document.getElementsByClassName('patient-info')[0],
            creatinine = document.getElementsByClassName('creatinine')[0];

        form.addEventListener('keyup', (event) => {
            const target = event.target;

            this.formValidation(target, submitBtn, form, age, weight, height, creatinine);

        });

        submitBtn.addEventListener('click', event => {
            event.preventDefault();
            patientInfo.innerHTML = '';

            let sex;
            sex = (male.checked === true) ? male : female;

            const [formulaCG, formulaMDRD, formulaCKDEPI] = this.calculateTheClearence(+age.value.trim(), +weight.value.trim(), +height.value.trim(), sex.value, +creatinine.value.trim());
            patientInfo.insertAdjacentHTML('afterbegin', `${this.getPatientResultsHTML(formulaCG, formulaMDRD, formulaCKDEPI)}`);
            this.clearForm(submitBtn, age, weight, height, creatinine);
        });
    }

    getPatientResultsHTML(formulaCG, formulaMDRD, formulaCKDEPI) {
       if(formulaCG === 'Calculation Error'){
           return formulaCG;
       }
        return `
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
               <span class="patient-info__renal-failure">${this.defineRenalFailureDegree(formulaCKDEPI)}</span>
            </p>`;
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

    defineRenalFailureDegree(clearence){
        if(clearence > 90) return 'G1 - normal function';
        if(clearence < 90 && clearence >= 60) return 'G2 - mildly decreased';
        if(clearence < 60 && clearence >= 45) return 'G3a - mildly to moderately decreased';
        if(clearence < 45 && clearence >= 30) return 'G3b - moderately to severely decreased';
        if(clearence < 30 && clearence >= 15) return 'G4 - severe reduction';
        if(clearence < 15) return 'G5 - kidney failure';
    }

    formValidation(target, submitBtn, form, age, weight, height, creatinine){
        const ageValue = +age.value.trim(),
            weightValue = +weight.value.trim(),
            heightValue = +height.value.trim(),
            creatinineValue =+creatinine.value.trim(),
            errorMessage = form.getElementsByClassName('doctor-add__error-name')[0];

        errorMessage.innerText = '';
        target.classList.remove('error');
        submitBtn.disabled = false;
        this.disableSubmitButton(submitBtn, age, weight, height, creatinine);

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

    clearForm(submitBtn, ...inputsCollection){
        submitBtn.disabled = true;
        inputsCollection.map(input => input.value = '');
    }
}

export default Calculator;