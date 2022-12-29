import { LightningElement } from 'lwc';

export default class Form extends LightningElement {
    value = [];

    get options() {
        return [
            { label: 'Yes', value: 'option1' },
            { label: 'No', value: 'option2' },
        ];
    }
    

}