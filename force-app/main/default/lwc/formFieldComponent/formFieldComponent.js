import { LightningElement, track, wire } from "lwc";
import getFields from "@salesforce/apex/FormFieldController.getFields";

export default class Form_Field extends LightningElement {
  @track columns = [
    { label: "Form Field Name", fieldName: "Name" },
    { label: "Label", fieldName: "Label__c" },
    { label: "IsActive", fieldName: "IsActive__c" },
    { label: "FieldType", fieldName: "FieldType__c" }
  ];
  @track accountList;

  //Method 2
  @wire(getFields) wiredAccounts({ data, error }) {
    if (data) {
      this.accountList = data;
      console.log(data);
    } else if (error) {
      console.log(error);
    }
  }
}