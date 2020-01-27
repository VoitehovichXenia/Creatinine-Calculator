import Component from '../../views/component.js';
import Doctors from '../../models/doctors.js';

class StartPage extends Component {
    constructor() {
        super();

        this.model = new Doctors();
    }

    render() {
        return new Promise(resolve =>
            resolve(`
                <div class="about"> 
                    <h1 class="page-title">Hello!</h1> 
                    <h1 class="page-title">It's a <span class="app-title">creatinine calculator</span> application.</h1>                   
                    <p class="about__info">It can help you with calculating the creatinine clearance of you patients, which is really important to prescribe the right dose of drugs.
                    You can choose quick calculating option or more proffessional version for hospital department usage.</p>
                    <div class="about__buttons">
                        <a class="about__btn-start button" href="#/calculator" title="Click if you want imediately calculate creatinine!">Simple calculator</a>
                        <a class="about__btn-start button" href="#/doctors" title="Click if you want more progressive usage">Pro version</a>
                    </div> 
                    <div class="e-mail">
                        <div class="doctor-add__error-name"></div>
                        <p>Please enter your email if you want to contact us</p>
                        <br>
                        <form class="e-mail__form">
                            <label for="e-mail">E-mail:</label>
                            <input class="e-mail__form input" type="text" id="e-mail">
                            <button class="e-mail__form-send-btn button" type="submit" disabled>Send</button>
                        </form>
                    </div>
                </div>  
            `)
        );
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const form = document.getElementsByClassName('e-mail')[0],
            email = form.getElementsByTagName('input')[0],
            errorMessage = document.getElementsByClassName('doctor-add__error-name')[0],
            sendBtn = document.getElementsByTagName('button')[0];

        email.addEventListener('keyup', () => this.emailValidation(email, sendBtn, errorMessage));
        email.addEventListener('blur', () => this.deleteErrorInputStyle(email, errorMessage));

        sendBtn.addEventListener('click', (event) => {
            event.preventDefault();

            this.model.sendEmail(email.value.trim()).then(() => email.value = '');
        });

    }

    emailValidation(email, sendBtn, errorMessage) {
        const emailTemplate = /^(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

        this.deleteErrorInputStyle(email, errorMessage);
        sendBtn.disabled = false;
        if(!emailTemplate.test(email.value.trim())){
            email.classList.add('error-input');
            sendBtn.disabled = true;
            errorMessage.insertAdjacentHTML('afterbegin','<span class="doctor-add__error-name">Please check the entered e-mail!</span>')
        }
    }

    deleteErrorInputStyle(email, errorMessage) {
        errorMessage.innerText = '';
        email.classList.remove('error-input');
    }
}

export default StartPage;