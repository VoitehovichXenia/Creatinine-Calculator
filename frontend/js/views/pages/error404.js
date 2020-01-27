import Component from '../../views/component.js';

class Error404 extends Component{
    constructor(error){
        super();
        this.errorName = (error) ? error.name : 'Page not found';
    }

    render() {
        return new Promise(resolve => {
            resolve(`                
                <h1 class="page-title">Sory, something went wrong:</h1> 
                <br>
                <h1 class="page-title">${this.errorName}</h1> 
                <div class="error404"> 
                    <a class="error404__button button" href="#/" title="Click if you want more progressive usage">Back to start page</a>
                </div>          
            `);
        });
    }
}

export default Error404;