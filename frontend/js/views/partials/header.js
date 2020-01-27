import Component from '../../views/component.js';

class Header extends Component {
    render() {
        const resource = this.request.resource;

        return new Promise(resolve => {
            resolve(`
                 <header class="header">                    
                     <a class="header__link ${!resource ? 'active' : ''}" href="/#/">
                         About
                     </a>
                     <a class="header__link ${resource === 'calculator' ? 'active' : ''}" href="/#/calculator">
                         Calculator
                     </a> 
                     <a class="header__link ${resource === 'doctors' ? 'active' : ''}" href="/#/doctors">
                         Doctors list
                     </a>                                                        
                </header>
            `);
        });
    }
}

export default Header;