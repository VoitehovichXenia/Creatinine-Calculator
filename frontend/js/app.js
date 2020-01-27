import Utils from './helpers/utils.js';

import Header from './views/partials/header.js';
import Footer from './views/partials/footer.js';

import StartPage from './views/pages/start-page.js';
import Error404 from './views/pages/error404.js';
import Calculator from './views/pages/calculator.js';

import DoctorsList from './views/pages/doctors/doctors-list.js';
import PatientsList from './views/pages/doctors/patients-list.js';
import EditDoctor from './views/pages/doctors/edit-doctor.js';


import Patient from './views/pages/patient/patient.js';
import EditPatient from './views/pages/patient/edit-patient.js';

const Routes = {
    '/': StartPage,
    '/calculator': Calculator,
    '/doctors': DoctorsList,
    '/doctor/:id': PatientsList,
    '/patient/:id': Patient,
    '/doctor/:id/edit': EditDoctor,
    '/patient/:id/edit': EditPatient,
};

function router() {
    const headerContainer = document.getElementsByClassName('header-container')[0],
          contentContainer = document.getElementsByClassName('content-container')[0],
          footerContainer = document.getElementsByClassName('footer-container')[0],
          header = new Header(),
          footer = new Footer();

    header.render().then(html => {
        headerContainer.innerHTML = html;
    });

    const request = Utils.parseRequestURL(),
        parsedURL = `/${request.resource || ''}${request.id ? '/:id' : ''}${request.action === 'edit' ? '/edit' : ''}`,
        page = Routes[parsedURL] ? new Routes[parsedURL]() : new Error404();

    try {
        page.getData().then(data => {
            page.render(data).then(html => {
                contentContainer.innerHTML = html;
                page.afterRender();
            });
        });
    }catch (e) {
       let html = new Error(e).render();
       contentContainer.innerHTML = html;
    }

    footer.render().then(html => {
        footerContainer.innerHTML = html;
        footer.afterRender();
    });
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);
