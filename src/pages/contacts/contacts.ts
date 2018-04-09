import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Contacts, ContactFieldType, ContactFindOptions, IContactField } from '@ionic-native/contacts';
import { DomSanitizer } from '@angular/platform-browser';

export class ContactMock {
  name: any;
  phoneNumbers: IContactField[] = [];
  constructor(public fn: string) {
    this.name = {formatted: fn};
    this.phoneNumbers.push({type:'mobile', value:'18588370136'});
  }
}

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html'
})
export class ContactsPage {
  private search: boolean = false;
  private contactList = [];
  
  constructor(public navCtrl: NavController, 
    private contacts: Contacts,
    private sanitizer: DomSanitizer,
    private platform: Platform) {
    if (!this.platform.is('cordova')) {
      this.contactList.push(new ContactMock('Tinki'));
      this.contactList.push(new ContactMock('Amish Padhya'));
      this.contactList.push(new ContactMock('Hitesh K Patel'));
      this.contactList.push(new ContactMock('Amit Kumar'));
    }
    this.findContact({target:{value:''}});

  }

  findContact(ev:any) {
    let fields:ContactFieldType[] = ['displayName','name.formatted','phoneNumbers'];

    const options = new ContactFindOptions();
    options.filter = ev.target.value;
    options.multiple = true;
    options.hasPhoneNumber = true;
    if(this.platform.is('cordova')) {
      this.contacts.find(fields, options).then((contacts) => {
        this.contactList = contacts;
        // console.log(JSON.stringify(contacts[0]));
      });
    }
   
    this.search = true;
  }

  sanitizeImage(value){
    return this.sanitizer.bypassSecurityTrustUrl(value);
   }
}
